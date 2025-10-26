# Quick Start Guide - Backtesting & Trading System

## 🚀 Getting Started in 5 Minutes

### Step 1: Access the Backtesting Engine

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to **Backtesting Engine** in the sidebar or visit:
   ```
   http://localhost:3000/backtesting
   ```

### Step 2: Run Your First Backtest

1. **Default Strategy Loaded**: A sample "Momentum Breakout Strategy" is pre-configured
2. **Click "Run Backtest"**: The system will test the strategy on 500 bars of historical data
3. **View Results**: See comprehensive performance metrics including:
   - Total P&L and Return %
   - Win Rate
   - Sharpe Ratio
   - Maximum Drawdown
   - Equity Curve
   - Trade Distribution

### Step 3: Explore Walk-Forward Analysis

1. Click the **"Walk-Forward Analysis"** tab
2. Click **"Run Walk-Forward Analysis"**
3. The system will:
   - Split data into in-sample (70%) and out-of-sample (30%) periods
   - Optimize parameters on in-sample data
   - Test on out-of-sample data
   - Provide robustness scoring and recommendations

### Step 4: Run Monte Carlo Simulation

1. First, run a standard backtest (Step 2)
2. Click the **"Monte Carlo Simulation"** tab
3. Click **"Run Monte Carlo Simulation"**
4. View risk analysis including:
   - Ruin Probability
   - Profit Probability
   - Value at Risk (VaR)
   - Return Distribution

### Step 5: Try Paper Trading

1. Navigate to **Paper Trading** in the sidebar or visit:
   ```
   http://localhost:3000/paper-trading
   ```

2. Click **"Start Trading"**
3. Use the Quick Trade panel to:
   - Buy 1 Lot (opens a long position)
   - Sell 1 Lot (closes position)
4. Watch real-time updates:
   - Equity curve
   - P&L tracking
   - Position management
   - Performance metrics

## 📊 Understanding the Results

### Backtest Metrics Explained

**Total P&L**: Your total profit or loss in dollars
- ✅ Good: Positive and growing
- ⚠️ Warning: Negative or declining

**Win Rate**: Percentage of winning trades
- ✅ Good: > 50%
- ⚠️ Warning: < 40%

**Sharpe Ratio**: Risk-adjusted returns
- ✅ Excellent: > 2.0
- ✅ Good: 1.0 - 2.0
- ⚠️ Warning: < 1.0

**Max Drawdown**: Largest peak-to-trough decline
- ✅ Good: < 10%
- ⚠️ Warning: 10-20%
- 🚫 Poor: > 20%

**Profit Factor**: Gross profit / Gross loss
- ✅ Excellent: > 2.0
- ✅ Good: 1.5 - 2.0
- ⚠️ Warning: < 1.5

### Walk-Forward Analysis Results

**Robustness Score**:
- **High**: Strategy performs consistently across time periods
- **Medium**: Some degradation but acceptable
- **Low**: Significant overfitting detected

**Consistency**: Percentage of profitable windows
- ✅ Good: > 70%
- ⚠️ Warning: 50-70%
- 🚫 Poor: < 50%

**Degradation**: Performance drop from in-sample to out-of-sample
- ✅ Good: < 20%
- ⚠️ Warning: 20-40%
- 🚫 Poor: > 40%

### Monte Carlo Simulation Results

**Ruin Probability**: Chance of losing all capital
- ✅ Good: < 5%
- ⚠️ Warning: 5-15%
- 🚫 Poor: > 15%

**Profit Probability**: Chance of being profitable
- ✅ Good: > 70%
- ⚠️ Warning: 50-70%
- 🚫 Poor: < 50%

**95% VaR**: Maximum expected loss at 95% confidence
- Use this to set position sizes and risk limits

## 🎯 Common Use Cases

### Use Case 1: Validate a New Strategy

1. **Create Strategy** in Strategy Builder
2. **Run Backtest** to see historical performance
3. **Run Walk-Forward** to check for overfitting
4. **Run Monte Carlo** to understand risk
5. **Paper Trade** to test in real-time
6. **Go Live** only if all tests pass

### Use Case 2: Optimize Parameters

1. **Run Walk-Forward Analysis** with parameter ranges
2. Review optimized parameters for each window
3. Check consistency across windows
4. Use most consistent parameters
5. Validate with Monte Carlo

### Use Case 3: Risk Assessment

1. **Run Backtest** on your strategy
2. **Run Monte Carlo** with 1000+ simulations
3. Review:
   - Ruin probability
   - 95% and 99% VaR
   - Drawdown distribution
4. Adjust position sizing based on results

### Use Case 4: Multi-Timeframe Validation

1. **Access Multi-Timeframe Analysis**
2. Select timeframes (e.g., 15m, 1h, 4h)
3. Run analysis
4. Check correlation matrix
5. Choose timeframe with best consistency

