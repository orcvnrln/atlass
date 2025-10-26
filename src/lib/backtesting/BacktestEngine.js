/**
 * Core Backtesting Engine
 * Handles historical data processing, strategy execution simulation, and performance calculation
 */

export class BacktestEngine {
  constructor(config = {}) {
    this.config = {
      initialCapital: config.initialCapital || 10000,
      commission: config.commission || 0.001, // 0.1%
      slippage: config.slippage || 0.0005, // 0.05%
      leverage: config.leverage || 1,
      compounding: config.compounding !== false,
      ...config
    };
    
    this.reset();
  }

  reset() {
    this.trades = [];
    this.equity = [this.config.initialCapital];
    this.positions = [];
    this.currentCapital = this.config.initialCapital;
    this.peakCapital = this.config.initialCapital;
    this.metrics = null;
  }

  /**
   * Run backtest on historical data
   * @param {Array} data - Historical OHLCV data
   * @param {Object} strategy - Strategy with entry/exit rules
   * @returns {Object} Backtest results
   */
  async run(data, strategy) {
    this.reset();
    
    if (!data || data.length === 0) {
      throw new Error('No historical data provided');
    }

    console.log(`Starting backtest with ${data.length} bars...`);
    
    for (let i = 0; i < data.length; i++) {
      const bar = data[i];
      const historicalData = data.slice(0, i + 1);
      
      // Update existing positions
      this.updatePositions(bar);
      
      // Check exit conditions for open positions
      this.checkExits(bar, historicalData, strategy);
      
      // Check entry conditions for new positions
      if (this.positions.length < (strategy.maxPositions || 1)) {
        this.checkEntries(bar, historicalData, strategy);
      }
      
      // Record equity
      this.recordEquity(bar);
    }
    
    // Close any remaining positions
    this.closeAllPositions(data[data.length - 1]);
    
    // Calculate performance metrics
    this.metrics = this.calculateMetrics();
    
    return {
      trades: this.trades,
      equity: this.equity,
      metrics: this.metrics,
      positions: this.positions
    };
  }

  /**
   * Check entry conditions and open positions
   */
  checkEntries(bar, historicalData, strategy) {
    const signal = this.evaluateStrategy(bar, historicalData, strategy, 'entry');
    
    if (signal && signal.action) {
      const position = this.openPosition(bar, signal, strategy);
      if (position) {
        this.positions.push(position);
      }
    }
  }

  /**
   * Check exit conditions and close positions
   */
  checkExits(bar, historicalData, strategy) {
    const positionsToClose = [];
    
    for (let i = 0; i < this.positions.length; i++) {
      const position = this.positions[i];
      
      // Check stop loss
      if (this.checkStopLoss(position, bar)) {
        positionsToClose.push({ index: i, reason: 'stop_loss', price: position.stopLoss });
        continue;
      }
      
      // Check take profit
      if (this.checkTakeProfit(position, bar)) {
        positionsToClose.push({ index: i, reason: 'take_profit', price: position.takeProfit });
        continue;
      }
      
      // Check trailing stop
      if (this.checkTrailingStop(position, bar)) {
        positionsToClose.push({ index: i, reason: 'trailing_stop', price: position.trailingStop });
        continue;
      }
      
      // Check strategy exit signal
      const exitSignal = this.evaluateStrategy(bar, historicalData, strategy, 'exit');
      if (exitSignal && exitSignal.action === 'exit') {
        positionsToClose.push({ index: i, reason: 'strategy_exit', price: bar.close });
      }
    }
    
    // Close positions in reverse order to maintain indices
    positionsToClose.reverse().forEach(({ index, reason, price }) => {
      this.closePosition(index, bar, reason, price);
    });
  }

  /**
   * Open a new position
   */
  openPosition(bar, signal, strategy) {
    const positionSize = this.calculatePositionSize(bar, strategy);
    const entryPrice = this.applySlippage(bar.close, signal.action);
    const commission = entryPrice * positionSize * this.config.commission;
    
    if (this.currentCapital < (entryPrice * positionSize + commission)) {
      return null; // Insufficient capital
    }
    
    const position = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entryTime: bar.time,
      entryPrice: entryPrice,
      size: positionSize,
      side: signal.action, // 'buy' or 'sell'
      stopLoss: this.calculateStopLoss(entryPrice, signal, strategy),
      takeProfit: this.calculateTakeProfit(entryPrice, signal, strategy),
      trailingStop: null,
      commission: commission,
      highestPrice: entryPrice,
      lowestPrice: entryPrice
    };
    
    this.currentCapital -= commission;
    
