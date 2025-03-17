// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnglishAuction {
    address public auctioneer;
    string public auctionId; // Automatically generated Auction ID
    string public description;
    string public image;
    uint public startingPrice;
    uint public highestBid;
    address public highestBidder;
    uint public endTime;
    bool public isCompleted;

    event AuctionCreated(string auctionId, string description, uint startingPrice, uint endTime);
    event NewBid(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    constructor(
        string memory _description,
        string memory _image,
        uint _startingPrice,
        uint _endTime
    ) {
        auctioneer = msg.sender;
        description = _description;
        image = _image;
        startingPrice = _startingPrice;
        highestBid = 0;
        highestBidder = address(0);
        endTime = _endTime;
        isCompleted = false;

        // Generate a unique Auction ID
        auctionId = _generateAuctionId();

        emit AuctionCreated(auctionId, description, startingPrice, endTime);
    }

    function _generateAuctionId() private view returns (string memory) {
        return _toHex(keccak256(abi.encodePacked(block.timestamp, msg.sender, description)));
    }

    function _toHex(bytes32 data) private pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint i = 0; i < 32; i++) {
            str[i * 2] = alphabet[uint(uint8(data[i] >> 4))];
            str[1 + i * 2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function bid() external payable {
        require(block.timestamp < endTime, "Auction has ended");
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");

        if (highestBid != 0) {
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;

        emit NewBid(msg.sender, msg.value);
    }

    function endAuction() external {
        require(block.timestamp >= endTime, "Auction is still ongoing");
        require(!isCompleted, "Auction already ended");

        isCompleted = true;
        emit AuctionEnded(highestBidder, highestBid);

        payable(auctioneer).transfer(highestBid);
    }
}
