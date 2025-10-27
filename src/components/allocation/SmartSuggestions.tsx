import React from 'react';
import { Bot } from 'lucide-react';

const suggestions = [
  {
    title: 'Reduce BTC exposure by 5% ($6,370)',
    reason: 'Overweight by 10.4% vs target',
    impact: 'Risk score improves from 7.2 to 6.1',
  },
  {
    title: 'Increase Bond allocation by 3% ($3,823)',
    reason: 'Underweight defensive assets in volatile market',
    impact: 'Portfolio volatility reduces by 2.3%',
  },
  {
    title: 'Rotate $5,000 from Tech stocks to Healthcare',
    reason: 'Tech concentration risk (35% of stocks)',
    impact: 'Sector diversification improves',
  },
];

const SmartSuggestions: React.FC = () => {
  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-8 h-8 text-accent" />
        <h2 className="text-xl font-bold">AI Rebalancing Recommendations</h2>
      </div>
      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div key={i} className="bg-white/5 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="font-bold">{s.title}</p>
              <p className="text-xs text-text-secondary mt-1">Reason: {s.reason}</p>
              <p className="text-xs text-green-400">Impact: {s.impact}</p>
            </div>
            <button className="px-4 py-1.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm whitespace-nowrap mt-2 md:mt-0">
              Apply
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <button className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors mr-4">
          Apply All Suggestions
        </button>
        <a href="#" className="text-sm text-accent hover:underline">Customize Suggestions</a>
      </div>
    </div>
  );
};

export default SmartSuggestions;
