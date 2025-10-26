/**
 * 🛡️ RISK CONTROL MODULE
 * Position sizing, risk management, and portfolio metrics
 * Supports both modular and full-page layouts
 */

import React, { useState, useEffect } from 'react';
import { useTradingStore } from '../core/state/store';
import { useTradeStore } from '../core/tradeStore';
import { Shield, Calculator, TrendingDown, AlertTriangle, ExternalLink, Star } from 'lucide-react';

interface RiskControlProps {
  isFullPage?: boolean;
  onOpenFullPage?: () => void;
  onSetupSelect?: (setup: any) => void;
}

const RiskControl: React.FC<RiskControlProps> = ({
  isFullPage = false,
  onOpenFullPage,
  onSetupSelect
}) => {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');

  // State
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const symbol = useTradingStore((state) => state.symbol);
  const riskMetrics = useTradeStore((state) => state.riskMetrics);
  const updateRiskMetrics = useTradeStore((state) => state.updateRiskMetrics);

  // Auto-fill entry price
  useEffect(() => {
    if (currentPrice > 0 && !entryPrice) {
      setEntryPrice(currentPrice.toFixed(2));
    }
  }, [currentPrice]);

  // Calculate risk metrics
  useEffect(() => {
    const entry = parseFloat(entryPrice) || 0;
    const stopLoss = parseFloat(stopLossPrice) || 0;

    if (entry === 0 || stopLoss === 0) return;

    const stopLossDistance = Math.abs(entry - stopLoss);
    const riskAmount = accountBalance * (riskMetrics.riskPercent / 100);
    const positionSize = riskAmount / stopLossDistance;
    const marginRequired = (positionSize * entry) / riskMetrics.leverage;

    // Calculate potential profit (assuming 2:1 R/R)
    const potentialProfit = riskAmount * 2;
    const potentialLoss = riskAmount;

    updateRiskMetrics({
      positionSize,
      stopLossDistance,
      potentialProfit,
      potentialLoss,
      marginRequired,
    });

    // Send calculated setup to execution panel
    if (onSetupSelect && entry && stopLoss) {
      const calculatedSetup = {
        symbol,
        pattern: 'Risk Calculated',
        entry,
        stopLoss,
        takeProfit: entry + (stopLossDistance * 2), // 2:1 R/R
        direction: entry > stopLoss ? 'BUY' : 'SELL',
        confidence: 85,
        rrRatio: 2.0,
        quantity: positionSize
      };
      onSetupSelect(calculatedSetup);
    }
  }, [entryPrice, stopLossPrice, accountBalance, riskMetrics.riskPercent, riskMetrics.leverage, symbol, onSetupSelect]);

  const containerClass = isFullPage
    ? "h-full bg-background p-6 overflow-y-auto"
    : "h-full bg-background p-4 overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`font-bold text-foreground ${isFullPage ? 'text-2xl' : 'text-xl'}`}>
              Risk Control Center
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isFullPage
                ? `Professional position sizing & risk management for ${symbol}`
                : `Position sizing and risk management for ${symbol}`
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isFullPage && onOpenFullPage && (
              <button
                onClick={onOpenFullPage}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium rounded-lg transition-all hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                Open Full Page
              </button>
            )}
            {isFullPage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                Live Risk Calculation
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-secondary border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Account Settings
          </h3>
          <div className={`grid gap-4 ${isFullPage ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Account Balance</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Risk per Trade (%)</label>
              <input
                type="number"
                value={riskMetrics.riskPercent}
                onChange={(e) =>
                  updateRiskMetrics({ riskPercent: parseFloat(e.target.value) || 1 })
                }
                step="0.1"
                min="0.1"
                max="10"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Leverage</label>
              <select
                value={riskMetrics.leverage}
                onChange={(e) =>
                  updateRiskMetrics({ leverage: parseFloat(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="1">1:1</option>
                <option value="5">1:5</option>
                <option value="10">1:10</option>
                <option value="20">1:20</option>
                <option value="50">1:50</option>
                <option value="100">1:100</option>
              </select>
            </div>
            {isFullPage && (
              <div>
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Max Daily Risk (%)</label>
                <input
                  type="number"
                  defaultValue="6"
                  step="0.5"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Trade Parameters */}
        <div className="bg-secondary border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Trade Parameters
          </h3>
          <div className={`grid gap-4 ${isFullPage ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Entry Price</label>
              <input
                type="number"
                step="0.00001"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="1.08500"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Stop Loss Price</label>
              <input
                type="number"
                step="0.00001"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(e.target.value)}
                placeholder="1.08000"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Current Price</label>
              <div className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-accent font-mono">
                {currentPrice > 0 ? currentPrice.toFixed(5) : '-'}
              </div>
            </div>
            {isFullPage && (
              <div>
                <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">Take Profit (Auto)</label>
                <div className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-accent font-mono">
                  {entryPrice && stopLossPrice ?
                    (parseFloat(entryPrice) + Math.abs(parseFloat(entryPrice) - parseFloat(stopLossPrice)) * 2).toFixed(5)
                    : '-'
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculated Metrics */}
        <div className="bg-secondary border border-accent/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculated Metrics
          </h3>
          <div className={`grid gap-4 ${isFullPage ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div className="p-4 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Position Size</span>
              <p className="text-2xl font-bold text-foreground mt-2 font-mono">
                {riskMetrics.positionSize.toFixed(4)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{symbol.replace('USDT', '')}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Stop Loss Distance
              </span>
              <p className="text-2xl font-bold text-destructive mt-2 font-mono">
                {riskMetrics.stopLossDistance.toFixed(5)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pips</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Margin Required
              </span>
              <p className="text-2xl font-bold text-blue-400 mt-2 font-mono">
                {riskMetrics.marginRequired.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">USD</p>
            </div>
            {isFullPage && (
              <div className="p-4 bg-muted rounded-lg">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  R:R Ratio
                </span>
                <p className="text-2xl font-bold text-accent mt-2 font-mono">
                  1:2.0
                </p>
                <p className="text-xs text-muted-foreground mt-1">Target</p>
              </div>
            )}
          </div>
        </div>

        {/* Profit/Loss Projection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary border border-accent/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Potential Profit</h3>
              <span className="text-xs text-muted-foreground">(2:1 R/R)</span>
            </div>
            <p className="text-3xl font-bold text-accent font-mono">
              +${riskMetrics.potentialProfit.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {((riskMetrics.potentialProfit / accountBalance) * 100).toFixed(2)}% of account
            </p>
          </div>

          <div className="bg-secondary border border-destructive/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Potential Loss</h3>
              <span className="text-xs text-muted-foreground">(Max Risk)</span>
            </div>
            <p className="text-3xl font-bold text-destructive font-mono">
              -${riskMetrics.potentialLoss.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {((riskMetrics.potentialLoss / accountBalance) * 100).toFixed(2)}% of account
            </p>
          </div>
        </div>

        {/* Risk Warning */}
        {riskMetrics.riskPercent > 2 && (
          <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">High Risk Warning</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Risk per trade exceeds 2% — consider reducing position size
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!entryPrice || !stopLossPrice}
          className="w-full px-4 py-3 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed text-accent-foreground text-sm font-bold rounded-lg transition-all hover:scale-105"
        >
          Apply Risk Settings to Execution Panel
        </button>

        {/* Explanation Section - "Niyə açılır?" */}
        {isFullPage && (
          <div className="mt-8 border-t border-border bg-muted/30 rounded-lg p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-accent" />
                Niyə açılır?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu səhifədə position sizing, stop-loss və risk hesablamaları aparırsınız.
                Risk parametrlərini dəyişdikdə potensial profit/loss anında yenilənir.
                Sağ paneldən hesablanmış position size ilə birbaşa order verə bilərsiniz.
                Risk idarəetməsi trading-də ən vacib elementdir.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Risk 1-2%: Təhlükəsiz səviyyə</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">Risk 2-5%: Orta təhlükə</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-muted-foreground">Risk 5%+: Yüksək təhlükə</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskControl;

