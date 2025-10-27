// This file will house client-side calculation logic.
// For example: Sharpe Ratio, VaR, Max Drawdown, etc.

// This file will house client-side calculation logic.
// For example: Sharpe Ratio, VaR, Max Drawdown, etc.

import { holdings, historicalPerformance } from './mockData';

// Calculate portfolio Value at Risk (VaR) - 95% confidence, 1-day horizon
export const calculateVaR = (confidenceLevel = 0.95): number => {
  const returns = historicalPerformance.slice(1).map((day, i) =>
    (day.portfolioValue - historicalPerformance[i].portfolioValue) / historicalPerformance[i].portfolioValue
  );

  returns.sort((a, b) => a - b);
  const varIndex = Math.floor((1 - confidenceLevel) * returns.length);
  const currentValue = historicalPerformance[historicalPerformance.length - 1].portfolioValue;

  return Math.abs(returns[varIndex] * currentValue);
};

// Calculate Sharpe Ratio (annualized)
export const calculateSharpeRatio = (riskFreeRate = 0.045): number => {
  const returns = historicalPerformance.slice(1).map((day, i) =>
    (day.portfolioValue - historicalPerformance[i].portfolioValue) / historicalPerformance[i].portfolioValue
  );

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  // Annualize (252 trading days)
  const annualizedReturn = avgReturn * 252;
  const annualizedVolatility = volatility * Math.sqrt(252);

  return (annualizedReturn - riskFreeRate) / annualizedVolatility;
};

// Calculate Maximum Drawdown
export const calculateMaxDrawdown = (): { maxDD: number, peak: number, trough: number } => {
  let peak = historicalPerformance[0].portfolioValue;
  let maxDrawdown = 0;
  let peakIndex = 0;
  let troughIndex = 0;

  historicalPerformance.forEach((day, i) => {
    if (day.portfolioValue > peak) {
      peak = day.portfolioValue;
      peakIndex = i;
    }
    const drawdown = (peak - day.portfolioValue) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      troughIndex = i;
    }
  });

  return {
    maxDD: maxDrawdown,
    peak: peakIndex,
    trough: troughIndex
  };
};

// Calculate Beta vs S&P 500
export const calculateBeta = (): number => {
  const portfolioReturns = historicalPerformance.slice(1).map((day, i) =>
    (day.portfolioValue - historicalPerformance[i].portfolioValue) / historicalPerformance[i].portfolioValue
  );

  const benchmarkReturns = historicalPerformance.slice(1).map((day, i) =>
    (day.benchmarkValue - historicalPerformance[i].benchmarkValue) / historicalPerformance[i].benchmarkValue
  );

  const portfolioMean = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
  const benchmarkMean = benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length;

  let covariance = 0;
  let benchmarkVariance = 0;

  for (let i = 0; i < portfolioReturns.length; i++) {
    covariance += (portfolioReturns[i] - portfolioMean) * (benchmarkReturns[i] - benchmarkMean);
    benchmarkVariance += Math.pow(benchmarkReturns[i] - benchmarkMean, 2);
  }

  // Avoid division by zero if benchmark variance is zero
  if (benchmarkVariance === 0) {
    return 0;
  }
  return covariance / benchmarkVariance;
};

// Calculate Information Ratio (Active Return / Tracking Error)
export const calculateInformationRatio = (): number => {
  const portfolioReturns = historicalPerformance.slice(1).map((day, i) =>
    (day.portfolioValue - historicalPerformance[i].portfolioValue) / historicalPerformance[i].portfolioValue
  );

  const benchmarkReturns = historicalPerformance.slice(1).map((day, i) =>
    (day.benchmarkValue - historicalPerformance[i].benchmarkValue) / historicalPerformance[i].benchmarkValue
  );

  const activeReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
  const avgActiveReturn = activeReturns.reduce((sum, r) => sum + r, 0) / activeReturns.length;

  const trackingError = Math.sqrt(
    activeReturns.reduce((sum, r) => sum + Math.pow(r - avgActiveReturn, 2), 0) / activeReturns.length
  );

  return avgActiveReturn / trackingError;
};

// Calculate portfolio concentration (Herfindahl-Hirschman Index)
export const calculateConcentration = (): number => {
  return holdings.reduce((sum, holding) => {
    const weight = holding.portfolioPercentage / 100;
    return sum + Math.pow(weight, 2);
  }, 0);
};

// Stress test scenarios
export const stressTestScenarios = {
  marketCrash: { stocks: -0.20, crypto: -0.35, forex: 0.05, commodities: -0.10, bonds: 0.02 },
  cryptoWinter: { stocks: -0.05, crypto: -0.50, forex: 0.02, commodities: 0.05, bonds: 0.03 },
  dollarSurge: { stocks: -0.03, crypto: -0.08, forex: -0.15, commodities: -0.05, bonds: 0.01 },
  inflationShock: { stocks: -0.08, crypto: 0.10, forex: -0.05, commodities: 0.25, bonds: -0.12 },
};

export const runStressTest = (scenario: keyof typeof stressTestScenarios): number => {
  const shocks = stressTestScenarios[scenario];
  let totalImpact = 0;

  holdings.forEach(holding => {
    const assetClassKey = holding.assetClass.toLowerCase() as keyof typeof shocks;
    const shock = shocks[assetClassKey] || 0;
    const impact = (holding.portfolioPercentage / 100) * shock;
    totalImpact += impact;
  });

  return totalImpact;
};
