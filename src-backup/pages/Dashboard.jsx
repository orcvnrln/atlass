import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Shield, Zap, Activity, Brain, AlertTriangle, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  // Mock portfolio data
  const portfolio = [
    { title: 'Portfolio Value', value: '$1,231,269.93', change: '+$1,220.36', changePercent: '+0.10%', positive: true },
    { title: 'Daily P&L', value: '+$1,220.36', change: '+0.10%', changePercent: '+0.10%', positive: true },
    { title: 'Win Rate', value: '78%', change: '+1.2%', changePercent: '+1.2%', positive: true },
    { title: 'Risk Score', value: '6.08', change: 'Medium', changePercent: 'Medium', positive: false }
  ];

  // Mock macro data
  const macro = [
    { title: 'US 10Y Yield', value: '4.25%', change: '+2bps', icon: BarChart3, positive: true },
    { title: 'VIX', value: '14.5', change: '-0.5', icon: AlertTriangle, positive: false },
    { title: 'CPI (YoY)', value: '3.2%', change: '+0.1%', icon: TrendingUp, positive: true },
    { title: 'Fed Funds Rate', value: '5.50%', change: 'Stable', icon: Target, positive: null }
  ];

  // Mock heatmap data
  const heatmap = [
    { symbol: 'EUR/USD', price: '1.0855', change: '+0.0015', percent: '+0.14%', positive: true },
    { symbol: 'GBP/USD', price: '1.2640', change: '+0.0020', percent: '+0.16%', positive: true },
    { symbol: 'USD/JPY', price: '149.25', change: '-0.25', percent: '-0.16%', positive: false },
    { symbol: 'BTC/USD', price: '$68,500', change: '+$1,200', percent: '+1.78%', positive: true },
    { symbol: 'SPX500', price: '5,300', change: '+25', percent: '+0.47%', positive: true },
    { symbol: 'EUR/JPY', price: '162.05', change: '+0.15', percent: '+0.09%', positive: true }
  ];

  // AI Co-Pilot insights
  const aiInsights = [
    { type: 'Signal', message: 'Strong BUY signal detected on EUR/USD. RSI oversold, bullish divergence confirmed.', confidence: 87 },
    { type: 'Risk', message: 'High volatility expected in USD/JPY due to BoJ intervention rumors.', confidence: 74 },
    { type: 'Opportunity', message: 'Gold showing strong support at $2,650. Consider long positions.', confidence: 92 },
    { type: 'Alert', message: 'Fed speech at 2:00 PM EST may impact DXY significantly.', confidence: 95 }
  ];

  const PortfolioCard = ({ item }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{item.title}</h3>
        <div className={`flex items-center gap-1 ${item.positive ? 'text-green-400' : item.positive === false ? 'text-red-400' : 'text-gray-400'}`}>
          {item.positive === true && <TrendingUp size={14} />}
          {item.positive === false && <TrendingDown size={14} />}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
          <p className={`text-sm font-semibold ${item.positive ? 'text-green-400' : item.positive === false ? 'text-red-400' : 'text-yellow-400'}`}>
            {item.change}
          </p>
        </div>
      </div>
    </div>
  );

  const MacroCard = ({ item }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${item.positive === true ? 'bg-green-500/20' : item.positive === false ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
            <item.icon size={20} className={item.positive === true ? 'text-green-400' : item.positive === false ? 'text-red-400' : 'text-blue-400'} />
          </div>
          <h3 className="text-sm font-medium text-gray-400">{item.title}</h3>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-white">{item.value}</p>
        <p className={`text-sm font-semibold ${item.positive === true ? 'text-green-400' : item.positive === false ? 'text-red-400' : 'text-gray-400'}`}>
          {item.change}
        </p>
      </div>
    </div>
  );

  const HeatmapCard = ({ item }) => (
    <div className={`bg-gray-900 border rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer ${
      item.positive ? 'border-green-800 hover:border-green-700' : 'border-red-800 hover:border-red-700'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-white">{item.symbol}</h4>
        <div className={`flex items-center gap-1 ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
          {item.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
      </div>
      <p className="text-lg font-mono text-gray-300 mb-1">{item.price}</p>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
          {item.change}
        </span>
        <span className={`text-xs ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
          {item.percent}
        </span>
      </div>
    </div>
  );

  const AIInsightCard = ({ insight }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            insight.type === 'Signal' ? 'bg-green-400' :
            insight.type === 'Risk' ? 'bg-red-400' :
            insight.type === 'Opportunity' ? 'bg-blue-400' : 'bg-yellow-400'
          }`}></div>
          <span className="text-xs font-semibold text-gray-400 uppercase">{insight.type}</span>
        </div>
        <span className="text-xs text-gray-500">Confidence: {insight.confidence}%</span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{insight.message}</p>
    </div>
  );

  return (
    <div className="bg-gray-950 min-h-screen text-gray-200 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Trading Dashboard</h1>
        <p className="text-gray-400">Real-time market overview and portfolio analytics</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {portfolio.map((item, index) => (
          <PortfolioCard key={index} item={item} />
        ))}
      </div>

      {/* Macro Dashboard */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={24} className="text-blue-400" />
          Macro Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {macro.map((item, index) => (
            <MacroCard key={index} item={item} />
          ))}
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Heatmap */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={24} className="text-green-400" />
            Market Heatmap
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {heatmap.map((item, index) => (
              <HeatmapCard key={index} item={item} />
            ))}
          </div>
        </div>

        {/* AI Co-Pilot */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Brain size={24} className="text-purple-400" />
            AI Co-Pilot
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Live Market Insights</h3>
              <p className="text-sm text-gray-400 mb-4">AI-powered analysis and recommendations</p>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
              {aiInsights.map((insight, index) => (
                <AIInsightCard key={index} insight={insight} />
              ))}
            </div>

            {/* AI Mentor Mode */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-semibold text-white mb-2">AI Mentor Mode</h4>
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-300 mb-2">
                  💡 <strong>Today's Focus:</strong> Monitor EUR/USD for potential breakout above 1.0870 resistance.
                </p>
                <p className="text-xs text-gray-400">
                  Risk management: Keep position sizes under 2% per trade during high volatility periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;