/**
 * Paper Trading Engine
 * Live testing without risk - simulates real trading with virtual portfolio
 */

export class PaperTradingEngine {
  constructor(config = {}) {
    this.config = {
      initialCapital: config.initialCapital || 10000,
      commission: config.commission || 0.001,
      slippage: config.slippage || 0.0005,
      leverage: config.leverage || 1,
      maxPositions: config.maxPositions || 5,
      ...config
    };
    
    this.portfolio = {
      cash: this.config.initialCapital,
      positions: [],
      orders: [],
      trades: [],
      equity: [this.config.initialCapital],
      peakEquity: this.config.initialCapital
    };
    
    this.isActive = false;
    this.listeners = [];
  }

  /**
   * Start paper trading
   */
  start() {
    this.isActive = true;
    this.emit('started', { timestamp: Date.now() });
    console.log('Paper trading started');
  }

  /**
   * Stop paper trading
   */
  stop() {
    this.isActive = false;
    this.emit('stopped', { timestamp: Date.now() });
    console.log('Paper trading stopped');
  }

  /**
   * Reset paper trading account
   */
  reset() {
    this.portfolio = {
      cash: this.config.initialCapital,
      positions: [],
      orders: [],
      trades: [],
      equity: [this.config.initialCapital],
      peakEquity: this.config.initialCapital
    };
    this.emit('reset', { timestamp: Date.now() });
  }

  /**
   * Place a market order
   */
  placeMarketOrder(symbol, side, quantity, currentPrice) {
    if (!this.isActive) {
      throw new Error('Paper trading is not active');
    }

    const order = {
      id: this.generateOrderId(),
      symbol,
      side, // 'buy' or 'sell'
      type: 'market',
      quantity,
      requestedPrice: currentPrice,
      status: 'pending',
      timestamp: Date.now()
    };

    this.portfolio.orders.push(order);
    this.emit('orderPlaced', order);

    // Execute immediately at market price with slippage
    this.executeOrder(order, currentPrice);

    return order;
  }

  /**
   * Place a limit order
   */
  placeLimitOrder(symbol, side, quantity, limitPrice) {
    if (!this.isActive) {
      throw new Error('Paper trading is not active');
    }

    const order = {
      id: this.generateOrderId(),
      symbol,
      side,
      type: 'limit',
      quantity,
      limitPrice,
      status: 'pending',
      timestamp: Date.now()
    };

    this.portfolio.orders.push(order);
    this.emit('orderPlaced', order);

    return order;
  }

  /**
   * Place a stop order
   */
  placeStopOrder(symbol, side, quantity, stopPrice) {
    if (!this.isActive) {
      throw new Error('Paper trading is not active');
    }

    const order = {
      id: this.generateOrderId(),
      symbol,
      side,
      type: 'stop',
      quantity,
      stopPrice,
      status: 'pending',
      timestamp: Date.now()
    };

    this.portfolio.orders.push(order);
    this.emit('orderPlaced', order);

    return order;
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId) {
    const order = this.portfolio.orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error('Order cannot be cancelled');
    }

    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    
    this.emit('orderCancelled', order);

