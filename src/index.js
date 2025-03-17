import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure the path to App.js is correct
import './index.css'; // Ensure Tailwind CSS is applied

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // Ensure this matches the id in your index.html
);