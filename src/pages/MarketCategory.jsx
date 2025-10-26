import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { marketAssets } from '@/data/navData';

const MarketCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryMap = {
    major: 'Major FX',
    minor: 'Minor FX',
    crypto: 'Crypto',
    stocks: 'Stocks',
    indices: 'Indices',
    bonds: 'Bonds',
    energy: 'Energy',
  };

  const categoryTitle = categoryMap[category] || 'Markets';
  const assets = marketAssets[categoryTitle] || [];

  const generateMockData = (asset) => ({
    ...asset,
    price: asset.symbol.includes('USD') || asset.symbol.includes('EUR')
      ? (1 + Math.random() * 0.5).toFixed(4)
      : (Math.random() * 1000 + 20).toFixed(2),
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5,
    volume: (Math.random() * 1000000000 + 100000000).toLocaleString(),
  });

  const mockData = useMemo(() => assets.map(generateMockData), [assets]);

  const filteredData = useMemo(() => {
    return mockData.filter(
      (item) =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockData, searchQuery]);

  const handleAssetClick = (asset) => {
    navigate('/workspace/institutional', {
      state: { symbol: asset.symbol },
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{categoryTitle}</h1>
          <p className="text-sm text-gray-400 mt-2">
            Click any instrument to open its chart • Multiple charts supported
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbols or names..."
              className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-[#334155] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            />
          </div>
        </div>

        {/* Instruments Table */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0f172a] border-b border-[#334155]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                  Symbol
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                  Change
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((asset) => (
                <tr
                  key={asset.symbol}
                  onClick={() => handleAssetClick(asset)}
                  className="border-b border-[#334155] hover:bg-[#334155]/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{asset.flag1}</span>
                        <span className="text-lg">{asset.flag2}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {asset.displaySymbol || asset.symbol}
                        </p>
                        <p className="text-xs text-gray-400">{asset.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-white font-semibold">
                      {asset.price}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div
                      className={`inline-flex items-center gap-1 font-mono font-semibold ${
                        asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {asset.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>
                        {asset.change >= 0 ? '+' : ''}
                        {asset.change.toFixed(2)}
                      </span>
                      <span className="text-xs">
                        ({asset.changePercent >= 0 ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm text-gray-300">{asset.volume}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No instruments found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCategory;
