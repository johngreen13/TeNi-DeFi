import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useSigner, useContractEvent } from 'wagmi';
import { ethers } from 'ethers';
import UserABI from '../contracts/User.json';
import AuctionFactoryABI from '../contracts/AuctionFactory.json';

const MonthlyActivityBar = ({ data }) => {
    const maxValue = Math.max(...data);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return (
        <div className="space-y-2">
            {months.map((month, index) => (
                <div key={month} className="flex items-center space-x-2">
                    <span className="text-white w-8">{month}</span>
                    <div className="flex-1 h-4 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${(data[index] / maxValue) * 100}%` }}
                        />
                    </div>
                    <span className="text-white w-8 text-right">{data[index]}</span>
                </div>
            ))}
        </div>
    );
};

const UserProfile = () => {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        profileImage: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
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

    // Contract addresses
    const userContractAddress = process.env.REACT_APP_USER_CONTRACT_ADDRESS;
    const auctionFactoryAddress = process.env.REACT_APP_AUCTION_FACTORY_ADDRESS;
    const rpcUrl = process.env.REACT_APP_RPC_URL;

    // Helper function to format ether values (compatible with different ethers.js versions)
    const formatEther = (value) => {
        try {
            // Try the newer ethers.js v6 format
            if (typeof ethers.formatEther === 'function') {
                return ethers.formatEther(value);
            }
            // Fall back to older ethers.js v5 format
            return ethers.utils.formatEther(value);
        } catch (error) {
            console.error('Error formatting ether value:', error);
            return '0';
        }
    };

    // Contract read hooks
    const { data: userProfileData } = useContractRead({
        address: userContractAddress,
        abi: UserABI,
        functionName: 'getUserProfile',
        args: [address],
        enabled: !!address && !!userContractAddress
    });

    const { data: createdAuctions } = useContractRead({
        address: userContractAddress,
        abi: UserABI,
        functionName: 'getUserCreatedAuctions',
        args: [address],
        enabled: !!address && !!userContractAddress
    });

    const { data: userPurchases } = useContractRead({
        address: userContractAddress,
        abi: UserABI,
        functionName: 'getUserPurchases',
        args: [address],
        enabled: !!address && !!userContractAddress
    });

    // Contract write hooks
    const { writeAsync: createUser } = useContractWrite({
        address: userContractAddress,
        abi: UserABI,
        functionName: 'createUser'
    });

    const { writeAsync: updateProfile } = useContractWrite({
        address: userContractAddress,
        abi: UserABI,
        functionName: 'updateProfile'
    });

    const { writeAsync: becomeSeller } = useContractWrite({
        address: userContractAddress,
        abi: UserABI,
        functionName: 'becomeSeller'
    });

    // Event listening for BidPlaced events
    useContractEvent({
        address: auctionFactoryAddress,
        abi: AuctionFactoryABI,
        eventName: 'BidPlaced',
        listener(event) {
            // Extract parameters based on the event structure
            const bidder = event.args.bidder || event.args[0];
            const auctionId = event.args.auctionId || event.args[1];
            const amount = event.args.amount || event.args[2];
            
            if (bidder && address && bidder.toLowerCase() === address.toLowerCase()) {
                // Update transactions
                setTransactions(prev => {
                    const newTransaction = {
                        type: 'Bid',
                        auctionId: auctionId.toString(),
                        amount: formatEther(amount),
                        timestamp: new Date().toLocaleString()
                    };
                    return [newTransaction, ...prev];
                });

                // Update analytics
                setAnalytics(prev => {
                    const currentMonth = new Date().getMonth();
                    const newMonthlyActivity = [...prev.monthlyActivity];
                    newMonthlyActivity[currentMonth]++;
                    
                    // Calculate new success rate
                    const newBidsSubmitted = prev.bidsSubmitted + 1;
                    const successRate = userPurchases?.length > 0 
                        ? (userPurchases.length / newBidsSubmitted) * 100 
                        : 0;
                    
                    // Calculate new average bid amount
                    const newTotalBidAmount = prev.averageBidAmount * prev.bidsSubmitted + 
                        parseFloat(formatEther(amount));
                    const newAverageBidAmount = newBidsSubmitted > 0 
                        ? newTotalBidAmount / newBidsSubmitted 
                        : 0;
                    
                    return {
                        monthlyActivity: newMonthlyActivity,
                        successRate,
                        averageBidAmount: newAverageBidAmount
                    };
                });

                // Update stats
                setStats(prev => ({
                    ...prev,
                    bidsSubmitted: prev.bidsSubmitted + 1
                }));
            }
        },
        enabled: !!address && !!auctionFactoryAddress
    });

    // Event listening for AuctionWon events
    useContractEvent({
        address: auctionFactoryAddress,
        abi: AuctionFactoryABI,
        eventName: 'AuctionWon',
        listener(event) {
            // Extract parameters based on the event structure
            const winner = event.args.winner || event.args[0];
            const auctionId = event.args.auctionId || event.args[1];
            const amount = event.args.amount || event.args[2];
            
            if (winner && address && winner.toLowerCase() === address.toLowerCase()) {
                // Update transactions
                setTransactions(prev => {
                    const newTransaction = {
                        type: 'Won',
                        auctionId: auctionId.toString(),
                        amount: formatEther(amount),
                        timestamp: new Date().toLocaleString()
                    };
                    return [newTransaction, ...prev];
                });

                // Update stats
                setStats(prev => ({
                    ...prev,
                    bidsWon: prev.bidsWon + 1
                }));

                // Update analytics
                setAnalytics(prev => {
                    // Recalculate success rate
                    const newBidsWon = prev.bidsWon + 1;
                    const successRate = prev.bidsSubmitted > 0 
                        ? (newBidsWon / prev.bidsSubmitted) * 100 
                        : 0;
                    
                    return {
                        ...prev,
                        successRate
                    };
                });
            }
        },
        enabled: !!address && !!auctionFactoryAddress
    });

    // Event listening for AuctionCreated events
    useContractEvent({
        address: auctionFactoryAddress,
        abi: AuctionFactoryABI,
        eventName: 'AuctionCreated',
        listener(event) {
            // Extract parameters based on the event structure
            const creator = event.args.creator || event.args[0];
            const auctionId = event.args.auctionId || event.args[1];
            
            if (creator && address && creator.toLowerCase() === address.toLowerCase()) {
                // Update transactions
                setTransactions(prev => {
                    const newTransaction = {
                        type: 'Created',
                        auctionId: auctionId.toString(),
                        amount: '0',
                        timestamp: new Date().toLocaleString()
                    };
                    return [newTransaction, ...prev];
                });

                // Update stats
                setStats(prev => ({
                    ...prev,
                    auctionsCreated: prev.auctionsCreated + 1
                }));
            }
        },
        enabled: !!address && !!auctionFactoryAddress
    });

    // Load historical data on component mount
    useEffect(() => {
        if (address && auctionFactoryAddress && rpcUrl) {
            fetchTransactionHistory();
            fetchAnalytics();
        }
    }, [address, auctionFactoryAddress, rpcUrl]);

    useEffect(() => {
        if (userProfileData) {
            if (userProfileData.exists) {
                setUserProfile(userProfileData);
                setFormData({
                    username: userProfileData.username,
                    email: userProfileData.email,
                    profileImage: userProfileData.profileImage,
                    bio: userProfileData.bio
                });
            } else {
                setIsCreatingProfile(true);
            }
        }
    }, [userProfileData]);

    useEffect(() => {
        if (createdAuctions && userPurchases) {
            setStats({
                auctionsCreated: createdAuctions.length,
                bidsSubmitted: 0, // This will be updated by event listeners
                bidsWon: userPurchases.length
            });
        }
    }, [createdAuctions, userPurchases]);

    // This function now loads historical transaction data
    const fetchTransactionHistory = async () => {
        try {
            // Create a provider to query past events
            let provider;
            try {
                // Try newer ethers.js v6 format
                provider = new ethers.JsonRpcProvider(rpcUrl);
            } catch (error) {
                // Fall back to older ethers.js v5 format
                provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            }
            
            const auctionFactory = new ethers.Contract(
                auctionFactoryAddress,
                AuctionFactoryABI,
                provider
            );

            // Get BidPlaced events
            const bidFilter = auctionFactory.filters.BidPlaced(null, address);
            const bidEvents = await auctionFactory.queryFilter(bidFilter);
            
            // Get AuctionWon events
            const wonFilter = auctionFactory.filters.AuctionWon(null, null, null);
            const wonEvents = await auctionFactory.queryFilter(wonFilter);
            
            // Get AuctionCreated events
            const createdFilter = auctionFactory.filters.AuctionCreated(null, null);
            const createdEvents = await auctionFactory.queryFilter(createdFilter);

            // Process all events
            const allTransactions = [
                ...bidEvents.map(event => ({
                    type: 'Bid',
                    auctionId: event.args.auctionId?.toString() || event.args[1]?.toString() || 'Unknown',
                    amount: formatEther(event.args.amount || event.args[2]),
                    timestamp: new Date(event.blockTimestamp * 1000).toLocaleString()
                })),
                ...wonEvents
                    .filter(event => {
                        const winner = event.args.winner || event.args[0];
                        return winner && address && winner.toLowerCase() === address.toLowerCase();
                    })
                    .map(event => ({
                        type: 'Won',
                        auctionId: event.args.auctionId?.toString() || event.args[1]?.toString() || 'Unknown',
                        amount: formatEther(event.args.amount || event.args[2]),
                        timestamp: new Date(event.blockTimestamp * 1000).toLocaleString()
                    })),
                ...createdEvents
                    .filter(event => {
                        const creator = event.args.creator || event.args[0];
                        return creator && address && creator.toLowerCase() === address.toLowerCase();
                    })
                    .map(event => ({
                        type: 'Created',
                        auctionId: event.args.auctionId?.toString() || event.args[1]?.toString() || 'Unknown',
                        amount: '0',
                        timestamp: new Date(event.blockTimestamp * 1000).toLocaleString()
                    }))
            ];

            // Sort by timestamp (newest first)
            allTransactions.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setTransactions(allTransactions);
        } catch (err) {
            console.error('Error fetching transaction history:', err);
            setError('Failed to fetch transaction history');
        }
    };

    // This function now loads historical analytics data
    const fetchAnalytics = async () => {
        try {
            // Create a provider to query past events
            let provider;
            try {
                // Try newer ethers.js v6 format
                provider = new ethers.JsonRpcProvider(rpcUrl);
            } catch (error) {
                // Fall back to older ethers.js v5 format
                provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            }
            
            const auctionFactory = new ethers.Contract(
                auctionFactoryAddress,
                AuctionFactoryABI,
                provider
            );

            // Get BidPlaced events
            const bidFilter = auctionFactory.filters.BidPlaced(null, address);
            const bidEvents = await auctionFactory.queryFilter(bidFilter);
            
            // Get AuctionWon events
            const wonFilter = auctionFactory.filters.AuctionWon(null, null, null);
            const wonEvents = await auctionFactory.queryFilter(wonFilter);
            
            // Calculate monthly activity
            const monthlyActivity = Array(12).fill(0);
            bidEvents.forEach(event => {
                const month = new Date(event.blockTimestamp * 1000).getMonth();
                monthlyActivity[month]++;
            });

            // Calculate success rate
            const userWonEvents = wonEvents.filter(event => {
                const winner = event.args.winner || event.args[0];
                return winner && address && winner.toLowerCase() === address.toLowerCase();
            });
            
            const successRate = bidEvents.length > 0 
                ? (userWonEvents.length / bidEvents.length) * 100 
                : 0;

            // Calculate average bid amount
            const totalBidAmount = bidEvents.reduce((sum, event) => {
                const amount = event.args.amount || event.args[2];
                return sum + parseFloat(formatEther(amount));
            }, 0);
            
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createUser({
                args: [
                    formData.username,
                    formData.email,
                    formData.profileImage,
                    formData.bio
                ]
            });
            setIsCreatingProfile(false);
        } catch (err) {
            console.error('Error creating profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateProfile({
                args: [
                    formData.email,
                    formData.profileImage,
                    formData.bio
                ]
            });
            setIsEditingProfile(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeSeller = async () => {
        setLoading(true);
        setError('');

        try {
            await becomeSeller();
        } catch (err) {
            console.error('Error becoming seller:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!address) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-white">Please connect your wallet to view your profile.</p>
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

            {isCreatingProfile ? (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Create Your Profile</h2>
                    <form onSubmit={handleCreateProfile} className="space-y-4">
                        <div>
                            <label className="block text-white mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Profile Image URL</label>
                            <input
                                type="text"
                                name="profileImage"
                                value={formData.profileImage}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                rows="4"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {loading ? 'Creating...' : 'Create Profile'}
                        </button>
                    </form>
                </div>
            ) : userProfile ? (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">Your Profile</h2>
                        {!isEditingProfile && (
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Stats */}
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
                                <MonthlyActivityBar data={analytics.monthlyActivity} />
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

                    {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-white mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Profile Image URL</label>
                                <input
                                    type="text"
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                                    rows="4"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Username</h3>
                                <p className="text-gray-300">{userProfile.username}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Email</h3>
                                <p className="text-gray-300">{userProfile.email}</p>
                            </div>
                            {userProfile.profileImage && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Profile Image</h3>
                                    <img
                                        src={userProfile.profileImage}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold text-white">Bio</h3>
                                <p className="text-gray-300">{userProfile.bio}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Seller Status</h3>
                                <p className="text-gray-300">
                                    {userProfile.isSeller ? 'Active Seller' : 'Not a Seller'}
                                </p>
                            </div>
                            {userProfile.isSeller && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Seller Rating</h3>
                                    <p className="text-gray-300">{userProfile.sellerRating}/5</p>
                                </div>
                            )}
                            {!userProfile.isSeller && (
                                <button
                                    onClick={handleBecomeSeller}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {loading ? 'Processing...' : 'Become a Seller'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-white">Loading profile...</p>
            )}
        </div>
    );
};

export default UserProfile; 