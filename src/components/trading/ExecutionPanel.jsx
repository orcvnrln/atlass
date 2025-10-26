import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Shield, Zap } from 'lucide-react';

const ExecutionPanel = ({ selectedSetup, riskParams, strategy }) => {
  const [orderParams, setOrderParams] = useState({
    orderType: 'Market',
    quantity: 0,
    entry: '',
    stopLoss: '',
    takeProfit: '',
    direction: 'BUY'
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (selectedSetup) {
      setOrderParams({
        orderType: 'Market',
        quantity: riskParams?.positionSize || selectedSetup.quantity || 10000,
        entry: selectedSetup.entry || '',
        stopLoss: selectedSetup.stopLoss || '',
        takeProfit: selectedSetup.takeProfit || '',
        direction: selectedSetup.direction || 'BUY'
      });
    }
  }, [selectedSetup, riskParams]);

  const handleParamChange = (param, value) => {
    setOrderParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const calculatePnL = () => {
    const { entry, stopLoss, takeProfit, quantity, direction } = orderParams;
    
    if (!entry || !stopLoss || !takeProfit || !quantity) return { risk: 0, reward: 0, ratio: 0 };
    
    const entryPrice = parseFloat(entry);
    const slPrice = parseFloat(stopLoss);
    const tpPrice = parseFloat(takeProfit);
    const size = parseFloat(quantity);
    
    let risk, reward;
    
    if (direction === 'BUY') {
      risk = (entryPrice - slPrice) * size;
      reward = (tpPrice - entryPrice) * size;
    } else {
      risk = (slPrice - entryPrice) * size;
      reward = (entryPrice - tpPrice) * size;
    }
    
    const ratio = risk !== 0 ? Math.abs(reward / risk) : 0;
    
    return { 
      risk: Math.abs(risk), 
      reward: Math.abs(reward), 
      ratio: ratio.toFixed(2) 
    };
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate order placement
    setTimeout(() => {
      setIsPlacingOrder(false);
      // Show success message or handle response
      console.log('Order placed:', orderParams);
    }, 2000);
  };

  const pnl = calculatePnL();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          AI-Powered Execution Suite
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Always visible for instant trading
        </p>
      </div>

      {/* Order Form */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Selected Setup Info */}
        {selectedSetup && (
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <div className="text-sm font-medium mb-2">Selected Setup</div>
            <div className="text-xs text-muted-foreground">
              {selectedSetup.pair || 'EUR/USD'} • {selectedSetup.type || 'Manual'} • 
              Confidence: {selectedSetup.confidence || 85}%
            </div>
          </div>
        )}

        {/* Order Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Order Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleParamChange('orderType', 'Market')}
              className={`p-2 text-sm rounded border transition-colors ${
                orderParams.orderType === 'Market'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => handleParamChange('orderType', 'Limit')}
              className={`p-2 text-sm rounded border transition-colors ${
                orderParams.orderType === 'Limit'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="text-sm font-medium mb-2 block">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleParamChange('direction', 'BUY')}
              className={`p-3 text-sm rounded border transition-colors flex items-center justify-center gap-2 ${
                orderParams.direction === 'BUY'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              BUY
            </button>
            <button
              onClick={() => handleParamChange('direction', 'SELL')}
              className={`p-3 text-sm rounded border transition-colors flex items-center justify-center gap-2 ${
                orderParams.direction === 'SELL'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              SELL
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>
          <input
            type="number"
            value={orderParams.quantity}
            onChange={(e) => handleParamChange('quantity', e.target.value)}
            className="w-full p-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10000"
          />
        </div>

        {/* Entry Price */}
        <div>
          <label className="text-sm font-medium mb-2 block">Entry Price</label>
          <input
            type="number"
            step="0.00001"
            value={orderParams.entry}
            onChange={(e) => handleParamChange('entry', e.target.value)}
            className="w-full p-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.08500"
          />
        </div>

        {/* Stop Loss */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Stop Loss
          </label>
          <input
            type="number"
            step="0.00001"
            value={orderParams.stopLoss}
            onChange={(e) => handleParamChange('stopLoss', e.target.value)}
            className="w-full p-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.08000"
          />
        </div>

        {/* Take Profit */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Target className="w-3 h-3" />
            Take Profit
          </label>
          <input
            type="number"
            step="0.00001"
            value={orderParams.takeProfit}
            onChange={(e) => handleParamChange('takeProfit', e.target.value)}
            className="w-full p-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.09200"
          />
        </div>

        {/* Risk/Reward Display */}
        {pnl.risk > 0 && (
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium">Risk/Reward Analysis</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Risk</div>
                <div className="text-red-500 font-medium">${pnl.risk.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Reward</div>
                <div className="text-green-500 font-medium">${pnl.reward.toFixed(2)}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="text-muted-foreground text-xs">R:R Ratio</div>
              <div className="font-medium">1:{pnl.ratio}</div>
            </div>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !orderParams.entry || !orderParams.quantity}
          className={`w-full p-3 rounded font-medium transition-colors ${
            orderParams.direction === 'BUY'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlacingOrder ? 'Placing Order...' : `Place ${orderParams.direction} Order`}
        </button>
      </div>
    </div>
  );
};

export default ExecutionPanel;
