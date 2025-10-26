/**
 * Walk-Forward Analysis Engine
 * Implements Tomasini methodology with in-sample/out-of-sample testing
 */

import { BacktestEngine } from './BacktestEngine';

export class WalkForwardAnalysis {
  constructor(config = {}) {
    this.config = {
      inSampleRatio: config.inSampleRatio || 0.7, // 70% in-sample, 30% out-of-sample
      windowSize: config.windowSize || 252, // Trading days (1 year)
      stepSize: config.stepSize || 63, // Quarter year
      minDataPoints: config.minDataPoints || 100,
      optimizationMetric: config.optimizationMetric || 'sharpeRatio',
      ...config
    };
    
    this.results = [];
  }

  /**
   * Run walk-forward analysis
   * @param {Array} data - Historical OHLCV data
   * @param {Object} strategy - Base strategy configuration
   * @param {Array} parameterRanges - Parameters to optimize
   * @returns {Object} Walk-forward analysis results
   */
  async run(data, strategy, parameterRanges = []) {
    console.log('Starting Walk-Forward Analysis...');
    
    if (data.length < this.config.minDataPoints) {
      throw new Error('Insufficient data for walk-forward analysis');
    }

    this.results = [];
    const windows = this.createWindows(data);
    
    console.log(`Created ${windows.length} walk-forward windows`);

    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      console.log(`Processing window ${i + 1}/${windows.length}`);
      
      // In-sample optimization
      const optimizedParams = await this.optimizeInSample(
        window.inSample,
        strategy,
        parameterRanges
      );
      
      // Out-of-sample testing
      const outOfSampleResult = await this.testOutOfSample(
        window.outOfSample,
        strategy,
        optimizedParams
      );
      
      this.results.push({
        windowIndex: i,
        inSamplePeriod: {
          start: window.inSample[0].time,
          end: window.inSample[window.inSample.length - 1].time,
          bars: window.inSample.length
        },
        outOfSamplePeriod: {
          start: window.outOfSample[0].time,
          end: window.outOfSample[window.outOfSample.length - 1].time,
          bars: window.outOfSample.length
        },
        optimizedParams: optimizedParams,
        inSampleMetrics: optimizedParams.metrics,
        outOfSampleMetrics: outOfSampleResult.metrics,
        degradation: this.calculateDegradation(
          optimizedParams.metrics,
          outOfSampleResult.metrics
        )
      });
    }

