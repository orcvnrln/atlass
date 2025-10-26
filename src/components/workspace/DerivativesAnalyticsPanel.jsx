import React from 'react';
import OpenInterestChart from '@/components/charts/OpenInterestChart';
import OptionsOIChart from '@/components/charts/OptionsOIChart';
import VolumeChart from '@/components/charts/VolumeChart';
import { Gauge } from 'lucide-react';

const DerivativesAnalyticsPanel = () => {
  return (
    <div className="bg-card-bg border border-border-on-card rounded-xl p-5 flex flex-col h-full">
      <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-border-color flex items-center gap-2">
        <Gauge size={20} className="text-cyan-400" />
        Derivatives Analytics
      </h3>
      <div className="flex-1 space-y-5 overflow-y-auto scrollbar-thin pr-1">
        <div className="min-h-[300px] border border-border-on-card rounded-lg p-4 bg-primary-bg/60 overflow-hidden">
          <OpenInterestChart />
        </div>
        <div className="min-h-[300px] border border-border-on-card rounded-lg p-4 bg-primary-bg/60 overflow-hidden">
          <VolumeChart />
        </div>
        <div className="min-h-[300px] border border-border-on-card rounded-lg p-4 bg-primary-bg/60 overflow-hidden">
          <OptionsOIChart />
        </div>
        <div className="min-h-[220px] border border-border-on-card rounded-lg p-5 flex flex-col justify-center bg-primary-bg/60">
            <p className="text-xs text-text-secondary uppercase mb-2">Funding Rate & Premium</p>
            <p className="text-3xl font-semibold text-white">+0.012% / +$45.2</p>
            <p className="text-xs text-text-secondary mt-2">Momentum remains supportive; ensure leverage {'<'} 5x if funding spikes above 0.03%.</p>
        </div>
      </div>
    </div>
  );
};

export default DerivativesAnalyticsPanel;
