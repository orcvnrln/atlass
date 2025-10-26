import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Volume2, Activity } from 'lucide-react';
import { marketAssets } from '@/data/navData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const MarketCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('volume');
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Generate mock data for all assets in category
  const generateMockAssetData = (assets) => {
    return assets.map(asset => ({
      ...asset,
      currentPrice: Math.random() * 1000 + 100,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 10,
      volume: (Math.random() * 1000000000 + 100000000).toLocaleString(),
      volatility: (Math.random() * 5 + 1).toFixed(1),
      sentiment: Math.floor(Math.random() * 100),
      marketCap: Math.random() * 1000000000000,
      high24h: Math.random() * 1000 + 100,
      low24h: Math.random() * 1000 + 100,
      open24h: Math.random() * 1000 + 100
    }));
  };

  const categoryAssets = marketAssets[category] || [];
  const mockData = useMemo(() => generateMockAssetData(categoryAssets), [categoryAssets]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = mockData.filter(item =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return parseFloat(b.volume.replace(/,/g, '')) - parseFloat(a.volume.replace(/,/g, ''));
        case 'change':
          return Math.abs(b.changePercent) - Math.abs(a.changePercent);
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'name':
          return a.symbol.localeCompare(b.symbol);
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });
  }, [mockData, searchQuery, sortBy]);

  // Generate mini chart data
  const generateMiniChartData = (basePrice) => {
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        time: i,
        price: basePrice + (Math.random() - 0.5) * basePrice * 0.02
      });
    }
    return data;
  };

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleAssetDoubleClick = (asset) => {
    navigate(`/charts/${asset.symbol}`);
  };

  const getCategoryTitle = () => {
    const titles = {
      'Major FX': 'Major Forex Pairs',
      'Minor FX': 'Minor Forex Pairs',
      'Crypto': 'Cryptocurrencies',
      'Stocks': 'Stock Market',
      'Indices': 'Market Indices',
      'Bonds': 'Government Bonds',
      'Energy': 'Energy Commodities'
    };
    return titles[category] || `${category} Markets`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-200 mb-2">{getCategoryTitle()}</h1>
          <p className="text-gray-400">Real-time market data with AI-powered insights</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Asset List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg border border-gray-700">
              {/* Table Header */}
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                  <div className="col-span-4 cursor-pointer" onClick={() => setSortBy('name')}>
                    Symbol {sortBy === 'name' && '↓'}
                  </div>
                  <div className="col-span-2 cursor-pointer" onClick={() => setSortBy('price')}>
                    Price {sortBy === 'price' && '↓'}
                  </div>
                  <div className="col-span-2 cursor-pointer" onClick={() => setSortBy('change')}>
                    Change {sortBy === 'change' && '↓'}
                  </div>
                  <div className="col-span-2 cursor-pointer" onClick={() => setSortBy('volume')}>
                    Volume {sortBy === 'volume' && '↓'}
                  </div>
                  <div className="col-span-2">Chart</div>
                </div>
              </div>

              {/* Asset List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredAndSortedData.map((asset, index) => (
                  <div
                    key={asset.symbol}
                    onClick={() => handleAssetClick(asset)}
                    onDoubleClick={() => handleAssetDoubleClick(asset)}
                    className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors ${
                      selectedAsset?.symbol === asset.symbol ? 'bg-blue-900/30 border-blue-500/50' : ''
                    }`}
                  >
                    {/* Symbol */}
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{asset.flag1}</span>
                        <span className="text-lg">{asset.flag2}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{asset.symbol}</div>
                        <div className="text-xs text-gray-400 truncate">{asset.name}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 flex items-center">
                      <span className="font-mono text-white">
                        {category === 'Crypto' ? asset.currentPrice.toFixed(2) : asset.currentPrice.toFixed(4)}
                      </span>
                    </div>

                    {/* Change */}
                    <div className="col-span-2 flex items-center">
                      <div className={`flex items-center gap-1 ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="font-mono">
                          {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}
                        </span>
                        <span className="font-mono">
                          ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-300">{asset.volume}</span>
                      </div>
                    </div>

                    {/* Mini Chart */}
                    <div className="col-span-2 flex items-center">
                      <div className="w-16 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateMiniChartData(asset.currentPrice)}>
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke={asset.change >= 0 ? '#10b981' : '#ef4444'} 
                              strokeWidth={1}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 text-center">
                Single click to preview • Double click to open detailed chart page
              </p>
            </div>
          </div>

          {/* Right Side - Preview Panel */}
          <div className="lg:col-span-1">
            {selectedAsset ? (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 sticky top-4">
                <h3 className="text-lg font-semibold text-white mb-4">Asset Preview</h3>
                
                {/* Asset Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">{selectedAsset.flag1}</span>
                    <span className="text-2xl">{selectedAsset.flag2}</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xl">{selectedAsset.symbol}</div>
                    <div className="text-sm text-gray-400">{selectedAsset.name}</div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Price</span>
                    <span className="font-mono text-white text-lg">
                      {category === 'Crypto' ? selectedAsset.currentPrice.toFixed(2) : selectedAsset.currentPrice.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <div className={`font-mono ${selectedAsset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)} ({selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="font-mono text-white">{selectedAsset.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility</span>
                    <span className="font-mono text-white">{selectedAsset.volatility}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sentiment</span>
                    <span className="font-mono text-white">{selectedAsset.sentiment}%</span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Price Chart</h4>
                  <div className="h-32 bg-gray-800 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateMiniChartData(selectedAsset.currentPrice)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis hide />
                        <YAxis hide />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={selectedAsset.change >= 0 ? '#10b981' : '#ef4444'} 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h High</span>
                    <span className="font-mono text-green-400">{selectedAsset.high24h.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Low</span>
                    <span className="font-mono text-red-400">{selectedAsset.low24h.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Open</span>
                    <span className="font-mono text-white">{selectedAsset.open24h.toFixed(4)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/charts/${selectedAsset.symbol}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Open Chart Page
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 sticky top-4">
                <div className="text-center text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p>Select an asset from the list to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCategory;