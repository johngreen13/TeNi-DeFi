require("@nomiclabs/hardhat-ethers");

// Custom task to list accounts
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0", // Specify the Solidity version
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache RPC URL
      accounts: [
        "0x9ab9e0163da8d704c6bd8f680c703bb3b177f1a8318737c117f9310ba59f792f", // Replace with private keys from Ganache
        "0x40de31482614c8f8cb6598863bda6d206cf7faf9cfd4fe87c7bcecac1a386398",
      ],
    },
  },
};
