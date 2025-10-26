import React from 'react';
import AICoPilotPanel from '@/components/dashboard/AICoPilotPanel';

const AICopilotPage = () => {
  return (
    <div className="min-h-screen bg-primary-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-6">AI Co-Pilot</h1>
        <p className="text-lg text-text-secondary mb-8">
          Your personal AI assistant for navigating the markets. Get real-time signals, educational content, and market insights.
        </p>
        <AICoPilotPanel />
      </div>
    </div>
  );
};

export default AICopilotPage;
