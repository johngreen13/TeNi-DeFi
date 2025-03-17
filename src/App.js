import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Auctions from './pages/Auctions'; // Import the Auctions page
import CreateAuction from './pages/CreateAuction'; // Import Create Auction
import ExploreAuctions from './pages/ExploreAuctions'; // Import Explore Auctions

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login onLogin={(walletAddress) => console.log('Logged in with:', walletAddress)} />} />
                <Route path="/home" element={<Home />} /> {/* Home Page */}
                <Route path="/auctions" element={<Auctions />} /> {/* Auctions Page */}
                <Route path="/auctions/create" element={<CreateAuction />} /> {/* Create Auction */}
                <Route path="/auctions/explore" element={<ExploreAuctions />} /> {/* Explore Auctions */}
            </Routes>
        </Router>
    );
}

export default App;