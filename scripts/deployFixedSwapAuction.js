const hre = require("hardhat");

async function main() {
    const FixedSwapAuction = await hre.ethers.getContractFactory("FixedSwapAuction");
    const description = "Fixed-Swap Auction for a collectible item";
    const image = "ipfs://example-image-hash";
    const fixedPrice = hre.ethers.utils.parseEther("0.5"); // 0.5 ETH
    const totalSupply = 100; // 100 items available

    const fixedSwapAuction = await FixedSwapAuction.deploy(description, image, fixedPrice, totalSupply);
    await fixedSwapAuction.deployed();

    console.log("FixedSwapAuction deployed to:", fixedSwapAuction.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});