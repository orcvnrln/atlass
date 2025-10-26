import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calculator } from 'lucide-react';

const AdvancedTradingPanel = ({ symbol, currentPrice = 1.0855 }) => {
    const [orderType, setOrderType] = useState('market');
    const [side, setSide] = useState('buy');
    const [amount, setAmount] = useState('');
    const [leverage, setLeverage] = useState(1);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [riskPercent, setRiskPercent] = useState(1);
    
    // Account balance (mock)
    const accountBalance = 10000;
    
    // Calculate position size based on risk
    const calculatePositionSize = () => {
        if (!stopLoss || stopLoss === '') return 0;
        const slDistance = Math.abs(currentPrice - parseFloat(stopLoss));
        if (slDistance === 0) return 0;
        const riskAmount = accountBalance * (riskPercent / 100);
        return (riskAmount / slDistance).toFixed(2);
    };
    
    // Calculate risk/reward ratio
    const calculateRR = () => {
        if (!stopLoss || !takeProfit) return '—';
        const risk = Math.abs(currentPrice - parseFloat(stopLoss));
        const reward = Math.abs(parseFloat(takeProfit) - currentPrice);
        if (risk === 0) return '—';
        return (reward / risk).toFixed(2);
    };
    
    // Calculate potential P&L
    const calculatePnL = () => {
        if (!amount || !takeProfit) return { profit: 0, loss: 0 };
        const qty = parseFloat(amount);
        const profit = qty * Math.abs(parseFloat(takeProfit) - currentPrice) * leverage;
        const loss = stopLoss ? qty * Math.abs(currentPrice - parseFloat(stopLoss)) * leverage : 0;
        return { profit: profit.toFixed(2), loss: loss.toFixed(2) };
    };
    
    const pnl = calculatePnL();
    const rrRatio = calculateRR();
    const suggestedSize = calculatePositionSize();

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-4">
            {/* Header with Buy/Sell Toggle */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setSide('buy')}
                    className={`py-3 rounded-lg font-bold transition-all ${
                        side === 'buy'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    <TrendingUp className="inline mr-2" size={18} />
                    BUY
                </button>
                <button
                    onClick={() => setSide('sell')}
                    className={`py-3 rounded-lg font-bold transition-all ${
                        side === 'sell'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    <TrendingDown className="inline mr-2" size={18} />
                    SELL
                </button>
            </div>
            
            {/* Order Type */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setOrderType('market')}
                        className={`py-2 rounded text-sm font-medium ${
                            orderType === 'market'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        Market
                    </button>
                    <button
                        onClick={() => setOrderType('limit')}
                        className={`py-2 rounded text-sm font-medium ${
                            orderType === 'limit'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        Limit
                    </button>
                </div>
            </div>

            {/* Amount */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Amount ({symbol})</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                />
                {suggestedSize > 0 && (
                    <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                        <Calculator size={12} />
                        Suggested: {suggestedSize} (based on {riskPercent}% risk)
                    </p>
                )}
            </div>

            {/* Leverage */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Leverage: {leverage}x</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                    <span>100x</span>
                </div>
            </div>

            {/* Risk % */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Risk Per Trade (%)</label>
                <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 1)}
                    placeholder="1"
                    step="0.5"
                    max="10"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Stop Loss */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Stop Loss</label>
                <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Price"
                    step="0.0001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Take Profit */}
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Take Profit</label>
                <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Price"
                    step="0.0001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Risk/Reward & P&L Preview */}
            <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">R:R Ratio</span>
                    <span className={`font-bold ${parseFloat(rrRatio) >= 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {rrRatio}:1
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Potential Profit</span>
                    <span className="font-bold text-green-400">${pnl.profit}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Potential Loss</span>
                    <span className="font-bold text-red-400">-${pnl.loss}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Margin Required</span>
                    <span className="font-bold text-blue-400">
                        ${((amount || 0) * currentPrice / leverage).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Warning */}
            {leverage > 10 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle size={16} className="text-yellow-500" />
                    <p className="text-xs text-yellow-500">High leverage increases liquidation risk</p>
                </div>
            )}

            {/* Place Order Button */}
            <button
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                    side === 'buy'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                } shadow-lg`}
            >
                Place {side.toUpperCase()} Order
            </button>
        </div>
    );
};

export default AdvancedTradingPanel;

