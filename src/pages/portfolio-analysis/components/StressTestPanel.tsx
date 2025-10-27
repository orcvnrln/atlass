import React, { useState } from 'react';
import { stressTestScenarios, runStressTest } from '../utils/calculations';
import { formatPercentage, formatCurrency } from '../utils/formatters';
import { keyMetrics } from '../utils/mockData';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, TrendingDown, DollarSign, Zap } from 'lucide-react';

const StressTestPanel: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof stressTestScenarios | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});

  const runAllTests = () => {
    const testResults: Record<string, number> = {};
    Object.keys(stressTestScenarios).forEach(scenario => {
      testResults[scenario] = runStressTest(scenario as keyof typeof stressTestScenarios);
    });
    setResults(testResults);
  };

  const scenarioLabels = {
    marketCrash: { name: 'Market Crash (-20%)', icon: TrendingDown, color: 'text-red-500' },
    cryptoWinter: { name: 'Crypto Winter (-50%)', icon: AlertTriangle, color: 'text-orange-500' },
    dollarSurge: { name: 'Dollar Surge (+10%)', icon: DollarSign, color: 'text-blue-500' },
    inflationShock: { name: 'Inflation Shock', icon: Zap, color: 'text-yellow-500' },
  };

  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-text-primary">Stress Test Scenarios</h3>
        <Button variant="primary" size="sm" onClick={runAllTests}>
          Run All Scenarios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.entries(scenarioLabels) as Array<[keyof typeof scenarioLabels, typeof scenarioLabels[keyof typeof scenarioLabels]]>).map(([key, config]) => {
          const Icon = config.icon;
          const impact = results[key];
          const projectedValue = keyMetrics.totalValue * (1 + (impact || 0));
          const projectedLoss = keyMetrics.totalValue - projectedValue;

          return (
            <div 
              key={key}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedScenario === key 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedScenario(key)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <span className="font-semibold text-text-primary">{config.name}</span>
              </div>
              
              {impact !== undefined && (
                <div className="space-y-1 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Portfolio Impact:</span>
                    <span className={impact < 0 ? 'text-red-400' : 'text-green-400'}>
                      {formatPercentage(impact * 100)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Projected Value:</span>
                    <span className="text-text-primary">{formatCurrency(projectedValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Potential Loss:</span>
                    <span className="text-red-400">{formatCurrency(Math.abs(projectedLoss))}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedScenario && results[selectedScenario] !== undefined && (
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="font-bold text-text-primary mb-2">
            Detailed Analysis: {scenarioLabels[selectedScenario].name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <p className="text-text-secondary">Time to Recovery:</p>
              <p className="text-text-primary">~45-90 days</p>
            </div>
            <div>
              <p className="text-text-secondary">Confidence Level:</p>
              <p className="text-text-primary">85%</p>
            </div>
            <div>
              <p className="text-text-secondary">Risk Contribution:</p>
              <p className="text-yellow-400">Crypto: 65%, Stocks: 25%</p>
            </div>
            <div>
              <p className="text-text-secondary">Hedging Suggestion:</p>
              <p className="text-blue-400">Increase bonds by 5%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressTestPanel;
