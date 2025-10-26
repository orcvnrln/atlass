import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Portfolio, Position, RiskAlert } from '../../types/trading';

interface PortfolioState {
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  selectedTab: 'overview' | 'positions' | 'risk' | 'stress-test';
}

const initialState: PortfolioState = {
  portfolio: null,
  loading: false,
  error: null,
  selectedTab: 'overview',
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state.portfolio = action.payload;
    },
    updatePosition: (state, action: PayloadAction<{ asset: string; position: Partial<Position> }>) => {
      if (state.portfolio) {
        const { asset, position } = action.payload;
        const index = state.portfolio.positions.findIndex(p => p.asset === asset);
        if (index !== -1) {
          state.portfolio.positions[index] = { ...state.portfolio.positions[index], ...position };
        }
      }
    },
    addPosition: (state, action: PayloadAction<Position>) => {
      if (state.portfolio) {
        state.portfolio.positions.push(action.payload);
        state.portfolio.openPositions = state.portfolio.positions.length;
      }
    },
    removePosition: (state, action: PayloadAction<string>) => {
      if (state.portfolio) {
        state.portfolio.positions = state.portfolio.positions.filter(p => p.asset !== action.payload);
        state.portfolio.openPositions = state.portfolio.positions.length;
      }
    },
    addRiskAlert: (state, action: PayloadAction<RiskAlert>) => {
      if (state.portfolio) {
        state.portfolio.alerts.push(action.payload);
      }
    },
    removeRiskAlert: (state, action: PayloadAction<number>) => {
      if (state.portfolio) {
        state.portfolio.alerts.splice(action.payload, 1);
      }
    },
    setPortfolioLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPortfolioError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<PortfolioState['selectedTab']>) => {
      state.selectedTab = action.payload;
    },
  },
});

export const {
  setPortfolio,
  updatePosition,
  addPosition,
  removePosition,
  addRiskAlert,
  removeRiskAlert,
  setPortfolioLoading,
  setPortfolioError,
  setSelectedTab,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
