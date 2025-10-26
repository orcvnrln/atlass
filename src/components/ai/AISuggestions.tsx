/**
 * 🤖 AI SUGGESTIONS PANEL
 * AI-generated trade signals və analysis
 * Bloomberg Terminal tərzi professional UI
 */

import React, { useState } from 'react';
import { useTradingStore } from '../../core/state/store';
import { aiService } from '../../core/services/aiService';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AISuggestions: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState('');

  // State
  const signals = useTradingStore((state) => state.signals);
  const isThinking = useTradingStore((state) => state.isThinking);
  const symbol = useTradingStore((state) => state.symbol);
  const timeframe = useTradingStore((state) => state.timeframe);
  const candles = useTradingStore((state) => state.candles);
  const currentPrice = useTradingStore((state) => state.currentPrice);

  // ─── HANDLERS ───
  const handleAnalyze = async () => {
    if (candles.length === 0) {
      alert('No chart data available');
      return;
    }

    await aiService.analyzeMarket({
      symbol,
      timeframe,
      candles,
      currentPrice,
      context: userPrompt || undefined,
    });

    setUserPrompt('');
  };

  // ─── RENDER ───
  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
          AI Co-Pilot
        </h2>
      </div>

      {/* Input */}
      <div className="p-4 border-b border-gray-800">
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Ask AI for analysis... (optional)"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          disabled={isThinking}
        />
        <button
          onClick={handleAnalyze}
          disabled={isThinking || candles.length === 0}
          className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isThinking ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze Market'
          )}
        </button>
      </div>

      {/* Signals */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {signals.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No AI signals yet</p>
            <p className="text-gray-600 text-xs mt-1">Click "Analyze Market" to get started</p>
          </div>
        )}

        {signals.map((signal) => (
          <div
            key={signal.id}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    signal.side === 'BUY'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {signal.side}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(signal.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-400">{signal.confidence}%</span>
              </div>
            </div>

            {/* Levels */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Entry</span>
                <span className="text-gray-200 font-mono">{signal.entry.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Stop Loss</span>
                <span className="text-red-400 font-mono">{signal.stopLoss.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Take Profit</span>
                <span className="text-green-400 font-mono">{signal.takeProfit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">R/R Ratio</span>
                <span className="text-blue-400 font-mono">1:{signal.rrRatio.toFixed(2)}</span>
              </div>
            </div>

            {/* Reasoning */}
            <div className="pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400 leading-relaxed">{signal.reasoning}</p>
            </div>

            {/* Action */}
            <button
              className="mt-3 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors"
              onClick={() => {
                // TODO: Pre-fill order panel
                console.log('Use signal:', signal);
              }}
            >
              Use This Signal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

