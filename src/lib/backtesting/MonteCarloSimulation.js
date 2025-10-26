/**
 * Monte Carlo Simulation Engine
 * Performs risk analysis through randomized trade sequences
 */

export class MonteCarloSimulation {
  constructor(config = {}) {
    this.config = {
      numSimulations: config.numSimulations || 1000,
      confidenceLevel: config.confidenceLevel || 0.95,
      randomSeed: config.randomSeed || null,
      ...config
    };
    
    this.simulations = [];
  }

  /**
   * Run Monte Carlo simulation on backtest results
   * @param {Array} trades - Historical trades from backtest
   * @param {Number} initialCapital - Starting capital
   * @returns {Object} Monte Carlo simulation results
   */
  run(trades, initialCapital = 10000) {
    console.log(`Running ${this.config.numSimulations} Monte Carlo simulations...`);
    
    if (!trades || trades.length === 0) {
      throw new Error('No trades provided for Monte Carlo simulation');
    }

    this.simulations = [];
    
    for (let i = 0; i < this.config.numSimulations; i++) {
      const simulation = this.runSingleSimulation(trades, initialCapital);
      this.simulations.push(simulation);
    }

    return this.analyzeResults(initialCapital);
  }

  /**
   * Run a single Monte Carlo simulation
   */
  runSingleSimulation(trades, initialCapital) {
    // Randomly shuffle trades
    const shuffledTrades = this.shuffleTrades([...trades]);
    
    let capital = initialCapital;
    const equity = [capital];
    let peak = capital;
    let maxDrawdown = 0;
    
    for (const trade of shuffledTrades) {
      // Apply trade result
      capital += trade.pnl;
      equity.push(capital);
      
      // Track drawdown
      if (capital > peak) {
        peak = capital;
      }
      
      const drawdown = ((peak - capital) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
      
      // Check for ruin
      if (capital <= 0) {
        break;
      }
    }
    
    const finalReturn = ((capital - initialCapital) / initialCapital) * 100;
    
    return {
      equity: equity,
      finalCapital: capital,
      finalReturn: finalReturn,
      maxDrawdown: maxDrawdown,
      ruined: capital <= 0,
      trades: shuffledTrades.length
    };
  }

  /**
   * Shuffle trades randomly
   */
  shuffleTrades(trades) {
    // Fisher-Yates shuffle
    for (let i = trades.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [trades[i], trades[j]] = [trades[j], trades[i]];
    }
    return trades;
  }

  /**
   * Analyze Monte Carlo simulation results
   */
  analyzeResults(initialCapital) {
    const finalReturns = this.simulations.map(s => s.finalReturn).sort((a, b) => a - b);
    const maxDrawdowns = this.simulations.map(s => s.maxDrawdown).sort((a, b) => a - b);
    const finalCapitals = this.simulations.map(s => s.finalCapital).sort((a, b) => a - b);
    
    const ruinedCount = this.simulations.filter(s => s.ruined).length;
    const profitableCount = this.simulations.filter(s => s.finalReturn > 0).length;
    
    // Calculate percentiles
    const percentiles = [0.01, 0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95, 0.99];
    const returnPercentiles = {};
    const drawdownPercentiles = {};
    const capitalPercentiles = {};
    
    percentiles.forEach(p => {
      const index = Math.floor(p * this.simulations.length);
      returnPercentiles[`p${p * 100}`] = finalReturns[index];
      drawdownPercentiles[`p${p * 100}`] = maxDrawdowns[index];
      capitalPercentiles[`p${p * 100}`] = finalCapitals[index];
    });
    
    // Calculate confidence intervals
    const confidenceIndex = Math.floor((1 - this.config.confidenceLevel) / 2 * this.simulations.length);
    const upperConfidenceIndex = Math.floor((1 - (1 - this.config.confidenceLevel) / 2) * this.simulations.length);
    
    return {
      summary: {
        numSimulations: this.config.numSimulations,
        initialCapital: initialCapital,
        ruinProbability: (ruinedCount / this.config.numSimulations) * 100,
        profitProbability: (profitableCount / this.config.numSimulations) * 100,
        avgFinalReturn: this.calculateMean(finalReturns),
        medianFinalReturn: finalReturns[Math.floor(finalReturns.length / 2)],
        avgMaxDrawdown: this.calculateMean(maxDrawdowns),
        medianMaxDrawdown: maxDrawdowns[Math.floor(maxDrawdowns.length / 2)]
      },
      returns: {
        percentiles: returnPercentiles,
        confidenceInterval: {
          level: this.config.confidenceLevel,
          lower: finalReturns[confidenceIndex],
          upper: finalReturns[upperConfidenceIndex]
        },
        min: finalReturns[0],
        max: finalReturns[finalReturns.length - 1],
        stdDev: this.calculateStdDev(finalReturns)
      },
      drawdowns: {
        percentiles: drawdownPercentiles,
        confidenceInterval: {
          level: this.config.confidenceLevel,
          lower: maxDrawdowns[confidenceIndex],
          upper: maxDrawdowns[upperConfidenceIndex]
        },
        min: maxDrawdowns[0],
        max: maxDrawdowns[maxDrawdowns.length - 1],
        stdDev: this.calculateStdDev(maxDrawdowns)
      },
      capital: {
        percentiles: capitalPercentiles,
        confidenceInterval: {
          level: this.config.confidenceLevel,
          lower: finalCapitals[confidenceIndex],
          upper: finalCapitals[upperConfidenceIndex]
        },
        min: finalCapitals[0],
        max: finalCapitals[finalCapitals.length - 1]
      },
      riskMetrics: this.calculateRiskMetrics(finalReturns, maxDrawdowns),
      charts: this.prepareChartData()
    };
  }

  /**
   * Calculate risk metrics
   */
  calculateRiskMetrics(returns, drawdowns) {
    const var95 = returns[Math.floor(0.05 * returns.length)];
    const var99 = returns[Math.floor(0.01 * returns.length)];
    
    // Calculate Conditional Value at Risk (CVaR)
    const cvar95Index = Math.floor(0.05 * returns.length);
    const cvar99Index = Math.floor(0.01 * returns.length);
    
    const cvar95 = this.calculateMean(returns.slice(0, cvar95Index));
    const cvar99 = this.calculateMean(returns.slice(0, cvar99Index));
    
    return {
      valueAtRisk: {
        var95: var95,
        var99: var99
      },
      conditionalValueAtRisk: {
        cvar95: cvar95,
        cvar99: cvar99
      },
      expectedShortfall: cvar95,
      maxDrawdownAtRisk: {
        dd95: drawdowns[Math.floor(0.95 * drawdowns.length)],
        dd99: drawdowns[Math.floor(0.99 * drawdowns.length)]
      }
    };
  }

  /**
   * Prepare data for charts
   */
  prepareChartData() {
    const finalReturns = this.simulations.map(s => s.finalReturn);
    const maxDrawdowns = this.simulations.map(s => s.maxDrawdown);
    
    // Create histogram data for returns
    const returnHistogram = this.createHistogram(finalReturns, 50);
    const drawdownHistogram = this.createHistogram(maxDrawdowns, 50);
    
    // Sample equity curves (show 100 random simulations)
    const sampleSize = Math.min(100, this.simulations.length);
    const sampleIndices = this.getRandomIndices(this.simulations.length, sampleSize);
    const equityCurves = sampleIndices.map(i => this.simulations[i].equity);
    
    return {
      returnHistogram,
      drawdownHistogram,
      equityCurves,
      scatterPlot: this.simulations.map(s => ({
        return: s.finalReturn,
        drawdown: s.maxDrawdown
      }))
    };
  }

  /**
   * Create histogram from data
   */
  createHistogram(data, numBins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    
    const bins = Array(numBins).fill(0);
    const binEdges = [];
    
    for (let i = 0; i <= numBins; i++) {
      binEdges.push(min + i * binWidth);
    }
    
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
      bins[binIndex]++;
    });
    