## 🛠️ Customization

### Modify Strategy Rules

Edit the strategy object in `BacktestingPage.jsx`:

```javascript
const strategy = {
  name: 'Your Strategy Name',
  rules: {
    entry: [
      {
        type: 'price_above_ema',
        params: { period: 20 },
        enabled: true
      }
    ],
    exit: [
      {
        type: 'take_profit',
        params: { ratio: 3 },
        enabled: true
      }
    ]
  },
  riskManagement: {
    stopLoss: 2.0,      // 2% stop loss
    takeProfit: 4.0,    // 4% take profit
    positionSize: 1.0   // 100% of available capital
  }
};
```

### Available Rule Types

**Entry Rules**:
- `price_above_ema`: Price crosses above EMA
- `volume_spike`: Volume exceeds average by multiplier
- `rsi_oversold`: RSI below threshold
- `breakout`: Price breaks above recent high

**Exit Rules**:
- `take_profit`: Exit at profit target
- `stop_loss`: Exit at loss limit
- `trailing_stop`: Dynamic stop loss
- `time_exit`: Exit after time period

### Adjust Backtest Configuration

```javascript
const config = {
  initialCapital: 10000,    // Starting capital
  commission: 0.001,        // 0.1% per trade
  slippage: 0.0005,         // 0.05% slippage
  leverage: 1,              // No leverage
  compounding: true         // Reinvest profits
};
```

## 📱 Setting Up Alerts

### Telegram Alerts

1. Create a Telegram bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID
4. Configure in `AlertSystem`:

```javascript
const alerts = new AlertSystem({
  telegram: {
    enabled: true,
    botToken: 'YOUR_BOT_TOKEN',
    chatId: 'YOUR_CHAT_ID'
  }
});
```

### Email Alerts

Configure your email service (SendGrid, AWS SES, etc.):

```javascript
const alerts = new AlertSystem({
  email: {
    enabled: true,
    apiKey: 'YOUR_API_KEY',
    from: 'alerts@yourdomain.com',
    to: 'your@email.com'
  }
});
```

## 📤 Exporting Strategies

### Export to JSON

1. Run a backtest
2. Click **"Export"** button
3. Choose **JSON** format
4. File downloads with strategy and results

### Export to Code

```javascript
const exporter = new StrategyExporter();

// Pine Script for TradingView
const pineScript = exporter.exportToCode(strategy, 'pine_script');

// Python for Backtrader
const python = exporter.exportToCode(strategy, 'python');

// MQL4 for MetaTrader 4
const mql4 = exporter.exportToCode(strategy, 'mql4');
```

## 🎓 Learning Path

### Beginner
1. ✅ Run default backtest
2. ✅ Understand basic metrics
3. ✅ Try paper trading
4. ✅ Modify simple parameters

### Intermediate
1. ✅ Create custom strategies
2. ✅ Run walk-forward analysis
3. ✅ Interpret Monte Carlo results
4. ✅ Set up alerts

### Advanced
1. ✅ Multi-timeframe optimization
2. ✅ Custom indicator development
3. ✅ Advanced risk management
4. ✅ Strategy portfolio construction

## 🐛 Troubleshooting

### Backtest Not Running
- Check that historical data is loaded
- Verify strategy has at least one entry rule
- Check browser console for errors

### No Trades Generated
- Strategy rules may be too strict
- Adjust parameters (e.g., lower RSI threshold)
- Check that entry and exit rules are enabled

### Poor Performance
- Strategy may not suit market conditions
- Try different timeframes
- Adjust risk management parameters
- Run walk-forward to check overfitting

### Paper Trading Not Updating
- Ensure "Start Trading" is clicked
- Check that price simulation is running
- Verify positions are being tracked

## 💡 Pro Tips

1. **Always validate with walk-forward** before live trading
2. **Use Monte Carlo** to understand worst-case scenarios
3. **Start paper trading** with small positions
4. **Monitor drawdown** closely - stop if it exceeds limits
5. **Test across market conditions** (trending, ranging, volatile)
6. **Keep strategies simple** - complexity doesn't equal profitability
7. **Document everything** - use the trade journal
8. **Set realistic expectations** - 20-30% annual return is excellent

## 📞 Support

For issues or questions:
1. Check the main README: `BACKTESTING_SYSTEM_README.md`
2. Review code documentation in source files
3. Check browser console for error messages
4. Verify all dependencies are installed

## 🎉 Next Steps

Now that you're familiar with the basics:

1. **Experiment** with different strategies
2. **Optimize** parameters using walk-forward
3. **Validate** with Monte Carlo simulation
4. **Practice** with paper trading
5. **Track** performance in the trade journal
6. **Iterate** and improve your strategies

Happy Trading! 📈

