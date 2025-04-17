import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { 
    FaChartBar, 
    FaDollarSign, 
    FaClock, 
    FaUser,
    FaTrophy,
    FaFire,
    FaHistory
} from 'react-icons/fa';

const Dashboard = () => {
    const { account, provider } = useWeb3();
    const [stats, setStats] = useState({
        activeAuctions: 0,
        totalBids: 0,
        totalValue: 0,
        wonAuctions: 0,
        activeBids: 0,
        totalSpent: 0,
        successRate: 0,
        averageBid: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            if (!account || !provider) return;
            
            try {
                // Mock data for dashboard stats
                setStats({
                    activeAuctions: 5,
                    totalBids: 12,
                    totalValue: 2.5,
                    wonAuctions: 3,
                    activeBids: 4,
                    totalSpent: 1.8,
                    successRate: 75,
                    averageBid: 0.15
                });

                // Mock recent activity data
                setRecentActivity([
                    {
                        type: 'bid',
                        auction: 'Rare NFT #123',
                        amount: '0.5 ETH',
                        time: '2 hours ago',
                        status: 'active'
                    },
                    {
                        type: 'win',
                        auction: 'Vintage Watch',
                        amount: '1.2 ETH',
                        time: '1 day ago',
                        status: 'completed'
                    },
                    {
                        type: 'outbid',
                        auction: 'Digital Art Collection',
                        amount: '0.8 ETH',
                        time: '2 days ago',
                        status: 'completed'
                    }
                ]);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [account, provider]);

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div className={`bg-gray-800 rounded-lg p-6 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    const ActivityItem = ({ activity }) => (
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
                {activity.type === 'bid' && <FaDollarSign className="text-blue-500" />}
                {activity.type === 'win' && <FaTrophy className="text-yellow-500" />}
                {activity.type === 'outbid' && <FaFire className="text-red-500" />}
                <div>
                    <p className="font-medium">{activity.auction}</p>
                    <p className="text-sm text-gray-400">{activity.amount}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-400">{activity.time}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'active' ? 'bg-green-500 bg-opacity-20 text-green-500' : 'bg-gray-500 bg-opacity-20 text-gray-500'
                }`}>
                    {activity.status}
                </span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-2">Overview of your auction activity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Active Auctions"
                        value={stats.activeAuctions}
                        icon={FaChartBar}
                        color="hover:bg-gray-700 transition-colors"
                        subtitle="Participating in"
                    />
                    <StatCard
                        title="Total Bids"
                        value={stats.totalBids}
                        icon={FaDollarSign}
                        color="hover:bg-gray-700 transition-colors"
                        subtitle="All time"
                    />
                    <StatCard
                        title="Total Value"
                        value={`${stats.totalValue} ETH`}
                        icon={FaClock}
                        color="hover:bg-gray-700 transition-colors"
                        subtitle="In active auctions"
                    />
                    <StatCard
                        title="Success Rate"
                        value={`${stats.successRate}%`}
                        icon={FaUser}
                        color="hover:bg-gray-700 transition-colors"
                        subtitle="Auction wins"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <ActivityItem key={index} activity={activity} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Active Bids</span>
                                <span className="font-medium">{stats.activeBids}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Spent</span>
                                <span className="font-medium">{stats.totalSpent} ETH</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Average Bid</span>
                                <span className="font-medium">{stats.averageBid} ETH</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Auctions Won</span>
                                <span className="font-medium">{stats.wonAuctions}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 