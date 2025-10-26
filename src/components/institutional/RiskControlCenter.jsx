import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingDown,
  TrendingUp,
  Activity,
  Zap,
  Square,
  Settings,
  Bell,
  BarChart3,
  DollarSign,
  Target,
  Clock,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const RiskControlCenter = () => {
  const [riskMetrics, setRiskMetrics] = useState({
    portfolioValue: 250000,
    dailyPnL: 2847.32,
    maxDailyLoss: -5000,
    currentDrawdown: -2.1,
    maxDrawdown: -10.0,
    riskUtilization: 65.2,
    leverage: 2.3,
    maxLeverage: 5.0,
    openPositions: 8,
    maxPositions: 15,
    var95: -3250,
    sharpeRatio: 1.85
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Risk utilization approaching 70% threshold',
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Daily P&L target achieved (+$2,500)',
      timestamp: new Date(Date.now() - 600000),
      severity: 'low'
    }
  ]);

  const [emergencyStop, setEmergencyStop] = useState(false);
  const [autoRiskManagement, setAutoRiskManagement] = useState(true);

  const getRiskLevel = (utilization) => {
    if (utilization >= 80) return { level: 'high', color: 'text-red-400', bg: 'bg-red-600' };
    if (utilization >= 60) return { level: 'medium', color: 'text-yellow-400', bg: 'bg-yellow-600' };
    return { level: 'low', color: 'text-green-400', bg: 'bg-green-600' };
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const riskLevel = getRiskLevel(riskMetrics.riskUtilization);

  const handleEmergencyStop = () => {
    setEmergencyStop(true);
    // Simulate emergency stop
    setTimeout(() => {
      setRiskMetrics(prev => ({ ...prev, openPositions: 0, riskUtilization: 0 }));
      setAlerts(prev => [{
        id: Date.now(),
        type: 'error',
        message: 'Emergency stop activated - All positions closed',
        timestamp: new Date(),
        severity: 'high'
      }, ...prev]);
    }, 1000);
  };

  useEffect(() => {
    // Simulate real-time risk updates
    const interval = setInterval(() => {
      setRiskMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 50,
        riskUtilization: Math.max(0, Math.min(100, prev.riskUtilization + (Math.random() - 0.5) * 5)),
        currentDrawdown: prev.currentDrawdown + (Math.random() - 0.5) * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f172a] rounded-lg border border-[#1e293b] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Risk Control Center</h2>
            <p className="text-sm text-gray-400">Real-time risk monitoring and controls</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${riskLevel.bg}/20 border border-${riskLevel.bg.split('-')[1]}-600/30`}>
            <div className={`w-2 h-2 rounded-full ${riskLevel.bg} animate-pulse`}></div>
            <span className={`text-xs font-medium ${riskLevel.color}`}>
              {riskLevel.level.toUpperCase()} RISK
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1e293b] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">Portfolio Value</span>
          </div>
          <div className="text-xl font-bold text-white">
            ${riskMetrics.portfolioValue.toLocaleString()}
          </div>
          <div className={`text-xs ${riskMetrics.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {riskMetrics.dailyPnL >= 0 ? '+' : ''}${riskMetrics.dailyPnL.toFixed(2)} today
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-400">Max Drawdown</span>
          </div>
          <div className="text-xl font-bold text-yellow-400">
            {riskMetrics.currentDrawdown.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">
            Limit: {riskMetrics.maxDrawdown}%
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Gauge className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">Leverage</span>
          </div>
          <div className="text-xl font-bold text-blue-400">
            {riskMetrics.leverage.toFixed(1)}x
          </div>
          <div className="text-xs text-gray-400">
            Max: {riskMetrics.maxLeverage}x
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">VaR (95%)</span>
          </div>
          <div className="text-xl font-bold text-purple-400">
            ${Math.abs(riskMetrics.var95).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">
            1-day horizon
          </div>
        </div>
      </div>

      {/* Risk Utilization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Risk Utilization</h3>
          <span className={`text-sm font-bold ${riskLevel.color}`}>
            {riskMetrics.riskUtilization.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div 
            className={`h-3 rounded-full ${riskLevel.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${riskMetrics.riskUtilization}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Position Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1e293b] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Position Limits</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Open Positions</span>
              <span className="text-sm font-medium text-white">
                {riskMetrics.openPositions} / {riskMetrics.maxPositions}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(riskMetrics.openPositions / riskMetrics.maxPositions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Daily Limits</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">P&L vs Max Loss</span>
              <span className={`text-sm font-medium ${riskMetrics.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${riskMetrics.dailyPnL.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${riskMetrics.dailyPnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ 
                  width: `${Math.min(100, Math.abs(riskMetrics.dailyPnL / riskMetrics.maxDailyLoss) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Auto Risk Management</span>
            <button
              onClick={() => setAutoRiskManagement(!autoRiskManagement)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRiskManagement ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRiskManagement ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reduce Risk
          </Button>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleEmergencyStop}
            disabled={emergencyStop}
            variant="destructive" 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Square className="w-4 h-4 mr-2" />
            {emergencyStop ? 'STOPPED' : 'Emergency Stop'}
          </Button>
          
          <Button variant="outline" size="sm" className="w-full">
            <Bell className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Recent Alerts</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-[#1e293b] rounded-lg p-3 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <span className="text-sm text-white">{alert.message}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskControlCenter;
