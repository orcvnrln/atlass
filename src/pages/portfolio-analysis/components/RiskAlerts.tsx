import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const alerts = [
  {
    severity: 'critical',
    icon: ShieldAlert,
    color: 'text-red-500',
    title: 'VaR Limit Breached',
    message: 'Daily VaR ($3,450) exceeds your $3,000 limit.',
    time: '2 hours ago',
    action: 'Review Risk Settings',
  },
  {
    severity: 'warning',
    icon: ShieldAlert,
    color: 'text-yellow-500',
    title: 'Margin Usage High',
    message: '78% of available margin used. Approaching limit.',
    time: '5 hours ago',
    action: 'Close Positions',
  },
  {
    severity: 'info',
    icon: Info,
    color: 'text-blue-400',
    title: 'Dividend Received',
    message: 'AAPL dividend $45.50 credited to account.',
    time: '1 day ago',
    action: null,
  },
];

const AlertItem = ({ alert }: { alert: typeof alerts[0] }) => {
  const Icon = alert.icon;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-b-0">
      <Icon className={`${alert.color} w-5 h-5 mt-1 flex-shrink-0`} />
      <div className="flex-grow">
        <p className={`text-sm font-bold ${alert.color}`}>{alert.title}</p>
        <p className="text-xs text-text-secondary mt-1">{alert.message}</p>
        {alert.action && (
          <Button variant="ghost" size="sm" className="h-auto p-0 mt-1 text-blue-400 hover:text-blue-300 text-xs font-semibold">
            {alert.action}
          </Button>
        )}
      </div>
      <p className="text-xs text-text-secondary flex-shrink-0 ml-2">{alert.time}</p>
    </div>
  );
};

const RiskAlerts: React.FC = () => {
  const navigate = useNavigate();
  const hasCritical = alerts.some(a => a.severity === 'critical');

  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-bold text-text-primary">Active Risk Alerts</h3>
        {hasCritical && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
      </div>

      {/* Alerts List */}
      <div className="flex flex-col max-h-48 overflow-y-auto pr-2">
        {alerts.map((alert, index) => (
          <AlertItem key={index} alert={alert} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
          Configure Alerts
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-text-secondary hover:text-text-primary"
          onClick={() => navigate('/portfolio-analysis/risk-alerts')}
        >
          View All (12)
        </Button>
      </div>
    </div>
  );
};

export default RiskAlerts;
