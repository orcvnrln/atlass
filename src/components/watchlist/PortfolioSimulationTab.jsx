import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar } from 'lucide-react';

const PortfolioSimulationTab = ({ portfolioSimulation, calculatePnL, getAssetData }) => {
  const positions = Object.entries(portfolioSimulation);
  
  const totalPnL = positions.reduce((sum, [symbol, position]) => {
    const { pnl } = calculatePnL(symbol, position);
    return sum + pnl;
  }, 0);

  const totalNotional = positions.reduce((sum, [symbol, position]) => {
    return sum + (position.quantity * position.entryPrice);
  }, 0);

  const totalPnLPercent = totalNotional > 0 ? (totalPnL / totalNotional) * 100 : 0;

  if (positions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No Simulated Positions</h3>
        <p className="text-text-secondary">Add instruments to your watchlist and simulate portfolio positions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-bg p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-accent-orange" />
            <span className="text-sm text-text-secondary">Total P&L</span>
          </div>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card-bg p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Percent size={20} className="text-accent-orange" />
            <span className="text-sm text-text-secondary">Total Return</span>
          </div>
          <p className={`text-2xl font-bold ${totalPnLPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-accent-orange" />
            <span className="text-sm text-text-secondary">Positions</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{positions.length}</p>
        </motion.div>
      </div>

      {/* Positions Table */}
      <div className="bg-card-bg rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border-on-card">
          <h3 className="text-lg font-semibold text-text-primary">Simulated Positions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-bg">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Symbol</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Quantity</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Entry Price</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Current Price</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">P&L</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(([symbol, position], index) => {
                const currentAsset = getAssetData(symbol);
                const { pnl, pnlPercent } = calculatePnL(symbol, position);
                
                return (
                  <motion.tr
                    key={symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-border-on-card hover:bg-accent/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currentAsset?.flag || '📊'}</span>
                        <div>
                          <p className="font-mono text-text-primary">{symbol}</p>
                          <p className="text-xs text-text-secondary">{currentAsset?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-text-primary">
                      {position.quantity.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-mono text-text-primary">
                      ${position.entryPrice.toFixed(4)}
                    </td>
                    <td className="p-4 text-right font-mono text-text-primary">
                      ${currentAsset?.price?.toFixed(4) || position.entryPrice.toFixed(4)}
                    </td>
                    <td className={`p-4 text-right font-mono ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </td>
                    <td className={`p-4 text-right font-mono ${pnlPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {pnlPercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSimulationTab;
