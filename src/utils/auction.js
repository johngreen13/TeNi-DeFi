import { ethers } from 'ethers';
import AuctionABI from '../contracts/Auction.json';
import { withErrorHandling, handleAuctionTypeError, estimateGasWithMargin } from './contractErrorHandler';
import { validateAuctionData } from './auctionValidation';

/**
 * Gets contract instance for the specified auction type
 * @param {string} auctionType - Type of auction (english, dutch, sealed, fixed)
 * @param {string} contractAddress - Address of the auction contract
 * @returns {ethers.Contract} Contract instance
 */
export const getContractInstance = async (contractAddress, auctionType, signer) => {
  if (!contractAddress || !auctionType || !signer) {
    throw new Error('Missing required parameters for contract instance');
  }
  return new ethers.Contract(contractAddress, AuctionABI.abi, signer);
};

/**
 * Creates a new auction
 * @param {Object} auctionData - Auction details
 * @param {string} auctionType - Type of auction
 * @returns {Promise<Object>} Transaction receipt
 */
export const createAuction = async (auctionType, params, signer) => {
  try {
    if (!auctionType || !params) {
      throw new Error('Missing required parameters for auction creation');
    }

    const factoryAddress = process.env.REACT_APP_AUCTION_FACTORY_ADDRESS;
    const factoryABI = process.env.REACT_APP_AUCTION_FACTORY_ABI;
    
    const factory = new ethers.Contract(factoryAddress, factoryABI, signer);
    const tx = await factory.createAuction(auctionType, params);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    throw error;
  }
};

/**
 * Places a bid on an auction
 * @param {string} auctionType - Type of auction
 * @param {string} contractAddress - Address of the auction contract
 * @param {string} amount - Bid amount in ETH
 * @returns {Promise<Object>} Transaction receipt
 */
export const placeBid = async (contractAddress, auctionType, bidAmount, signer) => {
  try {
    if (!bidAmount || bidAmount <= 0) {
      throw new Error('Invalid bid amount');
    }

    const contract = await getContractInstance(contractAddress, auctionType, signer);
    const tx = await contract.placeBid({ value: ethers.parseEther(bidAmount.toString()) });
    await tx.wait();
    return tx.hash;
  } catch (error) {
    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient funds for bid');
    }
    throw error;
  }
};

/**
 * Confirms shipment of a physical item
 * @param {string} auctionType - Type of auction
 * @param {string} contractAddress - Address of the auction contract
 * @param {string} trackingNumber - Shipping tracking number
 * @returns {Promise<Object>} Transaction receipt
 */
export const confirmItemShipped = async (contractAddress, auctionType, trackingNumber, signer) => {
  try {
    if (!trackingNumber) {
      throw new Error('Tracking number is required');
    }

    const contract = await getContractInstance(contractAddress, auctionType, signer);
    const tx = await contract.confirmItemShipped(trackingNumber);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    if (error.message.includes('not seller')) {
      throw new Error('Only the seller can confirm shipment');
    }
    throw error;
  }
};

/**
 * Confirms receipt of a physical item
 * @param {string} auctionType - Type of auction
 * @param {string} contractAddress - Address of the auction contract
 * @returns {Promise<Object>} Transaction receipt
 */
export const confirmItemReceived = async (contractAddress, auctionType, signer) => {
  try {
    const contract = await getContractInstance(contractAddress, auctionType, signer);
    const tx = await contract.confirmItemReceived();
    await tx.wait();
    return tx.hash;
  } catch (error) {
    if (error.message.includes('not winner')) {
      throw new Error('Only the auction winner can confirm receipt');
    }
    throw error;
  }
};

/**
 * Gets auction details
 * @param {string} auctionType - Type of auction
 * @param {string} contractAddress - Address of the auction contract
 * @returns {Promise<Object>} Auction details
 */
export async function getAuctionDetails(auctionType, contractAddress) {
  return withErrorHandling(async () => {
    const contract = await getContractInstance(contractAddress, auctionType);
    return await contract.getAuctionDetails();
  });
}

/**
 * Ends an auction
 * @param {string} auctionType - Type of auction
 * @param {string} contractAddress - Address of the auction contract
 * @returns {Promise<Object>} Transaction receipt
 */
export async function endAuction(auctionType, contractAddress) {
  return withErrorHandling(async () => {
    const contract = await getContractInstance(contractAddress, auctionType);
    
    const tx = await contract.endAuction({
      gasLimit: 200000 // Fixed gas limit for ending auction
    });

    return await tx.wait();
  }).catch(error => {
    throw handleAuctionTypeError(error, auctionType);
  });
}

/**
 * Withdraws funds from an auction
 * @param {string} auctionType - Type of auction
 * @param {string} contractAddress - Address of the auction contract
 * @returns {Promise<Object>} Transaction receipt
 */
export async function withdrawFunds(auctionType, contractAddress) {
  return withErrorHandling(async () => {
    const contract = await getContractInstance(contractAddress, auctionType);
    
    const tx = await contract.withdrawFunds({
      gasLimit: 200000 // Fixed gas limit for withdrawals
    });

    return await tx.wait();
  }).catch(error => {
    throw handleAuctionTypeError(error, auctionType);
  });
}

// Function to upload images to IPFS
const uploadImagesToIPFS = async (images) => {
  try {
    const imageHashes = [];
    for (const image of images) {
      // Convert File to Buffer
      const buffer = await image.arrayBuffer();
      // Upload to IPFS (implement your IPFS upload logic here)
      // For now, we'll return a mock hash
      const hash = `ipfs://mock-hash-${Date.now()}`;
      imageHashes.push(hash);
    }
    return imageHashes;
  } catch (error) {
    console.error('Error uploading images to IPFS:', error);
    throw error;
  }
};

export const getBiddersCount = async (auctionId) => {
  try {
    const contract = await getContractInstance();
    return await contract.getBiddersCount(auctionId);
  } catch (error) {
    console.error("Error getting bidders count:", error);
    throw error;
  }
};