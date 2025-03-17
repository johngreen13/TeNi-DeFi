const hre = require("hardhat");

async function main() {
    const EnglishAuction = await hre.ethers.getContractFactory("EnglishAuction");
    const description = "English Auction for a rare item";
    const image = "ipfs://example-image-hash";
    const startingPrice = hre.ethers.utils.parseEther("1"); // 1 ETH
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const englishAuction = await EnglishAuction.deploy(description, image, startingPrice, endTime);
    await englishAuction.deployed();

    console.log("EnglishAuction deployed to:", englishAuction.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});