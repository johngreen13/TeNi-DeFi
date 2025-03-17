import React, { useEffect, useState } from "react";
import { auctionContract } from "../utils/auctionContract";
import BackButton from '../components/BackButton'; // Import BackButton

const UpcomingAuctions = () => {
    const [upcomingAuctions, setUpcomingAuctions] = useState([]);

    useEffect(() => {
        const fetchUpcomingAuctions = async () => {
            try {
                const auctionIds = await auctionContract.getUpcomingAuctions(); // Assume this function exists in the smart contract
                const auctionDetails = await Promise.all(
                    auctionIds.map(async (id) => {
                        const details = await auctionContract.getAuctionDetails(id);
                        return {
                            auctionId: details[0],
                            description: details[1],
                            startingPrice: details[2],
                            endTime: details[5],
                        };
                    })
                );
                setUpcomingAuctions(auctionDetails);
            } catch (error) {
                console.error("Error fetching upcoming auctions:", error);
            }
        };

        fetchUpcomingAuctions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <BackButton /> {/* Add Back Button */}
            <h1 className="text-4xl font-bold mb-6">Upcoming Auctions</h1>
            {upcomingAuctions.map((auction) => (
                <div key={auction.auctionId} className="bg-gray-800 p-4 rounded mb-4">
                    <h2 className="text-2xl font-bold">{auction.description}</h2>
                    <p><strong>Auction ID:</strong> {auction.auctionId}</p>
                    <p><strong>Starting Price:</strong> {ethers.utils.formatEther(auction.startingPrice)} ETH</p>
                    <p><strong>Scheduled Start Time:</strong> {new Date(auction.endTime * 1000).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default UpcomingAuctions;