# TeNi-DeFi: Decentralized Auction Platform

TeNi-DeFi is a decentralized auction platform built on Ethereum that supports multiple auction types and both digital and physical items.

## Features

### Auction Types
- **English Auction**: Traditional ascending price auction
- **Dutch Auction**: Descending price auction
- **Sealed Bid Auction**: Private bidding auction
- **Fixed Swap Auction**: Fixed price exchange

### Key Features
- Multi-auction type support
- Physical and digital item support
- User profiles and reputation system
- Secure escrow system for physical items
- Real-time auction updates
- MetaMask integration
- Responsive UI

## Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn
- MetaMask wallet
- Ganache (for local development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TeNi-DeFi.git
cd TeNi-DeFi
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Start Ganache:
- Open Ganache UI
- Create a new workspace
- Configure the workspace to use port 7545

5. Configure MetaMask:
- Network Name: Ganache
- RPC URL: http://127.0.0.1:7545
- Chain ID: 1337
- Currency Symbol: ETH

## Smart Contracts

### Contract Architecture
```
IAuction (Interface)
├── EnglishAuction
├── DutchAuction
├── SealedBidAuction
└── FixedSwapAuction

PhysicalItemBase (Base Contract)
└── Used by all auction types for physical items

AuctionFactory
└── Creates and manages all auction types
```

### Deployment

1. Deploy to local network (Ganache):
```bash
npx hardhat run scripts/deploy_token.js --network ganache
```

2. Deploy to testnet (Sepolia):
```bash
npx hardhat run scripts/deploy_token.js --network sepolia
```

## Development

### Running the Frontend

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000 in your browser

### Testing

1. Run smart contract tests:
```bash
npx hardhat test
```

2. Run frontend tests:
```bash
npm run test
```

## Usage Guide

### Creating an Auction

1. Connect your MetaMask wallet
2. Click "Create Auction" in the navigation bar
3. Select auction type:
   - English: Set starting price and duration
   - Dutch: Set starting price, reserve price, decrement amount, and interval
   - Sealed Bid: Set minimum bid and duration
   - Fixed Swap: Set fixed price
4. For physical items:
   - Add item details (dimensions, weight, condition)
   - Add shipping information
   - Upload images
5. Submit the auction

### Bidding

1. Browse available auctions
2. Select an auction
3. For English auctions:
   - Enter bid amount (must be higher than current bid)
   - Click "Place Bid"
4. For Dutch auctions:
   - Click "Buy Now" at current price
5. For Sealed Bid auctions:
   - Enter bid amount
   - Submit bid (will be revealed later)
6. For Fixed Swap:
   - Click "Buy Now" at fixed price

### Physical Item Process

1. **For Sellers:**
   - After auction ends, ship item
   - Add tracking information
   - Await confirmation

2. **For Buyers:**
   - Receive item
   - Confirm receipt
   - Rate transaction

## Security

- All smart contracts are thoroughly tested
- Physical item transactions use escrow
- Funds are locked until conditions are met
- Input validation on all forms
- Rate limiting on API calls

## Error Handling

Common errors and solutions:git initgit initgit initgit initgit init
- "Insufficient funds": Ensure wallet has enough ETH
- "Transaction failed": Check gas price and limits
- "Auction ended": Auction is no longer active
- "Invalid bid": Bid doesn't meet minimum requirements

## Support

For support:
1. Check the issues section
2. Join our Discord community
3. Email support@teni-defi.com

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
