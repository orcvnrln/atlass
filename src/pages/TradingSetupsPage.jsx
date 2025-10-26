import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Shield, Star } from 'lucide-react';
import ExecutionPanel from '../components/trading/ExecutionPanel';
import SetupCard from '../components/trading/SetupCard';

const TradingSetupsPage = () => {
  const navigate = useNavigate();
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [setups, setSetups] = useState([]);

  // Mock AI-generated setups
  useEffect(() => {
    const mockSetups = [
      {
        id: 1,
        pair: 'EUR/USD',
        type: 'Breakout',
        direction: 'BUY',
        confidence: 87,
        entry: 1.0850,
        stopLoss: 1.0800,
        takeProfit: 1.0920,
        riskReward: 1.4,
        timeframe: '4H',
        reason: 'Strong bullish momentum with volume confirmation',
        aiScore: 9.2,
        status: 'Active'
      },
      {
        id: 2,
        pair: 'GBP/JPY',
        type: 'Reversal',
        direction: 'SELL',
        confidence: 92,
        entry: 185.50,
        stopLoss: 186.20,
        takeProfit: 183.80,
        riskReward: 2.4,
        timeframe: '1H',
        reason: 'Overbought RSI with bearish divergence',
        aiScore: 9.6,
        status: 'Pending'
      },
      {
        id: 3,
        pair: 'USD/CAD',
        type: 'Trend Following',
        direction: 'BUY',
        confidence: 78,
        entry: 1.3520,
        stopLoss: 1.3480,
        takeProfit: 1.3600,
        riskReward: 2.0,
        timeframe: '1D',
        reason: 'Uptrend continuation with support bounce',
        aiScore: 8.4,
        status: 'Active'
      },
      {
        id: 4,
        pair: 'AUD/USD',
        type: 'Range Trading',
        direction: 'SELL',
        confidence: 83,
        entry: 0.6720,
        stopLoss: 0.6750,
        takeProfit: 0.6650,
        riskReward: 2.3,
        timeframe: '4H',
        reason: 'Range resistance with weak momentum',
        aiScore: 8.8,
        status: 'Completed'
      },
      {
        id: 5,
        pair: 'XAU/USD',
        type: 'Momentum',
        direction: 'BUY',
        confidence: 89,
        entry: 2045.50,
        stopLoss: 2035.00,
        takeProfit: 2065.00,
        riskReward: 1.9,
        timeframe: '1H',
        reason: 'Gold breakout above key resistance',
        aiScore: 9.1,
        status: 'Active'
      }
    ];
    setSetups(mockSetups);
  }, []);

  const handleSetupSelect = (setup) => {
    setSelectedSetup(setup);
  };

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
              <h1 className="text-2xl font-bold">AI Trading Setups</h1>
              <p className="text-muted-foreground">Top 10 AI-powered trade opportunities</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live AI Analysis
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content - Left Side */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Active Setups</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Confidence: 80%+</span>
                <span>R:R Ratio: 1.5+</span>
                <span>Updated: 2m ago</span>
              </div>
            </div>
            
            <div className="grid gap-4">
              {setups.map((setup) => (
                <SetupCard
                  key={setup.id}
                  setup={setup}
                  isSelected={selectedSetup?.id === setup.id}
                  onSelect={() => handleSetupSelect(setup)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* AI Execution Panel - Right Side */}
        <div className="w-80 border-l border-border bg-card">
          <ExecutionPanel selectedSetup={selectedSetup} />
        </div>
      </div>

      {/* Bottom Explanation */}
      <div className="border-t border-border bg-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Niyə açılır?
          </h3>
          <p className="text-sm text-muted-foreground">
            Bu səhifə AI tərəfindən təklif edilən ən güclü trade setup-larını göstərir. 
            Hər biri R:R ratio və confidence score ilə qiymətləndirilir. Setup-lara kliklədikdə 
            Entry/SL/TP dəyərləri sağ panelə avtomatik keçir və birbaşa order verə bilərsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingSetupsPage;
