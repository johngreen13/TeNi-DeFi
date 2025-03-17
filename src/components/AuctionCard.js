import React from 'react';

const AuctionCard = ({ auctionDetails }) => {
  const {
    highestBidder,
    highestBid,
    startingPrice,
    currentPrice,
    endTime,
  } = auctionDetails;

  const formattedEndTime = new Date(endTime * 1000).toLocaleString();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">Auction Details</h3>
        <div className="text-gray-400 text-sm mb-2">
          <p>
            <strong>Highest Bidder:</strong>{' '}
            {highestBidder === '0x0000000000000000000000000000000000000000'
              ? 'No bids yet'
              : highestBidder}
          </p>
          <p>
            <strong>Highest Bid:</strong> {highestBid} Wei
          </p>
          <p>
            <strong>Starting Price:</strong> {startingPrice} Wei
          </p>
          <p>
            <strong>Current Price:</strong> {currentPrice} Wei
          </p>
          <p>
            <strong>End Time:</strong> {formattedEndTime}
          </p>
        </div>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Place Bid
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;