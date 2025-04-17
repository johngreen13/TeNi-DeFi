import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { FaHome, FaUser, FaChartBar, FaGavel, FaPlus } from 'react-icons/fa';

const Navbar = () => {
    const { connectWallet, disconnectWallet, isConnected } = useWeb3();

    const handleDisconnect = () => {
        try {
            disconnectWallet();
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        }
    };

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-white text-xl font-bold">
                                TeNi DeFi
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                            >
                                <FaHome className="mr-1" /> Home
                            </Link>
                            <Link
                                to="/auctions"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                            >
                                <FaGavel className="mr-1" /> Auctions
                            </Link>
                            {isConnected && (
                                <>
                                    <Link
                                        to="/auctions/create"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <FaPlus className="mr-1" /> Create Auction
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <FaUser className="mr-1" /> Profile
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <FaChartBar className="mr-1" /> Dashboard
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {isConnected ? (
                            <button
                                onClick={handleDisconnect}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Disconnect
                            </button>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 