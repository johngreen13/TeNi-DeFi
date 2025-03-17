// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DutchAuction {
    address public auctioneer;
    string public description;
    string public image;
    uint public startPrice;
    uint public endPrice;
    uint public duration;
    uint public startTime;
    bool public isCompleted;
    address public winner;

    event AuctionEnded(address winner, uint amount);

    constructor(
        string memory _description,
        string memory _image,
        uint _startPrice,
        uint _endPrice,
        uint _duration
    ) {
        auctioneer = msg.sender;
        description = _description;
        image = _image;
        startPrice = _startPrice;
        endPrice = _endPrice;
        duration = _duration;
        startTime = block.timestamp;
        isCompleted = false;
    }

    function getCurrentPrice() public view returns (uint) {
        if (block.timestamp >= startTime + duration) {
            return endPrice;
        }
        uint elapsedTime = block.timestamp - startTime;
        uint priceDrop = ((startPrice - endPrice) * elapsedTime) / duration;
        return startPrice - priceDrop;
    }

    function bid() external payable {
        require(!isCompleted, "Auction has already ended");
        uint currentPrice = getCurrentPrice();
        require(
            msg.value >= currentPrice,
            "Bid must meet or exceed the current price"
        );

        isCompleted = true;
        winner = msg.sender;

        emit AuctionEnded(msg.sender, msg.value);

        payable(auctioneer).transfer(currentPrice);
        if (msg.value > currentPrice) {
            payable(msg.sender).transfer(msg.value - currentPrice);
        }
    }
}
