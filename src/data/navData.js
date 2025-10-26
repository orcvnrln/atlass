import { 
  LayoutDashboard, Wallet, Star, Newspaper, CalendarDays, Settings,
  Globe, TrendingUp, Zap, BarChart3, Activity, FileText, Flame,
  Layers2, CandlestickChart
} from 'lucide-react';

export const mainNavItems = [
  { path: '/', icon: LayoutDashboard, name: 'Dashboard' },
  { path: '/portfolio', icon: Wallet, name: 'Portfolio' },
  { path: '/watchlist', icon: Star, name: 'Watchlist' },
  { path: '/news', icon: Newspaper, name: 'News Hub' },
  { path: '/calendar', icon: CalendarDays, name: 'Calendar' },
  { path: '/workspace/institutional', icon: Layers2, name: 'Institutional Workspace' },
];

export const marketNavItems = [
  { slug: 'major', icon: Globe, name: 'Major FX' },
  { slug: 'minor', icon: TrendingUp, name: 'Minor FX' },
  { slug: 'crypto', icon: Zap, name: 'Crypto' },
  { slug: 'stocks', icon: BarChart3, name: 'Stocks' },
  { slug: 'indices', icon: Activity, name: 'Indices' },
  { slug: 'bonds', icon: FileText, name: 'Bonds' },
  { slug: 'energy', icon: Flame, name: 'Energy' },
  { slug: 'futures', icon: CandlestickChart, name: 'Futures' },
];

const fxDisplay = (symbol) => `${symbol.slice(0, 3)}/${symbol.slice(3)}`;

