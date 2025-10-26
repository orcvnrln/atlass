import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Minimize2 } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAI';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { messages, sendMessage } = useAIAssistant();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };
  
  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg hover:bg-accent/80 transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 right-6 bottom-6 w-96 bg-card-bg rounded-xl shadow-2xl border border-border-color z-40 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border-color">
              <h3 className="text-lg font-semibold text-text-primary">AI Co-Pilot</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-border-color rounded-lg transition-colors">
                <Minimize2 className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      msg.type === 'user'
                        ? 'bg-accent text-white'
                        : 'bg-primary-bg text-text-secondary border border-border-color'
                    }`}
                  >
                    <p>{msg.content}</p>
                    {msg.component && <Suspense fallback={<div>Loading...</div>}><div className="mt-2">{msg.component}</div></Suspense>}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border-color">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
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