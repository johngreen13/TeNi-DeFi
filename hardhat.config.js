require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Custom task to list accounts
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
      ],
      gas: 5000000,
      gasPrice: 20000000000
    },
    localhost: {
      url: "http://127.0.0.1:7545"
    },
    // Only include Sepolia if we have the required environment variables
    ...(INFURA_API_KEY && PRIVATE_KEY ? {
      sepolia: {
        url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
        accounts: [PRIVATE_KEY],
        chainId: 11155111
      }
    } : {})
  },
  paths: {
    artifacts: "./src/contracts/artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test"
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
