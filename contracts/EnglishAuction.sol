// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PhysicalItemBase.sol";

contract EnglishAuction is PhysicalItemBase, ReentrancyGuard, Pausable {
    address private _seller;
    string public description;
    string public image;
    uint256 public startingPrice;
    uint256 public currentPrice;
    uint256 public endTime;
    address private _highestBidder;
    bool public isCompleted;

    modifier onlyEscrowFunded() override {
        require(escrowFunded, "Escrow not funded");
        _;
    }

    modifier onlySeller() override {
        require(msg.sender == _seller, "Only seller can call this");
        _;
    }

    modifier onlyBuyer() override {
        require(msg.sender == _highestBidder, "Only buyer can call this");
        _;
    }

    constructor(
        string memory _description,
        string memory _image,
        uint256 _startingPrice,
        uint256 _duration,
        string memory _name,
        string memory _itemDescription,
        string memory _condition,
        string memory _dimensions,
        uint256 _weight,
        string[] memory _images,
        string memory _shippingAddress,
        bool _isPhysical
    ) {
        _seller = msg.sender;
        description = _description;
        image = _image;
        startingPrice = _startingPrice;
        currentPrice = _startingPrice;
        endTime = block.timestamp + _duration;
        isCompleted = false;

        // Initialize physical item details
        item = PhysicalItem({
            name: _name,
            description: _itemDescription,
            condition: _condition,
            dimensions: _dimensions,
            weight: _weight,
            images: _images,
            shippingAddress: _shippingAddress,
            isPhysical: _isPhysical
        });

        emit AuctionCreated(msg.sender, _startingPrice, _duration, _description);
    }

    function getCurrentPrice() external view override returns (uint256) {
        return currentPrice;
    }

    function placeBid() external payable override nonReentrant whenNotPaused {
        require(!isCompleted, "Auction has ended");
        require(block.timestamp < endTime, "Auction has expired");
        require(msg.value > currentPrice, "Bid must be higher than current price");

        if (_highestBidder != address(0)) {
            // Refund the previous highest bidder
            payable(_highestBidder).transfer(currentPrice);
        }

        _highestBidder = msg.sender;
        currentPrice = msg.value;

        emit BidPlaced(msg.sender, msg.value);
    }

    function endAuction() external override {
        require(!isCompleted, "Auction already ended");
        require(block.timestamp >= endTime, "Auction still active");
        
        isCompleted = true;
        
        if (_highestBidder != address(0)) {
            if (item.isPhysical) {
                // Create escrow for physical items
                uint256 escrowFee = getEscrowAmount();
                escrow = Escrow({
                    isActive: true,
                    escrowAgent: address(this),
                    escrowFee: escrowFee,
                    itemReceived: false,
                    paymentReleased: false
                });
                emit EscrowCreated(escrow.escrowAgent, escrowFee);
            } else {
                // For digital items, transfer payment immediately
                payable(_seller).transfer(currentPrice);
            }
        }

        emit AuctionEnded(_highestBidder, currentPrice);
    }

    function seller() public view override returns (address) {
        return _seller;
    }

    function winner() public view override returns (address) {
        return _highestBidder;
    }

    function getAuctionDetails() external view override returns (
        address sellerAddr,
        string memory desc,
        string memory img,
        uint256 auctionPrice,
        uint256 auctionEndTime,
        bool completed,
        address winnerAddr,
        PhysicalItem memory physicalItem,
        Escrow memory escrowInfo
    ) {
        return (
            _seller,
            description,
            image,
            currentPrice,
            endTime,
            isCompleted,
            _highestBidder,
            item,
            escrow
        );
    }

    function auctioneer() public view override returns (address) {
        return _seller;
    }

    function getAuctionPrice() public view override returns (uint256) {
        return currentPrice;
    }

    function purchases(address) public pure override returns (uint256) {
        return 0; // English auctions don't track purchases
    }

    function onlyOwner() internal override {
        require(msg.sender == _seller, "Only owner can call this");
    }
}
