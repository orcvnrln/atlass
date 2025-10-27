import React, { useState } from 'react';
import { ArrowLeft, TrendingDown, AlertTriangle, BarChart3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
// Temporary calculation function
const calculateVaR = (confidence: number = 0.95) => 3450 * (confidence === 0.99 ? 1.5 : 1);
import { formatCurrency, formatPercentage } from './utils/formatters';
import { historicalPerformance, keyMetrics } from './utils/mockData';

const VaRAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  const [timeHorizon, setTimeHorizon] = useState(1);
  
  const var95 = calculateVaR(confidenceLevel);
  const var99 = calculateVaR(0.99);
  
  // Generate VaR history data
  const varHistory = historicalPerformance.slice(-30).map((day, i) => ({
    date: day.date,
    var95: var95 * (0.8 + Math.random() * 0.4), // Simulate VaR fluctuation
    var99: var99 * (0.8 + Math.random() * 0.4),
    portfolioValue: day.portfolioValue,
  }));

  return (
    <div className="min-h-screen bg-[#0f1419] text-[#f7fafc] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/portfolio-analysis')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Value at Risk (VaR) Analysis</h1>
          <p className="text-[#a0aec0] mt-1">Comprehensive risk assessment and scenario modeling</p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown className="w-6 h-6 text-[#f56565]" />
            <span className="text-sm text-[#a0aec0]">1-Day VaR (95%)</span>
          </div>
          <p className="text-2xl font-bold text-[#f56565]">{formatCurrency(var95)}</p>
          <p className="text-sm text-[#718096] mt-1">{formatPercentage((var95/keyMetrics.totalValue)*100)} of portfolio</p>
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-[#ed8936]" />
            <span className="text-sm text-[#a0aec0]">1-Day VaR (99%)</span>
          </div>
          <p className="text-2xl font-bold text-[#ed8936]">{formatCurrency(var99)}</p>
          <p className="text-sm text-[#718096] mt-1">Extreme scenario</p>
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-[#4299e1]" />
            <span className="text-sm text-[#a0aec0]">Expected Shortfall</span>
          </div>
          <p className="text-2xl font-bold text-[#4299e1]">{formatCurrency(var95 * 1.3)}</p>
          <p className="text-sm text-[#718096] mt-1">Conditional VaR</p>
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-[#9f7aea]" />
            <span className="text-sm text-[#a0aec0]">Breach Probability</span>
          </div>
          <p className="text-2xl font-bold text-[#9f7aea]">5.2%</p>
          <p className="text-sm text-[#718096] mt-1">Historical frequency</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* VaR History Chart */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">VaR Historical Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={varHistory}>
                  <defs>
                    <linearGradient id="var95Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f56565" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f56565" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="var99Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ed8936" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ed8936" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="date" stroke="#a0aec0" fontSize={12} />
                  <YAxis stroke="#a0aec0" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1f2e', 
                      border: '1px solid #2d3748',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="var95" stroke="#f56565" fill="url(#var95Gradient)" name="VaR 95%" />
                  <Area type="monotone" dataKey="var99" stroke="#ed8936" fill="url(#var99Gradient)" name="VaR 99%" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Decomposition */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Risk Contribution by Asset</h3>
            <div className="space-y-4">
              {[
                { name: 'Bitcoin (BTC)', contribution: 35.4, var: var95 * 0.354, color: '#f7931a' },
                { name: 'Ethereum (ETH)', contribution: 28.2, var: var95 * 0.282, color: '#627eea' },
                { name: 'S&P 500 (SPY)', contribution: 18.7, var: var95 * 0.187, color: '#4299e1' },
                { name: 'Tesla (TSLA)', contribution: 12.1, var: var95 * 0.121, color: '#e31937' },
                { name: 'Others', contribution: 5.6, var: var95 * 0.056, color: '#718096' },
              ].map((asset) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <span className="text-[#f7fafc]">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#f7fafc] font-semibold">{formatCurrency(asset.var)}</p>
                    <p className="text-sm text-[#a0aec0]">{asset.contribution.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Controls & Analysis */}
        <div className="space-y-6">
          
          {/* VaR Configuration */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">VaR Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a0aec0] mb-2">Confidence Level</label>
                <select 
                  value={confidenceLevel} 
                  onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  className="w-full bg-[#242938] border border-[#2d3748] rounded-lg p-2 text-[#f7fafc]"
                >
                  <option value={0.90}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={0.99}>99%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#a0aec0] mb-2">Time Horizon (Days)</label>
                <select 
                  value={timeHorizon} 
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full bg-[#242938] border border-[#2d3748] rounded-lg p-2 text-[#f7fafc]"
                >
                  <option value={1}>1 Day</option>
                  <option value={5}>5 Days</option>
                  <option value={10}>10 Days</option>
                  <option value={22}>1 Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Risk Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#f56565]/10 border border-[#f56565]/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[#f56565] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#f56565]">High Concentration Risk</p>
                  <p className="text-xs text-[#a0aec0] mt-1">Crypto assets represent 64% of total VaR</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#ed8936]/10 border border-[#ed8936]/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-[#ed8936] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#ed8936]">Volatility Spike</p>
                  <p className="text-xs text-[#a0aec0] mt-1">VaR increased 15% in last 5 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Risk Management</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">Set VaR Limits</Button>
              <Button variant="secondary" className="w-full">Generate Risk Report</Button>
              <Button variant="secondary" className="w-full">Configure Alerts</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaRAnalysisPage;
