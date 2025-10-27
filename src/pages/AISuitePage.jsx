import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Bot, Wallet, Link2, CalendarDays, Book, BarChart3, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AISuitePage = () => {
  const navigate = useNavigate();

  const aiTools = [
    {
      title: 'Portfolio Analysis',
      description: 'Advanced portfolio analytics with risk assessment and performance metrics',
      icon: Wallet,
      path: '/portfolio-analysis',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Correlation Matrix',
      description: 'Visualize asset correlations and identify portfolio diversification opportunities',
      icon: Link2,
      path: '/correlation-matrix',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Economic Calendar',
      description: 'Track important economic events and their potential market impact',
      icon: CalendarDays,
      path: '/economic-calendar',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'AI Co-Pilot',
      description: 'AI-powered trading assistant for real-time market insights',
      icon: BrainCircuit,
      path: '/ai-copilot',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'AI Trading Bot',
      description: 'Automated trading strategies powered by machine learning',
      icon: Bot,
      path: '/ai-trading-bot',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Institutional Bot',
      description: 'Enterprise-grade trading bot with advanced risk management',
      icon: Zap,
      path: '/institutional-bot',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Trade Journal',
      description: 'Track and analyze your trading performance and strategies',
      icon: Book,
      path: '/trade-journal',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Backtesting Engine',
      description: 'Test your trading strategies against historical market data',
      icon: BarChart3,
      path: '/backtesting',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Paper Trading',
      description: 'Practice trading with virtual money in real market conditions',
      icon: TrendingUp,
      path: '/paper-trading',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-primary-bg">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-3 flex items-center gap-3">
            <BrainCircuit className="w-10 h-10 text-accent" />
            AI Suite
          </h1>
          <p className="text-text-secondary text-lg">
            Powerful AI-driven tools to enhance your trading strategies and decision-making
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(tool.path)}
              className="group relative bg-card-bg rounded-xl p-6 border border-border-color hover:border-accent cursor-pointer transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} bg-opacity-20`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-secondary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-text-secondary text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Overview */}
        <div className="mt-12 bg-card-bg rounded-xl p-6 border border-border-color">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Why Use AI Suite?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-text-primary mb-2">🎯 Data-Driven Insights</h3>
              <p className="text-text-secondary text-sm">
                Leverage advanced algorithms to analyze market trends and make informed decisions
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">⚡ Real-Time Analysis</h3>
              <p className="text-text-secondary text-sm">
                Get instant market insights and automated trading signals based on live data
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">🛡️ Risk Management</h3>
              <p className="text-text-secondary text-sm">
                Protect your portfolio with AI-powered risk assessment and management tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuitePage;
