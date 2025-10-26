# Comprehensive Backtesting & Trading System

A professional-grade backtesting and trading system with advanced features including historical data testing, walk-forward analysis, Monte Carlo simulation, paper trading, and comprehensive analytics.

## 🚀 Features

### 1. **Backtesting Engine** (`/backtesting`)
- **Historical Data Testing**: Test strategies against historical market data
- **Performance Metrics**: Comprehensive metrics including Sharpe ratio, win rate, profit factor, max drawdown
- **Trade Analysis**: Detailed trade-by-trade breakdown with P&L tracking
- **Equity Curve Visualization**: Real-time equity and drawdown charts
- **Risk Management**: Built-in stop loss, take profit, and position sizing
- **Commission & Slippage**: Realistic trading costs simulation

**Key Components:**
- `src/lib/backtesting/BacktestEngine.js` - Core backtesting engine
- `src/components/backtesting/BacktestDashboard.jsx` - Performance analytics UI
- `src/pages/BacktestingPage.jsx` - Main backtesting interface

### 2. **Walk-Forward Analysis**
- **Tomasini Methodology**: Industry-standard walk-forward optimization
- **In-Sample/Out-of-Sample Testing**: Prevent overfitting with proper validation
- **Rolling Windows**: Configurable window sizes and step intervals
- **Parameter Optimization**: Automatic parameter tuning across multiple combinations
- **Robustness Scoring**: Measure strategy consistency and reliability
- **Degradation Analysis**: Track performance degradation from IS to OOS

**Key Components:**
- `src/lib/backtesting/WalkForwardAnalysis.js` - Walk-forward engine
- Configurable parameters: window size, step size, in-sample ratio
- Optimization metrics: Sharpe ratio, total return, profit factor, Calmar ratio

### 3. **Monte Carlo Simulation**
- **Risk Analysis**: Randomized trade sequence simulation
- **Probability Distributions**: Return and drawdown probability analysis
- **Confidence Intervals**: 95% and 99% confidence levels
- **Value at Risk (VaR)**: 95% and 99% VaR calculations
- **Conditional VaR (CVaR)**: Expected shortfall analysis
- **Ruin Probability**: Calculate probability of account ruin
- **Sequential Analysis**: Block-based randomization preserving patterns

**Key Components:**
- `src/lib/backtesting/MonteCarloSimulation.js` - Monte Carlo engine
- 1000+ simulations for statistical significance
- Histogram and scatter plot visualizations

### 4. **Paper Trading Mode** (`/paper-trading`)
- **Live Simulation**: Real-time trading without financial risk
- **Virtual Portfolio**: Complete portfolio management system
- **Order Types**: Market, limit, and stop orders
- **Real-time P&L**: Live profit/loss tracking
- **Position Management**: Open/close positions with full tracking
- **Performance Metrics**: Win rate, profit factor, Sharpe ratio
- **Equity Tracking**: Real-time equity curve updates

**Key Components:**
- `src/lib/trading/PaperTradingEngine.js` - Paper trading engine
- `src/components/trading/PaperTradingDashboard.jsx` - Trading interface
- `src/pages/PaperTradingPage.jsx` - Paper trading page

### 5. **Alert System**
- **Multi-Channel Notifications**: Telegram, Email, Browser notifications
- **Alert Types**: Price, indicator, performance, and risk alerts
- **Customizable Rules**: Flexible condition-based alert system
- **Cooldown Management**: Prevent alert spam
- **Alert History**: Track and acknowledge alerts

**Key Components:**
- `src/lib/alerts/AlertSystem.js` - Alert management system
- Telegram Bot API integration
- Email service integration (configurable)

### 6. **Strategy Export System**
- **JSON Export**: Save strategies with full configuration
- **Code Generation**: Export to multiple platforms
  - Pine Script (TradingView)
  - Python (Backtrader)
  - MQL4/MQL5 (MetaTrader)
  - JavaScript
- **Import/Export**: Full strategy portability
- **Backtest Results**: Include performance data in exports

