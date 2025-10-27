import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, Layers, PenTool, Search, Settings, Maximize2, Minimize2, Share2, Download, Bell, RefreshCw,
  TrendingUp, TrendingDown, Compass, Shield, BookOpen, GitMerge, Zap, Droplets, Wind, ChevronDown, ChevronUp,
  HelpCircle, Eye, EyeOff, Clock, DollarSign, Percent, ChevronRight, AlertTriangle, Info, Target, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// --- MOCK AI RESPONSE (Based on your prompt) ---
const mockAIResponse = {
  summary: "1H trend: bullish. Price is currently reacting to a demand order block formed during the London session.",
  market_structure: "Bullish",
  levels: [
    { type: "order_block_demand", price_start: 46800, price_end: 46500 },
    { type: "fvg_bullish", price_start: 47200, price_end: 47450 },
    { type: "liquidity_high", price: 48500 },
  ],
  trade_ideas: [
    {
      side: "buy",
      type: "Limit",
      entry: 47000,
      sl: 46400,
      tp1: 48200,
      tp2: 49500,
      rr: "1:3.67",
      confidence: "high",
      explain_steps: [
        "Market structure is bullish (higher highs and higher lows on 1H).",
        "Price is mitigating a key demand Order Block at ~$46,800.",
        "A Fair Value Gap (FVG) above provides a target for price expansion.",
        "Stop loss is placed below the low of the order block for protection."
      ]
    }
  ],
  risk: {
    position_size: 0.167,
    risk_amount: 100.2,
    account_size: 10000,
    risk_pct: 1
  },
  confidence_score: 88,
  news_flags: [
    { type: 'info', content: 'Fed interest rate decision in 2 days. Expect volatility.' }
  ]
};

// --- UI COMPONENTS (Based on your Figma-style layout) ---