    return order;
  }

  /**
   * Execute an order
   */
  executeOrder(order, currentPrice) {
    const executionPrice = this.applySlippage(currentPrice, order.side);
    const commission = executionPrice * order.quantity * this.config.commission;
    const totalCost = executionPrice * order.quantity + commission;

    // Check if we have enough cash for buy orders
    if (order.side === 'buy' && totalCost > this.portfolio.cash) {
      order.status = 'rejected';
      order.rejectionReason = 'Insufficient funds';
      this.emit('orderRejected', order);
      return;
    }

    // Check if we have the position for sell orders
    if (order.side === 'sell') {
      const position = this.portfolio.positions.find(p => p.symbol === order.symbol);
      if (!position || position.quantity < order.quantity) {
        order.status = 'rejected';
        order.rejectionReason = 'Insufficient position';
        this.emit('orderRejected', order);
        return;
      }
    }

    // Execute the order
    order.status = 'filled';
    order.executionPrice = executionPrice;
    order.commission = commission;
    order.executedAt = Date.now();

    if (order.side === 'buy') {
      this.openPosition(order);
    } else {
      this.closePosition(order);
    }

    this.emit('orderFilled', order);
  }

  /**
   * Open a position
   */
  openPosition(order) {
    const existingPosition = this.portfolio.positions.find(p => p.symbol === order.symbol);

    if (existingPosition) {
      // Add to existing position
      const totalQuantity = existingPosition.quantity + order.quantity;
      const totalCost = (existingPosition.avgPrice * existingPosition.quantity) + 
                       (order.executionPrice * order.quantity);
      
      existingPosition.quantity = totalQuantity;
      existingPosition.avgPrice = totalCost / totalQuantity;
      existingPosition.commission += order.commission;
    } else {
      // Create new position
      this.portfolio.positions.push({
        symbol: order.symbol,
        quantity: order.quantity,
        avgPrice: order.executionPrice,
        commission: order.commission,
        openedAt: Date.now(),
        unrealizedPnl: 0
      });
    }

    this.portfolio.cash -= (order.executionPrice * order.quantity + order.commission);
  }

  /**
   * Close a position
   */
  closePosition(order) {
    const position = this.portfolio.positions.find(p => p.symbol === order.symbol);

    if (!position) return;

    const pnl = (order.executionPrice - position.avgPrice) * order.quantity - order.commission;

    // Record trade
    const trade = {
      id: this.generateTradeId(),
      symbol: order.symbol,
      entryPrice: position.avgPrice,
      exitPrice: order.executionPrice,
      quantity: order.quantity,
      pnl: pnl,
      pnlPercent: (pnl / (position.avgPrice * order.quantity)) * 100,
      commission: position.commission + order.commission,
      openedAt: position.openedAt,
      closedAt: Date.now(),
      duration: Date.now() - position.openedAt
    };

    this.portfolio.trades.push(trade);
    this.portfolio.cash += (order.executionPrice * order.quantity - order.commission);

    // Update or remove position
    if (position.quantity === order.quantity) {
      const index = this.portfolio.positions.indexOf(position);
      this.portfolio.positions.splice(index, 1);
    } else {
      position.quantity -= order.quantity;
    }

    this.emit('tradeClosed', trade);
  }

  /**
   * Update positions with current market prices
   */
  updatePrices(priceData) {
    if (!this.isActive) return;

    // Update unrealized P&L for positions
    this.portfolio.positions.forEach(position => {
      const currentPrice = priceData[position.symbol];
      if (currentPrice) {
        position.currentPrice = currentPrice;
        position.unrealizedPnl = (currentPrice - position.avgPrice) * position.quantity;
        position.unrealizedPnlPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
      }
    });

    // Check pending limit and stop orders
    this.checkPendingOrders(priceData);

    // Update equity
    this.updateEquity();

    this.emit('pricesUpdated', priceData);
  }

  /**
   * Check and execute pending orders
   */
  checkPendingOrders(priceData) {
    const pendingOrders = this.portfolio.orders.filter(o => o.status === 'pending');

    pendingOrders.forEach(order => {
      const currentPrice = priceData[order.symbol];
      if (!currentPrice) return;

      let shouldExecute = false;

      if (order.type === 'limit') {
        if (order.side === 'buy' && currentPrice <= order.limitPrice) {
          shouldExecute = true;
        } else if (order.side === 'sell' && currentPrice >= order.limitPrice) {
          shouldExecute = true;
        }
      } else if (order.type === 'stop') {
        if (order.side === 'buy' && currentPrice >= order.stopPrice) {
          shouldExecute = true;
        } else if (order.side === 'sell' && currentPrice <= order.stopPrice) {
          shouldExecute = true;
        }
      }

      if (shouldExecute) {
        this.executeOrder(order, currentPrice);
      }
    });
  }

  /**
   * Update portfolio equity
   */
  updateEquity() {
    const unrealizedPnl = this.portfolio.positions.reduce((sum, p) => sum + (p.unrealizedPnl || 0), 0);
    const currentEquity = this.portfolio.cash + unrealizedPnl;
    
    this.portfolio.equity.push(currentEquity);

    if (currentEquity > this.portfolio.peakEquity) {
      this.portfolio.peakEquity = currentEquity;
    }
  }

  /**
   * Get current portfolio status
   */
  getPortfolio() {
    const unrealizedPnl = this.portfolio.positions.reduce((sum, p) => sum + (p.unrealizedPnl || 0), 0);
    const currentEquity = this.portfolio.cash + unrealizedPnl;
    const totalPnl = currentEquity - this.config.initialCapital;
    const totalReturn = (totalPnl / this.config.initialCapital) * 100;

    return {
      cash: this.portfolio.cash,
      positions: this.portfolio.positions,
      equity: currentEquity,
      unrealizedPnl: unrealizedPnl,
      totalPnl: totalPnl,
      totalReturn: totalReturn,
      peakEquity: this.portfolio.peakEquity,
      drawdown: ((this.portfolio.peakEquity - currentEquity) / this.portfolio.peakEquity) * 100
    };
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const trades = this.portfolio.trades;
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);

    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0;
    const profitFactor = avgLoss > 0 ? (avgWin * winningTrades.length) / (avgLoss * losingTrades.length) : 0;

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: winRate,
      totalPnl: totalPnl,
      avgWin: avgWin,
      avgLoss: avgLoss,
      profitFactor: profitFactor,
      bestTrade: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
      worstTrade: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0
    };
  }

  // Helper methods
  applySlippage(price, side) {
    if (side === 'buy') {
      return price * (1 + this.config.slippage);
    } else {
      return price * (1 - this.config.slippage);
    }
  }

  generateOrderId() {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateTradeId() {
    return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Event system
  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  emit(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }
}

