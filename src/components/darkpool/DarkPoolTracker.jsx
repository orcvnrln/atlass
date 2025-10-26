import React from 'react';
import { Lock } from 'lucide-react';

const DarkPoolTracker = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 text-center">
      <div className="bg-card-bg border border-border-color rounded-lg p-8">
        <div className="flex justify-center mb-4">
          <Lock size={48} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Dark Pool & Institutional Flow Tracker</h1>
        <p className="text-text-secondary">
          This feature is coming soon. Get ready for exclusive insights into institutional trading activity.
        </p>
      </div>
    </div>
  );
};

export default DarkPoolTracker;
