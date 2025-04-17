import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createAuction } from '../utils/auction';
import AuctionABI from '../contracts/AuctionABI.json';
import { ethers } from 'ethers';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [auctionType, setAuctionType] = useState('fixed');
  const [step, setStep] = useState(1);
  const [isPhysicalItem, setIsPhysicalItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    tokenA: '',
    tokenAAmount: '',
    tokenB: '',
    tokenBAmount: '',
    startPrice: '',
    endPrice: '',
    duration: '24',
    description: '',
    // Physical item fields
    itemName: '',
    itemCondition: '',
    itemDimensions: '',
    itemWeight: '',
    shippingAddress: '',
    images: [] as File[]
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user makes changes
    setError('');
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const validateForm = () => {
    if (!formData.title) {
      setError('Title is required');
      return false;
    }
    if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
      setError('Starting price must be greater than 0');
      return false;
    }
    if (auctionType === 'dutch' && (!formData.endPrice || parseFloat(formData.endPrice) <= 0)) {
      setError('End price must be greater than 0 for Dutch auctions');
      return false;
    }
    if (!formData.duration) {
      setError('Duration is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('Preparing auction data...');
      
      const auctionData = {
        title: formData.title,
        description: formData.description,
        startingPrice: formData.startPrice,
        endPrice: auctionType === 'dutch' ? formData.endPrice : undefined,
        duration: formData.duration,
        isPhysicalItem,
        auctionType,
        itemDetails: isPhysicalItem ? {
          name: formData.itemName || formData.title,
          description: formData.description,
          condition: formData.itemCondition,
          dimensions: formData.itemDimensions,
          weight: formData.itemWeight,
          shippingAddress: formData.shippingAddress,
          isPhysical: true
        } : {
          name: formData.title,
          description: formData.description,
          condition: "",
          dimensions: "",
          weight: "0",
          shippingAddress: "",
          isPhysical: false
        },
        images: formData.images
      };

      console.log('Creating auction with data:', auctionData);
      const txHash = await createAuction(auctionData);
      console.log("Auction created with transaction hash:", txHash);
      
      // Show success message and redirect
      alert('Auction created successfully!');
      navigate('/auctions');
    } catch (error: any) {
      console.error("Error creating auction:", error);
      setError(error.message || 'Failed to create auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Select Auction Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`p-4 border rounded-lg cursor-pointer ${auctionType === 'fixed' ? 'border-purple-500 bg-gray-700' : 'border-gray-700 bg-gray-800'}`}
                onClick={() => setAuctionType('fixed')}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Fixed Swap Auction</h3>
                <p className="text-gray-400 text-sm">Sell tokens at a fixed price on a first-come, first-served basis.</p>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer ${auctionType === 'dutch' ? 'border-purple-500 bg-gray-700' : 'border-gray-700 bg-gray-800'}`}
                onClick={() => setAuctionType('dutch')}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Dutch Auction</h3>
                <p className="text-gray-400 text-sm">Start with a high price that gradually decreases until someone makes a purchase.</p>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer ${auctionType === 'english' ? 'border-purple-500 bg-gray-700' : 'border-gray-700 bg-gray-800'}`}
                onClick={() => setAuctionType('english')}
              >
                <h3 className="text-lg font-semibold text-white mb-2">English Auction</h3>
                <p className="text-gray-400 text-sm">Traditional auction format where the highest bidder wins.</p>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer ${auctionType === 'sealed' ? 'border-purple-500 bg-gray-700' : 'border-gray-700 bg-gray-800'}`}
                onClick={() => setAuctionType('sealed')}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Sealed-Bid Auction</h3>
                <p className="text-gray-400 text-sm">Bidders submit sealed bids, and the highest bidder wins.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={isPhysicalItem}
                  onChange={(e) => setIsPhysicalItem(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span>This is a physical item</span>
              </label>
            </div>

            {isPhysicalItem && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Condition</label>
                  <select
                    name="itemCondition"
                    value={formData.itemCondition}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Configure Auction</h2>
            
            {/* Common Fields */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Auction Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter a title for your auction"
              />
            </div>

            {/* Physical Item Fields */}
            {isPhysicalItem && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-white">Physical Item Details</h3>
                
                <div>
                  <label className="block text-gray-300 mb-2">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter item name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Dimensions</label>
                    <input
                      type="text"
                      name="itemDimensions"
                      value={formData.itemDimensions}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 10x5x3 inches"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Weight (in grams)</label>
                    <input
                      type="number"
                      name="itemWeight"
                      value={formData.itemWeight}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter weight"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Shipping Address</label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter shipping address"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Item Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-2 text-sm text-gray-400">
                      {formData.images.length} image(s) selected
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Token Fields */}
            {!isPhysicalItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2">Token to Sell</label>
                  <input
                    type="text"
                    name="tokenA"
                    value={formData.tokenA}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Token symbol or address"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Amount to Sell</label>
                  <input
                    type="text"
                    name="tokenAAmount"
                    value={formData.tokenAAmount}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            )}

            {/* Price Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Starting Price (ETH)</label>
                <input
                  type="text"
                  name="startPrice"
                  value={formData.startPrice}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter starting price"
                />
              </div>
              {auctionType === 'dutch' && (
                <div>
                  <label className="block text-gray-300 mb-2">Ending Price (ETH)</label>
                  <input
                    type="text"
                    name="endPrice"
                    value={formData.endPrice}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter ending price"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
                <option value="72">72 hours</option>
                <option value="168">7 days</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                placeholder="Provide additional details about your auction"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Review & Create</h2>

            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Auction Summary</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Auction Type</p>
                  <p className="text-white">
                    {auctionType === 'fixed' && 'Fixed Swap Auction'}
                    {auctionType === 'dutch' && 'Dutch Auction'}
                    {auctionType === 'english' && 'English Auction'}
                    {auctionType === 'sealed' && 'Sealed-Bid Auction'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Title</p>
                  <p className="text-white">{formData.title || 'Not specified'}</p>
                </div>

                {isPhysicalItem ? (
                  <>
                    <div>
                      <p className="text-gray-400 text-sm">Item Name</p>
                      <p className="text-white">{formData.itemName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Condition</p>
                      <p className="text-white">{formData.itemCondition || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Dimensions</p>
                      <p className="text-white">{formData.itemDimensions || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Weight</p>
                      <p className="text-white">{formData.itemWeight ? `${formData.itemWeight}g` : 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Shipping Address</p>
                      <p className="text-white">{formData.shippingAddress || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Images</p>
                      <p className="text-white">{formData.images.length} image(s)</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-400 text-sm">Token to Sell</p>
                      <p className="text-white">{formData.tokenA || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount to Sell</p>
                      <p className="text-white">{formData.tokenAAmount || 'Not specified'}</p>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-gray-400 text-sm">Starting Price</p>
                  <p className="text-white">{formData.startPrice ? `${formData.startPrice} ETH` : 'Not specified'}</p>
                </div>
                {auctionType === 'dutch' && (
                  <div>
                    <p className="text-gray-400 text-sm">Ending Price</p>
                    <p className="text-white">{formData.endPrice ? `${formData.endPrice} ETH` : 'Not specified'}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white">{formData.duration} hours</p>
                </div>
              </div>

              {formData.description && (
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{formData.description}</p>
                </div>
              )}
            </div>

            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-500 font-semibold">Important Notice</p>
                <p className="text-yellow-400 text-sm">
                  {isPhysicalItem 
                    ? "Creating a physical item auction requires an escrow service. A 2% fee will be charged for the escrow service. Make sure you have enough ETH to cover gas fees and the escrow fee. This action cannot be undone once confirmed."
                    : "Creating an auction requires a transaction on the blockchain. Make sure you have enough ETH to cover gas fees. This action cannot be undone once confirmed."}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
              >
                Create Auction
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/auctions" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Auctions
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <div className="flex items-center text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        {renderStepContent()}
      </div>

      {step === 2 && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="mr-2">Creating...</span>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
              </>
            ) : (
              'Create Auction'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAuction;