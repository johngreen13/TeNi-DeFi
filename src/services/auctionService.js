import { ethers } from 'ethers';
import EnglishAuction from '../contracts/EnglishAuction.json';

class AuctionService {
    constructor() {
        this.contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with your deployed contract address
        this.contractABI = EnglishAuction.abi;
    }

    async init() {
        if (typeof window.ethereum === "undefined") {
            throw new Error("Please install MetaMask");
        }

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.signer
        );
    }

    async createEnglishAuction(auctionDetails) {
        try {
            await this.init();

            const {
                id,
                startingPrice,
                duration,
                description
            } = auctionDetails;

            // Convert price to wei
            const priceInWei = ethers.utils.parseEther(startingPrice.toString());
            
            // Convert duration to seconds
            const durationInSeconds = duration * 3600; // Convert hours to seconds

            const tx = await this.contract.createAuction(
                id,
                priceInWei,
                durationInSeconds,
                description
            );

            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error("Error creating auction:", error);
            throw error;
        }
    }

    async placeBid(auctionId, bidAmount) {
        try {
            await this.init();
            const bidInWei = ethers.utils.parseEther(bidAmount.toString());
            
            const tx = await this.contract.placeBid(auctionId, {
                value: bidInWei
            });

            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error("Error placing bid:", error);
            throw error;
        }
    }

    async getAuction(auctionId) {
        try {
            await this.init();
            const auction = await this.contract.getAuction(auctionId);
            return this.formatAuction(auction);
        } catch (error) {
            console.error("Error getting auction:", error);
            throw error;
        }
    }

    formatAuction(auctionData) {
        return {
            seller: auctionData[0],
            startingPrice: ethers.utils.formatEther(auctionData[1]),
            currentPrice: ethers.utils.formatEther(auctionData[2]),
            endTime: new Date(auctionData[3].toNumber() * 1000),
            highestBidder: auctionData[4],
            ended: auctionData[5],
            description: auctionData[6]
        };
    }
}

export default new AuctionService(); 