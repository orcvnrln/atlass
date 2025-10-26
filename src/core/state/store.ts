/**
 * 🧠 CORE STATE STORE
 * Vahid state mənbəyi — hər şey buradan idarə olunur
 * Bloomberg Terminal tərzi state orchestration
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type Symbol = string; // e.g., 'BTCUSDT'
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AISignal {
  id: string;
  timestamp: number;
  symbol: Symbol;
  side: OrderSide;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number; // 0-100
  reasoning: string;
  rrRatio: number; // Risk/Reward
}

export interface Order {
  id: string;
  symbol: Symbol;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number; // undefined for MARKET
  stopLoss?: number;
  takeProfit?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED';
  timestamp: number;
}

export interface Position {
  id: string;
  symbol: Symbol;
  side: OrderSide;
  entryPrice: number;
  quantity: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface ChartOverlay {
  id: string;
  type: 'line' | 'zone' | 'marker';
  data: any; // Plotly shape/annotation
  source: 'AI' | 'USER' | 'ORDER';
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE SLICES
// ─────────────────────────────────────────────────────────────────────────────

interface MarketState {
  symbol: Symbol;
  timeframe: Timeframe;
  currentPrice: number;
  candles: Candle[];
  lastUpdate: number; // timestamp
  setSymbol: (symbol: Symbol) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  updatePrice: (price: number) => void;
  updateCandles: (candles: Candle[]) => void;
}

interface ChartState {
  overlays: ChartOverlay[];
  isLoading: boolean;
  addOverlay: (overlay: ChartOverlay) => void;
  removeOverlay: (id: string) => void;
  clearOverlays: (source?: 'AI' | 'USER' | 'ORDER') => void;
  setLoading: (loading: boolean) => void;
}

interface AIState {
  signals: AISignal[];
  isThinking: boolean;
  lastAnalysis: number; // timestamp
  addSignal: (signal: AISignal) => void;
  clearSignals: () => void;
  setThinking: (thinking: boolean) => void;
}

interface OrderState {
  orders: Order[];
  positions: Position[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  closePosition: (id: string) => void;
}

interface UIState {
  focusMode: boolean;
  aiPanelOpen: boolean;
  orderPanelOpen: boolean;
  chartPanelOpen: boolean;
  toggleFocusMode: () => void;
  togglePanel: (panel: 'ai' | 'order' | 'chart') => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED STORE
// ─────────────────────────────────────────────────────────────────────────────

type TradingStore = MarketState & ChartState & AIState & OrderState & UIState;

export const useTradingStore = create<TradingStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // ─── MARKET STATE ───
      symbol: 'BTCUSDT',
      timeframe: '15m',
      currentPrice: 0,
      candles: [],
      lastUpdate: 0,

      setSymbol: (symbol) => {
        const now = Date.now();
        set({ symbol, lastUpdate: now });
        // Event will be triggered by subscription
      },

      setTimeframe: (timeframe) => {
        const now = Date.now();
        set({ timeframe, lastUpdate: now });
      },

      updatePrice: (price) => {
        set({ currentPrice: price, lastUpdate: Date.now() });
      },

      updateCandles: (candles) => {
        set({ candles, lastUpdate: Date.now() });
      },

      // ─── CHART STATE ───
      overlays: [],
      isLoading: false,

      addOverlay: (overlay) => {
        set((state) => ({
          overlays: [...state.overlays, overlay],
        }));
      },

      removeOverlay: (id) => {
        set((state) => ({
          overlays: state.overlays.filter((o) => o.id !== id),
        }));
      },

      clearOverlays: (source) => {
        set((state) => ({
          overlays: source
            ? state.overlays.filter((o) => o.source !== source)
            : [],
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // ─── AI STATE ───
      signals: [],
      isThinking: false,
      lastAnalysis: 0,

      addSignal: (signal) => {
        set((state) => ({
          signals: [...state.signals, signal],
          lastAnalysis: Date.now(),
        }));
      },

      clearSignals: () => {
        set({ signals: [] });
      },

      setThinking: (thinking) => {
        set({ isThinking: thinking });
      },

      // ─── ORDER STATE ───
      orders: [],
      positions: [],

      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order],
        }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }));
      },

      addPosition: (position) => {
        set((state) => ({
          positions: [...state.positions, position],
        }));
      },

      updatePosition: (id, updates) => {
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      closePosition: (id) => {
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        }));
      },

      // ─── UI STATE ───
      focusMode: false,
      aiPanelOpen: true,
      orderPanelOpen: true,
      chartPanelOpen: true,

      toggleFocusMode: () => {
        set((state) => ({ focusMode: !state.focusMode }));
      },

      togglePanel: (panel) => {
        set((state) => {
          switch (panel) {
            case 'ai':
              return { aiPanelOpen: !state.aiPanelOpen };
            case 'order':
              return { orderPanelOpen: !state.orderPanelOpen };
            case 'chart':
              return { chartPanelOpen: !state.chartPanelOpen };
            default:
              return state;
          }
        });
      },
    })),
    { name: 'TradingStore' }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS (Performance optimization)
// ─────────────────────────────────────────────────────────────────────────────

export const selectMarketContext = (state: TradingStore) => ({
  symbol: state.symbol,
  timeframe: state.timeframe,
  currentPrice: state.currentPrice,
  lastUpdate: state.lastUpdate,
});

export const selectAIContext = (state: TradingStore) => ({
  symbol: state.symbol,
  currentPrice: state.currentPrice,
  signals: state.signals,
  isThinking: state.isThinking,
});

export const selectOrderContext = (state: TradingStore) => ({
  symbol: state.symbol,
  currentPrice: state.currentPrice,
  orders: state.orders,
  positions: state.positions,
});

