/**
 * 📋 ORDER PANEL
 * Professional order entry interface
 * Bloomberg Terminal tərzi execution panel
 */

import React, { useState, useEffect } from 'react';
import { useTradingStore, Order } from '../../core/state/store';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const OrderPanel: React.FC = () => {
  // State
  const symbol = useTradingStore((state) => state.symbol);
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const addOrder = useTradingStore((state) => state.addOrder);
  const orders = useTradingStore((state) => state.orders);
  const positions = useTradingStore((state) => state.positions);

  // Form state
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  // Auto-fill price for LIMIT orders
  useEffect(() => {
    if (orderType === 'LIMIT' && currentPrice > 0 && !price) {
      setPrice(currentPrice.toFixed(2));
    }
  }, [orderType, currentPrice]);

  // ─── HANDLERS ───
  const handlePlaceOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      alert('Invalid quantity');
      return;
    }

    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      alert('Invalid price');
      return;
    }

    const order: Order = {
      id: `order_${Date.now()}`,
      symbol,
      side,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      status: 'PENDING',
      timestamp: Date.now(),
    };

    addOrder(order);

    // Reset form
    setQuantity('');
    setStopLoss('');
    setTakeProfit('');

    console.log('[Order] Placed:', order);
  };

  const calculateRR = (): string => {
    if (!price && !currentPrice) return '-';
    if (!stopLoss || !takeProfit) return '-';

    const entryPrice = orderType === 'LIMIT' ? parseFloat(price) : currentPrice;
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);

    const risk = Math.abs(entryPrice - sl);
    const reward = Math.abs(tp - entryPrice);

    if (risk === 0) return '-';

    return `1:${(reward / risk).toFixed(2)}`;
  };

  // ─── RENDER ───
  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
          Order Entry
        </h2>
        <p className="text-xs text-gray-500 mt-1">{symbol}</p>
      </div>

      {/* Current Price */}
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-800/50">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Current Price</span>
          <span className="text-lg font-mono font-bold text-gray-200">
            {currentPrice > 0 ? currentPrice.toFixed(2) : '-'}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Side */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Side</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide('BUY')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                side === 'BUY'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => setSide('SELL')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                side === 'SELL'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Order Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrderType('MARKET')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                orderType === 'MARKET'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              MARKET
            </button>
            <button
              onClick={() => setOrderType('LIMIT')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                orderType === 'LIMIT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              LIMIT
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price (LIMIT only) */}
        {orderType === 'LIMIT' && (
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Stop Loss */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Stop Loss (optional)
          </label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Take Profit */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Take Profit (optional)
          </label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* R/R Ratio */}
        {stopLoss && takeProfit && (
          <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Risk/Reward Ratio</span>
              <span className="text-sm font-mono font-bold text-blue-400">{calculateRR()}</span>
            </div>
          </div>
        )}

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={!quantity || (orderType === 'LIMIT' && !price)}
          className={`w-full px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
            side === 'BUY'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-700'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-700'
          } text-white disabled:cursor-not-allowed`}
        >
          Place {side} Order
        </button>
      </div>

      {/* Orders & Positions Summary */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-800/50">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Active Orders</span>
          <span className="text-gray-200 font-medium">{orders.length}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Open Positions</span>
          <span className="text-gray-200 font-medium">{positions.length}</span>
        </div>
      </div>
    </div>
  );
};

