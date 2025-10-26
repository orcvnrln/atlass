import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent, Target, Clock, AlertTriangle } from 'lucide-react';
import { getAssetData } from '@/data/marketData';

const PortfolioPnLTracker = ({ portfolioSimulation, onUpdatePosition, onClosePosition }) => {
  const [totalPnL, setTotalPnL] = useState(0);
  const [totalPnLPercent, setTotalPnLPercent] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [positionsData, setPositionsData] = useState([]);

  useEffect(() => {
    calculatePortfolioMetrics();
  }, [portfolioSimulation]);

  const calculatePortfolioMetrics = () => {
    let totalPnLValue = 0;
    let totalInvestedValue = 0;
    const positions = [];

    Object.entries(portfolioSimulation).forEach(([symbol, position]) => {
      const currentAsset = getAssetData(symbol);
      if (!currentAsset) return;

      const currentPrice = currentAsset.price;
      const entryPrice = position.entryPrice;
      const quantity = position.quantity;
      const leverage = position.leverage || 1;
      const positionType = position.positionType || 'long';

      // Calculate P&L based on position type
      let pnl;
      if (positionType === 'long') {
        pnl = (currentPrice - entryPrice) * quantity * leverage;
      } else {
        pnl = (entryPrice - currentPrice) * quantity * leverage;
      }

      const invested = entryPrice * quantity;
      const pnlPercent = (pnl / invested) * 100;

      // Check stop loss and take profit
      let status = 'open';
      if (position.stopLoss) {
        if ((positionType === 'long' && currentPrice <= position.stopLoss) ||
            (positionType === 'short' && currentPrice >= position.stopLoss)) {
          status = 'stopped';
        }
      }
      if (position.takeProfit) {
        if ((positionType === 'long' && currentPrice >= position.takeProfit) ||
            (positionType === 'short' && currentPrice <= position.takeProfit)) {
          status = 'target_hit';
        }
      }

      positions.push({
        symbol,
        ...position,
        currentPrice,
        pnl,
        pnlPercent,
        invested,
        status,
        duration: calculateDuration(position.entryDate)
      });

      totalPnLValue += pnl;
      totalInvestedValue += invested;
    });

    setTotalPnL(totalPnLValue);
    setTotalPnLPercent(totalInvestedValue > 0 ? (totalPnLValue / totalInvestedValue) * 100 : 0);
    setTotalInvested(totalInvestedValue);
    setPositionsData(positions);
  };

  const calculateDuration = (entryDate) => {
    const now = new Date();
    const entry = new Date(entryDate);
    const diffMs = now - entry;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
    return `${diffHours}h`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'stopped': return 'text-accent-red';
      case 'target_hit': return 'text-accent-green';
      default: return 'text-text-primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'stopped': return <AlertTriangle size={14} className="text-accent-red" />;
      case 'target_hit': return <Target size={14} className="text-accent-green" />;
      default: return <Clock size={14} className="text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-bg rounded-lg p-4 border border-border-on-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-accent-orange" />
            <span className="text-sm text-text-secondary">Total P&L</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${totalPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {formatCurrency(totalPnL)}
            </span>
            {totalPnL >= 0 ? <TrendingUp size={16} className="text-accent-green" /> : <TrendingDown size={16} className="text-accent-red" />}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card-bg rounded-lg p-4 border border-border-on-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} className="text-accent-orange" />
            <span className="text-sm text-text-secondary">Total Return</span>
          </div>
          <span className={`text-xl font-bold ${totalPnLPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {totalPnLPercent.toFixed(2)}%
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg rounded-lg p-4 border border-border-on-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-accent-orange" />
            <span className="text-sm text-text-secondary">Total Invested</span>
          </div>
          <span className="text-xl font-bold text-text-primary">
            {formatCurrency(totalInvested)}
          </span>
        </motion.div>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">Active Positions</h3>
        {positionsData.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            No positions in portfolio simulation
          </div>
        ) : (
          positionsData.map((position, index) => (
            <motion.div
              key={position.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-bg rounded-lg p-4 border border-border-on-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-text-primary">{position.symbol}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    position.positionType === 'long' 
                      ? 'bg-accent-green/10 text-accent-green' 
                      : 'bg-accent-red/10 text-accent-red'
                  }`}>
                    {position.positionType.toUpperCase()}
                  </span>
                  {position.leverage > 1 && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-accent-orange/10 text-accent-orange">
                      {position.leverage}x
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(position.status)}
                  <span className={`text-sm ${getStatusColor(position.status)}`}>
                    {position.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Entry:</span>
                  <div className="font-mono text-text-primary">${position.entryPrice}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Current:</span>
                  <div className="font-mono text-text-primary">${position.currentPrice}</div>
                </div>
                <div>
                  <span className="text-text-secondary">P&L:</span>
                  <div className={`font-bold ${position.pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {formatCurrency(position.pnl)} ({position.pnlPercent.toFixed(2)}%)
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Duration:</span>
                  <div className="text-text-primary">{position.duration}</div>
                </div>
              </div>

              {(position.stopLoss || position.takeProfit) && (
                <div className="mt-3 pt-3 border-t border-border-on-card">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {position.stopLoss && (
                      <div>
                        <span className="text-text-secondary">Stop Loss:</span>
                        <div className="font-mono text-accent-red">${position.stopLoss}</div>
                      </div>
                    )}
                    {position.takeProfit && (
                      <div>
                        <span className="text-text-secondary">Take Profit:</span>
                        <div className="font-mono text-accent-green">${position.takeProfit}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onClosePosition(position.symbol)}
                  className="px-3 py-1 text-xs bg-accent-red/10 text-accent-red rounded hover:bg-accent-red/20 transition-colors"
                >
                  Close Position
                </button>
                <button
                  onClick={() => onUpdatePosition(position.symbol)}
                  className="px-3 py-1 text-xs bg-accent-orange/10 text-accent-orange rounded hover:bg-accent-orange/20 transition-colors"
                >
                  Modify
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioPnLTracker;
