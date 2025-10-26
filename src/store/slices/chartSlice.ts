import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Candle } from '../../types/trading';

interface ChartState {
  asset: string;
  timeframe: '15m' | '1h' | '4h' | '1d';
  candles: Candle[];
  loading: boolean;
  error: string | null;
  chartInstance: any; // Lightweight Charts instance
  indicators: {
    ema5: boolean;
    ema10: boolean;
    ema20: boolean;
    ema50: boolean;
    ema100: boolean;
    ema200: boolean;
    volume: boolean;
  };
  drawingTools: {
    enabled: boolean;
    activeTool: 'line' | 'horizontal' | 'vertical' | 'rectangle' | 'none';
  };
}

const initialState: ChartState = {
  asset: 'BTC-USD',
  timeframe: '1h',
  candles: [],
  loading: false,
  error: null,
  chartInstance: null,
  indicators: {
    ema5: true,
    ema10: true,
    ema20: true,
    ema50: false,
    ema100: false,
    ema200: true,
    volume: true,
  },
  drawingTools: {
    enabled: false,
    activeTool: 'none',
  },
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setAsset: (state, action: PayloadAction<string>) => {
      state.asset = action.payload;
    },
    setTimeframe: (state, action: PayloadAction<'15m' | '1h' | '4h' | '1d'>) => {
      state.timeframe = action.payload;
    },
    setCandles: (state, action: PayloadAction<Candle[]>) => {
      state.candles = action.payload;
    },
    addCandle: (state, action: PayloadAction<Candle>) => {
      state.candles.push(action.payload);
      // Keep only last 1000 candles for performance
      if (state.candles.length > 1000) {
        state.candles.shift();
      }
    },
    setChartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setChartInstance: (state, action: PayloadAction<any>) => {
      state.chartInstance = action.payload;
    },
    toggleIndicator: (state, action: PayloadAction<keyof ChartState['indicators']>) => {
      state.indicators[action.payload] = !state.indicators[action.payload];
    },
    setDrawingTool: (state, action: PayloadAction<ChartState['drawingTools']['activeTool']>) => {
      state.drawingTools.activeTool = action.payload;
      state.drawingTools.enabled = action.payload !== 'none';
    },
    toggleDrawingTools: (state) => {
      state.drawingTools.enabled = !state.drawingTools.enabled;
      if (!state.drawingTools.enabled) {
        state.drawingTools.activeTool = 'none';
      }
    },
  },
});

export const {
  setAsset,
  setTimeframe,
  setCandles,
  addCandle,
  setChartLoading,
  setChartError,
  setChartInstance,
  toggleIndicator,
  setDrawingTool,
  toggleDrawingTools,
} = chartSlice.actions;

export default chartSlice.reducer;
