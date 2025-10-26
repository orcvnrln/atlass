import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign,
  Target,
  Shield,
  Brain,
  Zap,
  Activity,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AITradingBot = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [botStatus, setBotStatus] = useState('idle'); // idle, analyzing, trading, error
  const [currentStrategy, setCurrentStrategy] = useState('momentum_breakout');
  const [performance, setPerformance] = useState({
    totalTrades: 0,
    winRate: 0,
    profitLoss: 0,
    activePositions: 0,
    riskLevel: 'medium'
  });
  const [aiSignals, setAiSignals] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock data generation
  useEffect(() => {
    if (isActive && !isPaused) {
      const interval = setInterval(() => {
        // Simulate AI analysis
        setBotStatus('analyzing');
        
        setTimeout(() => {
          // Generate mock signals
          const newSignal = {
            id: Date.now(),
            symbol: 'EUR/USD',
            action: Math.random() > 0.5 ? 'BUY' : 'SELL',
            confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
            price: (1.08 + Math.random() * 0.01).toFixed(4),
            reason: 'AI detected momentum breakout with 85% confidence',
            timestamp: new Date(),
            risk: Math.random() > 0.3 ? 'LOW' : 'MEDIUM'
          };
          
          setAiSignals(prev => [newSignal, ...prev.slice(0, 9)]);
          setBotStatus('trading');
          
          // Update performance
          setPerformance(prev => ({
            ...prev,
            totalTrades: prev.totalTrades + 1,
            winRate: Math.floor(Math.random() * 20) + 75,
            profitLoss: prev.profitLoss + (Math.random() - 0.4) * 1000,
            activePositions: Math.floor(Math.random() * 5) + 1
          }));
        }, 2000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setBotStatus('analyzing');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    setBotStatus(isPaused ? 'analyzing' : 'idle');
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setBotStatus('idle');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzing': return 'text-yellow-400';
      case 'trading': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzing': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'trading': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const strategies = [
    { id: 'momentum_breakout', name: 'Momentum Breakout', description: 'Identifies breakout patterns' },
    { id: 'mean_reversion', name: 'Mean Reversion', description: 'Trades price reversals' },
    { id: 'scalping', name: 'Scalping', description: 'Quick profit strategies' },
    { id: 'swing_trading', name: 'Swing Trading', description: 'Medium-term positions' }
  ];

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#3b82f6]/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3b82f6]/20 rounded-lg">
            <Bot className="w-6 h-6 text-[#3b82f6]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Trading Bot</h2>
            <p className="text-sm text-gray-400">Advanced algorithmic trading system</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs"
          >
            {showAdvanced ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs"
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Bot Status */}
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Bot Status</span>
            <div className={`flex items-center gap-1 ${getStatusColor(botStatus)}`}>
              {getStatusIcon(botStatus)}
              <span className="text-sm font-medium capitalize">{botStatus}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isActive ? (
              <Button onClick={handleStart} className="flex-1 bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-1" />
                Start Bot
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handlePause} 
                  variant="outline" 
                  className="flex-1"
                >
                  {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button 
                  onClick={handleStop} 
                  variant="outline" 
                  className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Current Strategy */}
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <span className="text-sm text-gray-400">Active Strategy</span>
          <div className="mt-2">
            <select 
              value={currentStrategy} 
              onChange={(e) => setCurrentStrategy(e.target.value)}
              className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
            >
              {strategies.map(strategy => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Risk Level</span>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400 capitalize">{performance.riskLevel}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-orange-400 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a] text-center">
          <div className="text-2xl font-bold text-white">{performance.totalTrades}</div>
          <div className="text-xs text-gray-400">Total Trades</div>
        </div>
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a] text-center">
          <div className="text-2xl font-bold text-green-400">{performance.winRate}%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a] text-center">
          <div className={`text-2xl font-bold ${performance.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${performance.profitLoss.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">P&L</div>
        </div>
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a] text-center">
          <div className="text-2xl font-bold text-blue-400">{performance.activePositions}</div>
          <div className="text-xs text-gray-400">Active Positions</div>
        </div>
      </div>

      {/* AI Signals */}
      <div className="bg-[#0f172a] rounded-lg border border-[#23324a]">
        <div className="p-4 border-b border-[#23324a]">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#3b82f6]" />
            AI Signals
          </h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <AnimatePresence>
            {aiSignals.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 border-b border-[#23324a] last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${
                      signal.action === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {signal.action === 'BUY' ? 
                        <TrendingUp className="w-4 h-4 text-green-400" /> : 
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="font-semibold text-white">{signal.symbol}</div>
                      <div className="text-sm text-gray-400">{signal.reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-white">{signal.price}</div>
                    <div className="text-xs text-gray-400">
                      {signal.confidence}% confidence
                    </div>
                    <div className="text-xs text-gray-500">
                      {signal.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {aiSignals.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No AI signals yet. Start the bot to begin analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITradingBot;
