import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  Clock, TrendingUp, TrendingDown, Activity, BarChart3,
  CheckCircle, XCircle, AlertTriangle, Zap
} from 'lucide-react';

const MultiTimeframeAnalysis = ({ strategy, onAnalyze }) => {
  const [timeframes, setTimeframes] = useState(['1m', '5m', '15m', '1h', '4h', '1d']);
  const [selectedTimeframes, setSelectedTimeframes] = useState(['15m', '1h', '4h']);
  const [results, setResults] = useState(null);
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Run multi-timeframe analysis
  const runAnalysis = async () => {
    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      const mockResults = generateMockResults(selectedTimeframes);
      setResults(mockResults);
      setCorrelationMatrix(generateCorrelationMatrix(selectedTimeframes));
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockResults = (timeframes) => {
    return timeframes.map(tf => ({
      timeframe: tf,
      totalReturn: (Math.random() * 40 - 10).toFixed(2),
      winRate: (Math.random() * 30 + 50).toFixed(1),
      sharpeRatio: (Math.random() * 2).toFixed(2),
      maxDrawdown: (Math.random() * 20 + 5).toFixed(2),
      totalTrades: Math.floor(Math.random() * 200 + 50),
      profitFactor: (Math.random() * 2 + 0.5).toFixed(2),
      consistency: Math.random() > 0.5 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'
    }));
  };

  const generateCorrelationMatrix = (timeframes) => {
    const matrix = [];
    for (let i = 0; i < timeframes.length; i++) {
      const row = [];
      for (let j = 0; j < timeframes.length; j++) {
        if (i === j) {
          row.push(1.0);
        } else {
          // Higher correlation for adjacent timeframes
          const diff = Math.abs(i - j);
          row.push((1 - diff * 0.2 + Math.random() * 0.1).toFixed(2));
        }
      }
      matrix.push(row);
    }
    return matrix;
  };

  const toggleTimeframe = (tf) => {
    if (selectedTimeframes.includes(tf)) {
      setSelectedTimeframes(selectedTimeframes.filter(t => t !== tf));
    } else {
      setSelectedTimeframes([...selectedTimeframes, tf]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Multi-Timeframe Analysis</h2>
            <p className="text-gray-400">
              Test strategy performance across multiple timeframes and analyze correlations
            </p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || selectedTimeframes.length === 0}
            className="px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
        <h3 className="text-lg font-semibold text-white mb-4">Select Timeframes</h3>
        <div className="flex flex-wrap gap-3">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => toggleTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTimeframes.includes(tf)
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#0f172a] text-gray-400 hover:bg-[#0f172a]/80 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Performance Comparison */}
          <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#3b82f6]/30">
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Timeframe</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Total Return</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Win Rate</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Sharpe</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Max DD</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Trades</th>
                    <th className="text-center text-gray-400 font-medium py-3 px-4">Consistency</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-[#3b82f6]/10 hover:bg-[#3b82f6]/5">
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded font-medium">
                          {result.timeframe}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        parseFloat(result.totalReturn) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.totalReturn}%
                      </td>
                      <td className="py-3 px-4 text-right text-white">{result.winRate}%</td>
                      <td className="py-3 px-4 text-right text-white">{result.sharpeRatio}</td>
                      <td className="py-3 px-4 text-right text-red-400">{result.maxDrawdown}%</td>
                      <td className="py-3 px-4 text-right text-white">{result.totalTrades}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.consistency === 'High' ? 'bg-green-500/20 text-green-400' :
                          result.consistency === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {result.consistency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Correlation Matrix */}
          {correlationMatrix && (
            <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
              <h3 className="text-lg font-semibold text-white mb-4">Correlation Matrix</h3>
              <p className="text-sm text-gray-400 mb-4">
                Shows how returns correlate across different timeframes (1.0 = perfect correlation)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-medium py-2 px-3"></th>
                      {selectedTimeframes.map(tf => (
                        <th key={tf} className="text-center text-gray-400 font-medium py-2 px-3">
                          {tf}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {correlationMatrix.map((row, i) => (
                      <tr key={i}>
                        <td className="text-white font-medium py-2 px-3">
                          {selectedTimeframes[i]}
                        </td>
                        {row.map((value, j) => (
                          <td key={j} className="py-2 px-3">
                            <div
                              className="w-full h-10 flex items-center justify-center rounded font-medium text-sm"
                              style={{
                                backgroundColor: getCorrelationColor(parseFloat(value)),
                                color: parseFloat(value) > 0.5 ? '#fff' : '#000'
                              }}
                            >
                              {value}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Returns Comparison */}
            <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
              <h3 className="text-lg font-semibold text-white mb-4">Returns by Timeframe</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timeframe" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalReturn"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sharpe Ratio Comparison */}
            <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
              <h3 className="text-lg font-semibold text-white mb-4">Sharpe Ratio by Timeframe</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timeframe" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharpeRatio"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
            <h3 className="text-lg font-semibold text-white mb-4">Analysis & Recommendations</h3>
            <div className="space-y-4">
              {generateRecommendations(results).map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    rec.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                    rec.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {rec.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    ) : rec.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-white mb-1">{rec.title}</div>
                      <div className="text-sm text-gray-400">{rec.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper Functions
const getCorrelationColor = (value) => {
  // Color scale from red (low correlation) to green (high correlation)
  const r = Math.floor(255 * (1 - value));
  const g = Math.floor(255 * value);
  const b = 50;
  return `rgb(${r}, ${g}, ${b})`;
};

const generateRecommendations = (results) => {
  const recommendations = [];
  
  // Find best performing timeframe
  const bestTF = results.reduce((best, current) => 
    parseFloat(current.totalReturn) > parseFloat(best.totalReturn) ? current : best
  );
  
  recommendations.push({
    type: 'success',
    title: `Best Performance: ${bestTF.timeframe}`,
    description: `This timeframe showed the highest total return of ${bestTF.totalReturn}% with a Sharpe ratio of ${bestTF.sharpeRatio}.`
  });

  // Check for consistency
  const highConsistency = results.filter(r => r.consistency === 'High');
  if (highConsistency.length > 0) {
    recommendations.push({
      type: 'success',
      title: 'High Consistency Detected',
      description: `${highConsistency.length} timeframe(s) show high consistency, indicating robust strategy performance.`
    });
  }

  // Check for low win rates
  const lowWinRate = results.filter(r => parseFloat(r.winRate) < 50);
  if (lowWinRate.length > 0) {
    recommendations.push({
      type: 'warning',
      title: 'Low Win Rate Warning',
      description: `${lowWinRate.length} timeframe(s) have win rates below 50%. Consider adjusting entry/exit rules.`
    });
  }

  // Check for high drawdowns
  const highDD = results.filter(r => parseFloat(r.maxDrawdown) > 15);
  if (highDD.length > 0) {
    recommendations.push({
      type: 'danger',
      title: 'High Drawdown Risk',
      description: `${highDD.length} timeframe(s) show maximum drawdown above 15%. Review risk management settings.`
    });
  }

  return recommendations;
};

export default MultiTimeframeAnalysis;

