import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import WelcomePage from './pages/WelcomePage.tsx';
import Dashboard from './pages/Dashboard.jsx';
import PortfolioAnalysis from './pages/portfolio-analysis';
import InstitutionalBot from './pages/InstitutionalBot';
import AssetAllocationDetail from './pages/AssetAllocationDetail';
import AssetAllocationPage from './pages/portfolio-analysis/AssetAllocationPage';
import AITradingDashboard from './pages/AITradingDashboard';
import ProtectedLayout from './components/layout/ProtectedLayout';

function App() {
  // Use HashRouter in production by default to support static hosting without server-side rewrites
  const RouterComponent = (import.meta.env?.VITE_USE_HASH === 'true' || import.meta.env?.MODE === 'production')
    ? HashRouter
    : BrowserRouter;

  return (
    <RouterComponent>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/training" element={<WelcomePage mode="training" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio-analysis" element={<PortfolioAnalysis />} />
            <Route path="/institutional-bot" element={<InstitutionalBot />} />
            <Route path="/asset-allocation-detail" element={<AssetAllocationDetail />} />
            <Route path="/portfolio-analysis/asset-allocation" element={<AssetAllocationPage />} />
            <Route path="/ai-trading" element={<AITradingDashboard />} />
            <Route path="/ai-suite" element={<Navigate to="/ai-suite/portfolio-analysis" replace />} />
            <Route path="/ai-suite/portfolio-analysis" element={<PortfolioAnalysis />} />
            <Route path="/ai-suite/institutional-bot" element={<InstitutionalBot />} />
            <Route path="/ai-suite/ai-trading" element={<AITradingDashboard />} />
          </Route>

          {/* Catch all route for 404 */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </RouterComponent>
  );
}

export default App;
