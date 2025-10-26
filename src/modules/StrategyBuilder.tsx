/**
 * 🛠️ STRATEGY BUILDER MODULE
 * Drag & drop strategy creation with backtesting
 * Supports both modular and full-page layouts
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTradeStore, StrategyRule, BacktestResult } from '../core/tradeStore';
import { ExternalLink, Zap, Play, Save, Download, Star } from 'lucide-react';

interface StrategyBuilderProps {
  isFullPage?: boolean;
  onOpenFullPage?: () => void;
  onSetupSelect?: (setup: any) => void;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({
  isFullPage = false,
  onOpenFullPage,
  onSetupSelect
}) => {
  const navigate = useNavigate();
  const [showCodePreview, setShowCodePreview] = useState(false);

  // State
  const availableRules = useTradeStore((state) => state.availableRules);
  const activeRules = useTradeStore((state) => state.activeRules);
  const addActiveRule = useTradeStore((state) => state.addActiveRule);
  const removeActiveRule = useTradeStore((state) => state.removeActiveRule);
  const backtestResult = useTradeStore((state) => state.backtestResult);
  const setBacktestResult = useTradeStore((state) => state.setBacktestResult);

  const handleAddRule = (rule: StrategyRule) => {
    if (activeRules.find((r) => r.id === rule.id)) {
      alert('Rule already added');
      return;
    }
    addActiveRule(rule);
  };

  const handleRunBacktest = () => {
    // Mock backtest result
    const mockResult: BacktestResult = {
      totalTrades: Math.floor(Math.random() * 100) + 50,
      winRate: 50 + Math.random() * 30,
      profitFactor: 1 + Math.random() * 1.5,
      maxDrawdown: Math.random() * 20,
      netProfit: (Math.random() - 0.3) * 10000,
    };

    setBacktestResult(mockResult);

    // Create a mock setup for the execution panel
    if (onSetupSelect && activeRules.length > 0) {
      const mockSetup = {
        symbol: 'EURUSD',
        pattern: 'Custom Strategy',
        entry: 1.0850,
        stopLoss: 1.0800,
        takeProfit: 1.0920,
        direction: 'BUY',
        confidence: mockResult.winRate,
        rrRatio: 1.4
      };
      onSetupSelect(mockSetup);
    }
  };

  const generateCode = () => {
    return `// Auto-generated strategy code
function tradingStrategy(candles, indicators) {
  const signals = [];

${activeRules
  .map(
    (rule) => `  // ${rule.condition}
  if (${rule.condition.toLowerCase().replace(/\s+/g, '_')}) {
    signals.push({ action: '${rule.action}', timestamp: Date.now() });
  }`
  )
  .join('\n\n')}

  return signals;
}`;
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
              Strategy Builder
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isFullPage
                ? 'Professional drag & drop strategy creation with real-time backtesting'
                : 'Create custom trading strategies with drag & drop'
              }
            </p>
          </div>
          <div className="flex gap-2">
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
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="px-4 py-2 bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-medium rounded-lg transition-all"
            >
              {showCodePreview ? 'Hide' : 'Show'} Code
            </button>
            <button
              onClick={handleRunBacktest}
              disabled={activeRules.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed text-accent-foreground text-sm font-medium rounded-lg transition-all hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Run Backtest
            </button>
            {isFullPage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                Live Strategy Testing
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className={`grid gap-6 ${isFullPage ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {/* Available Rules */}
          <div className="bg-secondary border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Available Rules</h3>
            <div className="space-y-2">
              {availableRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-muted border border-border rounded-lg hover:border-accent/50 transition-all cursor-pointer hover:scale-105"
                  onClick={() => handleAddRule(rule)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        rule.type === 'INDICATOR'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {rule.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        rule.action === 'BUY'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      {rule.action}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{rule.condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Rules */}
          <div className="bg-secondary border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Active Rules ({activeRules.length})
            </h3>
            {activeRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">No rules added yet</p>
                <p className="text-muted-foreground/70 text-xs mt-1">Click on rules to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeRules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-muted border border-accent/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            rule.type === 'INDICATOR'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}
                        >
                          {rule.type}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            rule.action === 'BUY'
                              ? 'bg-accent/20 text-accent'
                              : 'bg-destructive/20 text-destructive'
                          }`}
                        >
                          {rule.action}
                        </span>
                      </div>
                      <button
                        onClick={() => removeActiveRule(rule.id)}
                        className="text-destructive hover:text-destructive/80 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-foreground">{rule.condition}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strategy Performance (Full Page Only) */}
          {isFullPage && (
            <div className="bg-secondary border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Strategy Performance</h3>
              {backtestResult ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded p-3">
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                      <div className="text-lg font-bold text-accent">{backtestResult.winRate.toFixed(1)}%</div>
                    </div>
                    <div className="bg-muted rounded p-3">
                      <div className="text-xs text-muted-foreground">Profit Factor</div>
                      <div className="text-lg font-bold text-foreground">{backtestResult.profitFactor.toFixed(2)}</div>
                    </div>
                    <div className="bg-muted rounded p-3">
                      <div className="text-xs text-muted-foreground">Total Trades</div>
                      <div className="text-lg font-bold text-foreground">{backtestResult.totalTrades}</div>
                    </div>
                    <div className="bg-muted rounded p-3">
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                      <div className="text-lg font-bold text-destructive">{backtestResult.maxDrawdown.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <div className="text-xs text-muted-foreground">Net Profit</div>
                    <div className={`text-xl font-bold ${backtestResult.netProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {backtestResult.netProfit >= 0 ? '+' : ''}${backtestResult.netProfit.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-muted flex items-center justify-center">
                    <Play className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">No backtest results yet</p>
                  <p className="text-muted-foreground/70 text-xs mt-1">Add rules and run backtest</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Code Preview */}
        {showCodePreview && activeRules.length > 0 && (
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Generated Code</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateCode());
                  alert('Code copied to clipboard!');
                }}
                className="px-3 py-1 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium rounded transition-colors"
              >
                Copy Code
              </button>
            </div>
            <pre className="p-4 bg-background border border-border rounded-lg overflow-x-auto">
              <code className="text-xs text-accent font-mono">{generateCode()}</code>
            </pre>
          </div>
        )}

        {/* Backtest Results (Module View) */}
        {!isFullPage && backtestResult && (
          <div className="bg-secondary border border-accent/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Backtest Results</h3>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Total Trades</span>
                <p className="text-xl font-bold text-foreground mt-1">
                  {backtestResult.totalTrades}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Win Rate</span>
                <p className="text-xl font-bold text-accent mt-1">
                  {backtestResult.winRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Profit Factor</span>
                <p className="text-xl font-bold text-blue-400 mt-1">
                  {backtestResult.profitFactor.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Max Drawdown</span>
                <p className="text-xl font-bold text-destructive mt-1">
                  {backtestResult.maxDrawdown.toFixed(1)}%
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Net Profit</span>
                <p
                  className={`text-xl font-bold mt-1 ${
                    backtestResult.netProfit >= 0 ? 'text-accent' : 'text-destructive'
                  }`}
                >
                  {backtestResult.netProfit >= 0 ? '+' : ''}
                  ${backtestResult.netProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Explanation Section - "Niyə açılır?" */}
        {isFullPage && (
          <div className="mt-8 border-t border-border bg-muted/30 rounded-lg p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Zap className="w-5 h-5 text-accent" />
                Niyə açılır?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu səhifədə öz strategiyalarınızı yaradıb real vaxtda test edə bilərsiniz.
                Sol tərəfdən qaydaları sürüşdürün, mərkəzdə strategiya qurub chartda xətlər çəkin.
                Backtest düyməsi ilə keçmiş məlumatlarla test edin və nəticələri analiz edin.
                Strategiya hazır olduqda sağ paneldən birbaşa order verə bilərsiniz.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-muted-foreground">Indicator Rules: Texniki göstəricilər</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-muted-foreground">Pattern Rules: Şam pattern-ləri</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Win Rate 60%+: Yaxşı nəticə</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyBuilder;

