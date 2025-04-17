import React, { useEffect, useState } from 'react';
import { useContract } from '../context/ContractContext';
import AuctionCard from '../components/AuctionCard';
import PhysicalItemProcess from '../components/PhysicalItemProcess';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const MyAuctions = () => {
    const [myAuctions, setMyAuctions] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { contract, loading: contractLoading } = useContract();
    const { address } = useAccount();

    useEffect(() => {
        const fetchMyAuctions = async () => {
            if (!contract || !address) {
                console.log('Contract or address not initialized');
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching auction count...');
                const auctionCount = await contract.getAuctionCount();
                console.log('Auction count:', auctionCount.toString());
                
                const myAuctionsPromises = [];
                const myBidsPromises = [];

                for (let i = 0; i < auctionCount; i++) {
                    try {
                        console.log(`Fetching auction at index ${i}...`);
                        const auctionAddress = await contract.getAuctionId(i);
                        console.log('Auction address:', auctionAddress);
                        
                        if (auctionAddress === '0x0000000000000000000000000000000000000000') {
                            console.log('Skipping invalid address');
                            continue;
                        }

                        console.log('Fetching auction details...');
                        const auctionDetails = await contract.getAuction(auctionAddress);
                        console.log('Auction details:', auctionDetails);
                        
                        if (auctionDetails) {
                            const auction = {
                                id: auctionAddress,
                                ...auctionDetails
                            };

                            // Check if user is the seller
                            if (auction.seller.toLowerCase() === address.toLowerCase()) {
                                myAuctionsPromises.push(auction);
                            }

                            // Check if user is the highest bidder
                            if (auction.highestBidder.toLowerCase() === address.toLowerCase()) {
                                myBidsPromises.push(auction);
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching auction at index ${i}:`, error);
                        continue;
                    }
                }

                console.log('Processing auction promises...');
                setMyAuctions(myAuctionsPromises);
                setMyBids(myBidsPromises);
            } catch (error) {
                console.error('Error in fetchMyAuctions:', error);
                setError(error.message || 'Failed to fetch auctions');
            } finally {
                setLoading(false);
            }
        };

        fetchMyAuctions();
    }, [contract, address]);

    if (contractLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-gray-400">Connecting to wallet...</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-gray-400">Loading your auctions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-red-400">Please connect your wallet to view your auctions</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-6">My Auctions</h2>
            
            {/* Auctions I Created */}
            <div className="mb-12">
                <h3 className="text-2xl font-semibold text-white mb-4">Auctions I Created</h3>
                {myAuctions.length === 0 ? (
                    <p className="text-gray-400">You haven't created any auctions yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myAuctions.map((auction) => (
                            <div key={auction.id} className="bg-gray-800 rounded-lg p-6">
                                <AuctionCard auctionDetails={auction} />
                                {auction.item && auction.item.isPhysical && (
                                    <div className="mt-4">
                                        <PhysicalItemProcess 
                                            contract={contract}
                                            auctionId={auction.id}
                                            isSeller={true}
                                            isBuyer={false}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Auctions I've Bid On */}
            <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Auctions I've Bid On</h3>
                {myBids.length === 0 ? (
                    <p className="text-gray-400">You haven't bid on any auctions yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myBids.map((auction) => (
                            <div key={auction.id} className="bg-gray-800 rounded-lg p-6">
                                <AuctionCard auctionDetails={auction} />
                                {auction.item && auction.item.isPhysical && (
                                    <div className="mt-4">
                                        <PhysicalItemProcess 
                                            contract={contract}
                                            auctionId={auction.id}
                                            isSeller={false}
                                            isBuyer={true}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAuctions; 