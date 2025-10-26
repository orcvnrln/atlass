import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SmartMoneyPattern } from '../../types/trading';

interface SmartMoneyState {
  patterns: SmartMoneyPattern[];
  loading: boolean;
  error: string | null;
  selectedAsset: string;
  selectedTimeframe: '15m' | '1h' | '4h' | '1d';
  autoRefresh: boolean;
}

const initialState: SmartMoneyState = {
  patterns: [],
  loading: false,
  error: null,
  selectedAsset: 'BTC-USD',
  selectedTimeframe: '4h',
  autoRefresh: true,
};

const smartMoneySlice = createSlice({
  name: 'smartMoney',
  initialState,
  reducers: {
    setPatterns: (state, action: PayloadAction<SmartMoneyPattern[]>) => {
      state.patterns = action.payload;
    },
    addPattern: (state, action: PayloadAction<SmartMoneyPattern>) => {
      state.patterns.unshift(action.payload);
      // Keep only last 50 patterns
      if (state.patterns.length > 50) {
        state.patterns.pop();
      }
    },
    updatePattern: (state, action: PayloadAction<{ id: string; updates: Partial<SmartMoneyPattern> }>) => {
      const { id, updates } = action.payload;
      const index = state.patterns.findIndex(p => p.type === id);
      if (index !== -1) {
        state.patterns[index] = { ...state.patterns[index], ...updates };
      }
    },
    removePattern: (state, action: PayloadAction<string>) => {
      state.patterns = state.patterns.filter(p => p.type !== action.payload);
    },
    setSelectedAsset: (state, action: PayloadAction<string>) => {
      state.selectedAsset = action.payload;
    },
    setSelectedTimeframe: (state, action: PayloadAction<'15m' | '1h' | '4h' | '1d'>) => {
      state.selectedTimeframe = action.payload;
    },
    setSmartMoneyLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSmartMoneyError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },
    clearPatterns: (state) => {
      state.patterns = [];
    },
  },
});

export const {
  setPatterns,
  addPattern,
  updatePattern,
  removePattern,
  setSelectedAsset,
  setSelectedTimeframe,
  setSmartMoneyLoading,
  setSmartMoneyError,
  toggleAutoRefresh,
  clearPatterns,
} = smartMoneySlice.actions;

export default smartMoneySlice.reducer;
