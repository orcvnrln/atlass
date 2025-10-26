/**
 * 📊 COMPREHENSIVE TYPE DEFINITIONS
 * Bloomberg Terminal Pro - Market Data Types
 */

export type AssetCategory = 'forex' | 'crypto' | 'metals' | 'indices' | 'commodities' | 'stocks';
export type SentimentType = 'Bullish' | 'Bearish' | 'Neutral';
export type AnalystRating = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';

// ─────────────────────────────────────────────────────────────────────────────
// BASE ASSET INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface BaseAsset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sparklineData: number[];
  high52Week: number;
  low52Week: number;
  sentiment: SentimentType;
}

// ─────────────────────────────────────────────────────────────────────────────
// FOREX ASSET
// ─────────────────────────────────────────────────────────────────────────────

export interface ForexAsset extends BaseAsset {
  category: 'forex';
  baseCurrency: string;
  quoteCurrency: string;
  spread: number;
  swapLong: number;
  swapShort: number;
  marginRequirement: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CRYPTO ASSET
// ─────────────────────────────────────────────────────────────────────────────

export interface CryptoAsset extends BaseAsset {
  category: 'crypto';
  marketCap: number;
  circulatingSupply: number;
  maxSupply?: number;
  volume24h: number;
  dominance: number;
  volatility: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// METAL ASSET
// ─────────────────────────────────────────────────────────────────────────────

export interface MetalAsset extends BaseAsset {
  category: 'metals';
  purity: number; // e.g., 99.9 for gold
  weight: number; // in ounces
  storageCost: number;
  deliveryCost: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// INDEX ASSET
// ─────────────────────────────────────────────────────────────────────────────

export interface IndexAsset extends BaseAsset {
  category: 'indices';
  country: string;
  sector: string;
  numberOfComponents: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMODITY ASSET
// ─────────────────────────────────────────────────────────────────────────────

export interface CommodityAsset extends BaseAsset {
  category: 'commodities';
  unit: string; // e.g., 'barrel', 'bushel', 'pound'
  contractSize: number;
  deliveryMonth: string;
  storageLocation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOCK ASSET (COMPREHENSIVE)
// ─────────────────────────────────────────────────────────────────────────────

export interface StockAsset extends BaseAsset {
  category: 'stocks';
  
  // Market Data
  marketCap: number;
  sector: string;
  industry: string;
  analystRating: AnalystRating;
  
  // Valuation Metrics
  pe: number;
  peg: number;
  ps: number;
  pb: number;
  
  // Performance Metrics
  returnYTD: number;
  return1M: number;
  return3M: number;
  return6M: number;
  return1Y: number;
  return3Y: number;
  
  // Dividend Information
  dividendYield: number;
  payoutRatio: number;
  
  // Profitability Metrics
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  roe: number; // Return on Equity
  roa: number; // Return on Assets
  
  // Revenue & Earnings
  revenue: number;
  revenueGrowth: number;
  netIncome: number;
  eps: number; // Earnings Per Share
  epsGrowth: number;
  
  // Balance Sheet
  totalAssets: number;
  totalDebt: number;
  cash: number;
  bookValue: number;
  
  // Cash Flow
  operatingCF: number; // Operating Cash Flow
  freeCF: number; // Free Cash Flow
  cfGrowth: number; // Cash Flow Growth
  
  // Technical Indicators
  rsi: number;
  macd: number;
  sma50: number;
  sma200: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
}

// ─────────────────────────────────────────────────────────────────────────────
// UNION TYPE FOR ALL ASSETS
// ─────────────────────────────────────────────────────────────────────────────

export type Asset = ForexAsset | CryptoAsset | MetalAsset | IndexAsset | CommodityAsset | StockAsset;

// ─────────────────────────────────────────────────────────────────────────────
// MARKET DATA INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface MarketData {
  assets: Asset[];
  lastUpdate: number;
  totalAssets: number;
  categories: {
    forex: number;
    crypto: number;
    metals: number;
    indices: number;
    commodities: number;
    stocks: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SPARKLINE DATA GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export interface SparklineConfig {
  points: number;
  volatility: number;
  trend: 'up' | 'down' | 'sideways';
  basePrice: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AssetSymbol = string;
export type AssetId = string;
export type Price = number;
export type Volume = string;
export type Percentage = number;