    return bins.map((count, i) => ({
      bin: (binEdges[i] + binEdges[i + 1]) / 2,
      count: count,
      frequency: count / data.length
    }));
  }

  /**
   * Get random indices
   */
  getRandomIndices(max, count) {
    const indices = [];
    while (indices.length < count) {
      const index = Math.floor(Math.random() * max);
      if (!indices.includes(index)) {
        indices.push(index);
      }
    }
    return indices;
  }

  /**
   * Calculate mean
   */
  calculateMean(values) {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Calculate standard deviation
   */
  calculateStdDev(values) {
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Run sequential Monte Carlo (preserves trade order patterns)
   */
  runSequential(trades, initialCapital = 10000, config = {}) {
    const {
      blockSize = 10,
      numSimulations = this.config.numSimulations
    } = config;
    
    console.log(`Running ${numSimulations} sequential Monte Carlo simulations...`);
    
    this.simulations = [];
    
    for (let i = 0; i < numSimulations; i++) {
      const simulation = this.runSequentialSimulation(trades, initialCapital, blockSize);
      this.simulations.push(simulation);
    }

    return this.analyzeResults(initialCapital);
  }

  /**
   * Run single sequential simulation (shuffle blocks instead of individual trades)
   */
  runSequentialSimulation(trades, initialCapital, blockSize) {
    // Divide trades into blocks
    const blocks = [];
    for (let i = 0; i < trades.length; i += blockSize) {
      blocks.push(trades.slice(i, i + blockSize));
    }
    
    // Shuffle blocks
    const shuffledBlocks = this.shuffleTrades(blocks);
    const shuffledTrades = shuffledBlocks.flat();
    
    let capital = initialCapital;
    const equity = [capital];
    let peak = capital;
    let maxDrawdown = 0;
    
    for (const trade of shuffledTrades) {
      capital += trade.pnl;
      equity.push(capital);
      
      if (capital > peak) {
        peak = capital;
      }
      
      const drawdown = ((peak - capital) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
      
      if (capital <= 0) {
        break;
      }
    }
    
    const finalReturn = ((capital - initialCapital) / initialCapital) * 100;
    
    return {
      equity: equity,
      finalCapital: capital,
      finalReturn: finalReturn,
      maxDrawdown: maxDrawdown,
      ruined: capital <= 0,
      trades: shuffledTrades.length
    };
  }
}

