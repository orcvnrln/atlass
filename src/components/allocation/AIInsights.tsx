import React from 'react';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';

const insights = [
  {
    icon: AlertTriangle,
    text: 'Your Stocks allocation is 5% above target. Consider selling $2,500 to rebalance.',
    color: 'text-yellow-500',
  },
  {
    icon: TrendingUp,
    text: 'Commodities showing strong momentum. Historical data suggests 12% correlation with current market conditions.',
    color: 'text-green-500',
  },
  {
    icon: Target,
    text: 'Optimal rebalancing window: Next 3-5 days based on liquidity analysis.',
    color: 'text-blue-500',
  },
];

const AIInsights: React.FC = () => {
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
            <Icon className={`w-6 h-6 ${insight.color}`} />
            <p className="text-text-secondary">{insight.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AIInsights;

