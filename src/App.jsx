import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from '@/components/layout/Sidebar';
import RouteDebugger from '@/components/debug/RouteDebugger';
import RouteTracker from '@/components/debug/RouteTracker';
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
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const MarketScannerPage = lazy(() => import('@/pages/MarketScanner'));

function App() {
  const [key, setKey] = useState(0);

  const handleRestart = () => {
    // Clear any cached data or local storage if needed
    localStorage.clear();
    sessionStorage.clear();
    // Force re-mount of entire app
    setKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    // Add global method to window for emergency restart
    window.restartApp = handleRestart;

    // Add keyboard shortcut (Ctrl + Shift + R) to restart
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router key={key}>
          {process.env.NODE_ENV === 'development' && (
            <>
              <RouteDebugger />
              <RouteTracker />
            </>
          )}
          <div className="flex h-screen bg-primary-bg">
            <Sidebar />
            <main className="flex-1 overflow-y-auto lg:ml-64">
              <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
                <Routes>
                  {/* Initial route - redirects to dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  
                  {/* Main Navigation Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/markets" element={<MarketsPage />} />
                  <Route path="/markets/:category" element={<MarketCategory />} />
                  <Route path="/news" element={<NewsHub />} />
                  <Route path="/calendar" element={<EconomicCalendar />} />
                  <Route path="/economic-calendar" element={<EconomicCalendar />} />

                  {/* Trading Tools Routes */}
                  <Route path="/trade-journal" element={<TradeJournalPage />} />
                  <Route path="/market-scanner" element={<MarketScanner />} />
                  <Route path="/screener" element={<MarketScanner />} />
                  <Route path="/dark-pool" element={<DarkPoolPage />} />
                  <Route path="/derivatives" element={<DerivativesChartPage />} />
                  <Route path="/heatmap" element={<HeatmapPage />} />
                  
                  {/* AI Features */}
                  <Route path="/ai-suite" element={<AISuitePage />} />
                  <Route path="/ai-copilot" element={<AICopilotPage />} />
                  <Route path="/ai-trading-bot" element={<AITradingBotPage />} />
                  
                  {/* Analysis Tools */}
                  <Route path="/portfolio-analysis/*">
                    <Route index element={<PortfolioAnalysis />} />
                    <Route path="var-analysis" element={<VaRAnalysisPage />} />
                    <Route path="asset-allocation-detail" element={<AssetAllocationDetailPage />} />
                    <Route path="ai-insights" element={<AIInsightsDetailPage />} />
                    <Route path="risk-alerts" element={<RiskAlertsDetailPage />} />
                    <Route path="news" element={<NewsDetailPage />} />
                  </Route>
                  <Route path="/correlation-dashboard" element={<CorrelationDashboardPage />} />
                  <Route path="/correlation-matrix" element={<CorrelationDashboardPage />} />

                  {/* Institutional Features */}
                  <Route path="/institutional-bot" element={<InstitutionalBot />} />
                  <Route path="/workspace/institutional" element={<InstitutionalTradingWorkspace />} />
                  
                  {/* Tools & Settings */}
                  <Route path="/backtesting" element={<BacktestingPage />} />
                  <Route path="/paper-trading" element={<PaperTradingPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="/asset/:symbol" element={<AssetDetail />} />
                  
                  {/* Fallback route - redirects to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
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
