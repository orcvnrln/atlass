import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedFilters = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    volumeMin: '',
    changeMin: '',
    changeMax: '',
    marketCapMin: '',
    marketCapMax: '',
  });

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      priceMin: '',
      priceMax: '',
      volumeMin: '',
      changeMin: '',
      changeMax: '',
      marketCapMin: '',
      marketCapMax: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-card-bg rounded-lg border border-border-color overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-accent" />
          <span className="font-semibold text-text-primary">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="px-3 py-1 rounded-md bg-negative/10 text-negative hover:bg-negative/20 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          )}
        </div>
      </button>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border-color"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Price Range ($)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleInputChange('priceMin', e.target.value)}
                    className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleInputChange('priceMax', e.target.value)}
                    className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Min Volume
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1000000"
                  value={filters.volumeMin}
                  onChange={(e) => handleInputChange('volumeMin', e.target.value)}
                  className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                />
              </div>

              {/* Change % Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Change % Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min %"
                    value={filters.changeMin}
                    onChange={(e) => handleInputChange('changeMin', e.target.value)}
                    className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max %"
                    value={filters.changeMax}
                    onChange={(e) => handleInputChange('changeMax', e.target.value)}
                    className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Market Cap Range (for stocks/crypto) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Market Cap ($B)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.marketCapMin}
                    onChange={(e) => handleInputChange('marketCapMin', e.target.value)}
                    className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.marketCapMax}
                    onChange={(e) => handleInputChange('marketCapMax', e.target.value)}
                    className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-md text-sm text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