**Key Components:**
- `src/lib/export/StrategyExporter.js` - Export engine
- Platform-specific code generators
- Strategy versioning and metadata

### 7. **Multi-Timeframe Analysis**
- **Cross-Timeframe Testing**: Test strategies across multiple timeframes
- **Correlation Matrix**: Analyze performance correlations
- **Consistency Scoring**: Measure strategy robustness
- **Performance Comparison**: Side-by-side timeframe comparison
- **Recommendations**: AI-powered strategy insights

**Key Components:**
- `src/components/backtesting/MultiTimeframeAnalysis.jsx` - MTF analysis UI
- Timeframes: 1m, 5m, 15m, 1h, 4h, 1d
- Visual correlation heatmaps

## 📊 Performance Metrics

### Core Metrics
- **Total Return**: Overall strategy profitability
- **Win Rate**: Percentage of winning trades
- **Profit Factor**: Ratio of gross profit to gross loss
- **Sharpe Ratio**: Risk-adjusted return measure
- **Calmar Ratio**: Return to max drawdown ratio
- **Max Drawdown**: Largest peak-to-trough decline
- **Expectancy**: Average profit per trade

### Advanced Metrics
- **Rolling Sharpe Ratio**: Time-varying risk-adjusted returns
- **Value at Risk (VaR)**: Potential loss at confidence levels
- **Conditional VaR**: Expected loss beyond VaR
- **Sortino Ratio**: Downside deviation-adjusted returns
- **Recovery Factor**: Net profit to max drawdown ratio

## 🛠️ Usage

### Running a Backtest

```javascript
import { BacktestEngine } from '@/lib/backtesting/BacktestEngine';

const engine = new BacktestEngine({
  initialCapital: 10000,
  commission: 0.001,
  slippage: 0.0005,
  leverage: 1
});

const strategy = {
  name: 'My Strategy',
  rules: {
    entry: [
      { type: 'price_above_ema', params: { period: 20 }, enabled: true }
    ],
    exit: [
      { type: 'take_profit', params: { ratio: 3 }, enabled: true }
    ]
  },
  riskManagement: {
    stopLoss: 2.0,
    takeProfit: 4.0,
    positionSize: 1.0
  }
};

const results = await engine.run(historicalData, strategy);
console.log(results.metrics);
```

### Walk-Forward Analysis

```javascript
import { WalkForwardAnalysis } from '@/lib/backtesting/WalkForwardAnalysis';

const wfa = new WalkForwardAnalysis({
  inSampleRatio: 0.7,
  windowSize: 252,
  stepSize: 63,
  optimizationMetric: 'sharpeRatio'
});

const parameterRanges = [
  { name: 'stopLoss', type: 'range', min: 1.0, max: 3.0, step: 0.5 },
  { name: 'takeProfit', type: 'range', min: 2.0, max: 5.0, step: 1.0 }
];

const results = await wfa.run(historicalData, strategy, parameterRanges);
console.log(results.summary);
```

### Monte Carlo Simulation

```javascript
import { MonteCarloSimulation } from '@/lib/backtesting/MonteCarloSimulation';

const mc = new MonteCarloSimulation({
  numSimulations: 1000,
  confidenceLevel: 0.95
});

const results = mc.run(backtestTrades, initialCapital);
console.log('Ruin Probability:', results.summary.ruinProbability);
console.log('95% VaR:', results.riskMetrics.valueAtRisk.var95);
```

### Paper Trading

```javascript
import { PaperTradingEngine } from '@/lib/trading/PaperTradingEngine';

const engine = new PaperTradingEngine({
  initialCapital: 10000,
  commission: 0.001
});

engine.start();

// Place orders
engine.placeMarketOrder('EURUSD', 'buy', 1, currentPrice);

// Update with live prices
engine.updatePrices({ 'EURUSD': newPrice });

// Get portfolio status
const portfolio = engine.getPortfolio();
console.log('Equity:', portfolio.equity);
```

### Alert System

