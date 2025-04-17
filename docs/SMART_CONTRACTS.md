# Smart Contracts Documentation

## Overview

TeNi-DeFi uses a system of smart contracts to manage different types of auctions. The contracts are designed to be modular, secure, and gas-efficient.

## Contract Architecture

### IAuction Interface
The base interface that all auction contracts implement.

```solidity
interface IAuction {
    function createAuction(
        string memory title,
        string memory description,
        uint256 startingPrice,
        uint256 duration,
        string[] memory imageHashes,
        uint256 reservePrice
    ) external returns (uint256);
    
    function placeBid(uint256 auctionId) external payable;
    function endAuction(uint256 auctionId) external;
    function withdrawFunds(uint256 auctionId) external;
    // ... other interface methods
}
```

### Auction Types

#### 1. English Auction
Traditional ascending price auction where participants bid increasingly higher amounts.

**Key Features:**
- Ascending price mechanism
- Minimum bid increment
- Auto-refund of previous bids
- Time extension on late bids

**Key Functions:**
```solidity
function placeBid(uint256 auctionId) external payable
function endAuction(uint256 auctionId) external
function withdrawBid(uint256 auctionId) external
```

#### 2. Dutch Auction
Descending price auction where the price decreases over time until a buyer accepts.

**Key Features:**
- Descending price mechanism
- Configurable price decrement
- Configurable time interval
- Reserve price protection

**Key Functions:**
```solidity
function getCurrentPrice(uint256 auctionId) external view returns (uint256)
function buy(uint256 auctionId) external payable
function updatePrice(uint256 auctionId) external
```

#### 3. Sealed Bid Auction
Auction where bids are kept secret until the reveal phase.

**Key Features:**
- Two-phase bidding (commit and reveal)
- Bid masking using keccak256
- Automatic refund of losing bids
- Prevention of bid changes

**Key Functions:**
```solidity
function commitBid(uint256 auctionId, bytes32 sealedBid) external payable
function revealBid(uint256 auctionId, uint256 amount, bytes32 nonce) external
function endAuction(uint256 auctionId) external
```

#### 4. Fixed Swap Auction
Simple fixed-price exchange mechanism.

**Key Features:**
- Immediate purchase option
- Multiple item support
- Partial purchase support
- Automatic price calculation

**Key Functions:**
```solidity
function buy(uint256 auctionId, uint256 amount) external payable
function withdraw(uint256 auctionId, uint256 amount) external
```

### Physical Item Support

The `PhysicalItemBase` contract adds support for physical item auctions:

**Key Features:**
- Escrow system
- Shipping status tracking
- Dispute resolution
- Rating system

**Key Functions:**
```solidity
function confirmShipment(uint256 auctionId, string memory trackingNumber) external
function confirmReceipt(uint256 auctionId) external
function initiateDispute(uint256 auctionId) external
function resolveDispute(uint256 auctionId, address winner) external
```

## Gas Optimization

The contracts implement several gas optimization techniques:

1. **Storage Optimization:**
   - Using uint8/uint16 for small numbers
   - Packing multiple variables into single storage slots
   - Using bytes32 instead of string where possible

2. **Computation Optimization:**
   - Caching storage variables in memory
   - Using unchecked blocks for safe arithmetic
   - Minimizing state changes

3. **Memory Management:**
   - Using calldata instead of memory for read-only function parameters
   - Efficient array handling
   - Minimal string operations

## Security Measures

1. **Access Control:**
   - Role-based access control for admin functions
   - Ownership validation for critical operations
   - Time-based restrictions

2. **Fund Safety:**
   - Pull over push payment pattern
   - Re-entrancy protection
   - Integer overflow protection
   - Emergency pause functionality

3. **Input Validation:**
   - Strict parameter validation
   - Timestamp manipulation protection
   - Gas limit considerations

## Events

### Common Events
```solidity
event AuctionCreated(uint256 indexed auctionId, address indexed seller);
event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 amount);
event FundsWithdrawn(uint256 indexed auctionId, address indexed recipient, uint256 amount);
```

### Physical Item Events
```solidity
event ItemShipped(uint256 indexed auctionId, string trackingNumber);
event ItemReceived(uint256 indexed auctionId);
event DisputeInitiated(uint256 indexed auctionId, address initiator);
event DisputeResolved(uint256 indexed auctionId, address winner);
```

## Testing

The contracts include comprehensive test coverage:

1. **Unit Tests:**
   - Individual function testing
   - Edge case validation
   - Gas usage optimization

2. **Integration Tests:**
   - Multi-contract interaction
   - Complex auction scenarios
   - Physical item workflows

3. **Stress Tests:**
   - High-volume bidding
   - Concurrent auctions
   - Network congestion scenarios

## Deployment

The contracts are deployed in the following order:

1. Deploy TeNiToken
2. Deploy PhysicalItemBase
3. Deploy auction contracts (English, Dutch, Sealed, Fixed)
4. Deploy AuctionFactory
5. Configure permissions and parameters
6. Verify contracts on Etherscan

## Upgradeability

The contracts implement the following upgradeability patterns:

1. **Proxy Pattern:**
   - Transparent proxy
   - Storage layout preservation
   - Function selector handling

2. **Data Migration:**
   - Version tracking
   - State migration helpers
   - Backward compatibility

## Error Codes

Common error codes and their meanings:

```solidity
error InvalidAuction();              // Auction doesn't exist or is invalid
error AuctionEnded();               // Auction has already ended
error InsufficientBid();            // Bid amount is too low
error UnauthorizedAccess();         // Caller doesn't have permission
error InvalidState();               // Operation invalid in current state
error InvalidInput();               // Input parameters are invalid
``` 