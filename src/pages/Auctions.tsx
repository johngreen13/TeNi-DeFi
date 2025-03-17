import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpDown, Filter } from 'lucide-react';

// Mock auction data
const mockAuctions = [
  {
    id: 1,
    title: 'ETH-USDC Pool',
    type: 'Fixed Swap',
    tokenA: 'ETH',
    tokenB: 'USDC',
    price: '1 ETH = 1800 USDC',
    remaining: '45 ETH',
    total: '100 ETH',
    endTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    creator: '0x1234...5678',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  },
  {
    id: 2,
    title: 'LINK Token Sale',
    type: 'Dutch Auction',
    tokenA: 'LINK',
    tokenB: 'ETH',
    price: 'Starting at 0.01 ETH',
    remaining: '5000 LINK',
    total: '10000 LINK',
    endTime: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
    creator: '0xabcd...efgh',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  },
  {
    id: 3,
    title: 'NFT Collection Auction',
    type: 'English Auction',
    tokenA: 'NFT',
    tokenB: 'ETH',
    price: 'Current bid: 2.5 ETH',
    remaining: '1 NFT',
    total: '1 NFT',
    endTime: new Date(Date.now() + 259200000).toISOString(), // 72 hours from now
    creator: '0x7890...1234',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  },
  {
    id: 4,
    title: 'DAO Governance Token',
    type: 'Sealed-Bid Auction',
    tokenA: 'GOV',
    tokenB: 'DAI',
    price: 'Min bid: 100 DAI',
    remaining: '10000 GOV',
    total: '10000 GOV',
    endTime: new Date(Date.now() + 345600000).toISOString(), // 96 hours from now
    creator: '0xefgh...ijkl',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  }
];

const AuctionCard = ({ auction }: { auction: typeof mockAuctions[0] }) => {
  const endDate = new Date(auction.endTime);
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={auction.image} alt={auction.title} className="w-full h-48 object-cover" />
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
          {auction.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{auction.title}</h3>
        <div className="flex justify-between text-gray-400 text-sm mb-2">
          <span>{auction.tokenA} → {auction.tokenB}</span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {daysLeft}d {hoursLeft}h left
          </span>
        </div>
        <div className="mb-4">
          <p className="text-gray-300">{auction.price}</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${(1 - parseInt(auction.remaining) / parseInt(auction.total)) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Remaining: {auction.remaining}</span>
            <span>Total: {auction.total}</span>
          </div>
        </div>
        <Link
          to={`/auctions/${auction.id}`}
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const Auctions = () => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Filter auctions based on selected filter
  const filteredAuctions = filter === 'all'
    ? mockAuctions
    : mockAuctions.filter(auction => auction.type.toLowerCase().includes(filter.toLowerCase()));

  // Sort auctions based on selected sort option
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
    } else if (sort === 'oldest') {
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Explore Auctions</h1>
          <p className="text-gray-400 mt-2">Discover and participate in various types of auctions</p>
        </div>
        <Link
          to="/create"
          className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Auction
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-300 mr-2">Filter:</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('fixed')}
                className={`px-3 py-1 rounded-full text-sm ${filter === 'fixed' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Fixed Swap
              </button>
              <button
                onClick={() => setFilter('dutch')}
                className={`px-3 py-1 rounded-full text-sm ${filter === 'dutch' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Dutch
              </button>
              <button
                onClick={() => setFilter('english')}
                className={`px-3 py-1 rounded-full text-sm ${filter === 'english' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                English
              </button>
              <button
                onClick={() => setFilter('sealed')}
                className={`px-3 py-1 rounded-full text-sm ${filter === 'sealed' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Sealed-Bid
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <ArrowUpDown className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-300 mr-2">Sort by:</span>
            </div>
            <div className="mt-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-gray-700 text-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="newest">Ending Soon</option>
                <option value="oldest">Ending Later</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAuctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>

      {sortedAuctions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No auctions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Auctions;