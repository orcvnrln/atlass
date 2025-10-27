import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX,
  TrendingUp, Target, AlertTriangle, BarChart3, Zap, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; onClick: () => void }>;
}

const JarvisAICopilot: React.FC = () => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi, I'm JARVIS - your AI trading co-pilot. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    { icon: AlertTriangle, text: "What's my biggest risk right now?", color: colors.accent.danger },
    { icon: Target, text: "Find me a good BTC entry", color: colors.accent.primary },
    { icon: BarChart3, text: "Analyze my last 10 trades", color: colors.accent.warning },
    { icon: TrendingUp, text: "Should I hedge my portfolio?", color: colors.accent.success },
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(content);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      
      // Speak response if enabled
      if (isSpeaking) {
        speakText(response.content);
      }
    }, 1500);
  };

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('risk')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🛡️ **Your Biggest Risk:**

Your biggest risk is **concentration in Bitcoin (35.4% of portfolio)**. This exposes you to high volatility. Additionally, BTC and ETH are highly correlated (0.92), reducing diversification benefits.

**Recommendation:** Reduce BTC to 25%, add uncorrelated assets like Bonds or Gold.

**Impact:** This could reduce your portfolio volatility by 18% while maintaining similar returns.`,
        timestamp: new Date(),
        actions: [
          { label: 'View Risk Analysis', onClick: () => console.log('Navigate to risk analysis') },
          { label: 'Suggest Rebalancing', onClick: () => console.log('Open rebalancing tool') }
        ]
      };
    }

    if (lowerQuery.includes('btc') || lowerQuery.includes('bitcoin') || lowerQuery.includes('entry')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎯 **BTC Setup Detected:**

**Asset:** BTC/USD
**Pattern:** Bullish Fair Value Gap + Liquidity Sweep
**Confluence Score:** 8.2/10

📈 **Trade Plan:**
- **Entry:** $44,800 (current: $45,120, wait for retest)
- **Stop Loss:** $44,200 (-$600 risk)
- **Take Profit:** $47,500 (+$2,700 profit)
- **R:R:** 1:4.5 ✅

**Why this works:** Price swept liquidity below $44k, creating FVG. Institutional buyers likely to push from this zone.`,
        timestamp: new Date(),
        actions: [
          { label: 'Apply to Chart', onClick: () => console.log('Apply to chart') },
          { label: 'Place Order', onClick: () => console.log('Open order form') },
          { label: 'Set Alert', onClick: () => console.log('Set price alert') }
        ]
      };
    }

    if (lowerQuery.includes('trades') || lowerQuery.includes('analyze')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📊 **Last 10 Trades Analysis:**
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Type definitions for theme
interface ThemeColors {
  accent?: string;
  background?: string;
  text?: string;
  primary?: string;
  secondary?: string;
}

interface Theme {
  colors?: ThemeColors;
  mode?: 'light' | 'dark';
}

// Default theme with all required values
const DEFAULT_THEME: Required<Theme> = {
  mode: 'light',
  colors: {
    accent: '#3B82F6',
    background: '#FFFFFF',
    text: '#1F2937',
    primary: '#3B82F6',
    secondary: '#6B7280',
  },
};

const JarvisAICopilot: React.FC = () => {
  let theme: Theme | undefined;

  try {
    theme = useContext(ThemeContext);
  } catch (error) {
    console.warn('ThemeContext not available:', error);
    theme = DEFAULT_THEME;
  }

  // Safely extract colors with fallbacks
  const colors = {
    accent: theme?.colors?.accent ?? DEFAULT_THEME.colors.accent,
    background: theme?.colors?.background ?? DEFAULT_THEME.colors.background,
    text: theme?.colors?.text ?? DEFAULT_THEME.colors.text,
    primary: theme?.colors?.primary ?? DEFAULT_THEME.colors.primary,
    secondary: theme?.colors?.secondary ?? DEFAULT_THEME.colors.secondary,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 w-96 border-2"
        style={{ 
          borderColor: colors.accent,
          backgroundColor: colors.background 
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: colors.accent }}
          />
          <h2 
            className="text-xl font-bold"
            style={{ color: colors.text }}
          >
            Jarvis AI Copilot
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm" style={{ color: colors.secondary }}>
            Your intelligent AI assistant is ready to help.
          </p>

          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${colors.accent}10` }}
          >
            <p className="text-sm" style={{ color: colors.text }}>
              💡 Ask me anything about your dashboard, analytics, or trading strategies.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ 
                backgroundColor: colors.accent,
                color: '#FFFFFF'
              }}
            >
              Start Chat
            </button>
            <button
              className="py-2 px-4 rounded-lg font-medium border-2 transition-all hover:bg-gray-50"
              style={{ 
                borderColor: colors.accent,
                color: colors.accent
              }}
            >
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisAICopilot;
**Performance:**
- Win Rate: 60% (6 wins, 4 losses)
- Avg Win: +$345
- Avg Loss: -$187
- Net P&L: +$1,322

**Patterns Detected:**
⚠️ You tend to revenge-trade after losses. Win rate drops to 30% within 1 hour of a loss.

💡 **Suggestion:** Implement a 1-hour cool-down rule after losses.

📈 Your best trades happen between 9-11 AM EST. Consider focusing on this window.`,
        timestamp: new Date(),
        actions: [
          { label: 'View Full Journal', onClick: () => console.log('Open trade journal') },
          { label: 'Export Report', onClick: () => console.log('Export analysis') }
        ]
      };
    }

    if (lowerQuery.includes('hedge')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🛡️ **Portfolio Hedging Analysis:**

**Current Exposure:**
- Long BTC: 35.4% ($45,120)
- Long Tech Stocks: 28% (AAPL, GOOGL, TSLA)
- Total Risk: High correlation to tech sector

**Hedging Strategies:**

1. **Put Options on QQQ** (Recommended)
   - Cost: ~$800 for 30-day protection
   - Protects against 10%+ tech selloff
   
2. **Short S&P 500 Futures**
   - Hedge ratio: 0.3x portfolio value
   - Reduces beta from 1.23 to 0.85

3. **Increase Gold/Bonds Allocation**
   - Add 10% Gold (negative correlation)
   - Add 5% Treasury Bonds

**My Recommendation:** Option 1 (Put Options) - Best cost/benefit ratio.`,
        timestamp: new Date(),
        actions: [
          { label: 'Calculate Hedge Size', onClick: () => console.log('Open hedge calculator') },
          { label: 'View Options Chain', onClick: () => console.log('Show options') }
        ]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I understand you're asking about "${query}". I can help you with:

• Risk analysis and portfolio optimization
• Finding trading setups and entry points
• Analyzing your trading performance
• Market insights and news
• Position management and hedging strategies

Try asking me something specific, like:
- "What's my portfolio's Sharpe ratio?"
- "Show me support levels for AAPL"
- "Should I close my TSLA position?"`,
      timestamp: new Date()
    };
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#📊🎯🛡️⚠️💡📈]/g, ''));
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Implement speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsOpen(true)}
              className="rounded-full w-16 h-16 shadow-2xl relative"
              style={{ backgroundColor: colors.accent.primary }}
            >
              <MessageCircle size={24} />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                style={{ backgroundColor: colors.accent.success }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl shadow-2xl border flex flex-col z-50"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary
            }}
          >
            {/* Header */}
            <div 
              className="p-4 border-b flex items-center justify-between rounded-t-2xl"
              style={{ 
                backgroundColor: colors.background.tertiary,
                borderColor: colors.border.primary 
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Brain className="w-8 h-8" style={{ color: colors.accent.primary }} />
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.accent.success }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: colors.text.primary }}>
                    JARVIS AI Co-pilot
                  </h3>
                  <p className="text-xs" style={{ color: colors.accent.success }}>
                    ● Online
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  title={isSpeaking ? "Disable voice" : "Enable voice"}
                >
                  {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                    }`}
                    style={{
                      backgroundColor: message.role === 'user' 
                        ? colors.accent.primary 
                        : colors.background.tertiary,
                      color: message.role === 'user' ? '#ffffff' : colors.text.primary
                    }}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="sm"
                            onClick={action.onClick}
                            className="text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="rounded-2xl rounded-bl-none p-3"
                    style={{ backgroundColor: colors.background.tertiary }}
                  >
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.text.secondary }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.text.secondary }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.text.secondary }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>
                  Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendMessage(suggestion.text)}
                        className="text-xs flex items-center gap-1"
                        style={{ color: suggestion.color }}
                      >
                        <Icon size={12} />
                        {suggestion.text}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div 
              className="p-4 border-t"
              style={{ borderColor: colors.border.primary }}
            >
              <div className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="Ask anything..."
                  className="flex-1"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary
                  }}
                />
                
                <Button
                  variant={isListening ? "primary" : "ghost"}
                  size="sm"
                  onClick={startListening}
                  className="p-2"
                  style={isListening ? { backgroundColor: colors.accent.danger } : {}}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="p-2"
                  style={{ backgroundColor: colors.accent.primary }}
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JarvisAICopilot;
