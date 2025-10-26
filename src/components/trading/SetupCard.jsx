import React from 'react';
import { TrendingUp, TrendingDown, Target, Shield, Clock, Star } from 'lucide-react';

const SetupCard = ({ setup, isSelected, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getDirectionColor = (direction) => {
    return direction === 'BUY' ? 'text-green-500' : 'text-red-500';
  };

  const getDirectionIcon = (direction) => {
    return direction === 'BUY' ? TrendingUp : TrendingDown;
  };

  const DirectionIcon = getDirectionIcon(setup.direction);

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-500/5 shadow-md'
          : 'border-border bg-card hover:border-border/60'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${setup.direction === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <DirectionIcon className={`w-4 h-4 ${getDirectionColor(setup.direction)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{setup.pair}</h3>
            <p className="text-sm text-muted-foreground">{setup.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(setup.status)}`}>
            {setup.status}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium">{setup.aiScore}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Entry</div>
          <div className="font-medium">{setup.entry}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Stop Loss
          </div>
          <div className="font-medium text-red-500">{setup.stopLoss}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Take Profit
          </div>
          <div className="font-medium text-green-500">{setup.takeProfit}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">R:R Ratio</div>
          <div className="font-medium">1:{setup.riskReward}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{setup.timeframe}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Confidence: <span className="font-medium text-foreground">{setup.confidence}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="bg-muted/30 rounded p-2">
        <div className="text-xs text-muted-foreground mb-1">AI Analysis</div>
        <p className="text-xs">{setup.reason}</p>
      </div>

      {/* Confidence Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Confidence Level</span>
          <span className="text-xs font-medium">{setup.confidence}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              setup.confidence >= 80
                ? 'bg-green-500'
                : setup.confidence >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${setup.confidence}%` }}
          ></div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-blue-500 font-medium">
            ✓ Selected - Values loaded to execution panel
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupCard;
