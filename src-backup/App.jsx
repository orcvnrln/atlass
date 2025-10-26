import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Dashboard from '@/pages/Dashboard';
import Portfolio from '@/pages/Portfolio';
import Watchlist from '@/pages/Watchlist';
import NewsHub from '@/pages/NewsHub';
import EconomicCalendar from '@/pages/EconomicCalendar';
import Settings from '@/pages/Settings';
import MarketCategory from '@/pages/MarketCategory';
import AssetDetail from '@/pages/AssetDetail';
import AIAssistant from '@/components/ai/AIAssistant';
import VoiceAssistant from '@/components/ai/VoiceAssistant';
import AICopilotPage from '@/pages/AICopilotPage';
import WorkspacePage from '@/pages/WorkspacePage';
import CorrelationDashboardPage from '@/pages/CorrelationDashboardPage';
import TradeJournalPage from '@/pages/TradeJournalPage';
import DarkPoolPage from '@/pages/DarkPoolPage';
import MobileProWrapper from '@/components/layout/mobile/MobileProWrapper';
import ChartPage from '@/pages/ChartPage';
import DerivativesChartPage from '@/pages/DerivativesChartPage';
import NewsDetailView from '@/pages/NewsDetailView';
import ErrorHandlingExamples from '@/components/examples/ErrorHandlingExamples';
import { JournalProvider } from './context/JournalContext';
import { ToastProvider } from './components/ui/toast';
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/errors/ErrorBoundary';


function App() {
  return (
    <ErrorProvider>
      <ToastProvider>
        <JournalProvider>
          <Router>
            <ErrorBoundary>
              <div className="flex bg-primary-bg min-h-screen theme-dark">
                <Sidebar />
                <main className="flex-1 lg:ml-64">
                  <Navbar />
                  <MobileProWrapper>
                    <div className="pt-16">
                      <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio-analysis" element={<Portfolio />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/news" element={<NewsHub />} />
                    <Route path="/news/:newsId" element={<NewsDetailView />} />
                    <Route path="/calendar" element={<EconomicCalendar />} />
                    <Route path="/economic-calendar" element={<EconomicCalendar />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/markets/:category" element={<MarketCategory />} />
                    <Route path="/asset/:symbol" element={<AssetDetail />} />
                    <Route path="/ai-copilot" element={<AICopilotPage />} />
                    <Route path="/workspace" element={<WorkspacePage />} />
                    <Route path="/correlation" element={<CorrelationDashboardPage />} />
                    <Route path="/correlation-matrix" element={<CorrelationDashboardPage />} />
                    <Route path="/journal" element={<TradeJournalPage />} />
                    <Route path="/trade-journal" element={<TradeJournalPage />} />
                    <Route path="/dark-pool" element={<DarkPoolPage />} />
                    <Route path="/charts" element={<ChartPage />} />
                    <Route path="/charts/:symbol" element={<ChartPage />} />
                    <Route path="/derivatives" element={<DerivativesChartPage />} />
                    <Route path="/error-examples" element={<ErrorHandlingExamples />} />
                  </Routes>
                </div>
              </MobileProWrapper>
            </main>
            <AIAssistant />
            <VoiceAssistant />
          </div>
            </ErrorBoundary>
          </Router>
        </JournalProvider>
      </ToastProvider>
    </ErrorProvider>
  )
}

export default App;