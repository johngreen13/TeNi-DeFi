import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import CreateAuction from './pages/CreateAuction';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Web3Provider>
            <Router>
                <div className="min-h-screen bg-gray-900 text-white">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/auctions" element={<Auctions />} />
                            <Route path="/auctions/create" element={<CreateAuction />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </Web3Provider>
    );
}

export default App;