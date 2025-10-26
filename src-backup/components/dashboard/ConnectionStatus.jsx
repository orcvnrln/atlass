import React from 'react';
import Card from './Card';
import { mockConnectionStatus } from '@/data/mockData';
import { CheckCircle, XCircle, RefreshCw, Activity } from 'lucide-react';

const StatusIndicator = ({ label, isConnected }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-300">{label}</span>
    {isConnected ? (
      <CheckCircle className="w-5 h-5 text-accent-green" />
    ) : (
      <XCircle className="w-5 h-5 text-accent-red" />
    )}
  </div>
);

const ConnectionStatus = () => {
  return (
    <Card title="Connection Status" className="col-span-1 md:col-span-2 lg:col-span-2">
      <div className="space-y-4">
        <StatusIndicator label="Market Data" isConnected={mockConnectionStatus.marketData} />
        <StatusIndicator label="AI Service" isConnected={mockConnectionStatus.aiService} />
        <StatusIndicator label="Portfolio Sync" isConnected={mockConnectionStatus.portfolioSync} />
        <div className="flex space-x-4 pt-4">
          <button className="flex-1 flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reconnect All
          </button>
          <button className="flex-1 flex items-center justify-center p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
            <Activity className="w-4 h-4 mr-2" />
            Test Connection
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ConnectionStatus;