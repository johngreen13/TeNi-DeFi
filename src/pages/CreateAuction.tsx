import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateAuction = () => {
  const [auctionType, setAuctionType] = useState('fixed');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    tokenA: '',
    tokenAAmount: '',
    tokenB: '',
    tokenBAmount: '',
    startPrice: '',
    endPrice: '',
    duration: '24',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the auction data to the blockchain
    alert('Auction created successfully! (This is a mock implementation)');
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Token to Receive</label>
                <input
                  type="text"
                  name="tokenB"
                  value={formData.tokenB}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Token symbol or address"
                />
              </div>
              {auctionType === 'fixed' && (
                <div>
                  <label className="block text-gray-300 mb-2">Fixed Price (per token)</label>
                  <input
                    type="text"
                    name="tokenBAmount"
                    value={formData.tokenBAmount}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter price"
                  />
                </div>
              )}
            </div>

            {auctionType === 'dutch' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2">Starting Price</label>
                  <input
                    type="text"
                    name="startPrice"
                    value={formData.startPrice}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter starting price"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Ending Price</label>
                  <input
                    type="text"
                    name="endPrice"
                    value={formData.endPrice}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter ending price"
                  />
                </div>
              </div>
            )}

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

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Description (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                placeholder="Provide additional details about your auction"
              ></textarea>
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
                <div>
                  <p className="text-gray-400 text-sm">Token to Sell</p>
                  <p className="text-white">{formData.tokenA || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount to Sell</p>
                  <p className="text-white">{formData.tokenAAmount || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Token to Receive</p>
                  <p className="text-white">{formData.tokenB || 'Not specified'}</p>
                </div>
                {auctionType === 'fixed' ? (
                  <div>
                    <p className="text-gray-400 text-sm">Fixed Price</p>
                    <p className="text-white">{formData.tokenBAmount || 'Not specified'}</p>
                  </div>
                ) : auctionType === 'dutch' ? (
                  <>
                    <div>
                      <p className="text-gray-400 text-sm">Starting Price</p>
                      <p className="text-white">{formData.startPrice || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Ending Price</p>
                      <p className="text-white">{formData.endPrice || 'Not specified'}</p>
                    </div>
                  </>
                ) : null}
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
                  Creating an auction requires a transaction on the blockchain. Make sure you have enough ETH to cover gas fees. This action cannot be undone once confirmed.
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Auction</h1>

        {/* Progress Steps */}
        <div className="flex mb-8">
          <div className="flex-1">
            <div className={`h-1 ${step >= 1 ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
            <div className="flex items-center mt-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-500' : 'bg-gray-700'}`}>
                <span className="text-xs text-white">1</span>
              </div>
              <span className="ml-2 text-sm text-gray-400">Type</span>
            </div>
          </div>
          <div className="flex-1">
            <div className={`h-1 ${step >= 2 ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
            <div className="flex items-center mt-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-500' : 'bg-gray-700'}`}>
                <span className="text-xs text-white">2</span>
              </div>
              <span className="ml-2 text-sm text-gray-400">Configure</span>
            </div>
          </div>
          <div className="flex-1">
            <div className={`h-1 ${step >= 3 ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
            <div className="flex items-center mt-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-500' : 'bg-gray-700'}`}>
                <span className="text-xs text-white">3</span>
              </div>
              <span className="ml-2 text-sm text-gray-400">Review</span>
            </div>
          </div>
        </div>

        {renderStepContent()}
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4 flex items-start">
        <HelpCircle className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-gray-300 text-sm">
            Need help? Check out our <a href="#" className="text-purple-400 hover:text-purple-300">documentation</a> or <a href="#" className="text-purple-400 hover:text-purple-300">contact support</a> for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;