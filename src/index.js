import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new createRoot API
import App from './App';
import './index.css'; // If you have global styles

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create a root and render the App component
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);