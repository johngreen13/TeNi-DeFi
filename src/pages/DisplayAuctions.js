import React, { useEffect, useState } from 'react';
import { useContract } from '../context/ContractContext';
import AuctionCard from '../components/AuctionCard';
import PhysicalItemProcess from '../components/PhysicalItemProcess';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const DisplayAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { contract, loading: contractLoading } = useContract();
    const { address } = useAccount();

    useEffect(() => {
        const fetchAuctions = async () => {
            if (!contract) {
                console.log('Contract not initialized');
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching auction count...');
                const auctionCount = await contract.getAuctionCount();
                console.log('Auction count:', auctionCount.toString());
                
                const auctionPromises = [];

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
                            auctionPromises.push({
                                id: auctionAddress,
                                ...auctionDetails
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching auction at index ${i}:`, error);
                        continue;
                    }
                }

                console.log('Processing auction promises...');
                const auctionDetails = await Promise.all(auctionPromises);
                console.log('Final auction details:', auctionDetails);
                setAuctions(auctionDetails);
            } catch (error) {
                console.error('Error in fetchAuctions:', error);
                setError(error.message || 'Failed to fetch auctions');
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, [contract]);

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
                <p className="text-gray-400">Loading auctions...</p>
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
                <p className="text-red-400">Please connect your wallet to view auctions</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-6">All Auctions</h2>
            {auctions.length === 0 ? (
                <p className="text-gray-400">No auctions found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => {
                        const isSeller = address === auction.seller;
                        const isBuyer = address === auction.highestBidder;

                        return (
                            <div key={auction.id} className="bg-gray-800 rounded-lg p-6">
                                <AuctionCard auctionDetails={auction} />
                                
                                {auction.item && auction.item.isPhysical && (
                                    <div className="mt-4">
                                        <PhysicalItemProcess 
                                            contract={contract}
                                            auctionId={auction.id}
                                            isSeller={isSeller}
                                            isBuyer={isBuyer}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DisplayAuctions;