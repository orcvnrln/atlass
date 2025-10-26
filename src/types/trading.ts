// Core trading types for institutional dashboard

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema5?: number;
  ema10?: number;
  ema20?: number;
  ema50?: number;
  ema100?: number;
  ema200?: number;
}

export interface Signal {
  id: string;
  asset: string;
  timeframe: '15m' | '1h' | '4h' | '1d';
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number; // 0-1
  entry: number;
  stopLoss: number;
  takeProfit: number;
  takeProfit2?: number;
  takeProfit3?: number;
  rationale: SignalRationale[];
  riskMetrics: RiskMetrics;
  timestamp: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  pnl?: number;
  pnlPercent?: number;
}

export interface SignalRationale {
  feature: string;
  value: string;
  interpretation: string;
  impact: number; // 0-1
}

export interface RiskMetrics {
  expectedSlippage: number;
  recommendedSize: number;
  maxLeverage: number;
  liquidityScore: number;
  smartMoneyScore: number;
  newsSentiment: number;
  volumeStrength: number;
}

export interface OrderFlow {
  bidPrice: number;
  askPrice: number;
  bidVolume: number;
  askVolume: number;
  imbalance: number;
  largeTrades: LargeTrade[];
  liquidityProfile: LiquidityProfile;
  divergenceAlerts: DivergenceAlert[];
}

export interface LargeTrade {
  timestamp: number;
  size: number;
  price: number;
  type: 'BUY' | 'SELL';
  institutionType: 'Hedge Fund' | 'Market Maker' | 'Exchange' | 'Unknown';
}

export interface LiquidityProfile {
  highestVolumeZone: {
    priceMin: number;
    priceMax: number;
    volume: number;
    level: 'Support' | 'Resistance' | 'Neutral';
  };
  recommendation: string;
}

export interface DivergenceAlert {
  type: 'Price-Volume' | 'Price-Momentum' | 'Price-Sentiment';
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface SmartMoneyPattern {
  type: 'Accumulation' | 'Distribution' | 'Liquidity Grab' | 'Break & Retest' | 'Fair Value Gap';
  score: number; // 0-10
  evidence: string[];
  implication: string;
  probability: number; // 0-1
  zones?: {
    buy?: { min: number; max: number; probability: number };
    sell?: { min: number; max: number; probability: number };
    hold?: { min: number; max: number; probability: number };
  };
}

export interface Portfolio {
  totalValue: number;
  openPositions: number;
  totalRiskExposure: number;
  totalUnrealizedPnl: number;
  var1Day: number;
  expectedShortfall: number;
  positions: Position[];
  correlationRisk: CorrelationRisk[];
  alerts: RiskAlert[];
}

export interface Position {
  asset: string;
  size: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPercent: number;
  var1Day: number;
}

export interface CorrelationRisk {
  asset1: string;
  asset2: string;
  correlation: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface RiskAlert {
  type: 'VaR' | 'Correlation' | 'Liquidity' | 'Concentration';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  recommendation: string;
}

export interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  drawdownRecovery: number;
  calmarRatio: number;
  totalTrades: number;
  avgHoldTime: number;
  bestTrade: number;
  worstTrade: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  equityCurve: EquityPoint[];
  tradeList: Trade[];
}

export interface EquityPoint {
  date: string;
  balance: number;
}

export interface Trade {
  id: string;
  date: string;
  signal: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  riskReward: number;
  pnl: number;
  holdTime: number;
}

export interface StressTestScenario {
  name: string;
  description: string;
  btcChange: number;
  ethChange: number;
  eurChange: number;
  us10yChange: number;
  spyChange: number;
  volatilityMultiplier: number;
}

export interface StressTestResult {
  scenario: StressTestScenario;
  portfolioImpact: number;
  portfolioImpactPercent: number;
  positionImpacts: PositionImpact[];
  varBreached: boolean;
  correlationBreakdown: boolean;
  liquidityImpact: 'Low' | 'Medium' | 'High';
  timeToLiquidate: string;
}

export interface PositionImpact {
  asset: string;
  priceChange: number;
  valueChange: number;
  newValue: number;
}

export interface CorrelationMatrix {
  assets: string[];
  correlations: number[][];
  anomalies: CorrelationAnomaly[];
}

export interface CorrelationAnomaly {
  asset1: string;
  asset2: string;
  currentCorrelation: number;
  normalCorrelation: number;
  change: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface NewsImpact {
  headline: string;
  source: string;
  sentiment: number; // -1 to 1
  trust: number; // 0-1
  impactOnPrice: number; // expected % change
  timeHorizon: string; // e.g., "2h", "24h"
  confidence: number; // 0-1
}

export interface MultiTimeframeConfluence {
  score: number; // 0-10
  timeframes: {
    '15m': { signal: 'LONG' | 'SHORT' | 'NEUTRAL'; confidence: number };
    '1h': { signal: 'LONG' | 'SHORT' | 'NEUTRAL'; confidence: number };
    '4h': { signal: 'LONG' | 'SHORT' | 'NEUTRAL'; confidence: number };
    '1d': { signal: 'LONG' | 'SHORT' | 'NEUTRAL'; confidence: number };
  };
  overallBias: 'Bullish' | 'Bearish' | 'Neutral';
  bestTradingWindow: string;
  riskIncreaseAfter: string;
}
