import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CorrelationData {
  symbol1: string;
  symbol2: string;
  correlation: number;
  pValue: number;
  confidence: number;
  lastUpdated: string;
}

interface CorrelationMatrix {
  symbols: string[];
  correlations: CorrelationData[];
  anomalies: {
    symbol1: string;
    symbol2: string;
    expectedCorrelation: number;
    actualCorrelation: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  lastUpdated: string;
}

interface CorrelationState {
  matrix: CorrelationMatrix | null;
  loading: boolean;
  error: string | null;
  selectedSymbols: string[];
  timeRange: string;
}

const initialState: CorrelationState = {
  matrix: null,
  loading: false,
  error: null,
  selectedSymbols: ['BTC-USD', 'ETH-USD', 'EUR-USD', 'SPY'],
  timeRange: '24h'
};

const correlationSlice = createSlice({
  name: 'correlation',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateCorrelationMatrix: (state, action: PayloadAction<CorrelationMatrix>) => {
      state.matrix = action.payload;
    },
    setSelectedSymbols: (state, action: PayloadAction<string[]>) => {
      state.selectedSymbols = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.timeRange = action.payload;
    },
    clearCorrelations: (state) => {
      state.matrix = null;
    }
  }
});

export const {
  setLoading,
  setError,
  updateCorrelationMatrix,
  setSelectedSymbols,
  setTimeRange,
  clearCorrelations
} = correlationSlice.actions;

export default correlationSlice.reducer;