const HeaderBar = () => {
  const { colors } = useTheme();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  
  const symbols = ['BTCUSDT', 'ETHUSD', 'EURUSD', 'XAUUSD', 'SPX500'];
  const timeframes = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W'];
  
  return (
    <div className="h-14 border-b flex items-center justify-between px-4"
         style={{ backgroundColor: '#0B0D10', borderColor: '#1F2937' }}>
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg text-[#00C896]">ATLAS AI Trader</h1>
        
        <select 
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-[#1F2937] px-3 py-1 rounded text-sm font-semibold border border-gray-700 focus:border-[#00C896] outline-none"
        >
          {symbols.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <div className="flex items-center gap-1">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                selectedTimeframe === tf 
                  ? 'bg-[#00C896] text-black' 
                  : 'bg-[#1F2937] text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse"></div>
          <span className="text-[#00C896]">AI Online</span>
        </div>
        <Bell size={18} className="cursor-pointer text-gray-400 hover:text-white" />
        <Settings size={18} className="cursor-pointer text-gray-400 hover:text-white" />
      </div>
    </div>
  );
};

const DrawingToolbar = () => {
  const tools = [PenTool, GitMerge, Droplets, Wind];
  return (
    <div className="w-12 h-full border-r flex flex-col items-center py-4 gap-4"
         style={{ backgroundColor: '#0B0D10', borderColor: '#1F2937' }}>
      {tools.map((Tool, i) => (
        <Button key={i} variant="ghost" size="sm" className="p-2">
          <Tool size={18} />
        </Button>
      ))}
    </div>
  );
};

const ChartArea = () => {
  return (
    <div className="relative w-full h-full bg-[#0B0D10] flex items-center justify-center">
      {/* This would be the TradingView Chart Widget */}
      <div className="text-center text-gray-500">
        <BarChart2 size={64} className="mx-auto mb-4" />
        <p className="text-xl font-semibold">Trading Chart Area</p>
        <p className="text-sm">Candles, Indicators, and AI Overlays will be rendered here.</p>
      </div>

      {/* AI Overlays (Example) */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold"
           style={{ backgroundColor: 'rgba(0, 200, 150, 0.2)', color: '#00C896', border: '1px solid #00C896' }}>
        Market Structure: {mockAIResponse.market_structure}
      </div>
      
      {/* Mock Order Block */}
      <div className="absolute w-1/3 h-12 left-1/4 top-1/2 rounded opacity-50"
           style={{ backgroundColor: 'rgba(0, 200, 150, 0.3)', border: '1px dashed #00C896' }}>
        <span className="text-xs p-1">Demand OB</span>
      </div>

      {/* Mock FVG */}
      <div className="absolute w-1/4 h-8 left-1/2 top-1/3 rounded opacity-40"
           style={{ background: 'repeating-linear-gradient(45deg, rgba(0, 200, 150, 0.2), rgba(0, 200, 150, 0.2) 10px, transparent 10px, transparent 20px)' }}>
      </div>
    </div>
  );
};

const AIPanel = () => {
  const { colors } = useTheme();
  const aiData = mockAIResponse;
  const idea = aiData.trade_ideas[0];

  return (
    <div className="w-[30%] h-full border-l flex flex-col"
         style={{ backgroundColor: '#101217', borderColor: '#1F2937' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: '#1F2937' }}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">AI Analysis</h2>
          <RefreshCw size={16} className="cursor-pointer text-gray-400 hover:text-white" />
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 border-b" style={{ borderColor: '#1F2937' }}>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Quick Summary</h3>
        <p className="text-sm">{aiData.summary}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs font-semibold">Confidence:</span>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-[#00C896] h-2.5 rounded-full" style={{ width: `${aiData.confidence_score}%` }}></div>
          </div>
          <span className="text-sm font-bold text-[#00C896]">{aiData.confidence_score}%</span>
        </div>
      </div>

      {/* Trade Ideas */}
      <div className="p-4 border-b flex-grow" style={{ borderColor: '#1F2937' }}>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Trade Idea</h3>
        <div className="bg-[#1F2937] p-4 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-lg font-bold ${idea.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              {idea.side.toUpperCase()} {idea.type}
            </span>
            <span className="text-sm font-bold">RR: {idea.rr}</span>
          </div>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between"><span>Entry:</span><span>${idea.entry}</span></div>
            <div className="flex justify-between"><span>Stop Loss:</span><span className="text-red-400">${idea.sl}</span></div>
            <div className="flex justify-between"><span>TP1:</span><span className="text-green-400">${idea.tp1}</span></div>
            <div className="flex justify-between"><span>TP2:</span><span className="text-green-400">${idea.tp2}</span></div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="primary" size="sm" className="flex-1">Simulate</Button>
            <Button variant="secondary" size="sm" className="flex-1">Execute</Button>
          </div>
        </div>
      </div>

      {/* Risk Calculator */}
      <div className="p-4 border-b" style={{ borderColor: '#1F2937' }}>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Risk Calculator</h3>
        <div className="flex items-center gap-2 text-sm">
          <span>Account: ${aiData.risk.account_size}</span>
          <span>Risk: {aiData.risk.risk_pct}%</span>
        </div>
        <div className="mt-2 bg-[#1F2937] p-3 rounded-md">
          <p>Position Size: <span className="font-bold font-mono">{aiData.risk.position_size} BTC</span></p>
          <p>Risk Amount: <span className="font-bold font-mono text-red-400">${aiData.risk.risk_amount}</span></p>
        </div>
      </div>

      {/* Explain & Actions */}
      <div className="p-4">
        <Button variant="secondary" className="w-full mb-2 flex items-center justify-center gap-2">
          <BookOpen size={16} /> Explain Steps
        </Button>
        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
          <Bell size={16} /> Create Alert from Idea
        </Button>
      </div>
    </div>
  );
};

const BottomToolbar = () => {
  return (
    <div className="h-10 border-t flex items-center justify-between px-4 text-sm"
         style={{ backgroundColor: '#0B0D10', borderColor: '#1F2937' }}>
      <div className="flex items-center gap-4">
        <span>NY</span>
        <span>LON</span>
        <span>ASIA</span>
      </div>
      <div className="flex items-center gap-4">
        <Share2 size={16} />
        <Download size={16} />
        <Maximize2 size={16} />
      </div>
    </div>
  );
};

const AITradingChart: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div className="h-screen w-screen flex flex-col text-white bg-[#0B0D10]">
      <HeaderBar />
      <div className="flex flex-1 overflow-hidden">
        <DrawingToolbar />
        <div className="flex-1 flex flex-col">
          <div className="flex-grow">
            <ChartArea />
          </div>
          <BottomToolbar />
        </div>
        <AIPanel />
      </div>
    </div>
  );
};

export default AITradingChart;
