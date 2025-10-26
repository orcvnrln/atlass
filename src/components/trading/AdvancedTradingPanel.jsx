import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle, Calculator, Brain, Sparkles } from 'lucide-react';

const AdvancedTradingPanel = ({ symbol, currentPrice = 1.0855 }) => {
    const [orderType, setOrderType] = useState('market');
    const [side, setSide] = useState('buy');
    const [amount, setAmount] = useState('');
    const [leverage, setLeverage] = useState(1);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [riskPercent, setRiskPercent] = useState(1);
    const [aiEnabled, setAiEnabled] = useState(false);

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

    // AI Suggestions (mock)
    const aiSuggestions = {
        entry: currentPrice,
        stopLoss: side === 'buy' ? (currentPrice * 0.995).toFixed(5) : (currentPrice * 1.005).toFixed(5),
        takeProfit: side === 'buy' ? (currentPrice * 1.015).toFixed(5) : (currentPrice * 0.985).toFixed(5),
        confidence: 87
    };

    // Accept AI Values Handler
    const handleAcceptAI = () => {
        setStopLoss(aiSuggestions.stopLoss);
        setTakeProfit(aiSuggestions.takeProfit);
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-3 flex flex-col gap-3">
            {/* Order Side Buttons - Premium Design */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setSide('buy')}
                    className={`
                        relative py-3 px-4 rounded-lg font-semibold text-sm
                        transition-all duration-200 ease-in-out
                        ${side === 'buy'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                        }
                    `}
                >
                    <ArrowUpRight className="inline mr-1.5" size={16} strokeWidth={2.5} />
                    BUY
                </button>
                <button
                    onClick={() => setSide('sell')}
                    className={`
                        relative py-3 px-4 rounded-lg font-semibold text-sm
                        transition-all duration-200 ease-in-out
                        ${side === 'sell'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-[1.02]'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                        }
                    `}
                >
                    <ArrowDownRight className="inline mr-1.5" size={16} strokeWidth={2.5} />
                    SELL
                </button>
            </div>

            {/* Order Type Tabs - Clean Toggle */}
            <div className="relative">
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">Order Type</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-800/30 p-1 rounded-lg">
                    <button
                        onClick={() => setOrderType('market')}
                        className={`
                            py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wide
                            transition-all duration-150
                            ${orderType === 'market'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-300'
                            }
                        `}
                    >
                        Market
                    </button>
                    <button
                        onClick={() => setOrderType('limit')}
                        className={`
                            py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wide
                            transition-all duration-150
                            ${orderType === 'limit'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-300'
                            }
                        `}
                    >
                        Limit
                    </button>
                </div>
            </div>

            {/* Symbol & Price Display */}
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/50">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Symbol</div>
                        <div className="text-sm font-semibold text-slate-100">{symbol}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Price</div>
                        <div className="text-sm font-bold text-blue-400 tabular-nums">{currentPrice.toFixed(5)}</div>
                    </div>
                </div>
            </div>

            {/* Amount Input */}
            <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
                    Amount ({symbol})
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                               transition-all duration-200 tabular-nums"
                />
                {suggestedSize > 0 && (
                    <p className="text-xs text-blue-400 mt-1.5 flex items-center gap-1">
                        <Calculator size={11} />
                        Suggested: {suggestedSize} (based on {riskPercent}% risk)
                    </p>
                )}
            </div>

            {/* Leverage Slider - Premium Design */}
            <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
                    Leverage: <span className="text-slate-100 font-bold">{leverage}x</span>
                </label>
                <div className="relative">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={leverage}
                        onChange={(e) => setLeverage(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer
                                   [&::-webkit-slider-thumb]:appearance-none
                                   [&::-webkit-slider-thumb]:w-4
                                   [&::-webkit-slider-thumb]:h-4
                                   [&::-webkit-slider-thumb]:rounded-full
                                   [&::-webkit-slider-thumb]:bg-gradient-to-r
                                   [&::-webkit-slider-thumb]:from-blue-400
                                   [&::-webkit-slider-thumb]:to-blue-500
                                   [&::-webkit-slider-thumb]:shadow-lg
                                   [&::-webkit-slider-thumb]:shadow-blue-500/50
                                   [&::-webkit-slider-thumb]:cursor-pointer
                                   [&::-webkit-slider-thumb]:transition-all
                                   [&::-webkit-slider-thumb]:hover:scale-110"
                        style={{
                            background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${leverage}%, rgb(51 65 85 / 0.5) ${leverage}%, rgb(51 65 85 / 0.5) 100%)`
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-1.5 font-medium tabular-nums">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                    <span>100x</span>
                </div>
            </div>

            {/* Risk Per Trade */}
            <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
                    Risk Per Trade (%)
                </label>
                <input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 1)}
                    placeholder="1"
                    step="0.5"
                    max="10"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                               transition-all duration-200 tabular-nums"
                />
            </div>

            {/* Stop Loss */}
            <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
                    Stop Loss
                </label>
                <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Price"
                    step="0.0001"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                               transition-all duration-200 tabular-nums"
                />
            </div>

            {/* Take Profit */}
            <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
                    Take Profit
                </label>
                <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Price"
                    step="0.0001"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                               transition-all duration-200 tabular-nums"
                />
            </div>

            {/* AI Intelligence Toggle */}
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/50">
                <button
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className="w-full flex items-center justify-between group"
                >
                    <div className="flex items-center gap-2">
                        <Brain size={14} className={aiEnabled ? 'text-blue-400' : 'text-slate-500'} />
                        <span className="text-xs font-semibold text-slate-300">AI Suggestions</span>
                        {aiEnabled && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                {aiSuggestions.confidence}% Confidence
                            </span>
                        )}
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-all duration-200 ${aiEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-all duration-200 ${aiEnabled ? 'ml-5' : 'ml-0.5'}`} />
                    </div>
                </button>
                {aiEnabled && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Entry</span>
                            <span className="text-blue-400 font-semibold tabular-nums">{aiSuggestions.entry.toFixed(5)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">SL</span>
                            <span className="text-red-400 font-semibold tabular-nums">{aiSuggestions.stopLoss}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">TP</span>
                            <span className="text-emerald-400 font-semibold tabular-nums">{aiSuggestions.takeProfit}</span>
                        </div>
                        <button
                            onClick={handleAcceptAI}
                            className="w-full mt-2 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 text-xs font-semibold rounded-md transition-all duration-150 border border-blue-500/30 hover:border-blue-500/50"
                        >
                            <Sparkles className="inline mr-1" size={12} />
                            Accept AI Values
                        </button>
                    </div>
                )}
            </div>

            {/* Risk Metrics - Compact Premium Display */}
            <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/50 space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">P/R Ratio</span>
                    <span className={`text-sm font-bold tabular-nums ${parseFloat(rrRatio) >= 2 ? 'text-emerald-400' : parseFloat(rrRatio) === '—' ? 'text-slate-500' : 'text-amber-400'}`}>
                        {rrRatio === '—' ? '—' : `${rrRatio}:1`}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Potential Profit</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">${pnl.profit}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Potential Loss</span>
                    <span className="text-sm font-bold text-red-400 tabular-nums">-${pnl.loss}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Margin Required</span>
                    <span className="text-sm font-bold text-blue-400 tabular-nums">
                        ${((amount || 0) * currentPrice / leverage).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Warning */}
            {leverage > 10 && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-500 font-medium">High leverage increases liquidation risk</p>
                </div>
            )}

            {/* Place Order Button - Premium Design */}
            <button
                className={`
                    w-full py-3 px-4 rounded-lg font-bold text-sm text-white
                    transition-all duration-200 ease-in-out
                    shadow-lg
                    ${side === 'buy'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02]'
                    }
                `}
            >
                <Sparkles className="inline mr-2" size={16} />
                Place {side.toUpperCase()} Order
            </button>
        </div>
    );
};

export default AdvancedTradingPanel;

