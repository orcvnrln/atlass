import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Clock, DollarSign } from 'lucide-react';

interface OrderFlowTabProps {
  asset: string;
}

interface LargeTrade {
  time: string;
  size: number;
  price: number;
  type: 'BUY' | 'SELL';
  institution: string;
}

const OrderFlowTab: React.FC<OrderFlowTabProps> = ({ asset }) => {
  const [imbalance, setImbalance] = useState(68);
  const [largeTrades, setLargeTrades] = useState<LargeTrade[]>([
    {
      time: '21:15',
      size: 2.1,
      price: 42150,
      type: 'BUY',
      institution: 'Likely Hedge Fund',
    },
    {
      time: '21:12',
      size: -1.8,
      price: 42140,
      type: 'SELL',
      institution: 'Likely Market Maker',
    },
    {
      time: '21:10',
      size: 3.2,
      price: 42100,
      type: 'BUY',
      institution: 'Likely Exchange In',
    },
    {
      time: '21:08',
      size: -2.5,
      price: 42080,
      type: 'SELL',
      institution: 'Unknown Institution',
    },
    {
      time: '21:05',
      size: 1.9,
      price: 42050,
      type: 'BUY',
      institution: 'Likely Hedge Fund',
    },
  ]);

  const [divergenceAlerts, setDivergenceAlerts] = useState([
    {
      type: 'Price-Volume',
      description: 'Price up 2.4%, Volume down 8% (last 1h)',
      severity: 'Medium',
    },
    {
      type: 'Price-Momentum',
      description: 'RSI divergence detected on 4h chart',
      severity: 'Low',
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setImbalance(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100">Order Flow Analysis - {asset}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      </div>

      {/* Bid/Ask Imbalance */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-400" />
          Bid/Ask Imbalance (Last 60s)
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <div 
                  className="flex-1 bg-emerald-900 rounded h-8 flex items-center justify-end pr-2"
                  style={{ width: `${imbalance}%` }}
                >
                  <span className="text-emerald-400 text-sm font-bold">
                    {imbalance.toFixed(1)}%
                  </span>
                </div>
                <div 
                  className="flex-1 bg-red-900 rounded h-8 flex items-center justify-start pl-2"
                  style={{ width: `${100 - imbalance}%` }}
                >
                  <span className="text-red-400 text-sm font-bold">
                    {(100 - imbalance).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                {imbalance > 50 ? '+' : ''}{(imbalance - 50).toFixed(1)}% more buying volume than selling
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Large Block Trades */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-purple-400" />
          Large Block Trades (Institutional Activity)
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 border-b border-slate-700">
              <tr>
                <th className="text-left py-2">Time</th>
                <th className="text-right py-2">Size (M BTC)</th>
                <th className="text-right py-2">Price</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Institution (est)</th>
              </tr>
            </thead>
            <tbody>
              {largeTrades.map((trade, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="py-3 font-mono">{trade.time}</td>
                  <td className={`text-right font-mono font-bold ${
                    trade.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.size > 0 ? '+' : ''}{trade.size.toFixed(1)}M
                  </td>
                  <td className="text-right font-mono">${trade.price.toLocaleString()}</td>
                  <td className={trade.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>
                    {trade.type}
                  </td>
                  <td className="text-slate-300">{trade.institution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liquidity Profile */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-400" />
          Liquidity Profile (Point of Control)
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Highest Volume Zone</span>
            <span className="text-slate-100 font-mono">$42,000-$42,200</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Level Type</span>
            <span className="text-green-400 font-semibold">Support Level</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Volume at Support</span>
            <span className="text-slate-100 font-mono">45M BTC total traded</span>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400 flex items-center gap-2">
              <TrendingUp size={16} />
              ✓ Support holds strong | Bullish continuation likely
            </p>
          </div>
        </div>
      </div>

      {/* Divergence Alerts */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-400" />
          Divergence Alerts
        </h4>
        
        <div className="space-y-3">
          {divergenceAlerts.map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{alert.type}</span>
                <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-slate-300">{alert.description}</p>
              <p className="text-xs text-slate-500 mt-1">
                → Potential reversal signal (weak uptrend)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">+1.5M</div>
          <div className="text-xs text-slate-400">Buy Pressure</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">-0.8M</div>
          <div className="text-xs text-slate-400">Sell Pressure</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">68%</div>
          <div className="text-xs text-slate-400">Imbalance</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">5</div>
          <div className="text-xs text-slate-400">Large Trades (5min)</div>
        </div>
      </div>
    </div>
  );
};

export default OrderFlowTab;
