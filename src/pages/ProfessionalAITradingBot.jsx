import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Bot,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  BarChart3,
  Brain,
  Target,
  DollarSign,
  Zap,
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Settings,
  BookOpen,
  Award,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfessionalAITradingBot = () => {
  const [botStatus, setBotStatus] = useState('active');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Performance Metrics (Linda Raschke + Trongone)
  const [performance, setPerformance] = useState({
    dailyPnL: 2847.32,
    weeklyPnL: 12450.75,
    monthlyPnL: 45230.18,
    winRate: 78.5,
    avgRR: 1.85,
    sharpeRatio: 1.85,
    maxDrawdown: -8.2,
    profitFactor: 2.3,
    expectancy: 156.75,
    totalTrades: 156,
    winningTrades: 122,
    losingTrades: 34
  });

  // Risk Management (Linda Raschke Rules)
  const [riskMetrics, setRiskMetrics] = useState({
    riskUtilization: 65.2,
    dailyLossLimit: 1000,
    dailyLossUsed: 650,
    maxPositions: 5,
    currentPositions: 3,
    riskPerTrade: 1.5, // 1-2% per trade rule
    emergencyStopActive: false
  });

  // Professional Trading Setups (Book-Based)
  const [professionalSetups, setProfessionalSetups] = useState([
    {
      id: 1,
      name: 'Trend-Follow Breakout',
      symbol: 'EUR/USD',
      timeframe: '4H',
      score: 92,
      lastResult: 'Win',
      riskPercent: 1.5,
      enabled: true,
      source: 'Linda Raschke',
      description: '4H range breakout + volume > 1.5x avg',
      entry: 'Breakout above 20EMA + volume spike',
      stop: 'Below breakout candle low',
      target: '1.5-3x ATR',
      confidence: 92
    },
    {
      id: 2,
      name: 'VWAP Pullback',
      symbol: 'GBP/USD',
      timeframe: '1H',
      score: 87,
      lastResult: 'Win',
      riskPercent: 1.2,
      enabled: true,
      source: 'Python for Finance',
      description: 'Price retests VWAP in uptrend + rejection',
      entry: 'Pullback to VWAP with rejection candle',
      stop: 'Below VWAP by 1.5x ATR',
      target: '2x RR minimum',
      confidence: 87
    },
    {
      id: 3,
      name: 'Liquidity Sweep',
      symbol: 'USD/JPY',
      timeframe: '15m',
      score: 84,
      lastResult: 'Loss',
      riskPercent: 0.8,
      enabled: false,
      source: 'Linda Raschke',
      description: 'False break + strong reversal',
      entry: 'Liquidity pool sweep + reversal candle',
      stop: 'Below wick low',
      target: '2-3x RR',
      confidence: 84
    },
    {
      id: 4,
      name: 'Mean Reversion Range',
      symbol: 'GBP/JPY',
      timeframe: '1H',
      score: 81,
      lastResult: 'Win',
      riskPercent: 1.0,
      enabled: true,
      source: 'Trongone',
      description: 'Channel edge + RSI extreme',
      entry: 'Price at channel edge + rejection',
      stop: 'Outside range boundary',
      target: 'Opposite channel edge',
      confidence: 81
    }
  ]);

  // AI Insights (Real-time commentary)
  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: 'signal',
      timestamp: new Date(Date.now() - 300000),
      message: 'EUR/USD 4H: Breakout above 1.0920 confirmed by volume spike (1.8x avg). FVG fill complete.',
      confidence: 92,
      action: 'BUY',
      source: 'Linda Raschke Methodology'
    },
    {
      id: 2,
      type: 'risk',
      timestamp: new Date(Date.now() - 600000),
      message: 'Portfolio risk at 65.2%. Reduce new positions by 20%.',
      confidence: 95,
      action: 'REDUCE',
      source: 'Risk Management Protocol'
    },
    {
      id: 3,
      type: 'info',
      timestamp: new Date(Date.now() - 900000),
      message: 'GBP/USD VWAP pullback setup triggered. Entry conditions met.',
      confidence: 87,
      action: 'WATCH',
      source: 'Python for Finance'
    }
  ]);

  // Trade Log (Linda Raschke - Keep records)
  const [tradeLog, setTradeLog] = useState([
    { id: 1, time: '16:42:15', pnl: 247.50, result: 'Win', setup: 'Trend-Follow' },
    { id: 2, time: '16:38:22', pnl: -89.25, result: 'Loss', setup: 'VWAP Pullback' },
    { id: 3, time: '16:35:10', pnl: 156.75, result: 'Win', setup: 'Liquidity Sweep' },
    { id: 4, time: '16:28:45', pnl: 312.80, result: 'Win', setup: 'Mean Reversion' },
    { id: 5, time: '16:15:30', pnl: -45.60, result: 'Loss', setup: 'Trend-Follow' }
  ]);

  useEffect(() => {
    // Real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());

      // Simulate metric updates
      if (Math.random() > 0.7) {
        setPerformance(prev => ({
          ...prev,
          dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 100
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-400 bg-green-600/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-600/20';
    return 'text-red-400 bg-red-600/20';
  };

  const handleEmergencyStop = () => {
    setRiskMetrics(prev => ({ ...prev, emergencyStopActive: true, currentPositions: 0 }));
    setBotStatus('stopped');
  };

  const generateTop10Setups = () => {
    setBotStatus('analyzing');
    setTimeout(() => {
      setBotStatus('active');
      // Add new AI insight
      setAiInsights(prev => [{
        id: Date.now(),
        type: 'success',
        timestamp: new Date(),
        message: 'Top 10 setups generated successfully. 3 high-confidence setups identified (score > 85).',
        confidence: 100,
        action: 'READY',
        source: 'AI Analysis Engine'
      }, ...prev]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Helmet>
        <title>Qwen3-Max • AI Trading Lab - Professional Trading System</title>
        <meta name="description" content="Professional AI trading system based on Linda Raschke, Anthony Trongone, and institutional trading principles" />
      </Helmet>

      {/* HEADER & STATUS BAR (Full Width) */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-[#3b82f6]/30 px-6 py-4">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Qwen3-Max • AI Trading Lab
                  <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full border border-purple-500/30">
                    Professional Edition
                  </span>
                </h1>
                <p className="text-sm text-gray-400 italic">
                  "Plan your trades. Trade your plan." — Linda Raschke
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-blue-600/30">
                <BookOpen className="w-4 h-4 mr-2" />
                Trading Rules
              </Button>
              <Button variant="outline" size="sm" className="border-blue-600/30">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Last Run:</span>
              <span className="text-white font-medium">{lastUpdate.toLocaleTimeString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${botStatus === 'active' ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${botStatus === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                {botStatus.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Win Rate:</span>
              <span className="text-green-400 font-medium">{performance.winRate}%</span>
            </div>

            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Max DD:</span>
              <span className="text-yellow-400 font-medium">{performance.maxDrawdown}%</span>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Sharpe:</span>
              <span className="text-blue-400 font-medium">{performance.sharpeRatio}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-COLUMN LAYOUT */}
      <div className="max-w-[1920px] mx-auto flex gap-6 p-6">

        {/* COLUMN 1: PERFORMANCE & RISK (25%) */}
        <div className="w-1/4 space-y-6">
          {/* Performance Snapshot */}
          <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Performance Snapshot</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">P&L (24h)</span>
                  <span className={`text-lg font-bold ${performance.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {performance.dailyPnL >= 0 ? '+' : ''}${performance.dailyPnL.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1e293b] rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                  <div className="text-xl font-bold text-green-400">{performance.winRate}%</div>
                </div>
                <div className="bg-[#1e293b] rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Avg RR</div>
                  <div className="text-xl font-bold text-blue-400">{performance.avgRR}</div>
                </div>
                <div className="bg-[#1e293b] rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Sharpe</div>
                  <div className="text-xl font-bold text-purple-400">{performance.sharpeRatio}</div>
                </div>
                <div className="bg-[#1e293b] rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Max DD</div>
                  <div className="text-xl font-bold text-yellow-400">{performance.maxDrawdown}%</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1e293b]">
                <div className="text-xs text-gray-400 mb-2">
                  Expectancy = (Win% × Avg Win) – (Loss% × Avg Loss)
                </div>
                <div className="text-lg font-bold text-green-400">
                  ${performance.expectancy.toFixed(2)} per trade
                </div>
                <div className="text-xs text-gray-500 italic mt-1">
                  Source: Trade with the Odds (Trongone)
                </div>
              </div>
            </div>
          </div>

          {/* Risk Controls */}
          <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-white">Risk Controls</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Risk Utilization</span>
                  <span className="text-sm font-bold text-yellow-400">{riskMetrics.riskUtilization}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${riskMetrics.riskUtilization}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Daily Loss Limit</span>
                  <span className="text-xs font-medium text-white">
                    ${riskMetrics.dailyLossUsed} / ${riskMetrics.dailyLossLimit}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(riskMetrics.dailyLossUsed / riskMetrics.dailyLossLimit) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <div className="text-xs text-blue-400 font-medium mb-1">Linda Raschke Rule</div>
                <div className="text-xs text-gray-300">
                  "Never risk more than 1–2% per trade"
                </div>
                <div className="text-sm font-bold text-white mt-2">
                  Current: {riskMetrics.riskPerTrade}% per trade
                </div>
              </div>

              <Button
                onClick={handleEmergencyStop}
                disabled={riskMetrics.emergencyStopActive}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                {riskMetrics.emergencyStopActive ? 'STOPPED' : 'Emergency Stop'}
              </Button>
            </div>
          </div>
        </div>

        {/* COLUMN 2: ACTIVE SETUPS (50%) */}
        <div className="w-1/2 space-y-6">
          <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Active Trading Setups</h3>
                <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
                  {professionalSetups.filter(s => s.enabled).length} Active
                </span>
              </div>

              <Button
                onClick={generateTop10Setups}
                disabled={botStatus === 'analyzing'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${botStatus === 'analyzing' ? 'animate-spin' : ''}`} />
                Generate Top 10
              </Button>
            </div>

            {/* Setups Table */}
            <div className="overflow-hidden rounded-lg border border-[#1e293b]">
              {/* Table Header */}
              <div className="grid grid-cols-8 gap-3 p-3 bg-[#1e293b] text-xs font-semibold text-gray-400 border-b border-[#374151]">
                <div className="col-span-2">SETUP NAME</div>
                <div>SYMBOL</div>
                <div>TF</div>
                <div>SCORE</div>
                <div>LAST</div>
                <div>RISK%</div>
                <div>STATUS</div>
              </div>

              {/* Table Rows */}
              {professionalSetups.map((setup) => (
                <motion.div
                  key={setup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-8 gap-3 p-3 border-b border-[#1e293b] hover:bg-[#1e293b]/50 transition-colors group"
                >
                  <div className="col-span-2">
                    <div className="font-medium text-white">{setup.name}</div>
                    <div className="text-xs text-gray-400 italic">{setup.source}</div>
                  </div>
                  <div className="text-blue-400 font-medium">{setup.symbol}</div>
                  <div className="text-gray-300">{setup.timeframe}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(setup.score)}`}>
                      {setup.score}
                    </span>
                  </div>
                  <div>
                    {setup.lastResult === 'Win' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-gray-300">{setup.riskPercent}%</div>
                  <div>
                    <button
                      onClick={() => {
                        setProfessionalSetups(prev => prev.map(s =>
                          s.id === setup.id ? { ...s, enabled: !s.enabled } : s
                        ));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        setup.enabled
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {setup.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Setup Details (Expandable) */}
            <div className="mt-6 space-y-3">
              <div className="text-sm font-semibold text-gray-400 mb-3">SETUP METHODOLOGY</div>
              {professionalSetups.filter(s => s.enabled).map((setup) => (
                <div key={setup.id} className="bg-[#1e293b] rounded-lg p-4 border border-[#374151]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${setup.enabled ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="font-bold text-white">{setup.name}</span>
                      <span className="text-xs text-gray-400">({setup.symbol} • {setup.timeframe})</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(setup.score)}`}>
                      Confidence: {setup.confidence}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-gray-400 mb-1">Entry:</div>
                      <div className="text-gray-300">{setup.entry}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Stop:</div>
                      <div className="text-gray-300">{setup.stop}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Target:</div>
                      <div className="text-gray-300">{setup.target}</div>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-blue-600/10 border border-blue-600/20 rounded">
                    <div className="text-xs text-blue-400 font-medium">Source: {setup.source}</div>
                    <div className="text-xs text-gray-300 mt-1">{setup.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Quote */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-300 italic mb-2">
                    "The best trades work immediately. If not, exit."
                  </div>
                  <div className="text-xs text-gray-400">
                    — Linda Raschke, Professional Trading Techniques
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: AI INSIGHTS & TRADE LOG (25%) */}
        <div className="w-1/4 space-y-6">
          {/* AI Insights */}
          <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">AI Insights</h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {aiInsights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border ${
                    insight.type === 'signal' ? 'bg-blue-600/10 border-blue-600/30' :
                    insight.type === 'risk' ? 'bg-red-600/10 border-red-600/30' :
                    insight.type === 'success' ? 'bg-green-600/10 border-green-600/30' :
                    'bg-gray-600/10 border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      insight.type === 'signal' ? 'bg-blue-600 text-white' :
                      insight.type === 'risk' ? 'bg-red-600 text-white' :
                      insight.type === 'success' ? 'bg-green-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {insight.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {insight.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{insight.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Confidence: {insight.confidence}%
                    </span>
                    <span className={`text-xs font-bold ${
                      insight.action === 'BUY' ? 'text-green-400' :
                      insight.action === 'SELL' ? 'text-red-400' :
                      insight.action === 'REDUCE' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {insight.action}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 italic mt-2">
                    {insight.source}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trade Log */}
          <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Trade Log</h3>
            </div>

            <div className="space-y-2">
              {tradeLog.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-2 bg-[#1e293b] rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{trade.time}</span>
                    {trade.result === 'Win' ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <span className={`text-sm font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
              <div className="text-xs text-blue-400 font-medium mb-1">Linda Raschke Rule #1</div>
              <div className="text-xs text-gray-300">
                "Keep records of your trading results."
              </div>
            </div>
          </div>

          {/* Trading Rules Reference */}
          <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl border border-purple-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Professional Rules</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2 bg-[#0f172a]/50 rounded">
                <div className="text-purple-400 font-medium mb-1">Max Risk Per Trade</div>
                <div className="text-gray-300">1-2% of capital</div>
                <div className="text-gray-500 italic">— Linda Raschke</div>
              </div>

              <div className="p-2 bg-[#0f172a]/50 rounded">
                <div className="text-purple-400 font-medium mb-1">Stop Placement</div>
                <div className="text-gray-300">Always at entry</div>
                <div className="text-gray-500 italic">— Rule #13</div>
              </div>

              <div className="p-2 bg-[#0f172a]/50 rounded">
                <div className="text-purple-400 font-medium mb-1">Position Management</div>
                <div className="text-gray-300">Never add to losing position</div>
                <div className="text-gray-500 italic">— Rule #36</div>
              </div>

              <div className="p-2 bg-[#0f172a]/50 rounded">
                <div className="text-purple-400 font-medium mb-1">Strategy Validation</div>
                <div className="text-gray-300">Backtest before live use</div>
                <div className="text-gray-500 italic">— Python for Finance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAITradingBot;