```javascript
import { AlertSystem } from '@/lib/alerts/AlertSystem';

const alerts = new AlertSystem({
  telegram: {
    enabled: true,
    botToken: 'YOUR_BOT_TOKEN',
    chatId: 'YOUR_CHAT_ID'
  }
});

// Add alert rule
alerts.addRule({
  name: 'Price Alert',
  type: 'price',
  condition: 'above',
  threshold: 1.10,
  symbol: 'EURUSD',
  channels: ['telegram', 'notification']
});

// Check rules
alerts.checkRules({ price: { 'EURUSD': 1.11 } });
```

### Strategy Export

```javascript
import { StrategyExporter } from '@/lib/export/StrategyExporter';

const exporter = new StrategyExporter();

// Export to JSON
const json = exporter.exportToJSON(strategy, backtestResults);

// Export to Pine Script
const pineScript = exporter.exportToCode(strategy, 'pine_script');

// Download strategy
exporter.downloadStrategy(strategy, 'json');
```

## 🎯 Navigation

Access the features through the sidebar:
- **Backtesting Engine**: `/backtesting`
- **Paper Trading**: `/paper-trading`

## 📈 Best Practices

### Backtesting
1. Use sufficient historical data (minimum 1 year)
2. Include realistic commission and slippage
3. Test across different market conditions
4. Validate with walk-forward analysis
5. Check for overfitting with Monte Carlo

### Walk-Forward Analysis
1. Use 70/30 in-sample/out-of-sample ratio
2. Set appropriate window sizes (252 days = 1 year)
3. Optimize on multiple metrics
4. Monitor degradation between IS and OOS
5. Require consistency across windows

### Paper Trading
1. Start with small position sizes
2. Monitor slippage and execution
3. Track all metrics in real-time
4. Compare with backtest results
5. Gradually increase position sizes

### Risk Management
1. Never risk more than 2% per trade
2. Use stop losses on all positions
3. Maintain proper position sizing
4. Monitor maximum drawdown
5. Set daily/weekly loss limits

## 🔧 Configuration

### Backtest Engine Config
```javascript
{
  initialCapital: 10000,
  commission: 0.001,      // 0.1%
  slippage: 0.0005,       // 0.05%
  leverage: 1,
  compounding: true
}
```

### Walk-Forward Config
```javascript
{
  inSampleRatio: 0.7,     // 70% in-sample
  windowSize: 252,        // 1 year
  stepSize: 63,           // Quarter
  optimizationMetric: 'sharpeRatio'
}
```

### Monte Carlo Config
```javascript
{
  numSimulations: 1000,
  confidenceLevel: 0.95
}
```

## 📝 Technical Indicators Supported

- **EMA** (Exponential Moving Average)
- **SMA** (Simple Moving Average)
- **RSI** (Relative Strength Index)
- **Volume Analysis**
- **Breakout Detection**
- **Custom Indicators** (extensible)

## 🎨 UI Components

All components are built with:
- **React** + **Framer Motion** for animations
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Radix UI** for accessible components

## 🚦 Status

✅ Backtesting Engine - Complete
✅ Walk-Forward Analysis - Complete
✅ Monte Carlo Simulation - Complete
✅ Paper Trading Mode - Complete
✅ Alert System - Complete
✅ Strategy Export - Complete
✅ Performance Analytics - Complete
✅ Multi-Timeframe Analysis - Complete

## 📚 Additional Resources

- Strategy Builder: Integrated with backtesting
- Trade Journal: Track manual and automated trades
- AI Co-Pilot: Get strategy recommendations
- Correlation Matrix: Analyze asset correlations

## 🤝 Contributing

This is a comprehensive trading system. To extend:
1. Add new technical indicators in `BacktestEngine.js`
2. Create custom export formats in `StrategyExporter.js`
3. Add new alert types in `AlertSystem.js`
4. Extend performance metrics calculations

## ⚠️ Disclaimer

This backtesting system is for educational and research purposes. Past performance does not guarantee future results. Always test strategies thoroughly before live trading.

