const hre = require("hardhat");

async function main() {
    const DutchAuction = await hre.ethers.getContractFactory("DutchAuction");
    const description = "Dutch Auction for a collectible item";
    const image = "ipfs://example-image-hash";
    const startPrice = hre.ethers.utils.parseEther("5"); // 5 ETH
    const endPrice = hre.ethers.utils.parseEther("1"); // 1 ETH
    const duration = 3600; // 1 hour

    const dutchAuction = await DutchAuction.deploy(description, image, startPrice, endPrice, duration);
    await dutchAuction.deployed();

    console.log("DutchAuction deployed to:", dutchAuction.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});