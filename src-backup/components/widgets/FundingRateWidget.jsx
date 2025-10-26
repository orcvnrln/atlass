import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Percent, TrendingUp, TrendingDown } from 'lucide-react';

const FundingRateWidget = ({ symbol = 'BTC/USD' }) => {
    const fundingHistory = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => ({
            time: `${23 - i}h`,
            rate: (Math.random() - 0.5) * 0.1, // -0.05% to +0.05%
            timestamp: Date.now() - i * 3600000
        })).reverse();
    }, []);

    const currentRate = fundingHistory[fundingHistory.length - 1].rate;
    const avgRate = fundingHistory.reduce((acc, curr) => acc + curr.rate, 0) / fundingHistory.length;
    const trend = currentRate > avgRate ? 'bullish' : 'bearish';

    // Calculate annualized rate (funding happens 3x per day)
    const annualizedRate = (currentRate * 3 * 365).toFixed(2);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-xl">
                    <p className="text-xs text-gray-400">{data.time} ago</p>
                    <p className={`text-sm font-bold ${data.rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(data.rate * 100).toFixed(4)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Percent size={20} className="text-blue-400" />
                    Funding Rate
                </h3>
                <p className="text-xs text-gray-500">Perpetual futures funding for {symbol}</p>
            </div>

            {/* Current Rate Display */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Current Rate</p>
                    <p className={`text-xl font-bold ${currentRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(currentRate * 100).toFixed(4)}%
                    </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">24h Avg</p>
                    <p className="text-xl font-bold text-gray-300">
                        {(avgRate * 100).toFixed(4)}%
                    </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Annualized</p>
                    <p className={`text-xl font-bold ${parseFloat(annualizedRate) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {annualizedRate}%
                    </p>
                </div>
            </div>

            {/* Funding History Chart */}
            <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fundingHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                        <XAxis 
                            dataKey="time" 
                            stroke="#9CA3AF" 
                            fontSize={10}
                            interval="preserveStartEnd"
                        />
                        <YAxis 
                            stroke="#9CA3AF" 
                            fontSize={10}
                            tickFormatter={(value) => `${(value * 100).toFixed(3)}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
                        <Line 
                            type="monotone" 
                            dataKey="rate" 
                            stroke={currentRate >= 0 ? '#26A69A' : '#EF5350'} 
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Market Sentiment Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-800">
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    trend === 'bullish' 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-red-500/10 border border-red-500/30'
                }`}>
                    {trend === 'bullish' ? (
                        <TrendingUp size={16} className="text-green-400" />
                    ) : (
                        <TrendingDown size={16} className="text-red-400" />
                    )}
                    <div className="flex-1">
                        <p className={`text-xs font-semibold ${trend === 'bullish' ? 'text-green-300' : 'text-red-300'}`}>
                            {trend === 'bullish' ? 'Long Positions Dominating' : 'Short Positions Dominating'}
                        </p>
                        <p className="text-xs text-gray-400">
                            {currentRate >= 0 
                                ? 'Longs pay shorts in the next funding cycle' 
                                : 'Shorts pay longs in the next funding cycle'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingRateWidget;

