/**
 * 🤖 AI ANALYSIS PANEL
 * Comprehensive AI trading analysis with trade ideas, risk calculator, news, and alerts
 * Professional TradingView-style side panel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Shield,
  DollarSign,
  Activity,
  Bell,
  Newspaper,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  Play,
  Sparkles,
} from 'lucide-react';
import { AIAnalysisResult, TradeSetup } from '../../services/aiTradingAnalyzer';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AIAnalysisPanelProps {
  analysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
  onRefresh: () => void;
}

interface RiskCalculation {
  accountSize: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  riskAmount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  analysis,
  isAnalyzing,
  onRefresh,
}) => {
  const [expandedSetup, setExpandedSetup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trade-ideas' | 'risk' | 'news' | 'alerts'>('trade-ideas');
  const [riskCalc, setRiskCalc] = useState<Partial<RiskCalculation>>({
    accountSize: 10000,
    riskPercent: 2,
  });

  // ─── CONFIDENCE BAR ───
  const renderConfidenceBar = (confidence: number) => {
    const color =
      confidence >= 80
        ? 'bg-green-500'
        : confidence >= 60
        ? 'bg-yellow-500'
        : 'bg-red-500';

    return (
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color}`}
        />
      </div>
    );
  };

  // ─── QUICK SUMMARY SECTION ───
  const renderQuickSummary = () => {
    if (!analysis) return null;

    const sentimentColor =
      analysis.sentiment === 'bullish'
        ? 'text-green-400'
        : analysis.sentiment === 'bearish'
        ? 'text-red-400'
        : 'text-gray-400';

    const SentimentIcon =
      analysis.sentiment === 'bullish'
        ? TrendingUp
        : analysis.sentiment === 'bearish'
        ? TrendingDown
        : Activity;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SentimentIcon className={`w-5 h-5 ${sentimentColor}`} />
            <span className={`text-sm font-bold uppercase ${sentimentColor}`}>
              {analysis.sentiment}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Sparkles className="w-3 h-3" />
            {analysis.confidence}% confidence
          </div>
        </div>

        {/* Confidence Bar */}
        {renderConfidenceBar(analysis.confidence)}

        {/* Summary Text */}
        <p className="mt-3 text-xs text-gray-300 leading-relaxed">
          {analysis.summary}
        </p>
      </motion.div>
    );
  };

  // ─── TRADE IDEAS SECTION ───
  const renderTradeIdeas = () => {
    if (!analysis || analysis.tradeSetups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Target className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No trade setups available</p>
          <p className="text-gray-600 text-xs mt-1">Run AI analysis to generate ideas</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {analysis.tradeSetups.map((setup) => (
          <motion.div
            key={setup.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors"
          >
            {/* Card Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() =>
                setExpandedSetup(expandedSetup === setup.id ? null : setup.id)
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      setup.type === 'BUY'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {setup.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(setup.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{setup.confidence}%</span>
                  {expandedSetup === setup.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Technique */}
              <div className="text-sm font-semibold text-white mb-1">
                {setup.technique}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Entry: ${setup.entry.toFixed(2)}</span>
                <span className="text-blue-400">R/R: 1:{setup.riskReward.toFixed(2)}</span>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedSetup === setup.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-800"
                >
                  <div className="p-4 space-y-3">
                    {/* Levels */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">Entry</div>
                        <div className="text-sm font-mono text-white">
                          ${setup.entry.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">Stop Loss</div>
                        <div className="text-sm font-mono text-red-400">
                          ${setup.stopLoss.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">TP1</div>
                        <div className="text-sm font-mono text-green-400">
                          ${setup.takeProfit1.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">TP2</div>
                        <div className="text-sm font-mono text-green-400">
                          ${setup.takeProfit2.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-2 col-span-2">
                        <div className="text-xs text-gray-500 mb-1">TP3 (Final)</div>
                        <div className="text-sm font-mono text-green-400">
                          ${setup.takeProfit3.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-xs text-gray-500 mb-2 font-semibold">
                        AI Analysis
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {setup.reasoning}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2">
                        <Play className="w-3 h-3" />
                        Simulate
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors">
                        Execute
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  };

  // ─── RISK CALCULATOR SECTION ───
  const renderRiskCalculator = () => {
    const calculatePosition = () => {
      if (!riskCalc.accountSize || !riskCalc.riskPercent || !riskCalc.entryPrice || !riskCalc.stopLoss) {
        return null;
      }

      const riskAmount = (riskCalc.accountSize * riskCalc.riskPercent) / 100;
      const riskPerUnit = Math.abs(riskCalc.entryPrice - riskCalc.stopLoss);
      const positionSize = riskAmount / riskPerUnit;

      return {
        positionSize: positionSize.toFixed(4),
        riskAmount: riskAmount.toFixed(2),
        positionValue: (positionSize * riskCalc.entryPrice).toFixed(2),
      };
    };

    const result = calculatePosition();

    return (
      <div className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Account Size ($)</label>
            <input
              type="number"
              value={riskCalc.accountSize || ''}
              onChange={(e) =>
                setRiskCalc({ ...riskCalc, accountSize: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Risk (%)</label>
            <input
              type="number"
              step="0.1"
              value={riskCalc.riskPercent || ''}
              onChange={(e) =>
                setRiskCalc({ ...riskCalc, riskPercent: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              placeholder="2"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Entry Price ($)</label>
            <input
              type="number"
              value={riskCalc.entryPrice || ''}
              onChange={(e) =>
                setRiskCalc({ ...riskCalc, entryPrice: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Stop Loss ($)</label>
            <input
              type="number"
              value={riskCalc.stopLoss || ''}
              onChange={(e) =>
                setRiskCalc({ ...riskCalc, stopLoss: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:border-blue-500 focus:outline-none"
              placeholder="49000"
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/50 rounded-lg p-4 space-y-2"
          >
            <div className="text-xs text-gray-400 font-semibold mb-3">
              Calculated Position
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Position Size:</span>
              <span className="text-sm font-mono text-white">{result.positionSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Position Value:</span>
              <span className="text-sm font-mono text-white">${result.positionValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Risk Amount:</span>
              <span className="text-sm font-mono text-red-400">${result.riskAmount}</span>
            </div>
          </motion.div>
        )}

        {/* Risk Zones Button */}
        <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Show Risk Zone on Chart
        </button>
      </div>
    );
  };

  // ─── NEWS & ALERTS SECTION ───
  const renderNewsAlerts = () => {
    const mockNews = [
      {
        id: 1,
        title: 'BTC halving expected in 2024',
        impact: 'high',
        time: '2h ago',
      },
      {
        id: 2,
        title: 'Fed rate decision tomorrow',
        impact: 'medium',
        time: '5h ago',
      },
      {
        id: 3,
        title: 'Ethereum ETF approved',
        impact: 'high',
        time: '1d ago',
      },
    ];

    return (
      <div className="space-y-3">
        {mockNews.map((news) => (
          <div
            key={news.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-sm text-white font-medium mb-1">{news.title}</div>
                <div className="text-xs text-gray-500">{news.time}</div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  news.impact === 'high'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {news.impact}
              </span>
            </div>
          </div>
        ))}

        {/* Alert Builder */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
          <div className="text-sm text-white font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Create Alert
          </div>
          <div className="space-y-2">
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white">
              <option>Price crosses above...</option>
              <option>Order Block detected</option>
              <option>BOS confirmation</option>
              <option>RSI oversold</option>
            </select>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
              Create Alert
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER ───
  return (
    <div className="w-96 h-full bg-gray-950 border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          AI Analysis
        </h2>
        <button
          onClick={onRefresh}
          disabled={isAnalyzing}
          className="p-1.5 hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-400 ${isAnalyzing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Quick Summary */}
      {analysis && <div className="p-4">{renderQuickSummary()}</div>}

      {/* Tabs */}
      <div className="px-4 flex gap-1 border-b border-gray-800">
        {[
          { id: 'trade-ideas', label: 'Trade Ideas', icon: Target },
          { id: 'risk', label: 'Risk', icon: Shield },
          { id: 'news', label: 'News', icon: Newspaper },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'trade-ideas' && renderTradeIdeas()}
        {activeTab === 'risk' && renderRiskCalculator()}
        {activeTab === 'news' && renderNewsAlerts()}
      </div>

      {/* Risks & Opportunities Footer */}
      {analysis && (
        <div className="p-4 border-t border-gray-800 space-y-3">
          {/* Risks */}
          {analysis.risks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs text-red-400 font-semibold mb-2">
                <AlertTriangle className="w-3 h-3" />
                Risks
              </div>
              {analysis.risks.map((risk, i) => (
                <div key={i} className="text-xs text-gray-400 ml-5 mb-1">
                  • {risk}
                </div>
              ))}
            </div>
          )}

          {/* Opportunities */}
          {analysis.opportunities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs text-green-400 font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Opportunities
              </div>
              {analysis.opportunities.map((opp, i) => (
                <div key={i} className="text-xs text-gray-400 ml-5 mb-1">
                  • {opp}
                </div>
              ))}
            </div>
          )}

          {/* Export Report */}
          <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Export Report
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
