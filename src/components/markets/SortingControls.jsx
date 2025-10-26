import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react';

const sortOptions = [
  { id: 'symbol', label: 'Symbol', icon: '🔤' },
  { id: 'price', label: 'Price', icon: '💰' },
  { id: 'change', label: 'Change', icon: '📊' },
  { id: 'changePercent', label: 'Change %', icon: '📈' },
  { id: 'volume', label: 'Volume', icon: '📦' },
  { id: 'marketCap', label: 'Market Cap', icon: '💎' },
];

const SortingControls = ({ onSortChange, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState(currentSort?.field || 'symbol');
  const [sortOrder, setSortOrder] = useState(currentSort?.order || 'asc');

  const handleSortChange = (field) => {
    let newOrder = 'asc';
    
    // If clicking the same field, toggle order
    if (field === sortBy) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    setSortBy(field);
    setSortOrder(newOrder);
    onSortChange({ field, order: newOrder });
    setIsOpen(false);
  };

  const toggleOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSortChange({ field: sortBy, order: newOrder });
  };

  const currentOption = sortOptions.find(opt => opt.id === sortBy);

  return (
    <div className="relative">
      {/* Main Button */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-color rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ArrowUpDown className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-text-primary">
            Sort by: {currentOption?.label}
          </span>
        </button>

        {/* Order Toggle */}
        <button
          onClick={toggleOrder}
          className="flex items-center gap-2 px-3 py-2 bg-card-bg border border-border-color rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4 text-positive" />
          ) : (
            <ArrowDown className="w-4 h-4 text-negative" />
          )}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-card-bg border border-border-color rounded-lg shadow-xl z-20 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === option.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {sortBy === option.id && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border-color bg-white/5">
              <p className="text-xs text-text-secondary">
                Click {sortOrder === 'asc' ? '↑' : '↓'} to change order
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SortingControls;
