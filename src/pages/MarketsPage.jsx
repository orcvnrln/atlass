import React, { useState, useMemo, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, Zap, Star } from 'lucide-react';
import { marketAssets } from '@/data/navData';
import { useNavigate } from 'react-router-dom';
import AssetCard from '@/components/ui/AssetCard';
import { SkeletonTable } from '@/components/ui/SkeletonRow';
import SortingControls from '@/components/markets/SortingControls';
import AdvancedFilters from '@/components/markets/AdvancedFilters';
import useWatchlist from '@/hooks/useWatchlist';
import toast from 'react-hot-toast';

const MarketsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('Major FX');
  const [sortConfig, setSortConfig] = useState({ field: 'symbol', order: 'asc' });
  const [filters, setFilters] = useState({});
  const itemsPerPage = 20;
  
  // Watchlist hook
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const categories = [
    { name: 'Major FX', icon: TrendingUp, color: 'blue' },
    { name: 'Minor FX', icon: Activity, color: 'purple' },
    { name: 'Crypto', icon: Zap, color: 'orange' },
    { name: 'Stocks', icon: TrendingUp, color: 'green' },
    { name: 'Indices', icon: Activity, color: 'indigo' },
    { name: 'Bonds', icon: TrendingDown, color: 'teal' },
    { name: 'Energy', icon: Zap, color: 'red' },
    { name: 'Futures', icon: Activity, color: 'amber' }
  ];

  // Generate stable mock data - cached per symbol to prevent flicker
  const mockDataCache = useMemo(() => {
    const cache = {};
    Object.entries(marketAssets).forEach(([category, assets]) => {
      assets.forEach(asset => {
        const seed = asset.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = (seed * 9301 + 49297) % 233280 / 233280;
        
        cache[asset.symbol] = {
          ...asset,
          price: asset.symbol.includes('USD') || asset.symbol.includes('EUR')
            ? (1 + random * 0.5).toFixed(4)
            : (random * 1000 + 20).toFixed(2),
          change: (random - 0.5) * 10,
          changePercent: (random - 0.5) * 5,
          volume: (random * 1000000000 + 100000000).toLocaleString(),
          marketCap: (random * 5000 + 100).toFixed(2) + 'B',
        };
      });
    });
    return cache;
  }, []);

  const allAssets = useMemo(() => {
    const assets = marketAssets[activeCategory] || [];
    return assets.map(asset => mockDataCache[asset.symbol] || asset);
  }, [activeCategory, mockDataCache]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const filteredData = useMemo(() => {
    let result = [...allAssets];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.symbol.toLowerCase().includes(query) || 
        item.name.toLowerCase().includes(query)
      );
    }
    
    // Advanced filters
    if (filters.priceMin) {
      result = result.filter(item => parseFloat(item.price) >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(item => parseFloat(item.price) <= parseFloat(filters.priceMax));
    }
    if (filters.volumeMin) {
      const volMin = parseFloat(filters.volumeMin);
      result = result.filter(item => {
        const vol = parseFloat(item.volume.replace(/,/g, ''));
        return vol >= volMin;
      });
    }
    if (filters.changeMin) {
      result = result.filter(item => item.changePercent >= parseFloat(filters.changeMin));
    }
    if (filters.changeMax) {
      result = result.filter(item => item.changePercent <= parseFloat(filters.changeMax));
    }
    
    // Sorting
    result.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortConfig.field) {
        case 'symbol':
          aVal = a.symbol;
          bVal = b.symbol;
          break;
        case 'price':
          aVal = parseFloat(a.price);
          bVal = parseFloat(b.price);
          break;
        case 'change':
          aVal = a.change;
          bVal = b.change;
          break;
        case 'changePercent':
          aVal = a.changePercent;
          bVal = b.changePercent;
          break;
        case 'volume':
          aVal = parseFloat(a.volume.replace(/,/g, ''));
          bVal = parseFloat(b.volume.replace(/,/g, ''));
          break;
        default:
          return 0;
      }
      
      if (typeof aVal === 'string') {
        return sortConfig.order === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortConfig.order === 'asc' 
          ? aVal - bVal
          : bVal - aVal;
      }
    });
    
    return result;
  }, [searchQuery, allAssets, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAssetClick = (asset) => {
    try {
      toast.success(`Loading ${asset.displaySymbol || asset.symbol}...`, {
        duration: 2000,
      });
      navigate('/workspace/institutional', {
        state: { symbol: asset.symbol },
      });
    } catch (error) {
      toast.error(`Failed to load ${asset.displaySymbol || asset.symbol}`);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Markets</h1>
          <p className="text-sm text-gray-400 mt-2">
            Search, filter, and analyze global markets in real-time
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0D1117] ${
                  activeCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <label htmlFor="market-search" className="sr-only">
                Search symbols or company names
              </label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="market-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbols or company names..."
                className="bg-gray-900 border border-gray-700 rounded-md w-full pl-12 pr-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            
            <SortingControls 
              onSortChange={setSortConfig}
              currentSort={sortConfig}
            />
          </div>
          
          <AdvancedFilters 
            onFilterChange={setFilters}
            activeFilters={filters}
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Change %
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <SkeletonTable rows={10} columns={5} />
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No results found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((asset, index) => (
                    <tr
                      key={asset.symbol}
                      onClick={() => handleAssetClick(asset)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAssetClick(asset);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className={`cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                        index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'
                      } hover:bg-gray-700`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* Watchlist Star */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(asset);
                            }}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label={isInWatchlist(asset.symbol) ? "Remove from watchlist" : "Add to watchlist"}
                          >
                            <Star 
                              className={`w-4 h-4 transition-colors ${
                                isInWatchlist(asset.symbol) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-500 hover:text-yellow-400'
                              }`}
                            />
                          </button>
                          
                          {asset.flag1 && asset.flag2 && (
                            <div className="flex items-center gap-1">
                              <span className="text-lg">{asset.flag1}</span>
                              <span className="text-lg">{asset.flag2}</span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {asset.displaySymbol || asset.symbol}
                            </div>
                            <div className="text-xs text-gray-400">{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-mono font-semibold text-white">
                          ${asset.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`text-sm font-mono font-semibold ${
                            asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {asset.change >= 0 ? '+' : ''}
                          {asset.change.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                            asset.changePercent >= 0
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {asset.changePercent >= 0 ? '+' : ''}
                          {asset.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-mono text-gray-300">{asset.volume}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No results found
            </div>
          ) : (
            paginatedData.map((asset) => (
              <AssetCard 
                key={asset.symbol} 
                asset={asset} 
                onClick={handleAssetClick} 
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {filteredData.length > 0 ? (
                <>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results</>
              ) : (
                <>No results to display</>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm transition ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-900 border border-gray-700 text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketsPage;
