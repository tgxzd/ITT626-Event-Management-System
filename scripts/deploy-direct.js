const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
    // Connect to Sepolia network
    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/8e2ef241364d4263b0511548fbd476d0");
    const privateKey = "4c847eb1c92835d010f8de534dd2cc0fba32279611b9212c822820d9e47c1872";
    const wallet = new ethers.Wallet(privateKey, provider);

    // Read the contract source
    const contractPath = path.join(__dirname, '../resources/js/contracts/EventPayment.sol');
    const source = fs.readFileSync(contractPath, 'utf8');
    
    console.log('Compiling contract...');
    const solc = require('solc');
    
    const input = {
        language: 'Solidity',
        sources: {
            'EventPayment.sol': {
                content: source
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contract = output.contracts['EventPayment.sol']['EventPayment'];

    // Deploy the contract
    console.log('Deploying contract...');
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;
    
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await factory.deploy();
    
    console.log('Contract deployed to:', deployedContract.address);
    
    // Update the contract address in eventPaymentContract.js
    const contractJsPath = path.join(__dirname, '../resources/js/contracts/eventPaymentContract.js');
    let contractJs = fs.readFileSync(contractJsPath, 'utf8');
    contractJs = contractJs.replace(
        "const contractAddress = '';",
        `const contractAddress = '${deployedContract.address}';`
    );
    fs.writeFileSync(contractJsPath, contractJs);
    
    console.log('Contract address updated in eventPaymentContract.js');
} 