import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [account, setAccount] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const walletAddress = accounts[0];
                setAccount(walletAddress);
                onLogin(walletAddress);

                // Navigate to the home page after login
                navigate('/home');
            } catch (error) {
                console.error('Error connecting wallet:', error);
            }
        } else {
            alert('MetaMask is not installed. Please install MetaMask to use this app.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to TENI DeFi</h1>
            <p className="text-lg text-gray-400 mb-8">Connect your wallet to get started.</p>
            {account ? (
                <p className="text-green-500 font-bold">Connected: {account}</p>
            ) : (
                <button
                    onClick={connectWallet}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default Login;