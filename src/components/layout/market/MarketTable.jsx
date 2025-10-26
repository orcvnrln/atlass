import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Sparkline from '@/components/ui/Sparkline';

const MarketTable = ({ data, onRowClick, onSort, sortBy, sortOrder }) => {
  const columns = [
    { key: 'symbol', label: 'Symbol', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'change', label: 'Change', sortable: true },
    { key: 'percent', label: '% Change', sortable: true },
    { key: 'volume', label: 'Volume', sortable: true },
    { key: 'chart', label: 'Chart (24h)', sortable: false },
    { key: 'ai_confidence', label: 'AI Confidence', sortable: true }
  ];

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  return (
    <div className="bg-card-bg rounded-xl overflow-hidden card-elevation">
      <table className="w-full">
        <thead className="sticky top-0 bg-primary-bg border-b border-border-color z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider text-left ${
                  column.sortable ? 'cursor-pointer hover:text-white' : ''
                } ${column.key === 'chart' || column.key === 'ai_confidence' ? 'hidden md:table-cell' : ''}`}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && sortBy === column.key && (
                    <div className="text-accent">
                      {sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
          {data.map((item, index) => (
            <motion.tr
              key={item.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
              className="border-b border-border-color/50 hover:bg-gray-800 cursor-pointer transition-all duration-200"
              onClick={() => onRowClick(item.symbol.replace('/', ''))}
            >
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  {item.flag && <span className="text-xl">{item.flag}</span>}
                  <span className="font-semibold text-white monospace">{item.symbol}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-bold text-white monospace text-lg">{formatPrice(item.price)}</td>
              <td className={`px-4 py-3 font-medium monospace text-base ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
              </td>
              <td className={`px-4 py-3 font-medium monospace text-base ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? '+' : ''}{item.percent.toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-text-secondary monospace text-base hidden md:table-cell">{formatVolume(item.volume)}</td>
              <td className="px-4 py-3 hidden md:table-cell">
                <Sparkline data={item.sparklineData} positive={item.change >= 0} />
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-border-color rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-negative via-yellow-500 to-positive rounded-full transition-all duration-300"
                      style={{ width: `${item.ai_confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary monospace w-8">
                    {item.ai_confidence.toFixed(0)}%
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-8 text-center text-text-secondary">
          <p>No data matches your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default MarketTable;