import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

export default function WalletConnect() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const web3Modal = new Web3Modal({
        network: 'sepolia',
        cacheProvider: true,
        providerOptions: {}
    });

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet();
        }
    }, []);

    const connectWallet = async () => {
        try {
            setLoading(true);
            setError('');

            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error('Please install MetaMask to connect your wallet');
            }

            // Get the provider
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            setProvider(provider);

            // Get the signer and address
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);

            // Switch to Sepolia network if not already on it
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }], // Chain ID for Sepolia
                });
            } catch (switchError) {
                // If the network doesn't exist, add it
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xaa36a7',
                                chainName: 'Sepolia Test Network',
                                nativeCurrency: {
                                    name: 'SepoliaETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                rpcUrls: ['https://sepolia.infura.io/v3/'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io']
                            }]
                        });
                    } catch (addError) {
                        throw new Error('Failed to add Sepolia network');
                    }
                } else {
                    throw switchError;
                }
            }

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount('');
                    setProvider(null);
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

        } catch (error) {
            console.error('Wallet connection error:', error);
            setError(error.message || 'Failed to connect wallet');
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = async () => {
        try {
            await web3Modal.clearCachedProvider();
            setAccount('');
            setProvider(null);
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        }
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div>
            {error && (
                <div className="mb-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
            
            {account ? (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Connected: {formatAddress(account)}
                    </span>
                    <button
                        onClick={disconnectWallet}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            )}
        </div>
    );
} 