import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Shield, 
  BarChart3,
  Activity,
  Briefcase
} from 'lucide-react';
import RealTimeKPI from './RealTimeKPI';
import AIInsightsPanel from './AIInsightsPanel';
import QuickActions from './QuickActions';
import PerformanceChart from './PerformanceChart';
import MarketOverview from './MarketOverview';
import realTimeDataService from '@/services/realTimeDataService';
import toast from 'react-hot-toast';

const EnhancedDashboard = () => {
  // Real-time data state
  const [portfolioData, setPortfolioData] = useState({
    value: '127,450.32',
    change: '+2,340.50',
    changePercent: '+1.87%',
    isPositive: true
  });

  const [pnlData, setPnlData] = useState({
    daily: '+1,245.67',
    changePercent: '+0.98%',
    isPositive: true
  });

  const [positionsData, setPositionsData] = useState({
    count: 8,
    totalValue: '45,230.12',
    unrealizedPnL: '+1,234.56'
  });

  // Subscribe to real-time updates
  useEffect(() => {
    // Portfolio updates
    const portfolioSub = realTimeDataService.subscribe('portfolio', (data) => {
      setPortfolioData({
        value: data.value,
        change: data.change >= 0 ? `+${data.change}` : data.change,
        changePercent: data.changePercent >= 0 ? `+${data.changePercent}%` : `${data.changePercent}%`,
        isPositive: data.change >= 0
      });
    });

    // P&L updates
    const pnlSub = realTimeDataService.subscribe('pnl', (data) => {
      const isPositive = parseFloat(data.daily) >= 0;
      setPnlData({
        daily: isPositive ? `+${data.daily}` : data.daily,
        changePercent: data.changePercent >= 0 ? `+${data.changePercent}%` : `${data.changePercent}%`,
        isPositive
      });
    });

    // Positions updates
    const positionsSub = realTimeDataService.subscribe('positions', (data) => {
      setPositionsData({
        count: data.openPositions,
        totalValue: data.totalValue,
        unrealizedPnL: data.unrealizedPnL >= 0 ? `+${data.unrealizedPnL}` : data.unrealizedPnL
      });
    });

    // Trade notifications
    const tradeSub = realTimeDataService.subscribe('trades', (trade) => {
      if (trade.status === 'FILLED') {
        const isProfitable = parseFloat(trade.pnl) > 0;
        toast.success(
          `${trade.type} ${trade.pair} filled at $${trade.price}`,
          {
            icon: isProfitable ? '💰' : '📊',
            duration: 3000,
          }
        );
      }
    });

    // Cleanup subscriptions
    return () => {
      realTimeDataService.unsubscribe(portfolioSub);
      realTimeDataService.unsubscribe(pnlSub);
      realTimeDataService.unsubscribe(positionsSub);
      realTimeDataService.unsubscribe(tradeSub);
    };
  }, []);

  const kpiData = [
    {
      title: 'Portfolio Value',
      value: `$${portfolioData.value}`,
      change: portfolioData.change,
      changePercent: portfolioData.changePercent,
      icon: DollarSign,
      isPositive: portfolioData.isPositive,
      isRealTime: true
    },
    {
      title: 'Daily P&L',
      value: `$${pnlData.daily}`,
      change: 'vs yesterday',
      changePercent: pnlData.changePercent,
      icon: TrendingUp,
      isPositive: pnlData.isPositive,
      isRealTime: true
    },
    {
      title: 'Open Positions',
      value: positionsData.count.toString(),
      change: `$${positionsData.totalValue} total`,
      changePercent: positionsData.unrealizedPnL,
      icon: Activity,
      isPositive: parseFloat(positionsData.unrealizedPnL) >= 0,
      isRealTime: true
    },
    {
      title: 'Win Rate',
      value: '73.2%',
      change: 'Last 30 trades',
      changePercent: '+2.1%',
      icon: Target,
      isPositive: true,
      isRealTime: false
    },
    {
      title: 'Sharpe Ratio',
      value: '1.84',
      change: 'Risk-adjusted return',
      changePercent: '+0.12',
      icon: BarChart3,
      isPositive: true,
      isRealTime: false
    }
  ];

  return (
    <div className="min-h-screen bg-primary-bg p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time overview of your trading performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-positive/10 border border-positive/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-positive animate-pulse"></div>
              <span className="text-xs font-medium text-positive">Live Market Data</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RealTimeKPI {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions onNewMiniChart={() => toast.success('Opening new mini-chart...')} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart />
          <MarketOverview />
        </div>

        {/* Right Column - AI Insights */}
        <div className="space-y-6">
          <AIInsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
