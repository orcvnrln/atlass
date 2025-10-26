import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, X, Edit, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const mockPositions = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    entryPrice: 175.20,
    currentPrice: 182.50,
    type: 'Stock',
    openDate: '2024-10-15',
  },
  {
    id: 2,
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    quantity: 0.5,
    entryPrice: 41200,
    currentPrice: 42150,
    type: 'Crypto',
    openDate: '2024-10-20',
  },
  {
    id: 3,
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    quantity: 10000,
    entryPrice: 1.0850,
    currentPrice: 1.0920,
    type: 'Forex',
    openDate: '2024-10-22',
  },
  {
    id: 4,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 25,
    entryPrice: 138.40,
    currentPrice: 142.80,
    type: 'Stock',
    openDate: '2024-10-18',
  },
  {
    id: 5,
    symbol: 'ETH/USD',
    name: 'Ethereum',
    quantity: 5,
    entryPrice: 2250,
    currentPrice: 2180,
    type: 'Crypto',
    openDate: '2024-10-21',
  },
];

const PositionsTable = () => {
  const [positions, setPositions] = useState(mockPositions);
  const [sortBy, setSortBy] = useState('pnl'); // pnl, symbol, type

  const calculatePnL = (position) => {
    const pnl = (position.currentPrice - position.entryPrice) * position.quantity;
    const pnlPercent = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100;
    return { pnl, pnlPercent };
  };

  const handleClose = (id) => {
    const position = positions.find(p => p.id === id);
    const { pnl } = calculatePnL(position);
    
    if (window.confirm(`Close position ${position.symbol}?\nP&L: $${pnl.toFixed(2)}`)) {
      setPositions(prev => prev.filter(p => p.id !== id));
      toast.success(`${position.symbol} position closed. P&L: $${pnl.toFixed(2)}`, {
        icon: pnl >= 0 ? '💰' : '📉',
      });
    }
  };

  const handleEdit = (id) => {
    toast('Edit functionality coming soon', { icon: '✏️' });
  };

  // Sort positions
  const sortedPositions = [...positions].sort((a, b) => {
    if (sortBy === 'pnl') {
      return calculatePnL(b).pnl - calculatePnL(a).pnl;
    } else if (sortBy === 'symbol') {
      return a.symbol.localeCompare(b.symbol);
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  // Calculate totals
  const totalPnL = positions.reduce((sum, pos) => sum + calculatePnL(pos).pnl, 0);
  const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card-bg rounded-xl border border-border-color overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-color">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-1">Open Positions</h3>
            <p className="text-xs text-text-secondary">
              {positions.length} active position{positions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <button 
            onClick={() => toast('Add position functionality coming soon', { icon: '➕' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Position
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Sort by:</span>
          {['pnl', 'symbol', 'type'].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === option
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              {option === 'pnl' ? 'P&L' : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-border-color">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Entry Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {sortedPositions.map((position, index) => {
              const { pnl, pnlPercent } = calculatePnL(position);
              const isPositive = pnl >= 0;

              return (
                <motion.tr
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-text-primary">{position.symbol}</div>
                      <div className="text-xs text-text-secondary">{position.name}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-white/10">{position.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-mono text-text-primary">
                      {position.quantity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-mono text-text-secondary">
                      ${position.entryPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-mono font-semibold text-text-primary">
                      ${position.currentPrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-sm font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                        {isPositive ? '+' : ''}${pnl.toFixed(2)}
                      </span>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(position.id)}
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        title="Edit position"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleClose(position.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Close position"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="p-6 border-t border-border-color bg-white/5">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-text-secondary mb-1">Total Position Value</p>
            <p className="text-xl font-bold text-text-primary">
              ${totalValue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Total Unrealized P&L</p>
            <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-positive' : 'text-negative'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PositionsTable;
