const hre = require("hardhat");

async function main() {
    const SealedBidAuction = await hre.ethers.getContractFactory("SealedBidAuction");
    const description = "Sealed-Bid Auction for a rare item";
    const image = "ipfs://example-image-hash";
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const sealedBidAuction = await SealedBidAuction.deploy(description, image, endTime);
    await sealedBidAuction.deployed();

    console.log("SealedBidAuction deployed to:", sealedBidAuction.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});