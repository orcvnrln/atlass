export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  epsGrowth: number;
  divYield: number;
  sector: string;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
}

export const stocksData: MarketData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.11,
    change: -2.76,
    changePercent: -1.44,
    volume: 136140000,
    marketCap: 2950000000000,
    pe: 28.76,
    epsGrowth: 4.47,
    divYield: 0.50,
    sector: 'Technology',
    rating: 'Strong Buy'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 374.89,
    change: -6.35,
    changePercent: -1.66,
    volume: 13340000,
    marketCap: 2780000000000,
    pe: 35.99,
    epsGrowth: 3.91,
    divYield: 0.72,
    sector: 'Technology',
    rating: 'Strong Buy'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 155.50,
    change: -0.84,
    changePercent: -0.54,
    volume: 14140000,
    marketCap: 1620000000000,
    pe: 26.14,
    epsGrowth: 9.39,
    divYield: 0.00,
    sector: 'Consumer Discretionary',
    rating: 'Buy'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 165.46,
    change: -1.56,
    changePercent: -0.93,
    volume: 14140000,
    marketCap: 2040000000000,
    pe: 23.71,
    epsGrowth: 5.73,
    divYield: 0.00,
    sector: 'Technology',
    rating: 'Strong Buy'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 458.69,
    change: -1.79,
    changePercent: -0.39,
    volume: 71130000,
    marketCap: 1460000000000,
    pe: 71.00,
    epsGrowth: 1.46,
    divYield: 0.00,
    sector: 'Consumer Discretionary',
    rating: 'Hold'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 245.46,
    change: -0.84,
    changePercent: -0.34,
    volume: 26140000,
    marketCap: 6040000000000,
    pe: 33.33,
    epsGrowth: 34.67,
    divYield: 0.03,
    sector: 'Technology',
    rating: 'Strong Buy'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 717.34,
    change: -6.37,
    changePercent: -0.88,
    volume: 10790000,
    marketCap: 1820000000000,
    pe: 24.36,
    epsGrowth: 6.58,
    divYield: 0.00,
    sector: 'Technology',
    rating: 'Buy'
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 719.34,
    change: -1.79,
    changePercent: -0.25,
    volume: 2180000,
    marketCap: 310000000000,
    pe: 41.71,
    epsGrowth: 1.46,
    divYield: 0.00,
    sector: 'Communication Services',
    rating: 'Hold'
  }
];

export const forexData: MarketData[] = [
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    price: 1.0542,
    change: 0.0012,
    changePercent: 0.11,
    volume: 1500000000,
    marketCap: 0,
    pe: 0,
    epsGrowth: 0,
    divYield: 0,
    sector: 'Currency',
    rating: 'Hold'
  },
  {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    price: 1.2634,
    change: -0.0023,
    changePercent: -0.18,
    volume: 800000000,
    marketCap: 0,
    pe: 0,
    epsGrowth: 0,
    divYield: 0,
    sector: 'Currency',
    rating: 'Sell'
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    price: 149.85,
    change: 0.45,
    changePercent: 0.30,
    volume: 1200000000,
    marketCap: 0,
    pe: 0,
    epsGrowth: 0,
    divYield: 0,
    sector: 'Currency',
    rating: 'Buy'
  }
];

export const cryptoData: MarketData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67234.50,
    change: 1234.50,
    changePercent: 1.87,
    volume: 28500000000,
    marketCap: 1320000000000,
    pe: 0,
    epsGrowth: 0,
    divYield: 0,
    sector: 'Cryptocurrency',
    rating: 'Buy'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3456.78,
    change: -89.12,
    changePercent: -2.51,
    volume: 15200000000,
    marketCap: 415000000000,
    pe: 0,
    epsGrowth: 0,
    divYield: 0,
    sector: 'Cryptocurrency',
    rating: 'Hold'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.4567,
    change: 0.0234,
    changePercent: 5.40,
    volume: 890000000,
    marketCap: 16000000000,
    pe: 0,
    epsGrowth: 0,
    divYield: 0,
    sector: 'Cryptocurrency',
    rating: 'Strong Buy'
  }
];

export const getDataByCategory = (category: string): MarketData[] => {
  switch (category) {
    case 'All Stocks':
      return stocksData;
    case 'Forex':
      return forexData;
    case 'Crypto':
      return cryptoData;
    case 'Indices':
      return []; // Add indices data here
    case 'Metals':
      return []; // Add metals data here
    case 'Bonds':
      return []; // Add bonds data here
    case 'ETFs':
      return []; // Add ETFs data here
    default:
      return stocksData;
  }
};
