import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, AlertTriangle, Info, CheckCircle, Settings, Bell, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const RiskAlertsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const allAlerts = [
    {
      id: 1,
      severity: 'critical',
      status: 'active',
      icon: ShieldAlert,
      title: 'VaR Limit Breached',
      message: 'Daily VaR ($3,450) exceeds your configured limit of $3,000. This indicates higher than acceptable portfolio risk.',
      time: '2 hours ago',
      category: 'Risk Management',
      affectedAssets: ['BTC', 'ETH', 'TSLA'],
      threshold: '$3,000',
      currentValue: '$3,450',
      action: 'Review Risk Settings',
      resolved: false
    },
    {
      id: 2,
      severity: 'warning',
      status: 'active',
      icon: AlertTriangle,
      title: 'Margin Usage High',
      message: '78% of available margin used. Approaching the 80% warning threshold. Consider reducing leverage or closing positions.',
      time: '5 hours ago',
      category: 'Leverage',
      affectedAssets: ['Portfolio Wide'],
      threshold: '80%',
      currentValue: '78%',
      action: 'Close Positions',
      resolved: false
    },
    {
      id: 3,
      severity: 'info',
      status: 'resolved',
      icon: Info,
      title: 'Dividend Received',
      message: 'AAPL dividend payment of $45.50 has been credited to your account. Ex-dividend date processing completed.',
      time: '1 day ago',
      category: 'Income',
      affectedAssets: ['AAPL'],
      threshold: 'N/A',
      currentValue: '$45.50',
      action: 'View Transaction',
      resolved: true
    },
    {
      id: 4,
      severity: 'warning',
      status: 'active',
      icon: AlertTriangle,
      title: 'Concentration Risk Alert',
      message: 'Single asset (BTC) represents 35.4% of portfolio, exceeding diversification guidelines of 25% maximum per asset.',
      time: '6 hours ago',
      category: 'Diversification',
      affectedAssets: ['BTC'],
      threshold: '25%',
      currentValue: '35.4%',
      action: 'Rebalance Portfolio',
      resolved: false
    },
    {
      id: 5,
      severity: 'critical',
      status: 'active',
      icon: ShieldAlert,
      title: 'Stop Loss Triggered',
      message: 'Stop loss order executed for TSLA position at $265.00. Position closed to limit further losses.',
      time: '8 hours ago',
      category: 'Trade Execution',
      affectedAssets: ['TSLA'],
      threshold: '$265.00',
      currentValue: '$264.85',
      action: 'Review Trade',
      resolved: false
    },
    {
      id: 6,
      severity: 'info',
      status: 'resolved',
      icon: CheckCircle,
      title: 'Rebalancing Completed',
      message: 'Automated portfolio rebalancing executed successfully. All target allocations achieved within 0.5% tolerance.',
      time: '12 hours ago',
      category: 'Portfolio Management',
      affectedAssets: ['Portfolio Wide'],
      threshold: '±0.5%',
      currentValue: '±0.2%',
      action: 'View Report',
      resolved: true
    },
    {
      id: 7,
      severity: 'warning',
      status: 'active',
      icon: AlertTriangle,
      title: 'Correlation Spike Detected',
      message: 'Correlation between AAPL and MSFT increased to 0.89, reducing diversification benefits in tech sector exposure.',
      time: '14 hours ago',
      category: 'Correlation Risk',
      affectedAssets: ['AAPL', 'MSFT'],
      threshold: '0.80',
      currentValue: '0.89',
      action: 'Diversify Holdings',
      resolved: false
    },
    {
      id: 8,
      severity: 'info',
      status: 'resolved',
      icon: Info,
      title: 'Market Hours Alert',
      message: 'US markets closed for trading. After-hours trading available with limited liquidity and wider spreads.',
      time: '16 hours ago',
      category: 'Market Status',
      affectedAssets: ['US Equities'],
      threshold: 'N/A',
      currentValue: 'Closed',
      action: 'View Schedule',
      resolved: true
    },
    {
      id: 9,
      severity: 'critical',
      status: 'resolved',
      icon: ShieldAlert,
      title: 'Unusual Volume Detected',
      message: 'Abnormal trading volume detected in BTC (500% above average). Potential market manipulation or news event.',
      time: '18 hours ago',
      category: 'Market Anomaly',
      affectedAssets: ['BTC'],
      threshold: '200%',
      currentValue: '500%',
      action: 'Investigate',
      resolved: true
    },
    {
      id: 10,
      severity: 'warning',
      status: 'active',
      icon: AlertTriangle,
      title: 'Volatility Spike Warning',
      message: 'Portfolio volatility increased to 24.5% (annualized), exceeding your risk tolerance of 20%. Consider defensive positioning.',
      time: '20 hours ago',
      category: 'Volatility',
      affectedAssets: ['Portfolio Wide'],
      threshold: '20%',
      currentValue: '24.5%',
      action: 'Reduce Risk',
      resolved: false
    },
    {
      id: 11,
      severity: 'info',
      status: 'resolved',
      icon: Info,
      title: 'Price Target Reached',
      message: 'GOOGL reached your price target of $155.00. Consider taking profits or adjusting target based on current analysis.',
      time: '1 day ago',
      category: 'Price Alerts',
      affectedAssets: ['GOOGL'],
      threshold: '$155.00',
      currentValue: '$156.80',
      action: 'Review Position',
      resolved: true
    },
    {
      id: 12,
      severity: 'warning',
      status: 'active',
      icon: AlertTriangle,
      title: 'Liquidity Concern',
      message: 'Low liquidity detected in after-hours trading for TSLA. Bid-ask spread widened to 0.8%, execution may be challenging.',
      time: '22 hours ago',
      category: 'Liquidity',
      affectedAssets: ['TSLA'],
      threshold: '0.5%',
      currentValue: '0.8%',
      action: 'Wait for Market Open',
      resolved: false
    }
  ];

  const severityLevels = ['all', 'critical', 'warning', 'info'];
  const statusOptions = ['all', 'active', 'resolved'];

  const filteredAlerts = allAlerts.filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const statusMatch = selectedStatus === 'all' || alert.status === selectedStatus;
    return severityMatch && statusMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return colors.accent.danger;
      case 'warning': return colors.accent.warning;
      case 'info': return colors.accent.primary;
      default: return colors.text.secondary;
    }
  };

  const AlertCard = ({ alert }: { alert: typeof allAlerts[0] }) => {
    const Icon = alert.icon;
    const severityColor = getSeverityColor(alert.severity);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: alert.resolved ? colors.border.primary : severityColor + '40',
          opacity: alert.resolved ? 0.7 : 1
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${severityColor}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: severityColor }} />
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
                  {alert.title}
                </h3>
                <span 
                  className="text-xs px-2 py-1 rounded-full font-semibold uppercase"
                  style={{ 
                    backgroundColor: `${severityColor}20`,
                    color: severityColor 
                  }}
                >
                  {alert.severity}
                </span>
                {alert.resolved && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ 
                      backgroundColor: `${colors.accent.success}20`,
                      color: colors.accent.success 
                    }}
                  >
                    RESOLVED
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: colors.text.tertiary }}>
                  {alert.time}
                </p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  {alert.category}
                </p>
              </div>
            </div>
            
            <p className="mb-4" style={{ color: colors.text.secondary }}>
              {alert.message}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: colors.text.tertiary }}>
                  Affected Assets
                </p>
                <div className="flex flex-wrap gap-1">
                  {alert.affectedAssets.map((asset, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded font-semibold"
                      style={{ 
                        backgroundColor: colors.background.tertiary,
                        color: colors.text.primary 
                      }}
                    >
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: colors.text.tertiary }}>
                  Threshold / Current
                </p>
                <p className="text-sm" style={{ color: colors.text.primary }}>
                  {alert.threshold} / <span style={{ color: severityColor }}>{alert.currentValue}</span>
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-sm"
                  style={{ color: colors.accent.primary }}
                >
                  {alert.action}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const activeAlerts = allAlerts.filter(alert => !alert.resolved);
  const criticalCount = activeAlerts.filter(alert => alert.severity === 'critical').length;
  const warningCount = activeAlerts.filter(alert => alert.severity === 'warning').length;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}>
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
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8" style={{ color: colors.accent.danger }} />
              <div>
                <h1 className="text-3xl font-bold">Risk Alerts Dashboard</h1>
                <p style={{ color: colors.text.secondary }}>Monitor and manage portfolio risk alerts</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="flex items-center gap-2">
            <Settings size={16} />
            Configure Alerts
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <Bell size={16} />
            Notification Settings
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.danger }}>{criticalCount}</p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Critical Alerts</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.warning }}>{warningCount}</p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Warning Alerts</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.success }}>
            {allAlerts.filter(alert => alert.resolved).length}
          </p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Resolved Today</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.primary }}>
            {Math.round((allAlerts.filter(alert => alert.resolved).length / allAlerts.length) * 100)}%
          </p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Resolution Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: colors.text.secondary }} />
          <span className="text-sm font-semibold" style={{ color: colors.text.secondary }}>Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: colors.text.tertiary }}>Severity:</span>
          {severityLevels.map(level => (
            <Button
              key={level}
              variant={selectedSeverity === level ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedSeverity(level)}
              className="capitalize"
            >
              {level === 'all' ? 'All' : level}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: colors.text.tertiary }}>Status:</span>
          {statusOptions.map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: colors.accent.success }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
            No Alerts Found
          </h3>
          <p style={{ color: colors.text.secondary }}>
            No alerts match your current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskAlertsDetailPage;
