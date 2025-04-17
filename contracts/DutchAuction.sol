// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PhysicalItemBase.sol";

contract DutchAuction is PhysicalItemBase, ReentrancyGuard, Pausable {
    address private _seller;
    string public description;
    string public image;
    uint public startPrice;
    uint public endPrice;
    uint public duration;
    uint public startTime;
    bool public isCompleted;
    address private _winner;

    constructor(
        string memory _description,
        string memory _image,
        uint _startPrice,
        uint _endPrice,
        uint _duration,
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
        startPrice = _startPrice;
        endPrice = _endPrice;
        duration = _duration;
        startTime = block.timestamp;
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
    }

    function getCurrentPrice() public view override returns (uint) {
        if (block.timestamp >= startTime + duration) {
            return endPrice;
        }
        uint elapsedTime = block.timestamp - startTime;
        uint priceDrop = ((startPrice - endPrice) * elapsedTime) / duration;
        return startPrice - priceDrop;
    }

    function placeBid() external payable override nonReentrant whenNotPaused {
        require(!isCompleted, "Auction has already ended");
        uint currentPrice = getCurrentPrice();
        require(
            msg.value >= currentPrice,
            "Bid must meet or exceed the current price"
        );

        isCompleted = true;
        _winner = msg.sender;

        emit AuctionEnded(msg.sender, msg.value);

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
            if (msg.value > currentPrice) {
                payable(msg.sender).transfer(msg.value - currentPrice);
            }
        }
    }

    function endAuction() external override {
        require(!isCompleted, "Auction already ended");
        require(block.timestamp >= startTime + duration, "Auction still active");
        
        isCompleted = true;
        emit AuctionEnded(address(0), 0);
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

    function getAuctionDetails() external view override returns (
        address sellerAddr,
        string memory desc,
        string memory img,
        uint256 currentPrice,
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
            getCurrentPrice(),
            startTime + duration,
            isCompleted,
            _winner,
            item,
            escrow
        );
    }

    function seller() public view override returns (address) {
        return _seller;
    }

    function winner() public view override returns (address) {
        return _winner;
    }

    function auctioneer() public view override returns (address) {
        return _seller;
    }

    function getAuctionPrice() public view override returns (uint256) {
        return getCurrentPrice();
    }

    function purchases(address) public pure override returns (uint256) {
        return 0; // Dutch auctions don't track purchases
    }

    function onlyOwner() internal override {
        require(msg.sender == _seller, "Only owner can call this");
    }

    function getEscrowAmount() public view override returns (uint256) {
        uint256 currentPrice = getCurrentPrice();
        uint256 escrowFee = (currentPrice * ESCROW_FEE_PERCENTAGE) / 100;
        return escrowFee;
    }
}
