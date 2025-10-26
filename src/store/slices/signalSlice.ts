import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Signal } from '../../types/trading';

interface SignalState {
  current: Signal | null;
  history: Signal[];
  loading: boolean;
  error: string | null;
}

const initialState: SignalState = {
  current: null,
  history: [],
  loading: false,
  error: null,
};

const signalSlice = createSlice({
  name: 'signal',
  initialState,
  reducers: {
    setCurrentSignal: (state, action: PayloadAction<Signal>) => {
      state.current = action.payload;
      state.history.unshift(action.payload);
      if (state.history.length > 100) {
        state.history.pop();
      }
    },
    setSignalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSignalError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSignalStatus: (state, action: PayloadAction<{ id: string; status: Signal['status']; pnl?: number; pnlPercent?: number }>) => {
      const { id, status, pnl, pnlPercent } = action.payload;
      
      // Update current signal if it matches
      if (state.current?.id === id) {
        state.current.status = status;
        if (pnl !== undefined) state.current.pnl = pnl;
        if (pnlPercent !== undefined) state.current.pnlPercent = pnlPercent;
      }
      
      // Update in history
      const historyIndex = state.history.findIndex(signal => signal.id === id);
      if (historyIndex !== -1) {
        state.history[historyIndex].status = status;
        if (pnl !== undefined) state.history[historyIndex].pnl = pnl;
        if (pnlPercent !== undefined) state.history[historyIndex].pnlPercent = pnlPercent;
      }
    },
    clearSignalHistory: (state) => {
      state.history = [];
    },
  },
});

export const {
  setCurrentSignal,
  setSignalLoading,
  setSignalError,
  updateSignalStatus,
  clearSignalHistory,
} = signalSlice.actions;

export default signalSlice.reducer;
