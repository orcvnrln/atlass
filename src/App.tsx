import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import MarketsPage from './pages/MarketsPage';
import NewsHub from './pages/NewsHub';
import EconomicCalendar from './pages/EconomicCalendar';
import TradeJournalPage from './pages/TradeJournalPage';
import MarketScanner from './pages/MarketScanner';
import DarkPoolPage from './pages/DarkPoolPage';
import DerivativesChartPage from './pages/DerivativesChartPage';
import HeatmapPage from './pages/HeatmapPage';
import AICopilotPage from './pages/AICopilotPage';
import AITradingBotPage from './pages/AITradingBotPage';
import PortfolioAnalysis from './pages/PortfolioAnalysis';
import CorrelationDashboardPage from './pages/CorrelationDashboardPage';
import InstitutionalBot from './pages/InstitutionalBot';
import BacktestingPage from './pages/BacktestingPage';
import PaperTradingPage from './pages/PaperTradingPage';
import Settings from './pages/Settings';
import HelpPage from './pages/HelpPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/news" element={<NewsHub />} />
          <Route path="/calendar" element={<EconomicCalendar />} />
          <Route path="/trade-journal" element={<TradeJournalPage />} />
          <Route path="/market-scanner" element={<MarketScanner />} />
          <Route path="/dark-pool" element={<DarkPoolPage />} />
          <Route path="/derivatives" element={<DerivativesChartPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/ai-copilot" element={<AICopilotPage />} />
          <Route path="/ai-trading-bot" element={<AITradingBotPage />} />
          <Route path="/portfolio-analysis" element={<PortfolioAnalysis />} />
          <Route path="/correlation-matrix" element={<CorrelationDashboardPage />} />
          <Route path="/institutional-bot" element={<InstitutionalBot />} />
          <Route path="/backtesting" element={<BacktestingPage />} />
          <Route path="/paper-trading" element={<PaperTradingPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpPage />} />

          {/* AI Suite nested routes */}
          <Route path="/ai-suite">
            <Route index element={<Navigate to="/ai-suite/portfolio-analysis" />} />
            <Route path="portfolio-analysis" element={<PortfolioAnalysis />} />
            <Route path="institutional-bot" element={<InstitutionalBot />} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
