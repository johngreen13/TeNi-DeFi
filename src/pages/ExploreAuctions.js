import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton'; // Import BackButton

const ExploreAuctions = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <BackButton /> {/* Add Back Button */}
            <h1 className="text-4xl font-bold mb-6">Explore Auctions</h1>
            <div className="flex flex-col gap-4">
                {/* Past Auctions Button */}
                <Link
                    to="/auctions/explore/past"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                    Past Auctions
                </Link>

                {/* Ongoing Auctions Button */}
                <Link
                    to="/auctions/explore/ongoing"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                    Ongoing Auctions
                </Link>

                {/* Upcoming Auctions Button */}
                <Link
                    to="/auctions/explore/upcoming"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                    Upcoming Auctions
                </Link>
            </div>
        </div>
    );
};

export default ExploreAuctions;