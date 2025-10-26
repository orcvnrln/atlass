/**
 * 🤖 AI ANALYSIS MODULE
 * Real-time AI-powered market analysis
 * Supports both modular and full-page layouts
 */

import React, { useState, useEffect } from 'react';
import { useTradingStore } from '../core/state/store';
import { aiService } from '../core/services/aiService';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, StatCard, SignalCard } from '../components/ui/Card';
import { SkeletonSignalCard, SkeletonStatCard, LoadingOverlay } from '../components/ui/Skeleton';
import { formatPrice, formatPercent, formatRelativeTime } from '../utils/formatters';
import { Brain, TrendingUp, Star, ExternalLink } from 'lucide-react';

interface AIAnalysisProps {
  isFullPage?: boolean;
  onSetupSelect?: (setup: any) => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({
  isFullPage = false,
  onSetupSelect
}) => {
  const [marketSentiment, setMarketSentiment] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL');
  const [sentimentScore, setSentimentScore] = useState(50);

  // State
  const symbol = useTradingStore((state) => state.symbol);
  const timeframe = useTradingStore((state) => state.timeframe);
  const candles = useTradingStore((state) => state.candles);
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const signals = useTradingStore((state) => state.signals);
  const isThinking = useTradingStore((state) => state.isThinking);
  const lastAnalysis = useTradingStore((state) => state.lastAnalysis);

  // Auto-analyze on mount
  useEffect(() => {
    if (candles.length > 0 && signals.length === 0) {
      handleAnalyze();
    }
  }, [candles.length]);

  // Calculate sentiment
  useEffect(() => {
    if (candles.length < 20) return;

    const recentCandles = candles.slice(-20);
    const bullishCandles = recentCandles.filter((c) => c.close > c.open).length;
    const score = (bullishCandles / 20) * 100;

    setSentimentScore(score);

    if (score > 60) setMarketSentiment('BULLISH');
    else if (score < 40) setMarketSentiment('BEARISH');
    else setMarketSentiment('NEUTRAL');
  }, [candles]);

  const handleAnalyze = async () => {
    if (candles.length === 0) {
      alert('No chart data available');
      return;
    }

    await aiService.analyzeMarket({
      symbol,
      timeframe,
      candles,
      currentPrice,
    });
  };

  const latestSignal = signals[signals.length - 1];
  const isStale = latestSignal && Date.now() - latestSignal.timestamp > 300000; // 5 min

  const handleSignalSelect = (signal: any) => {
    if (onSetupSelect) {
      const setup = {
        symbol,
        pattern: signal.type || 'AI Signal',
        entry: signal.entry || currentPrice,
        stopLoss: signal.stopLoss || currentPrice * 0.98,
        takeProfit: signal.takeProfit || currentPrice * 1.02,
        direction: signal.direction || 'BUY',
        confidence: signal.confidence || 75,
        rrRatio: signal.rrRatio || 1.5
      };
      onSetupSelect(setup);
    }
  };

  const containerClass = isFullPage
    ? "h-full bg-background p-6 overflow-y-auto"
    : "h-full bg-background p-6 overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`font-bold text-foreground ${isFullPage ? 'text-2xl' : 'text-xl'}`}>
              AI Market Analysis
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isFullPage
                ? `Advanced AI-powered market insights for ${symbol} (${timeframe})`
                : `Real-time AI-powered insights for ${symbol} (${timeframe})`
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isThinking || candles.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed text-accent-foreground text-sm font-medium rounded-lg transition-all hover:scale-105"
            >
              <Brain className="w-4 h-4" />
              {isThinking ? 'Analyzing...' : 'Run Analysis'}
            </button>
            {isFullPage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                Live AI Analysis
              </div>
            )}
          </div>
        </div>

