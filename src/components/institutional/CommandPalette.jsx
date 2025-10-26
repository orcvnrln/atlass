import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Shield, 
  Target,
  Zap,
  Settings,
  Play,
  Square,
  RefreshCw,
  Download,
  Bell,
  Eye,
  Filter,
  Plus
} from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: 'generate-setups',
      name: 'Generate Top 10 Setups',
      description: 'Run AI analysis to find best trading opportunities',
      icon: RefreshCw,
      category: 'AI',
      action: () => console.log('Generating setups...')
    },
    {
      id: 'emergency-stop',
      name: 'Emergency Stop All Positions',
      description: 'Immediately close all open positions',
      icon: Square,
      category: 'Risk',
      action: () => console.log('Emergency stop activated')
    },
    {
      id: 'analyze-symbol',
      name: 'Analyze Symbol',
      description: 'Get AI analysis for specific instrument',
      icon: Brain,
      category: 'AI',
      action: () => console.log('Analyzing symbol...')
    },
    {
      id: 'backtest-strategy',
      name: 'Backtest Strategy',
      description: 'Run historical performance test',
      icon: Play,
      category: 'Strategy',
      action: () => console.log('Running backtest...')
    },
    {
      id: 'export-data',
      name: 'Export Trading Data',
      description: 'Download performance and trade history',
      icon: Download,
      category: 'Data',
      action: () => console.log('Exporting data...')
    },
    {
      id: 'risk-settings',
      name: 'Risk Management Settings',
      description: 'Configure risk limits and controls',
      icon: Shield,
      category: 'Risk',
      action: () => console.log('Opening risk settings...')
    },
    {
      id: 'add-watchlist',
      name: 'Add to Watchlist',
      description: 'Monitor new instruments',
      icon: Plus,
      category: 'Watchlist',
      action: () => console.log('Adding to watchlist...')
    },
    {
      id: 'alerts-config',
      name: 'Configure Alerts',
      description: 'Set up notifications and alerts',
      icon: Bell,
      category: 'Settings',
      action: () => console.log('Configuring alerts...')
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase()) ||
    command.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'AI': return 'text-blue-400 bg-blue-600/20';
      case 'Risk': return 'text-red-400 bg-red-600/20';
      case 'Strategy': return 'text-purple-400 bg-purple-600/20';
      case 'Data': return 'text-green-400 bg-green-600/20';
      case 'Watchlist': return 'text-yellow-400 bg-yellow-600/20';
      case 'Settings': return 'text-gray-400 bg-gray-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#1e293b]">
            <Command className="w-5 h-5 text-blue-400" />
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full bg-[#1e293b] border border-[#374151] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-[#1e293b] rounded border border-[#374151]">↑↓</kbd>
              <span>navigate</span>
              <kbd className="px-2 py-1 bg-[#1e293b] rounded border border-[#374151]">↵</kbd>
              <span>select</span>
              <kbd className="px-2 py-1 bg-[#1e293b] rounded border border-[#374151]">esc</kbd>
              <span>close</span>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No commands found</p>
                <p className="text-sm text-gray-500">Try searching for something else</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredCommands.map((command, index) => (
                  <motion.div
                    key={command.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-600/20 border border-blue-600/30'
                        : 'hover:bg-[#1e293b]'
                    }`}
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                  >
                    <div className="p-2 bg-[#1e293b] rounded-lg">
                      <command.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{command.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(command.category)}`}>
                          {command.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{command.description}</p>
                    </div>

                    {index === selectedIndex && (
                      <div className="text-xs text-blue-400">
                        ↵
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#1e293b] bg-[#1e293b]/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Pro tip: Use Ctrl+K to open command palette anytime</span>
              <span>{filteredCommands.length} commands available</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
