// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DutchAuction {
    address public auctioneer;
    string public description;
    string public image;
    uint public endTime;ce;
    bool public isCompleted;
    uint public duration;
    struct Bid {
        bytes32 sealedBid;
        uint deposit;
    }
    event AuctionEnded(address winner, uint amount);
    mapping(address => Bid) public bids;d, string description, uint startPrice, uint endPrice, uint duration);    mapping(address => Bid) public bids;
    address public highestBidder;
    uint public highestBid;
        string memory _description,
    event AuctionEnded(address winner, uint amount);nt);
    event AuctionCreated(string auctionId, string description, uint endTime);        uint _startPrice,
dPrice,
    constructor(y _description,
        string memory _description,
        string memory _image,msg.sender;
        uint _endTime description = _description;
    ) {
        auctioneer = msg.sender;ion;
        description = _description;Price;
        image = _image;n;
        endTime = _endTime;mestamp;
        isCompleted = false;   isCompleted = false;
    }    }

    function placeBid(bytes32 _sealedBid) external payable {ed");
        require(block.timestamp < endTime, "Bidding time has ended");Bid, deposit: msg.value});
        bids[msg.sender] = Bid({sealedBid: _sealedBid, deposit: msg.value});       return endPrice;
    }        }

    function revealBid(uint _bidAmount, string memory _secret) external {on;Time, "Bidding phase is not over");
        require(block.timestamp >= endTime, "Bidding phase is not over");pleted, "Auction already ended");
        require(!isCompleted, "Auction already ended");    }

        Bid storage bid = bids[msg.sender];() external payable {
        require(t, _secret)),
            bid.sealedBid == keccak256(abi.encodePacked(_bidAmount, _secret)),urrentPrice();alid bid reveal"
            "Invalid bid reveal"quire(
        );
        require(bid.deposit >= _bidAmount, "Insufficient deposit");            "Bid must meet or exceed the current price"
hestBid) {
        if (_bidAmount > highestBid) {
            highestBid = _bidAmount;
            highestBidder = msg.sender;inner = msg.sender;        }
        }
nder, msg.value);        // Refund excess deposit
        // Refund excess deposit
        payable(msg.sender).transfer(bid.deposit - _bidAmount);   payable(auctioneer).transfer(currentPrice);
    }        if (msg.value > currentPrice) {
sfer(msg.value - currentPrice);ion endAuction() external {
    function endAuction() external {g");
        require(block.timestamp >= endTime, "Auction is still ongoing");d");
        require(!isCompleted, "Auction already ended");}

        isCompleted = true;
        emit AuctionEnded(highestBidder, highestBid);        emit AuctionEnded(highestBidder, highestBid);

        // Transfer funds to the auctioneer
        payable(auctioneer).transfer(highestBid);   payable(auctioneer).transfer(highestBid);
    }   }
}}

