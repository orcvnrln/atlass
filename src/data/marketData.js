const marketData = {
    // Majors
    'EURUSD': { symbol: 'EURUSD', name: 'Euro vs US Dollar', flag: '🇪🇺/🇺🇸', price: 1.0855, change: 0.0015, percent: 0.14, volume: '120M', aiSignal: 'BUY' },
    'USDJPY': { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', flag: '🇺🇸/🇯🇵', price: 157.25, change: -0.25, percent: -0.16, volume: '110M', aiSignal: 'SELL' },
    'GBPUSD': { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', flag: '🇬🇧/🇺🇸', price: 1.2730, change: 0.0020, percent: 0.16, volume: '95M', aiSignal: 'BUY' },
    'USDCHF': { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', flag: '🇺🇸/🇨🇭', price: 0.9010, change: -0.0005, percent: -0.06, volume: '60M', aiSignal: 'HOLD' },
    
    // Minors
    'EURGBP': { symbol: 'EURGBP', name: 'Euro vs British Pound', flag: '🇪🇺/🇬🇧', price: 0.8520, change: -0.0005, percent: -0.06, volume: '55M', aiSignal: 'SELL' },
    'EURJPY': { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', flag: '🇪🇺/🇯🇵', price: 170.50, change: 0.10, percent: 0.06, volume: '80M', aiSignal: 'BUY' },
    
    // Crypto
    'BTCUSD': { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar', flag: '₿/🇺🇸', price: 68500.00, change: 1200.00, percent: 1.78, volume: '1.2B', aiSignal: 'BUY' },
    'ETHUSD': { symbol: 'ETHUSD', name: 'Ethereum vs US Dollar', flag: 'Ξ/🇺🇸', price: 3800.00, change: 150.00, percent: 4.11, volume: '800M', aiSignal: 'BUY' },

    // Stocks
    'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', flag: '', price: 190.50, change: -1.25, percent: -0.65, volume: '50M', aiSignal: 'SELL' },
    'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', flag: '🚗', price: 175.80, change: 2.30, percent: 1.32, volume: '85M', aiSignal: 'HOLD' },

    // Indices & Commodities
    'SPX500': { symbol: 'SPX500', name: 'S&P 500', flag: '📈', price: 5300.00, change: 25.00, percent: 0.47, volume: 'N/A', aiSignal: 'BUY' },
    'XAUUSD': { symbol: 'XAUUSD', name: 'Gold', flag: '🥇', price: 2350.00, change: -15.00, percent: -0.63, volume: 'N/A', aiSignal: 'SELL' },
  };
  
  export const getAssetData = (symbol) => {
    return marketData[symbol.toUpperCase()] || null;
  };