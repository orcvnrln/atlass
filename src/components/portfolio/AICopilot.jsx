import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  X,
  Minimize2,
  Maximize2,
  Zap,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

// Pre-defined quick questions
const quickQuestions = [
  "Portfel sağlamlığım necədir?",
  "Ən zəif mövqe hansıdır?",
  "Diversifikasiya yaxşıdır?",
  "Risk azaltmaq üçün nə etməliyəm?"
];

// AI responses simulation
const getAIResponse = (question) => {
  const responses = {
    "portfel sağlamlığım necədir": {
      text: "Portfel sağlamlıq skorunuz 72/100 - Yaxşı səviyyədədir. Əsas problemlər: Kripto ağırlığı 29.9% (optimal: ≤20%) və TSLA konsentrasiyası 12% (optimal: ≤10%).",
      suggestions: [
        { action: 'Kripto azalt', impact: '+8 bal' },
        { action: 'TSLA azalt', impact: '+6 bal' }
      ]
    },
    "ən zəif mövqe hansıdır": {
      text: "ETH/USD ən zəif mövqenizidir (-3.11%). On-chain aktivlik 30% azalıb və Ethereum ETF gözləntisi zəifləyib. Stop-loss qoymaq və ya mövqeyi bağlamaq tövsiyə olunur.",
      suggestions: [
        { action: 'Stop-loss qoy: $2,050', impact: 'Risk -18%' },
        { action: 'Mövqeyi bağla', impact: '-$350' }
      ]
    },
    "diversifikasiya yaxşıdır": {
      text: "Diversifikasiya orta səviyyədədir. 5 sektor var (Stocks 35%, Crypto 30%, Forex 20%, Commodities 9%, Bonds 6%), amma kripto və tech ağırlığı yüksəkdir. Sektorlar arası korrelyasiya 0.78 (optimal: <0.6).",
      suggestions: [
        { action: 'Bond əlavə et', impact: 'Correlation -0.15' },
        { action: 'International stocks', impact: 'Diversification +12%' }
      ]
    },
    "risk azaltmaq üçün nə etməliyəm": {
      text: "Top 3 tövsiyə: 1) Kripto 29.9%-dən 20%-ə endir (Beta -0.18), 2) TSLA 12%-dən 8%-ə azalt (Konsentrasiya riski -40%), 3) 10% bond əlavə et (Max Drawdown -3.2%).",
      suggestions: [
        { action: 'Hamısını icra et', impact: 'Risk Score: +15 bal' },
        { action: 'Yalnız kripto azalt', impact: 'Beta: 1.24 → 1.06' }
      ]
    }
  };
  
  // Find matching response
  const key = Object.keys(responses).find(k => 
    question.toLowerCase().includes(k)
  );
  
  return responses[key] || {
    text: "Sualınızı başa düşdüm. Portfelinizi analiz edirəm... Bu xüsusiyyət tezliklə aktiv olacaq.",
    suggestions: []
  };
};

// Proactive alerts
const proactiveAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'ETH Stop-Loss Yaxınlığı',
    message: 'ETH mövqeyiniz stop-loss səviyyəsinə 1.2% qalıb ($2,050)',
    actions: [
      { label: 'Bağla', type: 'danger' },
      { label: 'Stop-loss qoy', type: 'warning' },
      { label: 'İzlə', type: 'info' }
    ],
    timestamp: Date.now() - 300000 // 5 min ago
  },
  {
    id: 2,
    type: 'opportunity',
    title: 'EUR/USD Alış Fürsəti',
    message: 'Support səviyyəsində (1.0850). Risk/reward 1:3. COT data: institutional long',
    actions: [
      { label: 'Mövqe aç', type: 'success' },
      { label: 'Xəbərdarlıq qoy', type: 'info' }
    ],
    timestamp: Date.now() - 600000 // 10 min ago
  }
];

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Salam! 👋 Mən sizin AI trading asistentinizəm. Portfeliniz haqqında hər hansı sual verə və ya tövsiyələr ala bilərsiniz.',
      timestamp: Date.now() - 60000
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [alerts, setAlerts] = useState(proactiveAlerts);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(inputValue);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.text,
        suggestions: response.suggestions,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleQuickQuestion = (question) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };
  
  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };
  
  const handleAlertAction = (alert, action) => {
    toast.success(`${action.label} əməliyyatı işə salındı`);
    handleDismissAlert(alert.id);
  };
  
  if (!isOpen) {
    return (
      <>
        {/* Floating Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-xl hover:shadow-2xl transition-shadow z-50"
        >
          <Brain className="w-6 h-6" />
          {alerts.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
              {alerts.length}
            </div>
          )}
        </motion.button>
      </>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        height: isMinimized ? 'auto' : '600px'
      }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed bottom-6 right-6 w-96 bg-card-bg border border-border-color rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-color bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">AI Copilot</h3>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <div className="w-2 h-2 rounded-full bg-positive animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-text-secondary" />
              ) : (
                <Minimize2 className="w-4 h-4 text-text-secondary" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="p-3 border-b border-border-color bg-amber-500/5 space-y-2 max-h-40 overflow-y-auto">
              {alerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-card-bg border border-amber-500/20"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-amber-400">{alert.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">{alert.message}</p>
                    </div>
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <X className="w-3 h-3 text-text-secondary" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {alert.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleAlertAction(alert, action)}
                        className={`flex-1 px-2 py-1 rounded text-xs font-bold transition-colors ${
                          action.type === 'danger' ? 'bg-negative/20 text-negative hover:bg-negative/30' :
                          action.type === 'warning' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' :
                          action.type === 'success' ? 'bg-positive/20 text-positive hover:bg-positive/30' :
                          'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/5 text-text-primary'
                } rounded-lg p-3`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center justify-between p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs"
                        >
                          <span className="font-semibold">{suggestion.action}</span>
                          <span className="text-positive">{suggestion.impact}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 border-t border-border-color bg-white/5">
              <p className="text-xs text-text-secondary mb-2">Tez-tez verilən suallar:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input */}
          <div className="p-3 border-t border-border-color">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Sual verin..."
                className="flex-1 px-3 py-2 bg-white/5 border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-3 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AICopilot;
