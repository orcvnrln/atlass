import React from 'react';
import { Badge } from '@/components/ui/badge'; // Assuming a Badge component exists

const taxData = [
  { position: 'TSLA', gainLoss: -2340, opportunity: 'Tax Loss Harvest' },
  { position: 'BTC', gainLoss: 12500, opportunity: 'Unrealized Gain' },
  { position: 'ETH', gainLoss: 5800, opportunity: 'Unrealized Gain' },
];

const TaxOptimization: React.FC = () => {
  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color relative">
      <Badge variant="secondary" className="absolute top-4 right-4">Premium</Badge>
      <h2 className="text-xl font-bold mb-4">Tax-Efficient Rebalancing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2">Unrealized Gains/Losses</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-color"><th className="text-left p-2">Position</th><th className="text-right">Gain/Loss</th></tr></thead>
            <tbody>
              {taxData.map(d => (
                <tr key={d.position}><td className="p-2">{d.position}</td><td className={`text-right ${d.gainLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>${d.gainLoss.toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="font-bold mb-2">Opportunities</h3>
          <div className="space-y-2">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm font-bold">Sell TSLA (-$2,340 loss) to offset BTC gains</p>
              <p className="text-xs text-green-400">Potential tax savings: $585</p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm">
            Optimize for Taxes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxOptimization;
