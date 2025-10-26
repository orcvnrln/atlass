import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from '@/components/ui/Sparkline';

const MarketTable = ({ data, onRowClick, onSort, sortBy, sortOrder }) => {
  const formatPrice = (price) => {
    if (price < 10) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(2);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown className="w-3 h-3" />;
    return sortOrder === 'asc' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  return (
    <div className="bg-[#F5F5F5] rounded-xl card-elevation overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#E0E0E0] text-[#666666] uppercase">
            <tr>
              <th 
                className="p-3 cursor-pointer hover:bg-[#D9D9D9] transition-colors"
                onClick={() => onSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Symbol</span>
                  {getSortIcon('symbol')}
                </div>
              </th>
              <th className="p-3">Name</th>
              <th 
                className="p-3 cursor-pointer hover:bg-[#D9D9D9] transition-colors"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {getSortIcon('price')}
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:bg-[#D9D9D9] transition-colors"
                onClick={() => onSort('change')}
              >
                <div className="flex items-center space-x-1">
                  <span>Change</span>
                  {getSortIcon('change')}
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:bg-[#D9D9D9] transition-colors"
                onClick={() => onSort('percent')}
              >
                <div className="flex items-center space-x-1">
                  <span>%</span>
                  {getSortIcon('percent')}
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:bg-[#D9D9D9] transition-colors"
                onClick={() => onSort('volume')}
              >
                <div className="flex items-center space-x-1">
                  <span>Volume</span>
                  {getSortIcon('volume')}
                </div>
              </th>
              <th className="p-3">AI Confidence</th>
              <th className="p-3">Chart</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={item.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-t border-[#D9D9D9] hover:bg-[#E0E0E0] cursor-pointer transition-colors"
                onClick={() => onRowClick(item.symbol.replace('/', ''))}
              >
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="font-semibold monospace text-[#1F1F1F]">{item.symbol}</span>
                  </div>
                </td>
                <td className="p-3 text-[#666666] max-w-[200px] truncate">{item.name}</td>
                <td className="p-3 font-bold monospace text-[#1F1F1F]">{formatPrice(item.price)}</td>
                <td className={`p-3 font-medium monospace ${item.change >= 0 ? 'positive' : 'negative'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </td>
                <td className={`p-3 font-medium monospace ${item.percent >= 0 ? 'positive' : 'negative'}`}>
                  {item.percent >= 0 ? '+' : ''}{item.percent.toFixed(2)}%
                </td>
                <td className="p-3 text-[#666666] monospace">{formatVolume(item.volume)}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-[#E0E0E0] rounded-full h-2">
                      <div 
                        className="bg-[#4C6EF5] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.ai_confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#666666]">{item.ai_confidence}%</span>
                  </div>
                </td>
                <td className="p-3">
                  <Sparkline data={item.sparklineData} positive={item.change >= 0} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;
