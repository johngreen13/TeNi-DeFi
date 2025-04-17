const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment process...");
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  try {
    // 1. Deploy TeNiToken
    console.log("\nDeploying TeNiToken...");
    const TeNiToken = await hre.ethers.getContractFactory("TeNiToken");
    const token = await TeNiToken.deploy();
    await token.waitForDeployment();
    console.log("TeNiToken deployed to:", await token.getAddress());

    // 2. Deploy PhysicalItemBase
    console.log("\nDeploying PhysicalItemBase...");
    const PhysicalItemBase = await hre.ethers.getContractFactory("PhysicalItemBase");
    const physicalItemBase = await PhysicalItemBase.deploy();
    await physicalItemBase.waitForDeployment();
    console.log("PhysicalItemBase deployed to:", await physicalItemBase.getAddress());

    // 3. Deploy Individual Auction Contracts
    console.log("\nDeploying auction contracts...");
    
    // English Auction
    const EnglishAuction = await hre.ethers.getContractFactory("EnglishAuction");
    const englishAuction = await EnglishAuction.deploy();
    await englishAuction.waitForDeployment();
    console.log("EnglishAuction deployed to:", await englishAuction.getAddress());

    // Dutch Auction
    const DutchAuction = await hre.ethers.getContractFactory("DutchAuction");
    const dutchAuction = await DutchAuction.deploy();
    await dutchAuction.waitForDeployment();
    console.log("DutchAuction deployed to:", await dutchAuction.getAddress());

    // Sealed Bid Auction
    const SealedBidAuction = await hre.ethers.getContractFactory("SealedBidAuction");
    const sealedBidAuction = await SealedBidAuction.deploy();
    await sealedBidAuction.waitForDeployment();
    console.log("SealedBidAuction deployed to:", await sealedBidAuction.getAddress());

    // Fixed Swap Auction
    const FixedSwapAuction = await hre.ethers.getContractFactory("FixedSwapAuction");
    const fixedSwapAuction = await FixedSwapAuction.deploy();
    await fixedSwapAuction.waitForDeployment();
    console.log("FixedSwapAuction deployed to:", await fixedSwapAuction.getAddress());

    // 4. Deploy AuctionFactory with all dependencies
    console.log("\nDeploying AuctionFactory...");
    const AuctionFactory = await hre.ethers.getContractFactory("AuctionFactory");
    const auctionFactory = await AuctionFactory.deploy(
      await token.getAddress(),
      await physicalItemBase.getAddress(),
      await englishAuction.getAddress(),
      await dutchAuction.getAddress(),
      await sealedBidAuction.getAddress(),
      await fixedSwapAuction.getAddress()
    );
    await auctionFactory.waitForDeployment();
    console.log("AuctionFactory deployed to:", await auctionFactory.getAddress());

    // 5. Set up permissions
    console.log("\nSetting up permissions...");
    
    // Grant roles to AuctionFactory
    const OPERATOR_ROLE = await physicalItemBase.OPERATOR_ROLE();
    await physicalItemBase.grantRole(OPERATOR_ROLE, await auctionFactory.getAddress());
    
    // Initialize auction contracts with AuctionFactory
    await englishAuction.initialize(await auctionFactory.getAddress());
    await dutchAuction.initialize(await auctionFactory.getAddress());
    await sealedBidAuction.initialize(await auctionFactory.getAddress());
    await fixedSwapAuction.initialize(await auctionFactory.getAddress());

    // Save deployment addresses
    const deploymentInfo = {
      network: hre.network.name,
      token: await token.getAddress(),
      physicalItemBase: await physicalItemBase.getAddress(),
      englishAuction: await englishAuction.getAddress(),
      dutchAuction: await dutchAuction.getAddress(),
      sealedBidAuction: await sealedBidAuction.getAddress(),
      fixedSwapAuction: await fixedSwapAuction.getAddress(),
      auctionFactory: await auctionFactory.getAddress(),
      timestamp: new Date().toISOString()
    };

    // Create deployment directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    // Save deployment info
    fs.writeFileSync(
      path.join(deploymentsDir, `${hre.network.name}.json`),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\nDeployment complete! Deployment info saved to:", path.join(deploymentsDir, `${hre.network.name}.json`));

    // Verify contracts if on a supported network
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.log("\nVerifying contracts on Etherscan...");
      
      try {
        await hre.run("verify:verify", {
          address: await token.getAddress(),
          constructorArguments: []
        });

        await hre.run("verify:verify", {
          address: await auctionFactory.getAddress(),
          constructorArguments: [
            await token.getAddress(),
            await physicalItemBase.getAddress(),
            await englishAuction.getAddress(),
            await dutchAuction.getAddress(),
            await sealedBidAuction.getAddress(),
            await fixedSwapAuction.getAddress()
          ]
        });

        console.log("Contract verification complete!");
      } catch (error) {
        console.warn("Contract verification failed:", error.message);
      }
    }

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 