import React from 'react';
import { ethers } from 'ethers';

const AuctionCard = ({ auctionDetails }) => {
    if (!auctionDetails) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400">Invalid auction details</p>
            </div>
        );
    }

    const {
        seller,
        startingPrice,
        currentPrice,
        endTime,
        highestBidder,
        status,
        description,
        item
    } = auctionDetails;

    const formattedStartingPrice = startingPrice ? ethers.utils.formatEther(startingPrice) : '0';
    const formattedCurrentPrice = currentPrice ? ethers.utils.formatEther(currentPrice) : '0';
    const endDate = new Date(endTime * 1000).toLocaleString();
    const isPhysical = item && item.isPhysical;
    const itemDescription = item ? item.description : 'No description available';

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
                {description || 'Untitled Auction'}
            </h3>
            
            <div className="text-gray-300">
                <p>Starting Price: {formattedStartingPrice} ETH</p>
                <p>Current Price: {formattedCurrentPrice} ETH</p>
                <p>End Time: {endDate}</p>
                <p>Status: {status}</p>
                <p>Type: {isPhysical ? 'Physical Item' : 'Digital Item'}</p>
            </div>

            <div className="text-gray-400">
                <p>Seller: {seller}</p>
                <p>Highest Bidder: {highestBidder || 'No bids yet'}</p>
                <p>Item Description: {itemDescription}</p>
            </div>

            {isPhysical && item && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-2">Physical Item Details</h4>
                    <div className="text-gray-300">
                        <p>Condition: {item.condition}</p>
                        <p>Dimensions: {item.dimensions}</p>
                        <p>Weight: {item.weight}</p>
                        <p>Shipping Address: {item.shippingAddress}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionCard;