import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Shield, TrendingUp, Newspaper, Waves, Gauge, CandlestickChart, Briefcase, Layers, PieChart, Brain, MessageSquare, Send, Sparkles, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const aiTabs = [
  { label: 'AI Signal', icon: Zap },
  { label: 'AI Chat', icon: MessageSquare },
  { label: 'News', icon: Newspaper },
  { label: 'Liquidity', icon: Waves },
  { label: 'Volume & OI', icon: Gauge },
  { label: 'Technical', icon: CandlestickChart },
  { label: 'Fundamental', icon: Briefcase },
  { label: 'Options', icon: Layers },
  { label: 'Sentiment', icon: PieChart },
];

const buildAISignal = (asset) => {
  const base = (asset?.symbol || 'EURUSD').toUpperCase();
  const direction = base.endsWith('USD') ? 'BUY' : 'WATCH';
  return {
    direction,
    confidence: Math.floor(70 + Math.random() * 25),
    riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    target: asset?.target || (1 + Math.random() * 0.05).toFixed(4),
    stopLoss: asset?.stopLoss || (1 - Math.random() * 0.05).toFixed(4),
    thesis:
      asset?.aiThesis ||
      `${asset?.displaySymbol || 'EUR/USD'} momentum remains constructive. Quant desk highlights favorable liquidity skew supporting continuation setups.`,
  };
};

const tabsContent = (aiSignal) => ({
  'AI Signal': () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${aiSignal.direction === 'BUY' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {aiSignal.direction}
          </div>
          <div className="text-xs text-text-secondary">Confidence</div>
          <div className="text-md font-bold text-text-primary">{aiSignal.confidence}%</div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <Shield size={14} className="text-yellow-400" />
          <span className="text-text-secondary">Risk:</span>
          <span className="text-yellow-300">{aiSignal.riskLevel}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary-bg border border-border-color rounded-lg p-2">
          <p className="text-xs text-text-secondary uppercase">Target</p>
          <p className="text-lg font-semibold text-text-primary">{aiSignal.target}</p>
        </div>
        <div className="bg-primary-bg border border-border-color rounded-lg p-2">
          <p className="text-xs text-text-secondary uppercase">Stop Loss</p>
          <p className="text-lg font-semibold text-text-primary">{aiSignal.stopLoss}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{aiSignal.thesis}</p>
      <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-sm">
        <TrendingUp size={16} /> Quick Trade (1% Risk)
      </Button>
    </div>
  ),
  News: () => (
    <ul className="space-y-2 text-xs text-text-secondary">
      <li className="flex gap-2 items-start"><span className="text-blue-400 font-semibold w-12">[ECB]</span><span>Lagarde signals openness to Q1 rate cuts if inflation data continues to soften. Market now pricing 80% chance of 25bps cut by March.</span></li>
      <li className="flex gap-2 items-start"><span className="text-yellow-400 font-semibold w-12">[FED]</span><span>Powell reiterates data-dependency; US Core PCE print this Thursday is critical for near-term USD direction.</span></li>
      <li className="flex gap-2 items-start"><span className="text-purple-400 font-semibold w-12">[MACRO]</span><span>Rising oil prices are a headwind for disinflation, potentially complicating central bank pivots. EUR/USD correlation to Brent crude now at 0.65.</span></li>
    </ul>
  ),
  Liquidity: () => (
    <div className="text-xs text-text-secondary space-y-2">
        <p>Significant resting bids observed at 1.0800-1.0810, providing a strong support zone. Thin liquidity noted above 1.0950, suggesting a sharp move if key resistance is breached.</p>
        <p className='font-semibold text-text-primary'>Order Book Delta: <span className='text-green-400'>+15.2M</span> in last 30 mins, indicating aggressive buying.</p>
    </div>
  ),
  'Volume & OI': () => (
    <div className="text-xs text-text-secondary space-y-2">
      <p>Futures volume for EUR/USD is up <span className='font-semibold text-text-primary'>18%</span> vs 24h average. Open Interest has climbed by <span className='font-semibold text-text-primary'>$2.1B</span>, confirming new capital is entering the long side.</p>
      <p>Options market shows major OI concentration at the 1.1000 call strike for month-end expiry.</p>
    </div>
  ),
  Technical: () => (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="bg-primary-bg p-2 rounded-md"><p className="text-text-secondary">4H Trend</p><p className="font-semibold text-green-400">Strong Bullish</p></div>
      <div className="bg-primary-bg p-2 rounded-md"><p className="text-text-secondary">RSI(14)</p><p className="font-semibold text-text-primary">62 (Rising)</p></div>
      <div className="bg-primary-bg p-2 rounded-md"><p className="text-text-secondary">Key Support</p><p className="font-semibold text-text-primary">1.0840</p></div>
      <div className="bg-primary-bg p-2 rounded-md"><p className="text-text-secondary">Next Resistance</p><p className="font-semibold text-text-primary">1.0950</p></div>
    </div>
  ),
  Fundamental: () => (
    <div className="text-xs text-text-secondary space-y-2">
        <p>Rate differential models suggest a fair value for EUR/USD around <span className='font-semibold text-text-primary'>1.0920</span>.</p>
        <p>Recent positive surprises in Eurozone PMI data are providing a fundamental tailwind.</p>
    </div>
  ),
  Options: () => (
    <div className="text-xs text-text-secondary space-y-2">
        <p>Max pain for the upcoming weekly expiry is at <span className='font-semibold text-text-primary'>1.0850</span>, which could act as a price magnet.</p>
        <p>Gamma exposure is turning positive above <span className='font-semibold text-text-primary'>1.0900</span>, which may accelerate a breakout.</p>
    </div>
  ),
  Sentiment: () => (
    <div className="text-xs text-text-secondary space-y-2">
        <p>Institutional sentiment (CoT data) shows hedge funds are net long EUR. Retail sentiment is mixed but leaning slightly bearish, offering a potential contrarian signal.</p>
    </div>
  ),
});


