import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  BarChart3,
  Brain,
  Settings,
  Play,
  Pause,
  Square,
  Zap,
  Target,
  DollarSign,
  Clock,
  Eye,
  EyeOff,
  Command,
  Monitor,
  Bell,
  Download,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Layers,
  Globe,
  Wifi,
  WifiOff,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChartWorkbench from '@/components/institutional/ChartWorkbench';
import StrategyBuilder from '@/components/institutional/StrategyBuilder';
import RiskControlCenter from '@/components/institutional/RiskControlCenter';
import CommandPalette from '@/components/institutional/CommandPalette';
import AdvancedTradingChart from '@/components/institutional/AdvancedTradingChart';

const InstitutionalTradingBotProfile = () => {
  const [botStatus, setBotStatus] = useState('active'); // active, idle, analyzing, error
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [activeSetups, setActiveSetups] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('charts'); // setups, charts, strategy, risk
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [expandedSetup, setExpandedSetup] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: 'Hello! I\'m your AI Co-Pilot. I can help you analyze setups, manage risk, and optimize your trading strategy. What would you like to know?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock institutional-grade performance data
  const [performance, setPerformance] = useState({
    dailyPnL: 2847.32,
    weeklyPnL: 12450.75,
    monthlyPnL: 45230.18,
    winRate: 78.5,
    sharpeRatio: 1.85,
    maxDrawdown: -8.2,
    avgRR: 2.3,
    totalTrades: 156,
    activePositions: 8,
    riskUtilization: 65.2,
    latency: 12
  });

  // Mock Top 10 setups data
  const [topSetups, setTopSetups] = useState([
    {
      id: 1,
      name: 'Trend-Follow Breakout',
      symbol: 'EUR/USD',
      timeframe: '4H',
      score: 92,
      confidence: 'High',
      lastResult: 'Win',
      riskPercent: 1.5,
      enabled: true,
      rationale: 'Breakout above 20EMA + volume spike > 1.5x avg'
    },
    {
      id: 2,
      name: 'VWAP Pullback',
      symbol: 'GBP/USD',
      timeframe: '1H',
      score: 87,
      confidence: 'High',
      lastResult: 'Win',
      riskPercent: 1.2,
      enabled: true,
      rationale: 'Price pulls back to VWAP in uptrend, rejection candle'
    },
    {
      id: 3,
      name: 'Liquidity Sweep',
      symbol: 'USD/JPY',
      timeframe: '15m',
      score: 84,
      confidence: 'Medium',
      lastResult: 'Loss',
      riskPercent: 0.8,
      enabled: false,
      rationale: 'False-break of liquidity pool + strong reversal'
    }
  ]);

  // Mock AI insights
  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000),
      type: 'signal',
      content: 'EURUSD 1H trend is bullish above 1.0920, risk if breaks 1.0885. 2 setups triggered.',
      confidence: 85,
      action: 'BUY'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 600000),
      type: 'risk',
      content: 'Portfolio risk utilization at 65.2%. Consider reducing position sizes.',
      confidence: 92,
      action: 'REDUCE'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        `Your current win rate is ${performance.winRate}% with a Sharpe ratio of ${performance.sharpeRatio}. This indicates strong risk-adjusted returns.`,
        `I've analyzed your top setups. The "Trend-Follow Breakout" has the highest score at 92/100. Would you like me to execute it?`,
        `Risk utilization is at ${performance.riskUtilization}%. You have room for ${(100 - performance.riskUtilization).toFixed(1)}% more exposure if opportunities arise.`,
        `Based on current market conditions, I recommend focusing on EUR/USD and GBP/USD pairs. Volatility is favorable for your strategies.`,
        `Your average risk-reward ratio of ${performance.avgRR}:1 is excellent. Keep maintaining this discipline.`,
        `I've detected a new high-probability setup on USD/JPY. Liquidity sweep pattern with 84% confidence. Shall I add it to your watchlist?`
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage = { type: 'ai', content: randomResponse, timestamp: new Date() };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());

      // Randomly update some metrics
      if (Math.random() > 0.7) {
        setPerformance(prev => ({
          ...prev,
          dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 100,
          latency: Math.floor(Math.random() * 20) + 8
        }));
      }
    }, 5000);

    // Command palette keyboard shortcut
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'analyzing': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'analyzing': return <Brain className="w-4 h-4 animate-pulse" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const generateTop10Setups = () => {
    // Simulate API call to generate new setups
    setBotStatus('analyzing');
    setTimeout(() => {
      setBotStatus('active');
      // Add notification logic here
    }, 3000);
  };

  // Set first setup as selected by default
  useEffect(() => {
    if (topSetups.length > 0 && !selectedSetup) {
      setSelectedSetup(topSetups[0]);
    }
  }, [topSetups]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Helmet>
        <title>Qwen3-Max • AI Trading Lab - Institutional Profile</title>
        <meta name="description" content="Professional AI trading bot with institutional-grade analytics and risk management" />
      </Helmet>

      {/* Header Bar */}
      <div className="bg-[#0f172a] border-b border-[#1e293b] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Qwen3-Max • AI Trading Lab</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Last run: {lastUpdate.toLocaleTimeString()}</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(botStatus)}
                    <span className={getStatusColor(botStatus)}>{botStatus.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {connectionStatus === 'connected' ? 
                      <Wifi className="w-4 h-4 text-green-400" /> : 
                      <WifiOff className="w-4 h-4 text-red-400" />
                    }
                    <span>Latency: {performance.latency}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600"
              onClick={() => setShowCommandPalette(true)}
            >
              <Command className="w-4 h-4 mr-2" />
              Command
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout - 3 Column */}
      <div className="flex h-[calc(100vh-80px)]">
        
        {/* Left Panel - Navigation & Watchlist */}
        <div className="w-80 bg-[#0f172a] border-r border-[#1e293b] p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">PERFORMANCE SNAPSHOT</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="text-xs text-gray-400">P&L (24h)</div>
                <div className={`text-lg font-bold ${performance.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${performance.dailyPnL.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="text-lg font-bold text-green-400">{performance.winRate}%</div>
              </div>
              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="text-xs text-gray-400">Sharpe</div>
                <div className="text-lg font-bold text-blue-400">{performance.sharpeRatio}</div>
              </div>
              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="text-xs text-gray-400">Max DD</div>
                <div className="text-lg font-bold text-yellow-400">{performance.maxDrawdown}%</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">RISK CONTROLS</h3>
            <div className="space-y-3">
              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Risk Utilization</span>
                  <span className="text-sm font-bold">{performance.riskUtilization}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${performance.riskUtilization}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-[#1e293b] rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Active Positions</span>
                  <span className="text-sm font-bold">{performance.activePositions}</span>
                </div>
              </div>

              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </div>

        {/* Center Panel - Main Work Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-6 border-b border-[#1e293b]">
            {[
              { id: 'setups', name: 'Trading Setups', icon: Target },
              { id: 'charts', name: 'Chart Workbench', icon: BarChart3 },
              { id: 'strategy', name: 'Strategy Builder', icon: Brain },
              { id: 'risk', name: 'Risk Control', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'setups' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Active Trading Setups</h2>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={generateTop10Setups}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={botStatus === 'analyzing'}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${botStatus === 'analyzing' ? 'animate-spin' : ''}`} />
                    Generate Top 10
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

            {/* Setups DataGrid */}
            <div className="bg-[#0f172a] rounded-lg border border-[#1e293b] overflow-hidden">
              <div className="grid grid-cols-8 gap-4 p-4 bg-[#1e293b] text-xs font-semibold text-gray-400 border-b border-[#374151]">
                <div>NAME</div>
                <div>SYMBOL</div>
                <div>TF</div>
                <div>SCORE</div>
                <div>LAST RESULT</div>
                <div>RISK %</div>
                <div>STATUS</div>
                <div>ACTIONS</div>
              </div>
              
              {topSetups.map((setup) => (
                <div key={setup.id}>
                  <div className="grid grid-cols-8 gap-4 p-4 border-b border-[#1e293b] hover:bg-[#1e293b]/50 transition-colors">
                    <div className="font-medium">{setup.name}</div>
                    <div className="text-blue-400">{setup.symbol}</div>
                    <div className="text-gray-400">{setup.timeframe}</div>
                    <div className={`font-bold ${getScoreColor(setup.score)}`}>{setup.score}</div>
                    <div className={`${setup.lastResult === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                      {setup.lastResult}
                    </div>
                    <div>{setup.riskPercent}%</div>
                    <div>
                      <button
                        onClick={() => {
                          setTopSetups(prev => prev.map(s =>
                            s.id === setup.id ? { ...s, enabled: !s.enabled } : s
                          ));
                        }}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          setup.enabled
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {setup.enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-[#3b82f6]/20"
                        onClick={() => {
                          setSelectedSetup(setup);
                          setActiveTab('charts');
                        }}
                        title="View on Chart"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-[#3b82f6]/20"
                        onClick={() => setExpandedSetup(expandedSetup === setup.id ? null : setup.id)}
                        title="Details"
                      >
                        {expandedSetup === setup.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedSetup === setup.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[#1e293b] border-b border-[#334155] overflow-hidden"
                      >
                        <div className="p-6 grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-bold text-gray-400 mb-3">SETUP DETAILS</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Entry Price:</span>
                                <span className="text-white font-mono">1.0850</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Stop Loss:</span>
                                <span className="text-red-400 font-mono">1.0800 (-50 pips)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Take Profit 1:</span>
                                <span className="text-green-400 font-mono">1.0925 (+75 pips)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Take Profit 2:</span>
                                <span className="text-green-400 font-mono">1.1000 (+150 pips)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Take Profit 3:</span>
                                <span className="text-green-400 font-mono">1.1075 (+225 pips)</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-[#334155]">
                                <span className="text-gray-400">Risk:Reward:</span>
                                <span className="text-[#3b82f6] font-bold">1:4.5</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-gray-400 mb-3">RATIONALE</h4>
                            <p className="text-sm text-gray-300 mb-4">{setup.rationale}</p>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-[#3b82f6] hover:bg-[#2563eb]"
                                onClick={() => {
                                  setSelectedSetup(setup);
                                  setActiveTab('charts');
                                }}
                              >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Chart
                              </Button>
                              <Button size="sm" variant="outline">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Setup
                              </Button>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="p-4 space-y-4">
              <AdvancedTradingChart
                symbol={selectedSetup?.symbol || "EUR/USD"}
                timeframe={selectedSetup?.timeframe || "1H"}
                activeSetup={selectedSetup}
                onSetupClick={setSelectedSetup}
              />

              {/* Setup Selection Panel */}
              <div className="grid grid-cols-3 gap-4">
                {topSetups.slice(0, 3).map((setup) => (
                  <motion.div
                    key={setup.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSetup(setup)}
                    className={`bg-[#1e293b] rounded-lg p-4 cursor-pointer border-2 transition-all ${
                      selectedSetup?.id === setup.id
                        ? 'border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20'
                        : 'border-transparent hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{setup.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        setup.score >= 90 ? 'bg-green-600' :
                        setup.score >= 80 ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }`}>
                        {setup.score}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {setup.symbol} • {setup.timeframe}
                    </div>
                    <div className="text-xs text-gray-500">
                      {setup.rationale}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <StrategyBuilder />
          )}

          {activeTab === 'risk' && (
            <RiskControlCenter />
          )}
        </div>

        {/* Right Panel - AI Co-Pilot & Insights */}
        <div className="w-96 bg-[#0f172a] border-l border-[#1e293b] p-4 overflow-y-auto">
          {/* AI Co-Pilot Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Co-Pilot</h3>
                <p className="text-xs text-gray-400">Qwen3-Max Analysis</p>
              </div>
            </div>

            {/* Active Setup Analysis */}
            {selectedSetup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-4 border border-[#3b82f6]/30 mb-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#3b82f6]" />
                  <h4 className="text-sm font-bold text-white">Active Setup Analysis</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Setup:</span>
                    <span className="text-white font-bold">{selectedSetup.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Symbol:</span>
                    <span className="text-[#3b82f6]">{selectedSetup.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Score:</span>
                    <span className={`font-bold ${
                      selectedSetup.score >= 90 ? 'text-green-400' :
                      selectedSetup.score >= 80 ? 'text-blue-400' :
                      'text-yellow-400'
                    }`}>{selectedSetup.score}/100</span>
                  </div>
                  <div className="pt-2 border-t border-[#334155]">
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {selectedSetup.rationale}
                    </p>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <Button size="sm" className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Execute
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Chat Toggle */}
          <div className="mb-4">
            <Button
              onClick={() => setShowAIChat(!showAIChat)}
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed] text-white"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {showAIChat ? 'Hide AI Chat' : 'Chat with AI Co-Pilot'}
            </Button>
          </div>

          {/* AI Chat Interface */}
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-[#1e293b] rounded-lg p-4 border border-[#3b82f6]/30"
            >
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-[#3b82f6] text-white'
                          : 'bg-[#0f172a] text-gray-200 border border-[#334155]'
                      }`}>
                        {msg.type === 'ai' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={12} className="text-purple-400" />
                            <span className="text-xs font-semibold text-purple-400">AI Co-Pilot</span>
                          </div>
                        )}
                        <p className="text-xs leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
                        <div className="flex items-center gap-2">
                          <Sparkles size={12} className="text-purple-400 animate-pulse" />
                          <span className="text-xs text-gray-400">AI is typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#334155]">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask AI about your trading performance..."
                    className="flex-1 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-[#3b82f6] hover:bg-[#2563eb] px-3"
                  >
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Insights Stream */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">LIVE INSIGHTS</h3>
            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#1e293b] rounded-lg p-3 border border-[#334155] hover:border-[#3b82f6]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      insight.type === 'signal' ? 'bg-blue-600 text-white' :
                      insight.type === 'risk' ? 'bg-red-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {insight.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {insight.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{insight.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Confidence: {insight.confidence}%
                    </span>
                    <span className={`text-xs font-medium ${
                      insight.action === 'BUY' ? 'text-green-400' :
                      insight.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {insight.action}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">TRADE LOG</h3>
            <div className="bg-[#1e293b] rounded-lg p-3 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">16:42:15</span>
                  <span className="text-green-400">+$247.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">16:38:22</span>
                  <span className="text-red-400">-$89.25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">16:35:10</span>
                  <span className="text-green-400">+$156.75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </div>
  );
};

export default InstitutionalTradingBotProfile;
