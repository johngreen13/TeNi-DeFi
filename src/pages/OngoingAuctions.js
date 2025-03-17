import React, { useEffect, useState } from "react";
import BackButton from '../components/BackButton'; // Import BackButton

const OngoingAuctions = ({ ongoingAuctions }) => {
    const [auctionsWithTimers, setAuctionsWithTimers] = useState([]);

    // Function to calculate remaining time for each auction
    const calculateRemainingTime = (auction) => {
        const currentTime = Date.now();
        const endTime = auction.startTime + parseInt(auction.endTime) * 1000; // Calculate end time
        const remainingTime = Math.max(0, endTime - currentTime); // Ensure no negative values
        return remainingTime;
    };

    // Update the remaining time for all auctions
    useEffect(() => {
        const interval = setInterval(() => {
            const updatedAuctions = ongoingAuctions.map((auction) => ({
                ...auction,
                remainingTime: calculateRemainingTime(auction),
            }));
            setAuctionsWithTimers(updatedAuctions);
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [ongoingAuctions]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <BackButton /> {/* Add Back Button */}
            <h1 className="text-4xl font-bold mb-6">Ongoing Auctions</h1>
            {auctionsWithTimers.length > 0 ? (
                auctionsWithTimers.map((auction) => (
                    <div key={auction.auctionId} className="bg-gray-800 p-4 rounded mb-4">
                        <h2 className="text-2xl font-bold">{auction.description}</h2>
                        <p><strong>Auction ID:</strong> {auction.auctionId}</p>
                        <p><strong>Starting Price:</strong> {auction.startingPrice} ETH</p>
                        <p><strong>Time Remaining:</strong> {formatTime(auction.remainingTime)}</p>
                    </div>
                ))
            ) : (
                <p>No ongoing auctions at the moment.</p>
            )}
        </div>
    );
};

// Helper function to format time in HH:MM:SS
const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default OngoingAuctions;