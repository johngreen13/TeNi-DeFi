import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const CreateAuction = ({ addOngoingAuction, addUpcomingAuction }) => {
    const navigate = useNavigate(); // Hook for navigation

    const [auctionType, setAuctionType] = useState("");
    const [auctionDetails, setAuctionDetails] = useState({
        auctionId: "",
        description: "",
        image: null,
        startingPrice: "",
        endTime: "",
        tokens: "",
    });
    const [status, setStatus] = useState("");

    // Function to generate a unique Auction ID
    const generateAuctionId = () => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `AUC-${timestamp}-${randomString}`;
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

    // Begin Now: Execute the auction immediately
    const handleBeginNow = async () => {
        try {
            setStatus("Starting auction immediately...");

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
                auctionType,
                startingPrice, // In Wei
                endTime, // In seconds
                description: auctionDetails.description,
                image: auctionDetails.image ? auctionDetails.image.name : null,
                startNow: true,
            };

            // Add the auction to the ongoing auctions list
            addOngoingAuction(auction);

            setStatus("Auction started successfully!");
            navigate("/auctions/explore"); // Redirect to Explore Auctions page
        } catch (error) {
            console.error("Error starting auction:", error);
            setStatus("Error starting auction. Check console for details.");
        }
    };

    // Schedule for Later: Schedule the auction for a future time
    const handleScheduleForLater = async () => {
        try {
            setStatus("Scheduling auction...");

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
                auctionType,
                startingPrice, // In Wei
                endTime, // In seconds
                description: auctionDetails.description,
                image: auctionDetails.image ? auctionDetails.image.name : null,
                startNow: false,
            };

            // Add the auction to the upcoming auctions list
            addUpcomingAuction(auction);

            setStatus("Auction scheduled successfully!");
            navigate("/auctions/explore"); // Redirect to Explore Auctions page
        } catch (error) {
            console.error("Error scheduling auction:", error);
            setStatus("Error scheduling auction. Check console for details.");
        }
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
                    onClick={handleBeginNow}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Begin Now
                </button>
                <button
                    onClick={handleScheduleForLater}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Schedule for Later
                </button>
            </div>
            {status && <p className="mt-4">{status}</p>}
        </div>
    );
};

export default CreateAuction;