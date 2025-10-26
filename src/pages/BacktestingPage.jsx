import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Settings, Download, Upload, BarChart3, Brain, Target,
  TrendingUp, AlertCircle, CheckCircle, Loader, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BacktestDashboard from '@/components/backtesting/BacktestDashboard';
import { BacktestEngine } from '@/lib/backtesting/BacktestEngine';
import { WalkForwardAnalysis } from '@/lib/backtesting/WalkForwardAnalysis';
import { MonteCarloSimulation } from '@/lib/backtesting/MonteCarloSimulation';
import { StrategyExporter } from '@/lib/export/StrategyExporter';

const BacktestingPage = () => {
  const [activeTab, setActiveTab] = useState('backtest'); // backtest, walk-forward, monte-carlo
  const [strategy, setStrategy] = useState(null);
  const [backtestResults, setBacktestResults] = useState(null);
  const [walkForwardResults, setWalkForwardResults] = useState(null);
  const [monteCarloResults, setMonteCarloResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState({
    initialCapital: 10000,
    commission: 0.001,
    slippage: 0.0005,
    startDate: null,
    endDate: null
  });

  // Initialize with a sample strategy
  useEffect(() => {
    const sampleStrategy = {
      name: 'Momentum Breakout Strategy',
      description: 'A simple momentum-based breakout strategy',
      rules: {
        entry: [
          {
            id: 1,
            type: 'price_above_ema',
            name: 'Price Above EMA',
            params: { period: 20 },
            enabled: true
          },
          {
            id: 2,
            type: 'volume_spike',
            name: 'Volume Spike',
            params: { multiplier: 2 },
            enabled: true
          }
        ],
        exit: [
          {
            id: 3,
            type: 'take_profit',
            name: 'Take Profit',
            params: { ratio: 3 },
            enabled: true
          }
        ],
        filters: []
      },
      riskManagement: {
        stopLoss: 2.0,
        takeProfit: 4.0,
        positionSize: 1.0,
        maxDrawdown: 10.0
      },
      defaultSide: 'buy'
    };

    setStrategy(sampleStrategy);
  }, []);

  // Generate mock historical data
  const generateHistoricalData = (numBars = 500) => {
    const data = [];
    let time = Date.now() - numBars * 3600000; // Start from numBars hours ago
    let price = 100;

    for (let i = 0; i < numBars; i++) {
      const change = (Math.random() - 0.48) * 2;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      const volume = Math.random() * 1000000 + 500000;

      data.push({
        time: time + i * 3600000,
        open,
        high,
        low,
        close,
        volume
      });

      price = close;
    }

    return data;
  };

  // Run standard backtest
  const runBacktest = async () => {
    if (!strategy) return;

    setIsRunning(true);
    setProgress(0);

    try {
      const historicalData = generateHistoricalData(500);
      const engine = new BacktestEngine(config);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const results = await engine.run(historicalData, strategy);

      clearInterval(progressInterval);
      setProgress(100);

      setBacktestResults(results);
      
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Backtest failed:', error);
      setIsRunning(false);
      setProgress(0);
    }
  };

  // Run walk-forward analysis
  const runWalkForward = async () => {
    if (!strategy) return;

    setIsRunning(true);
    setProgress(0);

    try {
      const historicalData = generateHistoricalData(1000);
      const wfa = new WalkForwardAnalysis({
        inSampleRatio: 0.7,
        windowSize: 252,
        stepSize: 63,
        backtestConfig: config
      });

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const parameterRanges = [
        { name: 'stopLoss', type: 'range', min: 1.0, max: 3.0, step: 0.5 },
        { name: 'takeProfit', type: 'range', min: 2.0, max: 5.0, step: 1.0 }
      ];

      const results = await wfa.run(historicalData, strategy, parameterRanges);

      clearInterval(progressInterval);
      setProgress(100);

      setWalkForwardResults(results);
      
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Walk-forward analysis failed:', error);
      setIsRunning(false);
      setProgress(0);
    }
  };

  // Run Monte Carlo simulation
  const runMonteCarlo = async () => {
    if (!backtestResults || !backtestResults.trades) {
      alert('Please run a backtest first to generate trades for Monte Carlo simulation');
      return;
    }

    setIsRunning(true);
    setProgress(0);

    try {
      const mc = new MonteCarloSimulation({
        numSimulations: 1000,
        confidenceLevel: 0.95
      });

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 50);

      const results = mc.run(backtestResults.trades, config.initialCapital);

      clearInterval(progressInterval);
      setProgress(100);

      setMonteCarloResults(results);
      
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Monte Carlo simulation failed:', error);
      setIsRunning(false);
      setProgress(0);
    }
  };

  // Export results
  const exportResults = () => {
    const exporter = new StrategyExporter();
    exporter.downloadStrategy(strategy, 'json');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Backtesting Engine</h1>
          <p className="text-gray-400">
            Test your trading strategies with historical data, walk-forward analysis, and Monte Carlo simulation
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <TabButton
            active={activeTab === 'backtest'}
            onClick={() => setActiveTab('backtest')}
            icon={BarChart3}
          >
            Standard Backtest
          </TabButton>
          <TabButton
            active={activeTab === 'walk-forward'}
            onClick={() => setActiveTab('walk-forward')}
            icon={TrendingUp}
          >
            Walk-Forward Analysis
          </TabButton>
          <TabButton
            active={activeTab === 'monte-carlo'}
            onClick={() => setActiveTab('monte-carlo')}
            icon={Target}
          >
            Monte Carlo Simulation
          </TabButton>
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#1e293b] rounded-xl p-4 mb-6 border border-[#3b82f6]/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader className="w-5 h-5 text-[#3b82f6] animate-spin" />
                <span className="text-white font-medium">
                  {activeTab === 'backtest' && 'Running backtest...'}
                  {activeTab === 'walk-forward' && 'Running walk-forward analysis...'}
                  {activeTab === 'monte-carlo' && 'Running Monte Carlo simulation...'}
                </span>
                <span className="text-gray-400 ml-auto">{progress}%</span>
              </div>
              <div className="w-full bg-[#0f172a] rounded-full h-2">
                <motion.div
                  className="bg-[#3b82f6] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'backtest' && (
            <motion.div
              key="backtest"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BacktestDashboard
                backtestResults={backtestResults}
                onRunBacktest={runBacktest}
                onExport={exportResults}
              />
            </motion.div>
          )}

          {activeTab === 'walk-forward' && (
            <motion.div
              key="walk-forward"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <WalkForwardDashboard
                results={walkForwardResults}
                onRun={runWalkForward}
                isRunning={isRunning}
              />
            </motion.div>
          )}

          {activeTab === 'monte-carlo' && (
            <motion.div
              key="monte-carlo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MonteCarloDashboard
                results={monteCarloResults}
                onRun={runMonteCarlo}
                isRunning={isRunning}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active
        ? 'bg-[#3b82f6] text-white'
        : 'bg-[#1e293b] text-gray-400 hover:bg-[#1e293b]/80 hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4" />
    {children}
  </button>
);

// Placeholder components for Walk-Forward and Monte Carlo dashboards
const WalkForwardDashboard = ({ results, onRun, isRunning }) => (
  <div className="bg-[#1e293b] rounded-xl p-8 border border-[#3b82f6]/30 text-center">
    <TrendingUp className="w-16 h-16 text-[#3b82f6] mx-auto mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">Walk-Forward Analysis</h3>
    <p className="text-gray-400 mb-6">
      {results ? 'Analysis complete!' : 'Test strategy robustness with in-sample/out-of-sample validation'}
    </p>
    {!results && (
      <Button onClick={onRun} disabled={isRunning} className="bg-[#3b82f6] hover:bg-[#2563eb]">
        <Play className="w-4 h-4 mr-2" />
        Run Walk-Forward Analysis
      </Button>
    )}
    {results && (
      <div className="mt-6 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0f172a] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Robustness</div>
            <div className="text-2xl font-bold text-white">{results.summary.robustness}</div>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Consistency</div>
            <div className="text-2xl font-bold text-white">{results.summary.consistency.toFixed(1)}%</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#0f172a] rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Recommendation</div>
          <div className="text-white">{results.summary.recommendation}</div>
        </div>
      </div>
    )}
  </div>
);

const MonteCarloDashboard = ({ results, onRun, isRunning }) => (
  <div className="bg-[#1e293b] rounded-xl p-8 border border-[#3b82f6]/30 text-center">
    <Target className="w-16 h-16 text-[#3b82f6] mx-auto mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">Monte Carlo Simulation</h3>
    <p className="text-gray-400 mb-6">
      {results ? 'Simulation complete!' : 'Analyze risk through randomized trade sequences'}
    </p>
    {!results && (
      <Button onClick={onRun} disabled={isRunning} className="bg-[#3b82f6] hover:bg-[#2563eb]">
        <Play className="w-4 h-4 mr-2" />
        Run Monte Carlo Simulation
      </Button>
    )}
    {results && (
      <div className="mt-6 text-left">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0f172a] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Ruin Probability</div>
            <div className="text-2xl font-bold text-red-400">{results.summary.ruinProbability.toFixed(2)}%</div>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Profit Probability</div>
            <div className="text-2xl font-bold text-green-400">{results.summary.profitProbability.toFixed(2)}%</div>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Median Return</div>
            <div className="text-2xl font-bold text-white">{results.summary.medianFinalReturn.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default BacktestingPage;

