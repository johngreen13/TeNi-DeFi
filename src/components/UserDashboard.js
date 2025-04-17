import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useContractEvent, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import UserABI from '../contracts/User.json';
import AuctionFactoryABI from '../contracts/AuctionFactory.json';

const UserDashboard = () => {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        auctionsCreated: 0,
        bidsSubmitted: 0,
        bidsWon: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [analytics, setAnalytics] = useState({
        monthlyActivity: Array(12).fill(0),
        successRate: 0,
        averageBidAmount: 0
    });

    const userContract = useContractRead({
        address: process.env.REACT_APP_USER_CONTRACT_ADDRESS,
        abi: UserABI,
        functionName: 'getUserProfile',
        args: [address],
        enabled: !!address && !!process.env.REACT_APP_USER_CONTRACT_ADDRESS && process.env.REACT_APP_USER_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
    });

    const auctionFactoryContract = useContractRead({
        address: process.env.REACT_APP_AUCTION_FACTORY_ADDRESS,
        abi: AuctionFactoryABI,
        functionName: 'getUserProfile',
        args: [address],
        enabled: !!address && !!process.env.REACT_APP_AUCTION_FACTORY_ADDRESS
    });

    const { writeAsync: createUser } = useContractWrite({
        address: process.env.REACT_APP_USER_CONTRACT_ADDRESS,
        abi: UserABI,
        functionName: 'createUser'
    });

    useEffect(() => {
        if (address && userContract && auctionFactoryContract) {
            fetchUserStats();
            fetchTransactionHistory();
            fetchAnalytics();
        } else if (process.env.REACT_APP_USER_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
            setError('UserContract address is not set. Please update the .env file with the correct address.');
            setLoading(false);
        }
    }, [address, userContract, auctionFactoryContract]);

    // Event listener for BidPlaced events
    useContractEvent({
        address: process.env.REACT_APP_AUCTION_FACTORY_ADDRESS,
        abi: AuctionFactoryABI,
        eventName: 'BidPlaced',
        listener(event) {
            try {
                const bidder = event.args.bidder || event.args[0];
                if (bidder && address && bidder.toLowerCase() === address.toLowerCase()) {
                    // Update stats
                    setStats(prev => ({
                        ...prev,
                        bidsSubmitted: prev.bidsSubmitted + 1
                    }));

                    // Update transactions
                    setTransactions(prev => {
                        const newTransaction = {
                            type: 'Bid',
                            auctionId: event.args.auctionId.toString(),
                            amount: ethers.utils.formatEther(event.args.amount),
                            timestamp: new Date().toLocaleString()
                        };
                        return [newTransaction, ...prev];
                    });

                    // Update analytics
                    setAnalytics(prev => {
                        const newMonthlyActivity = [...prev.monthlyActivity];
                        const currentMonth = new Date().getMonth();
                        newMonthlyActivity[currentMonth]++;
                        
                        const newBidAmount = parseFloat(ethers.utils.formatEther(event.args.amount));
                        const newAverageBidAmount = ((prev.averageBidAmount * prev.bidsSubmitted) + newBidAmount) / (prev.bidsSubmitted + 1);
                        
                        return {
                            ...prev,
                            monthlyActivity: newMonthlyActivity,
                            averageBidAmount: newAverageBidAmount
                        };
                    });
                }
            } catch (error) {
                console.error('Error processing BidPlaced event:', error);
                setError('Failed to process new bid event');
            }
        },
        enabled: !!address && !!process.env.REACT_APP_AUCTION_FACTORY_ADDRESS && process.env.REACT_APP_AUCTION_FACTORY_ADDRESS !== '0x0000000000000000000000000000000000000000'
    });

    // Event listener for AuctionWon events
    useContractEvent({
        address: process.env.REACT_APP_AUCTION_FACTORY_ADDRESS,
        abi: AuctionFactoryABI,
        eventName: 'AuctionWon',
        listener(event) {
            try {
                const winner = event.args.winner || event.args[0];
                if (winner && address && winner.toLowerCase() === address.toLowerCase()) {
                    // Update stats
                    setStats(prev => ({
                        ...prev,
                        bidsWon: prev.bidsWon + 1
                    }));

                    // Update analytics
                    setAnalytics(prev => {
                        const successRate = prev.bidsSubmitted > 0 
                            ? ((prev.bidsWon + 1) / prev.bidsSubmitted) * 100 
                            : 0;
                        return {
                            ...prev,
                            successRate
                        };
                    });
                }
            } catch (error) {
                console.error('Error processing AuctionWon event:', error);
                setError('Failed to process auction won event');
            }
        },
        enabled: !!address && !!process.env.REACT_APP_AUCTION_FACTORY_ADDRESS && process.env.REACT_APP_AUCTION_FACTORY_ADDRESS !== '0x0000000000000000000000000000000000000000'
    });

    // Event listener for AuctionCreated events
    useContractEvent({
        address: process.env.REACT_APP_AUCTION_FACTORY_ADDRESS,
        abi: AuctionFactoryABI,
        eventName: 'AuctionCreated',
        listener(event) {
            try {
                const creator = event.args.creator || event.args[0];
                if (creator && address && creator.toLowerCase() === address.toLowerCase()) {
                    // Update stats
                    setStats(prev => ({
                        ...prev,
                        auctionsCreated: prev.auctionsCreated + 1
                    }));
                }
            } catch (error) {
                console.error('Error processing AuctionCreated event:', error);
                setError('Failed to process auction created event');
            }
        },
        enabled: !!address && !!process.env.REACT_APP_AUCTION_FACTORY_ADDRESS && process.env.REACT_APP_AUCTION_FACTORY_ADDRESS !== '0x0000000000000000000000000000000000000000'
    });

    const fetchUserStats = async () => {
        try {
            const createdAuctions = await userContract.getUserCreatedAuctions(address);
            const purchases = await userContract.getUserPurchases(address);
            
            const bidFilter = auctionFactoryContract.filters.BidPlaced(null, address);
            const bidEvents = await auctionFactoryContract.queryFilter(bidFilter);
            
            setStats({
                auctionsCreated: createdAuctions.length,
                bidsSubmitted: bidEvents.length,
                bidsWon: purchases.length
            });
        } catch (err) {
            console.error('Error fetching user stats:', err);
            setError('Failed to fetch user statistics');
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactionHistory = async () => {
        try {
            const bidFilter = auctionFactoryContract.filters.BidPlaced(null, address);
            const bidEvents = await auctionFactoryContract.queryFilter(bidFilter);
            
            const transactions = bidEvents.map(event => ({
                type: 'Bid',
                auctionId: event.args.auctionId,
                amount: ethers.utils.formatEther(event.args.amount),
                timestamp: new Date(event.blockTimestamp * 1000).toLocaleString()
            }));

            setTransactions(transactions);
        } catch (err) {
            console.error('Error fetching transaction history:', err);
            setError('Failed to fetch transaction history');
        }
    };

    const fetchAnalytics = async () => {
        try {
            const bidFilter = auctionFactoryContract.filters.BidPlaced(null, address);
            const bidEvents = await auctionFactoryContract.queryFilter(bidFilter);
            
            const monthlyActivity = Array(12).fill(0);
            bidEvents.forEach(event => {
                const month = new Date(event.blockTimestamp * 1000).getMonth();
                monthlyActivity[month]++;
            });

            const purchases = await userContract.getUserPurchases(address);
            const successRate = bidEvents.length > 0 
                ? (purchases.length / bidEvents.length) * 100 
                : 0;

            const totalBidAmount = bidEvents.reduce((sum, event) => 
                sum + parseFloat(ethers.utils.formatEther(event.args.amount)), 0);
            const averageBidAmount = bidEvents.length > 0 
                ? totalBidAmount / bidEvents.length 
                : 0;

            setAnalytics({
                monthlyActivity,
                successRate,
                averageBidAmount
            });
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to fetch analytics data');
        }
    };

    if (!address) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-white">Please connect your wallet to view your dashboard.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-white">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            {error && (
                <div className="bg-red-900 bg-opacity-30 border border-red-700 p-4 rounded-lg mb-4">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Auctions Created</h3>
                    <p className="text-2xl text-blue-400">{stats.auctionsCreated}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Bids Submitted</h3>
                    <p className="text-2xl text-blue-400">{stats.bidsSubmitted}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Bids Won</h3>
                    <p className="text-2xl text-blue-400">{stats.bidsWon}</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-600">
                                <th className="px-4 py-2 text-left text-white">Type</th>
                                <th className="px-4 py-2 text-left text-white">Auction ID</th>
                                <th className="px-4 py-2 text-left text-white">Amount</th>
                                <th className="px-4 py-2 text-left text-white">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={index} className="border-t border-gray-600">
                                    <td className="px-4 py-2 text-white">{tx.type}</td>
                                    <td className="px-4 py-2 text-white">{tx.auctionId}</td>
                                    <td className="px-4 py-2 text-white">{tx.amount} ETH</td>
                                    <td className="px-4 py-2 text-white">{tx.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analytics */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-4">Monthly Activity</h4>
                        <div className="space-y-2">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                                <div key={month} className="flex items-center">
                                    <span className="text-white w-8">{month}</span>
                                    <div className="flex-1 h-4 bg-gray-600 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(analytics.monthlyActivity[index] / Math.max(...analytics.monthlyActivity)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-white w-8 text-right">{analytics.monthlyActivity[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white">Success Rate</p>
                                <p className="text-2xl text-blue-400">{analytics.successRate.toFixed(1)}%</p>
                            </div>
                            <div>
                                <p className="text-white">Average Bid Amount</p>
                                <p className="text-2xl text-blue-400">{analytics.averageBidAmount.toFixed(4)} ETH</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 