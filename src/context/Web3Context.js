import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if MetaMask is installed
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);

            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setIsConnected(true);
                    }
                })
                .catch(err => {
                    console.error('Error checking accounts:', err);
                    setError('Failed to check accounts');
                });

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                } else {
                    setAccount(null);
                    setIsConnected(false);
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            return () => {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            };
        } else {
            setError('MetaMask is not installed');
        }
    }, []);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            setIsConnected(true);
            setError(null);
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError(err.message);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsConnected(false);
    };

    return (
        <Web3Context.Provider value={{
            account,
            provider,
            isConnected,
            error,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}; 