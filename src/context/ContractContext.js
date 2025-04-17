import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuctionFactory from '../contracts/artifacts/contracts/AuctionFactory.sol/AuctionFactory.json';
import addresses from '../contracts/addresses.json';

const ContractContext = createContext();

export const useContract = () => {
    const context = useContext(ContractContext);
    if (!context) {
        throw new Error('useContract must be used within a ContractProvider');
    }
    return context;
};

export const ContractProvider = ({ children }) => {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeContract = async () => {
            try {
                if (typeof window.ethereum !== 'undefined') {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    
                    // Create provider and signer
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = await provider.getSigner();
                    
                    const contractAddress = addresses.AuctionFactory;
                    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
                        throw new Error('Contract address not found in addresses.json or is set to zero address. Please deploy the contract first and update the address.');
                    }

                    // Create contract instance
                    const contractInstance = new ethers.Contract(
                        contractAddress,
                        AuctionFactory.abi,
                        signer
                    );

                    // Verify contract is deployed
                    const code = await provider.getCode(contractAddress);
                    if (code === '0x') {
                        throw new Error('Contract is not deployed at the specified address');
                    }

                    setContract(contractInstance);
                    setLoading(false);
                } else {
                    throw new Error('Please install MetaMask or another Web3 wallet to use this application');
                }
            } catch (error) {
                console.error('Error initializing contract:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        initializeContract();
    }, []);

    return (
        <ContractContext.Provider value={{ contract, loading, error }}>
            {children}
        </ContractContext.Provider>
    );
}; 