import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Play, Save, TrendingUp, TrendingDown, 
  Volume2, Target, Zap, BarChart3, Plus, Star, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ScanResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  signals: string[];
  score: number;
  sector: string;
}

const MarketScanner: React.FC = () => {
  const { colors } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState('breakout');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');

  const presetScans = [
    { 
      id: 'breakout', 
      name: 'Breakout Stocks', 
      description: 'Volume surge + price breakout above resistance',
      icon: TrendingUp,
      color: colors.accent.success,
      conditions: ['Price > 52W High', 'Volume > 2x Avg', 'RSI > 60']
    },
    { 
      id: 'oversold', 
      name: 'Oversold Crypto', 
      description: 'RSI < 30 with bullish divergence signals',
      icon: TrendingDown,
      color: colors.accent.warning,
      conditions: ['RSI < 30', 'Price < MA(50)', 'Bullish Divergence']
    },
    { 
      id: 'momentum', 
      name: 'High Momentum Forex', 
      description: '14-day momentum with strong trend confirmation',
      icon: Zap,
      color: colors.accent.primary,
      conditions: ['14D Momentum > 5%', 'ADX > 25', 'Volume Increasing']
    },
    { 
      id: 'smartmoney', 
      name: 'Smart Money Accumulation', 
      description: 'Institutional buying patterns detected',
      icon: Target,
      color: colors.accent.purple,
      conditions: ['Order Flow Bullish', 'Dark Pool Activity', 'Low Retail Interest']
    },
    { 
      id: 'ict', 
      name: 'ICT Setups', 
      description: 'Fair Value Gaps + liquidity sweep patterns',
      icon: BarChart3,
      color: colors.accent.danger,
      conditions: ['FVG Present', 'Liquidity Sweep', 'Premium/Discount Zone']
    }
  ];

  // Mock scan results
  const mockResults: ScanResult[] = [
    {
      symbol: 'BTC/USD',
      name: 'Bitcoin',
      price: 45120.50,
      change: 1280.00,
      changePercent: 2.92,
      volume: 28500000000,
      marketCap: 885000000000,
      signals: ['Breakout', 'Volume Surge', 'Smart Money'],
      score: 8.7,
      sector: 'Cryptocurrency'
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 190.25,
      change: 2.75,
      changePercent: 1.46,
      volume: 45000000,
      marketCap: 2950000000000,
      signals: ['Earnings Beat', 'Momentum'],
      score: 7.8,
      sector: 'Technology'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 267.50,
      change: 8.25,
      changePercent: 3.18,
      volume: 78000000,
      marketCap: 850000000000,
      signals: ['Breakout', 'High Volume', 'Analyst Upgrade'],
      score: 9.1,
      sector: 'Automotive'
    },
    {
      symbol: 'EURUSD',
      name: 'Euro / US Dollar',
      price: 1.0845,
      change: -0.0025,
      changePercent: -0.23,
      volume: 125000000,
      marketCap: 0,
      signals: ['Oversold', 'Support Level'],
      score: 6.4,
      sector: 'Forex'
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 485.20,
      change: 12.80,
      changePercent: 2.71,
      volume: 52000000,
      marketCap: 1200000000000,
      signals: ['AI Hype', 'Momentum', 'Institutional Buying'],
      score: 8.9,
      sector: 'Technology'
    }
  ];

  const runScan = async () => {
    setIsScanning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setScanResults(mockResults);
    setIsScanning(false);
  };

  useEffect(() => {
    runScan();
  }, [selectedPreset]);

  const PresetCard = ({ preset }: { preset: typeof presetScans[0] }) => {
    const Icon = preset.icon;
    const isSelected = selectedPreset === preset.id;

    return (
      <motion.div
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2' : ''
        }`}
        style={{
          backgroundColor: isSelected ? `${preset.color}10` : colors.background.secondary,
          borderColor: isSelected ? preset.color : colors.border.primary,
          ringColor: preset.color
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedPreset(preset.id)}
      >
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${preset.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: preset.color }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: colors.text.primary }}>
              {preset.name}
            </h3>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {preset.description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {preset.conditions.map((condition, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.background.tertiary,
                color: colors.text.secondary 
              }}
            >
              {condition}
            </span>
          ))}
        </div>
      </motion.div>
    );
  };

  const ResultsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: colors.border.primary }}>
            <th className="text-left p-3" style={{ color: colors.text.secondary }}>Asset</th>
            <th className="text-right p-3" style={{ color: colors.text.secondary }}>Price</th>
            <th className="text-right p-3" style={{ color: colors.text.secondary }}>Change</th>
            <th className="text-right p-3" style={{ color: colors.text.secondary }}>Volume</th>
            <th className="text-left p-3" style={{ color: colors.text.secondary }}>Signals</th>
            <th className="text-center p-3" style={{ color: colors.text.secondary }}>Score</th>
            <th className="text-center p-3" style={{ color: colors.text.secondary }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scanResults.map((result, index) => (
            <motion.tr
              key={result.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b hover:bg-opacity-50"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: 'transparent'
              }}
            >
              <td className="p-3">
                <div>
                  <div className="font-bold" style={{ color: colors.text.primary }}>
                    {result.symbol}
                  </div>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>
                    {result.name}
                  </div>
                </div>
              </td>
              <td className="p-3 text-right font-mono" style={{ color: colors.text.primary }}>
                ${result.price.toLocaleString()}
              </td>
              <td className="p-3 text-right">
                <div 
                  className="font-mono"
                  style={{ color: result.change >= 0 ? colors.accent.success : colors.accent.danger }}
                >
                  {result.change >= 0 ? '+' : ''}${result.change.toFixed(2)}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: result.change >= 0 ? colors.accent.success : colors.accent.danger }}
                >
                  {result.change >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                </div>
              </td>
              <td className="p-3 text-right font-mono" style={{ color: colors.text.primary }}>
                {result.volume > 1000000000 
                  ? `${(result.volume / 1000000000).toFixed(1)}B`
                  : `${(result.volume / 1000000).toFixed(1)}M`
                }
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {result.signals.map((signal, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${colors.accent.primary}20`,
                        color: colors.accent.primary 
                      }}
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-3 text-center">
                <div 
                  className="inline-flex items-center justify-center w-12 h-8 rounded-full font-bold text-sm"
                  style={{ 
                    backgroundColor: result.score >= 8 ? `${colors.accent.success}20` : 
                                   result.score >= 7 ? `${colors.accent.warning}20` : `${colors.accent.danger}20`,
                    color: result.score >= 8 ? colors.accent.success : 
                           result.score >= 7 ? colors.accent.warning : colors.accent.danger
                  }}
                >
                  {result.score.toFixed(1)}
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" title="Add to Watchlist">
                    <Star size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" title="View Chart">
                    <ExternalLink size={14} />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const HeatmapView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {scanResults.map((result, index) => (
        <motion.div
          key={result.symbol}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl border cursor-pointer hover:shadow-lg transition-all"
          style={{
            backgroundColor: result.changePercent >= 0 ? `${colors.accent.success}20` : `${colors.accent.danger}20`,
            borderColor: result.changePercent >= 0 ? colors.accent.success : colors.accent.danger,
            height: `${100 + result.score * 10}px` // Size by score
          }}
        >
          <div className="text-center h-full flex flex-col justify-between">
            <div>
              <div className="font-bold text-lg" style={{ color: colors.text.primary }}>
                {result.symbol}
              </div>
              <div className="text-xs" style={{ color: colors.text.secondary }}>
                {result.sector}
              </div>
            </div>
            
            <div>
              <div className="font-mono text-sm" style={{ color: colors.text.primary }}>
                ${result.price.toLocaleString()}
              </div>
              <div 
                className="font-bold"
                style={{ color: result.changePercent >= 0 ? colors.accent.success : colors.accent.danger }}
              >
                {result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
              </div>
            </div>
            
            <div 
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.background.primary,
                color: colors.accent.primary 
              }}
            >
              Score: {result.score.toFixed(1)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
            🔍 Market Scanner & Screener
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Find high-probability trading opportunities across all markets
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant={viewMode === 'table' ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button 
            variant={viewMode === 'heatmap' ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode('heatmap')}
          >
            Heatmap View
          </Button>
          <Button variant="secondary" size="sm" className="flex items-center gap-2">
            <Save size={16} />
            Save Scan
          </Button>
        </div>
      </div>

      {/* Preset Scans */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Preset Scans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {presetScans.map(preset => (
            <PresetCard key={preset.id} preset={preset} />
          ))}
        </div>
      </div>

      {/* Custom Scanner Builder */}
      <div className="mb-8">
        <div 
          className="p-6 rounded-xl border"
          style={{ 
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary 
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
              Custom Scanner Builder
            </h3>
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <Plus size={16} />
              Add Condition
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.secondary }}>
                Price Condition
              </label>
              <select 
                className="w-full px-3 py-2 rounded border"
                style={{ 
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary
                }}
              >
                <option>Price &gt; MA(50)</option>
                <option>Price &lt; MA(50)</option>
                <option>Price &gt; 52W High</option>
                <option>Price &lt; 52W Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.secondary }}>
                Volume Condition
              </label>
              <select 
                className="w-full px-3 py-2 rounded border"
                style={{ 
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary
                }}
              >
                <option>Volume &gt; 2x Average</option>
                <option>Volume &gt; 1M</option>
                <option>Volume Increasing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.secondary }}>
                Technical Indicator
              </label>
              <select 
                className="w-full px-3 py-2 rounded border"
                style={{ 
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary
                }}
              >
                <option>RSI &lt; 30</option>
                <option>RSI &gt; 70</option>
                <option>MACD Bullish Cross</option>
                <option>Bollinger Band Squeeze</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={runScan}
            disabled={isScanning}
            className="flex items-center gap-2"
          >
            <Play size={16} />
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </Button>
          
          {isScanning && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" style={{ borderColor: colors.accent.primary }}></div>
              <span style={{ color: colors.text.secondary }}>Scanning 2,847 assets...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span style={{ color: colors.text.secondary }}>
            Found {scanResults.length} opportunities
          </span>
          <Button variant="secondary" size="sm" className="flex items-center gap-2">
            <Filter size={16} />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div 
        className="rounded-xl border"
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary 
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text.primary }}>
            Scan Results - {presetScans.find(p => p.id === selectedPreset)?.name}
          </h3>
          
          {viewMode === 'table' ? <ResultsTable /> : <HeatmapView />}
        </div>
      </div>
    </div>
  );
};

export default MarketScanner;
