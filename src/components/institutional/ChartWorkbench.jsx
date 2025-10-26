import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Volume2, 
  Activity, 
  Layers,
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Share,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChartWorkbench = ({ symbol = 'EUR/USD', timeframe = '1H' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState(['VWAP', 'EMA20']);
  const [showOrderflow, setShowOrderflow] = useState(false);
  const [chartType, setChartType] = useState('candlestick');

  const availableIndicators = [
    { id: 'EMA20', name: 'EMA 20', color: '#3b82f6' },
    { id: 'EMA50', name: 'EMA 50', color: '#ef4444' },
    { id: 'VWAP', name: 'VWAP', color: '#f59e0b' },
    { id: 'BB', name: 'Bollinger Bands', color: '#8b5cf6' },
    { id: 'RSI', name: 'RSI', color: '#10b981' },
    { id: 'MACD', name: 'MACD', color: '#f97316' }
  ];

  const timeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];

  const toggleIndicator = (indicatorId) => {
    setActiveIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  return (
    <div className={`bg-[#0f172a] rounded-lg border border-[#1e293b] ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">{symbol}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{timeframe}</span>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => {}}
                className={`px-2 py-1 text-xs rounded ${
                  tf === timeframe 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowOrderflow(!showOrderflow)}>
            {showOrderflow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Orderflow
          </Button>
          
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 p-4">
        {/* Mock Chart */}
        <div className="w-full h-full bg-[#1e293b] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">TradingView Chart Integration</p>
            <p className="text-sm text-gray-500">{symbol} • {timeframe}</p>
          </div>
        </div>

        {/* Orderflow Heatmap Overlay */}
        {showOrderflow && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 w-48 bg-[#0f172a] border border-[#1e293b] rounded-lg p-3"
          >
            <h4 className="text-sm font-semibold text-white mb-2">Orderflow Heatmap</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">1.0920</span>
                <div className="w-16 h-2 bg-red-500 rounded"></div>
                <span className="text-red-400">-2.5M</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">1.0915</span>
                <div className="w-12 h-2 bg-green-500 rounded"></div>
                <span className="text-green-400">+1.8M</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">1.0910</span>
                <div className="w-20 h-2 bg-green-500 rounded"></div>
                <span className="text-green-400">+3.2M</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Indicators Panel */}
      <div className="p-4 border-t border-[#1e293b]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Active Indicators</h4>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {availableIndicators.map((indicator) => (
            <button
              key={indicator.id}
              onClick={() => toggleIndicator(indicator.id)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeIndicators.includes(indicator.id)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: indicator.color }}
                ></div>
                {indicator.name}
              </div>
            </button>
          ))}
        </div>

        {/* AI Recommended Indicators */}
        <div className="mt-3 p-2 bg-blue-600/10 border border-blue-600/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">AI Recommendation</span>
          </div>
          <p className="text-xs text-gray-300">
            For {symbol} trend analysis, consider adding RSI + MACD for momentum confirmation
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartWorkbench;
