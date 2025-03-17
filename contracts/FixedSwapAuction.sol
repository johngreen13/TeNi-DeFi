// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedSwapAuction {
    address public auctioneer;
    string public description;
    string public image;
    uint public fixedPrice;
    uint public totalSupply;
    uint public sold;

    mapping(address => uint) public purchases;

    event Purchase(address buyer, uint amount);

    constructor(
        string memory _description,
        string memory _image,
        uint _fixedPrice,
        uint _totalSupply
    ) {
        auctioneer = msg.sender;
        description = _description;
        image = _image;
        fixedPrice = _fixedPrice;
        totalSupply = _totalSupply;
        sold = 0;
    }

    function buy(uint _amount) external payable {
        require(sold + _amount <= totalSupply, "Not enough items left");
        require(msg.value == _amount * fixedPrice, "Incorrect payment amount");

        sold += _amount;
        purchases[msg.sender] += _amount;

        emit Purchase(msg.sender, _amount);

        // Transfer funds to the auctioneer
        payable(auctioneer).transfer(msg.value);
    }
}
