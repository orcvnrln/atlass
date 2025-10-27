import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from '@/components/layout/Sidebar';
import RouteDebugger from '@/components/debug/RouteDebugger';
import AIAssistant from '@/components/ai/AIAssistant';
import VoiceAssistant from '@/components/ai/VoiceAssistant';
import JarvisAICopilot from '@/components/ai/JarvisAICopilot';
import { Toaster } from 'react-hot-toast';

// Route-level code splitting
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
const InstitutionalTradingWorkspace = lazy(() => import('@/pages/InstitutionalTradingWorkspace'));
const MarketsPage = lazy(() => import('@/pages/MarketsPage'));
const BacktestingPage = lazy(() => import('@/pages/BacktestingPage'));
const HeatmapPage = lazy(() => import('@/pages/HeatmapPage'));
const PortfolioAnalysis = lazy(() => import('@/pages/portfolio-analysis'));
const VaRAnalysisPage = lazy(() => import('@/pages/portfolio-analysis/VaRAnalysisPage'));
const AssetAllocationDetailPage = lazy(() => import('@/pages/portfolio-analysis/AssetAllocationDetailPage'));
const AIInsightsDetailPage = lazy(() => import('@/pages/portfolio-analysis/AIInsightsDetailPage'));
const RiskAlertsDetailPage = lazy(() => import('@/pages/portfolio-analysis/RiskAlertsDetailPage'));
const NewsDetailPage = lazy(() => import('@/pages/portfolio-analysis/NewsDetailPage'));
const MarketScanner = lazy(() => import('@/pages/MarketScanner'));
const InstitutionalBot = lazy(() => import('@/pages/InstitutionalBot'));
const AISuitePage = lazy(() => import('@/pages/AISuitePage'));
const PaperTradingPage = lazy(() => import('@/pages/PaperTradingPage'));
const DerivativesChartPage = lazy(() => import('@/pages/DerivativesChartPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage'));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
        {process.env.NODE_ENV === 'development' && <RouteDebugger />}
        <div className="flex h-screen bg-primary-bg">
          <Sidebar />
          <main className="flex-1 overflow-y-auto lg:ml-64">
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
              <Routes>
<Route path="/" element={<Navigate to="/welcome" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/derivatives" element={<DerivativesChartPage />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/markets/:category" element={<MarketCategory />} />
                <Route path="/asset/:symbol" element={<AssetDetail />} />
                <Route path="/news" element={<NewsHub />} />
                <Route path="/calendar" element={<EconomicCalendar />} />
                <Route path="/economic-calendar" element={<EconomicCalendar />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/ai-copilot" element={<AICopilotPage />} />
                <Route path="/ai-trading-bot" element={<AITradingBotPage />} />
                <Route path="/correlation-dashboard" element={<CorrelationDashboardPage />} />
                <Route path="/correlation-matrix" element={<CorrelationDashboardPage />} />
                <Route path="/trade-journal" element={<TradeJournalPage />} />
                <Route path="/dark-pool" element={<DarkPoolPage />} />
                <Route path="/workspace/institutional" element={<InstitutionalTradingWorkspace />} />
                <Route path="/backtesting" element={<BacktestingPage />} />
                <Route path="/heatmap" element={<HeatmapPage />} />
                <Route path="/portfolio-analysis" element={<PortfolioAnalysis />} />
                <Route path="/portfolio-analysis/var-analysis" element={<VaRAnalysisPage />} />
                <Route path="/portfolio-analysis/asset-allocation-detail" element={<AssetAllocationDetailPage />} />
                <Route path="/portfolio-analysis/ai-insights" element={<AIInsightsDetailPage />} />
                <Route path="/portfolio-analysis/risk-alerts" element={<RiskAlertsDetailPage />} />
                <Route path="/portfolio-analysis/news" element={<NewsDetailPage />} />
                <Route path="/market-scanner" element={<MarketScanner />} />
                <Route path="/screener" element={<MarketScanner />} />
                <Route path="/institutional-bot" element={<InstitutionalBot />} />
                                <Route path="/ai-suite" element={<AISuitePage />} />
                <Route path="/paper-trading" element={<PaperTradingPage />} />
              </Routes>
            </Suspense>
          </main>
          <AIAssistant />
          <VoiceAssistant />
          <JarvisAICopilot />
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
