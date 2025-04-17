const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Starting deployment...");

    // Deploy AuctionFactory
    console.log("Deploying AuctionFactory contract...");
    const AuctionFactory = await hre.ethers.getContractFactory("AuctionFactory");
    const auctionFactory = await AuctionFactory.deploy();
    await auctionFactory.deployed();
    const address = auctionFactory.address;
    console.log("AuctionFactory deployed to:", address);

    // Update addresses.json
    const addressesPath = path.join(__dirname, '../src/contracts/addresses.json');
    const addresses = require(addressesPath);
    
    addresses.AuctionFactory = address;
    
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 4));
    console.log("Updated addresses.json with new contract address");

    console.log("Deployment completed successfully!");
    console.log("\nContract Addresses:");
    console.log("AuctionFactory:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });