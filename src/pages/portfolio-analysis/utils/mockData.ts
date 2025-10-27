import { subDays, startOfMinute } from 'date-fns';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  assetClass: 'Stocks' | 'Crypto' | 'Forex' | 'Commodities' | 'Bonds';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  todayChange: number;
  todayChangePercent: number;
  marketValue: number;
  portfolioPercentage: number;
  totalPnl: number;
  totalPnlPercent: number;
  riskContribution: number;
}

export const keyMetrics = {
  totalValue: 127450.32,
  dailyChange: 2340.50,
  dailyChangePercent: 1.87,
  allTimePnl: 27450.32,
  allTimePnlPercent: 27.45,
  initialInvestment: 100000,
  sharpeRatio: 1.84,
  maxDrawdown: -12.4,
  drawdownDate: '2024-09-15T00:00:00.000Z',
  recoveryProgress: 75,
  daysInDrawdown: 28,
  healthScore: 72,
};

export const holdings: Holding[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    assetClass: 'Crypto',
    quantity: 0.45,
    entryPrice: 42350.00,
    currentPrice: 45120.00,
    todayChange: 280,
    todayChangePercent: 0.62,
    marketValue: 20304.00,
    portfolioPercentage: 15.93,
    totalPnl: 1246.50,
    totalPnlPercent: 6.54,
    riskContribution: 8.2,
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    assetClass: 'Stocks',
    quantity: 50,
    entryPrice: 178.50,
    currentPrice: 190.25,
    todayChange: 2.75,
    todayChangePercent: 1.46,
    marketValue: 9512.50,
    portfolioPercentage: 7.46,
    totalPnl: 587.50,
    totalPnlPercent: 6.58,
    riskContribution: 4.1,
  },
    {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    assetClass: 'Crypto',
    quantity: 12.5,
    entryPrice: 2850.00,
    currentPrice: 3120.00,
    todayChange: 45.50,
    todayChangePercent: 1.48,
    marketValue: 39000.00,
    portfolioPercentage: 30.6,
    totalPnl: 3375.00,
    totalPnlPercent: 9.47,
    riskContribution: 12.8,
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    assetClass: 'Stocks',
    quantity: 85,
    entryPrice: 245.00,
    currentPrice: 267.50,
    todayChange: 3.25,
    todayChangePercent: 1.23,
    marketValue: 22737.50,
    portfolioPercentage: 17.8,
    totalPnl: 1912.50,
    totalPnlPercent: 9.19,
    riskContribution: 8.9,
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    assetClass: 'Stocks',
    quantity: 45,
    entryPrice: 142.50,
    currentPrice: 156.80,
    todayChange: 2.10,
    todayChangePercent: 1.36,
    marketValue: 7056.00,
    portfolioPercentage: 5.5,
    totalPnl: 643.50,
    totalPnlPercent: 10.04,
    riskContribution: 3.2,
  },
  {
    id: 'eurusd',
    symbol: 'EURUSD',
    name: 'Euro/US Dollar',
    assetClass: 'Forex',
    quantity: 50000,
    entryPrice: 1.0820,
    currentPrice: 1.0885,
    todayChange: 0.0015,
    todayChangePercent: 0.14,
    marketValue: 54425.00,
    portfolioPercentage: 42.7,
    totalPnl: 325.00,
    totalPnlPercent: 0.60,
    riskContribution: 15.6,
  },
  {
    id: 'gold',
    symbol: 'XAU',
    name: 'Gold',
    assetClass: 'Commodities',
    quantity: 8.5,
    entryPrice: 1985.00,
    currentPrice: 2045.00,
    todayChange: 12.50,
    todayChangePercent: 0.62,
    marketValue: 17382.50,
    portfolioPercentage: 13.6,
    totalPnl: 510.00,
    totalPnlPercent: 3.02,
    riskContribution: 6.8,
  },
  {
    id: 'spy',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    assetClass: 'Stocks',
    quantity: 125,
    entryPrice: 425.00,
    currentPrice: 441.25,
    todayChange: 2.85,
    todayChangePercent: 0.65,
    marketValue: 55156.25,
    portfolioPercentage: 43.3,
    totalPnl: 2031.25,
    totalPnlPercent: 3.83,
    riskContribution: 18.9,
  }
];

// Generate mock historical data for the performance chart
const generateHistoricalData = () => {
  const data = [];
  let lastValue = keyMetrics.initialInvestment;
  for (let i = 180; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const randomFactor = (Math.random() - 0.48) / 10; // Skewed slightly positive
    lastValue *= (1 + randomFactor);
    data.push({ 
      date: date.toISOString(), 
      portfolioValue: lastValue, 
      benchmarkValue: keyMetrics.initialInvestment * (1 + (180 - i) * 0.0005) // Simple benchmark growth
    });
  }
  return data;
};

export const historicalPerformance = generateHistoricalData();

export const assetAllocationData = [
  { name: 'Stocks', current: 35.4, target: 40, color: '#3b82f6' },
  { name: 'Crypto', current: 29.9, target: 25, color: '#f59e0b' },
  { name: 'Forex', current: 19.7, target: 20, color: '#10b981' },
  { name: 'Commodities', current: 9.4, target: 10, color: '#8b5cf6' },
  { name: 'Bonds', current: 5.5, target: 5, color: '#6b7280' },
];

