# Frontend Documentation

## Architecture

The TeNi-DeFi frontend is built using React and follows a component-based architecture with the following structure:

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── context/        # React context providers
├── utils/          # Utility functions
├── services/       # API and blockchain services
└── contracts/      # Contract ABIs and addresses
```

## Components

### Core Components

#### 1. Navbar (`Navbar.js`)
Main navigation component with wallet connection status.

**Features:**
- Wallet connection button
- Navigation links
- User profile access
- Network status indicator

**Props:**
```javascript
{
  isConnected: boolean,
  account: string,
  balance: string,
  networkName: string
}
```

#### 2. UserProfile (`UserProfile.js`)
User profile management component.

**Features:**
- Profile information display
- Transaction history
- Auction history
- Rating system

**Props:**
```javascript
{
  address: string,
  username: string,
  reputation: number,
  transactions: Array
}
```

#### 3. AuctionCard (`AuctionCard.js`)
Card component for displaying auction information.

**Features:**
- Auction details display
- Bid placement interface
- Timer display
- Status indicators

**Props:**
```javascript
{
  auctionId: number,
  title: string,
  description: string,
  currentPrice: string,
  endTime: number,
  images: Array<string>,
  status: string
}
```

### Auction Components

#### 1. PhysicalItemProcess (`PhysicalItemProcess.js`)
Handles the physical item auction process.

**Features:**
- Shipping information
- Tracking updates
- Confirmation workflow
- Dispute handling

**Props:**
```javascript
{
  auctionId: number,
  seller: string,
  buyer: string,
  status: string,
  trackingInfo: object
}
```

#### 2. UserDashboard (`UserDashboard.js`)
User's personal dashboard.

**Features:**
- Active auctions
- Bid history
- Won auctions
- Created auctions

**Props:**
```javascript
{
  userAddress: string,
  activeAuctions: Array,
  bids: Array,
  wonAuctions: Array
}
```

## Context Providers

### 1. Web3Context
Manages blockchain connection and state.

```javascript
const Web3Context = {
  account: string,
  chainId: number,
  provider: Web3Provider,
  contracts: {
    englishAuction: Contract,
    dutchAuction: Contract,
    sealedBidAuction: Contract,
    fixedSwapAuction: Contract
  }
}
```

### 2. UserContext
Manages user-related state.

```javascript
const UserContext = {
  profile: object,
  transactions: Array,
  notifications: Array,
  preferences: object
}
```

## Utility Functions

### 1. Auction Utilities (`utils/auction.js`)
```javascript
// Create new auction
async function createAuction(auctionData)

// Place bid
async function placeBid(auctionId, amount)

// End auction
async function endAuction(auctionId)

// Get auction details
async function getAuctionDetails(auctionId)
```

### 2. Web3 Utilities (`utils/web3.js`)
```javascript
// Connect wallet
async function connectWallet()

// Get network details
async function getNetworkInfo()

// Format prices
function formatPrice(amount)

// Handle transactions
async function sendTransaction(tx)
```

## State Management

### Local State
- Component-level state using useState
- Form state management
- UI state (loading, errors)

### Global State
- Web3 connection state
- User authentication state
- Contract interactions
- Global notifications

## Error Handling

### 1. Transaction Errors
```javascript
try {
  await contract.method()
} catch (error) {
  if (error.code === 4001) {
    // User rejected transaction
  } else if (error.code === -32603) {
    // Internal JSON-RPC error
  }
}
```

### 2. UI Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to service
    logErrorToService(error, errorInfo);
  }
}
```

## Styling

### 1. Component Styling
- Tailwind CSS for utility classes
- CSS modules for component-specific styles
- Responsive design patterns

### 2. Theme Configuration
```javascript
const theme = {
  colors: {
    primary: '#4F46E5',
    secondary: '#10B981',
    error: '#EF4444'
  },
  typography: {
    heading: 'font-bold text-2xl',
    body: 'text-base text-gray-600'
  }
}
```

## Performance Optimization

### 1. Code Splitting
```javascript
const AuctionPage = React.lazy(() => import('./pages/AuctionPage'))
```

### 2. Memoization
```javascript
const MemoizedAuctionCard = React.memo(AuctionCard)
```

### 3. Data Fetching
- Caching strategies
- Pagination
- Infinite scrolling

## Testing

### 1. Unit Tests
```javascript
describe('AuctionCard', () => {
  it('displays correct auction information', () => {
    // Test implementation
  })
})
```

### 2. Integration Tests
```javascript
describe('Auction Creation', () => {
  it('creates new auction successfully', () => {
    // Test implementation
  })
})
```

## Build and Deployment

### 1. Development
```bash
npm run dev        # Start development server
npm run test       # Run tests
npm run lint       # Run linter
```

### 2. Production
```bash
npm run build      # Create production build
npm run analyze    # Analyze bundle size
```

## Security Considerations

1. **Input Validation**
   - Sanitize user inputs
   - Validate transaction parameters
   - Check file uploads

2. **Authentication**
   - Wallet signature verification
   - Session management
   - Access control

3. **Data Protection**
   - Secure storage of sensitive data
   - Encryption of private information
   - Rate limiting 