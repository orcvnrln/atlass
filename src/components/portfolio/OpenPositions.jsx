import React from 'react';
import Card from '@/components/dashboard/Card';

const OpenPositions = ({ data }) => {
  return (
    <Card title="Open Positions" className="col-span-1 md:col-span-2 lg:col-span-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-primary-bg text-text-secondary uppercase">
            <tr>
              <th className="p-3">Symbol</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Avg. Price</th>
              <th className="p-3">Current Price</th>
              <th className="p-3">Unrealized P&L</th>
              <th className="p-3">% P&L</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(pos => (
              <tr key={pos.symbol} className="border-t border-border-color hover:bg-primary-bg">
                <td className="p-3 font-semibold monospace text-text-primary">{pos.symbol}</td>
                <td className="p-3 monospace text-text-primary">{pos.quantity.toLocaleString()}</td>
                <td className="p-3 monospace text-text-primary">{pos.avgPrice.toFixed(2)}</td>
                <td className="p-3 monospace text-text-primary">{pos.currentPrice.toFixed(2)}</td>
                <td className={`p-3 monospace ${pos.pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{pos.pnl.toFixed(2)}</td>
                <td className={`p-3 monospace ${pos.pnlPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{pos.pnlPercent.toFixed(2)}%</td>
                <td className="p-3">
                  <button className="text-accent-orange hover:underline">Close</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OpenPositions;
