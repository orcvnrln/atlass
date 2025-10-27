import React, { useState } from 'react';
import { ArrowLeft, Bot, AlertTriangle, TrendingUp, RefreshCw, Target, Shield, Zap, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const AIInsightsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allInsights = [
    {
      id: 1,
      type: 'risk',
      category: 'Risk Management',
      icon: AlertTriangle,
      color: colors.accent.warning,
      title: 'High Bitcoin Concentration',
      message: 'BTC represents 35.4% of your portfolio, exceeding the recommended 25% limit. This increases volatility risk and exposes you to crypto market downturns.',
      severity: 'Medium Risk',
      confidence: 92,
      impact: 'High',
      timeframe: '2 hours ago',
      actionable: true,
      actions: ['Suggest Rebalancing', 'Set Alerts', 'View Analysis']
    },
    {
      id: 2,
      type: 'performance',
      category: 'Performance',
      icon: TrendingUp,
      color: colors.accent.success,
      title: 'Outperforming S&P 500',
      message: 'Your portfolio has generated 4.8% alpha vs benchmark over the last 30 days. Sharpe ratio improved to 1.84, indicating excellent risk-adjusted returns.',
      confidence: 88,
      impact: 'Positive',
      timeframe: '1 hour ago',
      actionable: true,
      actions: ['View Analysis', 'Share Report', 'Optimize Further']
    },
    {
      id: 3,
      type: 'opportunity',
      category: 'Trading Opportunities',
      icon: RefreshCw,
      color: colors.accent.primary,
      title: 'Optimal Rebalancing Window',
      message: 'Market conditions favorable for rebalancing. Low volatility (VIX: 18.2) and tight spreads detected across major assets. Cost-effective rebalancing opportunity.',
      confidence: 85,
      impact: 'Medium',
      timeframe: '30 minutes ago',
      actionable: true,
      actions: ['Calculate Trades', 'Schedule Rebalancing', 'View Costs']
    },
    {
      id: 4,
      type: 'risk',
      category: 'Risk Management',
      icon: Shield,
      color: colors.accent.warning,
      title: 'Correlation Risk Detected',
      message: 'High correlation (0.87) detected between TSLA and QQQ positions. This reduces diversification benefits and increases tech sector exposure.',
      severity: 'Low Risk',
      confidence: 79,
      impact: 'Medium',
      timeframe: '3 hours ago',
      actionable: true,
      actions: ['Diversify Holdings', 'Monitor Correlation', 'Adjust Weights']
    },
    {
      id: 5,
      type: 'market',
      category: 'Market Analysis',
      icon: Target,
      color: colors.accent.purple,
      title: 'Sector Rotation Signal',
      message: 'AI models detect early signs of rotation from growth to value stocks. Consider increasing exposure to financial and energy sectors.',
      confidence: 73,
      impact: 'Medium',
      timeframe: '4 hours ago',
      actionable: true,
      actions: ['Explore Sectors', 'Adjust Allocation', 'Research Trends']
    },
    {
      id: 6,
      type: 'opportunity',
      category: 'Trading Opportunities',
      icon: Zap,
      color: colors.accent.primary,
      title: 'Options Strategy Opportunity',
      message: 'Elevated implied volatility in AAPL options presents covered call opportunity. Potential 2.3% additional income over 30 days.',
      confidence: 81,
      impact: 'Medium',
      timeframe: '6 hours ago',
      actionable: true,
      actions: ['View Strategy', 'Calculate Returns', 'Execute Trade']
    },
    {
      id: 7,
      type: 'performance',
      category: 'Performance',
      icon: Brain,
      color: colors.accent.success,
      title: 'AI Model Accuracy Update',
      message: 'Portfolio optimization model achieved 94% accuracy in last 30 predictions. Model confidence increased, suggesting reliable future recommendations.',
      confidence: 96,
      impact: 'High',
      timeframe: '8 hours ago',
      actionable: false,
      actions: []
    }
  ];

  const categories = ['all', 'Risk Management', 'Performance', 'Trading Opportunities', 'Market Analysis'];
  
  const filteredInsights = selectedCategory === 'all' 
    ? allInsights 
    : allInsights.filter(insight => insight.category === selectedCategory);

  const InsightCard = ({ insight }: { insight: typeof allInsights[0] }) => {
    const Icon = insight.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${insight.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: insight.color }} />
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
                  {insight.title}
                </h3>
                <span 
                  className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: `${insight.color}20`,
                    color: insight.color 
                  }}
                >
                  {insight.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: colors.text.tertiary }}>
                  {insight.timeframe}
                </p>
                {insight.severity && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block"
                    style={{ 
                      backgroundColor: insight.severity.includes('High') ? `${colors.accent.danger}20` : `${colors.accent.warning}20`,
                      color: insight.severity.includes('High') ? colors.accent.danger : colors.accent.warning
                    }}
                  >
                    {insight.severity}
                  </span>
                )}
              </div>
            </div>
            
            <p className="mb-4" style={{ color: colors.text.secondary }}>
              {insight.message}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs" style={{ color: colors.text.tertiary }}>Confidence</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-16 h-2 rounded-full"
                      style={{ backgroundColor: `${colors.border.secondary}` }}
                    >
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${insight.confidence}%`,
                          backgroundColor: insight.confidence > 85 ? colors.accent.success : insight.confidence > 70 ? colors.accent.warning : colors.accent.danger
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: colors.text.primary }}>
                      {insight.confidence}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs" style={{ color: colors.text.tertiary }}>Impact</p>
                  <span 
                    className="text-xs font-semibold"
                    style={{ 
                      color: insight.impact === 'High' ? colors.accent.danger : 
                             insight.impact === 'Medium' ? colors.accent.warning : 
                             insight.impact === 'Positive' ? colors.accent.success : colors.accent.primary
                    }}
                  >
                    {insight.impact}
                  </span>
                </div>
              </div>
              
              {insight.actionable && (
                <div className="flex items-center gap-2">
                  {insight.actions.slice(0, 2).map((action, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                      style={{ color: colors.accent.primary }}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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
            <Bot className="w-8 h-8" style={{ color: colors.accent.primary }} />
            <div>
              <h1 className="text-3xl font-bold">ORACLE AI Insights</h1>
              <p style={{ color: colors.text.secondary }}>AI-powered portfolio intelligence and recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category === 'all' ? 'All Insights' : category} 
            {category === 'all' && ` (${allInsights.length})`}
          </Button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="space-y-6">
        {filteredInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-2xl font-bold" style={{ color: colors.accent.success }}>94%</p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Model Accuracy</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-2xl font-bold" style={{ color: colors.accent.primary }}>127</p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Insights Generated</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-2xl font-bold" style={{ color: colors.accent.warning }}>3</p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Active Risks</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-2xl font-bold" style={{ color: colors.accent.purple }}>$2.4K</p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Potential Savings</p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsDetailPage;
