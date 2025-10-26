import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Play, Pause, RotateCcw, DollarSign, TrendingUp, TrendingDown,
  Activity, Target, Shield, Zap, Clock, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaperTradingEngine } from '@/lib/trading/PaperTradingEngine';

const PaperTradingDashboard = () => {
  const [engine] = useState(() => new PaperTradingEngine({
    initialCapital: 10000,
    commission: 0.001,
    slippage: 0.0005
  }));

  const [isActive, setIsActive] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [equityHistory, setEquityHistory] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(100);

  // Update portfolio state
  const updatePortfolio = () => {
    setPortfolio(engine.getPortfolio());
    setMetrics(engine.getMetrics());
  };

  // Start paper trading
  const handleStart = () => {
    engine.start();
    setIsActive(true);
    updatePortfolio();
  };

  // Stop paper trading
  const handleStop = () => {
    engine.stop();
    setIsActive(false);
  };

  // Reset paper trading
  const handleReset = () => {
    engine.reset();
    setIsActive(false);
    setEquityHistory([]);
    updatePortfolio();
  };

  // Simulate price updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate price movement
      const newPrice = currentPrice + (Math.random() - 0.48) * 2;
      setCurrentPrice(newPrice);

      // Update engine with new prices
      engine.updatePrices({
        'EURUSD': newPrice
      });

      updatePortfolio();

      // Record equity
      const portfolioData = engine.getPortfolio();
      setEquityHistory(prev => [
        ...prev,
        {
          time: Date.now(),
          equity: portfolioData.equity,
          cash: portfolioData.cash
        }
      ].slice(-100)); // Keep last 100 points
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPrice, engine]);

  // Place market order
  const placeOrder = (side, quantity) => {
    try {
      engine.placeMarketOrder('EURUSD', side, quantity, currentPrice);
      updatePortfolio();
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Paper Trading</h2>
            <p className="text-gray-400">Live testing without risk - Virtual portfolio simulation</p>
          </div>
          <div className="flex items-center gap-3">
            {!isActive ? (
              <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start Trading
              </Button>
            ) : (
              <Button onClick={handleStop} className="bg-red-600 hover:bg-red-700">
                <Pause className="w-4 h-4 mr-2" />
                Stop Trading
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" className="border-[#3b82f6]/50 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="bg-[#1e293b] rounded-xl p-4 border border-[#3b82f6]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white font-medium">
              {isActive ? 'Paper Trading Active' : 'Paper Trading Inactive'}
            </span>
          </div>
          <div className="text-white">
            Current Price: <span className="font-bold text-[#3b82f6]">${currentPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics */}
      {portfolio && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={DollarSign}
              label="Total Equity"
              value={`$${portfolio.equity.toFixed(2)}`}
              change={portfolio.totalReturn}
              positive={portfolio.totalPnl > 0}
            />
            <MetricCard
              icon={TrendingUp}
              label="Total P&L"
              value={`$${portfolio.totalPnl.toFixed(2)}`}
              subtitle={`${portfolio.totalReturn.toFixed(2)}%`}
              positive={portfolio.totalPnl > 0}
            />
            <MetricCard
              icon={Activity}
              label="Cash Available"
              value={`$${portfolio.cash.toFixed(2)}`}
              subtitle="Available for trading"
            />
            <MetricCard
              icon={TrendingDown}
              label="Drawdown"
              value={`${portfolio.drawdown.toFixed(2)}%`}
              subtitle="From peak equity"
              positive={false}
            />
          </div>

          {/* Performance Metrics */}
          {metrics && metrics.totalTrades > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <SmallMetricCard
                label="Total Trades"
                value={metrics.totalTrades}
                icon={Target}
              />
              <SmallMetricCard
                label="Win Rate"
                value={`${metrics.winRate.toFixed(1)}%`}
                icon={Activity}
              />
              <SmallMetricCard
                label="Profit Factor"
                value={metrics.profitFactor.toFixed(2)}
                icon={Zap}
              />
              <SmallMetricCard
                label="Avg Win"
                value={`$${metrics.avgWin.toFixed(2)}`}
                icon={TrendingUp}
              />
              <SmallMetricCard
                label="Avg Loss"
                value={`$${metrics.avgLoss.toFixed(2)}`}
                icon={TrendingDown}
              />
            </div>
          )}

          {/* Equity Curve */}
          {equityHistory.length > 0 && (
            <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
              <h3 className="text-lg font-semibold text-white mb-4">Equity Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={equityHistory}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#equityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Quick Trade Panel */}
          <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Trade</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => placeOrder('buy', 1)}
                disabled={!isActive}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                Buy 1 Lot
              </button>
              <button
                onClick={() => placeOrder('sell', 1)}
                disabled={!isActive || portfolio.positions.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                Sell 1 Lot
              </button>
            </div>
          </div>

          {/* Open Positions */}
          {portfolio.positions.length > 0 && (
            <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
              <h3 className="text-lg font-semibold text-white mb-4">Open Positions</h3>
              <div className="space-y-3">
                {portfolio.positions.map((position, index) => (
                  <div key={index} className="bg-[#0f172a] rounded-lg p-4 border border-[#3b82f6]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{position.symbol}</div>
                        <div className="text-sm text-gray-400">
                          Qty: {position.quantity} @ ${position.avgPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${position.unrealizedPnl?.toFixed(2) || '0.00'}
                        </div>
                        <div className={`text-sm ${
                          position.unrealizedPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {position.unrealizedPnlPercent?.toFixed(2) || '0.00'}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!portfolio && (
        <div className="bg-[#1e293b] rounded-xl p-12 border border-[#3b82f6]/30 text-center">
          <Activity className="w-16 h-16 text-[#3b82f6] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Start Paper Trading</h3>
          <p className="text-gray-400 mb-6">
            Test your strategies in real-time without risking real money
          </p>
          <Button onClick={handleStart} className="bg-[#3b82f6] hover:bg-[#2563eb]">
            <Play className="w-4 h-4 mr-2" />
            Start Paper Trading
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper Components
const MetricCard = ({ icon: Icon, label, value, change, subtitle, positive }) => (
  <div className="bg-[#0f172a] rounded-lg p-4 border border-[#3b82f6]/30">
    <div className="flex items-center justify-between mb-2">
      <Icon className={`w-5 h-5 ${positive !== undefined ? (positive ? 'text-green-400' : 'text-red-400') : 'text-[#3b82f6]'}`} />
      {change !== undefined && (
        <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? '+' : ''}{change?.toFixed(2)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400">{subtitle || label}</div>
  </div>
);

const SmallMetricCard = ({ label, value, icon: Icon }) => (
  <div className="bg-[#0f172a] rounded-lg p-3 border border-[#3b82f6]/20">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-[#3b82f6]" />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
  </div>
);

export default PaperTradingDashboard;

