import { ethers } from "ethers";
import EnglishAuctionABI from "../contracts/EnglishAuction.json";
import DutchAuctionABI from "../contracts/DutchAuction.json";
import SealedBidAuctionABI from "../contracts/SealedBidAuction.json";
import FixedSwapAuctionABI from "../contracts/FixedSwapAuction.json";

// Replace these with the deployed contract addresses
const englishAuctionAddress = "0xYourDeployedEnglishAuctionAddress";
const dutchAuctionAddress = "0xYourDeployedDutchAuctionAddress";
const sealedBidAuctionAddress = "0xYourDeployedSealedBidAuctionAddress";
const fixedSwapAuctionAddress = "0xYourDeployedFixedSwapAuctionAddress";

// Initialize provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Export contract instances
export const englishAuctionContract = new ethers.Contract(
    englishAuctionAddress,
    EnglishAuctionABI.abi,
    signer
);

export const dutchAuctionContract = new ethers.Contract(
    dutchAuctionAddress,
    DutchAuctionABI.abi,
    signer
);

export const sealedBidAuctionContract = new ethers.Contract(
    sealedBidAuctionAddress,
    SealedBidAuctionABI.abi,
    signer
);

export const fixedSwapAuctionContract = new ethers.Contract(
    fixedSwapAuctionAddress,
    FixedSwapAuctionABI.abi,
    signer
);

// Create a new auction
export const createAuction = async (auctionType, description, image, startingPrice, endTime, startNow) => {
    const tx = await auctionContract.createAuction(auctionType, description, image, startingPrice, endTime, startNow);
    await tx.wait();
    console.log("Auction created successfully!");
};

// Fetch all auctions
export const fetchAuctions = async () => {
    const auctionCount = await auctionContract.auctionCount();
    const auctions = [];
    for (let i = 1; i <= auctionCount; i++) {
        const auction = await auctionContract.auctions(i);
        auctions.push(auction);
    }
    return auctions;
};