export const marketAssets = {
  'Major FX': [
    { symbol: 'EURUSD', name: 'Euro vs US Dollar', flag1: '🇪🇺', flag2: '🇺🇸', displaySymbol: fxDisplay('EURUSD'), tvSymbol: 'OANDA:EURUSD' },
    { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', flag1: '🇬🇧', flag2: '🇺🇸', displaySymbol: fxDisplay('GBPUSD'), tvSymbol: 'OANDA:GBPUSD' },
    { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', flag1: '🇺🇸', flag2: '🇯🇵', displaySymbol: fxDisplay('USDJPY'), tvSymbol: 'OANDA:USDJPY' },
    { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', flag1: '🇺🇸', flag2: '🇨🇭', displaySymbol: fxDisplay('USDCHF'), tvSymbol: 'OANDA:USDCHF' },
    { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', flag1: '🇦🇺', flag2: '🇺🇸', displaySymbol: fxDisplay('AUDUSD'), tvSymbol: 'OANDA:AUDUSD' },
    { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', flag1: '🇺🇸', flag2: '🇨🇦', displaySymbol: fxDisplay('USDCAD'), tvSymbol: 'OANDA:USDCAD' },
    { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', flag1: '🇳🇿', flag2: '🇺🇸', displaySymbol: fxDisplay('NZDUSD'), tvSymbol: 'OANDA:NZDUSD' },
    { symbol: 'EURCHF', name: 'Euro vs Swiss Franc', flag1: '🇪🇺', flag2: '🇨🇭', displaySymbol: fxDisplay('EURCHF'), tvSymbol: 'OANDA:EURCHF' },
    { symbol: 'GBPCHF', name: 'British Pound vs Swiss Franc', flag1: '🇬🇧', flag2: '🇨🇭', displaySymbol: fxDisplay('GBPCHF'), tvSymbol: 'OANDA:GBPCHF' },
    { symbol: 'AUDNZD', name: 'Australian Dollar vs New Zealand Dollar', flag1: '🇦🇺', flag2: '🇳🇿', displaySymbol: fxDisplay('AUDNZD'), tvSymbol: 'OANDA:AUDNZD' },
  ],
  'Minor FX': [
    { symbol: 'EURGBP', name: 'Euro vs British Pound', flag1: '🇪🇺', flag2: '🇬🇧', displaySymbol: fxDisplay('EURGBP'), tvSymbol: 'OANDA:EURGBP' },
    { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', flag1: '🇪🇺', flag2: '🇯🇵', displaySymbol: fxDisplay('EURJPY'), tvSymbol: 'OANDA:EURJPY' },
    { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', flag1: '🇬🇧', flag2: '🇯🇵', displaySymbol: fxDisplay('GBPJPY'), tvSymbol: 'OANDA:GBPJPY' },
    { symbol: 'AUDCAD', name: 'Australian Dollar vs Canadian Dollar', flag1: '🇦🇺', flag2: '🇨🇦', displaySymbol: fxDisplay('AUDCAD'), tvSymbol: 'OANDA:AUDCAD' },
    { symbol: 'CHFJPY', name: 'Swiss Franc vs Japanese Yen', flag1: '🇨🇭', flag2: '🇯🇵', displaySymbol: fxDisplay('CHFJPY'), tvSymbol: 'OANDA:CHFJPY' },
    { symbol: 'EURAUD', name: 'Euro vs Australian Dollar', flag1: '🇪🇺', flag2: '🇦🇺', displaySymbol: fxDisplay('EURAUD'), tvSymbol: 'OANDA:EURAUD' },
    { symbol: 'EURCAD', name: 'Euro vs Canadian Dollar', flag1: '🇪🇺', flag2: '🇨🇦', displaySymbol: fxDisplay('EURCAD'), tvSymbol: 'OANDA:EURCAD' },
    { symbol: 'GBPAUD', name: 'British Pound vs Australian Dollar', flag1: '🇬🇧', flag2: '🇦🇺', displaySymbol: fxDisplay('GBPAUD'), tvSymbol: 'OANDA:GBPAUD' },
    { symbol: 'GBPCAD', name: 'British Pound vs Canadian Dollar', flag1: '🇬🇧', flag2: '🇨🇦', displaySymbol: fxDisplay('GBPCAD'), tvSymbol: 'OANDA:GBPCAD' },
    { symbol: 'NZDJPY', name: 'New Zealand Dollar vs Japanese Yen', flag1: '🇳🇿', flag2: '🇯🇵', displaySymbol: fxDisplay('NZDJPY'), tvSymbol: 'OANDA:NZDJPY' },
    { symbol: 'AUDJPY', name: 'Australian Dollar vs Japanese Yen', flag1: '🇦🇺', flag2: '🇯🇵', displaySymbol: fxDisplay('AUDJPY'), tvSymbol: 'OANDA:AUDJPY' },
    { symbol: 'CADJPY', name: 'Canadian Dollar vs Japanese Yen', flag1: '🇨🇦', flag2: '🇯🇵', displaySymbol: fxDisplay('CADJPY'), tvSymbol: 'OANDA:CADJPY' },
  ],
  'Crypto': [
    { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar', flag1: '₿', flag2: '🇺🇸', displaySymbol: 'BTC/USD', tvSymbol: 'BINANCE:BTCUSDT' },
    { symbol: 'ETHUSD', name: 'Ethereum vs US Dollar', flag1: 'Ξ', flag2: '🇺🇸', displaySymbol: 'ETH/USD', tvSymbol: 'BINANCE:ETHUSDT' },
    { symbol: 'BNBUSD', name: 'Binance Coin vs US Dollar', flag1: '🟡', flag2: '🇺🇸', displaySymbol: 'BNB/USD', tvSymbol: 'BINANCE:BNBUSDT' },
    { symbol: 'ADAUSD', name: 'Cardano vs US Dollar', flag1: '🔵', flag2: '🇺🇸', displaySymbol: 'ADA/USD', tvSymbol: 'BINANCE:ADAUSDT' },
    { symbol: 'SOLUSD', name: 'Solana vs US Dollar', flag1: '🟣', flag2: '🇺🇸', displaySymbol: 'SOL/USD', tvSymbol: 'BINANCE:SOLUSDT' },
    { symbol: 'XRPUSD', name: 'Ripple vs US Dollar', flag1: '🔵', flag2: '🇺🇸', displaySymbol: 'XRP/USD', tvSymbol: 'BINANCE:XRPUSDT' },
    { symbol: 'DOGEUSD', name: 'Dogecoin vs US Dollar', flag1: '🐕', flag2: '🇺🇸', displaySymbol: 'DOGE/USD', tvSymbol: 'BINANCE:DOGEUSDT' },
    { symbol: 'DOTUSD', name: 'Polkadot vs US Dollar', flag1: '🔴', flag2: '🇺🇸', displaySymbol: 'DOT/USD', tvSymbol: 'BINANCE:DOTUSDT' },
    { symbol: 'MATICUSD', name: 'Polygon vs US Dollar', flag1: '🟣', flag2: '🇺🇸', displaySymbol: 'MATIC/USD', tvSymbol: 'BINANCE:MATICUSDT' },
    { symbol: 'AVAXUSD', name: 'Avalanche vs US Dollar', flag1: '🔺', flag2: '🇺🇸', displaySymbol: 'AVAX/USD', tvSymbol: 'BINANCE:AVAXUSDT' },
    { symbol: 'LINKUSD', name: 'Chainlink vs US Dollar', flag1: '🔗', flag2: '🇺🇸', displaySymbol: 'LINK/USD', tvSymbol: 'BINANCE:LINKUSDT' },
    { symbol: 'UNIUSD', name: 'Uniswap vs US Dollar', flag1: '🦄', flag2: '🇺🇸', displaySymbol: 'UNI/USD', tvSymbol: 'BINANCE:UNIUSDT' },
  ],
  'Stocks': [
    { symbol: 'AAPL', name: 'Apple Inc.', flag1: '🍎', flag2: '🇺🇸', displaySymbol: 'AAPL', tvSymbol: 'NASDAQ:AAPL' },
    { symbol: 'TSLA', name: 'Tesla Inc.', flag1: '⚡', flag2: '🇺🇸', displaySymbol: 'TSLA', tvSymbol: 'NASDAQ:TSLA' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', flag1: '🔍', flag2: '🇺🇸', displaySymbol: 'GOOGL', tvSymbol: 'NASDAQ:GOOGL' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', flag1: '🪟', flag2: '🇺🇸', displaySymbol: 'MSFT', tvSymbol: 'NASDAQ:MSFT' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', flag1: '📦', flag2: '🇺🇸', displaySymbol: 'AMZN', tvSymbol: 'NASDAQ:AMZN' },
    { symbol: 'META', name: 'Meta Platforms Inc.', flag1: '📘', flag2: '🇺🇸', displaySymbol: 'META', tvSymbol: 'NASDAQ:META' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', flag1: '🎮', flag2: '🇺🇸', displaySymbol: 'NVDA', tvSymbol: 'NASDAQ:NVDA' },
    { symbol: 'NFLX', name: 'Netflix Inc.', flag1: '🎬', flag2: '🇺🇸', displaySymbol: 'NFLX', tvSymbol: 'NASDAQ:NFLX' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', flag1: '💻', flag2: '🇺🇸', displaySymbol: 'AMD', tvSymbol: 'NASDAQ:AMD' },
    { symbol: 'BABA', name: 'Alibaba Group', flag1: '🛒', flag2: '🇨🇳', displaySymbol: 'BABA', tvSymbol: 'NYSE:BABA' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', flag1: '🏦', flag2: '🇺🇸', displaySymbol: 'JPM', tvSymbol: 'NYSE:JPM' },
    { symbol: 'V', name: 'Visa Inc.', flag1: '💳', flag2: '🇺🇸', displaySymbol: 'V', tvSymbol: 'NYSE:V' },
  ],
  'Indices': [
    { symbol: 'SPX500', name: 'S&P 500', flag1: '📈', flag2: '🇺🇸', displaySymbol: 'S&P 500', tvSymbol: 'SP:SPX' },
    { symbol: 'NAS100', name: 'NASDAQ 100', flag1: '💻', flag2: '🇺🇸', displaySymbol: 'NASDAQ 100', tvSymbol: 'NASDAQ:NDX' },
    { symbol: 'US30', name: 'Dow Jones Industrial Average', flag1: '🏭', flag2: '🇺🇸', displaySymbol: 'Dow 30', tvSymbol: 'DJ:DJI' },
    { symbol: 'UK100', name: 'FTSE 100', flag1: '🇬🇧', flag2: '📊', displaySymbol: 'FTSE 100', tvSymbol: 'OANDA:UK100GBP' },
    { symbol: 'JPN225', name: 'Nikkei 225', flag1: '🇯🇵', flag2: '📊', displaySymbol: 'Nikkei 225', tvSymbol: 'INDEX:NKY' },
    { symbol: 'GER40', name: 'DAX 40', flag1: '🇩🇪', flag2: '📊', displaySymbol: 'DAX 40', tvSymbol: 'XETR:DAX' },
  ],
  'Bonds': [
    { symbol: 'US10Y', name: 'US 10-Year Treasury', flag1: '🇺🇸', flag2: '📈', displaySymbol: 'US10Y', tvSymbol: 'TVC:US10Y' },
    { symbol: 'US30Y', name: 'US 30-Year Treasury', flag1: '🇺🇸', flag2: '📈', displaySymbol: 'US30Y', tvSymbol: 'TVC:US30Y' },
    { symbol: 'DE10Y', name: 'German 10-Year Bund', flag1: '🇩🇪', flag2: '📈', displaySymbol: 'DE10Y', tvSymbol: 'TVC:DE10Y' },
    { symbol: 'UK10Y', name: 'UK 10-Year Gilt', flag1: '🇬🇧', flag2: '📈', displaySymbol: 'UK10Y', tvSymbol: 'TVC:UK10Y' },
    { symbol: 'JP10Y', name: 'Japanese 10-Year JGB', flag1: '🇯🇵', flag2: '📈', displaySymbol: 'JP10Y', tvSymbol: 'TVC:JP10Y' },
  ],
  'Energy': [
    { symbol: 'WTI', name: 'West Texas Intermediate', flag1: '🛢️', flag2: '🇺🇸', displaySymbol: 'WTI', tvSymbol: 'NYMEX:CL1!' },
    { symbol: 'BRENT', name: 'Brent Crude Oil', flag1: '🛢️', flag2: '🇬🇧', displaySymbol: 'Brent', tvSymbol: 'ICE:OIL1!' },
    { symbol: 'NGAS', name: 'Natural Gas', flag1: '⛽', flag2: '🇺🇸', displaySymbol: 'NatGas', tvSymbol: 'NYMEX:NG1!' },
    { symbol: 'HEAT', name: 'Heating Oil', flag1: '🔥', flag2: '🇺🇸', displaySymbol: 'Heating Oil', tvSymbol: 'NYMEX:HO1!' },
    { symbol: 'GAS', name: 'Gasoline', flag1: '⛽', flag2: '🇺🇸', displaySymbol: 'Gasoline', tvSymbol: 'NYMEX:RB1!' },
  ],
  'Futures': [
    { symbol: 'ES1!', name: 'E-Mini S&P 500', flag1: '📈', flag2: '🇺🇸', displaySymbol: 'ES', tvSymbol: 'CME_MINI:ES1!' },
    { symbol: 'NQ1!', name: 'E-Mini Nasdaq 100', flag1: '💻', flag2: '🇺🇸', displaySymbol: 'NQ', tvSymbol: 'CME_MINI:NQ1!' },
    { symbol: 'YM1!', name: 'Mini Dow Jones', flag1: '🏭', flag2: '🇺🇸', displaySymbol: 'YM', tvSymbol: 'CBOT_MINI:YM1!' },
    { symbol: 'GC1!', name: 'Gold Futures', flag1: '🥇', flag2: '🇺🇸', displaySymbol: 'GC', tvSymbol: 'COMEX:GC1!' },
    { symbol: 'SI1!', name: 'Silver Futures', flag1: '🥈', flag2: '🇺🇸', displaySymbol: 'SI', tvSymbol: 'COMEX:SI1!' },
    { symbol: 'CL1!', name: 'Crude Oil Futures', flag1: '🛢️', flag2: '🇺🇸', displaySymbol: 'CL', tvSymbol: 'NYMEX:CL1!' },
    { symbol: 'NG1!', name: 'Natural Gas Futures', flag1: '⛽', flag2: '🇺🇸', displaySymbol: 'NG', tvSymbol: 'NYMEX:NG1!' },
    { symbol: 'ZW1!', name: 'Wheat Futures', flag1: '🌾', flag2: '🇺🇸', displaySymbol: 'ZW', tvSymbol: 'CBOT:ZW1!' },
    { symbol: 'ZS1!', name: 'Soybean Futures', flag1: '🌱', flag2: '🇺🇸', displaySymbol: 'ZS', tvSymbol: 'CBOT:ZS1!' },
    { symbol: 'KC1!', name: 'Coffee Futures', flag1: '☕', flag2: '🇧🇷', displaySymbol: 'KC', tvSymbol: 'ICEUS:KC1!' },
  ]
};

export const flattenMarketAssets = Object.entries(marketAssets).flatMap(([category, assets]) =>
  assets.map(asset => ({ ...asset, category }))
);

export const getAssetMeta = (symbol) => {
  if (!symbol) return null;
  const normalized = symbol.toUpperCase();
  return flattenMarketAssets.find(asset => asset.symbol.toUpperCase() === normalized) || null;
};
