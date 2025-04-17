const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Starting deployment of all contracts...");

    // Deploy AuctionFactory
    console.log("\nDeploying AuctionFactory contract...");
    const AuctionFactory = await hre.ethers.getContractFactory("AuctionFactory");
    const auctionFactory = await AuctionFactory.deploy();
    await auctionFactory.deployed();
    console.log("AuctionFactory deployed to:", auctionFactory.address);

    // Deploy FixedSwapAuction with constructor parameters
    console.log("\nDeploying FixedSwapAuction contract...");
    const FixedSwapAuction = await hre.ethers.getContractFactory("FixedSwapAuction");
    const fixedSwapAuction = await FixedSwapAuction.deploy(
        "Sample Auction", // _description
        "sample.jpg", // _image
        hre.ethers.utils.parseEther("0.1"), // _price (0.1 ETH)
        "Sample Item", // _name
        "Sample Item Description", // _itemDescription
        "New", // _condition
        "10x10x10", // _dimensions
        1000, // _weight (in grams)
        [], // _images array
        "123 Sample St", // _shippingAddress
        true // _isPhysical
    );
    await fixedSwapAuction.deployed();
    console.log("FixedSwapAuction deployed to:", fixedSwapAuction.address);

    // Deploy DutchAuction
    console.log("\nDeploying DutchAuction contract...");
    const DutchAuction = await hre.ethers.getContractFactory("DutchAuction");
    const dutchAuction = await DutchAuction.deploy(
        "Sample Dutch Auction", // _description
        "sample.jpg", // _image
        hre.ethers.utils.parseEther("1"), // _startPrice
        hre.ethers.utils.parseEther("0.1"), // _endPrice
        3600, // _duration (in seconds)
        "Sample Item", // _name
        "Sample Item Description", // _itemDescription
        "New", // _condition
        "10x10x10", // _dimensions
        1000, // _weight (in grams)
        [], // _images array
        "123 Sample St", // _shippingAddress
        false // _isPhysical
    );
    await dutchAuction.deployed();
    console.log("DutchAuction deployed to:", dutchAuction.address);

    // Deploy EnglishAuction
    console.log("\nDeploying EnglishAuction contract...");
    const EnglishAuction = await hre.ethers.getContractFactory("EnglishAuction");
    const englishAuction = await EnglishAuction.deploy(
        "Sample English Auction", // _description
        "sample.jpg", // _image
        hre.ethers.utils.parseEther("0.1"), // _startingPrice
        3600, // _duration (in seconds)
        "Sample Item", // _name
        "Sample Item Description", // _itemDescription
        "New", // _condition
        "10x10x10", // _dimensions
        1000, // _weight (in grams)
        [], // _images array
        "123 Sample St", // _shippingAddress
        false // _isPhysical
    );
    await englishAuction.deployed();
    console.log("EnglishAuction deployed to:", englishAuction.address);

    // Deploy SealedBidAuction
    console.log("\nDeploying SealedBidAuction contract...");
    const SealedBidAuction = await hre.ethers.getContractFactory("SealedBidAuction");
    const sealedBidAuction = await SealedBidAuction.deploy(
        3600, // _duration (in seconds)
        hre.ethers.utils.parseEther("0.1"), // _startingPrice
        hre.ethers.utils.parseEther("0.05"), // _reservePrice
        "Sample Item", // _name
        "Sample Item Description", // _description
        "New", // _condition
        "10x10x10", // _dimensions
        1000, // _weight (in grams)
        [], // _images array
        "123 Sample St", // _shippingAddress
        false // _isPhysical
    );
    await sealedBidAuction.deployed();
    console.log("SealedBidAuction deployed to:", sealedBidAuction.address);

    // Create or update addresses.json
    const addresses = {
        AuctionFactory: auctionFactory.address,
        FixedSwapAuction: fixedSwapAuction.address,
        DutchAuction: dutchAuction.address,
        EnglishAuction: englishAuction.address,
        SealedBidAuction: sealedBidAuction.address
    };

    // Ensure the contracts directory exists
    const contractsDir = path.join(__dirname, '../src/contracts');
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    // Write addresses to file
    const addressesPath = path.join(contractsDir, 'addresses.json');
    fs.writeFileSync(
        addressesPath,
        JSON.stringify(addresses, null, 2)
    );

    console.log("\nAll contracts deployed successfully!");
    console.log("\nContract Addresses:");
    console.log(JSON.stringify(addresses, null, 2));
    console.log("\nAddresses have been saved to:", addressesPath);

    // Create or update .env file with contract addresses
        const envContent = `
REACT_APP_AUCTION_FACTORY_ADDRESS=${addresses.AuctionFactory}
REACT_APP_FIXED_SWAP_AUCTION_ADDRESS=${addresses.FixedSwapAuction}
REACT_APP_DUTCH_AUCTION_ADDRESS=${addresses.DutchAuction}
REACT_APP_ENGLISH_AUCTION_ADDRESS=${addresses.EnglishAuction}
REACT_APP_SEALED_BID_AUCTION_ADDRESS=${addresses.SealedBidAuction}
        `.trim();

    fs.writeFileSync('.env', envContent);
    console.log("\nEnvironment variables have been updated in .env file");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 