import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auctions from './pages/Auctions';

import CreateAuction from './pages/CreateAuction';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auctions" element={<Auctions />} />
            
            <Route path="/create" element={<CreateAuction />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;