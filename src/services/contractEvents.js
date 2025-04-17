import { ethers } from 'ethers';

class ContractEventService {
  constructor() {
    this.listeners = new Map();
    this.subscriptions = new Map();
  }

  // Initialize event listeners for an auction
  async initializeAuctionListeners(auctionId, auctionType, contract) {
    const eventTypes = this.getEventTypes(auctionType);
    const listeners = new Map();

    for (const eventType of eventTypes) {
      const listener = (...args) => {
        this.handleAuctionEvent(eventType, auctionId, ...args);
      };
      
      contract.on(eventType, listener);
      listeners.set(eventType, listener);
    }

    this.listeners.set(auctionId, listeners);
  }

  // Get event types based on auction type
  getEventTypes(auctionType) {
    const commonEvents = [
      'AuctionCreated',
      'AuctionEnded',
      'FundsWithdrawn'
    ];

    const specificEvents = {
      english: ['BidPlaced', 'BidWithdrawn'],
      dutch: ['PriceUpdated', 'AuctionPurchased'],
      sealed: ['BidCommitted', 'BidRevealed'],
      fixed: ['ItemPurchased', 'ItemsWithdrawn']
    };

    return [...commonEvents, ...(specificEvents[auctionType] || [])];
  }

  // Handle auction events
  async handleAuctionEvent(eventType, auctionId, ...args) {
    try {
      const handlers = {
        AuctionCreated: this.handleAuctionCreated,
        BidPlaced: this.handleBidPlaced,
        AuctionEnded: this.handleAuctionEnded,
        FundsWithdrawn: this.handleFundsWithdrawn,
        PriceUpdated: this.handlePriceUpdated,
        BidCommitted: this.handleBidCommitted,
        BidRevealed: this.handleBidRevealed,
        ItemPurchased: this.handleItemPurchased
      };

      const handler = handlers[eventType];
      if (handler) {
        await handler(auctionId, ...args);
      }

      // Notify subscribers
      this.notifySubscribers(auctionId, {
        type: eventType,
        data: args
      });
    } catch (error) {
      console.error(`Error handling ${eventType} event:`, error);
    }
  }

  // Event handlers
  async handleAuctionCreated(auctionId, seller, details) {
    console.log(`Auction ${auctionId} created by ${seller}`);
    // Update UI or state as needed
  }

  async handleBidPlaced(auctionId, bidder, amount) {
    console.log(`New bid placed on auction ${auctionId} by ${bidder}: ${ethers.formatEther(amount)} ETH`);
    // Update UI or state as needed
  }

  async handleAuctionEnded(auctionId, winner, amount) {
    console.log(`Auction ${auctionId} ended. Winner: ${winner}, Final price: ${ethers.formatEther(amount)} ETH`);
    // Update UI or state as needed
  }

  async handleFundsWithdrawn(auctionId, recipient, amount) {
    console.log(`Funds withdrawn from auction ${auctionId} by ${recipient}: ${ethers.formatEther(amount)} ETH`);
    // Update UI or state as needed
  }

  async handlePriceUpdated(auctionId, newPrice) {
    console.log(`Price updated for auction ${auctionId}: ${ethers.formatEther(newPrice)} ETH`);
    // Update UI or state as needed
  }

  async handleBidCommitted(auctionId, bidder, commitment) {
    console.log(`Bid committed for auction ${auctionId} by ${bidder}`);
    // Update UI or state as needed
  }

  async handleBidRevealed(auctionId, bidder, amount) {
    console.log(`Bid revealed for auction ${auctionId} by ${bidder}: ${ethers.formatEther(amount)} ETH`);
    // Update UI or state as needed
  }

  async handleItemPurchased(auctionId, buyer, amount, quantity) {
    console.log(`Items purchased from auction ${auctionId} by ${buyer}: ${quantity} items for ${ethers.formatEther(amount)} ETH`);
    // Update UI or state as needed
  }

  // Subscribe to auction updates
  subscribe(auctionId, callback) {
    if (!this.subscriptions.has(auctionId)) {
      this.subscriptions.set(auctionId, new Set());
    }
    this.subscriptions.get(auctionId).add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscriptions.get(auctionId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscriptions.delete(auctionId);
        }
      }
    };
  }

  // Notify subscribers of events
  notifySubscribers(auctionId, event) {
    const subs = this.subscriptions.get(auctionId);
    if (subs) {
      subs.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  // Clean up listeners for an auction
  cleanup(auctionId, contract) {
    const listeners = this.listeners.get(auctionId);
    if (listeners) {
      listeners.forEach((listener, eventType) => {
        contract.off(eventType, listener);
      });
      this.listeners.delete(auctionId);
    }
    this.subscriptions.delete(auctionId);
  }

  // Clean up all listeners
  cleanupAll(contracts) {
    this.listeners.forEach((listeners, auctionId) => {
      listeners.forEach((listener, eventType) => {
        contracts.forEach(contract => {
          contract.off(eventType, listener);
        });
      });
    });
    this.listeners.clear();
    this.subscriptions.clear();
  }
}

export const contractEventService = new ContractEventService(); 