        {/* Market Sentiment Stats */}
        <div className={`grid gap-4 ${isFullPage ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Market Sentiment</span>
              <div
                className={`w-3 h-3 rounded-full ${
                  marketSentiment === 'BULLISH'
                    ? 'bg-accent'
                    : marketSentiment === 'BEARISH'
                    ? 'bg-destructive'
                    : 'bg-muted-foreground'
                }`}
              />
            </div>
            <p className="text-xl font-bold text-foreground">{marketSentiment}</p>
            <p className={`text-xs mt-1 ${sentimentScore > 50 ? 'text-accent' : 'text-destructive'}`}>
              {sentimentScore > 50 ? '+' : ''}{(sentimentScore - 50).toFixed(1)}%
            </p>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Confidence Score</span>
              <div className="w-3 h-3 rounded-full bg-blue-400" />
            </div>
            <p className="text-xl font-bold text-foreground">{sentimentScore.toFixed(0)}%</p>
            <p className={`text-xs mt-1 ${sentimentScore > 70 ? 'text-accent' : 'text-destructive'}`}>
              {sentimentScore > 70 ? 'High' : 'Low'} confidence
            </p>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Last Analysis</span>
              <div className={`w-3 h-3 rounded-full ${isStale ? 'bg-yellow-500' : 'bg-accent'}`} />
            </div>
            <p className="text-xl font-bold text-foreground">
              {lastAnalysis > 0 ? formatRelativeTime(lastAnalysis) : 'Never'}
            </p>
            <p className={`text-xs mt-1 ${isStale ? 'text-yellow-500' : 'text-accent'}`}>
              {isStale ? 'Stale data' : 'Fresh'}
            </p>
          </div>

          {isFullPage && (
            <div className="bg-secondary border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Active Signals</span>
                <div className="w-3 h-3 rounded-full bg-accent" />
              </div>
              <p className="text-xl font-bold text-foreground">{signals.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total generated</p>
            </div>
          )}
        </div>

        {/* Latest AI Signal */}
        {isThinking ? (
          <div className="bg-secondary border border-border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
            <div className="grid grid-cols-4 gap-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ) : latestSignal ? (
          <div>
            {isStale && (
              <div className="mb-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <p className="text-sm text-yellow-500">
                  ⚠️ This signal is older than 5 minutes. Consider running a new analysis.
                </p>
              </div>
            )}
            <div
              onClick={() => handleSignalSelect(latestSignal)}
              className="bg-secondary border border-accent/50 rounded-lg p-4 cursor-pointer hover:bg-secondary/80 transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  Latest AI Signal
                </h3>
                <span className={`px-2 py-1 text-xs font-bold rounded ${isStale ? 'bg-yellow-500/20 text-yellow-500' : 'bg-accent/20 text-accent'}`}>
                  {isStale ? 'STALE' : 'FRESH'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Direction</span>
                  <p className={`text-lg font-bold ${latestSignal.side === 'BUY' ? 'text-accent' : 'text-destructive'}`}>
                    {latestSignal.side}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Entry</span>
                  <p className="text-lg font-bold text-foreground font-mono">{formatPrice(latestSignal.entry)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">R/R Ratio</span>
                  <p className="text-lg font-bold text-blue-400 font-mono">1:{latestSignal.rrRatio.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Confidence</span>
                  <p className={`text-lg font-bold ${latestSignal.confidence > 70 ? 'text-accent' : 'text-yellow-500'}`}>
                    {latestSignal.confidence}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-secondary border border-border rounded-lg p-8">
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No AI Signals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Click "Run Analysis" to generate AI-powered trading signals
              </p>
            </div>
          </div>
        )}

        {/* Signal History */}
        {signals.length > 1 && (
          <div className="bg-secondary border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Signal History</h3>
            <p className="text-xs text-muted-foreground mb-4">Last {Math.min(signals.length, 5)} signals</p>
            <div className="space-y-2">
              {signals.slice(-5).reverse().map((signal, index) => (
                <div
                  key={signal.id}
                  onClick={() => handleSignalSelect(signal)}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all cursor-pointer hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-md ${
                        signal.side === 'BUY'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {signal.side}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(signal.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-foreground font-mono">
                      Entry: {formatPrice(signal.entry)}
                    </span>
                    <span className="text-xs text-blue-400 font-mono">
                      R/R: 1:{signal.rrRatio.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">{signal.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation Section - "Niyə açılır?" */}
        {isFullPage && (
          <div className="mt-8 border-t border-border bg-muted/30 rounded-lg p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Brain className="w-5 h-5 text-accent" />
                Niyə açılır?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu səhifədə AI tərəfindən real vaxtda market analizi aparılır.
                Texniki göstəricilər, pattern tanıma və sentiment analizi birləşdirilir.
                Signal kartlarına klikləyərək sağ paneldə avtomatik order parametrləri doldurulur.
                AI confidence score-u 70%+ olan siqnallar daha etibarlıdır.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Bullish: Yüksəliş trendi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-muted-foreground">Bearish: Düşüş trendi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">Neutral: Yan trend</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;

