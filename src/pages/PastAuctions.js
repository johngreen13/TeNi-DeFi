import React from 'react';
import BackButton from '../components/BackButton'; // Import BackButton

const PastAuctions = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <BackButton /> {/* Add Back Button */}
      <h1 className="text-4xl font-bold mb-6">Past Auctions</h1>
      <p className="text-lg text-gray-400">Display a record of past and completed auctions here.</p>
    </div>
  );
};

export default PastAuctions;