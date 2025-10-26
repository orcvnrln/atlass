import React from 'react';
import { ChevronDown } from 'lucide-react';

const StockFilters = ({ filters, onFilterChange }) => {
  const markets = ['All Markets', 'US', 'EU', 'Asia'];
  const sectors = [
    'All Sectors',
    'Electronic Technology',
    'Technology Services',
    'Retail Trade',
    'Consumer Durables',
    'Finance',
    'Health Technology',
    'Energy Minerals'
  ];
  const ratings = ['All Ratings', 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];
  const sortOptions = [
    'Change % (High to Low)',
    'Change % (Low to High)',
    'Market Cap (High to Low)',
    'Market Cap (Low to High)',
    'Volume (High to Low)',
    'Volume (Low to High)',
    'P/E (Low to High)',
    'P/E (High to Low)'
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        {/* Market Filter */}
        <div className="relative">
          <select
            value={filters.market}
            onChange={(e) => onFilterChange('market', e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-4 py-2 pr-10 rounded-md hover:bg-gray-800 transition appearance-none cursor-pointer text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {markets.map(market => (
              <option key={market} value={market}>{market}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sector Filter */}
        <div className="relative">
          <select
            value={filters.sector}
            onChange={(e) => onFilterChange('sector', e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-4 py-2 pr-10 rounded-md hover:bg-gray-800 transition appearance-none cursor-pointer text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* P/E Range */}
        <div className="relative">
          <select
            value={filters.peRange}
            onChange={(e) => onFilterChange('peRange', e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-4 py-2 pr-10 rounded-md hover:bg-gray-800 transition appearance-none cursor-pointer text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">P/E: All</option>
            <option value="0-20">P/E: 0-20</option>
            <option value="20-40">P/E: 20-40</option>
            <option value="40-60">P/E: 40-60</option>
            <option value="60+">P/E: 60+</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Market Cap Range */}
        <div className="relative">
          <select
            value={filters.marketCapRange}
            onChange={(e) => onFilterChange('marketCapRange', e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-4 py-2 pr-10 rounded-md hover:bg-gray-800 transition appearance-none cursor-pointer text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Market Cap: All</option>
            <option value="mega">Mega Cap (200B+)</option>
            <option value="large">Large Cap (10B-200B)</option>
            <option value="mid">Mid Cap (2B-10B)</option>
            <option value="small">Small Cap (300M-2B)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Analyst Rating */}
        <div className="relative">
          <select
            value={filters.rating}
            onChange={(e) => onFilterChange('rating', e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-4 py-2 pr-10 rounded-md hover:bg-gray-800 transition appearance-none cursor-pointer text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ratings.map(rating => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort By */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-4 py-2 pr-10 rounded-md hover:bg-gray-800 transition appearance-none cursor-pointer text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default StockFilters;
