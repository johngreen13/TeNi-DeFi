// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IAuction.sol";

abstract contract PhysicalItemBase is IAuction {
    // Constants
    uint256 internal constant ESCROW_FEE_PERCENTAGE = 2;
    uint256 internal constant ESCROW_FEE_DENOMINATOR = 10000;

    // State variables
    uint256 public escrowBalance;
    bool public escrowFunded;
    bool public escrowReleased;

    // Physical item details
    PhysicalItem public item;
    Escrow public escrow;

    modifier onlyEscrowFunded() virtual {
        require(escrowFunded, "Escrow not funded");
        _;
    }

    modifier onlySeller() virtual {
        require(msg.sender == seller(), "Only seller can call this");
        _;
    }

    modifier onlyBuyer() virtual {
        require(msg.sender == winner(), "Only buyer can call this");
        _;
    }

    function fundEscrow() external payable virtual onlySeller {
        require(!escrowFunded, "Escrow already funded");
        require(msg.value > 0, "Must send ETH");
        
        uint256 escrowAmount = (getAuctionPrice() * ESCROW_FEE_PERCENTAGE) / 100;
        require(msg.value >= escrowAmount, "Insufficient escrow amount");
        
        escrowBalance = escrowAmount;
        escrowFunded = true;
        emit EscrowFunded(escrowAmount);
    }

    function shipItem(string memory trackingNumber) external virtual onlySeller onlyEscrowFunded {
        require(escrow.isActive, "Escrow not active");
        require(bytes(trackingNumber).length > 0, "Invalid tracking number");
        
        escrow.isActive = false;
        emit ItemShipped(msg.sender, trackingNumber);
    }

    function confirmItemReceived(bool conditionMet) external virtual onlyBuyer onlyEscrowFunded {
        require(!escrow.isActive, "Escrow still active");
        require(!escrow.itemReceived, "Item already received");
        
        escrow.itemReceived = true;
        escrow.paymentReleased = true;
        emit ItemReceived(msg.sender, conditionMet);
        
        if (conditionMet) {
            // Release escrow to seller
            uint256 sellerAmount = escrowBalance;
            escrowBalance = 0;
            (bool success, ) = payable(seller()).call{value: sellerAmount}("");
            require(success, "Transfer failed");
            emit EscrowReleased(seller(), sellerAmount);
        } else {
            // Refund escrow to buyer
            uint256 buyerAmount = escrowBalance;
            escrowBalance = 0;
            (bool success, ) = payable(msg.sender).call{value: buyerAmount}("");
            require(success, "Transfer failed");
            emit EscrowRefunded(msg.sender, buyerAmount);
        }
    }

    function raiseDispute(string memory reason) external virtual onlyBuyer onlyEscrowFunded {
        require(!escrow.isActive, "Escrow still active");
        require(!escrow.itemReceived, "Item already received");
        emit DisputeRaised(msg.sender, reason);
    }

    function resolveDispute(address disputeWinner) external virtual onlySeller onlyEscrowFunded {
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

    function getEscrowAmount() public view virtual returns (uint256) {
        return (getAuctionPrice() * ESCROW_FEE_PERCENTAGE) / 100;
    }

    // Abstract functions to be implemented by derived contracts
    function seller() public view virtual returns (address);
    function winner() public view virtual returns (address);
    function auctioneer() public view virtual override returns (address);
    function getAuctionPrice() public view virtual override returns (uint256);
    function purchases(address) public view virtual override returns (uint256);
    function onlyOwner() internal virtual;
} 