import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AssetCard = ({ asset, onClick }) => {
  const isPositive = asset.changePercent > 0;

  return (
    <button
      onClick={() => onClick(asset)}
      className="w-full bg-card-bg border border-border-color rounded-lg p-4 text-left hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg"
    >
      {/* Header: Symbol & Flags */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {asset.flag1 && asset.flag2 && (
            <div className="flex items-center gap-1">
              <span className="text-xl">{asset.flag1}</span>
              <span className="text-xl">{asset.flag2}</span>
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {asset.displaySymbol || asset.symbol}
            </h3>
            <p className="text-xs text-text-secondary">{asset.name}</p>
          </div>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-positive" />
        ) : (
          <TrendingDown className="w-5 h-5 text-negative" />
        )}
      </div>

      {/* Price & Change */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-text-secondary mb-1">Price</p>
          <p className="text-lg font-mono font-semibold text-text-primary">
            ${asset.price}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Change</p>
          <p className={`text-lg font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
            {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Volume */}
      <div className="mt-3 pt-3 border-t border-border-color">
        <p className="text-xs text-text-secondary">Volume</p>
        <p className="text-sm font-mono text-text-primary mt-1">{asset.volume}</p>
      </div>
    </button>
  );
};

export default AssetCard;
