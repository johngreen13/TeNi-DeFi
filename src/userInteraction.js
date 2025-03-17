const Web3 = require('web3');

let web3;
let userAccount;

async function connectMetaMask() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = (await web3.eth.getAccounts())[0];
      document.getElementById('account').innerText = userAccount;
      const balance = await web3.eth.getBalance(userAccount);
      document.getElementById('balance').innerText = web3.utils.fromWei(balance, 'ether') + ' ETH';
      document.getElementById('user-info').style.display = 'block';
      document.getElementById('create-auction-button').style.display = 'block';
      displayAuctionDetails();
    } catch (error) {
      console.error('User denied account access');
    }
  } else {
    console.error('MetaMask not detected');
  }
}

document.getElementById('login-button').addEventListener('click', connectMetaMask);

const userContractABI = [
  // Replace with the ABI from the compiled User contract
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_username",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getUser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "userId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "email",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "walletAddress",
            "type": "address"
          }
        ],
        "internalType": "struct User.UserInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const userContractAddress = '0x646F3599b70dFF6466E5CD763c30eA7478BAA741'; // Replace with the address of the deployed User contract

const userContract = new web3.eth.Contract(userContractABI, userContractAddress);

async function registerUser(username, email) {
  const result = await userContract.methods.registerUser(username, email).send({
    from: userAccount,
  });
  console.log('User registered:', result);
}

async function getUser(userAddress) {
  const userInfo = await userContract.methods.getUser(userAddress).call();
  console.log('User info:', userInfo);
}

// Example usage
registerUser('JohnDoe', 'john.doe@example.com');
getUser('0x62c3760e769d3D25C1E05a483Bb9433bE6aFbcb6'); // Replace with a valid user address

// Auction Contract Interactions

const auctionContractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startingPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endTime",
        "type": "uint256"
      }
    ],
    "name": "createAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuctionDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "highestBidder",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "highestBid",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startingPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          }
        ],
        "internalType": "struct Auction.AuctionDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];
const auctionContractAddress = '0xYourAuctionContractAddress'; // Replace with the address of the deployed Auction contract

const auctionContract = new web3.eth.Contract(auctionContractABI, auctionContractAddress);

async function createAuction(startingPrice, endTime) {
  const result = await auctionContract.methods.createAuction(startingPrice, endTime).send({
    from: userAccount,
  });
  console.log('Auction created:', result);
  displayAuctionDetails();
}

async function getAuctionDetails() {
  const auctionDetails = await auctionContract.methods.getAuctionDetails().call();
  console.log('Auction details:', auctionDetails);
  return auctionDetails;
}

async function placeBid(bidAmount) {
  const result = await auctionContract.methods.bid().send({
    from: userAccount,
    value: web3.utils.toWei(bidAmount, 'ether'),
  });
  console.log('Bid placed:', result);
}

// Add event listener to the "Create Auction" button
document.getElementById('create-auction-button').addEventListener('click', () => {
  const startingPrice = web3.utils.toWei('1', 'ether'); // Set starting price to 1 ether
  const endTime = Math.floor(Date.now() / 1000) + 3600; // Set end time to 1 hour from now
  createAuction(startingPrice, endTime);
});

async function displayAuctionDetails() {
  const details = await getAuctionDetails();
  document.getElementById('highest-bidder').innerText = details.highestBidder;
  document.getElementById('highest-bid').innerText = web3.utils.fromWei(details.highestBid, 'ether') + ' ETH';
  document.getElementById('starting-price').innerText = web3.utils.fromWei(details.startingPrice, 'ether') + ' ETH';
  document.getElementById('current-price').innerText = web3.utils.fromWei(details.currentPrice, 'ether') + ' ETH';
  document.getElementById('end-time').innerText = new Date(details.endTime * 1000).toLocaleString();
  document.getElementById('auction-details').style.display = 'block';
}

// Example usage of auction functions
getAuctionDetails().then(details => {
  document.getElementById('auction-details').innerText = JSON.stringify(details, null, 2);
});
placeBid('0.1'); // Place a bid of 0.1 ether in an auction