/**
 * 🎯 TRADE STORE
 * Modul-specific state management (AI Analysis, Trading Setups, etc.)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ModuleName = 'AI Analysis' | 'Trading Setups' | 'Strategy Builder' | 'Risk Control';

export interface TradingSetup {
  id: string;
  symbol: string;
  pattern: string; // e.g., "Bullish Engulfing"
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  rrRatio: number;
  confidence: number;
  timestamp: number;
}

export interface StrategyRule {
  id: string;
  type: 'INDICATOR' | 'PATTERN' | 'PRICE' | 'VOLUME';
  condition: string; // e.g., "RSI > 70"
  action: 'BUY' | 'SELL' | 'CLOSE';
}

export interface BacktestResult {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  netProfit: number;
}

export interface RiskMetrics {
  positionSize: number;
  riskPercent: number;
  leverage: number;
  stopLossDistance: number;
  potentialProfit: number;
  potentialLoss: number;
  marginRequired: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

interface TradeStore {
  // Active Module
  activeModule: ModuleName;
  setActiveModule: (module: ModuleName) => void;

  // Trading Setups
  tradingSetups: TradingSetup[];
  addTradingSetup: (setup: TradingSetup) => void;
  clearTradingSetups: () => void;

  // Strategy Builder
  availableRules: StrategyRule[];
  activeRules: StrategyRule[];
  addActiveRule: (rule: StrategyRule) => void;
  removeActiveRule: (id: string) => void;
  backtestResult: BacktestResult | null;
  setBacktestResult: (result: BacktestResult) => void;

  // Risk Control
  riskMetrics: RiskMetrics;
  updateRiskMetrics: (metrics: Partial<RiskMetrics>) => void;
}

export const useTradeStore = create<TradeStore>()(
  devtools(
    (set) => ({
      // ─── ACTIVE MODULE ───
      activeModule: 'AI Analysis',
      setActiveModule: (module) => set({ activeModule: module }),

      // ─── TRADING SETUPS ───
      tradingSetups: [],
      addTradingSetup: (setup) =>
        set((state) => ({
          tradingSetups: [...state.tradingSetups, setup],
        })),
      clearTradingSetups: () => set({ tradingSetups: [] }),

      // ─── STRATEGY BUILDER ───
      availableRules: [
        {
          id: 'rule_rsi_oversold',
          type: 'INDICATOR',
          condition: 'RSI < 30',
          action: 'BUY',
        },
        {
          id: 'rule_rsi_overbought',
          type: 'INDICATOR',
          condition: 'RSI > 70',
          action: 'SELL',
        },
        {
          id: 'rule_sma_cross_up',
          type: 'INDICATOR',
          condition: 'SMA(20) crosses above SMA(50)',
          action: 'BUY',
        },
        {
          id: 'rule_sma_cross_down',
          type: 'INDICATOR',
          condition: 'SMA(20) crosses below SMA(50)',
          action: 'SELL',
        },
        {
          id: 'rule_bullish_engulfing',
          type: 'PATTERN',
          condition: 'Bullish Engulfing detected',
          action: 'BUY',
        },
        {
          id: 'rule_bearish_engulfing',
          type: 'PATTERN',
          condition: 'Bearish Engulfing detected',
          action: 'SELL',
        },
      ],
      activeRules: [],
      addActiveRule: (rule) =>
        set((state) => ({
          activeRules: [...state.activeRules, rule],
        })),
      removeActiveRule: (id) =>
        set((state) => ({
          activeRules: state.activeRules.filter((r) => r.id !== id),
        })),
      backtestResult: null,
      setBacktestResult: (result) => set({ backtestResult: result }),

      // ─── RISK CONTROL ───
      riskMetrics: {
        positionSize: 0,
        riskPercent: 1,
        leverage: 1,
        stopLossDistance: 0,
        potentialProfit: 0,
        potentialLoss: 0,
        marginRequired: 0,
      },
      updateRiskMetrics: (metrics) =>
        set((state) => ({
          riskMetrics: { ...state.riskMetrics, ...metrics },
        })),
    }),
    { name: 'TradeStore' }
  )
);

