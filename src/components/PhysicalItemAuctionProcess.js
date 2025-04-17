import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import { AlertCircle, Package, CheckCircle, AlertTriangle } from 'lucide-react';

const PhysicalItemAuctionProcess = ({ contract, auctionId }) => {
    const [status, setStatus] = useState('pending');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [disputeReason, setDisputeReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFundEscrow = async () => {
        try {
            setLoading(true);
            const escrowAmount = await contract.getEscrowAmount(auctionId);
            const tx = await contract.fundEscrow(auctionId, { value: escrowAmount });
            await tx.wait();
            setStatus('escrow_funded');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleShipItem = async () => {
        try {
            setLoading(true);
            const tx = await contract.shipItem(auctionId, trackingNumber);
            await tx.wait();
            setStatus('shipped');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReceipt = async (conditionMet) => {
        try {
            setLoading(true);
            const tx = await contract.confirmItemReceived(auctionId, conditionMet);
            await tx.wait();
            setStatus('completed');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRaiseDispute = async () => {
        try {
            setLoading(true);
            const tx = await contract.raiseDispute(auctionId, disputeReason);
            await tx.wait();
            setStatus('disputed');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Physical Item Process</h2>
            
            {error && (
                <div className="bg-red-900 bg-opacity-30 border border-red-700 p-4 rounded-lg mb-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-500 font-semibold">Error</p>
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {status === 'pending' && (
                    <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 p-4 rounded-lg">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-yellow-500 font-semibold">Escrow Required</p>
                                <p className="text-yellow-400 text-sm">
                                    This is a physical item auction. You need to fund the escrow before proceeding.
                                </p>
                                <button
                                    onClick={handleFundEscrow}
                                    disabled={loading}
                                    className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {loading ? 'Processing...' : 'Fund Escrow'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'escrow_funded' && (
                    <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg">
                        <div className="flex items-start">
                            <Package className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-blue-500 font-semibold">Ship Item</p>
                                <p className="text-blue-400 text-sm">
                                    Please enter the tracking number and confirm shipping.
                                </p>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Enter tracking number"
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleShipItem}
                                    disabled={loading || !trackingNumber}
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {loading ? 'Processing...' : 'Confirm Shipping'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'shipped' && (
                    <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg">
                        <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-green-500 font-semibold">Confirm Receipt</p>
                                <p className="text-green-400 text-sm">
                                    Please confirm if you received the item in the expected condition.
                                </p>
                                <div className="mt-4 space-x-4">
                                    <button
                                        onClick={() => handleConfirmReceipt(true)}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {loading ? 'Processing...' : 'Item Received in Good Condition'}
                                    </button>
                                    <button
                                        onClick={() => handleConfirmReceipt(false)}
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {loading ? 'Processing...' : 'Item Not as Described'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'disputed' && (
                    <div className="bg-red-900 bg-opacity-30 border border-red-700 p-4 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-500 font-semibold">Dispute Raised</p>
                                <p className="text-red-400 text-sm">
                                    A dispute has been raised. Please provide details about the issue.
                                </p>
                                <div className="mt-2">
                                    <textarea
                                        value={disputeReason}
                                        onChange={(e) => setDisputeReason(e.target.value)}
                                        placeholder="Describe the issue..."
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        rows={3}
                                    />
                                </div>
                                <button
                                    onClick={handleRaiseDispute}
                                    disabled={loading || !disputeReason}
                                    className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {loading ? 'Processing...' : 'Submit Dispute'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'completed' && (
                    <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg">
                        <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-green-500 font-semibold">Transaction Completed</p>
                                <p className="text-green-400 text-sm">
                                    The physical item transaction has been completed successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhysicalItemAuctionProcess; 