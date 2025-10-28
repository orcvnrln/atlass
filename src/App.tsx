import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PortfolioAnalysis from './pages/PortfolioAnalysis';
import InstitutionalBot from './pages/InstitutionalBot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/portfolio-analysis" element={<PortfolioAnalysis />} />
        <Route path="/institutional-bot" element={<InstitutionalBot />} />

        {/* AI Suite nested routes */}
        <Route path="/ai-suite">
          <Route index element={<Navigate to="/ai-suite/portfolio-analysis" />} />
          <Route path="portfolio-analysis" element={<PortfolioAnalysis />} />
          <Route path="institutional-bot" element={<InstitutionalBot />} />
        </Route>

        {/* Catch all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
