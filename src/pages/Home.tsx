import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Tabs */}
      <nav className="bg-gray-800 p-4">
        <ul className="flex justify-around">
          <li>
            <Link
              to="/auctions"
              className="text-white hover:text-purple-400 font-bold"
            >
              Auctions
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="text-white hover:text-purple-400 font-bold"
            >
              User Profile
            </Link>
          </li>
          <li>
            <Link
              to="/governance"
              className="text-white hover:text-purple-400 font-bold"
            >
              Governance and Voting
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className="text-white hover:text-purple-400 font-bold"
            >
              Notifications
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to TENI DeFi</h1>
        <p className="text-lg text-gray-400">
          Explore auctions, manage your profile, participate in governance, and
          stay updated with notifications.
        </p>
      </div>
    </div>
  );
};

export default Home;