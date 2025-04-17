import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { ethers } from 'ethers';
import AuctionFactoryABI from '../contracts/AuctionFactory.json';
import { useWeb3 } from '../context/Web3Context';

const CreateAuction = () => {
    const { account, provider } = useWeb3();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Basic auction details
        title: '',
        description: '',
        startingPrice: '',
        duration: '7', // Default to 7 days
        auctionType: 'english', // Default to English auction
        
        // Item type and details
        itemType: 'digital', // digital, physical, or nft
        itemDetails: {
            // Physical item details
        shippingAddress: '',
            condition: '',
            dimensions: '',
            weight: '',
            images: [],
            
            // NFT details
            contractAddress: '',
            tokenId: '',
            
            // Common details
            name: '',
            description: '',
            image: null
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('itemDetails.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                    ...prev,
                itemDetails: {
                    ...prev.itemDetails,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setError('Transaction is taking too long. Please check your wallet and try again.');
        }, 30000); // 30 seconds timeout

        try {
            if (!account || !provider) {
                throw new Error('Please connect your wallet first');
            }

            // Validate form data
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }
            if (!formData.description.trim()) {
                throw new Error('Description is required');
            }
            if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
                throw new Error('Starting price must be greater than 0');
            }
            if (!formData.duration || parseInt(formData.duration) <= 0) {
                throw new Error('Duration must be greater than 0');
            }

            console.log('Getting signer...');
            const signer = await provider.getSigner();
            const factoryAddress = process.env.REACT_APP_AUCTION_FACTORY_ADDRESS;
            
            if (!factoryAddress) {
                throw new Error('Auction factory address not configured');
            }

            console.log('Creating contract instance...');
            const factory = new ethers.Contract(factoryAddress, AuctionFactoryABI.abi, signer);

            // Generate a unique ID for the auction
            const auctionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            console.log('Creating auction transaction...');
            let tx;
            if (formData.auctionType === 'english') {
                tx = await factory.createEnglishAuction(
                    auctionId,
                    ethers.parseEther(formData.startingPrice.toString()),
                    formData.duration * 24 * 60 * 60, // Convert days to seconds
                    formData.description,
                    formData.title,
                    formData.itemDetails.description
                );
            } else if (formData.auctionType === 'dutch') {
                tx = await factory.createDutchAuction(
                    auctionId,
                    ethers.parseEther(formData.startingPrice.toString()),
                    ethers.parseEther((parseFloat(formData.startingPrice) * 0.5).toString()), // 50% of starting price as minimum
                    ethers.parseEther((parseFloat(formData.startingPrice) * 0.1).toString()), // 10% decrement
                    3600, // 1 hour decrement time
                    formData.duration * 24 * 60 * 60, // Convert days to seconds
                    formData.description,
                    formData.title,
                    formData.itemDetails.description
                );
            } else {
                throw new Error('Invalid auction type');
            }

            console.log('Waiting for transaction to be mined...');
            // Wait for transaction to be mined with a timeout
            const receipt = await Promise.race([
                tx.wait(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Transaction timeout')), 30000)
                )
            ]);

            clearTimeout(timeoutId);
            setSuccess(true);
            
            // Show success message for 3 seconds before redirecting
            setTimeout(() => {
                navigate('/auctions');
            }, 3000);
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Error creating auction:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                data: error.data,
                transaction: error.transaction
            });
            setError(error.message || 'Failed to create auction. Please check your wallet and try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Item Type</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="digital"
                                    name="itemType"
                                    value="digital"
                                    checked={formData.itemType === 'digital'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="digital">Digital Item</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="physical"
                                    name="itemType"
                                    value="physical"
                                    checked={formData.itemType === 'physical'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="physical">Physical Item</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="nft"
                                    name="itemType"
                                    value="nft"
                                    checked={formData.itemType === 'nft'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="nft">NFT</label>
                            </div>
                            {formData.itemType === 'nft' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2">NFT Contract Address</label>
                                        <input
                                            type="text"
                                            name="itemDetails.contractAddress"
                                            value={formData.itemDetails.contractAddress}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Token ID</label>
                                        <input
                                            type="text"
                                            name="itemDetails.tokenId"
                                            value={formData.itemDetails.tokenId}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-700"
                                        />
                                    </div>
                                </div>
                            )}
                            {formData.itemType === 'physical' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2">Shipping Address</label>
                                        <textarea
                                            name="itemDetails.shippingAddress"
                                            value={formData.itemDetails.shippingAddress}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Item Condition</label>
                                        <select
                                            name="itemDetails.condition"
                                            value={formData.itemDetails.condition}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-700"
                                        >
                                            <option value="">Select Condition</option>
                                            <option value="new">New</option>
                                            <option value="like_new">Like New</option>
                                            <option value="very_good">Very Good</option>
                                            <option value="good">Good</option>
                                            <option value="acceptable">Acceptable</option>
                                            <option value="used">Used</option>
                                            <option value="for_parts">For Parts or Not Working</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2">Dimensions</label>
                                        <input
                                            type="text"
                                            name="itemDetails.dimensions"
                                            value={formData.itemDetails.dimensions}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Weight (kg)</label>
                                        <input
                                            type="number"
                                            name="itemDetails.weight"
                                            value={formData.itemDetails.weight}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-700"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Select Auction Type</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="fixedSwap"
                                    name="auctionType"
                                    value="fixedSwap"
                                    checked={formData.auctionType === 'fixedSwap'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="fixedSwap">Fixed Swap Auction</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="dutch"
                                    name="auctionType"
                                    value="dutch"
                                    checked={formData.auctionType === 'dutch'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="dutch">Dutch Auction</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="english"
                                    name="auctionType"
                                    value="english"
                                    checked={formData.auctionType === 'english'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="english">English Auction</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="sealedBid"
                                    name="auctionType"
                                    value="sealedBid"
                                    checked={formData.auctionType === 'sealedBid'}
                                    onChange={handleInputChange}
                                    className="text-purple-600"
                                />
                                <label htmlFor="sealedBid">Sealed Bid Auction</label>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Auction Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Starting Price (ETH)</label>
                                <input
                                    type="number"
                                    name="startingPrice"
                                    value={formData.startingPrice}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Duration (days)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-700"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <BackButton />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Create New Auction</h1>
                
                {/* Success Message */}
                {success && (
                    <div className="mb-8 p-4 bg-green-600 text-white rounded-lg">
                        <p className="text-lg font-semibold">Auction created successfully!</p>
                        <p className="text-sm">Redirecting to auctions page...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-600 text-white rounded-lg">
                        <p className="text-lg font-semibold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`flex items-center ${
                                stepNumber < 3 ? 'flex-1' : ''
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step >= stepNumber
                                        ? 'bg-purple-600'
                                        : 'bg-gray-700'
                                }`}
                            >
                                {stepNumber}
                            </div>
                            {stepNumber < 3 && (
                                <div
                                    className={`flex-1 h-1 mx-2 ${
                                        step > stepNumber
                                            ? 'bg-purple-600'
                                            : 'bg-gray-700'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {renderStepContent()}

                    <div className="flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Processing...' : 'Schedule Auction'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAuction;
