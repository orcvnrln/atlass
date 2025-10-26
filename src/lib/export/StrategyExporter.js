/**
 * Strategy Export System
 * Export strategies to JSON and generate code for various platforms
 */

export class StrategyExporter {
  constructor() {
    this.platforms = ['pine_script', 'python', 'mql4', 'mql5', 'javascript'];
  }

  /**
   * Export strategy to JSON
   */
  exportToJSON(strategy, backtestResults = null) {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      strategy: {
        name: strategy.name,
        description: strategy.description,
        rules: strategy.rules,
        riskManagement: strategy.riskManagement,
        parameters: strategy.parameters || {},
        timeframe: strategy.timeframe || '1h',
        symbols: strategy.symbols || []
      }
    };

    if (backtestResults) {
      exportData.backtestResults = {
        metrics: backtestResults.metrics,
        period: {
          start: backtestResults.period?.start,
          end: backtestResults.period?.end
        },
        summary: {
          totalTrades: backtestResults.metrics?.totalTrades,
          winRate: backtestResults.metrics?.winRate,
          totalReturn: backtestResults.metrics?.totalReturn,
          sharpeRatio: backtestResults.metrics?.sharpeRatio,
          maxDrawdown: backtestResults.metrics?.maxDrawdown
        }
      };
    }

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import strategy from JSON
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.strategy) {
        throw new Error('Invalid strategy format');
      }

      return data.strategy;
    } catch (error) {
      throw new Error(`Failed to import strategy: ${error.message}`);
    }
  }

  /**
   * Export strategy to code
   */
  exportToCode(strategy, platform = 'pine_script') {
    switch (platform) {
      case 'pine_script':
        return this.generatePineScript(strategy);
      case 'python':
        return this.generatePython(strategy);
      case 'mql4':
        return this.generateMQL4(strategy);
      case 'mql5':
        return this.generateMQL5(strategy);
      case 'javascript':
        return this.generateJavaScript(strategy);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Generate Pine Script (TradingView)
   */
  generatePineScript(strategy) {
    const code = [];
    
    code.push(`//@version=5`);
    code.push(`strategy("${strategy.name}", overlay=true)`);
    code.push('');
    
    // Parameters
    code.push('// Strategy Parameters');
    if (strategy.riskManagement) {
      code.push(`stopLossPercent = input.float(${strategy.riskManagement.stopLoss || 2.0}, "Stop Loss %", minval=0.1, step=0.1)`);
      code.push(`takeProfitPercent = input.float(${strategy.riskManagement.takeProfit || 4.0}, "Take Profit %", minval=0.1, step=0.1)`);
      code.push(`positionSize = input.float(${strategy.riskManagement.positionSize || 1.0}, "Position Size %", minval=0.1, maxval=100, step=0.1)`);
    }
    code.push('');

    // Entry rules
    code.push('// Entry Conditions');
    const entryConditions = this.generatePineScriptConditions(strategy.rules?.entry || []);
    code.push(`longCondition = ${entryConditions.long || 'false'}`);
    code.push(`shortCondition = ${entryConditions.short || 'false'}`);
    code.push('');

    // Exit rules
    code.push('// Exit Conditions');
    const exitConditions = this.generatePineScriptConditions(strategy.rules?.exit || []);
    code.push(`exitLongCondition = ${exitConditions.long || 'false'}`);
    code.push(`exitShortCondition = ${exitConditions.short || 'false'}`);
    code.push('');

    // Strategy execution
    code.push('// Strategy Execution');
    code.push('if (longCondition)');
    code.push('    strategy.entry("Long", strategy.long)');
    code.push('    strategy.exit("Exit Long", "Long", stop=close * (1 - stopLossPercent/100), limit=close * (1 + takeProfitPercent/100))');
    code.push('');
    code.push('if (shortCondition)');
    code.push('    strategy.entry("Short", strategy.short)');
    code.push('    strategy.exit("Exit Short", "Short", stop=close * (1 + stopLossPercent/100), limit=close * (1 - takeProfitPercent/100))');
    code.push('');
    code.push('if (exitLongCondition)');
    code.push('    strategy.close("Long")');
    code.push('');
    code.push('if (exitShortCondition)');
    code.push('    strategy.close("Short")');

    return code.join('\n');
  }

  /**
   * Generate Pine Script conditions from rules
   */
  generatePineScriptConditions(rules) {
    const conditions = { long: [], short: [] };

    rules.forEach(rule => {
      if (!rule.enabled) return;

      switch (rule.type) {
        case 'price_above_ema':
          conditions.long.push(`close > ta.ema(close, ${rule.params.period || 20})`);
          conditions.short.push(`close < ta.ema(close, ${rule.params.period || 20})`);
          break;
        
        case 'rsi_oversold':
          conditions.long.push(`ta.rsi(close, ${rule.params.period || 14}) < ${rule.params.level || 30}`);
          conditions.short.push(`ta.rsi(close, ${rule.params.period || 14}) > ${100 - (rule.params.level || 30)}`);
          break;
        
        case 'volume_spike':
          conditions.long.push(`volume > ta.sma(volume, 20) * ${rule.params.multiplier || 2}`);
          conditions.short.push(`volume > ta.sma(volume, 20) * ${rule.params.multiplier || 2}`);
          break;
        
        case 'breakout':
          conditions.long.push(`close > ta.highest(high, ${rule.params.period || 20})[1]`);
          conditions.short.push(`close < ta.lowest(low, ${rule.params.period || 20})[1]`);
          break;
      }
    });

    return {
      long: conditions.long.length > 0 ? conditions.long.join(' and ') : 'false',
      short: conditions.short.length > 0 ? conditions.short.join(' and ') : 'false'
    };
  }

  /**
   * Generate Python code (for backtesting frameworks like Backtrader)
   */
  generatePython(strategy) {
    const code = [];
    
    code.push(`# ${strategy.name}`);
    code.push(`# Generated on ${new Date().toISOString()}`);
    code.push('');
    code.push('import backtrader as bt');
    code.push('');
    code.push(`class ${this.toPascalCase(strategy.name)}(bt.Strategy):`);
    code.push('    params = (');
    
    if (strategy.riskManagement) {
      code.push(`        ('stop_loss', ${strategy.riskManagement.stopLoss || 2.0}),`);
      code.push(`        ('take_profit', ${strategy.riskManagement.takeProfit || 4.0}),`);
      code.push(`        ('position_size', ${strategy.riskManagement.positionSize || 1.0}),`);
    }
    
    code.push('    )');
    code.push('');
    code.push('    def __init__(self):');
    code.push('        self.order = None');
    
    // Add indicators based on rules
    const indicators = this.extractIndicators(strategy.rules?.entry || []);
    indicators.forEach(ind => {
      code.push(`        self.${ind.name} = ${ind.code}`);
    });
    
    code.push('');
    code.push('    def next(self):');
    code.push('        if self.order:');
    code.push('            return');
    code.push('');
    code.push('        if not self.position:');
    code.push('            # Entry logic');
    code.push('            if self.check_entry_conditions():');
    code.push('                self.order = self.buy()');
    code.push('        else:');
    code.push('            # Exit logic');
    code.push('            if self.check_exit_conditions():');
    code.push('                self.order = self.sell()');
    code.push('');
    code.push('    def check_entry_conditions(self):');
    code.push('        # Implement entry conditions');
    code.push('        return False  # Placeholder');
    code.push('');
    code.push('    def check_exit_conditions(self):');
    code.push('        # Implement exit conditions');
    code.push('        return False  # Placeholder');

    return code.join('\n');
  }

  /**
   * Generate MQL4 code (MetaTrader 4)
   */
  generateMQL4(strategy) {
    const code = [];
    
    code.push(`//+------------------------------------------------------------------+`);
    code.push(`//| ${strategy.name.padEnd(64)} |`);
    code.push(`//| Generated on ${new Date().toISOString().padEnd(52)} |`);
    code.push(`//+------------------------------------------------------------------+`);
    code.push('');
    code.push(`input double StopLoss = ${strategy.riskManagement?.stopLoss || 2.0};`);
    code.push(`input double TakeProfit = ${strategy.riskManagement?.takeProfit || 4.0};`);
    code.push(`input double LotSize = ${strategy.riskManagement?.positionSize || 0.1};`);
    code.push('');
    code.push('int OnInit()');
    code.push('{');
    code.push('    return(INIT_SUCCEEDED);');
    code.push('}');
    code.push('');
    code.push('void OnTick()');
    code.push('{');
    code.push('    if(OrdersTotal() == 0)');
    code.push('    {');
    code.push('        if(CheckEntryConditions())');
    code.push('        {');
    code.push('            double sl = Ask - (StopLoss * Point * 10);');
    code.push('            double tp = Ask + (TakeProfit * Point * 10);');
    code.push('            OrderSend(Symbol(), OP_BUY, LotSize, Ask, 3, sl, tp, "Entry", 0, 0, clrGreen);');
    code.push('        }');
    code.push('    }');
    code.push('}');
    code.push('');
    code.push('bool CheckEntryConditions()');
    code.push('{');
    code.push('    // Implement entry conditions');
    code.push('    return false;');
    code.push('}');

    return code.join('\n');
  }

  /**
   * Generate MQL5 code (MetaTrader 5)
   */
  generateMQL5(strategy) {
    // Similar to MQL4 but with MQL5 syntax
    return this.generateMQL4(strategy).replace('MQL4', 'MQL5');
  }

  /**
   * Generate JavaScript code
   */
  generateJavaScript(strategy) {
    const code = [];
    
    code.push(`/**`);
    code.push(` * ${strategy.name}`);
    code.push(` * Generated on ${new Date().toISOString()}`);
    code.push(` */`);
    code.push('');
    code.push('class TradingStrategy {');
    code.push('  constructor(config = {}) {');
    code.push('    this.config = {');
    code.push(`      stopLoss: config.stopLoss || ${strategy.riskManagement?.stopLoss || 2.0},`);
    code.push(`      takeProfit: config.takeProfit || ${strategy.riskManagement?.takeProfit || 4.0},`);
    code.push(`      positionSize: config.positionSize || ${strategy.riskManagement?.positionSize || 1.0},`);
    code.push('      ...config');
    code.push('    };');
    code.push('  }');
    code.push('');
    code.push('  checkEntry(data) {');
    code.push('    // Implement entry logic');
    code.push('    return false;');
    code.push('  }');
    code.push('');
    code.push('  checkExit(data) {');
    code.push('    // Implement exit logic');
    code.push('    return false;');
    code.push('  }');
    code.push('}');
    code.push('');
    code.push('export default TradingStrategy;');

    return code.join('\n');
  }

  /**
   * Download strategy as file
   */
  downloadStrategy(strategy, format = 'json', platform = 'pine_script') {
    let content, filename, mimeType;

    if (format === 'json') {
      content = this.exportToJSON(strategy);
      filename = `${this.toKebabCase(strategy.name)}.json`;
      mimeType = 'application/json';
    } else if (format === 'code') {
      content = this.exportToCode(strategy, platform);
      const extensions = {
        pine_script: 'pine',
        python: 'py',
        mql4: 'mq4',
        mql5: 'mq5',
        javascript: 'js'
      };
      filename = `${this.toKebabCase(strategy.name)}.${extensions[platform]}`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Helper methods
  toPascalCase(str) {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  toKebabCase(str) {
    return str
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  extractIndicators(rules) {
    const indicators = [];
    
    rules.forEach(rule => {
      switch (rule.type) {
        case 'price_above_ema':
          indicators.push({
            name: `ema${rule.params.period}`,
            code: `bt.indicators.EMA(period=${rule.params.period})`
          });
          break;
        case 'rsi_oversold':
          indicators.push({
            name: `rsi${rule.params.period}`,
            code: `bt.indicators.RSI(period=${rule.params.period})`
          });
          break;
      }
    });

    return indicators;
  }
}

