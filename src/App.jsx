import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from '@/components/layout/Sidebar';
import AIAssistant from '@/components/ai/AIAssistant';
import VoiceAssistant from '@/components/ai/VoiceAssistant';
import { Toaster } from 'react-hot-toast';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Portfolio = lazy(() => import('@/pages/Portfolio_NEW_FIXED'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const NewsHub = lazy(() => import('@/pages/NewsHub'));
const EconomicCalendar = lazy(() => import('@/pages/EconomicCalendar'));
const Settings = lazy(() => import('@/pages/Settings'));
const MarketCategory = lazy(() => import('@/pages/MarketCategory'));
const AssetDetail = lazy(() => import('@/pages/AssetDetail'));
const AICopilotPage = lazy(() => import('@/pages/AICopilotPage'));
const AITradingBotPage = lazy(() => import('@/pages/AITradingBotPage'));
const CorrelationDashboardPage = lazy(() => import('@/pages/CorrelationDashboardPage'));
const TradeJournalPage = lazy(() => import('@/pages/TradeJournalPage'));
const DarkPoolPage = lazy(() => import('@/pages/DarkPoolPage'));
const InstitutionalTradingBotProfile = lazy(() => import('@/pages/InstitutionalTradingBotProfile'));
const MarketsPage = lazy(() => import('@/pages/MarketsPage'));
const BacktestingPage = lazy(() => import('@/pages/BacktestingPage'));
const HeatmapPage = lazy(() => import('@/pages/HeatmapPage'));
const MarketScanner = lazy(() => import('@/pages/MarketScanner'));
const InstitutionalBot = lazy(() => import('@/pages/InstitutionalBot'));
const PaperTradingPage = lazy(() => import('@/pages/PaperTradingPage'));
const DerivativesChartPage = lazy(() => import('@/pages/DerivativesChartPage'));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="flex h-screen bg-primary-bg">
            <Sidebar />
            <main className="flex-1 overflow-y-auto lg:ml-64">
              <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/markets" element={<MarketsPage />} />
                  <Route path="/markets/:category" element={<MarketCategory />} />
                  <Route path="/news" element={<NewsHub />} />
                  <Route path="/calendar" element={<EconomicCalendar />} />

                  <Route path="/trade-journal" element={<TradeJournalPage />} />
                  <Route path="/market-scanner" element={<MarketScanner />} />
                  <Route path="/dark-pool" element={<DarkPoolPage />} />
                  <Route path="/derivatives" element={<DerivativesChartPage />} />
                  <Route path="/heatmap" element={<HeatmapPage />} />

                  <Route path="/ai-suite" element={<AICopilotPage />} />
                  <Route path="/ai-copilot" element={<AICopilotPage />} />
                  <Route path="/ai-trading-bot" element={<AITradingBotPage />} />

                  <Route path="/portfolio-analysis" element={<Portfolio />} />
                  <Route path="/correlation-dashboard" element={<CorrelationDashboardPage />} />
                  <Route path="/correlation-matrix" element={<CorrelationDashboardPage />} />

                  <Route path="/institutional-bot" element={<InstitutionalBot />} />

                  <Route path="/backtesting" element={<BacktestingPage />} />
                  <Route path="/paper-trading" element={<PaperTradingPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Settings />} />
                  <Route path="/asset/:symbol" element={<AssetDetail />} />

                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </main>
            <AIAssistant />
            <VoiceAssistant />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#F9FAFB',
                border: '1px solid #374151',
              },
            }}
            containerStyle={{
              bottom: 24,
              right: 24,
              zIndex: 9999,
            }}
          />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