    return this.generateReport();
  }

  /**
   * Create walk-forward windows
   */
  createWindows(data) {
    const windows = [];
    const inSampleSize = Math.floor(this.config.windowSize * this.config.inSampleRatio);
    const outOfSampleSize = this.config.windowSize - inSampleSize;
    
    let startIndex = 0;
    
    while (startIndex + this.config.windowSize <= data.length) {
      const inSampleEnd = startIndex + inSampleSize;
      const outOfSampleEnd = inSampleEnd + outOfSampleSize;
      
      windows.push({
        inSample: data.slice(startIndex, inSampleEnd),
        outOfSample: data.slice(inSampleEnd, outOfSampleEnd)
      });
      
      startIndex += this.config.stepSize;
    }
    
    return windows;
  }

  /**
   * Optimize parameters on in-sample data
   */
  async optimizeInSample(data, strategy, parameterRanges) {
    if (parameterRanges.length === 0) {
      // No optimization needed, just run with default parameters
      const engine = new BacktestEngine(this.config.backtestConfig);
      const result = await engine.run(data, strategy);
      return {
        params: {},
        metrics: result.metrics,
        equity: result.equity
      };
    }

    let bestResult = null;
    let bestScore = -Infinity;
    let bestParams = {};

    // Generate parameter combinations
    const combinations = this.generateParameterCombinations(parameterRanges);
    
    console.log(`Testing ${combinations.length} parameter combinations...`);

    for (const params of combinations) {
      const testStrategy = this.applyParameters(strategy, params);
      const engine = new BacktestEngine(this.config.backtestConfig);
      
      try {
        const result = await engine.run(data, testStrategy);
        const score = this.scoreResult(result.metrics);
        
        if (score > bestScore) {
          bestScore = score;
          bestResult = result;
          bestParams = params;
        }
      } catch (error) {
        console.warn('Backtest failed for params:', params, error.message);
      }
    }

    return {
      params: bestParams,
      metrics: bestResult?.metrics || {},
      equity: bestResult?.equity || [],
      score: bestScore
    };
  }

  /**
   * Test optimized parameters on out-of-sample data
   */
  async testOutOfSample(data, strategy, optimizedParams) {
    const testStrategy = this.applyParameters(strategy, optimizedParams.params);
    const engine = new BacktestEngine(this.config.backtestConfig);
    
    return await engine.run(data, testStrategy);
  }

  /**
   * Generate all parameter combinations
   */
  generateParameterCombinations(parameterRanges) {
    if (parameterRanges.length === 0) return [{}];
    
    const combinations = [];
    
    const generate = (index, current) => {
      if (index === parameterRanges.length) {
        combinations.push({ ...current });
        return;
      }
      
      const param = parameterRanges[index];
      const values = this.generateParameterValues(param);
      
      for (const value of values) {
        current[param.name] = value;
        generate(index + 1, current);
      }
    };
    
    generate(0, {});
    return combinations;
  }

  /**
   * Generate values for a parameter range
   */
  generateParameterValues(param) {
    const values = [];
    
    if (param.type === 'range') {
      const step = param.step || 1;
      for (let v = param.min; v <= param.max; v += step) {
        values.push(v);
      }
    } else if (param.type === 'list') {
      values.push(...param.values);
    }
    
    return values;
  }

  /**
   * Apply parameters to strategy
   */
  applyParameters(strategy, params) {
    const newStrategy = JSON.parse(JSON.stringify(strategy)); // Deep clone
    
    // Apply parameters to risk management
    if (params.stopLoss !== undefined) {
      newStrategy.riskManagement = newStrategy.riskManagement || {};
      newStrategy.riskManagement.stopLoss = params.stopLoss;
    }
    
    if (params.takeProfit !== undefined) {
      newStrategy.riskManagement = newStrategy.riskManagement || {};
      newStrategy.riskManagement.takeProfit = params.takeProfit;
    }
    
    if (params.positionSize !== undefined) {
      newStrategy.riskManagement = newStrategy.riskManagement || {};
      newStrategy.riskManagement.positionSize = params.positionSize;
    }
    
    // Apply parameters to rules
    Object.keys(params).forEach(key => {
      if (key.startsWith('rule_')) {
        const [, ruleType, ruleIndex, paramName] = key.split('_');
        if (newStrategy.rules?.[ruleType]?.[ruleIndex]) {
          newStrategy.rules[ruleType][ruleIndex].params[paramName] = params[key];
        }
      }
    });
    
    return newStrategy;
  }

  /**
   * Score a backtest result based on optimization metric
   */
  scoreResult(metrics) {
    switch (this.config.optimizationMetric) {
      case 'sharpeRatio':
        return metrics.sharpeRatio || 0;
      case 'totalReturn':
        return metrics.totalReturn || 0;
      case 'profitFactor':
        return metrics.profitFactor || 0;
      case 'calmarRatio':
        return metrics.calmarRatio || 0;
      case 'winRate':
        return metrics.winRate || 0;
      default:
        return metrics.sharpeRatio || 0;
    }
  }

  /**
   * Calculate performance degradation from in-sample to out-of-sample
   */
  calculateDegradation(inSampleMetrics, outOfSampleMetrics) {
    const metrics = ['sharpeRatio', 'totalReturn', 'winRate', 'profitFactor'];
    const degradation = {};
    
    metrics.forEach(metric => {
      const inSample = inSampleMetrics[metric] || 0;
      const outOfSample = outOfSampleMetrics[metric] || 0;
      
      if (inSample !== 0) {
        degradation[metric] = ((outOfSample - inSample) / Math.abs(inSample)) * 100;
      } else {
        degradation[metric] = 0;
      }
    });
    
    return degradation;
  }

  /**
   * Generate comprehensive walk-forward analysis report
   */
  generateReport() {
    const avgInSampleMetrics = this.calculateAverageMetrics('inSampleMetrics');
    const avgOutOfSampleMetrics = this.calculateAverageMetrics('outOfSampleMetrics');
    const avgDegradation = this.calculateAverageDegradation();
    
    const consistency = this.calculateConsistency();
    const robustness = this.calculateRobustness();
    
    return {
      summary: {
        totalWindows: this.results.length,
        avgInSampleMetrics,
        avgOutOfSampleMetrics,
        avgDegradation,
        consistency,
        robustness,
        recommendation: this.generateRecommendation(avgDegradation, consistency, robustness)
      },
      windows: this.results,
      charts: this.prepareChartData()
    };
  }

  calculateAverageMetrics(metricsKey) {
    const metrics = {};
    const keys = Object.keys(this.results[0]?.[metricsKey] || {});
    
    keys.forEach(key => {
      const values = this.results.map(r => r[metricsKey][key] || 0);
      metrics[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
    });
    
    return metrics;
  }

  calculateAverageDegradation() {
    const degradation = {};
    const keys = Object.keys(this.results[0]?.degradation || {});
    
    keys.forEach(key => {
      const values = this.results.map(r => r.degradation[key] || 0);
      degradation[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
    });
    
    return degradation;
  }

  calculateConsistency() {
    // Measure how consistent out-of-sample performance is across windows
    const outOfSampleReturns = this.results.map(r => r.outOfSampleMetrics.totalReturn || 0);
    const positiveWindows = outOfSampleReturns.filter(r => r > 0).length;
    
    return (positiveWindows / this.results.length) * 100;
  }

  calculateRobustness() {
    // Measure how well the strategy performs out-of-sample vs in-sample
    const avgDegradation = this.calculateAverageDegradation();
    const sharpeRatioDegradation = avgDegradation.sharpeRatio || 0;
    
    // Lower degradation = higher robustness
    if (sharpeRatioDegradation > -20) return 'High';
    if (sharpeRatioDegradation > -40) return 'Medium';
    return 'Low';
  }

  generateRecommendation(degradation, consistency, robustness) {
    if (robustness === 'High' && consistency > 70) {
      return 'Strategy shows strong robustness and consistency. Recommended for live trading.';
    } else if (robustness === 'Medium' && consistency > 60) {
      return 'Strategy shows moderate robustness. Consider additional validation before live trading.';
    } else {
      return 'Strategy shows signs of overfitting. Further optimization or redesign recommended.';
    }
  }

  prepareChartData() {
    return {
      degradationByWindow: this.results.map((r, i) => ({
        window: i + 1,
        sharpeRatio: r.degradation.sharpeRatio,
        totalReturn: r.degradation.totalReturn,
        winRate: r.degradation.winRate
      })),
      performanceComparison: this.results.map((r, i) => ({
        window: i + 1,
        inSample: r.inSampleMetrics.totalReturn,
        outOfSample: r.outOfSampleMetrics.totalReturn
      }))
    };
  }
}

