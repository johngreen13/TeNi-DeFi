import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Auctions = () => {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-6">Auctions</h1>
            <div className="flex space-x-4 mb-6">
                <Link
                    to="/auctions/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create Auction
                </Link>
                <Link
                    to="/auctions/explore"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Explore Auctions
                </Link>
            </div>
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
                Back
            </button>
        </div>
    );
};

export default Auctions;