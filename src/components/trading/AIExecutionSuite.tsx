/**
 * 🎯 AI-POWERED EXECUTION SUITE
 * Professional trading execution panel - always visible on the right side
 * Bloomberg/TradingView style with Entry, SL, TP, BUY/SELL, Market/Limit, Place Order
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Shield, Zap, Calculator, AlertTriangle } from 'lucide-react';
import { useTradeStore } from '../../core/tradeStore';

interface AIExecutionSuiteProps {
  selectedSetup?: any;
  riskParams?: any;
}

export default function AIExecutionSuite({ selectedSetup, riskParams }: AIExecutionSuiteProps) {
  const [orderParams, setOrderParams] = useState({
    symbol: 'EURUSD',
    orderType: 'Market' as 'Market' | 'Limit',
    direction: 'BUY' as 'BUY' | 'SELL',
    quantity: '10000',
    entry: '',
    stopLoss: '',
    takeProfit: '',
    leverage: '1'
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [riskMetrics, setRiskMetrics] = useState({
    riskAmount: 0,
    rewardAmount: 0,
    rrRatio: 0,
    positionValue: 0,
    marginRequired: 0
  });

  // Auto-fill from selected setup
  useEffect(() => {
    if (selectedSetup) {
      setOrderParams(prev => ({
        ...prev,
        symbol: selectedSetup.symbol || selectedSetup.pair || 'EURUSD',
        entry: selectedSetup.entry?.toString() || '',
        stopLoss: selectedSetup.stopLoss?.toString() || '',
        takeProfit: selectedSetup.takeProfit?.toString() || '',
        direction: selectedSetup.direction || selectedSetup.trend === 'BULLISH' ? 'BUY' : 'SELL',
        quantity: riskParams?.positionSize?.toString() || selectedSetup.quantity?.toString() || '10000'
      }));
    }
  }, [selectedSetup, riskParams]);

  // Calculate risk metrics in real-time
  useEffect(() => {
    const calculateRiskMetrics = () => {
      const entry = parseFloat(orderParams.entry) || 0;
      const stopLoss = parseFloat(orderParams.stopLoss) || 0;
      const takeProfit = parseFloat(orderParams.takeProfit) || 0;
      const quantity = parseFloat(orderParams.quantity) || 0;
      const leverage = parseFloat(orderParams.leverage) || 1;

      if (entry === 0 || stopLoss === 0 || takeProfit === 0 || quantity === 0) {
        setRiskMetrics({ riskAmount: 0, rewardAmount: 0, rrRatio: 0, positionValue: 0, marginRequired: 0 });
        return;
      }

      let riskAmount, rewardAmount;
      
      if (orderParams.direction === 'BUY') {
        riskAmount = (entry - stopLoss) * quantity;
        rewardAmount = (takeProfit - entry) * quantity;
      } else {
        riskAmount = (stopLoss - entry) * quantity;
        rewardAmount = (entry - takeProfit) * quantity;
      }

      const rrRatio = riskAmount !== 0 ? Math.abs(rewardAmount / riskAmount) : 0;
      const positionValue = entry * quantity;
      const marginRequired = positionValue / leverage;

      setRiskMetrics({
        riskAmount: Math.abs(riskAmount),
        rewardAmount: Math.abs(rewardAmount),
        rrRatio,
        positionValue,
        marginRequired
      });
    };

    calculateRiskMetrics();
  }, [orderParams]);

  const handleParamChange = (param: string, value: string) => {
    setOrderParams(prev => ({ ...prev, [param]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate order placement
    setTimeout(() => {
      setIsPlacingOrder(false);
      console.log('Order placed:', orderParams);
      // Here you would integrate with actual trading API
    }, 2000);
  };

  const isValidOrder = orderParams.entry && orderParams.quantity && 
                      parseFloat(orderParams.entry) > 0 && parseFloat(orderParams.quantity) > 0;

  const isThinking = useTradingStore((s: any) => s.isThinking);

  return (
    <div className="h-full flex flex-col bg-secondary text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-lg">AI-Powered Execution Suite</h3>
          </div>
          {/* AI Pulse */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`}></div>
            <span className="text-muted-foreground">AI {isThinking ? 'Analyzing' : 'Idle'}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Always visible for instant trading</p>

        {/* Live Status */}
        <div className="flex items-center gap-2 mt-3 text-xs">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-muted-foreground">Live Market Data</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-muted-foreground">AI Analysis Active</span>
        </div>
      </div>

      {/* Selected Setup Info */}
      {selectedSetup && (
        <div className="p-4 bg-muted border-b border-border">
          <div className="text-sm font-medium text-foreground mb-1">Selected Setup</div>
          <div className="text-xs text-muted-foreground">
            {selectedSetup.symbol || selectedSetup.pair || 'EURUSD'} •
            {selectedSetup.pattern || selectedSetup.type || 'Manual'} •
            Confidence: {selectedSetup.confidence || 85}%
          </div>
          {selectedSetup.rrRatio && (
            <div className="text-xs text-accent mt-1">
              R:R {selectedSetup.rrRatio.toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* Order Form */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Symbol */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide">Symbol</label>
          <input
            type="text"
            value={orderParams.symbol}
            onChange={(e) => handleParamChange('symbol', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="EURUSD"
          />
        </div>

        {/* Order Type & Direction */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide">Order Type</label>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleParamChange('orderType', 'Market')}
                className={`p-2 text-xs font-medium rounded transition-all ${
                  orderParams.orderType === 'Market'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => handleParamChange('orderType', 'Limit')}
                className={`p-2 text-xs font-medium rounded transition-all ${
                  orderParams.orderType === 'Limit'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide">Direction</label>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleParamChange('direction', 'BUY')}
                className={`p-2 text-xs font-medium rounded transition-all flex items-center justify-center gap-1 ${
                  orderParams.direction === 'BUY'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                BUY
              </button>
              <button
                onClick={() => handleParamChange('direction', 'SELL')}
                className={`p-2 text-xs font-medium rounded transition-all flex items-center justify-center gap-1 ${
                  orderParams.direction === 'SELL'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                SELL
              </button>
            </div>
          </div>
        </div>

        {/* Quantity & Leverage */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide">Quantity</label>
            <input
              type="number"
              value={orderParams.quantity}
              onChange={(e) => handleParamChange('quantity', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="10000"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide">Leverage</label>
            <select
              value={orderParams.leverage}
              onChange={(e) => handleParamChange('leverage', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="1">1:1</option>
              <option value="5">1:5</option>
              <option value="10">1:10</option>
              <option value="20">1:20</option>
              <option value="50">1:50</option>
              <option value="100">1:100</option>
            </select>
          </div>
        </div>

        {/* Entry Price */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide">Entry Price</label>
          <input
            type="number"
            step="0.00001"
            value={orderParams.entry}
            onChange={(e) => handleParamChange('entry', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="1.08500"
          />
        </div>

        {/* Stop Loss */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Stop Loss (SL)
          </label>
          <input
            type="number"
            step="0.00001"
            value={orderParams.stopLoss}
            onChange={(e) => handleParamChange('stopLoss', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="1.08000"
          />
        </div>

        {/* Take Profit */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wide flex items-center gap-2">
            <Target className="w-3 h-3" />
            Take Profit (TP)
          </label>
          <input
            type="number"
            step="0.00001"
            value={orderParams.takeProfit}
            onChange={(e) => handleParamChange('takeProfit', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="1.09200"
          />
        </div>

        {/* Risk/Reward Analysis */}
        {riskMetrics.riskAmount > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Calculator className="w-4 h-4" />
              Risk/Reward Analysis
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
                <div className="text-red-400 font-medium">Risk</div>
                <div className="text-red-300 font-mono">${riskMetrics.riskAmount.toFixed(2)}</div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
                <div className="text-emerald-400 font-medium">Reward</div>
                <div className="text-emerald-300 font-mono">${riskMetrics.rewardAmount.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">R:R Ratio</span>
                <span className="font-mono font-bold text-slate-200">1:{riskMetrics.rrRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-400">Position Value</span>
                <span className="font-mono text-slate-300">${riskMetrics.positionValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-slate-400">Margin Required</span>
                <span className="font-mono text-slate-300">${riskMetrics.marginRequired.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Risk Warning */}
        {riskMetrics.rrRatio > 0 && riskMetrics.rrRatio < 1.5 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-400 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Low R:R Warning</span>
            </div>
            <p className="text-xs text-yellow-300 mt-1">
              Risk/Reward ratio below 1.5 - consider adjusting TP/SL levels
            </p>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !isValidOrder}
          className={`w-full p-3 rounded font-bold text-sm transition-all ${
            orderParams.direction === 'BUY'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
        >
          {isPlacingOrder ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Placing Order...
            </div>
          ) : (
            `Place ${orderParams.direction} Order`
          )}
        </button>
        
        {!isValidOrder && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            Enter valid entry price and quantity to place order
          </p>
        )}
      </div>
    </div>
  );
}
