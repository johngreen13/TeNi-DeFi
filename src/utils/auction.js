import Web3 from 'web3';
import AuctionABI from '../contracts/Auction.json'; // Adjust the path if necessary
import { ethers } from "ethers";
import { auctionContract } from "./auctionContract"; // Ensure this points to your deployed contract instance

// Initialize Web3
const web3 = new Web3(window.ethereum);

// Get the deployed contract address from the networks section
const networkId = Object.keys(AuctionABI.networks)[0]; // Assuming you're using the first network (e.g., Ganache)
const contractAddress = AuctionABI.networks[networkId].address;

// Initialize the contract
const auctionContract = new web3.eth.Contract(AuctionABI.abi, contractAddress);

export const createAuction = async (startingPrice, endTime, description, auctionId, image, startNow) => {
    try {
        // Convert startingPrice to uint256 (ETH to Wei)
        const formattedStartingPrice = ethers.utils.parseEther(startingPrice);

        // Convert endTime to uint256 (seconds)
        const formattedEndTime = Math.floor(Date.now() / 1000) + parseInt(endTime);

        // Call the smart contract function
        const tx = await auctionContract.createAuction(
            formattedStartingPrice,
            formattedEndTime,
            description,
            auctionId,
            image || "", // Pass an empty string if no image is provided
            startNow
        );

        await tx.wait();
        console.log("Auction created successfully!");
    } catch (error) {
        console.error("Error creating auction:", error);
        throw error;
    }
};

export const getAuctionDetails = async () => {
    try {
        const details = await auctionContract.methods.auctionDetails().call();
        console.log('Auction details:', details);
        return details;
    } catch (error) {
        console.error('Error fetching auction details:', error);
        throw error;
    }
};

export const placeBid = async (bidAmount, account) => {
    try {
        const result = await auctionContract.methods.bid().send({
            from: account,
            value: bidAmount,
        });
        console.log('Bid placed:', result);
        return result;
    } catch (error) {
        console.error('Error placing bid:', error);
        throw error;
    }
};

export default auctionContract;