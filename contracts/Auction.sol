// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Auction {
    struct AuctionDetails {
        address highestBidder;
        uint highestBid;
        uint startingPrice;
        uint currentPrice;
        uint endTime;
    }

    AuctionDetails public auctionDetails;

    event AuctionCreated(uint startingPrice, uint endTime);
    event BidPlaced(address bidder, uint amount);

    function createAuction(uint _startingPrice, uint _endTime) public {
        require(_endTime > block.timestamp, "End time must be in the future");

        auctionDetails = AuctionDetails({
            highestBidder: address(0),
            highestBid: 0,
            startingPrice: _startingPrice,
            currentPrice: _startingPrice,
            endTime: _endTime
        });

        emit AuctionCreated(_startingPrice, _endTime);
    }

    function bid() public payable {
        require(block.timestamp < auctionDetails.endTime, "Auction has ended");
        require(
            msg.value > auctionDetails.currentPrice,
            "Bid must be higher than current price"
        );

        if (auctionDetails.highestBidder != address(0)) {
            payable(auctionDetails.highestBidder).transfer(
                auctionDetails.highestBid
            );
        }

        auctionDetails.highestBidder = msg.sender;
        auctionDetails.highestBid = msg.value;
        auctionDetails.currentPrice = msg.value;

        emit BidPlaced(msg.sender, msg.value);
    }
}
