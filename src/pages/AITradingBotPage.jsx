import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AITradingBot from '@/components/ai/AITradingBot';
import AISignalGenerator from '@/components/ai/AISignalGenerator';
import AIPerformanceDashboard from '@/components/ai/AIPerformanceDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Bot, BarChart3, Brain, Settings, Activity, Zap } from 'lucide-react';

const AITradingBotPage = () => {
  const [activeTab, setActiveTab] = useState('bot');

  const tabs = [
    { id: 'bot', label: 'Trading Bot', icon: Bot },
    { id: 'signals', label: 'AI Signals', icon: Brain },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>AI Trading Bot - Blommy</title>
        <meta name="description" content="Advanced AI-powered algorithmic trading system with real-time analysis and automated execution." />
      </Helmet>
      
      <div className="max-w-full mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#3b82f6]/20 rounded-xl">
              <Bot className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">AI Trading Bot</h1>
              <p className="text-md text-text-secondary">Advanced algorithmic trading powered by artificial intelligence</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card-bg rounded-lg p-4 border border-border-on-card">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-text-on-card-secondary">Status</span>
              </div>
              <div className="text-lg font-semibold text-green-400">Active</div>
            </div>
            
            <div className="bg-card-bg rounded-lg p-4 border border-border-on-card">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-text-on-card-secondary">Today's P&L</span>
              </div>
              <div className="text-lg font-semibold text-green-400">+$2,450</div>
            </div>
            
            <div className="bg-card-bg rounded-lg p-4 border border-border-on-card">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-text-on-card-secondary">AI Confidence</span>
              </div>
              <div className="text-lg font-semibold text-blue-400">87%</div>
            </div>
            
            <div className="bg-card-bg rounded-lg p-4 border border-border-on-card">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-text-on-card-secondary">Win Rate</span>
              </div>
              <div className="text-lg font-semibold text-blue-400">78.5%</div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card-bg border border-border-on-card">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="bot" className="mt-6">
              <AITradingBot />
            </TabsContent>

            <TabsContent value="signals" className="mt-6">
              <AISignalGenerator asset={{ symbol: 'EUR/USD', name: 'Euro vs US Dollar' }} />
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <AIPerformanceDashboard />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#3b82f6]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#3b82f6]/20 rounded-lg">
                    <Settings className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Bot Settings</h2>
                    <p className="text-sm text-gray-400">Configure your AI trading parameters</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Management */}
                  <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
                    <h3 className="text-lg font-semibold text-white mb-4">Risk Management</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Max Risk Per Trade (%)</label>
                        <input 
                          type="number" 
                          defaultValue="2" 
                          className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Daily Loss Limit ($)</label>
                        <input 
                          type="number" 
                          defaultValue="1000" 
                          className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Max Positions</label>
                        <input 
                          type="number" 
                          defaultValue="10" 
                          className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trading Parameters */}
                  <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
                    <h3 className="text-lg font-semibold text-white mb-4">Trading Parameters</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Min Confidence Level (%)</label>
                        <input 
                          type="number" 
                          defaultValue="70" 
                          className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Trading Hours</label>
                        <select className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]">
                          <option value="24/7">24/7</option>
                          <option value="market_hours">Market Hours Only</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Notification Level</label>
                        <select className="w-full bg-[#1e293b] border border-[#3b82f6]/50 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#3b82f6]">
                          <option value="all">All Trades</option>
                          <option value="high_confidence">High Confidence Only</option>
                          <option value="errors">Errors Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-2 bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white rounded-md transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AITradingBotPage;
