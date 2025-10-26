/**
 * Order Panel Component - Professional Order Entry
 * Features: Market/Limit/Stop orders, position sizing, risk calculation
 */

import React, { useState, useMemo, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, Target, Shield, Calculator,
  DollarSign, Percent, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

const ORDER_TYPES = [
  { value: 'market', label: 'Market', icon: TrendingUp },
  { value: 'limit', label: 'Limit', icon: Target },
  { value: 'stop', label: 'Stop', icon: Shield },
  { value: 'stop_limit', label: 'Stop-Limit', icon: AlertTriangle }
];

const OrderPanel = ({ 
  symbol = 'BTCUSDT',
  currentPrice = 43250.50,
  balance = 10000,
  className = ''
}) => {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy'); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [riskPercent, setRiskPercent] = useState('2');
  const [leverage, setLeverage] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate order details
  const orderDetails = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const orderPrice = orderType === 'market' ? currentPrice : (parseFloat(price) || currentPrice);
    const slPrice = parseFloat(stopLoss) || 0;
    const tpPrice = parseFloat(takeProfit) || 0;
    const lev = parseFloat(leverage) || 1;
    
    const notionalValue = qty * orderPrice;
    const margin = notionalValue / lev;
    const maxRisk = (balance * parseFloat(riskPercent)) / 100;
    
    let riskAmount = 0;
    if (slPrice > 0) {
      riskAmount = Math.abs(orderPrice - slPrice) * qty;
    }
    
    let rewardAmount = 0;
    if (tpPrice > 0) {
      rewardAmount = Math.abs(tpPrice - orderPrice) * qty;
    }
    
    const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0;
    
    return {
      quantity: qty,
      price: orderPrice,
      notionalValue,
      margin,
      maxRisk,
      riskAmount,
      rewardAmount,
      riskRewardRatio,
      leverage: lev
    };
  }, [quantity, price, currentPrice, orderType, stopLoss, takeProfit, balance, riskPercent, leverage]);

  // Calculate suggested position size based on risk
  const suggestedQuantity = useMemo(() => {
    const slPrice = parseFloat(stopLoss) || 0;
    const orderPrice = orderType === 'market' ? currentPrice : (parseFloat(price) || currentPrice);
    const maxRisk = (balance * parseFloat(riskPercent)) / 100;
    
    if (slPrice > 0 && Math.abs(orderPrice - slPrice) > 0) {
      const riskPerUnit = Math.abs(orderPrice - slPrice);
      return (maxRisk / riskPerUnit).toFixed(6);
    }
    
    return '';
  }, [stopLoss, price, currentPrice, orderType, balance, riskPercent]);

  const handleSubmitOrder = useCallback(async () => {
    setIsSubmitting(true);
    
    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Order submitted:', {
      symbol,
      side,
      type: orderType,
      quantity: orderDetails.quantity,
      price: orderDetails.price,
      stopLoss,
      takeProfit,
      leverage
    });
    
    setIsSubmitting(false);
    
    // Reset form
    setQuantity('');
    setPrice('');
    setStopPrice('');
    setStopLoss('');
    setTakeProfit('');
  }, [symbol, side, orderType, orderDetails, stopLoss, takeProfit, leverage]);

  const isValidOrder = useMemo(() => {
    return orderDetails.quantity > 0 && 
           orderDetails.margin <= balance &&
           (orderType === 'market' || parseFloat(price) > 0);
  }, [orderDetails, balance, orderType, price]);

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Order Entry</h3>
            <p className="text-sm text-slate-400">{symbol}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Balance</div>
            <div className="text-lg font-bold text-slate-100">
              ${balance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Buy/Sell Toggle */}
        <div className="flex rounded-lg bg-slate-900/50 p-1">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            BUY
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-2" />
            SELL
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ORDER_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setOrderType(type.value)}
                  className={`p-2 rounded-lg border transition-all ${
                    orderType === type.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">
              Quantity
            </label>
            {suggestedQuantity && (
              <button
                onClick={() => setQuantity(suggestedQuantity)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Use suggested: {suggestedQuantity}
              </button>
            )}
          </div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Price (for limit orders) */}
        {(orderType === 'limit' || orderType === 'stop_limit') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={currentPrice.toFixed(2)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => setPrice(currentPrice.toString())}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300"
              >
                Market
              </button>
            </div>
          </div>
        )}

        {/* Stop Price (for stop orders) */}
        {(orderType === 'stop' || orderType === 'stop_limit') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Stop Price
            </label>
            <input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Risk Management */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Risk Management
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Risk %
              </label>
              <input
                type="number"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                min="0.1"
                max="10"
                step="0.1"
                className="w-full px-2 py-1 text-sm bg-slate-800 border border-slate-700 rounded text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Leverage
              </label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full px-2 py-1 text-sm bg-slate-800 border border-slate-700 rounded text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="5">5x</option>
                <option value="10">10x</option>
                <option value="20">20x</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Stop Loss
              </label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="0.00"
                className="w-full px-2 py-1 text-sm bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Take Profit
              </label>
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="0.00"
                className="w-full px-2 py-1 text-sm bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {orderDetails.quantity > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Order Summary
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Notional Value:</span>
                <span className="text-slate-100 font-mono">
                  ${orderDetails.notionalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Margin Required:</span>
                <span className="text-slate-100 font-mono">
                  ${orderDetails.margin.toLocaleString()}
                </span>
              </div>
              {orderDetails.riskAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Amount:</span>
                  <span className="text-red-400 font-mono">
                    ${orderDetails.riskAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {orderDetails.rewardAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Reward Amount:</span>
                  <span className="text-green-400 font-mono">
                    ${orderDetails.rewardAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {orderDetails.riskRewardRatio > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk/Reward:</span>
                  <span className={`font-mono ${orderDetails.riskRewardRatio >= 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                    1:{orderDetails.riskRewardRatio.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitOrder}
          disabled={!isValidOrder || isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            isValidOrder && !isSubmitting
              ? side === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Submitting...
            </div>
          ) : (
            `${side.toUpperCase()} ${symbol}`
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderPanel;
