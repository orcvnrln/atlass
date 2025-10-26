export const mockKpiData = {
  portfolioValue: 1256345.89,
  dailyPnl: 1245.21,
  sharpeRatio: 1.87,
  riskScore: 6.2,
};

export const mockPerformanceData = [
  { name: 'Jan', value: 1000000 },
  { name: 'Feb', value: 1050000 },
  { name: 'Mar', value: 1020000 },
  { name: 'Apr', value: 1080000 },
  { name: 'May', value: 1150000 },
  { name: 'Jun', value: 1130000 },
  { name: 'Jul', value: 1200000 },
  { name: 'Aug', value: 1220000 },
  { name: 'Sep', value: 1256345 },
];

export const mockAiSignals = [
  { id: 1, type: 'Buy', asset: 'AAPL', confidence: 85 },
  { id: 2, type: 'Sell', asset: 'TSLA', confidence: 72 },
  { id: 3, type: 'Hold', asset: 'AMZN', confidence: 91 },
];

export const mockTradingBots = [
  { id: 1, name: 'Momentum Bot', status: 'Active', pnl: 543.21 },
  { id: 2, name: 'Arbitrage Bot', status: 'Active', pnl: 210.55 },
  { id: 3, name: 'Mean Reversion Bot', status: 'Inactive', pnl: -50.1 },
];

export const mockNewsData = [
  { id: 1, source: 'Bloomberg', headline: 'Federal Reserve hints at interest rate hikes to curb inflation.' },
  { id: 2, source: 'Reuters', headline: 'Tech stocks rally as new AI chipsets are announced.' },
  { id: 3, source: 'Wall Street Journal', headline: 'Oil prices surge amid geopolitical tensions in the Middle East.' },
  { id: 4, source: 'Financial Times', headline: 'European markets show mixed signals as ECB holds rates steady.' },
];

export const mockSentimentData = {
  bullish: 65,
  bearish: 25,
  neutral: 10,
};

export const mockConnectionStatus = {
  marketData: true,
  aiService: true,
  portfolioSync: false,
};
