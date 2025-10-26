import { configureStore } from '@reduxjs/toolkit';
import chartSlice from './slices/chartSlice';
import signalSlice from './slices/signalSlice';
import portfolioSlice from './slices/portfolioSlice';
import uiSlice from './slices/uiSlice';
import orderFlowSlice from './slices/orderFlowSlice';
import smartMoneySlice from './slices/smartMoneySlice';
import backtestSlice from './slices/backtestSlice';
import correlationSlice from './slices/correlationSlice';
import newsSlice from './slices/newsSlice';

export const store = configureStore({
  reducer: {
    chart: chartSlice,
    signal: signalSlice,
    portfolio: portfolioSlice,
    ui: uiSlice,
    orderFlow: orderFlowSlice,
    smartMoney: smartMoneySlice,
    backtest: backtestSlice,
    correlation: correlationSlice,
    news: newsSlice,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chart/setChartInstance'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
