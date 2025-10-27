import React, { useState } from 'react';
import { ArrowLeft, Target, RefreshCw, TrendingUp, PieChart, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { assetAllocationData, keyMetrics } from './utils/mockData';
import { formatCurrency, formatPercentage } from './utils/formatters';

const AssetAllocationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [targetAllocations, setTargetAllocations] = useState(
    assetAllocationData.reduce((acc, asset) => ({
      ...acc,
      [asset.name]: asset.target
    }), {} as Record<string, number>)
  );
  
  const [rebalanceMode, setRebalanceMode] = useState(false);

  const calculateRebalancing = () => {
    return assetAllocationData.map(asset => {
      const targetValue = (keyMetrics.totalValue * targetAllocations[asset.name]) / 100;
      const currentValue = (keyMetrics.totalValue * asset.current) / 100;
      const difference = targetValue - currentValue;
      
      return {
        ...asset,
        targetValue,
        currentValue,
        difference,
        action: difference > 0 ? 'BUY' : 'SELL',
        actionAmount: Math.abs(difference)
      };
    });
  };

  const rebalanceData = calculateRebalancing();
  const totalDrift = rebalanceData.reduce((sum, asset) => sum + Math.abs(asset.difference), 0);

  return (
    <div className="min-h-screen bg-[#0f1419] text-[#f7fafc] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/portfolio-analysis')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Asset Allocation Management</h1>
            <p className="text-[#a0aec0] mt-1">Interactive portfolio rebalancing and optimization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant={rebalanceMode ? "primary" : "secondary"}
            onClick={() => setRebalanceMode(!rebalanceMode)}
            className="flex items-center gap-2"
          >
            <Sliders size={16} />
            {rebalanceMode ? 'Exit Rebalance Mode' : 'Enter Rebalance Mode'}
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <RefreshCw size={16} />
            Execute Rebalancing
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <PieChart className="w-6 h-6 text-[#4299e1]" />
            <span className="text-sm text-[#a0aec0]">Total Portfolio</span>
          </div>
          <p className="text-2xl font-bold text-[#f7fafc]">{formatCurrency(keyMetrics.totalValue)}</p>
          <p className="text-sm text-[#48bb78] mt-1">+{formatPercentage(keyMetrics.dailyChangePercent)} today</p>
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-[#ed8936]" />
            <span className="text-sm text-[#a0aec0]">Total Drift</span>
          </div>
          <p className="text-2xl font-bold text-[#ed8936]">{formatCurrency(totalDrift)}</p>
          <p className="text-sm text-[#a0aec0] mt-1">{formatPercentage((totalDrift/keyMetrics.totalValue)*100)} of portfolio</p>
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#48bb78]" />
            <span className="text-sm text-[#a0aec0]">Rebalance Benefit</span>
          </div>
          <p className="text-2xl font-bold text-[#48bb78]">+0.8%</p>
          <p className="text-sm text-[#a0aec0] mt-1">Expected annual return</p>
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-6 h-6 text-[#9f7aea]" />
            <span className="text-sm text-[#a0aec0]">Last Rebalance</span>
          </div>
          <p className="text-2xl font-bold text-[#9f7aea]">45</p>
          <p className="text-sm text-[#a0aec0] mt-1">Days ago</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Visualization */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Current vs Target Allocation */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Current vs Target Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Current Allocation Pie */}
              <div className="relative">
                <h4 className="text-lg font-semibold mb-4 text-center">Current Allocation</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={assetAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="current"
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Target Allocation Pie */}
              <div className="relative">
                <h4 className="text-lg font-semibold mb-4 text-center">Target Allocation</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={assetAllocationData.map(asset => ({
                          ...asset,
                          target: targetAllocations[asset.name]
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="target"
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Rebalancing Actions */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Required Actions</h3>
            <div className="space-y-4">
              {rebalanceData.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between p-4 bg-[#242938] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <div>
                      <p className="font-semibold text-[#f7fafc]">{asset.name}</p>
                      <p className="text-sm text-[#a0aec0]">
                        Current: {asset.current.toFixed(1)}% → Target: {targetAllocations[asset.name].toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${asset.action === 'BUY' ? 'text-[#48bb78]' : 'text-[#f56565]'}`}>
                      {asset.action} {formatCurrency(asset.actionAmount)}
                    </p>
                    <p className="text-sm text-[#a0aec0]">
                      {formatPercentage(Math.abs(asset.current - targetAllocations[asset.name]))} drift
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="space-y-6">
          
          {/* Target Allocation Controls */}
          {rebalanceMode && (
            <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Adjust Target Allocation</h3>
              <div className="space-y-4">
                {assetAllocationData.map((asset) => (
                  <div key={asset.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#a0aec0]">{asset.name}</span>
                      <span className="text-sm font-semibold text-[#f7fafc]">
                        {targetAllocations[asset.name].toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={targetAllocations[asset.name]}
                      onChange={(e) => setTargetAllocations({
                        ...targetAllocations,
                        [asset.name]: Number(e.target.value)
                      })}
                      className="w-full h-2 bg-[#242938] rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${targetAllocations[asset.name]*2}%, #242938 ${targetAllocations[asset.name]*2}%, #242938 100%)`
                      }}
                    />
                  </div>
                ))}
                <div className="pt-4 border-t border-[#2d3748]">
                  <p className="text-sm text-[#a0aec0]">
                    Total: {Object.values(targetAllocations).reduce((sum, val) => sum + val, 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rebalancing Strategy */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Rebalancing Strategy</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#4299e1]/10 border border-[#4299e1]/20 rounded-lg">
                <p className="text-sm font-semibold text-[#4299e1]">Threshold-Based</p>
                <p className="text-xs text-[#a0aec0] mt-1">Rebalance when drift exceeds 5%</p>
              </div>
              <div className="p-3 bg-[#242938] border border-[#2d3748] rounded-lg cursor-pointer hover:border-[#4a5568]">
                <p className="text-sm font-semibold text-[#f7fafc]">Calendar-Based</p>
                <p className="text-xs text-[#a0aec0] mt-1">Rebalance monthly</p>
              </div>
              <div className="p-3 bg-[#242938] border border-[#2d3748] rounded-lg cursor-pointer hover:border-[#4a5568]">
                <p className="text-sm font-semibold text-[#f7fafc]">Volatility-Based</p>
                <p className="text-xs text-[#a0aec0] mt-1">Rebalance during high volatility</p>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Rebalancing Costs</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#a0aec0]">Trading Fees:</span>
                <span className="text-[#f7fafc]">$127.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0aec0]">Tax Impact:</span>
                <span className="text-[#f7fafc]">$890.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0aec0]">Slippage:</span>
                <span className="text-[#f7fafc]">$45.20</span>
              </div>
              <div className="border-t border-[#2d3748] pt-3 flex justify-between font-semibold">
                <span className="text-[#f7fafc]">Total Cost:</span>
                <span className="text-[#f56565]">$1,062.70</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a0aec0]">Cost as % of portfolio:</span>
                <span className="text-[#a0aec0]">0.83%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationDetailPage;
