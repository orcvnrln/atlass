import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  Target
} from 'lucide-react';

// AI coaching data for each position
const positionCoachingData = {
  'BTC/USD': {
    advice: 'Qismən qazancınızı çıxarmağı düşünün',
    reasoning: 'Tarixi məlumatlara görə, bu səviyyədən sonra 60% hallarda 5% düzəliş olur.',
    confidence: 78,
    action: 'sell_partial',
    sources: [
      { type: 'technical', text: 'RSI 72 - Overbought zone' },
      { type: 'onchain', text: 'Whale akkumulyasiyası azalıb' },
      { type: 'historical', text: '$42,000 səviyyəsində tarixi müqavimət' }
    ],
    suggestedAction: {
      label: '30% Sat',
      target: '$41,500',
      stopLoss: '$43,200'
    }
  },
  'ETH/USD': {
    advice: 'Mövqeyi bağlamaq və ya stop-loss qoymaq tövsiyə olunur',
    reasoning: 'Ethereum ETF gözləntisi zəiflədi. On-chain aktivlik 30% azalıb.',
    confidence: 85,
    action: 'close_or_stop',
    sources: [
      { type: 'news', text: 'SEC ETF qərarını təxirə saldı' },
      { type: 'onchain', text: 'DEX volume 30% azalıb' },
      { type: 'sentiment', text: 'Twitter hissi -45% (qorxu)' }
    ],
    suggestedAction: {
      label: 'Stop-Loss Qoy',
      target: null,
      stopLoss: '$2,050'
    }
  },
  'AAPL': {
    advice: 'Mövqeyi saxlayın, lakin hedcinq düşünün',
    reasoning: 'AAPL fundamental güclüdür, amma makro risklər var (Fed hawkish stance).',
    confidence: 72,
    action: 'hold_hedge',
    sources: [
      { type: 'fundamental', text: 'Q4 earnings gözləntidən yaxşıdır' },
      { type: 'macro', text: 'Fed rəsmiləri "higher for longer" mesajı' },
      { type: 'technical', text: '200-day MA dəstəyi' }
    ],
    suggestedAction: {
      label: 'SPY Put Hedc',
      target: null,
      stopLoss: '$172'
    }
  },
  'EUR/USD': {
    advice: 'Pozisiya ölçüsünü artırın',
    reasoning: 'ECB dovşan, Fed şahin. EUR/USD support-da. Risk/reward əlverişlidir.',
    confidence: 68,
    action: 'add_position',
    sources: [
      { type: 'macro', text: 'ECB dovşan mövqedədir' },
      { type: 'technical', text: '1.0850 güclü support' },
      { type: 'sentiment', text: 'COT report: retail short, institutions long' }
    ],
    suggestedAction: {
      label: '50% Əlavə Et',
      target: '1.1050',
      stopLoss: '1.0820'
    }
  },
  'GOOGL': {
    advice: 'Qazancı qoruyun (trailing stop)',
    reasoning: 'Güclü performans göstərir, amma sektor rotasiyası riski var.',
    confidence: 75,
    action: 'trailing_stop',
    sources: [
      { type: 'fundamental', text: 'AI sərmayələri çox yüksəkdir' },
      { type: 'technical', text: 'Fibo 0.618 extension səviyyəsi' },
      { type: 'sector', text: 'Tech sektorunda profit-taking başlayıb' }
    ],
    suggestedAction: {
      label: '3% Trailing Stop',
      target: null,
      stopLoss: '$138.50'
    }
  }
};

