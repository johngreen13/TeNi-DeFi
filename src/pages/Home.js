import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any user session data (if applicable)
        console.log("User logged out");

        // Redirect to the Login page
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to TENI DeFi</h1>
            <p className="text-lg text-gray-400">You are now logged in with your wallet.</p>
        </div>
    );
};

export default Home;