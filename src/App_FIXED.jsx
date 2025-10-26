import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/pages/Dashboard';
import Portfolio from '@/pages/Portfolio_NEW_FIXED';
import Watchlist from '@/pages/Watchlist';
import NewsHub from '@/pages/NewsHub';
import EconomicCalendar from '@/pages/EconomicCalendar';
import Settings from '@/pages/Settings';
import MarketCategory from '@/pages/MarketCategory';
import AssetDetail from '@/pages/AssetDetail';
import AIAssistant from '@/components/ai/AIAssistant';
import VoiceAssistant from '@/components/ai/VoiceAssistant';
import AICopilotPage from '@/pages/AICopilotPage';
import AITradingBotPage from '@/pages/AITradingBotPage';
import CorrelationDashboardPage from '@/pages/CorrelationDashboardPage';
import TradeJournalPage from '@/pages/TradeJournalPage';
import DarkPoolPage from '@/pages/DarkPoolPage';
import InstitutionalTradingBotProfile from '@/pages/InstitutionalTradingBotProfile';
import MarketsPage from '@/pages/MarketsPage';
import BacktestingPage from '@/pages/BacktestingPage';
import HeatmapPage from '@/pages/HeatmapPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-screen bg-primary-bg">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/markets" element={<MarketsPage />} />
              <Route path="/markets/:category" element={<MarketCategory />} />
              <Route path="/asset/:symbol" element={<AssetDetail />} />
              <Route path="/news" element={<NewsHub />} />
              <Route path="/calendar" element={<EconomicCalendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ai-copilot" element={<AICopilotPage />} />
              <Route path="/ai-trading-bot" element={<AITradingBotPage />} />
              <Route path="/correlation-dashboard" element={<CorrelationDashboardPage />} />
              <Route path="/trade-journal" element={<TradeJournalPage />} />
              <Route path="/dark-pool" element={<DarkPoolPage />} />
              <Route path="/workspace/institutional" element={<InstitutionalTradingBotProfile />} />
              <Route path="/backtesting" element={<BacktestingPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
            </Routes>
          </main>
          <AIAssistant />
          <VoiceAssistant />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151',
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
