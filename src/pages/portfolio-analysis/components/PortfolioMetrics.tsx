import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyMetrics, historicalPerformance } from '../utils/mockData';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { useTheme } from '@/contexts/ThemeContext';
import { portfolioRealTimeService } from '@/services/portfolioRealTimeService';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import PulseIndicator from '@/components/ui/PulseIndicator';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// A generic card component to avoid repetition - now clickable with theme colors
const MetricCard = ({ 
  title, 
  children, 
  className, 
  onClick,
  isLoading = false
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}) => {
  const { colors } = useTheme();
  
  return (
    <motion.div 
      className={`rounded-xl p-4 flex flex-col transition-all duration-200 cursor-pointer ${className}`}
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
        border: `1px solid ${colors.border.primary}`
      }}
      whileHover={{
        borderColor: colors.accent.primary,
        boxShadow: `0 4px 12px ${colors.accent.primary}20`
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium" style={{ color: colors.text.secondary }}>{title}</h3>
        <PulseIndicator isActive={!isLoading} size="sm" />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        {isLoading ? <LoadingSpinner size="sm" /> : children}
      </div>
    </motion.div>
  );
};

const PortfolioMetrics: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    portfolioValue: keyMetrics.totalValue,
    dailyChange: keyMetrics.dailyChange,
    dailyChangePercent: keyMetrics.dailyChangePercent,
    var95: 3450,
    sharpeRatio: 1.847,
    beta: 1.23,
    infoRatio: 0.68,
    maxDD: 0.124,
    concentration: 0.234
  });

  const sparklineData = historicalPerformance.slice(-30).map(d => ({ pv: d.portfolioValue }));

  // Subscribe to real-time updates
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate initial loading
    const loadingTimer = setTimeout(() => setIsLoading(false), 1500);

    const portfolioUnsub = portfolioRealTimeService.subscribe('portfolio', (data) => {
      setRealTimeData(prev => ({
        ...prev,
        portfolioValue: data.totalValue,
        dailyChange: data.dailyChange,
        dailyChangePercent: data.dailyChangePercent
      }));
    });

    const metricsUnsub = portfolioRealTimeService.subscribe('metrics', (data) => {
      setRealTimeData(prev => ({
        ...prev,
        var95: data.var95,
        sharpeRatio: data.sharpeRatio,
        beta: data.beta,
        infoRatio: data.infoRatio
      }));
    });

    return () => {
      clearTimeout(loadingTimer);
      portfolioUnsub();
      metricsUnsub();
    };
  }, []);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 font-mono">
        
        {/* Card A: TOTAL PORTFOLIO VALUE */}
        <MetricCard title="PORTFOLIO VALUE" className="lg:col-span-2">
          <p className="text-3xl font-bold text-text-primary">{formatCurrency(keyMetrics.totalValue)}</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-green-500">
            <TrendingUp size={16} />
            <span>{formatCurrency(keyMetrics.dailyChange)} ({formatPercentage(keyMetrics.dailyChangePercent)})</span>
          </div>
          <div className="h-12 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="pv" stroke="#10b981" strokeWidth={2} fill="url(#portfolioGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Beta: {realTimeData.beta.toFixed(2)}</span>
            <span>Alpha: +{formatPercentage(4.8)}</span>
          </div>
        </MetricCard>

        {/* Card B: VALUE AT RISK (VaR) */}
        <MetricCard 
          title="VALUE AT RISK (95%)" 
          onClick={() => navigate('/portfolio-analysis/var-analysis')}
        >
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#f56565]">{formatCurrency(realTimeData.var95)}</p>
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle size={14} className="text-[#ed8936]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum expected loss over 1 day at 95% confidence</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-[#a0aec0]">1-Day, 95% Confidence</p>
          <div className="mt-auto pt-2">
            <span className="text-xs font-bold bg-[#f56565]/20 text-[#f56565] py-1 px-2 rounded-full">
              {formatPercentage((realTimeData.var95 / keyMetrics.totalValue) * 100)} of AUM
            </span>
          </div>
        </MetricCard>

        {/* Card C: SHARPE RATIO */}
        <MetricCard title="SHARPE RATIO">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#4299e1]">{realTimeData.sharpeRatio.toFixed(3)}</p>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="text-text-secondary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Risk-adjusted return vs risk-free rate</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-text-secondary">Annualized</p>
          <div className="w-full h-2 bg-gray-700 rounded-full mt-auto">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((realTimeData.sharpeRatio / 3) * 100, 100)}%` }}></div>
          </div>
          <p className="text-xs text-text-secondary mt-1">Benchmark: 1.52</p>
        </MetricCard>

        {/* Card D: INFORMATION RATIO */}
        <MetricCard title="INFORMATION RATIO">
          <p className="text-2xl font-bold text-[#9f7aea]">{realTimeData.infoRatio.toFixed(3)}</p>
          <p className="text-sm text-text-secondary">Active Return/Tracking Error</p>
          <div className="mt-auto pt-2">
            <span className={`text-xs font-bold py-1 px-2 rounded-full ${realTimeData.infoRatio > 0.5 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {realTimeData.infoRatio > 0.5 ? 'Excellent' : 'Good'}
            </span>
          </div>
        </MetricCard>

        {/* Card E: MAX DRAWDOWN */}
        <MetricCard title="MAX DRAWDOWN">
          <p className="text-2xl font-bold text-[#f56565]">{formatPercentage(realTimeData.maxDD * 100)}</p>
          <p className="text-sm text-text-secondary">Peak-to-Trough</p>
          <div className="mt-auto pt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${keyMetrics.recoveryProgress}%` }}></div>
            </div>
            <p className="text-xs text-text-secondary mt-1">{keyMetrics.recoveryProgress}% recovered</p>
          </div>
        </MetricCard>

        {/* Card F: CONCENTRATION RISK */}
        <MetricCard title="CONCENTRATION RISK">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#ed8936]">{(realTimeData.concentration * 100).toFixed(1)}</p>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="text-text-secondary" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Herfindahl-Hirschman Index. Lower = more diversified</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-text-secondary">HHI Score</p>
          <div className="mt-auto pt-2">
            <span className={`text-xs font-bold py-1 px-2 rounded-full ${realTimeData.concentration > 0.25 ? 'bg-red-500/20 text-red-400' : realTimeData.concentration > 0.15 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
              {realTimeData.concentration > 0.25 ? 'High Risk' : realTimeData.concentration > 0.15 ? 'Medium' : 'Well Diversified'}
            </span>
          </div>
        </MetricCard>

      </div>
    </TooltipProvider>
  );
};

export default PortfolioMetrics;
