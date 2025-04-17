// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAuction {
    struct PhysicalItem {
        string name;
        string description;
        string condition;
        string dimensions;
        uint256 weight;
        string[] images;
        string shippingAddress;
        bool isPhysical;
    }

    struct Escrow {
        bool isActive;
        address escrowAgent;
        uint256 escrowFee;
        bool itemReceived;
        bool paymentReleased;
    }

    // Core auction events
    event AuctionCreated(address indexed seller, uint256 startingPrice, uint256 duration, string description);
    event BidPlaced(address indexed bidder, uint256 amount);
    event AuctionEnded(address indexed winner, uint256 amount);

    // Escrow and physical item events
    event EscrowCreated(address indexed escrowAgent, uint256 escrowFee);
    event EscrowFunded(uint256 amount);
    event ItemShipped(address indexed seller, string trackingNumber);
    event ItemReceived(address indexed buyer, bool conditionMet);
    event EscrowReleased(address indexed seller, uint256 amount);
    event EscrowRefunded(address indexed buyer, uint256 amount);
    event DisputeRaised(address indexed buyer, string reason);
    event DisputeResolved(address indexed winner, uint256 amount);

    // Core auction functions
    function getCurrentPrice() external view returns (uint256);
    function placeBid() external payable;
    function endAuction() external;
    
    // Physical item and escrow functions
    function fundEscrow() external payable;
    function shipItem(string memory trackingNumber) external;
    function confirmItemReceived(bool conditionMet) external;
    function raiseDispute(string memory reason) external;
    function resolveDispute(address disputeWinner) external;
    
    // View functions
    function getAuctionDetails() external view returns (
        address seller,
        string memory description,
        string memory image,
        uint256 currentPrice,
        uint256 endTime,
        bool isCompleted,
        address winner,
        PhysicalItem memory item,
        Escrow memory escrow
    );
    
    // Required view functions
    function auctioneer() external view returns (address);
    function getAuctionPrice() external view returns (uint256);
    function seller() external view returns (address);
    function winner() external view returns (address);
    function purchases(address) external view returns (uint256);
} 