    return position;
  }

  /**
   * Close a position
   */
  closePosition(index, bar, reason, exitPrice = null) {
    const position = this.positions[index];
    const closePrice = exitPrice || this.applySlippage(bar.close, position.side === 'buy' ? 'sell' : 'buy');
    const commission = closePrice * position.size * this.config.commission;
    
    let pnl;
    if (position.side === 'buy') {
      pnl = (closePrice - position.entryPrice) * position.size;
    } else {
      pnl = (position.entryPrice - closePrice) * position.size;
    }
    
    pnl -= (position.commission + commission); // Subtract commissions
    
    const trade = {
      id: position.id,
      entryTime: position.entryTime,
      exitTime: bar.time,
      entryPrice: position.entryPrice,
      exitPrice: closePrice,
      size: position.size,
      side: position.side,
      pnl: pnl,
      pnlPercent: (pnl / (position.entryPrice * position.size)) * 100,
      commission: position.commission + commission,
      exitReason: reason,
      duration: bar.time - position.entryTime
    };
    
    this.trades.push(trade);
    this.currentCapital += pnl;
    this.positions.splice(index, 1);
    
    return trade;
  }

  /**
   * Close all open positions
   */
  closeAllPositions(bar) {
    while (this.positions.length > 0) {
      this.closePosition(0, bar, 'end_of_backtest');
    }
  }

  /**
   * Update position tracking (highest/lowest prices for trailing stops)
   */
  updatePositions(bar) {
    this.positions.forEach(position => {
      position.highestPrice = Math.max(position.highestPrice, bar.high);
      position.lowestPrice = Math.min(position.lowestPrice, bar.low);
      
      // Update trailing stop if configured
      if (position.trailingStopDistance) {
        if (position.side === 'buy') {
          position.trailingStop = position.highestPrice * (1 - position.trailingStopDistance);
        } else {
          position.trailingStop = position.lowestPrice * (1 + position.trailingStopDistance);
        }
      }
    });
  }

  /**
   * Record current equity
   */
  recordEquity(bar) {
    let unrealizedPnl = 0;
    
    this.positions.forEach(position => {
      let positionPnl;
      if (position.side === 'buy') {
        positionPnl = (bar.close - position.entryPrice) * position.size;
      } else {
        positionPnl = (position.entryPrice - bar.close) * position.size;
      }
      unrealizedPnl += positionPnl;
    });
    
    const currentEquity = this.currentCapital + unrealizedPnl;
    this.equity.push(currentEquity);
    
    if (currentEquity > this.peakCapital) {
      this.peakCapital = currentEquity;
    }
  }

  /**
   * Evaluate strategy rules
   */
  evaluateStrategy(bar, historicalData, strategy, type) {
    // This is a simplified evaluation - in production, you'd have a more sophisticated rule engine
    const rules = strategy.rules?.[type] || [];
    
    if (rules.length === 0) {
      return null;
    }
    
    // Evaluate each rule
    const results = rules.map(rule => this.evaluateRule(rule, bar, historicalData));
    
    // All rules must pass (AND logic)
    const allPass = results.every(r => r === true);
    
    if (allPass) {
      return {
        action: type === 'entry' ? (strategy.defaultSide || 'buy') : 'exit',
        confidence: 1.0
      };
    }
    
    return null;
  }

  /**
   * Evaluate individual rule
   */
  evaluateRule(rule, bar, historicalData) {
    if (!rule.enabled) return true;
    
    switch (rule.type) {
      case 'price_above_ema':
        return this.checkPriceAboveEMA(bar, historicalData, rule.params.period);
      case 'volume_spike':
        return this.checkVolumeSpike(bar, historicalData, rule.params.multiplier);
      case 'rsi_oversold':
        return this.checkRSIOversold(bar, historicalData, rule.params.period, rule.params.level);
      case 'breakout':
        return this.checkBreakout(bar, historicalData, rule.params.period, rule.params.threshold);
      default:
        return true;
    }
  }

  // Technical indicator checks
  checkPriceAboveEMA(bar, data, period) {
    const ema = this.calculateEMA(data, period);
    return bar.close > ema;
  }

  checkVolumeSpike(bar, data, multiplier) {
    const avgVolume = this.calculateAverageVolume(data, 20);
    return bar.volume > avgVolume * multiplier;
  }

  checkRSIOversold(bar, data, period, level) {
    const rsi = this.calculateRSI(data, period);
    return rsi < level;
  }

  checkBreakout(bar, data, period, threshold) {
    const highest = Math.max(...data.slice(-period).map(b => b.high));
    return bar.close > highest * (1 + threshold / 100);
  }

  // Stop loss and take profit checks
  checkStopLoss(position, bar) {
    if (!position.stopLoss) return false;

    if (position.side === 'buy') {
      return bar.low <= position.stopLoss;
    } else {
      return bar.high >= position.stopLoss;
    }
  }

  checkTakeProfit(position, bar) {
    if (!position.takeProfit) return false;

    if (position.side === 'buy') {
      return bar.high >= position.takeProfit;
    } else {
      return bar.low <= position.takeProfit;
    }
  }

  checkTrailingStop(position, bar) {
    if (!position.trailingStop) return false;

    if (position.side === 'buy') {
      return bar.low <= position.trailingStop;
    } else {
      return bar.high >= position.trailingStop;
    }
  }

  // Position sizing and risk management
  calculatePositionSize(bar, strategy) {
    const riskManagement = strategy.riskManagement || {};
    const positionSizePercent = riskManagement.positionSize || 1.0;

    if (this.config.compounding) {
      return (this.currentCapital * positionSizePercent) / bar.close;
    } else {
      return (this.config.initialCapital * positionSizePercent) / bar.close;
    }
  }

  calculateStopLoss(entryPrice, signal, strategy) {
    const stopLossPercent = strategy.riskManagement?.stopLoss || 2.0;

    if (signal.action === 'buy') {
      return entryPrice * (1 - stopLossPercent / 100);
    } else {
      return entryPrice * (1 + stopLossPercent / 100);
    }
  }

  calculateTakeProfit(entryPrice, signal, strategy) {
    const takeProfitPercent = strategy.riskManagement?.takeProfit || 4.0;

    if (signal.action === 'buy') {
      return entryPrice * (1 + takeProfitPercent / 100);
    } else {
      return entryPrice * (1 - takeProfitPercent / 100);
    }
  }

  applySlippage(price, side) {
    if (side === 'buy') {
      return price * (1 + this.config.slippage);
    } else {
      return price * (1 - this.config.slippage);
    }
  }

  // Technical indicators
  calculateEMA(data, period) {
    if (data.length < period) return data[data.length - 1]?.close || 0;

    const multiplier = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((sum, bar) => sum + bar.close, 0) / period;

    for (let i = period; i < data.length; i++) {
      ema = (data[i].close - ema) * multiplier + ema;
    }

    return ema;
  }

  calculateSMA(data, period) {
    if (data.length < period) return data[data.length - 1]?.close || 0;

    const slice = data.slice(-period);
    return slice.reduce((sum, bar) => sum + bar.close, 0) / period;
  }

  calculateRSI(data, period = 14) {
    if (data.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = data.length - period; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateAverageVolume(data, period) {
    if (data.length < period) return data[data.length - 1]?.volume || 0;

    const slice = data.slice(-period);
    return slice.reduce((sum, bar) => sum + (bar.volume || 0), 0) / period;
  }

  // Performance metrics calculation
  calculateMetrics() {
    const winningTrades = this.trades.filter(t => t.pnl > 0);
    const losingTrades = this.trades.filter(t => t.pnl < 0);

    const totalPnl = this.trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalCommission = this.trades.reduce((sum, t) => sum + t.commission, 0);

    const winRate = this.trades.length > 0 ? (winningTrades.length / this.trades.length) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0;
    const profitFactor = avgLoss > 0 ? (avgWin * winningTrades.length) / (avgLoss * losingTrades.length) : 0;

    const returns = this.calculateReturns();
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const maxDrawdown = this.calculateMaxDrawdown();
    const calmarRatio = maxDrawdown.percent !== 0 ? (totalPnl / this.config.initialCapital * 100) / Math.abs(maxDrawdown.percent) : 0;

    return {
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: winRate,
      totalPnl: totalPnl,
      totalReturn: (totalPnl / this.config.initialCapital) * 100,
      totalCommission: totalCommission,
      avgWin: avgWin,
      avgLoss: avgLoss,
      profitFactor: profitFactor,
      sharpeRatio: sharpeRatio,
      maxDrawdown: maxDrawdown,
      calmarRatio: calmarRatio,
      finalCapital: this.currentCapital,
      expectancy: this.trades.length > 0 ? totalPnl / this.trades.length : 0,
      avgTradeDuration: this.calculateAvgTradeDuration(),
      bestTrade: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
      worstTrade: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0
    };
  }

  calculateReturns() {
    const returns = [];
    for (let i = 1; i < this.equity.length; i++) {
      const ret = (this.equity[i] - this.equity[i - 1]) / this.equity[i - 1];
      returns.push(ret);
    }
    return returns;
  }

  calculateSharpeRatio(returns, riskFreeRate = 0.02) {
    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    const annualizedReturn = avgReturn * 252; // Assuming daily data
    const annualizedStdDev = stdDev * Math.sqrt(252);

    return (annualizedReturn - riskFreeRate) / annualizedStdDev;
  }

  calculateMaxDrawdown() {
    let maxDrawdown = 0;
    let maxDrawdownPercent = 0;
    let peak = this.equity[0];
    let peakIndex = 0;
    let troughIndex = 0;

    for (let i = 0; i < this.equity.length; i++) {
      if (this.equity[i] > peak) {
        peak = this.equity[i];
        peakIndex = i;
      }

      const drawdown = peak - this.equity[i];
      const drawdownPercent = (drawdown / peak) * 100;

      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownPercent = drawdownPercent;
        troughIndex = i;
      }
    }

    return {
      value: maxDrawdown,
      percent: maxDrawdownPercent,
      peakIndex: peakIndex,
      troughIndex: troughIndex
    };
  }

  calculateAvgTradeDuration() {
    if (this.trades.length === 0) return 0;

    const totalDuration = this.trades.reduce((sum, t) => sum + t.duration, 0);
    return totalDuration / this.trades.length;
  }
}

