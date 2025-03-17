import React, { useEffect, useState } from 'react';
import { getAuctionDetails } from '../utils/auction';
import AuctionCard from '../components/AuctionCard';

const DisplayAuctions = () => {
    const [auctionDetails, setAuctionDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const details = await getAuctionDetails();
                setAuctionDetails(details);
            } catch (error) {
                console.error('Error fetching auction details:', error);
            }
        };

        fetchDetails();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-6">Ongoing Auctions</h2>
            {auctionDetails ? (
                <AuctionCard auctionDetails={auctionDetails} />
            ) : (
                <p className="text-gray-400">Loading auction details...</p>
            )}
        </div>
    );
};

export default DisplayAuctions;