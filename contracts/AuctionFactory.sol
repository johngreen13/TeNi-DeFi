// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuctionFactory is ReentrancyGuard, Ownable {
    // Structs
    struct Auction {
        string id;
        address creator;
        uint256 startingPrice;
        uint256 currentPrice;
        uint256 duration;
        uint256 startTime;
        uint256 endTime;
        string description;
        string title;
        AuctionType auctionType;
        AuctionStatus status;
        address highestBidder;
        uint256 highestBid;
        bool isPhysical;
    }

    struct DutchAuctionDetails {
        uint256 minimumPrice;
        uint256 decrementAmount;
        uint256 decrementTime;
    }

    // Enums
    enum AuctionType { ENGLISH, DUTCH }
    enum AuctionStatus { SCHEDULED, ACTIVE, ENDED, CANCELLED }

    // Events
    event AuctionCreated(
        string id,
        address creator,
        AuctionType auctionType,
        uint256 startingPrice,
        uint256 startTime
    );
    event BidPlaced(string auctionId, address bidder, uint256 amount);
    event AuctionEnded(string auctionId, address winner, uint256 finalPrice);

    // State variables
    mapping(string => Auction) public auctions;
    mapping(string => DutchAuctionDetails) public dutchAuctions;
    string[] public auctionIds;

    // Constructor
    constructor() {}

    // Create Auction Functions
    function createEnglishAuction(
        string memory _id,
        uint256 _startingPrice,
        uint256 _duration,
        string memory _description,
        string memory _title,
        string memory _itemDescription
    ) external nonReentrant {
        require(_startingPrice > 0, "Starting price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(bytes(_id).length > 0, "ID cannot be empty");

        Auction memory auction = Auction({
            id: _id,
            creator: msg.sender,
            startingPrice: _startingPrice,
            currentPrice: _startingPrice,
            duration: _duration,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            description: _description,
            title: _title,
            auctionType: AuctionType.ENGLISH,
            status: AuctionStatus.ACTIVE,
            highestBidder: address(0),
            highestBid: 0,
            isPhysical: false
        });

        auctions[_id] = auction;
        auctionIds.push(_id);
        emit AuctionCreated(_id, msg.sender, AuctionType.ENGLISH, _startingPrice, block.timestamp);
    }

    function createDutchAuction(
        string memory _id,
        uint256 _startingPrice,
        uint256 _minimumPrice,
        uint256 _decrementAmount,
        uint256 _decrementTime,
        uint256 _duration,
        string memory _description,
        string memory _title,
        string memory _itemDescription
    ) external nonReentrant {
        require(_startingPrice > _minimumPrice, "Starting price must be greater than minimum price");
        require(_decrementAmount > 0, "Decrement amount must be greater than 0");
        require(_decrementTime > 0, "Decrement time must be greater than 0");
        require(bytes(_id).length > 0, "ID cannot be empty");

        Auction memory auction = Auction({
            id: _id,
            creator: msg.sender,
            startingPrice: _startingPrice,
            currentPrice: _startingPrice,
            duration: _duration,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            description: _description,
            title: _title,
            auctionType: AuctionType.DUTCH,
            status: AuctionStatus.ACTIVE,
            highestBidder: address(0),
            highestBid: 0,
            isPhysical: false
        });

        DutchAuctionDetails memory details = DutchAuctionDetails({
            minimumPrice: _minimumPrice,
            decrementAmount: _decrementAmount,
            decrementTime: _decrementTime
        });

        auctions[_id] = auction;
        dutchAuctions[_id] = details;
        auctionIds.push(_id);
        emit AuctionCreated(_id, msg.sender, AuctionType.DUTCH, _startingPrice, block.timestamp);
    }

    // Bidding Functions
    function placeBid(string memory _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.status == AuctionStatus.ACTIVE, "Auction is not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.currentPrice, "Bid too low");

        if (auction.highestBidder != address(0)) {
            // Refund the previous highest bidder
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        auction.currentPrice = msg.value;

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    // Getter Functions
    function getAuction(string memory _id) external view returns (Auction memory) {
        return auctions[_id];
    }

    function getDutchAuctionDetails(string memory _id) external view returns (DutchAuctionDetails memory) {
        return dutchAuctions[_id];
    }

    function getAuctionCount() external view returns (uint256) {
        return auctionIds.length;
    }

    function getCurrentPrice(string memory _auctionId) public view returns (uint256) {
        Auction storage auction = auctions[_auctionId];
        
        if (auction.auctionType == AuctionType.DUTCH) {
            DutchAuctionDetails storage details = dutchAuctions[_auctionId];
            uint256 elapsedTime = block.timestamp - auction.startTime;
            uint256 decrements = elapsedTime / details.decrementTime;
            uint256 totalDecrement = decrements * details.decrementAmount;
            
            if (auction.startingPrice <= totalDecrement || auction.startingPrice - totalDecrement < details.minimumPrice) {
                return details.minimumPrice;
            }
            
            return auction.startingPrice - totalDecrement;
        }
        
        return auction.currentPrice;
    }
} 