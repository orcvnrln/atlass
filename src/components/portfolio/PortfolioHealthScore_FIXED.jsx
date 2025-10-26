import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  TrendingUp, 
  Shield, 
  PieChart, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb
} from 'lucide-react';

// Calculate health score based on multiple factors
const calculateHealthScore = (portfolio) => {
  let score = 100;
  const factors = [];
  
  // Factor 1: Diversification (30 points)
  const cryptoAllocation = 29.9;
  if (cryptoAllocation > 25) {
    const penalty = Math.min((cryptoAllocation - 25) * 2, 30);
    score -= penalty;
    factors.push({
      name: 'Kripto Ağırlığı',
      impact: -penalty,
      message: `Kripto ${cryptoAllocation}% (optimal: ≤25%)`,
      severity: penalty > 15 ? 'high' : 'medium'
    });
  } else {
    factors.push({
      name: 'Kripto Ağırlığı',
      impact: +5,
      message: `Kripto ${cryptoAllocation}% - Yaxşı balans`,
      severity: 'good'
    });
  }
  
  // Factor 2: Risk/Return Ratio (25 points)
  const sharpeRatio = 1.84;
  const beta = 1.24;
  
  if (sharpeRatio > 1.5) {
    factors.push({
      name: 'Sharpe Ratio',
      impact: +10,
      message: `Sharpe ${sharpeRatio} - Əla risk-adjusted return`,
      severity: 'good'
    });
  }
  
  if (beta > 1.2) {
    const penalty = Math.min((beta - 1.0) * 10, 15);
    score -= penalty;
    factors.push({
      name: 'Beta Volatility',
      impact: -penalty,
      message: `Beta ${beta} - Yüksək volatillik`,
      severity: 'medium'
    });
  }
  
  // Factor 3: Profit/Loss Asymmetry (20 points)
  const winRate = 73.2;
  if (winRate > 70) {
    factors.push({
      name: 'Win Rate',
      impact: +10,
      message: `${winRate}% win rate - Əla`,
      severity: 'good'
    });
  } else if (winRate < 50) {
    score -= 15;
    factors.push({
      name: 'Win Rate',
      impact: -15,
      message: `${winRate}% win rate - Aşağı`,
      severity: 'high'
    });
  }
  
  // Factor 4: Concentration Risk (15 points)
  const maxPositionSize = 12; // TSLA 12%
  if (maxPositionSize > 10) {
    const penalty = Math.min((maxPositionSize - 10) * 3, 15);
    score -= penalty;
    factors.push({
      name: 'Konsentrasiya Riski',
      impact: -penalty,
      message: `Ən böyük mövqe ${maxPositionSize}% (optimal: ≤10%)`,
      severity: 'high'
    });
  }
  
  // Factor 5: Macro Alignment (10 points)
  // Simulated: current macro regime is "risk-off"
  const macroRegime = 'risk-off';
  if (macroRegime === 'risk-off' && cryptoAllocation > 20) {
    score -= 10;
    factors.push({
      name: 'Makro Uyğunluq',
      impact: -10,
      message: `Risk-off rejimdə kripto ağırlığı yüksək`,
      severity: 'medium'
    });
  }
  
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    factors,
    grade: score >= 80 ? 'Əla' : score >= 60 ? 'Yaxşı' : score >= 40 ? 'Orta' : 'Zəif'
  };
};

const PortfolioHealthScore = () => {
  const [healthData, setHealthData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Calculate health score
    const result = calculateHealthScore({});
    setHealthData(result);
  }, []);
  
  if (!healthData) return null;
  
  const { score, factors, grade } = healthData;
  
  // Color coding
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-positive/10', text: 'text-positive', border: 'border-positive/20', ring: 'ring-positive' };
    if (score >= 60) return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', ring: 'ring-blue-500' };
    if (score >= 40) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', ring: 'ring-amber-500' };
    return { bg: 'bg-negative/10', text: 'text-negative', border: 'border-negative/20', ring: 'ring-negative' };
  };
  
  const colors = getScoreColor(score);
  
  // Get icon based on severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-positive" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'high':
        return <XCircle className="w-4 h-4 text-negative" />;
      default:
        return <Info className="w-4 h-4 text-text-secondary" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-card-bg rounded-xl border ${colors.border} overflow-hidden`}
    >
      {/* Header - Score Display */}
      <div className={`${colors.bg} p-6 border-b ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative w-24 h-24`}>
              {/* Circular Progress */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                  className={colors.text}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Score in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${colors.text}`}>{score}</div>
                  <div className="text-[10px] text-text-secondary">/ 100</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className={`w-5 h-5 ${colors.text}`} />
                <h3 className="text-xl font-bold text-text-primary">Portfel Sağlamlıq Skoru</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${colors.text}`}>{grade}</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary">AI tərəfindən qiymətləndirildi</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            {isExpanded ? 'Gizlət' : 'Ətraflı'}
          </button>
        </div>
        
        {/* Quick Summary */}
        <div className="mt-4 p-3 rounded-lg bg-white/5">
          <p className="text-sm text-text-secondary leading-relaxed">
            {score >= 80 ? (
              <>✅ Portfeliniz sağlamdır! Diversifikasiya yaxşı, risk-adjusted returns əladır.</>
            ) : score >= 60 ? (
              <>🟡 Portfeliniz yaxşıdır, amma bəzi təkmilləşdirmələr tövsiyə olunur.</>
            ) : (
              <>⚠️ Portfelinizin sağlamlığı orta səviyyədədir. Diqqət tələb edən sahələr var.</>
            )}
          </p>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-6 space-y-4"
        >
          <h4 className="font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sağlamlıq Faktorları
          </h4>
          
          {/* Factors List */}
          <div className="space-y-3">
            {factors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
              >
                {getSeverityIcon(factor.severity)}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-text-primary">
                      {factor.name}
                    </span>
                    <span className={`text-xs font-bold ${
                      factor.impact > 0 ? 'text-positive' : 'text-negative'
                    }`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact} bal
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {factor.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Recommendations */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h5 className="font-bold text-sm text-blue-400 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI Tövsiyələri
            </h5>
            <ul className="space-y-2 text-xs text-blue-300">
              {score < 80 && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Kripto ağırlığını 29.9%-dən 20%-ə endirin (10% bonitetlərə keçin)</span>
                  </li>
                  {factors.find(f => f.name === 'Konsentrasiya Riski') && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>TSLA mövqeyini 12%-dən 8%-ə azaldın (risk azalması)</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Makro rejim "risk-off" olduğundan defensiv aktivlər əlavə edin</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Historical Trend */}
          <div className="pt-4 border-t border-border-color">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Son 30 gündə dəyişiklik:</span>
              <span className="text-positive">+5 bal ↑</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PortfolioHealthScore;
