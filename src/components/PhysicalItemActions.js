import React, { useState } from 'react';
import { Package, CheckCircle, AlertCircle } from 'lucide-react';
import { confirmItemShipped, confirmItemReceived } from '../utils/auction';

const PhysicalItemActions = ({ auctionId, isSeller, isBuyer, itemDetails, escrowDetails }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShippingConfirmation = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await confirmItemShipped(auctionId, trackingNumber);
      setSuccess('Shipping confirmed successfully!');
    } catch (err) {
      setError('Failed to confirm shipping: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptConfirmation = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await confirmItemReceived(auctionId);
      setSuccess('Item receipt confirmed successfully!');
    } catch (err) {
      setError('Failed to confirm receipt: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!itemDetails.isPhysical) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">Physical Item Actions</h3>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 p-4 rounded-lg mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg mb-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {isSeller && !escrowDetails.itemReceived && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Tracking Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter tracking number"
            />
            <button
              onClick={handleShippingConfirmation}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Package className="h-5 w-5 mr-2" />
              {loading ? 'Confirming...' : 'Confirm Shipping'}
            </button>
          </div>
        </div>
      )}

      {isBuyer && escrowDetails.isActive && !escrowDetails.itemReceived && (
        <div className="mb-4">
          <p className="text-gray-400 mb-2">
            Please confirm receipt of the item at: {itemDetails.shippingAddress}
          </p>
          <button
            onClick={handleReceiptConfirmation}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {loading ? 'Confirming...' : 'Confirm Receipt'}
          </button>
        </div>
      )}

      {escrowDetails.isActive && (
        <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg">
          <h4 className="text-yellow-500 font-semibold mb-2">Escrow Status</h4>
          <div className="space-y-2">
            <p className="text-yellow-400">
              Escrow Fee: {(escrowDetails.escrowFee / 1e18).toFixed(4)} ETH
            </p>
            <p className="text-yellow-400">
              Status: {escrowDetails.itemReceived ? 'Item Received' : 'Pending Receipt'}
            </p>
            <p className="text-yellow-400">
              Payment: {escrowDetails.paymentReleased ? 'Released' : 'Held in Escrow'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalItemActions; 