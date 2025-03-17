import React, { useState } from "react";
import { ethers } from "ethers";
import { createAuction } from "../auction"; // Import createAuction from auction.js
import { useNavigate } from 'react-router-dom';

const CreateAuction = ({ addAuction }) => {
    const navigate = useNavigate(); // Hook for navigation

    const [auctionType, setAuctionType] = useState("");
    const [auctionDetails, setAuctionDetails] = useState({
        auctionId: "", // Auction ID will be generated automatically
        description: "",
        image: null,
        startingPrice: "",
        endTime: "",
        tokens: "",
    });
    const [status, setStatus] = useState("");
    const [auctionData, setAuctionData] = useState(null);

    // Function to generate a unique Auction ID
    const generateAuctionId = () => {
        const timestamp = Date.now(); // Current timestamp
        const randomString = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
        return `AUC-${timestamp}-${randomString}`; // Example: AUC-1678901234567-abc123
    };

    // Handle auction type selection
    const handleAuctionTypeChange = (e) => {
        setAuctionType(e.target.value);
        setAuctionDetails((prev) => ({
            ...prev,
            auctionId: generateAuctionId(),
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAuctionDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setAuctionDetails((prev) => ({ ...prev, image: file }));
    };

    const handleCreateAuction = async () => {
        try {
            setStatus("Creating auction...");

            // Convert startingPrice to uint256 (ETH to Wei)
            const startingPrice = ethers.utils.parseEther(auctionDetails.startingPrice);

            // Convert endTime to uint256 (seconds)
            const endTime = parseInt(auctionDetails.endTime);

            if (isNaN(endTime) || endTime <= 0) {
                throw new Error("Invalid end time. Please enter a valid number.");
            }

            // Construct the auction data object
            const auction = {
                auctionId: auctionDetails.auctionId,
                startingPrice, // In Wei
                endTime, // In seconds
                description: auctionDetails.description,
                image: auctionDetails.image ? auctionDetails.image.name : null,
                startNow: true, // Assuming this is for "Begin Now"
            };

            console.log("Auction object being passed to createAuction():", auction);

            // Call createAuction() in auction.js
            await createAuction(auction);

            setStatus("Auction created successfully!");
        } catch (error) {
            console.error("Error creating auction:", error);
            setStatus("Error creating auction. Check console for details.");
        }
    };

    const executeAuction = () => {
        if (!auctionData) {
            alert("No auction data available.");
            return;
        }

        switch (auctionData.auctionType) {
            case "English Auction":
                executeEnglishAuction();
                break;
            case "Dutch Auction":
                executeDutchAuction();
                break;
            case "Sealed-Bid Auction":
                executeSealedBidAuction();
                break;
            case "Fixed-Swap Auction":
                executeFixedSwapAuction();
                break;
            default:
                alert("Invalid auction type.");
        }
    };

    const executeEnglishAuction = () => {
        alert("Executing English Auction...");
        // Simulate auction logic
        setStatus("English Auction executed successfully!");
    };

    const executeDutchAuction = () => {
        alert("Executing Dutch Auction...");
        // Simulate auction logic
        setStatus("Dutch Auction executed successfully!");
    };

    const executeSealedBidAuction = () => {
        alert("Executing Sealed-Bid Auction...");
        // Simulate auction logic
        setStatus("Sealed-Bid Auction executed successfully!");
    };

    const executeFixedSwapAuction = () => {
        alert("Executing Fixed-Swap Auction...");
        // Simulate auction logic
        setStatus("Fixed-Swap Auction executed successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-6">Create Auction</h1>
            <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Select Auction Type:</label>
                <select
                    value={auctionType}
                    onChange={handleAuctionTypeChange}
                    className="bg-gray-800 text-white p-2 rounded w-full"
                >
                    <option value="">-- Select Auction Type --</option>
                    <option value="English Auction">English Auction</option>
                    <option value="Dutch Auction">Dutch Auction</option>
                    <option value="Sealed-Bid Auction">Sealed-Bid Auction</option>
                    <option value="Fixed-Swap Auction">Fixed-Swap Auction</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Auction ID:</label>
                <input
                    type="text"
                    name="auctionId"
                    value={auctionDetails.auctionId}
                    readOnly
                    className="bg-gray-800 text-white p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Description:</label>
                <input
                    type="text"
                    name="description"
                    value={auctionDetails.description}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-white p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Starting Price (ETH):</label>
                <input
                    type="number"
                    name="startingPrice"
                    value={auctionDetails.startingPrice}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-white p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Duration (seconds):</label>
                <input
                    type="number"
                    name="endTime"
                    value={auctionDetails.endTime}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-white p-2 rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg font-bold mb-2">Upload Image:</label>
                <input type="file" onChange={handleImageUpload} className="bg-gray-800 text-white p-2 rounded w-full" />
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={handleCreateAuction}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create Auction
                </button>
                <button
                    onClick={executeAuction}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Execute Auction
                </button>
            </div>
            {status && <p className="mt-4">{status}</p>}
            {/* Back Button */}
            <div className="mt-8">
                <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default CreateAuction;