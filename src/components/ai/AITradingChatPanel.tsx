// @ts-nocheck
/**
 * 🤖 AI TRADING CHAT PANEL
 * Professional trading assistant with 20 trading styles & 20 functions
 * Bloomberg Terminal-style chat interface with AI integration
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Calculator,
  AlertTriangle,
  BookOpen,
  Settings,
  History,
  Search,
  Star,
  Clock,
  DollarSign,
  PieChart,
  Activity,
  Bell,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { TRADING_STYLES, AI_FUNCTIONS } from '@/constants/tradingConstants';
import { aiTradingAssistant } from '@/services/aiTradingAssistant';
import { useTradingStore } from '@/core/state/store';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  tradingStyle?: string;
  function?: string;
  confidence?: number;
  data?: any;
}

interface TradingStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  strategies: string[];
  riskProfile: 'low' | 'medium' | 'high';
}

interface AIFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'analysis' | 'calculation' | 'alert' | 'education' | 'automation';
  parameters?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// TRADING STYLES (20 Styles)
// ─────────────────────────────────────────────────────────────────────────────

// Using imported TRADING_STYLES from constants

// ─────────────────────────────────────────────────────────────────────────────
// AI FUNCTIONS (20 Functions)
// ─────────────────────────────────────────────────────────────────────────────

// Using imported AI_FUNCTIONS from constants

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AITradingChatPanel: React.FC = () => {
  const { theme, getThemeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('day-trading');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get theme colors
  const themeConfig = getThemeConfig();
  const colors = themeConfig?.colors || {
    primary: '#0f1419',
    secondary: '#1a1f2e',
    tertiary: '#242938',
    elevated: '#2d3748',
    text: '#f7fafc',
    textSecondary: '#a0aec0',
    textTertiary: '#718096',
    accent: '#4299e1',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    purple: '#9f7aea',
    border: '#2d3748',
    borderSecondary: '#4a5568'
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message send
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Use AI service for analysis
      const analysisRequest = {
        symbol: 'BTCUSDT', // Could be made dynamic
        style: selectedStyle,
        timeframe: '1h', // Could be made dynamic
        message: messageToSend,
        parameters: {
          currentPrice: 50000 // Could get from store
        }
      };

      const analysis = await aiTradingAssistant.analyzeTrading(analysisRequest);

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: analysis.analysis,
        timestamp: new Date(),
        tradingStyle: selectedStyle,
        confidence: analysis.confidence,
        data: {
          signals: analysis.signals,
          recommendations: analysis.recommendations,
          riskAssessment: analysis.riskAssessment
        }
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Analysis error:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: 'Sorry, I encountered an error analyzing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  // Handle function execution
  const handleFunctionExecute = async (funcId: string) => {
    const func = AI_FUNCTIONS.find(f => f.id === funcId);
    if (!func) return;

    const systemMessage: ChatMessage = {
      id: `system_${Date.now()}`,
      type: 'system',
      content: `Executing ${func.name}...`,
      timestamp: new Date(),
      function: funcId
    };

    setMessages(prev => [...prev, systemMessage]);

    try {
      // Use AI service for function execution
      const executionRequest = {
        functionId: funcId,
        parameters: {
          symbol: 'BTCUSDT',
          timeframe: '1h',
          accountSize: 10000,
          riskPercent: 2,
          currentPrice: 50000
        },
        context: {
          symbol: 'BTCUSDT',
          timeframe: '1h',
          currentPrice: 50000
        }
      };

      const result = await aiTradingAssistant.executeFunction(executionRequest);

      const resultMessage: ChatMessage = {
        id: `result_${Date.now()}`,
        type: 'ai',
        content: result.success
          ? `${func.name} completed successfully. ${result.explanation}`
          : `Error: ${result.explanation}`,
        timestamp: new Date(),
        function: funcId,
        data: result.result
      };

      setMessages(prev => [...prev, resultMessage]);
    } catch (error) {
      console.error('Function execution error:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: `Error executing ${func.name}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg"
        style={{
          backgroundColor: colors.accent,
          color: theme === 'theme-light' ? '#ffffff' : '#000000'
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] rounded-lg shadow-2xl border flex flex-col z-50"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.border
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" style={{ color: colors.accent }} />
                <div>
                  <h3 className="font-semibold" style={{ color: colors.text }}>
                    AI Trading Assistant
                  </h3>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {TRADING_STYLES.find(s => s.id === selectedStyle)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-opacity-20 hover:bg-gray-500 rounded"
              >
                <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </button>
            </div>

            {/* Trading Style Selector */}
            <div className="p-3 border-b" style={{ borderColor: colors.border }}>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                {TRADING_STYLES.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.icon} {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4" style={{ color: colors.textSecondary }} />
                  <p style={{ color: colors.textSecondary }}>
                    Ask me anything about trading!
                  </p>
                  <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                    Try: "Analyze BTC/USDT" or "Calculate position size"
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <Bot className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'ml-auto'
                        : message.type === 'system'
                        ? 'mx-auto'
                        : ''
                    }`}
                    style={{
                      backgroundColor: message.type === 'user'
                        ? colors.accent
                        : message.type === 'system'
                        ? colors.secondary
                        : colors.secondary,
                      color: message.type === 'user'
                        ? (theme === 'theme-light' ? '#ffffff' : '#000000')
                        : colors.text
                    }}
                  >
                    <p className="text-sm">{message.content}</p>

                    {message.confidence && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-xs opacity-75">Confidence:</div>
                        <div className="flex-1 h-2 bg-black bg-opacity-20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${message.confidence}%`,
                              backgroundColor: message.confidence > 80 ? '#22c55e' : '#eab308'
                            }}
                          />
                        </div>
                        <div className="text-xs font-semibold">{message.confidence}%</div>
                      </div>
                    )}

                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <User className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Bot className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* AI Functions */}
            <div className="p-3 border-t border-b" style={{ borderColor: colors.border }}>
              <div className="grid grid-cols-5 gap-1">
                {AI_FUNCTIONS.slice(0, 10).map((func) => (
                  <button
                    key={func.id}
                    onClick={() => handleFunctionExecute(func.id)}
                    className="p-2 rounded hover:opacity-80 transition-opacity text-sm"
                    style={{ backgroundColor: colors.secondary }}
                    title={func.name}
                  >
                    {func.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: colors.border }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about trading..."
                  className="flex-1 px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="p-2 rounded disabled:opacity-50"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Send className="w-4 h-4" style={{ color: theme === 'theme-light' ? '#ffffff' : '#000000' }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITradingChatPanel;
