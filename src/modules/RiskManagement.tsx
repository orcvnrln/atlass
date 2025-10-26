/**
 * ⚠️ RISK MANAGEMENT MODULE
 * Portfolio risk tracking, position sizing, P&L dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTradingStore } from '../core/state/store';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, StatCard } from '../components/ui/Card';
import { formatCurrency, formatPercent, formatPnL } from '../utils/formatters';
import { ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface RiskMetrics {
  totalPortfolioValue: number;
  totalPnL: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  maxDrawdown: number;
  winRate: number;
  sharpeRatio: number;
  riskExposure: number; // % of portfolio at risk
}

interface PositionSizeCalculation {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  recommendedSize: number;
  riskAmount: number;
  potentialLoss: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const RiskManagement: React.FC = () => {
  const navigate = useNavigate();
  // State
  const positions = useTradingStore((state) => state.positions);
  const orders = useTradingStore((state) => state.orders);
  const currentPrice = useTradingStore((state) => state.currentPrice);

  // Risk metrics state
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    totalPortfolioValue: 10000, // Mock initial balance
    totalPnL: 0,
    dailyPnL: 0,
    weeklyPnL: 0,
    monthlyPnL: 0,
    maxDrawdown: 0,
    winRate: 0,
    sharpeRatio: 0,
    riskExposure: 0,
  });

  // Position sizing calculator state
  const [positionCalc, setPositionCalc] = useState<PositionSizeCalculation>({
    accountBalance: 10000,
    riskPercentage: 1,
    entryPrice: 0,
    stopLossPrice: 0,
    recommendedSize: 0,
    riskAmount: 0,
    potentialLoss: 0,
  });

  // Calculate risk metrics
  useEffect(() => {
    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalValue = riskMetrics.totalPortfolioValue + totalPnL;
    
    // Calculate risk exposure (total position value / portfolio value)
    const totalPositionValue = positions.reduce((sum, pos) => {
      return sum + (pos.size * pos.entryPrice);
    }, 0);
    const riskExposure = totalValue > 0 ? (totalPositionValue / totalValue) * 100 : 0;

    // Calculate win rate
    const closedPositions = positions.filter(p => p.status === 'closed');
    const winningPositions = closedPositions.filter(p => p.pnl > 0);
    const winRate = closedPositions.length > 0 
      ? (winningPositions.length / closedPositions.length) * 100 
      : 0;

    setRiskMetrics(prev => ({
      ...prev,
      totalPnL,
      totalPortfolioValue: totalValue,
      riskExposure,
      winRate,
    }));
  }, [positions]);

  // Calculate position size
  useEffect(() => {
    const { accountBalance, riskPercentage, entryPrice, stopLossPrice } = positionCalc;
    
    if (entryPrice > 0 && stopLossPrice > 0 && entryPrice !== stopLossPrice) {
      const riskAmount = accountBalance * (riskPercentage / 100);
      const stopLossDistance = Math.abs(entryPrice - stopLossPrice);
      const recommendedSize = riskAmount / stopLossDistance;
      const potentialLoss = recommendedSize * stopLossDistance;

      setPositionCalc(prev => ({
        ...prev,
        riskAmount,
        recommendedSize,
        potentialLoss,
      }));
    }
  }, [positionCalc.accountBalance, positionCalc.riskPercentage, positionCalc.entryPrice, positionCalc.stopLossPrice]);

  // Handle input changes
  const handleCalcChange = (field: keyof PositionSizeCalculation, value: number) => {
    setPositionCalc(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full bg-base p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-2">Risk Management</h2>
            <p className="text-caption mt-1">
              Portfolio tracking, position sizing, and risk analytics
            </p>
          </div>
          <Button variant="ai" leftIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }>
            AI Risk Analysis
          </Button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Portfolio Value"
            value={formatCurrency(riskMetrics.totalPortfolioValue)}
            change={{
              value: (riskMetrics.totalPnL / 10000) * 100,
              isPositive: riskMetrics.totalPnL > 0,
            }}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            label="Total P&L"
            value={formatPnL(riskMetrics.totalPnL).text}
            icon={
              <svg className={`w-6 h-6 ${riskMetrics.totalPnL > 0 ? 'text-buy' : 'text-sell'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />

          <StatCard
            label="Risk Exposure"
            value={`${riskMetrics.riskExposure.toFixed(1)}%`}
            change={{
              value: riskMetrics.riskExposure - 50,
              isPositive: riskMetrics.riskExposure < 50,
            }}
            icon={
              <svg className="w-6 h-6 text-ai" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />

          <StatCard
            label="Win Rate"
            value={`${riskMetrics.winRate.toFixed(1)}%`}
            icon={
              <svg className="w-6 h-6 text-buy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </div>

        {/* Position Sizing Calculator */}
        <Card variant="elevated" padding="lg">
          <CardHeader 
            title="Position Sizing Calculator" 
            subtitle="Calculate optimal position size based on risk tolerance"
            action={
              <div className="flex items-center gap-2 text-sm text-ai">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Powered
              </div>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-label mb-2 block">Account Balance ($)</label>
                  <input
                    type="number"
                    value={positionCalc.accountBalance}
                    onChange={(e) => handleCalcChange('accountBalance', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-panel border border-default rounded-lg text-primary font-mono focus:border-focus focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-label mb-2 block">Risk Per Trade (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={positionCalc.riskPercentage}
                    onChange={(e) => handleCalcChange('riskPercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-panel border border-default rounded-lg text-primary font-mono focus:border-focus focus:outline-none transition-colors"
                  />
                  {positionCalc.riskPercentage > 2 && (
                    <p className="text-sm text-sell mt-1">⚠️ Risk &gt; 2% is not recommended</p>
                  )}
                </div>

                <div>
                  <label className="text-label mb-2 block">Entry Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={positionCalc.entryPrice || ''}
                    onChange={(e) => handleCalcChange('entryPrice', parseFloat(e.target.value) || 0)}
                    placeholder={currentPrice > 0 ? currentPrice.toFixed(2) : '0.00'}
                    className="w-full px-4 py-2 bg-panel border border-default rounded-lg text-primary font-mono focus:border-focus focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-label mb-2 block">Stop Loss Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={positionCalc.stopLossPrice || ''}
                    onChange={(e) => handleCalcChange('stopLossPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-panel border border-default rounded-lg text-primary font-mono focus:border-focus focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="bg-panel rounded-lg p-6 border border-default space-y-4">
                <h4 className="heading-4 mb-4">Recommended Position</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-default">
                  <span className="text-secondary">Position Size</span>
                  <span className="text-number text-primary text-xl">
                    {positionCalc.recommendedSize.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-default">
                  <span className="text-secondary">Risk Amount</span>
                  <span className="text-number text-sell">
                    {formatCurrency(positionCalc.riskAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-default">
                  <span className="text-secondary">Potential Loss</span>
                  <span className="text-number text-sell">
                    {formatCurrency(positionCalc.potentialLoss)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-secondary">Stop Distance</span>
                  <span className="text-number text-muted">
                    {Math.abs(positionCalc.entryPrice - positionCalc.stopLossPrice).toFixed(2)}
                  </span>
                </div>

                <Button variant="buy" fullWidth className="mt-4">
                  Apply to Order Panel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card variant="default" padding="md">
          <CardHeader 
            title="Open Positions" 
            subtitle={`${positions.filter(p => p.status === 'open').length} active positions`}
          />
          <CardContent>
            {positions.filter(p => p.status === 'open').length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-default">
                      <th className="text-left text-label py-3 px-4">Symbol</th>
                      <th className="text-left text-label py-3 px-4">Side</th>
                      <th className="text-right text-label py-3 px-4">Size</th>
                      <th className="text-right text-label py-3 px-4">Entry</th>
                      <th className="text-right text-label py-3 px-4">Current</th>
                      <th className="text-right text-label py-3 px-4">P&L</th>
                      <th className="text-right text-label py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.filter(p => p.status === 'open').map((position) => {
                      const pnlData = formatPnL(position.pnl);
                      return (
                        <tr key={position.id} className="border-b border-subtle hover-panel transition-colors">
                          <td className="py-3 px-4 text-primary font-medium">{position.symbol}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                              position.side === 'BUY' ? 'bg-buy/20 text-buy' : 'bg-sell/20 text-sell'
                            }`}>
                              {position.side}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-number text-secondary">{position.size.toFixed(4)}</td>
                          <td className="py-3 px-4 text-right text-number text-secondary">${position.entryPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-number text-primary">${currentPrice.toFixed(2)}</td>
                          <td className={`py-3 px-4 text-right text-number font-semibold ${pnlData.className}`}>
                            {pnlData.text}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">Close</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="heading-3 mb-2">No Open Positions</h3>
                <p className="text-secondary">Your open positions will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskManagement;

