/**
 * 🎯 TRADING CONSTANTS
 * 20 Trading Styles & 20 AI Functions
 */

export const TRADING_STYLES = [
  {
    id: 'scalping',
    name: 'Scalping',
    description: 'Ultra-short trades, 1-5 minute holds',
    icon: '⚡',
    strategies: ['Momentum', 'News Events', 'Range Trading'],
    riskProfile: 'high'
  },
  {
    id: 'day-trading',
    name: 'Day Trading',
    description: 'Same-day position entry and exit',
    icon: '📊',
    strategies: ['Breakout', 'Reversal', 'Mean Reversion'],
    riskProfile: 'high'
  },
  {
    id: 'swing-trading',
    name: 'Swing Trading',
    description: 'Multi-day to multi-week positions',
    icon: '📈',
    strategies: ['Trend Following', 'Counter-Trend', 'Range Trading'],
    riskProfile: 'medium'
  },
  {
    id: 'position-trading',
    name: 'Position Trading',
    description: 'Long-term positions, weeks to months',
    icon: '⏰',
    strategies: ['Trend Following', 'Value Investing', 'Macro Analysis'],
    riskProfile: 'low'
  },
  {
    id: 'smc-trading',
    name: 'Smart Money Concepts',
    description: 'Institutional order flow analysis',
    icon: '🎯',
    strategies: ['Order Blocks', 'Fair Value Gaps', 'Liquidity Pools'],
    riskProfile: 'medium'
  },
  {
    id: 'ict-trading',
    name: 'Inner Circle Trader',
    description: 'Bank dealer trading methodology',
    icon: '⚡',
    strategies: ['Optimal Trade Entry', 'Liquidity Voids', 'Market Structure'],
    riskProfile: 'medium'
  },
  {
    id: 'price-action',
    name: 'Price Action Trading',
    description: 'Pure price movement analysis',
    icon: '📊',
    strategies: ['Pin Bars', 'Inside Bars', 'Engulfing Patterns'],
    riskProfile: 'medium'
  },
  {
    id: 'fibonacci-trading',
    name: 'Fibonacci Trading',
    description: 'Golden ratio based trading',
    icon: '🌀',
    strategies: ['Retracement', 'Extension', 'Projection'],
    riskProfile: 'medium'
  },
  {
    id: 'harmonic-patterns',
    name: 'Harmonic Patterns',
    description: 'Gartley, Butterfly, Bat patterns',
    icon: '⭐',
    strategies: ['Gartley', 'Butterfly', 'Bat', 'Crab'],
    riskProfile: 'medium'
  },
  {
    id: 'volume-analysis',
    name: 'Volume Analysis',
    description: 'Volume profile and volume analysis',
    icon: '📊',
    strategies: ['Volume Profile', 'VWAP', 'Volume Clusters'],
    riskProfile: 'medium'
  },
  {
    id: 'momentum-trading',
    name: 'Momentum Trading',
    description: 'High momentum asset trading',
    icon: '🚀',
    strategies: ['RSI Divergence', 'MACD Crossover', 'Stochastic'],
    riskProfile: 'high'
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Trading against extreme moves',
    icon: '🔄',
    strategies: ['Bollinger Bands', 'RSI Oversold', 'Williams %R'],
    riskProfile: 'medium'
  },
  {
    id: 'breakout-trading',
    name: 'Breakout Trading',
    description: 'Trading range breakouts',
    icon: '💥',
    strategies: ['Consolidation Break', 'Flag Pattern', 'Triangle Break'],
    riskProfile: 'high'
  },
  {
    id: 'trend-following',
    name: 'Trend Following',
    description: 'Following established trends',
    icon: '📈',
    strategies: ['Moving Averages', 'ADX', 'Parabolic SAR'],
    riskProfile: 'medium'
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage',
    description: 'Exploiting price differences',
    icon: '💰',
    strategies: ['Statistical Arbitrage', 'Triangular Arbitrage', 'Cross-Market'],
    riskProfile: 'low'
  },
  {
    id: 'algorithmic-trading',
    name: 'Algorithmic Trading',
    description: 'Computer-driven trading systems',
    icon: '🤖',
    strategies: ['HFT', 'Mean Reversion Algo', 'Trend Following Algo'],
    riskProfile: 'medium'
  },
  {
    id: 'options-trading',
    name: 'Options Trading',
    description: 'Derivative trading strategies',
    icon: '📊',
    strategies: ['Covered Calls', 'Straddles', 'Iron Condors'],
    riskProfile: 'high'
  },
  {
    id: 'forex-trading',
    name: 'Forex Trading',
    description: 'Currency pair trading',
    icon: '💱',
    strategies: ['Carry Trade', 'News Trading', 'Range Trading'],
    riskProfile: 'high'
  },
  {
    id: 'crypto-trading',
    name: 'Crypto Trading',
    description: 'Cryptocurrency trading',
    icon: '₿',
    strategies: ['Altcoin Season', 'Bitcoin Dominance', 'DeFi Yield'],
    riskProfile: 'high'
  },
  {
    id: 'quantitative-trading',
    name: 'Quantitative Trading',
    description: 'Math-based trading models',
    icon: '🧮',
    strategies: ['Statistical Models', 'Machine Learning', 'Factor Investing'],
    riskProfile: 'medium'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// AI FUNCTIONS (20 Functions)
// ─────────────────────────────────────────────────────────────────────────────

export const AI_FUNCTIONS = [
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Complete market analysis with multiple indicators',
    icon: '📊',
    category: 'analysis',
    parameters: ['symbol', 'timeframe', 'indicators']
  },
  {
    id: 'risk-calculator',
    name: 'Risk Calculator',
    description: 'Calculate position size and risk management',
    icon: '🧮',
    category: 'calculation',
    parameters: ['accountSize', 'riskPercent', 'entryPrice', 'stopLoss']
  },
  {
    id: 'entry-signals',
    name: 'Entry Signals',
    description: 'Generate trading entry signals',
    icon: '🎯',
    category: 'analysis',
    parameters: ['strategy', 'confidence', 'timeframe']
  },
  {
    id: 'exit-signals',
    name: 'Exit Signals',
    description: 'Generate exit and profit taking signals',
    icon: '📈',
    category: 'analysis',
    parameters: ['position', 'profitTargets', 'stopLoss']
  },
  {
    id: 'alert-setup',
    name: 'Alert Setup',
    description: 'Create price and technical alerts',
    icon: '🔔',
    category: 'alert',
    parameters: ['condition', 'price', 'symbol', 'message']
  },
  {
    id: 'backtesting',
    name: 'Backtesting',
    description: 'Test trading strategies on historical data',
    icon: '📚',
    category: 'analysis',
    parameters: ['strategy', 'startDate', 'endDate', 'capital']
  },
  {
    id: 'portfolio-analysis',
    name: 'Portfolio Analysis',
    description: 'Analyze portfolio performance and allocation',
    icon: '🥧',
    category: 'analysis',
    parameters: ['holdings', 'benchmarks', 'timePeriod']
  },
  {
    id: 'correlation-matrix',
    name: 'Correlation Matrix',
    description: 'Calculate asset correlations',
    icon: '📊',
    category: 'analysis',
    parameters: ['assets', 'timeframe', 'method']
  },
  {
    id: 'volatility-analysis',
    name: 'Volatility Analysis',
    description: 'Analyze market volatility and risk',
    icon: '⚡',
    category: 'analysis',
    parameters: ['symbol', 'timeframe', 'volatilityType']
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze market sentiment from news and social',
    icon: '📈',
    category: 'analysis',
    parameters: ['symbol', 'sources', 'timeframe']
  },
  {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    description: 'Identify chart patterns and formations',
    icon: '🔍',
    category: 'analysis',
    parameters: ['patternType', 'confidence', 'timeframe']
  },
  {
    id: 'fibonacci-calculator',
    name: 'Fibonacci Calculator',
    description: 'Calculate Fibonacci levels and ratios',
    icon: '🧮',
    category: 'calculation',
    parameters: ['high', 'low', 'type']
  },
  {
    id: 'pivot-points',
    name: 'Pivot Points',
    description: 'Calculate support and resistance levels',
    icon: '🎯',
    category: 'calculation',
    parameters: ['high', 'low', 'close', 'type']
  },
  {
    id: 'position-sizing',
    name: 'Position Sizing',
    description: 'Calculate optimal position sizes',
    icon: '🧮',
    category: 'calculation',
    parameters: ['accountSize', 'riskPercent', 'stopLoss', 'entryPrice']
  },
  {
    id: 'performance-metrics',
    name: 'Performance Metrics',
    description: 'Calculate trading performance metrics',
    icon: '📊',
    category: 'analysis',
    parameters: ['trades', 'capital', 'timeframe']
  },
  {
    id: 'news-analysis',
    name: 'News Analysis',
    description: 'Analyze news impact on markets',
    icon: '📰',
    category: 'analysis',
    parameters: ['symbol', 'newsType', 'impactLevel']
  },
  {
    id: 'educational-content',
    name: 'Educational Content',
    description: 'Provide trading education and tutorials',
    icon: '📖',
    category: 'education',
    parameters: ['topic', 'difficulty', 'format']
  },
  {
    id: 'automated-trading',
    name: 'Automated Trading',
    description: 'Set up automated trading strategies',
    icon: '🤖',
    category: 'automation',
    parameters: ['strategy', 'parameters', 'riskLimits']
  },
  {
    id: 'market-scanner',
    name: 'Market Scanner',
    description: 'Scan markets for opportunities',
    icon: '🔍',
    category: 'analysis',
    parameters: ['filters', 'criteria', 'markets']
  },
  {
    id: 'trade-journal',
    name: 'Trade Journal',
    description: 'Maintain and analyze trading journal',
    icon: '📝',
    category: 'analysis',
    parameters: ['entry', 'exit', 'analysis', 'emotions']
  }
];
