import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingDown, TrendingUp, DollarSign, Target, Activity } from 'lucide-react';

interface Position {
  asset: string;
  size: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPercent: number;
  var1Day: number;
}

interface StressTestScenario {
  name: string;
  description: string;
  btcChange: number;
  ethChange: number;
  eurChange: number;
  us10yChange: number;
  spyChange: number;
  volatilityMultiplier: number;
}

interface StressTestResult {
  scenario: StressTestScenario;
  portfolioImpact: number;
  portfolioImpactPercent: number;
  positionImpacts: Array<{
    asset: string;
    priceChange: number;
    valueChange: number;
    newValue: number;
  }>;
  varBreached: boolean;
  correlationBreakdown: boolean;
  liquidityImpact: 'Low' | 'Medium' | 'High';
  timeToLiquidate: string;
}

const RiskDashboardTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'positions' | 'stress-test'>('overview');
  const [selectedScenario, setSelectedScenario] = useState<StressTestScenario | null>(null);
  const [stressResults, setStressResults] = useState<StressTestResult | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  // Mock portfolio data
  const portfolio = {
    totalValue: 50000,
    openPositions: 3,
    totalRiskExposure: 2.3,
    totalUnrealizedPnl: 1420,
    var1Day: 1240,
    expectedShortfall: 1850,
    positions: [
      {
        asset: 'BTC',
        size: 0.5,
        entry: 41200,
        current: 42150,
        pnl: 475,
        pnlPercent: 2.31,
        var1Day: 412,
      },
      {
        asset: 'ETH',
        size: 5.0,
        entry: 2200,
        current: 2340,
        pnl: 700,
        pnlPercent: 6.36,
        var1Day: 187,
      },
      {
        asset: 'EUR-USD',
        size: 100000,
        entry: 1.0950,
        current: 1.0945,
        pnl: -50,
        pnlPercent: -0.46,
        var1Day: 320,
      },
    ] as Position[],
    correlationRisk: [
      {
        asset1: 'BTC',
        asset2: 'ETH',
        correlation: 0.82,
        riskLevel: 'High' as const,
        recommendation: 'Consider hedging or rebalancing',
      },
    ],
    alerts: [
      {
        type: 'Correlation' as const,
        severity: 'Medium' as const,
        message: 'High correlation detected: BTC-ETH (+0.82)',
        recommendation: 'Consider hedging or rebalancing',
      },
      {
        type: 'VaR' as const,
        severity: 'Low' as const,
        message: 'VaR approaching 2-Day limit (2.48% threshold)',
        recommendation: 'Reduce position size or tighten stops',
      },
    ],
  };

  const stressScenarios: StressTestScenario[] = [
    {
      name: 'Flash Crash',
      description: 'Sudden 10% market drop (2008-style event)',
      btcChange: -10,
      ethChange: -12,
      eurChange: -3,
      us10yChange: 5,
      spyChange: -10,
      volatilityMultiplier: 3.0,
    },
    {
      name: 'Black Swan (Crypto)',
      description: 'Major regulatory news hits crypto market',
      btcChange: -25,
      ethChange: -28,
      eurChange: 2,
      us10yChange: 3,
      spyChange: -5,
      volatilityMultiplier: 4.0,
    },
    {
      name: 'Rate Hike Shock',
      description: 'Unexpected Fed rate hike (+100 bps)',
      btcChange: -8,
      ethChange: -7,
      eurChange: -4,
      us10yChange: 15,
      spyChange: -6,
      volatilityMultiplier: 2.5,
    },
    {
      name: 'Correlation Breakdown',
      description: 'All assets move independently (liquidity crisis)',
      btcChange: -15,
      ethChange: 8,
      eurChange: -12,
      us10yChange: -5,
      spyChange: -20,
      volatilityMultiplier: 2.0,
    },
    {
      name: 'Stagflation Scenario',
      description: 'High inflation + slow growth = everything down',
      btcChange: -18,
      ethChange: -16,
      eurChange: -6,
      us10yChange: 8,
      spyChange: -12,
      volatilityMultiplier: 3.5,
    },
  ];

  const calculateStressTest = (scenario: StressTestScenario) => {
    const positionImpacts = portfolio.positions.map(pos => {
      let priceChange = 0;
      if (pos.asset === 'BTC') priceChange = scenario.btcChange;
      else if (pos.asset === 'ETH') priceChange = scenario.ethChange;
      else if (pos.asset === 'EUR-USD') priceChange = scenario.eurChange;
      else priceChange = scenario.us10yChange;

      const valueChange = (pos.current * pos.size * priceChange) / 100;
      const newValue = (pos.current * pos.size) + valueChange;

      return {
        asset: pos.asset,
        priceChange,
        valueChange,
        newValue,
      };
    });

    const totalImpact = positionImpacts.reduce((sum, pos) => sum + pos.valueChange, 0);
    const impactPercent = (totalImpact / portfolio.totalValue) * 100;

    const result: StressTestResult = {
      scenario,
      portfolioImpact: totalImpact,
      portfolioImpactPercent: impactPercent,
      positionImpacts,
      varBreached: Math.abs(impactPercent) > 2.48,
      correlationBreakdown: scenario.name.includes('Correlation'),
      liquidityImpact: impactPercent < -15 ? 'High' : impactPercent < -8 ? 'Medium' : 'Low',
      timeToLiquidate: impactPercent < -15 ? '4-6 hours' : '1-2 hours',
    };

    setStressResults(result);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-blue-400" />
            <span className="text-sm text-slate-400">Portfolio Value</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            ${portfolio.totalValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-green-400" />
            <span className="text-sm text-slate-400">Open Positions</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{portfolio.openPositions}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-purple-400" />
            <span className="text-sm text-slate-400">Risk Exposure</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{portfolio.totalRiskExposure}%</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm text-slate-400">Total P&L</span>
          </div>
          <div className="text-2xl font-bold text-emerald-500">
            +${portfolio.totalUnrealizedPnl.toLocaleString()}
          </div>
          <div className="text-sm text-emerald-400">
            +{((portfolio.totalUnrealizedPnl / portfolio.totalValue) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* VaR Analysis */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Shield size={20} className="text-red-400" />
          VaR Analysis (95% confidence, 1-day horizon)
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-slate-400 mb-1">1-Day VaR</div>
            <div className="text-2xl font-bold text-red-500">-${portfolio.var1Day.toLocaleString()}</div>
            <div className="text-sm text-red-400">
              {(portfolio.var1Day / portfolio.totalValue * 100).toFixed(2)}% max potential loss
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Expected Shortfall</div>
            <div className="text-2xl font-bold text-red-500">-${portfolio.expectedShortfall.toLocaleString()}</div>
            <div className="text-sm text-red-400">If VaR breached</div>
          </div>
        </div>
      </div>

      {/* Correlation Risk */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-yellow-400" />
          Correlation Risk
        </h4>
        <div className="space-y-3">
          {portfolio.correlationRisk.map((risk, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <div className="font-semibold text-slate-100">
                  {risk.asset1} & {risk.asset2}
                </div>
                <div className="text-sm text-slate-400">Correlation: {risk.correlation}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${
                  risk.riskLevel === 'High' ? 'text-red-400' :
                  risk.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {risk.riskLevel} Risk
                </div>
                <div className="text-xs text-slate-400">{risk.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-400" />
          Risk Alerts
        </h4>
        <div className="space-y-3">
          {portfolio.alerts.map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              alert.severity === 'High' ? 'bg-red-500/10 border-red-500/20' :
              alert.severity === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
              'bg-blue-500/10 border-blue-500/20'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-200">{alert.type}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                  alert.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-1">{alert.message}</p>
              <p className="text-xs text-slate-400">→ {alert.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPositions = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Open Positions</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700">
            <tr>
              <th className="text-left py-2">Asset</th>
              <th className="text-right py-2">Size</th>
              <th className="text-right py-2">Entry</th>
              <th className="text-right py-2">Current</th>
              <th className="text-right py-2">P&L</th>
              <th className="text-right py-2">VaR 1Day</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.positions.map((position, index) => (
              <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="py-3 font-semibold text-slate-100">{position.asset}</td>
                <td className="text-right font-mono">{position.size}</td>
                <td className="text-right font-mono">${position.entry.toLocaleString()}</td>
                <td className="text-right font-mono">${position.current.toLocaleString()}</td>
                <td className={`text-right font-mono font-bold ${
                  position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                </td>
                <td className="text-right font-mono text-red-400">-${position.var1Day.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStressTest = () => (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div>
        <h4 className="text-lg font-semibold text-slate-100 mb-4">Stress Test Scenarios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stressScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedScenario(scenario);
                calculateStressTest(scenario);
              }}
              className={`p-4 rounded-lg text-left border-2 transition ${
                selectedScenario?.name === scenario.name
                  ? 'border-emerald-500 bg-slate-700'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <p className="font-bold text-sm text-slate-100">{scenario.name}</p>
              <p className="text-xs text-slate-400 mt-1">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stress Test Results */}
      {stressResults && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="border-2 border-slate-700 rounded-lg p-6">
            <h4 className="font-bold text-lg text-slate-100 mb-4">
              {stressResults.scenario.name} - Results
            </h4>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Portfolio Impact</p>
                <p className={`text-3xl font-bold ${
                  stressResults.portfolioImpact < 0 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  ${Math.abs(stressResults.portfolioImpact).toFixed(0)}
                </p>
                <p className={`text-sm ${
                  stressResults.portfolioImpactPercent < 0 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {stressResults.portfolioImpactPercent > 0 ? '+' : ''}{stressResults.portfolioImpactPercent.toFixed(2)}%
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-1">VaR Status</p>
                <p className={`text-2xl font-bold ${
                  stressResults.varBreached ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {stressResults.varBreached ? '⚠ BREACHED' : '✓ Safe'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Liquidity Impact</p>
                <p className={`font-bold text-lg ${
                  stressResults.liquidityImpact === 'High' ? 'text-red-500' :
                  stressResults.liquidityImpact === 'Medium' ? 'text-yellow-500' : 'text-emerald-500'
                }`}>
                  {stressResults.liquidityImpact}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Time to Exit</p>
                <p className="font-bold text-lg text-slate-100">{stressResults.timeToLiquidate}</p>
              </div>
            </div>
          </div>

          {/* Position Impact Analysis */}
          <div>
            <h5 className="font-bold text-slate-100 mb-3">Position Impact Analysis</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Asset</th>
                    <th className="text-right py-2">Price Δ</th>
                    <th className="text-right py-2">Value Δ</th>
                    <th className="text-right py-2">New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {stressResults.positionImpacts.map((pos, index) => (
                    <tr key={index} className="border-b border-slate-700">
                      <td className="py-2 font-semibold text-slate-100">{pos.asset}</td>
                      <td className={`text-right font-mono ${
                        pos.priceChange < 0 ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                        {pos.priceChange > 0 ? '+' : ''}{pos.priceChange}%
                      </td>
                      <td className={`text-right font-mono ${
                        pos.valueChange < 0 ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                        ${pos.valueChange.toFixed(0)}
                      </td>
                      <td className="text-right font-mono">${pos.newValue.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Warnings */}
          <div className="space-y-3">
            {stressResults.varBreached && (
              <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
                <p className="text-sm text-red-400">
                  🚨 <strong>VaR Breached:</strong> Portfolio loss exceeds acceptable risk limits. Consider reducing position sizes or tightening stops.
                </p>
              </div>
            )}
            {stressResults.correlationBreakdown && (
              <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
                <p className="text-sm text-yellow-400">
                  ⚠ <strong>Correlation Breakdown:</strong> Assets no longer moving together. Diversification benefits lost. Hedging critical.
                </p>
              </div>
            )}
            {stressResults.liquidityImpact === 'High' && (
              <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
                <p className="text-sm text-red-400">
                  🚨 <strong>Liquidity Crisis:</strong> May not be able to exit all positions in acceptable timeframe. Consider reducing leverage.
                </p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg">
            <h5 className="font-bold text-slate-100 mb-2">Mitigation Recommendations</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Reduce BTC/ETH correlation exposure (currently +0.82)</li>
              <li>• Add inverse hedge: Consider small SPY short position</li>
              <li>• Tighten stop losses to 1.0% portfolio risk max</li>
              <li>• Increase cash buffer to 15% (from 5%) for crisis liquidity</li>
              <li>• Monitor daily volatility regime changes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 rounded-lg p-1 mb-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'positions', label: 'Positions' },
          { id: 'stress-test', label: 'Stress Test' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'positions' && renderPositions()}
      {selectedTab === 'stress-test' && renderStressTest()}
    </div>
  );
};

export default RiskDashboardTab;
