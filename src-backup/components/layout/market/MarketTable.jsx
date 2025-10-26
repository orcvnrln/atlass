import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Sparkline from '@/components/ui/Sparkline';

const MarketTable = ({ data, onRowClick, onSort, sortBy, sortOrder }) => {
  const columns = [
    { key: 'symbol', label: 'Symbol', sortable: true },
    { key: 'name', label: 'Name', sortable: false },
    { key: 'chart', label: 'Chart (24h)', sortable: false },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'change', label: 'Change', sortable: true },
    { key: 'percent', label: '% Change', sortable: true },
    { key: 'volume', label: 'Volume', sortable: true },
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
      {/* Table Header */}
      <div className="sticky top-0 bg-primary-bg border-b border-border-color z-10">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">
          {columns.map((column) => (
            <button
              key={column.key}
              className={`text-left flex items-center space-x-1 hover:text-white transition-colors ${
                column.sortable ? 'cursor-pointer' : 'cursor-default'
              } ${column.key === 'name' || column.key === 'chart' ? 'hidden md:flex' : ''}`}
              onClick={() => column.sortable && onSort(column.key)}
              disabled={!column.sortable}
            >
              <span>{column.label}</span>
              {column.sortable && sortBy === column.key && (
                <div className="text-accent">
                  {sortOrder === 'asc' ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
        {data.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.01 }}
            className="grid grid-cols-4 md:grid-cols-8 gap-4 px-4 py-3 border-b border-border-color/50 hover:bg-accent/10 cursor-pointer transition-all duration-200 border-l-2 border-transparent hover:border-accent"
            onClick={() => onRowClick(item.symbol.replace('/', ''))}
          >
            {/* Symbol */}
            <div className="flex items-center space-x-3">
              {item.flag && (
                <span className="text-xl">{item.flag}</span>
              )}
              <span className="font-semibold text-white monospace">{item.symbol}</span>
            </div>

            {/* Name */}
            <div className="text-text-secondary truncate text-base hidden md:block">{item.name}</div>

            {/* Chart */}
            <div className="hidden md:flex items-center">
              <Sparkline data={item.sparklineData} positive={item.change >= 0} />
            </div>

            {/* Price */}
            <div className="font-bold text-white monospace text-lg text-right md:text-left">
              {formatPrice(item.price)}
            </div>

            {/* Change */}
            <div className={`font-medium monospace text-base ${item.change >= 0 ? 'positive' : 'negative'} hidden md:block`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
            </div>

            {/* Percent Change */}
            <div className={`font-medium monospace text-base ${item.change >= 0 ? 'positive' : 'negative'}`}>
              {item.change >= 0 ? '+' : ''}{item.percent.toFixed(2)}%
            </div>

            {/* Volume */}
            <div className="text-text-secondary monospace text-base hidden md:block">
              {formatVolume(item.volume)}
            </div>

            {/* AI Confidence */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex-1 h-2 bg-border-color rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-negative via-yellow-500 to-positive rounded-full transition-all duration-300"
                  style={{ width: `${item.ai_confidence}%` }}
                />
              </div>
              <span className="text-sm text-text-secondary monospace w-8">
                {item.ai_confidence}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="p-8 text-center text-text-secondary">
          <p>No data matches your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default MarketTable;