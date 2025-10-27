// Real-time portfolio data service with price simulation
class PortfolioRealTimeService {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  // Mock data for simulation
  private portfolioData = {
    totalValue: 127450.32,
    dailyChange: 2340.50,
    dailyChangePercent: 1.87,
    positions: [
      { symbol: 'BTC', price: 45120.00, change: 280, changePercent: 0.62 },
      { symbol: 'ETH', price: 3120.00, change: 45.50, changePercent: 1.48 },
      { symbol: 'AAPL', price: 190.25, change: 2.75, changePercent: 1.46 },
      { symbol: 'TSLA', price: 267.50, change: 3.25, changePercent: 1.23 },
      { symbol: 'GOOGL', price: 156.80, change: 2.10, changePercent: 1.36 },
    ]
  };

  subscribe(channel: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel)!.add(callback);
    
    // Start simulation if not running
    if (!this.isRunning) {
      this.startSimulation();
    }

    // Return unsubscribe function
    return () => {
      const channelSubs = this.subscribers.get(channel);
      if (channelSubs) {
        channelSubs.delete(callback);
        if (channelSubs.size === 0) {
          this.subscribers.delete(channel);
          const interval = this.intervals.get(channel);
          if (interval) {
            clearInterval(interval);
            this.intervals.delete(channel);
          }
        }
      }
    };
  }

  private startSimulation() {
    this.isRunning = true;

    // Portfolio value updates (every 2 seconds)
    const portfolioInterval = setInterval(() => {
      this.updatePortfolioValue();
    }, 2000);
    this.intervals.set('portfolio', portfolioInterval);

    // Individual asset price updates (every 1 second)
    const priceInterval = setInterval(() => {
      this.updateAssetPrices();
    }, 1000);
    this.intervals.set('prices', priceInterval);

    // Market metrics updates (every 5 seconds)
    const metricsInterval = setInterval(() => {
      this.updateMarketMetrics();
    }, 5000);
    this.intervals.set('metrics', metricsInterval);
  }

  private updatePortfolioValue() {
    // Simulate portfolio value changes
    const volatility = 0.002; // 0.2% volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    
    this.portfolioData.totalValue *= (1 + randomChange);
    const newDailyChange = this.portfolioData.totalValue - 125109.82; // Base value
    const newDailyChangePercent = (newDailyChange / 125109.82) * 100;

    this.portfolioData.dailyChange = newDailyChange;
    this.portfolioData.dailyChangePercent = newDailyChangePercent;

    this.emit('portfolio', {
      totalValue: this.portfolioData.totalValue,
      dailyChange: this.portfolioData.dailyChange,
      dailyChangePercent: this.portfolioData.dailyChangePercent,
      timestamp: Date.now()
    });
  }

  private updateAssetPrices() {
    this.portfolioData.positions.forEach(position => {
      // Different volatility for different assets
      const volatilities = {
        'BTC': 0.003,
        'ETH': 0.0025,
        'AAPL': 0.001,
        'TSLA': 0.002,
        'GOOGL': 0.0015
      };

      const volatility = volatilities[position.symbol as keyof typeof volatilities] || 0.001;
      const randomChange = (Math.random() - 0.5) * volatility;
      const oldPrice = position.price;
      
      position.price *= (1 + randomChange);
      position.change = position.price - oldPrice;
      position.changePercent = (position.change / oldPrice) * 100;
    });

    this.emit('prices', {
      positions: this.portfolioData.positions,
      timestamp: Date.now()
    });
  }

  private updateMarketMetrics() {
    // Simulate VaR and other risk metrics changes
    const baseVaR = 3450;
    const varChange = (Math.random() - 0.5) * 0.1;
    const newVaR = baseVaR * (1 + varChange);

    const baseSharpe = 1.847;
    const sharpeChange = (Math.random() - 0.5) * 0.02;
    const newSharpe = baseSharpe + sharpeChange;

    this.emit('metrics', {
      var95: newVaR,
      sharpeRatio: newSharpe,
      beta: 1.23 + (Math.random() - 0.5) * 0.05,
      infoRatio: 0.68 + (Math.random() - 0.5) * 0.02,
      timestamp: Date.now()
    });
  }

  private emit(channel: string, data: any) {
    const channelSubs = this.subscribers.get(channel);
    if (channelSubs) {
      channelSubs.forEach(callback => callback(data));
    }
  }

  // Get current snapshot
  getCurrentData() {
    return {
      portfolio: {
        totalValue: this.portfolioData.totalValue,
        dailyChange: this.portfolioData.dailyChange,
        dailyChangePercent: this.portfolioData.dailyChangePercent,
      },
      positions: this.portfolioData.positions,
      timestamp: Date.now()
    };
  }

  // Stop all simulations
  stopSimulation() {
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}

export const portfolioRealTimeService = new PortfolioRealTimeService();
