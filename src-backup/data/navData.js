import { 
  LayoutDashboard, Wallet, Star, Newspaper, CalendarDays, Settings,
  Globe, TrendingUp, Zap, BarChart3, Activity, FileText, Flame 
} from 'lucide-react';

export const mainNavItems = [
  { path: '/', icon: LayoutDashboard, name: 'Dashboard' },
  { path: '/portfolio', icon: Wallet, name: 'Portfolio' },
  { path: '/watchlist', icon: Star, name: 'Watchlist' },
  { path: '/news', icon: Newspaper, name: 'News Hub' },
  { path: '/calendar', icon: CalendarDays, name: 'Calendar' },
];

export const marketNavItems = [
  { path: '/markets/major', icon: Globe, name: 'Major FX' },
  { path: '/markets/minor', icon: TrendingUp, name: 'Minor FX' },
  { path: '/markets/crypto', icon: Zap, name: 'Crypto' },
  { path: '/markets/stocks', icon: BarChart3, name: 'Stocks' },
  { path: '/markets/indices', icon: Activity, name: 'Indices' },
  { path: '/markets/bonds', icon: FileText, name: 'Bonds' },
  { path: '/markets/energy', icon: Flame, name: 'Energy' },
];

export const marketAssets = {
  'Major FX': [
    { symbol: 'EURUSD', name: 'Euro vs US Dollar', flag1: '🇪🇺', flag2: '🇺🇸' },
    { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', flag1: '🇬🇧', flag2: '🇺🇸' },
    { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', flag1: '🇺🇸', flag2: '🇯🇵' },
    { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', flag1: '🇺🇸', flag2: '🇨🇭' },
    { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', flag1: '🇦🇺', flag2: '🇺🇸' },
    { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', flag1: '🇺🇸', flag2: '🇨🇦' },
    { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', flag1: '🇳🇿', flag2: '🇺🇸' },
  ],
  'Minor FX': [
    { symbol: 'EURGBP', name: 'Euro vs British Pound', flag1: '🇪🇺', flag2: '🇬🇧' },
    { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', flag1: '🇪🇺', flag2: '🇯🇵' },
    { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', flag1: '🇬🇧', flag2: '🇯🇵' },
    { symbol: 'AUDCAD', name: 'Australian Dollar vs Canadian Dollar', flag1: '🇦🇺', flag2: '🇨🇦' },
    { symbol: 'CHFJPY', name: 'Swiss Franc vs Japanese Yen', flag1: '🇨🇭', flag2: '🇯🇵' },
    { symbol: 'EURAUD', name: 'Euro vs Australian Dollar', flag1: '🇪🇺', flag2: '🇦🇺' },
  ],
  'Crypto': [
    { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar', flag1: '₿', flag2: '🇺🇸' },
    { symbol: 'ETHUSD', name: 'Ethereum vs US Dollar', flag1: 'Ξ', flag2: '🇺🇸' },
    { symbol: 'BNBUSD', name: 'Binance Coin vs US Dollar', flag1: '🟡', flag2: '🇺🇸' },
    { symbol: 'ADAUSD', name: 'Cardano vs US Dollar', flag1: '🔵', flag2: '🇺🇸' },
    { symbol: 'SOLUSD', name: 'Solana vs US Dollar', flag1: '🟣', flag2: '🇺🇸' },
    { symbol: 'XRPUSD', name: 'Ripple vs US Dollar', flag1: '🔵', flag2: '🇺🇸' },
  ],
  'Stocks': [
    { symbol: 'AAPL', name: 'Apple Inc.', flag1: '🍎', flag2: '🇺🇸' },
    { symbol: 'TSLA', name: 'Tesla Inc.', flag1: '⚡', flag2: '🇺🇸' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', flag1: '🔍', flag2: '🇺🇸' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', flag1: '🪟', flag2: '🇺🇸' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', flag1: '📦', flag2: '🇺🇸' },
    { symbol: 'META', name: 'Meta Platforms Inc.', flag1: '📘', flag2: '🇺🇸' },
  ],
  'Indices': [
    { symbol: 'SPX500', name: 'S&P 500', flag1: '📈', flag2: '🇺🇸' },
    { symbol: 'NAS100', name: 'NASDAQ 100', flag1: '💻', flag2: '🇺🇸' },
    { symbol: 'US30', name: 'Dow Jones Industrial Average', flag1: '🏭', flag2: '🇺🇸' },
    { symbol: 'UK100', name: 'FTSE 100', flag1: '🇬🇧', flag2: '📊' },
    { symbol: 'JPN225', name: 'Nikkei 225', flag1: '🇯🇵', flag2: '📊' },
    { symbol: 'GER40', name: 'DAX 40', flag1: '🇩🇪', flag2: '📊' },
  ],
  'Bonds': [
    { symbol: 'US10Y', name: 'US 10-Year Treasury', flag1: '🇺🇸', flag2: '📈' },
    { symbol: 'US30Y', name: 'US 30-Year Treasury', flag1: '🇺🇸', flag2: '📈' },
    { symbol: 'DE10Y', name: 'German 10-Year Bund', flag1: '🇩🇪', flag2: '📈' },
    { symbol: 'UK10Y', name: 'UK 10-Year Gilt', flag1: '🇬🇧', flag2: '📈' },
    { symbol: 'JP10Y', name: 'Japanese 10-Year JGB', flag1: '🇯🇵', flag2: '📈' },
  ],
  'Energy': [
    { symbol: 'WTI', name: 'West Texas Intermediate', flag1: '🛢️', flag2: '🇺🇸' },
    { symbol: 'BRENT', name: 'Brent Crude Oil', flag1: '🛢️', flag2: '🇬🇧' },
    { symbol: 'NGAS', name: 'Natural Gas', flag1: '⛽', flag2: '🇺🇸' },
    { symbol: 'HEAT', name: 'Heating Oil', flag1: '🔥', flag2: '🇺🇸' },
    { symbol: 'GAS', name: 'Gasoline', flag1: '⛽', flag2: '🇺🇸' },
  ]
};
