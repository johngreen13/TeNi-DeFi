import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (account) => {
        setUser(account); // Save the logged-in MetaMask account
    };

    const handleLogout = () => {
        setUser(null); // Clear the logged-in user
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                <Route
                    path="/home"
                    element={
                        user ? (
                            <Home onLogout={handleLogout} />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;