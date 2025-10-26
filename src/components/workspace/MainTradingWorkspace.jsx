import React, { useEffect } from 'react';
import InstitutionalPriceChart from './InstitutionalPriceChart';

const MainTradingWorkspace = ({ activeAsset }) => {
  const displaySymbol = activeAsset?.displaySymbol || 'EUR/USD';

  useEffect(() => {
    document.title = `Institutional Trading Cockpit - ${displaySymbol}`;
  }, [displaySymbol]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Full Screen Chart with Tabs */}
      <main className="flex-1 p-4">
        <div className="w-full h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl shadow-xl overflow-hidden">
          <InstitutionalPriceChart asset={activeAsset} />
        </div>
      </main>
    </div>
  );
};

export default MainTradingWorkspace;
