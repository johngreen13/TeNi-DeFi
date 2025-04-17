import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const Login = () => {
    const navigate = useNavigate();
    const { isConnected } = useAccount();
    const { connect, connectors, isLoading, pendingConnector } = useConnect();
    const [error, setError] = useState('');

    // Redirect to home if already connected
    React.useEffect(() => {
        if (isConnected) {
            navigate('/home');
        }
    }, [isConnected, navigate]);

    const handleConnect = async (connector) => {
        try {
            setError('');
            await connect({ connector });
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError('Failed to connect wallet. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">TeNi-DeFi</h1>
                    <p className="text-gray-400">Connect your wallet to get started</p>
                </div>
                
                <div className="space-y-4">
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => handleConnect(connector)}
                            disabled={!connector.ready}
                            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-lg font-medium transition-colors"
                        >
                            {connector.id === 'metaMask' ? (
                                <>
                                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.5 0H3.5C1.57 0 0 1.57 0 3.5v17C0 22.43 1.57 24 3.5 24h17c1.93 0 3.5-1.57 3.5-3.5v-17C24 1.57 22.43 0 20.5 0zM12 4.5c4.14 0 7.5 3.36 7.5 7.5s-3.36 7.5-7.5 7.5S4.5 16.14 4.5 12s3.36-7.5 7.5-7.5z" />
                                    </svg>
                                    MetaMask
                                </>
                            ) : (
                                'Connect Wallet'
                            )}
                            {isLoading && connector.id === pendingConnector?.id && ' (connecting...)'}
                        </button>
                    ))}
                </div>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}
                
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>By connecting, you agree to TeNi-DeFi's Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default Login;