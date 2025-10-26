import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockTable = ({ data, loading }) => {
  const getRatingColor = (rating) => {
    const colors = {
      'Strong Buy': 'text-green-400',
      'Buy': 'text-green-300',
      'Hold': 'text-yellow-400',
      'Sell': 'text-orange-400',
      'Strong Sell': 'text-red-400'
    };
    return colors[rating] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="bg-[#111827] rounded-lg border border-[#1F2937] overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800/50"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-900/30 border-t border-gray-800"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] rounded-lg border border-[#1F2937] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-[#0D1117] border-b border-[#1F2937]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Change %
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                P/E
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                EPS Growth %
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Div Yield %
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Analyst Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock, index) => (
              <tr
                key={stock.symbol}
                className={`border-t border-[#1F2937] hover:bg-gray-800/70 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0D1117]'
                }`}
              >
                <td className="px-4 py-4 text-sm font-bold text-white">
                  {stock.symbol}
                </td>
                <td className="px-4 py-4 text-sm text-[#E5E7EB]">
                  {stock.name}
                </td>
                <td className="px-4 py-4 text-sm text-right font-mono text-white">
                  ${stock.price.toFixed(2)}
                </td>
                <td className={`px-4 py-4 text-sm text-right font-mono font-semibold ${
                  stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <div className="flex items-center justify-end gap-1">
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-right font-mono text-[#E5E7EB]">
                  {stock.volume}
                </td>
                <td className="px-4 py-4 text-sm text-right font-mono text-[#E5E7EB]">
                  {stock.marketCap}
                </td>
                <td className="px-4 py-4 text-sm text-right font-mono text-[#E5E7EB]">
                  {stock.pe.toFixed(2)}
                </td>
                <td className={`px-4 py-4 text-sm text-right font-mono font-semibold ${
                  parseFloat(stock.epsGrowth) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stock.epsGrowth}
                </td>
                <td className="px-4 py-4 text-sm text-right font-mono text-[#E5E7EB]">
                  {stock.divYield}
                </td>
                <td className="px-4 py-4 text-sm text-[#E5E7EB]">
                  {stock.sector}
                </td>
                <td className={`px-4 py-4 text-sm font-semibold ${getRatingColor(stock.rating)}`}>
                  {stock.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          <p>No stocks found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default StockTable;
