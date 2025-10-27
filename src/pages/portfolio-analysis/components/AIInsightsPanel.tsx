import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const insights = [
  {
    type: 'risk',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    title: 'High Bitcoin Concentration',
    message: 'BTC represents 35.4% of your portfolio, exceeding the recommended 25% limit. This increases volatility risk.',
    action: 'Suggest Rebalancing',
    severity: 'Medium Risk',
  },
  {
    type: 'performance',
    icon: TrendingUp,
    color: 'text-green-400',
    title: 'Outperforming S&P 500',
    message: 'Your portfolio has generated 4.8% alpha vs benchmark over the last 30 days. Sharpe ratio improved to 1.84.',
    action: 'View Analysis',
  },
  {
    type: 'opportunity',
    icon: RefreshCw,
    color: 'text-blue-400',
    title: 'Optimal Rebalancing Window',
    message: 'Market conditions favorable for rebalancing. Low volatility and tight spreads detected.',
    action: 'Calculate Trades',
  },
];

const InsightCard = ({ insight }: { insight: typeof insights[0] }) => {
  const Icon = insight.icon;
  return (
    <div className="bg-gray-900/50 p-3 rounded-lg border border-transparent hover:border-blue-500/50 transition-all">
      <div className="flex items-start gap-3">
        <Icon className={`${insight.color} w-5 h-5 mt-1 flex-shrink-0`} />
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-text-primary">{insight.title}</h4>
            {insight.severity && (
              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-semibold">
                {insight.severity}
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1 mb-2">{insight.message}</p>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-400 hover:text-blue-300 text-xs font-bold">
            {insight.action}
          </Button>
        </div>
      </div>
    </div>
  );
};

const AIInsightsPanel: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-text-primary">ORACLE AI Insights</h3>
        </div>
        <p className="text-xs text-text-secondary">Updated 5 min ago</p>
      </div>

      {/* Insights List */}
      <div className="flex flex-col gap-3">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm text-text-secondary hover:text-text-primary w-full"
          onClick={() => navigate('/portfolio-analysis/ai-insights')}
        >
          View All Insights (7)
        </Button>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
