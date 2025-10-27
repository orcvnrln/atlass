import React from 'react';
import { RefreshCw, BarChart2, ShieldHalf, Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const actions = [
  { text: 'Rebalance Portfolio', icon: RefreshCw, variant: 'primary' as const },
  { text: 'Generate Report', icon: BarChart2, variant: 'secondary' as const },
  { text: 'Set Stop Losses', icon: ShieldHalf, variant: 'secondary' as const },
  { text: 'Ask AI Assistant', icon: Bot, variant: 'secondary' as const },
  { text: 'Risk Settings', icon: Settings, variant: 'secondary' as const },
];

const QuickActions: React.FC = () => {
  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-4">
      <h3 className="text-base font-bold text-text-primary mb-3">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant}
              className="w-full justify-start text-left">
              <Icon className="w-4 h-4 mr-3" />
              <span>{action.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
