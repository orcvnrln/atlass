import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface SmartMoneyTabProps {
  asset: string;
}

interface SmartMoneyPattern {
  type: string;
  score: number;
  evidence: string[];
  implication: string;
  probability: number;
  zones?: {
    buy?: { min: number; max: number; probability: number };
    sell?: { min: number; max: number; probability: number };
    hold?: { min: number; max: number; probability: number };
  };
}

const SmartMoneyTab: React.FC<SmartMoneyTabProps> = ({ asset }) => {
  const [patterns, setPatterns] = useState<SmartMoneyPattern[]>([
    {
      type: 'Accumulation Pattern',
      score: 9.1,
      evidence: [
        'Fair Value Gap left at $41,800 (institutional entry zone)',
        'Volume profile wick grabbed liquidity below support',
        'Large orderbook moves 30s before price moves',
        'New traders entering average: $42,150',
      ],
      implication: 'Smart money loading up → reversal likely',
      probability: 0.76,
      zones: {
        buy: { min: 41500, max: 41800, probability: 0.85 },
        sell: { min: 43500, max: 44000, probability: 0.65 },
        hold: { min: 42000, max: 43000, probability: 0.70 },
      },
    },
    {
      type: 'Liquidity Grab',
      score: 8.7,
      evidence: [
        '4 instances detected in last 2h',
        'Stops at $41,500 likely grabbed',
        'Quick reversal after liquidity grab',
      ],
      implication: 'Institutional manipulation for better entries',
      probability: 0.76,
    },
    {
      type: 'Break & Retest Pattern',
      score: 8.2,
      evidence: [
        'Broke above $42,000 resistance',
        'Retest in progress',
        'Institutional confirmation present',
      ],
      implication: 'If holds, continuation likely',
      probability: 0.68,
    },
  ]);

  const [timeframe, setTimeframe] = useState('4h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setPatterns(prev => prev.map(pattern => ({
        ...pattern,
        score: Math.max(0, Math.min(10, pattern.score + (Math.random() - 0.5) * 0.2)),
        probability: Math.max(0, Math.min(1, pattern.probability + (Math.random() - 0.5) * 0.05)),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    if (score >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 9) return 'bg-green-500/20';
    if (score >= 7) return 'bg-yellow-500/20';
    if (score >= 5) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-400';
    if (probability >= 0.6) return 'text-yellow-400';
    if (probability >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Brain size={24} className="text-purple-400" />
          Smart Money Patterns - {asset}
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-slate-100"
          >
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </button>
        </div>
      </div>

      {/* Pattern Cards */}
      <div className="space-y-4">
        {patterns.map((pattern, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400" />
                <h4 className="text-lg font-semibold text-slate-100">{pattern.type}</h4>
                <span className={`px-2 py-1 rounded text-sm font-bold ${getScoreBg(pattern.score)} ${getScoreColor(pattern.score)}`}>
                  Score: {pattern.score.toFixed(1)}/10
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Probability:</span>
                <span className={`font-bold ${getProbabilityColor(pattern.probability)}`}>
                  {(pattern.probability * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Evidence */}
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Evidence:</h5>
                <ul className="space-y-1">
                  {pattern.evidence.map((evidence, idx) => (
                    <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                      <span className="text-slate-500 mt-1">•</span>
                      <span>{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Implication */}
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-200">
                  <strong>Implication:</strong> {pattern.implication}
                </p>
              </div>

              {/* Smart Money Zones */}
              {pattern.zones && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-300 mb-3">Smart Money Zones (Next 24h Targets):</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pattern.zones.buy && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={16} className="text-green-400" />
                          <span className="text-sm font-semibold text-green-400">Buy Zone</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          ${pattern.zones.buy.min.toLocaleString()}-${pattern.zones.buy.max.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-400">
                          {(pattern.zones.buy.probability * 100).toFixed(0)}% probability
                        </div>
                      </div>
                    )}
                    {pattern.zones.sell && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingDown size={16} className="text-red-400" />
                          <span className="text-sm font-semibold text-red-400">Sell Zone</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          ${pattern.zones.sell.min.toLocaleString()}-${pattern.zones.sell.max.toLocaleString()}
                        </div>
                        <div className="text-xs text-red-400">
                          {(pattern.zones.sell.probability * 100).toFixed(0)}% probability
                        </div>
                      </div>
                    )}
                    {pattern.zones.hold && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Target size={16} className="text-blue-400" />
                          <span className="text-sm font-semibold text-blue-400">Hold Zone</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          ${pattern.zones.hold.min.toLocaleString()}-${pattern.zones.hold.max.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-400">
                          {(pattern.zones.hold.probability * 100).toFixed(0)}% probability
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Activity Summary */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-purple-400" />
          Institutional Activity Summary
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">$2.3M</div>
            <div className="text-xs text-slate-400">Buy Wall Detected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">5</div>
            <div className="text-xs text-slate-400">Large Trades (1h)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">9.2</div>
            <div className="text-xs text-slate-400">Smart Money Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">76%</div>
            <div className="text-xs text-slate-400">Reversal Probability</div>
          </div>
        </div>
      </div>

      {/* Real-time Alerts */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-400" />
          Real-time Smart Money Alerts
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Clock size={16} className="text-green-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-200">
                <strong>2 minutes ago:</strong> Large buy order detected at $42,100
              </p>
              <p className="text-xs text-slate-400">Institutional accumulation pattern confirmed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle size={16} className="text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-200">
                <strong>5 minutes ago:</strong> Fair Value Gap detected at $41,800
              </p>
              <p className="text-xs text-slate-400">Potential institutional entry zone</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Target size={16} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-200">
                <strong>8 minutes ago:</strong> Break and retest pattern forming
              </p>
              <p className="text-xs text-slate-400">Watch for continuation above $42,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMoneyTab;
