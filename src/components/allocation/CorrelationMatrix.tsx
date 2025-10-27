import React from 'react';

const correlationData = {
  labels: ['BTC', 'ETH', 'AAPL', 'TSLA', 'GOOGL', 'EUR/USD', 'XAU/USD', 'WTI', 'US10Y', 'MSFT'],
  matrix: [
    [1.00, 0.92, 0.45, 0.55, 0.48, -0.10, -0.30, 0.20, -0.40, 0.58],
    [0.92, 1.00, 0.41, 0.51, 0.44, -0.12, -0.35, 0.22, -0.45, 0.54],
    [0.45, 0.41, 1.00, 0.65, 0.75, 0.05, -0.15, 0.10, -0.25, 0.85],
    [0.55, 0.51, 0.65, 1.00, 0.68, 0.08, -0.20, 0.15, -0.30, 0.71],
    [0.48, 0.44, 0.75, 0.68, 1.00, 0.06, -0.18, 0.12, -0.28, 0.78],
    [-0.10, -0.12, 0.05, 0.08, 0.06, 1.00, 0.25, -0.05, 0.50, 0.07],
    [-0.30, -0.35, -0.15, -0.20, -0.18, 0.25, 1.00, 0.40, 0.60, -0.17],
    [0.20, 0.22, 0.10, 0.15, 0.12, -0.05, 0.40, 1.00, -0.10, 0.14],
    [-0.40, -0.45, -0.25, -0.30, -0.28, 0.50, 0.60, -0.10, 1.00, -0.29],
    [0.58, 0.54, 0.85, 0.71, 0.78, 0.07, -0.17, 0.14, -0.29, 1.00],
  ],
};

const CorrelationMatrix: React.FC = () => {
  const getColor = (value: number) => {
    if (value > 0.7) return 'bg-green-800';
    if (value > 0.4) return 'bg-green-600';
    if (value > 0) return 'bg-green-400';
    if (value < -0.7) return 'bg-red-800';
    if (value < -0.4) return 'bg-red-600';
    if (value < 0) return 'bg-red-400';
    return 'bg-gray-700';
  };

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color">
      <h2 className="text-xl font-bold mb-2">Asset Correlation Analysis</h2>
      <p className="text-sm text-text-secondary mb-6">Identify diversification opportunities</p>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-11 gap-1 text-xs">
          <div />
          {correlationData.labels.map(label => <div key={label} className="text-center font-bold">{label}</div>)}
          {correlationData.matrix.map((row, i) => (
            <React.Fragment key={i}>
              <div className="text-right font-bold">{correlationData.labels[i]}</div>
              {row.map((val, j) => (
                <div key={j} className={`flex items-center justify-center h-12 rounded ${getColor(val)}`} title={val.toFixed(2)}>
                  {val.toFixed(2)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-lg text-sm">
        <p className="font-bold">⚠️ High correlation detected between BTC and ETH (0.92)</p>
        <p>Consider diversifying into uncorrelated assets like Bonds or Commodities to reduce risk.</p>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
