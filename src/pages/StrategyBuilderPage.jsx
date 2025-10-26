import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StrategyBuilder from '../modules/StrategyBuilder';

const StrategyBuilderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold">Strategy Builder</h1>
              <p className="text-muted-foreground">Professional drag & drop strategy creation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-80px)]">
        {/* Strategy Builder Module - Full Page */}
        <StrategyBuilder isFullPage={true} />
      </div>
    </div>
  );
};

export default StrategyBuilderPage;
