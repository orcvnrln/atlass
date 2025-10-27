/**
 * 🏛️ INSTITUTIONAL TRADING WORKSPACE
 * Professional AI-powered trading platform
 */

import React, { useState } from 'react';
import { AdvancedAITradingChart } from '@/components/Chart/AdvancedAITradingChart';
import { AIAnalysisPanel } from '@/components/ai/AIAnalysisPanel';
import { AITradingChatPanel } from '@/components/ai/AITradingChatPanel';
import { analyzeMarket, AIAnalysisResult } from '@/services/aiTradingAnalyzer';
import { useTradingStore } from '@/core/state/store';
import { Brain, BarChart3, Settings } from 'lucide-react';

const InstitutionalTradingWorkspace: React.FC = () => {
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const candles = useTradingStore((state) => state.candles);

  // AI Analysis Function
  const runAIAnalysis = () => {
    if (candles.length < 50) {
      alert('Need at least 50 candles for analysis');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeMarket(candles);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Brain className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold text-white">Institutional AI Trading Workspace</h1>
            <p className="text-sm text-slate-400">Professional AI-powered trading platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-800 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">AI ONLINE</span>
          </div>

          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 relative">
          <AdvancedAITradingChart />
          
          {/* AI Analysis Button */}
          <button
            onClick={runAIAnalysis}
            disabled={isAnalyzing || candles.length < 50}
            className={`
              absolute bottom-4 left-4 z-20
              px-4 py-2 rounded-lg font-medium text-sm
              flex items-center gap-2
              transition-all duration-200
              ${
                isAnalyzing
                  ? 'bg-gray-700 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }
              ${candles.length < 50 ? 'opacity-50 cursor-not-allowed' : ''}
              text-white shadow-lg
            `}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                AI Analysis
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Panel */}
        {showAIPanel && (
          <div className="w-96 border-l border-slate-800">
            <AIAnalysisPanel
              analysis={aiAnalysis}
              isAnalyzing={isAnalyzing}
              onRefresh={runAIAnalysis}
            />
          </div>
        )}
        
        {/* AI Panel Toggle Button */}
        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="absolute top-20 right-2 z-50 p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          title={showAIPanel ? 'Hide AI Panel' : 'Show AI Panel'}
        >
          <Brain className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* AI Trading Chat Panel */}
      <AITradingChatPanel />
    </div>
  );
};

export default InstitutionalTradingWorkspace;
