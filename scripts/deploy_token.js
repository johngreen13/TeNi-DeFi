const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    console.log("Deploying TeNiToken...");
    const TeNiToken = await ethers.getContractFactory("TeNiToken");
    const token = await TeNiToken.deploy();
    
    console.log("Waiting for deployment...");
    await token.deployed();
    
    console.log("\n--------------------------------------------");
    console.log("🎉 TeNiToken deployed successfully!");
    console.log("--------------------------------------------");
    console.log("Token address:", token.address);
    console.log("Network:", network.name);
    console.log("\nTo import into MetaMask:");
    console.log("1. Open MetaMask");
    console.log("2. Click 'Import tokens'");
    console.log("3. Paste this token address:", token.address);
    console.log("4. Token Symbol: TNI");
    console.log("5. Decimals: 18");
    console.log("--------------------------------------------\n");

    // Save the address to a file
    const deployment = {
      network: network.name,
      token: {
        address: token.address,
        name: await token.name(),
        symbol: await token.symbol(),
        decimals: 18
      }
    };

    fs.writeFileSync(
      'token-address.json',
      JSON.stringify(deployment, null, 2)
    );

    // Verify the deployment
    console.log("Verifying deployment...");
    console.log("Token name:", await token.name());
    console.log("Token symbol:", await token.symbol());
    const totalSupply = await token.totalSupply();
    console.log("Total supply:", totalSupply.toString());
    const ownerBalance = await token.balanceOf(deployer.address);
    console.log("Owner balance:", ownerBalance.toString());
    
    console.log("\nDeployment data saved to token-address.json");
  } catch (error) {
    console.error("\nDeployment failed!");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 