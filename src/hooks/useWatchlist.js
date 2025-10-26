import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WATCHLIST_STORAGE_KEY = 'trading_watchlist';

/**
 * Custom hook for managing watchlist
 * Persists to localStorage
 */
const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWatchlist(parsed);
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error('Failed to save watchlist:', error);
        toast.error('Failed to save watchlist');
      }
    }
  }, [watchlist, isLoading]);

  /**
   * Add asset to watchlist
   * @param {Object} asset - Asset object with symbol, name, etc.
   */
  const addToWatchlist = (asset) => {
    const exists = watchlist.some(item => item.symbol === asset.symbol);
    
    if (exists) {
      toast.error(`${asset.symbol} is already in your watchlist`);
      return false;
    }

    const newItem = {
      symbol: asset.symbol,
      name: asset.name,
      displaySymbol: asset.displaySymbol || asset.symbol,
      category: asset.category,
      addedAt: Date.now(),
    };

    setWatchlist(prev => [...prev, newItem]);
    toast.success(`${asset.displaySymbol || asset.symbol} added to watchlist`, {
      icon: '⭐',
      duration: 2000,
    });
    
    return true;
  };

  /**
   * Remove asset from watchlist
   * @param {string} symbol - Asset symbol
   */
  const removeFromWatchlist = (symbol) => {
    const item = watchlist.find(w => w.symbol === symbol);
    
    if (!item) {
      toast.error('Asset not found in watchlist');
      return false;
    }

    setWatchlist(prev => prev.filter(w => w.symbol !== symbol));
    toast.success(`${item.displaySymbol} removed from watchlist`, {
      icon: '🗑️',
      duration: 2000,
    });
    
    return true;
  };

  /**
   * Toggle asset in watchlist (add if not exists, remove if exists)
   * @param {Object} asset - Asset object
   */
  const toggleWatchlist = (asset) => {
    const exists = isInWatchlist(asset.symbol);
    
    if (exists) {
      return removeFromWatchlist(asset.symbol);
    } else {
      return addToWatchlist(asset);
    }
  };

  /**
   * Check if asset is in watchlist
   * @param {string} symbol - Asset symbol
   * @returns {boolean}
   */
  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  /**
   * Clear entire watchlist
   */
  const clearWatchlist = () => {
    if (watchlist.length === 0) {
      toast.error('Watchlist is already empty');
      return;
    }

    if (window.confirm(`Remove all ${watchlist.length} items from watchlist?`)) {
      setWatchlist([]);
      toast.success('Watchlist cleared', {
        icon: '🗑️',
      });
    }
  };

  /**
   * Get watchlist count
   * @returns {number}
   */
  const getWatchlistCount = () => {
    return watchlist.length;
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
    getWatchlistCount,
  };
};

export default useWatchlist;
