// English Auction
class EnglishAuction {
  constructor(startingPrice) {
    if (typeof startingPrice !== 'number' || startingPrice <= 0) {
      throw new Error('Starting price must be a positive number.');
    }
    this.currentPrice = startingPrice;
    this.bids = [];
  }

  placeBid(bidAmount) {
    if (bidAmount > this.currentPrice) {
      this.currentPrice = bidAmount;
      this.bids.push(bidAmount);
      console.log(`New bid placed: ${bidAmount}`);
    } else {
      console.log(`Bid must be higher than the current price: ${this.currentPrice}`);
    }
  }

  getCurrentPrice() {
    return this.currentPrice;
  }
}

// Dutch Auction
class DutchAuction {
  constructor(startingPrice, decrement) {
    this.currentPrice = startingPrice;
    this.decrement = decrement;
  }

  lowerPrice() {
    this.currentPrice -= this.decrement;
    console.log(`Price lowered to: ${this.currentPrice}`);
  }

  acceptBid() {
    console.log(`Bid accepted at price: ${this.currentPrice}`);
    return this.currentPrice;
  }
}

// Sealed-Bid Auction
class SealedBidAuction {
  constructor() {
    this.bids = [];
  }

  submitBid(bidAmount) {
    this.bids.push(bidAmount);
    console.log(`Bid submitted: ${bidAmount}`);
  }

  revealWinner() {
    const highestBid = Math.max(...this.bids);
    console.log(`Winning bid: ${highestBid}`);
    return highestBid;
  }
}

// Example usage
const englishAuction = new EnglishAuction(100);
englishAuction.placeBid(120);
englishAuction.placeBid(130);
console.log(`Final price: ${englishAuction.getCurrentPrice()}`);

const dutchAuction = new DutchAuction(200, 10);
dutchAuction.lowerPrice();
dutchAuction.lowerPrice();
dutchAuction.acceptBid();

const sealedBidAuction = new SealedBidAuction();
sealedBidAuction.submitBid(150);
sealedBidAuction.submitBid(180);
sealedBidAuction.revealWinner();

export const createAuction = async (auction) => {
    try {
        console.log("Received auction object in createAuction():", auction);

        // Simulate sending the auction data to a backend or smart contract
        const response = await fetch("/api/createAuction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(auction),
        });

        if (!response.ok) {
            throw new Error("Failed to create auction");
        }

        console.log("Auction created successfully!");
    } catch (error) {
        console.error("Error in createAuction():", error);
        throw error;
    }
};