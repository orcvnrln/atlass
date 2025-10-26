import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

const MaxPainIndicator = ({ symbol = 'BTC/USD', currentPrice = 68500 }) => {
    // Mock options data - in production, this would calculate from full options chain
    const optionsData = useMemo(() => {
        const strikes = [66000, 67000, 68000, 68500, 69000, 70000, 71000];
        return strikes.map(strike => {
            // Simplified max pain calculation (sum of OI * distance from strike)
            const callOI = Math.random() * 5000 + 1000;
            const putOI = Math.random() * 5000 + 1000;
            const distance = Math.abs(strike - currentPrice);
            const pain = (callOI * Math.max(0, currentPrice - strike)) + 
                         (putOI * Math.max(0, strike - currentPrice));
            return {
                strike,
                pain: pain / 1000, // Normalize for display
                callOI,
                putOI,
                totalOI: callOI + putOI
            };
        });
    }, [currentPrice]);

    // Find max pain point (lowest pain value)
    const maxPainStrike = useMemo(() => {
        return optionsData.reduce((min, curr) => 
            curr.pain < min.pain ? curr : min
        ).strike;
    }, [optionsData]);

    const distanceFromMaxPain = ((currentPrice - maxPainStrike) / maxPainStrike * 100).toFixed(2);
    const direction = currentPrice > maxPainStrike ? 'above' : 'below';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                    <p className="font-bold text-white mb-1">${data.strike.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Pain Score: {data.pain.toFixed(0)}</p>
                    <p className="text-xs text-green-400">Call OI: {data.callOI.toFixed(0)}</p>
                    <p className="text-xs text-red-400">Put OI: {data.putOI.toFixed(0)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target size={20} className="text-purple-400" />
                    Max Pain Indicator
                </h3>
                <p className="text-xs text-gray-500">Options expiration pain analysis for {symbol}</p>
            </div>

            {/* Max Pain Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Max Pain Strike</p>
                    <p className="text-xl font-bold text-purple-400">${maxPainStrike.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Current Price</p>
                    <p className="text-xl font-bold text-blue-400">${currentPrice.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Distance</p>
                    <p className={`text-xl font-bold ${direction === 'above' ? 'text-green-400' : 'text-red-400'}`}>
                        {distanceFromMaxPain > 0 ? '+' : ''}{distanceFromMaxPain}%
                    </p>
                </div>
            </div>

            {/* Pain Distribution Chart */}
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={optionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                        <XAxis 
                            dataKey="strike" 
                            stroke="#9CA3AF" 
                            fontSize={11}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis stroke="#9CA3AF" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine 
                            x={maxPainStrike} 
                            stroke="#A855F7" 
                            strokeWidth={2} 
                            strokeDasharray="5 5"
                            label={{ value: 'Max Pain', fill: '#A855F7', fontSize: 11, position: 'top' }}
                        />
                        <Bar dataKey="pain" radius={[4, 4, 0, 0]}>
                            {optionsData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.strike === maxPainStrike ? '#A855F7' : '#4C6EF5'} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-start gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <AlertTriangle size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs text-purple-300 font-semibold mb-1">Max Pain Theory</p>
                        <p className="text-xs text-gray-400">
                            Price is {Math.abs(parseFloat(distanceFromMaxPain)).toFixed(2)}% {direction} max pain. 
                            Market makers may push price toward ${maxPainStrike.toLocaleString()} at expiry 
                            to minimize payout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaxPainIndicator;

