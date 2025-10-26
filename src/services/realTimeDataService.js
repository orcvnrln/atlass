/**
 * Real-time Data Service (Mock WebSocket Simulation)
 * Simulates live market data updates for dashboard
 */

class RealTimeDataService {
  constructor() {
    this.subscribers = new Map();
    this.intervals = new Map();
    this.isRunning = false;
  }

  /**
   * Subscribe to real-time updates
   * @param {string} channel - Channel name (e.g., 'portfolio', 'pnl', 'trades')
   * @param {function} callback - Callback function to receive updates
   * @returns {string} subscriptionId
   */
  subscribe(channel, callback) {
    const subscriptionId = `${channel}_${Date.now()}_${Math.random()}`;
    
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Map());
    }
    
    this.subscribers.get(channel).set(subscriptionId, callback);
    
    // Start emitting data for this channel if not already running
    if (!this.intervals.has(channel)) {
      this.startChannel(channel);
    }
    
    return subscriptionId;
  }

  /**
   * Unsubscribe from updates
   * @param {string} subscriptionId
   */
  unsubscribe(subscriptionId) {
    const [channel] = subscriptionId.split('_');
    
    if (this.subscribers.has(channel)) {
      this.subscribers.get(channel).delete(subscriptionId);
      
      // Stop channel if no more subscribers
      if (this.subscribers.get(channel).size === 0) {
        this.stopChannel(channel);
      }
    }
  }

  /**
   * Start emitting data for a channel
   * @param {string} channel
   */
  startChannel(channel) {
    const generators = {
      portfolio: this.generatePortfolioData,
      pnl: this.generatePnLData,
      trades: this.generateTradeData,
      positions: this.generatePositionData,
      market: this.generateMarketData,
    };

    const generator = generators[channel];
    if (!generator) {
      console.warn(`Unknown channel: ${channel}`);
      return;
    }

    // Emit immediately
    this.emit(channel, generator.call(this));

    // Set up interval (different frequencies for different channels)
    const intervals = {
      portfolio: 2000,   // 2 seconds
      pnl: 1000,         // 1 second
      trades: 5000,      // 5 seconds
      positions: 3000,   // 3 seconds
      market: 1500,      // 1.5 seconds
    };

    const interval = setInterval(() => {
      this.emit(channel, generator.call(this));
    }, intervals[channel] || 2000);

    this.intervals.set(channel, interval);
  }

  /**
   * Stop emitting data for a channel
   * @param {string} channel
   */
  stopChannel(channel) {
    const interval = this.intervals.get(channel);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(channel);
    }
  }

  /**
   * Emit data to all subscribers of a channel
   * @param {string} channel
   * @param {any} data
   */
  emit(channel, data) {
    const channelSubscribers = this.subscribers.get(channel);
    if (channelSubscribers) {
      channelSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in subscriber callback for ${channel}:`, error);
        }
      });
    }
  }

  /**
   * Generate mock portfolio data
   */
  generatePortfolioData() {
    const baseValue = 127450.32;
    const volatility = 500;
    const change = (Math.random() - 0.5) * volatility;
    const value = baseValue + change;

    return {
      value: value.toFixed(2),
      change: change.toFixed(2),
      changePercent: ((change / baseValue) * 100).toFixed(2),
      timestamp: Date.now(),
    };
  }

  /**
   * Generate mock P&L data
   */
  generatePnLData() {
    const basePnL = 1245.67;
    const volatility = 100;
    const change = (Math.random() - 0.5) * volatility;
    const pnl = basePnL + change;

    return {
      daily: pnl.toFixed(2),
      weekly: (pnl * 5).toFixed(2),
      monthly: (pnl * 20).toFixed(2),
      changePercent: ((change / basePnL) * 100).toFixed(2),
      isPositive: pnl >= 0,
      timestamp: Date.now(),
    };
  }

  /**
   * Generate mock trade data
   */
  generateTradeData() {
    const pairs = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD', 'AAPL', 'GOOGL'];
    const types = ['BUY', 'SELL'];
    const statuses = ['FILLED', 'PARTIAL', 'PENDING'];

    return {
      id: `trade_${Date.now()}`,
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      type: types[Math.floor(Math.random() * types.length)],
      size: (Math.random() * 10).toFixed(2),
      price: (Math.random() * 1000 + 100).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      pnl: (Math.random() * 200 - 100).toFixed(2),
      timestamp: Date.now(),
    };
  }

  /**
   * Generate mock position data
   */
  generatePositionData() {
    return {
      openPositions: Math.floor(Math.random() * 10) + 1,
      totalValue: (Math.random() * 50000 + 10000).toFixed(2),
      unrealizedPnL: (Math.random() * 2000 - 1000).toFixed(2),
      realizedPnL: (Math.random() * 5000).toFixed(2),
      timestamp: Date.now(),
    };
  }

  /**
   * Generate mock market data
   */
  generateMarketData() {
    return {
      btc: (Math.random() * 50000 + 40000).toFixed(2),
      eth: (Math.random() * 3000 + 2000).toFixed(2),
      eurusd: (1.08 + (Math.random() - 0.5) * 0.02).toFixed(5),
      gbpusd: (1.26 + (Math.random() - 0.5) * 0.02).toFixed(5),
      sp500: (Math.random() * 4500 + 4000).toFixed(2),
      timestamp: Date.now(),
    };
  }

  /**
   * Clean up all subscriptions and intervals
   */
  destroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.subscribers.clear();
  }
}

// Singleton instance
const realTimeDataService = new RealTimeDataService();

export default realTimeDataService;
