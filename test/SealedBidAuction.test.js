const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SealedBidAuction", function () {
  let auction;
  let owner;
  let bidder1;
  let bidder2;
  let bidder3;
  let seller;

  const AUCTION_DURATION = 3600; // 1 hour
  const STARTING_PRICE = ethers.utils.parseEther("1.0"); // 1 ETH
  const RESERVE_PRICE = ethers.utils.parseEther("0.5"); // 0.5 ETH
  const BID_AMOUNT = ethers.utils.parseEther("2.0"); // 2 ETH

  const PHYSICAL_ITEM = {
    name: "Test Item",
    description: "A test physical item",
    condition: "new",
    dimensions: "10x5x3",
    weight: 1000, // 1kg
    images: ["ipfs://test-hash-1", "ipfs://test-hash-2"],
    shippingAddress: "123 Test St, Test City, 12345",
    isPhysical: true
  };

  beforeEach(async function () {
    [owner, bidder1, bidder2, bidder3, seller] = await ethers.getSigners();

    const SealedBidAuction = await ethers.getContractFactory("SealedBidAuction");
    auction = await SealedBidAuction.deploy(
      AUCTION_DURATION,
      STARTING_PRICE,
      RESERVE_PRICE,
      PHYSICAL_ITEM.name,
      PHYSICAL_ITEM.description,
      PHYSICAL_ITEM.condition,
      PHYSICAL_ITEM.dimensions,
      PHYSICAL_ITEM.weight,
      PHYSICAL_ITEM.images,
      PHYSICAL_ITEM.shippingAddress,
      PHYSICAL_ITEM.isPhysical
    );
    await auction.deployed();
  });

  describe("Physical Item Auction", function () {
    it("Should initialize with correct physical item details", async function () {
      const item = await auction.item();
      expect(item.name).to.equal(PHYSICAL_ITEM.name);
      expect(item.description).to.equal(PHYSICAL_ITEM.description);
      expect(item.condition).to.equal(PHYSICAL_ITEM.condition);
      expect(item.dimensions).to.equal(PHYSICAL_ITEM.dimensions);
      expect(item.weight).to.equal(PHYSICAL_ITEM.weight);
      expect(item.shippingAddress).to.equal(PHYSICAL_ITEM.shippingAddress);
      expect(item.isPhysical).to.be.true;
    });

    it("Should allow placing bids", async function () {
      await auction.connect(bidder1).placeBid({ value: BID_AMOUNT });
      const bid = await auction.bids(bidder1.address);
      expect(bid).to.equal(BID_AMOUNT);
    });

    it("Should create escrow when auction ends", async function () {
      // Place highest bid
      await auction.connect(bidder1).placeBid({ value: BID_AMOUNT });
      
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [AUCTION_DURATION + 1]);
      await ethers.provider.send("evm_mine");

      // End auction
      await auction.connect(seller).revealWinner();

      const escrow = await auction.escrow();
      expect(escrow.isActive).to.be.true;
      expect(escrow.escrowFee).to.equal(BID_AMOUNT.mul(200).div(10000)); // 2% fee
      expect(escrow.itemReceived).to.be.false;
      expect(escrow.paymentReleased).to.be.false;
    });

    it("Should allow seller to confirm shipping", async function () {
      // Place bid and end auction
      await auction.connect(bidder1).placeBid({ value: BID_AMOUNT });
      await ethers.provider.send("evm_increaseTime", [AUCTION_DURATION + 1]);
      await ethers.provider.send("evm_mine");
      await auction.connect(seller).revealWinner();

      // Confirm shipping
      const trackingNumber = "TEST123456";
      await expect(auction.connect(seller).confirmItemShipped(trackingNumber))
        .to.emit(auction, "ItemShipped")
        .withArgs(seller.address, trackingNumber);
    });

    it("Should allow winner to confirm receipt and release payment", async function () {
      // Place bid and end auction
      await auction.connect(bidder1).placeBid({ value: BID_AMOUNT });
      await ethers.provider.send("evm_increaseTime", [AUCTION_DURATION + 1]);
      await ethers.provider.send("evm_mine");
      await auction.connect(seller).revealWinner();

      // Confirm shipping
      await auction.connect(seller).confirmItemShipped("TEST123456");

      // Get initial seller balance
      const initialBalance = await seller.getBalance();

      // Confirm receipt
      await expect(auction.connect(bidder1).confirmItemReceived())
        .to.emit(auction, "ItemReceived")
        .withArgs(bidder1.address)
        .to.emit(auction, "PaymentReleased");

      // Check final seller balance (should be initial + bid amount - escrow fee)
      const finalBalance = await seller.getBalance();
      const escrowFee = BID_AMOUNT.mul(200).div(10000); // 2% fee
      expect(finalBalance).to.equal(initialBalance.add(BID_AMOUNT.sub(escrowFee)));
    });

    it("Should not allow non-winner to confirm receipt", async function () {
      // Place bid and end auction
      await auction.connect(bidder1).placeBid({ value: BID_AMOUNT });
      await ethers.provider.send("evm_increaseTime", [AUCTION_DURATION + 1]);
      await ethers.provider.send("evm_mine");
      await auction.connect(seller).revealWinner();

      // Try to confirm receipt with non-winner
      await expect(auction.connect(bidder2).confirmItemReceived())
        .to.be.revertedWith("Only winner can confirm receipt");
    });

    it("Should not allow confirming receipt before shipping", async function () {
      // Place bid and end auction
      await auction.connect(bidder1).placeBid({ value: BID_AMOUNT });
      await ethers.provider.send("evm_increaseTime", [AUCTION_DURATION + 1]);
      await ethers.provider.send("evm_mine");
      await auction.connect(seller).revealWinner();

      // Try to confirm receipt before shipping
      await expect(auction.connect(bidder1).confirmItemReceived())
        .to.be.revertedWith("Not a physical item");
    });
  });
}); 