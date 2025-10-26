import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { BacktestResult, StressTestResult, StressTestScenario } from '../../types/trading';

interface BacktestState {
  results: BacktestResult | null;
  stressTestResults: StressTestResult | null;
  scenarios: StressTestScenario[];
  loading: boolean;
  error: string | null;
  parameters: {
    asset: string;
    timeframe: '15m' | '1h' | '4h' | '1d';
    startDate: string;
    endDate: string;
    initialCapital: number;
    positionSize: number;
    positionSizeType: 'fixed' | 'risk-percent';
    slippage: number;
    commission: number;
  };
}

const initialState: BacktestState = {
  results: null,
  stressTestResults: null,
  scenarios: [],
  loading: false,
  error: null,
  parameters: {
    asset: 'BTC-USD',
    timeframe: '1h',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    initialCapital: 10000,
    positionSize: 0.1,
    positionSizeType: 'fixed',
    slippage: 0.05,
    commission: 0.05,
  },
};

const backtestSlice = createSlice({
  name: 'backtest',
  initialState,
  reducers: {
    setBacktestResults: (state, action: PayloadAction<BacktestResult>) => {
      state.results = action.payload;
    },
    setStressTestResults: (state, action: PayloadAction<StressTestResult>) => {
      state.stressTestResults = action.payload;
    },
    setScenarios: (state, action: PayloadAction<StressTestScenario[]>) => {
      state.scenarios = action.payload;
    },
    addScenario: (state, action: PayloadAction<StressTestScenario>) => {
      state.scenarios.push(action.payload);
    },
    removeScenario: (state, action: PayloadAction<number>) => {
      state.scenarios.splice(action.payload, 1);
    },
    updateParameters: (state, action: PayloadAction<Partial<BacktestState['parameters']>>) => {
      state.parameters = { ...state.parameters, ...action.payload };
    },
    setBacktestLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBacktestError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearResults: (state) => {
      state.results = null;
      state.stressTestResults = null;
    },
    resetParameters: (state) => {
      state.parameters = initialState.parameters;
    },
  },
});

export const {
  setBacktestResults,
  setStressTestResults,
  setScenarios,
  addScenario,
  removeScenario,
  updateParameters,
  setBacktestLoading,
  setBacktestError,
  clearResults,
  resetParameters,
} = backtestSlice.actions;

export default backtestSlice.reducer;
