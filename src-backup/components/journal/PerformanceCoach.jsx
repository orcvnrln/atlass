import React, { useMemo } from 'react';

const PerformanceCoach = ({ entries }) => {
  const stats = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        totalTrades: 0,
        manualTrades: 0,
        autoTrades: 0,
        winRate: 0,
        bestStrategy: 'N/A',
      };
    }

    const manualEntries = entries.filter(e => e.type === 'manual' && e.notes);
    const winningTrades = manualEntries.filter(e => 
      e.notes.toLowerCase().includes('win') || e.notes.toLowerCase().includes('profit')
    ).length;
    
    const strategies = manualEntries
      .map(e => e.strategy)
      .filter(Boolean)
      .reduce((acc, strategy) => {
        acc[strategy] = (acc[strategy] || 0) + 1;
        return acc;
      }, {});

    const bestStrategy = Object.keys(strategies).length > 0
      ? Object.entries(strategies).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';
      
    return {
      totalTrades: entries.length,
      manualTrades: manualEntries.length,
      autoTrades: entries.length - manualEntries.length,
      winRate: manualEntries.length > 0 ? ((winningTrades / manualEntries.length) * 100).toFixed(1) : 0,
      bestStrategy,
    };
  }, [entries]);

  return (
    <div className="p-4 bg-card-bg rounded-xl sticky top-24 card-elevation border border-border-on-card">
      <h2 className="text-xl font-bold mb-4 text-text-on-card-primary">AI Performance Coach</h2>
      
      {stats.totalTrades > 0 ? (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-on-card-secondary">Total Trades Logged:</span>
            <span className="font-bold text-text-on-card-primary">{stats.totalTrades}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-on-card-secondary">Win Rate (Manual):</span>
            <span className="font-bold text-positive">{stats.winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-on-card-secondary">Most Used Strategy:</span>
            <span className="font-bold text-accent">{stats.bestStrategy}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border-color">
            <p className="text-text-on-card-secondary italic">
              <span className="font-bold text-accent">Insight:</span> Your most frequent strategy is '{stats.bestStrategy}'. Ensure you are tracking its performance against other potential strategies.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-text-on-card-secondary">Start journaling your trades to receive personalized AI feedback.</p>
      )}
    </div>
  );
};

export default PerformanceCoach;
