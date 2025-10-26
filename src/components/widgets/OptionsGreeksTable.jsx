import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const OptionsGreeksTable = ({ symbol = 'BTC/USD' }) => {
    // Mock Greeks data - in production, this would come from an options pricing API
    const greeksData = [
        { 
            strike: 68000, 
            type: 'Call', 
            delta: 0.65, 
            gamma: 0.00012, 
            theta: -15.50, 
            vega: 125.30, 
            iv: 45.2,
            volume: 1250,
            oi: 3400
        },
        { 
            strike: 68500, 
            type: 'Call', 
            delta: 0.52, 
            gamma: 0.00015, 
            theta: -18.20, 
            vega: 142.10, 
            iv: 47.5,
            volume: 890,
            oi: 2100
        },
        { 
            strike: 69000, 
            type: 'Call', 
            delta: 0.38, 
            gamma: 0.00014, 
            theta: -16.80, 
            vega: 138.50, 
            iv: 48.9,
            volume: 1580,
            oi: 4200
        },
        { 
            strike: 68000, 
            type: 'Put', 
            delta: -0.35, 
            gamma: 0.00012, 
            theta: -12.30, 
            vega: 121.80, 
            iv: 44.8,
            volume: 950,
            oi: 2800
        },
        { 
            strike: 68500, 
            type: 'Put', 
            delta: -0.48, 
            gamma: 0.00015, 
            theta: -15.60, 
            vega: 139.20, 
            iv: 46.3,
            volume: 1120,
            oi: 3650
        },
        { 
            strike: 69000, 
            type: 'Put', 
            delta: -0.62, 
            gamma: 0.00014, 
            theta: -14.90, 
            vega: 135.70, 
            iv: 47.1,
            volume: 780,
            oi: 1900
        },
    ];

    const getGreekColor = (greek, value) => {
        if (greek === 'delta') {
            return value > 0 ? 'text-green-400' : 'text-red-400';
        }
        if (greek === 'theta') {
            return value < 0 ? 'text-red-400' : 'text-green-400';
        }
        return 'text-gray-300';
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Options Greeks</h3>
                <p className="text-xs text-gray-500">Live Greeks for {symbol} options chain</p>
            </div>
            
            <div className="flex-1 overflow-auto scrollbar-thin">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-900">
                        <tr className="border-b border-gray-800">
                            <th className="text-left py-2 px-2 text-gray-400 font-semibold">Strike</th>
                            <th className="text-left py-2 px-2 text-gray-400 font-semibold">Type</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">Δ (Delta)</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">Γ (Gamma)</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">Θ (Theta)</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">V (Vega)</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">IV %</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">Vol</th>
                            <th className="text-right py-2 px-2 text-gray-400 font-semibold">OI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {greeksData.map((row, idx) => (
                            <tr 
                                key={idx} 
                                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="py-2 px-2 font-mono text-white">${row.strike.toLocaleString()}</td>
                                <td className="py-2 px-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                        row.type === 'Call' 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {row.type === 'Call' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {row.type}
                                    </span>
                                </td>
                                <td className={`py-2 px-2 text-right font-mono ${getGreekColor('delta', row.delta)}`}>
                                    {row.delta.toFixed(3)}
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-gray-300">
                                    {row.gamma.toFixed(5)}
                                </td>
                                <td className={`py-2 px-2 text-right font-mono ${getGreekColor('theta', row.theta)}`}>
                                    {row.theta.toFixed(2)}
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-blue-400">
                                    {row.vega.toFixed(2)}
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-purple-400">
                                    {row.iv.toFixed(1)}%
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-gray-400">
                                    {row.volume.toLocaleString()}
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-gray-400">
                                    {row.oi.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Greeks Legend */}
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-gray-500">Delta (Δ):</span>
                    <span className="text-gray-400 ml-1">Price sensitivity</span>
                </div>
                <div>
                    <span className="text-gray-500">Gamma (Γ):</span>
                    <span className="text-gray-400 ml-1">Delta change rate</span>
                </div>
                <div>
                    <span className="text-gray-500">Theta (Θ):</span>
                    <span className="text-gray-400 ml-1">Time decay</span>
                </div>
                <div>
                    <span className="text-gray-500">Vega (V):</span>
                    <span className="text-gray-400 ml-1">Volatility sensitivity</span>
                </div>
            </div>
        </div>
    );
};

export default OptionsGreeksTable;

