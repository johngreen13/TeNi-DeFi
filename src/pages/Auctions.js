import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    BiTime,
    BiDollar,
    BiTag,
    BiSolidFlame as BiFire,
    BiSearch
} from 'react-icons/bi';
import { useWeb3 } from '../context/Web3Context';

const Auctions = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [bidAmount, setBidAmount] = useState('');
    const [isBidding, setIsBidding] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { account } = useWeb3();

    // Mock data for auctions with mock contract addresses
    const mockAuctions = [
        {
            id: 1,
            title: "Rare NFT Artwork",
            description: "One of a kind digital artwork",
            currentPrice: "1.5",
            endTime: "2024-04-15T12:00:00",
            image: "https://picsum.photos/300/200",
            type: "english",
            contractAddress: "0x1234567890123456789012345678901234567890", // Mock address
            status: "live"
        },
        {
            id: 2,
            title: "Vintage Watch",
            description: "Classic timepiece in excellent condition",
            currentPrice: "0.8",
            endTime: "2024-04-16T15:30:00",
            image: "https://picsum.photos/300/200",
            type: "dutch",
            contractAddress: "0x0987654321098765432109876543210987654321", // Mock address
            status: "live"
        },
        {
            id: 3,
            title: "Limited Edition Sneakers",
            description: "Brand new, never worn",
            currentPrice: "2.0",
            endTime: "2024-04-17T18:00:00",
            image: "https://images.unsplash.com/photo-1600269452121-4f2856eab5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
            type: "sealed",
            contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12", // Mock address
            status: "upcoming"
        }
    ];

    const handlePlaceBid = async (auction) => {
        if (!account) {
            setError('Please connect your wallet first');
            return;
        }

        if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
            setError('Please enter a valid bid amount');
            return;
        }

        try {
            setIsBidding(true);
            setError(null);

            // Mock bid placement for development
            console.log('Mock bid placement:', {
                auctionType: auction.type,
                contractAddress: auction.contractAddress,
                bidAmount: bidAmount,
                bidder: account
            });

            // Simulate transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success response
            console.log('Mock bid placed successfully');
            
        } catch (error) {
            console.error('Error placing bid:', error);
            setError('Failed to place bid. Please try again.');
        } finally {
            setIsBidding(false);
        }
    };

    // Filter auctions based on active filter
    const filteredAuctions = mockAuctions.filter(auction => {
        if (activeFilter === 'all') return true;
        return auction.status === activeFilter;
    });

    return (
        <div className="py-6">
            {/* Auction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400">Total Auctions</p>
                            <h3 className="text-2xl font-bold mt-1">{mockAuctions.length}</h3>
                        </div>
                        <BiTag className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400">Live Auctions</p>
                            <h3 className="text-2xl font-bold mt-1">
                                {mockAuctions.filter(a => a.status === 'live').length}
                            </h3>
                        </div>
                        <BiFire className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400">Total Value</p>
                            <h3 className="text-2xl font-bold mt-1">1,234 ETH</h3>
                        </div>
                        <BiDollar className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400">Ending Soon</p>
                            <h3 className="text-2xl font-bold mt-1">12</h3>
                        </div>
                        <BiTime className="h-8 w-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Auction Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                {/* Filter Buttons */}
                <div className="flex space-x-4">
                    {['all', 'live', 'upcoming', 'ended'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-lg ${
                                activeFilter === filter
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Create Auction Button */}
                <Link
                    to="/auctions/create"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                >
                    Create Auction
                </Link>
            </div>

            {/* Auctions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                    <div
                        key={auction.id}
                        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-200"
                    >
                        <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                            <img 
                                src={auction.image} 
                                alt={auction.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold">{auction.title}</h3>
                                <span className={`
                                    text-xs px-2 py-1 rounded-full
                                    ${auction.status === 'live' ? 'bg-green-500 bg-opacity-20 text-green-500' : ''}
                                    ${auction.status === 'upcoming' ? 'bg-blue-500 bg-opacity-20 text-blue-500' : ''}
                                    ${auction.status === 'ended' ? 'bg-gray-500 bg-opacity-20 text-gray-500' : ''}
                                `}>
                                    {auction.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Current Bid</p>
                                    <p className="text-lg font-bold">{auction.currentPrice} ETH</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Time Left</p>
                                    <p className="text-lg font-bold">{auction.endTime}</p>
                                </div>
                            </div>
                            {auction.status === 'live' && (
                                <div className="mt-4">
                                    <input
                                        type="number"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder="Enter bid amount (ETH)"
                                        className="w-full mb-2 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mb-2">{error}</p>
                                    )}
                                    <button
                                        onClick={() => handlePlaceBid(auction)}
                                        disabled={isBidding}
                                        className={`w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors ${
                                            isBidding ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isBidding ? 'Placing Bid...' : 'Place Bid'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Auctions;