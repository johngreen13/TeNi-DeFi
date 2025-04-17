// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PhysicalItemBase.sol";

contract SealedBidAuction is PhysicalItemBase, ReentrancyGuard, Pausable {
    uint public endTime;
    uint public startingPrice;
    uint public reservePrice;
    address private _seller;
    bool public ended;
    mapping(address => uint) public bids;
    address private _highestBidder;
    uint public highestBid;
    address[] public bidders;
    
    constructor(
        uint _duration,
        uint _startingPrice,
        uint _reservePrice,
        string memory _name,
        string memory _description,
        string memory _condition,
        string memory _dimensions,
        uint256 _weight,
        string[] memory _images,
        string memory _shippingAddress,
        bool _isPhysical
    ) {
        _seller = msg.sender;
        endTime = block.timestamp + _duration;
        startingPrice = _startingPrice;
        reservePrice = _reservePrice;
        ended = false;

        // Initialize physical item details
        item = PhysicalItem({
            name: _name,
            description: _description,
            condition: _condition,
            dimensions: _dimensions,
            weight: _weight,
            images: _images,
            shippingAddress: _shippingAddress,
            isPhysical: _isPhysical
        });

        emit AuctionCreated(msg.sender, _startingPrice, _duration, _description);
    }

    function getCurrentPrice() public view override returns (uint256) {
        return startingPrice;
    }

    function placeBid() external payable override nonReentrant whenNotPaused {
        require(!ended, "Auction has ended");
        require(block.timestamp < endTime, "Auction has expired");
        require(msg.value >= startingPrice, "Bid must meet or exceed starting price");
        require(bids[msg.sender] == 0, "Already placed a bid");

        bids[msg.sender] = msg.value;
        bidders.push(msg.sender);

        if (msg.value > highestBid) {
            _highestBidder = msg.sender;
            highestBid = msg.value;
        }

        emit BidPlaced(msg.sender, msg.value);
    }

    function endAuction() external override {
        require(!ended, "Auction already ended");
        require(block.timestamp >= endTime, "Auction still active");
        
        ended = true;
        
        if (highestBid >= reservePrice) {
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
                payable(_seller).transfer(highestBid);
            }
        }

        emit AuctionEnded(_highestBidder, highestBid);
    }

    function fundEscrow() external payable override onlySeller {
        require(!escrowFunded, "Escrow already funded");
        require(msg.value > 0, "Must send ETH");
        
        uint256 escrowAmount = getEscrowAmount();
        require(msg.value >= escrowAmount, "Insufficient escrow amount");
        
        escrowBalance = escrowAmount;
        escrowFunded = true;
        emit EscrowFunded(escrowAmount);
    }

    function shipItem(string memory trackingNumber) external override onlySeller onlyEscrowFunded {
        require(escrow.isActive, "Escrow not active");
        require(bytes(trackingNumber).length > 0, "Invalid tracking number");
        
        escrow.isActive = false;
        emit ItemShipped(msg.sender, trackingNumber);
    }

    function confirmItemReceived(bool conditionMet) external override onlyBuyer onlyEscrowFunded {
        require(!escrow.isActive, "Escrow still active");
        require(!escrow.itemReceived, "Item already received");
        
        escrow.itemReceived = true;
        escrow.paymentReleased = true;
        emit ItemReceived(msg.sender, conditionMet);
        
        if (conditionMet) {
            // Release escrow to seller
            uint256 sellerAmount = escrowBalance;
            escrowBalance = 0;
            (bool success, ) = payable(_seller).call{value: sellerAmount}("");
            require(success, "Transfer failed");
            emit EscrowReleased(_seller, sellerAmount);
        } else {
            // Refund escrow to buyer
            uint256 buyerAmount = escrowBalance;
            escrowBalance = 0;
            (bool success, ) = payable(msg.sender).call{value: buyerAmount}("");
            require(success, "Transfer failed");
            emit EscrowRefunded(msg.sender, buyerAmount);
        }
    }

    function raiseDispute(string memory reason) external override onlyBuyer onlyEscrowFunded {
        require(!escrow.isActive, "Escrow still active");
        require(!escrow.itemReceived, "Item already received");
        emit DisputeRaised(msg.sender, reason);
    }

    function resolveDispute(address disputeWinner) external override onlySeller onlyEscrowFunded {
        require(!escrow.isActive, "Escrow still active");
        require(!escrow.itemReceived, "Item already received");
        require(!escrow.paymentReleased, "Payment already released");
        
        uint256 amount = escrowBalance;
        escrowBalance = 0;
        escrow.paymentReleased = true;
        
        (bool success, ) = payable(disputeWinner).call{value: amount}("");
        require(success, "Transfer failed");
        emit DisputeResolved(disputeWinner, amount);
    }

    function getEscrowAmount() public view override returns (uint256) {
        return (highestBid * ESCROW_FEE_PERCENTAGE) / ESCROW_FEE_DENOMINATOR;
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
            item.description,
            "", // No image in sealed bid auctions
            startingPrice,
            endTime,
            ended,
            _highestBidder,
            item,
            escrow
        );
    }

    function getBiddersCount() external view returns (uint) {
        return bidders.length;
    }

    function auctioneer() public view override returns (address) {
        return _seller;
    }

    function getAuctionPrice() public view override returns (uint256) {
        return getCurrentPrice();
    }

    function purchases(address) public pure override returns (uint256) {
        return 0; // Sealed bid auctions don't track purchases
    }

    function onlyOwner() internal override {
        require(msg.sender == _seller, "Only owner can call this");
    }

    function seller() public view override returns (address) {
        return _seller;
    }

    function winner() public view override returns (address) {
        return _highestBidder;
    }
}

