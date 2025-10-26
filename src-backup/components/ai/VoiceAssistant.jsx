import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VoiceAssistant = () => {
  const handleVoiceActivation = useCallback(() => {
    toast({
      title: "🎙️ Voice Assistant Activated",
      description: "How can I help you today? (Triggered by shortcut)",
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        handleVoiceActivation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    toast({
      title: "Pro Tip!",
      description: "Use Ctrl + M to activate the Voice Assistant.",
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleVoiceActivation]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
    >
      <button
        onClick={handleVoiceActivation}
        className="bg-primary rounded-full p-4 text-white shadow-lg hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-110"
        aria-label="Activate Voice Assistant"
      >
        <Mic size={24} />
      </button>
    </motion.div>
  );
};

export default VoiceAssistant;
