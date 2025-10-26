'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  epsGrowth: number;
  divYield: number;
  sector: string;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
}

interface MarketDataTableProps {
  data: MarketData[];
  activeTab: string;
}

const MarketDataTable = ({ data, activeTab }: MarketDataTableProps) => {
  const [sortField, setSortField] = useState<keyof MarketData>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleSort = (field: keyof MarketData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const formatNumber = (num: number, type: 'currency' | 'percent' | 'volume' | 'marketcap' | 'ratio') => {
    switch (type) {
      case 'currency':
        return `$${num.toFixed(2)}`;
      case 'percent':
        return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
      case 'volume':
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
        return num.toString();
      case 'marketcap':
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        return `$${num.toFixed(0)}`;
      case 'ratio':
        return num.toFixed(2);
      default:
        return num.toString();
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-trading-positive';
    if (change < 0) return 'text-trading-negative';
    return 'text-trading-neutral';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return 'bg-trading-positive text-background-primary';
      case 'Buy':
        return 'bg-green-600 text-white';
      case 'Hold':
        return 'bg-trading-neutral text-white';
      case 'Sell':
        return 'bg-orange-600 text-white';
      case 'Strong Sell':
        return 'bg-trading-negative text-white';
      default:
        return 'bg-trading-neutral text-white';
    }
  };

  const SortIcon = ({ field }: { field: keyof MarketData }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  return (
    <div className="bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {sortedData.map((item, index) => (
                <tr
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(selectedSymbol === item.symbol ? null : item.symbol)}
                  className={`border-b border-border-primary table-row-hover cursor-pointer transition-all ${
                    selectedSymbol === item.symbol ? 'bg-accent-primary bg-opacity-10' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-background-primary">
                          {item.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-text-primary">{item.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-text-secondary">{item.name}</td>
                  <td className="py-4 px-4 text-right font-mono text-text-primary">
                    {formatNumber(item.price, 'currency')}
                  </td>
                  <td className={`py-4 px-4 text-right font-mono ${getChangeColor(item.changePercent)}`}>
                    {formatNumber(item.changePercent, 'percent')}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-text-secondary">
                    {formatNumber(item.volume, 'volume')}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-text-secondary">
                    {formatNumber(item.marketCap, 'marketcap')}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-text-secondary">
                    {formatNumber(item.pe, 'ratio')}
                  </td>
                  <td className={`py-4 px-4 text-right font-mono ${getChangeColor(item.epsGrowth)}`}>
                    {formatNumber(item.epsGrowth, 'percent')}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-text-secondary">
                    {formatNumber(item.divYield, 'percent')}
                  </td>
                  <td className="py-4 px-4 text-text-secondary">{item.sector}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(item.rating)}`}>
                      {item.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketDataTable;
