import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Updated imports for Heroicons v2
import { 
    BellIcon, 
    UserCircleIcon, 
    ChartBarIcon, 
    GlobeAltIcon,
    MagnifyingGlassIcon, // Changed from SearchIcon
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import Auctions from './Auctions';

const Home = ({ onLogout }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('auctions');
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'auctions':
                return <Auctions />;
            case 'profile':
                return <div>Profile Content</div>;
            case 'governance':
                return <div>Governance Content</div>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                                TENI DeFi
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-lg mx-8">
                            <div className="relative">
                                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search auctions, proposals..."
                                    className="w-full bg-gray-700 bg-opacity-50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-600"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Disconnect Wallet
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <nav className="flex space-x-8 -mb-px">
                        {[
                            { name: 'auctions', icon: GlobeAltIcon, label: 'Auctions' },
                            { name: 'profile', icon: UserCircleIcon, label: 'User Profile' },
                            { name: 'governance', icon: ChartBarIcon, label: 'Governance' },
                        ].map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors duration-200 ${
                                    activeTab === tab.name
                                        ? 'border-purple-500 text-purple-500'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default Home;