import React from 'react';
import { motion } from 'framer-motion';

const riskMetrics = {
  beta: 1.12,
  sharpeRatio: 1.84,
  var: '2.5M',
  maxDrawdown: '-12.5%',
  volatility: '18.2% (30d)',
};

const correlationMatrix = {
  labels: ['Stocks', 'Crypto', 'Forex', 'Cmdty'],
  matrix: [
    [1.00, 0.65, -0.10, -0.30],
    [0.65, 1.00, 0.20, -0.50],
    [-0.10, 0.20, 1.00, 0.60],
    [-0.30, -0.50, 0.60, 1.00],
  ],
};

const MetricCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white/5 p-4 rounded-lg">
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="text-2xl font-bold text-text-primary">{value}</p>
  </div>
);

const RiskMetricsDashboard: React.FC = () => {
  const getColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return 'bg-red-500/50';
    if (absValue > 0.4) return 'bg-orange-500/50';
    if (value > 0) return 'bg-green-500/50';
    return 'bg-blue-500/50';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Metrics Grid */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        <MetricCard label="Portfolio Beta" value={riskMetrics.beta} />
        <MetricCard label="Sharpe Ratio" value={riskMetrics.sharpeRatio} />
        <MetricCard label="Value at Risk (95%)" value={riskMetrics.var} />
        <MetricCard label="Max Drawdown" value={riskMetrics.maxDrawdown} />
        <MetricCard label="Volatility (30d)" value={riskMetrics.volatility} />
      </div>

      {/* Correlation Matrix */}
      <div className="lg:col-span-3 bg-card-bg p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Correlation Matrix</h3>
        <div className="flex flex-col">
          <div className="flex ml-12">
            {correlationMatrix.labels.map(label => (
              <div key={label} className="w-16 text-center text-xs font-bold">{label}</div>
            ))}
          </div>
          {correlationMatrix.matrix.map((row, i) => (
            <div key={i} className="flex items-center">
              <div className="w-12 text-right text-xs font-bold pr-2">{correlationMatrix.labels[i]}</div>
              {row.map((val, j) => (
                <div
                  key={j}
                  className={`w-16 h-16 flex items-center justify-center text-xs font-mono border border-black/20 ${getColor(val)}`}
                >
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskMetricsDashboard;

