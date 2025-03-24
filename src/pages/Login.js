import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleMetaMaskLogin = async () => {
        try {
            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed. Please install MetaMask to use this app.');
            }

            // Request account access
            console.log("Requesting MetaMask accounts...");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Accounts received:", accounts);

            // If successful, navigate to the home page
            if (accounts && accounts.length > 0) {
                console.log('Logged in with MetaMask account:', accounts[0]);
                console.log('Navigating to /home...');
                navigate('/home'); // Redirect to the home page
            } else {
                throw new Error('No accounts found. Please connect your MetaMask wallet.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to TeNI DeFi</h1>
            <h2 classsName="text-4xl font-bold mb-6">Connect your wallet to get started</h2>
            <button
                onClick={handleMetaMaskLogin}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
            >
                Connect wallet
            </button>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
    );
};

export default Login;