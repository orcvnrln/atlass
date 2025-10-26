import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { OrderFlow, LargeTrade, DivergenceAlert } from '../../types/trading';

interface OrderFlowState {
  data: OrderFlow | null;
  loading: boolean;
  error: string | null;
  selectedAsset: string;
  realTimeEnabled: boolean;
}

const initialState: OrderFlowState = {
  data: null,
  loading: false,
  error: null,
  selectedAsset: 'BTC-USD',
  realTimeEnabled: true,
};

const orderFlowSlice = createSlice({
  name: 'orderFlow',
  initialState,
  reducers: {
    setOrderFlowData: (state, action: PayloadAction<OrderFlow>) => {
      state.data = action.payload;
    },
    addLargeTrade: (state, action: PayloadAction<LargeTrade>) => {
      if (state.data) {
        state.data.largeTrades.unshift(action.payload);
        // Keep only last 100 trades
        if (state.data.largeTrades.length > 100) {
          state.data.largeTrades.pop();
        }
      }
    },
    updateImbalance: (state, action: PayloadAction<{ bidVolume: number; askVolume: number }>) => {
      if (state.data) {
        const { bidVolume, askVolume } = action.payload;
        state.data.bidVolume = bidVolume;
        state.data.askVolume = askVolume;
        state.data.imbalance = bidVolume - askVolume;
      }
    },
    addDivergenceAlert: (state, action: PayloadAction<DivergenceAlert>) => {
      if (state.data) {
        state.data.divergenceAlerts.unshift(action.payload);
        // Keep only last 20 alerts
        if (state.data.divergenceAlerts.length > 20) {
          state.data.divergenceAlerts.pop();
        }
      }
    },
    setSelectedAsset: (state, action: PayloadAction<string>) => {
      state.selectedAsset = action.payload;
    },
    setOrderFlowLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOrderFlowError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleRealTime: (state) => {
      state.realTimeEnabled = !state.realTimeEnabled;
    },
    clearOrderFlowData: (state) => {
      state.data = null;
    },
  },
});

export const {
  setOrderFlowData,
  addLargeTrade,
  updateImbalance,
  addDivergenceAlert,
  setSelectedAsset,
  setOrderFlowLoading,
  setOrderFlowError,
  toggleRealTime,
  clearOrderFlowData,
} = orderFlowSlice.actions;

export default orderFlowSlice.reducer;
