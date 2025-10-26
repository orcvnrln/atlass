/**
 * 📊 TRADING SETUPS MODULE
 * Pre-configured AI-powered trading setups
 * Supports both modular and full-page layouts
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTradingStore } from '../core/state/store';
import { useTradeStore, TradingSetup } from '../core/tradeStore';
import { ExternalLink, Star, TrendingUp, Target, Shield } from 'lucide-react';

interface TradingSetupsProps {
  isFullPage?: boolean;
  onOpenFullPage?: () => void;
  onSetupSelect?: (setup: TradingSetup) => void;
}

const TradingSetups: React.FC<TradingSetupsProps> = ({
  isFullPage = false,
  onOpenFullPage,
  onSetupSelect
}) => {
  const navigate = useNavigate();
  const [selectedSetup, setSelectedSetup] = useState<TradingSetup | null>(null);

  // State
  const symbol = useTradingStore((state) => state.symbol);
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const candles = useTradingStore((state) => state.candles);
  const tradingSetups = useTradeStore((state) => state.tradingSetups);
  const addTradingSetup = useTradeStore((state) => state.addTradingSetup);
  const clearTradingSetups = useTradeStore((state) => state.clearTradingSetups);

  // Generate mock setups on mount
  useEffect(() => {
    if (tradingSetups.length === 0 && candles.length > 0) {
      generateMockSetups();
    }
  }, [candles.length]);

  const generateMockSetups = () => {
    const patterns = [
      'Bullish Engulfing',
      'Bearish Harami',
      'Morning Star',
      'Evening Star',
      'Hammer',
      'Shooting Star',
      'Doji',
      'Three White Soldiers',
    ];

    const mockSetups: TradingSetup[] = patterns.slice(0, 10).map((pattern, i) => {
      const isBullish = i % 2 === 0;
      const entry = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
      const stopLoss = isBullish ? entry * 0.98 : entry * 1.02;
      const takeProfit = isBullish ? entry * 1.04 : entry * 0.96;
      const rrRatio = Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

      return {
        id: `setup_${Date.now()}_${i}`,
        symbol,
        pattern,
        trend: isBullish ? 'BULLISH' : 'BEARISH',
        entry,
        stopLoss,
        takeProfit,
        rrRatio,
        confidence: 60 + Math.random() * 30,
        timestamp: Date.now(),
      };
    });

    mockSetups.forEach((setup) => addTradingSetup(setup));
  };

  const handleAcceptSetup = (setup: TradingSetup) => {
    setSelectedSetup(setup);
    onSetupSelect?.(setup);
    console.log('[TradingSetups] Accepted:', setup);
  };

  const handleSetupClick = (setup: TradingSetup) => {
    setSelectedSetup(setup);
    onSetupSelect?.(setup);
  };

  const handleRefresh = () => {
    clearTradingSetups();
    generateMockSetups();
  };

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
              AI Trading Setups
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isFullPage
                ? `Top 10 AI-powered trade opportunities for ${symbol}`
                : `AI-powered pre-configured setups for ${symbol}`
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
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-medium rounded-lg transition-all hover:scale-105"
            >
              Refresh Setups
            </button>
            {isFullPage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                Live AI Analysis
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={`grid gap-4 ${isFullPage ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Setups</span>
            <p className="text-2xl font-bold text-foreground mt-2">{tradingSetups.length}</p>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Bullish</span>
            <p className="text-2xl font-bold text-accent mt-2">
              {tradingSetups.filter((s) => s.trend === 'BULLISH').length}
            </p>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Bearish</span>
            <p className="text-2xl font-bold text-destructive mt-2">
              {tradingSetups.filter((s) => s.trend === 'BEARISH').length}
            </p>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Avg Confidence</span>
            <p className="text-2xl font-bold text-foreground mt-2">
              {tradingSetups.length > 0
                ? (
                    tradingSetups.reduce((sum, s) => sum + s.confidence, 0) /
                    tradingSetups.length
                  ).toFixed(0)
                : 0}
              %
            </p>
          </div>
          {isFullPage && (
            <div className="bg-secondary border border-border rounded-lg p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Selected</span>
              <p className="text-2xl font-bold text-accent mt-2">
                {selectedSetup ? '1' : '0'}
              </p>
            </div>
          )}
        </div>

        {/* Setup Cards */}
        <div className={`grid gap-4 ${isFullPage ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {tradingSetups.map((setup) => (
            <div
              key={setup.id}
              className={`bg-secondary border rounded-lg p-4 transition-all cursor-pointer hover:scale-105 ${
                selectedSetup?.id === setup.id
                  ? 'border-accent shadow-lg shadow-accent/20 bg-accent/5'
                  : 'border-border hover:border-accent/50'
              }`}
              onClick={() => handleSetupClick(setup)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      setup.trend === 'BULLISH'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {setup.trend === 'BULLISH' ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        BULLISH
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 rotate-180" />
                        BEARISH
                      </div>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{setup.pattern}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    setup.confidence >= 80 ? 'bg-accent' :
                    setup.confidence >= 60 ? 'bg-yellow-500' : 'bg-destructive'
                  }`} />
                  <span className="text-xs text-muted-foreground">{setup.confidence.toFixed(0)}%</span>
                </div>
              </div>

              {/* Levels */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Entry
                  </span>
                  <p className="text-sm font-mono font-bold text-foreground">
                    {setup.entry.toFixed(5)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    SL
                  </span>
                  <p className="text-sm font-mono font-bold text-destructive">
                    {setup.stopLoss.toFixed(5)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    TP
                  </span>
                  <p className="text-sm font-mono font-bold text-accent">
                    {setup.takeProfit.toFixed(5)}
                  </p>
                </div>
              </div>

              {/* R/R Ratio */}
              <div className="flex items-center justify-between mb-3 p-2 bg-muted rounded">
                <span className="text-xs text-muted-foreground">Risk/Reward</span>
                <span className={`text-sm font-mono font-bold ${
                  setup.rrRatio >= 2 ? 'text-accent' :
                  setup.rrRatio >= 1.5 ? 'text-yellow-500' : 'text-destructive'
                }`}>
                  1:{setup.rrRatio.toFixed(2)}
                </span>
              </div>

              {/* Accept Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptSetup(setup);
                }}
                className={`w-full px-3 py-2 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                  selectedSetup?.id === setup.id
                    ? 'bg-accent hover:bg-accent/90'
                    : 'bg-accent/80 hover:bg-accent'
                }`}
              >
                {selectedSetup?.id === setup.id ? 'Selected Setup' : 'Select Setup'}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tradingSetups.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-secondary flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">No trading setups available</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Click "Refresh Setups" to generate</p>
          </div>
        )}

        {/* Explanation Section - "Niyə açılır?" */}
        {isFullPage && (
          <div className="mt-8 border-t border-border bg-muted/30 rounded-lg p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Star className="w-5 h-5 text-accent" />
                Niyə açılır?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu səhifə AI tərəfindən təklif edilən ən güclü trade setup-larını göstərir.
                Hər biri R:R ratio və confidence score ilə qiymətləndirilir. Setup kartlarına
                kliklədikdə Entry/SL/TP dəyərləri sağ panelə avtomatik keçir və birbaşa order
                verə bilərsiniz. Yüksək confidence score-lu və yaxşı R:R ratio-lu setup-ları
                seçməyə diqqət edin.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">80%+ Confidence: Yüksək keyfiyyət</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">60-80% Confidence: Orta keyfiyyət</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-muted-foreground">R:R 1.5+: Tövsiyə edilir</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingSetups;

