import { useState, useEffect } from 'react';
import { aiInsights } from '@/data/aiInsights';
import { getAssetData } from '@/data/marketData';
import AITradingSignalTab from '@/components/layout/market/AITradingSignalTab';

export const useAIInsights = () => {
  const [currentInsight, setCurrentInsight] = useState(aiInsights[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight(aiInsights[Math.floor(Math.random() * aiInsights.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { currentInsight };
};

export const useAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI trading assistant. Ask me to "analyze [symbol]" or "explain RSI".'
    }
  ]);

  const sendMessage = (message) => {
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.startsWith('analyze ')) {
        const symbol = lowerInput.replace('analyze ', '').toUpperCase();
        const asset = getAssetData(symbol);
        if (asset) {
          return {
              type: 'ai',
              content: `Here is a summary for ${asset.symbol}:\n- Price: ${asset.price}\n- Change: ${asset.change.toFixed(2)} (${asset.percent.toFixed(2)}%)\n- Outlook: This is a sample analysis. A real one would include technical indicators and recent news.`
          };
        } else {
          return {
            type: 'ai',
            content: `Sorry, I could not find any data for the symbol ${symbol}.`
          }
        }
    }

    if (lowerInput.includes('explain rsi')) {
        return {
            type: 'ai',
            content: 'The Relative Strength Index (RSI) is a momentum indicator that measures the speed and change of price movements. RSI values range from 0 to 100. Traditionally, RSI is considered overbought when above 70 and oversold when below 30.'
        };
    }

    return {
        type: 'ai',
        content: 'I can analyze assets (e.g., "analyze AAPL") or explain concepts (e.g., "explain RSI"). How can I help?'
    };
  };

  return { messages, sendMessage };
};
