import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import solc from 'solc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('Compiling contract...');
    
    // Read the contract source code
    const contractPath = path.join(__dirname, '../resources/js/contracts/EventPayment.sol');
    const source = fs.readFileSync(contractPath, 'utf8');
    
    // Compile the contract
    const input = {
        language: 'Solidity',
        sources: {
            'EventPayment.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contract = output.contracts['EventPayment.sol']['EventPayment'];

    // Connect to the network
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/8e2ef241364d4263b0511548fbd476d0');
    const wallet = new ethers.Wallet('4c847eb1c92835d010f8de534dd2cc0fba32279611b9212c822820d9e47c1872', provider);

    console.log('Deploying contract...');

    // Create contract factory with lower gas price
    const factory = new ethers.ContractFactory(contract.abi, contract.evm.bytecode, wallet);
    const deploymentTx = await factory.getDeployTransaction();

    // Set a lower gas price (50 Gwei)
    const gasPrice = ethers.utils.parseUnits('50', 'gwei');
    deploymentTx.gasPrice = gasPrice;

    // Estimate gas and add some buffer
    const estimatedGas = await provider.estimateGas(deploymentTx);
    deploymentTx.gasLimit = estimatedGas.mul(120).div(100); // Add 20% buffer

    // Deploy with modified gas settings
    const deployedContract = await wallet.sendTransaction(deploymentTx);
    const receipt = await deployedContract.wait();
    
    const contractAddress = receipt.contractAddress;
    console.log('Contract deployed to:', contractAddress);

    // Update the contract info file
    const contractInfo = {
        address: contractAddress,
        abi: contract.abi
    };

    const contractInfoPath = path.join(__dirname, '../resources/js/contracts/eventPaymentContract.js');
    fs.writeFileSync(
        contractInfoPath,
        `export const contractAddress = '${contractInfo.address}';\nexport const contractABI = ${JSON.stringify(contract.abi, null, 2)};`
    );

    console.log('Contract information updated in:', contractInfoPath);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 