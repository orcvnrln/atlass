import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI trading assistant. I can help you analyze markets, explain indicators, and provide trading insights. What would you like to know?'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: 'I\'m still learning! This AI assistant feature is coming soon with full market analysis capabilities. 🚀'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    toast({
      title: "🚧 AI Assistant Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#4C6EF5] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6366F1] transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-16 right-6 bottom-6 w-96 bg-[#121825] rounded-xl shadow-2xl border border-[#374151] z-40 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#374151]">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#4C6EF5]/10 rounded-lg">
                  <Bot className="w-5 h-5 text-[#4C6EF5]" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Co-Pilot</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#374151] rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-[#4C6EF5] text-white'
                        : 'bg-[#0A0E17] text-[#9CA3AF] border border-[#374151]'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#374151]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about markets..."
                  className="flex-1 px-3 py-2 bg-[#0A0E17] border border-[#374151] rounded-lg text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#4C6EF5]"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-[#4C6EF5] rounded-lg hover:bg-[#6366F1] transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;