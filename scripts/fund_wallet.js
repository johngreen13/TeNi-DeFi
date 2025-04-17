const hre = require("hardhat");

async function main() {
  try {
    // Get the pre-funded account from Ganache
    const [fundedAccount] = await hre.ethers.getSigners();
    const provider = fundedAccount.provider;
    
    // Your MetaMask wallet address
    const yourWalletAddress = "0x2ecAC72a4a63a7614d40a376c654c7d6562e26b3";
    
    console.log("Funded account:", fundedAccount.address);
    
    // Send 10 ETH to your wallet
    const tx = await fundedAccount.sendTransaction({
      to: yourWalletAddress,
      value: BigInt("10000000000000000000"), // 10 ETH in wei
      gasLimit: BigInt("21000")
    });
    
    console.log("Sending 10 ETH to your wallet...");
    console.log("Transaction hash:", tx.hash);
    
    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Transfer complete!");
    
  } catch (error) {
    console.error("Detailed error:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 