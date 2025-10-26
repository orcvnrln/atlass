import React from 'react';
import { Button } from '@/components/ui/button';

const PreferencesTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Preferences</h3>
        <p className="text-sm text-text-secondary">Customize your platform experience.</p>
      </div>
      <div className="space-y-4">
        <div>
            <label className="text-sm text-text-secondary">Default Chart Timeframe</label>
            <select defaultValue="1h" className="w-full mt-1 bg-primary-bg border border-border-color rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent text-sm">
                <option>5m</option>
                <option>15m</option>
                <option>1h</option>
                <option>4h</option>
                <option>1D</option>
            </select>
        </div>
        <div>
            <label className="text-sm text-text-secondary">Data Refresh Rate</label>
            <select defaultValue="5s" className="w-full mt-1 bg-primary-bg border border-border-color rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent text-sm">
                <option>1s</option>
                <option>5s</option>
                <option>15s</option>
                <option>30s</option>
            </select>
        </div>
      </div>
      <Button>Save Preferences</Button>
    </div>
  );
};

export default PreferencesTab;
