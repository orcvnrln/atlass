import React from 'react';
import Card from '@/components/dashboard/Card';

const RiskMetrics = ({ data }) => {
  return (
    <Card title="Risk Metrics">
      <div className="space-y-3 text-sm text-text-primary">
        <div className="flex justify-between">
          <span>Value at Risk (VaR, 1-day)</span>
          <span className="font-bold monospace text-accent-red">
            {data.var.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Sharpe Ratio</span>
          <span className="font-bold monospace text-accent-green">{data.sharpeRatio}</span>
        </div>
        <div className="flex justify-between">
          <span>Market Beta</span>
          <span className="font-bold monospace">{data.beta}</span>
        </div>
        <div className="flex justify-between">
          <span>Max Drawdown</span>
          <span className="font-bold monospace text-accent-red">{data.maxDrawdown}%</span>
        </div>
      </div>
    </Card>
  );
};

export default RiskMetrics;
