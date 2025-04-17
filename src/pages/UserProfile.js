import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { FaEthereum, FaUser, FaHistory, FaTrophy, FaCog } from 'react-icons/fa';

const UserProfile = () => {
    const { account } = useWeb3();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock user data
    const userData = {
        username: 'CryptoTrader',
        joinDate: '2024-01-15',
        reputation: 4.8,
        totalAuctions: 12,
        totalBids: 45,
        totalWins: 8,
        totalSpent: 3.2,
        walletBalance: 5.7,
        recentActivity: [
            { type: 'bid', amount: '0.5 ETH', auction: 'Rare NFT #123', time: '2 hours ago' },
            { type: 'win', amount: '1.2 ETH', auction: 'Vintage Watch', time: '1 day ago' },
            { type: 'create', auction: 'Digital Art Collection', time: '2 days ago' }
        ],
        preferences: {
            notifications: true,
            darkMode: true,
            currency: 'ETH'
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
                                <div className="flex items-center">
                                    <FaEthereum className="text-purple-500 mr-2" />
                                    <span className="text-2xl font-bold">{userData.walletBalance} ETH</span>
                                </div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Reputation Score</h3>
                                <div className="flex items-center">
                                    <FaUser className="text-yellow-500 mr-2" />
                                    <span className="text-2xl font-bold">{userData.reputation}/5.0</span>
                                </div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Member Since</h3>
                                <div className="text-xl">{userData.joinDate}</div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {userData.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            {activity.type === 'bid' && <FaHistory className="text-blue-500 mr-2" />}
                                            {activity.type === 'win' && <FaTrophy className="text-yellow-500 mr-2" />}
                                            {activity.type === 'create' && <FaCog className="text-green-500 mr-2" />}
                                            <span>{activity.auction}</span>
                                        </div>
                                        <div className="text-gray-400">{activity.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'auctions':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Total Auctions</h3>
                                <div className="text-2xl font-bold">{userData.totalAuctions}</div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Total Bids</h3>
                                <div className="text-2xl font-bold">{userData.totalBids}</div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Auctions Won</h3>
                                <div className="text-2xl font-bold">{userData.totalWins}</div>
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Email Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={userData.preferences.notifications} />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Dark Mode</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={userData.preferences.darkMode} />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Preferred Currency</span>
                                    <select className="bg-gray-700 text-white rounded px-3 py-1">
                                        <option value="ETH">ETH</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-gray-400 mt-2">Manage your profile and preferences</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold">{userData.username[0]}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{userData.username}</h2>
                            <p className="text-gray-400">Wallet: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('auctions')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'auctions' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        Auctions
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'settings' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        Settings
                    </button>
                </div>

                {renderTabContent()}
            </div>
        </div>
    );
};

export default UserProfile;