const AIIntelligenceSuite = ({ asset }) => {
  const [activeTab, setActiveTab] = useState('AI Signal');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: `Hello! I'm your AI Co-Pilot analyzing ${asset?.displaySymbol || 'EUR/USD'}. How can I assist you today?`, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const aiSignal = buildAISignal(asset);

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
        `Based on current market conditions for ${asset?.displaySymbol || 'EUR/USD'}, I recommend monitoring the 1.0850 support level closely.`,
        `The AI signal shows ${aiSignal.confidence}% confidence for a ${aiSignal.direction} setup. Risk level is ${aiSignal.riskLevel}.`,
        `Recent liquidity analysis indicates strong buying pressure. Order book delta is positive, suggesting institutional accumulation.`,
        `Technical indicators are aligned: RSI at 62 (rising), 4H trend is bullish. Key resistance at 1.0950.`,
        `News sentiment is moderately bullish. ECB rate cut expectations are supporting EUR strength.`
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage = { type: 'ai', content: randomResponse, timestamp: new Date() };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const AIChatContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
        <AnimatePresence>
          {chatMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-lg p-3 ${
                msg.type === 'user'
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#1e293b] text-gray-200 border border-[#334155]'
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
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#1e293b] rounded-lg p-3 border border-[#334155]">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-purple-400 animate-pulse" />
                <span className="text-xs text-gray-400">AI is typing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border-color">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI about market conditions..."
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
  );

  const contentMap = {
    ...tabsContent(aiSignal),
    'AI Chat': AIChatContent
  };

  const ActiveContent = contentMap[activeTab];

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {/* Neural Insights Panel Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full pb-2 mb-3 border-b border-slate-800/50 group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md">
            <Brain size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-sm font-bold text-slate-100 tracking-wide">
            Neural Insights Panel
          </h3>
          <div className="ml-2">
            <Activity size={12} className="text-purple-400 animate-pulse" />
          </div>
        </div>
        <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {/* AI Analysis Summary */}
            <div className="mb-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">AI Setup Analysis</div>
                <div className="text-xs font-bold text-emerald-400">Score: 92/100</div>
              </div>
              <div className="text-xs text-slate-300 mb-2">Trend-Follow Breakout</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Market Sentiment:</span>
                  <span className="ml-1 text-emerald-400 font-semibold">Bullish 85%</span>
                </div>
                <div>
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className="ml-1 text-amber-400 font-semibold">High</span>
                </div>
              </div>
            </div>

            {/* Mini Neural Network Visualization */}
            <div className="mb-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
              <div className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">Neural Flow</div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full opacity-70" />
                <div className="text-xs text-slate-400 tabular-nums">87% Confidence</div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {[0.92, 0.87, 0.95, 0.78, 0.89, 0.91].map((val, i) => (
                  <div key={i} className="h-8 bg-gradient-to-t from-blue-500/20 to-blue-500/5 rounded border border-blue-500/30 flex items-end justify-center pb-1">
                    <span className="text-xs text-blue-400 font-semibold tabular-nums">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3">
              {aiTabs.slice(0, 6).map(tab => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                    activeTab === tab.label
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  <tab.icon size={12} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-2 min-h-0">
              <ActiveContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIIntelligenceSuite;