const SourceBadge = ({ source }) => {
  const typeColors = {
    technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    onchain: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    news: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    sentiment: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    macro: 'bg-green-500/10 text-green-400 border-green-500/20',
    fundamental: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    historical: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    sector: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  };
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-medium ${typeColors[source.type]}`}>
      <span className="uppercase">{source.type}</span>
      <span>•</span>
      <span>{source.text}</span>
    </div>
  );
};

const CoachingCard = ({ symbol, pnl, pnlPercent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const coaching = positionCoachingData[symbol];
  
  if (!coaching) return null;
  
  const isPositive = pnl >= 0;
  
  // Action color coding
  const getActionColor = (action) => {
    switch (action) {
      case 'sell_partial':
      case 'close_or_stop':
        return { bg: 'bg-negative/10', text: 'text-negative', icon: TrendingDown };
      case 'hold_hedge':
      case 'trailing_stop':
        return { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Shield };
      case 'add_position':
        return { bg: 'bg-positive/10', text: 'text-positive', icon: TrendingUp };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: AlertTriangle };
    }
  };
  
  const actionStyle = getActionColor(coaching.action);
  const ActionIcon = actionStyle.icon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-border-color rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-color">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base text-text-primary">{symbol}</h4>
              <span className={`text-sm font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? '+' : ''}{pnlPercent}%
              </span>
            </div>
            
            <div className={`flex items-center gap-2 p-2 rounded-md ${actionStyle.bg}`}>
              <Brain className={`w-4 h-4 ${actionStyle.text}`} />
              <span className={`text-xs font-semibold ${actionStyle.text}`}>
                {coaching.advice}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-4"
          >
            {/* Reasoning */}
            <div>
              <h5 className="text-xs font-bold text-text-secondary uppercase mb-2">
                AI Məntiqi
              </h5>
              <p className="text-sm text-text-primary leading-relaxed">
                {coaching.reasoning}
              </p>
              
              {/* Confidence */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-text-secondary">Eminlik:</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all"
                    style={{ width: `${coaching.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-accent">
                  {coaching.confidence}%
                </span>
              </div>
            </div>
            
            {/* Sources */}
            <div>
              <h5 className="text-xs font-bold text-text-secondary uppercase mb-2 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Mənbələr
              </h5>
              <div className="space-y-1.5">
                {coaching.sources.map((source, index) => (
                  <SourceBadge key={index} source={source} />
                ))}
              </div>
            </div>
            
            {/* Suggested Action */}
            <div className={`p-3 rounded-lg ${actionStyle.bg} border border-opacity-20`}>
              <div className="flex items-center gap-2 mb-2">
                <ActionIcon className={`w-4 h-4 ${actionStyle.text}`} />
                <h5 className={`text-sm font-bold ${actionStyle.text}`}>
                  Tövsiyə olunan əməliyyat
                </h5>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Əməliyyat:</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {coaching.suggestedAction.label}
                  </span>
                </div>
                
                {coaching.suggestedAction.target && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Target:</span>
                    <span className="text-sm font-semibold text-positive">
                      {coaching.suggestedAction.target}
                    </span>
                  </div>
                )}
                
                {coaching.suggestedAction.stopLoss && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Stop-Loss:</span>
                    <span className="text-sm font-semibold text-negative">
                      {coaching.suggestedAction.stopLoss}
                    </span>
                  </div>
                )}
              </div>
              
              <button className={`w-full mt-3 px-4 py-2 rounded-lg ${actionStyle.bg} ${actionStyle.text} border ${actionStyle.text.replace('text-', 'border-')} font-bold text-sm hover:opacity-80 transition-opacity`}>
                Əmri Göndər
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PositionCoaching = ({ positions }) => {
  // Filter positions that have coaching data
  const positionsWithCoaching = positions.filter(p => positionCoachingData[p.symbol]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card-bg rounded-xl border border-border-color overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-color">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">AI Mövqe Məsləhətləri</h3>
              <p className="text-xs text-text-secondary">
                {positionsWithCoaching.length} mövqe üçün şəxsi tövsiyələr
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Real-time analiz</span>
          </div>
        </div>
      </div>
      
      {/* Coaching Cards */}
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
        {positionsWithCoaching.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Brain className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Hazırda məsləhət yoxdur</p>
            <p className="text-xs mt-1">AI mövqelərinizi analiz edir...</p>
          </div>
        ) : (
          positionsWithCoaching.map(position => (
            <CoachingCard 
              key={position.symbol}
              symbol={position.symbol}
              pnl={position.pnl}
              pnlPercent={position.pnlPercent}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default PositionCoaching;
