import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import StockFilters from '@/components/filters/StockFilters';
import StockTable from '@/components/tables/StockTable';

// Enhanced mock data matching TradingView screener
const mockStockData = [
  { 
    symbol: "NVDA", 
    name: "NVIDIA Corporation", 
    price: 186.26, 
    change: 2.25, 
    changePercent: 1.22,
    volume: "131.3M", 
    marketCap: "4.53T", 
    pe: 53.01, 
    epsGrowth: 23.45,
    divYield: 0.02,
    sector: "Electronic Technology", 
    rating: "Strong Buy" 
  },
  { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    price: 262.82, 
    change: 1.25, 
    changePercent: 0.48,
    volume: "38.25M", 
    marketCap: "3.97T", 
    pe: 33.95, 
    epsGrowth: 12.34,
    divYield: 0.53,
    sector: "Technology Services", 
    rating: "Buy" 
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft Corporation", 
    price: 420.72, 
    change: -0.85, 
    changePercent: -0.20,
    volume: "25.67M", 
    marketCap: "3.12T", 
    pe: 37.89, 
    epsGrowth: 9.87,
    divYield: 0.72,
    sector: "Technology Services", 
    rating: "Buy" 
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet Inc.", 
    price: 180.33, 
    change: 3.42, 
    changePercent: 1.93,
    volume: "22.45M", 
    marketCap: "2.26T", 
    pe: 28.76, 
    epsGrowth: 18.92,
    divYield: 0.00,
    sector: "Technology Services", 
    rating: "Strong Buy" 
  },
  { 
    symbol: "AMZN", 
    name: "Amazon.com Inc.", 
    price: 190.55, 
    change: -1.23, 
    changePercent: -0.64,
    volume: "45.89M", 
    marketCap: "1.95T", 
    pe: 45.67, 
    epsGrowth: 8.76,
    divYield: 0.00,
    sector: "Retail Trade", 
    rating: "Hold" 
  },
  { 
    symbol: "META", 
    name: "Meta Platforms Inc.", 
    price: 520.21, 
    change: 5.67, 
    changePercent: 1.10,
    volume: "18.34M", 
    marketCap: "1.32T", 
    pe: 32.45, 
    epsGrowth: 34.56,
    divYield: 0.00,
    sector: "Technology Services", 
    rating: "Strong Buy" 
  },
  { 
    symbol: "TSLA", 
    name: "Tesla Inc.", 
    price: 250.87, 
    change: -8.92, 
    changePercent: -3.44,
    volume: "89.12M", 
    marketCap: "798.34B", 
    pe: 72.34, 
    epsGrowth: -12.34,
    divYield: 0.00,
    sector: "Consumer Durables", 
    rating: "Sell" 
  },
  { 
    symbol: "BRK.B", 
    name: "Berkshire Hathaway Inc.", 
    price: 450.34, 
    change: 2.11, 
    changePercent: 0.47,
    volume: "4.56M", 
    marketCap: "695.23B", 
    pe: 12.34, 
    epsGrowth: 5.67,
    divYield: 0.00,
    sector: "Finance", 
    rating: "Hold" 
  }
];

const StockScreener = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    market: 'All Markets',
    sector: 'All Sectors',
    peRange: 'all',
    marketCapRange: 'all',
    rating: 'All Ratings',
    sortBy: 'Change % (High to Low)'
  });
  const itemsPerPage = 20;

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    let result = [...mockStockData];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.symbol.toLowerCase().includes(query) || 
        item.name.toLowerCase().includes(query)
      );
    }
    
    // Sector filter
    if (filters.sector !== 'All Sectors') {
      result = result.filter(item => item.sector === filters.sector);
    }
    
    // Rating filter
    if (filters.rating !== 'All Ratings') {
      result = result.filter(item => item.rating === filters.rating);
    }
    
    // P/E Range filter
    if (filters.peRange !== 'all') {
      result = result.filter(item => {
        const pe = item.pe;
        if (filters.peRange === '0-20') return pe >= 0 && pe <= 20;
        if (filters.peRange === '20-40') return pe > 20 && pe <= 40;
        if (filters.peRange === '40-60') return pe > 40 && pe <= 60;
        if (filters.peRange === '60+') return pe > 60;
        return true;
      });
    }
    
    // Sorting
    if (filters.sortBy.includes('Change %')) {
      result.sort((a, b) => {
        return filters.sortBy.includes('High to Low') 
          ? b.change - a.change 
          : a.change - b.change;
      });
    } else if (filters.sortBy.includes('Volume')) {
      result.sort((a, b) => {
        const volA = parseFloat(a.volume.replace('M', ''));
        const volB = parseFloat(b.volume.replace('M', ''));
        return filters.sortBy.includes('High to Low') ? volB - volA : volA - volB;
      });
    } else if (filters.sortBy.includes('P/E')) {
      result.sort((a, b) => {
        return filters.sortBy.includes('Low to High') ? a.pe - b.pe : b.pe - a.pe;
      });
    }
    
    return result;
  }, [searchQuery, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E5E7EB] p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">US Stocks</h1>
          <p className="text-sm text-gray-400 mt-2">
            Search, filter, and analyze the market in real-time
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbols or company names..."
              className="bg-gray-900 border border-gray-700 rounded-md w-full pl-12 pr-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <StockFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Table */}
        <StockTable data={paginatedData} loading={loading} />

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
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

export default StockScreener;
