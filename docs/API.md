# API Documentation

## Overview

TeNi-DeFi provides both blockchain interactions through smart contracts and traditional API endpoints for enhanced functionality.

## Smart Contract Interactions

### AuctionFactory Contract

#### Create Auction
```javascript
function createAuction(auctionData: AuctionData): Promise<string>
```

**Parameters:**
```typescript
interface AuctionData {
  title: string;
  description: string;
  startingPrice: string;
  duration: number;
  auctionType: 'english' | 'dutch' | 'sealed' | 'fixed';
  images?: string[];
  reservePrice?: string;
  decrementAmount?: string;
  decrementInterval?: number;
  isPhysicalItem?: boolean;
  itemDetails?: {
    name: string;
    description: string;
    condition: string;
    dimensions: string;
    weight: string;
  };
}
```

**Returns:**
- `string`: Transaction hash

#### Get Auction Details
```javascript
function getAuction(auctionId: number): Promise<AuctionDetails>
```

**Returns:**
```typescript
interface AuctionDetails {
  id: number;
  seller: string;
  title: string;
  description: string;
  currentPrice: string;
  startTime: number;
  endTime: number;
  highestBidder: string;
  highestBid: string;
  status: 'active' | 'ended' | 'cancelled';
  images: string[];
  isPhysicalItem: boolean;
  itemDetails?: ItemDetails;
}
```

### Auction Contracts

#### Place Bid
```javascript
function placeBid(auctionId: number, amount: string): Promise<string>
```

**Parameters:**
- `auctionId`: Auction identifier
- `amount`: Bid amount in wei

**Returns:**
- `string`: Transaction hash

#### End Auction
```javascript
function endAuction(auctionId: number): Promise<string>
```

**Returns:**
- `string`: Transaction hash

## REST API Endpoints

### Authentication

#### Connect Wallet
```http
POST /api/auth/connect
```

**Request Body:**
```json
{
  "address": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "address": "0x...",
    "username": "user123",
    "reputation": 4.5
  }
}
```

### User Management

#### Get User Profile
```http
GET /api/users/:address
```

**Response:**
```json
{
  "address": "0x...",
  "username": "user123",
  "reputation": 4.5,
  "createdAt": "2024-04-09T00:00:00Z",
  "transactions": [
    {
      "type": "bid",
      "auctionId": "123",
      "amount": "1000000000000000000",
      "timestamp": "2024-04-09T01:00:00Z"
    }
  ]
}
```

#### Update User Profile
```http
PUT /api/users/:address
```

**Request Body:**
```json
{
  "username": "newUsername",
  "email": "user@example.com",
  "preferences": {
    "notifications": true,
    "language": "en"
  }
}
```

### Auctions

#### List Auctions
```http
GET /api/auctions
```

**Query Parameters:**
- `type`: Auction type (english, dutch, sealed, fixed)
- `status`: Auction status (active, ended, cancelled)
- `page`: Page number
- `limit`: Items per page
- `sort`: Sort field
- `order`: Sort order (asc, desc)

**Response:**
```json
{
  "items": [
    {
      "id": "123",
      "title": "Example Auction",
      "currentPrice": "1000000000000000000",
      "endTime": "2024-04-10T00:00:00Z",
      "status": "active"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

#### Get Auction History
```http
GET /api/auctions/:id/history
```

**Response:**
```json
{
  "bids": [
    {
      "bidder": "0x...",
      "amount": "1000000000000000000",
      "timestamp": "2024-04-09T01:00:00Z"
    }
  ]
}
```

### Physical Items

#### Update Shipping Status
```http
POST /api/physical-items/:auctionId/shipping
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "estimatedDelivery": "2024-04-15T00:00:00Z"
}
```

#### Confirm Receipt
```http
POST /api/physical-items/:auctionId/receipt
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great item, fast shipping!"
}
```

### Notifications

#### Get User Notifications
```http
GET /api/notifications
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "123",
      "type": "bid_outbid",
      "auctionId": "456",
      "message": "You have been outbid on auction #456",
      "timestamp": "2024-04-09T01:00:00Z",
      "read": false
    }
  ]
}
```

## WebSocket Events

### Auction Events

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://api.teni-defi.com/ws');

// Subscribe to auction updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'auction',
  auctionId: '123'
}));

// Event types
interface AuctionEvent {
  type: 'new_bid' | 'auction_ended' | 'price_update';
  auctionId: string;
  data: any;
  timestamp: string;
}
```

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid auction parameters",
    "details": {
      "field": "startingPrice",
      "reason": "Must be greater than 0"
    }
  }
}
```

## Rate Limiting

- API calls are limited to 100 requests per minute per IP
- WebSocket connections are limited to 5 per IP
- Blockchain interactions are not rate-limited but may be affected by network conditions

## Integration Examples

### Creating an Auction

```javascript
// 1. Connect wallet
const { token } = await api.auth.connect(address, signature);

// 2. Prepare auction data
const auctionData = {
  title: "Example Auction",
  description: "Description here",
  startingPrice: ethers.parseEther("1.0"),
  duration: 3600, // 1 hour
  auctionType: "english"
};

// 3. Create auction
const tx = await contracts.auctionFactory.createAuction(auctionData);
await tx.wait();

// 4. Subscribe to updates
ws.subscribe(`auction_${tx.events[0].args.auctionId}`);
```

### Placing a Bid

```javascript
// 1. Get auction details
const auction = await contracts.englishAuction.getAuction(auctionId);

// 2. Place bid
const tx = await contracts.englishAuction.placeBid(auctionId, {
  value: ethers.parseEther("1.5")
});
await tx.wait();

// 3. Update UI
api.notifications.subscribe(auctionId);
``` 