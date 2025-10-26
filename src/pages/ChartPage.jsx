import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell, AreaChart, Area } from 'recharts';

const ChartPage = () => {
  const { symbol } = useParams();
  const [selectedTab, setSelectedTab] = useState('ai-signal');
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState(10);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock asset data - in real app this would come from API
  const assetData = {
    'EURUSD': {
      name: 'Euro vs US Dollar',
      flag1: '🇪🇺',
      flag2: '🇺🇸',
      currentPrice: 1.0855,
      change: 0.0014,
      changePercent: 0.13,
      volume: '2.4B',
      volatility: '0.8%',
      sentiment: 78,
      fundingRate: '0.01%',
      premiumIndex: '+0.02%',
      openInterest: '856M',
      category: 'Major FX'
    },
    'GBPUSD': {
      name: 'British Pound vs US Dollar',
      flag1: '🇬🇧',
      flag2: '🇺🇸',
      currentPrice: 1.2642,
      change: -0.0023,
      changePercent: -0.18,
      volume: '1.8B',
      volatility: '1.2%',
      sentiment: 65,
      fundingRate: '0.02%',
      premiumIndex: '-0.01%',
      openInterest: '642M',
      category: 'Major FX'
    },
    'BTCUSD': {
      name: 'Bitcoin vs US Dollar',
      flag1: '₿',
      flag2: '🇺🇸',
      currentPrice: 43250.50,
      change: 1250.30,
      changePercent: 2.98,
      volume: '15.2B',
      volatility: '3.5%',
      sentiment: 82,
      fundingRate: '0.05%',
      premiumIndex: '+0.15%',
      openInterest: '2.1B',
      category: 'Crypto'
    },
    'AAPL': {
      name: 'Apple Inc.',
      flag1: '🍎',
      flag2: '🇺🇸',
      currentPrice: 189.43,
      change: -1.25,
      changePercent: -0.66,
      volume: '45.2M',
      volatility: '2.1%',
      sentiment: 71,
      fundingRate: 'N/A',
      premiumIndex: 'N/A',
      openInterest: '12.8M',
      category: 'Stocks'
    },
    'SPX500': {
      name: 'S&P 500',
      flag1: '📈',
      flag2: '🇺🇸',
      currentPrice: 4567.89,
      change: 23.45,
      changePercent: 0.52,
      volume: '2.8B',
      volatility: '1.8%',
      sentiment: 74,
      fundingRate: 'N/A',
      premiumIndex: 'N/A',
      openInterest: 'N/A',
      category: 'Indices'
    }
  };

  // Generate mock price data
  const generatePriceData = (basePrice, volatility) => {
    const data = [];
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
    
    let currentPrice = basePrice;
    times.forEach(time => {
      const change = (Math.random() - 0.5) * volatility * basePrice;
      currentPrice += change;
      data.push({
        time,
        price: Number(currentPrice.toFixed(4)),
        volume: Math.floor(Math.random() * 2000000) + 500000
      });
    });
    return data;
  };

  const [priceData, setPriceData] = useState([]);

  // Update asset data when symbol changes
  useEffect(() => {
    if (symbol) {
      setIsLoading(true);
      const asset = assetData[symbol];
      if (asset) {
        setCurrentAsset(asset);
        setPriceData(generatePriceData(asset.currentPrice, asset.volatility / 100));
      }
      setTimeout(() => setIsLoading(false), 500);
    } else {
      // Default to EURUSD
      const defaultAsset = assetData['EURUSD'];
      setCurrentAsset(defaultAsset);
      setPriceData(generatePriceData(defaultAsset.currentPrice, defaultAsset.volatility / 100));
    }
  }, [symbol]);

  // Listen for asset selection from navbar
  useEffect(() => {
    const handleAssetSelected = (event) => {
      const asset = event.detail;
      setIsLoading(true);
      // Create asset data from selected asset
      const newAsset = {
        name: asset.name,
        flag1: asset.flag1,
        flag2: asset.flag2,
        currentPrice: 1.0855 + (Math.random() - 0.5) * 0.01, // Mock price variation
        change: (Math.random() - 0.5) * 0.01,
        changePercent: (Math.random() - 0.5) * 2,
        volume: (Math.random() * 2 + 1).toFixed(1) + 'B',
        volatility: (Math.random() * 2 + 0.5).toFixed(1) + '%',
        sentiment: Math.floor(Math.random() * 40 + 60),
        fundingRate: '0.01%',
        premiumIndex: '+0.02%',
        openInterest: (Math.random() * 1000 + 500).toFixed(0) + 'M',
        category: 'Major FX'
      };
      setCurrentAsset(newAsset);
      setPriceData(generatePriceData(newAsset.currentPrice, newAsset.volatility / 100));
      setTimeout(() => setIsLoading(false), 300);
    };

    window.addEventListener('assetSelected', handleAssetSelected);
    return () => {
      window.removeEventListener('assetSelected', handleAssetSelected);
    };
  }, []);

  const liquidityData = [
    { price: currentAsset?.currentPrice * 1.002, volume: 1250000, type: 'buy' },
    { price: currentAsset?.currentPrice * 1.001, volume: 980000, type: 'buy' },
    { price: currentAsset?.currentPrice * 1.0005, volume: 1450000, type: 'sell' },
    { price: currentAsset?.currentPrice * 0.9995, volume: 1100000, type: 'buy' },
    { price: currentAsset?.currentPrice * 0.999, volume: 1320000, type: 'sell' },
    { price: currentAsset?.currentPrice * 0.998, volume: 890000, type: 'buy' },
    { price: currentAsset?.currentPrice * 0.997, volume: 1560000, type: 'sell' },
    { price: currentAsset?.currentPrice * 0.996, volume: 1230000, type: 'buy' },
    { price: currentAsset?.currentPrice * 0.995, volume: 1780000, type: 'sell' },
    { price: currentAsset?.currentPrice * 0.994, volume: 1450000, type: 'buy' }
  ];

  const orderBookData = [
    { price: currentAsset?.currentPrice * 1.001, buyVolume: 198000, sellVolume: 0 },
    { price: currentAsset?.currentPrice * 1.0005, buyVolume: 156000, sellVolume: 0 },
    { price: currentAsset?.currentPrice * 1.0002, buyVolume: 234000, sellVolume: 0 },
    { price: currentAsset?.currentPrice * 1.0001, buyVolume: 178000, sellVolume: 0 },
    { price: currentAsset?.currentPrice * 0.9999, buyVolume: 0, sellVolume: 189000 },
    { price: currentAsset?.currentPrice * 0.9998, buyVolume: 0, sellVolume: 145000 },
    { price: currentAsset?.currentPrice * 0.9995, buyVolume: 0, sellVolume: 167000 },
    { price: currentAsset?.currentPrice * 0.999, buyVolume: 0, sellVolume: 198000 }
  ];

  const tabs = [
    { id: 'ai-signal', label: 'AI Signal' },
    { id: 'news', label: 'News' },
    { id: 'liquidity', label: 'Liquidity' },
    { id: 'volume', label: 'Volume & OI' },
    { id: 'technical', label: 'Technical' },
    { id: 'fundamental', label: 'Fundamental' },
    { id: 'options', label: 'Options' },
    { id: 'sentiment', label: 'Sentiment' }
  ];

  const renderTabContent = () => {
    if (!currentAsset) return <div className="text-gray-400">Loading...</div>;

    switch (selectedTab) {
      case 'ai-signal':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-200">AI Signal Analysis</h3>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">HIGH CONVICTION</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">BUY</div>
                  <div className="text-sm text-gray-400">Confidence: 85%</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <span className="text-yellow-400 font-medium">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target:</span>
                    <span className="text-green-400 font-medium">
                      {currentAsset.category === 'Crypto' ? 
                        (currentAsset.currentPrice * 1.08).toFixed(2) :
                        (currentAsset.currentPrice * 1.008).toFixed(4)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-red-400 font-medium">
                      {currentAsset.category === 'Crypto' ? 
                        (currentAsset.currentPrice * 0.95).toFixed(2) :
                        (currentAsset.currentPrice * 0.992).toFixed(4)
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-3">Quick Trade</h4>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  BUY
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  SELL
                </button>
              </div>
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-2">Latest News</h4>
              <p className="text-gray-400 text-sm">{currentAsset.name} breaks above resistance level as market sentiment improves...</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-2">Market Sentiment</h4>
              <p className="text-gray-400 text-sm">Bullish sentiment increasing with {currentAsset.sentiment}% of traders expecting further upside...</p>
            </div>
          </div>
        );
      case 'technical':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-2">RSI</h4>
              <div className="text-2xl font-bold text-green-400">68.5</div>
              <div className="text-sm text-gray-400">Neutral</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-2">MACD</h4>
              <div className="text-2xl font-bold text-green-400">+0.0008</div>
              <div className="text-sm text-gray-400">Bullish</div>
            </div>
          </div>
        );
      case 'fundamental':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-2">Category</h4>
              <div className="text-2xl font-bold text-blue-400">{currentAsset.category}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h4 className="text-md font-semibold text-gray-200 mb-2">Volatility</h4>
              <div className="text-2xl font-bold text-yellow-400">{currentAsset.volatility}</div>
            </div>
          </div>
        );
      default:
        return <div className="text-gray-400">Content for {selectedTab} tab</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  if (!currentAsset) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Asset not found</p>
          <p className="text-gray-400">Please select a valid asset from the navigation menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{currentAsset.flag1}</span>
              <span className="text-2xl">{currentAsset.flag2}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-200">{currentAsset.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-mono text-gray-200">{currentAsset?.name || symbol || 'EURUSD'}</span>
            <div className="text-3xl font-bold text-gray-200">
              {currentAsset?.category === 'Crypto' ? 
                currentAsset.currentPrice.toLocaleString() :
                currentAsset.currentPrice.toFixed(4)
              }
            </div>
            <div className={`font-medium ${currentAsset?.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {currentAsset?.change >= 0 ? '+' : ''}{currentAsset?.change} ({currentAsset?.changePercent >= 0 ? '+' : ''}{currentAsset?.changePercent}%)
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">24h Volume</div>
            <div className="text-xl font-bold text-gray-200">{currentAsset.volume}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Volatility</div>
            <div className="text-xl font-bold text-gray-200">{currentAsset.volatility}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Sentiment</div>
            <div className="text-xl font-bold text-gray-200">{currentAsset.sentiment}%</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Open Interest</div>
            <div className="text-xl font-bold text-gray-200">{currentAsset.openInterest}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Price Chart */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Price Chart</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        borderColor: '#374151',
                        color: '#F9FAFB',
                      }}
                      formatter={(value) => [
                        currentAsset.category === 'Crypto' ? 
                          value.toLocaleString() :
                          value.toFixed(4), 
                        'Price'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Liquidity History Heatmap */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Liquidity History Heatmap</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={liquidityData} layout="horizontal">
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="price" 
                        type="category" 
                        stroke="#9CA3AF" 
                        fontSize={10}
                        tickFormatter={(value) => 
                          currentAsset.category === 'Crypto' ? 
                            value.toFixed(0) :
                            value.toFixed(4)
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          borderColor: '#374151',
                          color: '#F9FAFB',
                        }}
                        formatter={(value) => [value.toLocaleString(), 'Volume']}
                      />
                      <Bar dataKey="volume">
                        {liquidityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'buy' ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order Book Liquidity Delta */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Order Book Liquidity Delta</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderBookData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="price" 
                        stroke="#9CA3AF" 
                        fontSize={10}
                        tickFormatter={(value) => 
                          currentAsset.category === 'Crypto' ? 
                            value.toFixed(0) :
                            value.toFixed(4)
                        }
                      />
                      <YAxis stroke="#9CA3AF" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          borderColor: '#374151',
                          color: '#F9FAFB',
                        }}
                      />
                      <Bar dataKey="buyVolume" fill="#10b981" />
                      <Bar dataKey="sellVolume" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className="bg-gray-900 rounded-lg border border-gray-700">
              <div className="border-b border-gray-700">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        selectedTab === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Trade Panel */}
          <div className="space-y-6">
            {/* Trade Execution */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Trade {symbol || 'EURUSD'}</h3>
              
              {/* Buy/Sell Buttons */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Order Type */}
              <div className="flex space-x-2 mb-4">
                <button className="bg-gray-700 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium">
                  Market
                </button>
                <button className="bg-gray-800 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium">
                  Limit
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount ({symbol || 'EURUSD'})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Risk</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder="1%"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Stop Loss Price</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder={currentAsset.category === 'Crypto' ? '0' : '0.0000'}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Take Profit Price</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder={currentAsset.category === 'Crypto' ? '0' : '0.0000'}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Leverage: {leverage}x</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Place {tradeType.toUpperCase()} Order
                </button>
              </div>
            </div>

            {/* Order Book */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Order Book</h3>
              <div className="space-y-1 text-xs">
                <div className="grid grid-cols-2 gap-4 text-gray-400 font-medium mb-2">
                  <div>Price Size (USD) (Lots)</div>
                  <div>Price Size (USD) (Lots)</div>
                </div>
                {orderBookData.slice().reverse().map((order, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div className="text-green-400 font-mono">
                      {order.buyVolume > 0 ? (
                        <>
                          <span className="float-left">
                            {currentAsset.category === 'Crypto' ? 
                              order.price.toFixed(0) :
                              order.price.toFixed(4)
                            }
                          </span>
                          <span className="float-right">198K</span>
                        </>
                      ) : (
                        <div className="text-gray-600">-</div>
                      )}
                    </div>
                    <div className="text-red-400 font-mono">
                      {order.sellVolume > 0 ? (
                        <>
                          <span className="float-left">
                            {currentAsset.category === 'Crypto' ? 
                              order.price.toFixed(0) :
                              order.price.toFixed(4)
                            }
                          </span>
                          <span className="float-right">189K</span>
                        </>
                      ) : (
                        <div className="text-gray-600">-</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;