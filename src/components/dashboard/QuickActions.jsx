import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Shield, XCircle, Zap } from 'lucide-react';

const actions = [
  { label: 'New Trade', icon: PlusCircle, color: 'accent' },
  { label: 'Risk Check', icon: Shield, color: 'secondary' },
  { label: 'AI Signals', icon: Zap, color: 'secondary' },
  { label: 'Emergency Close All', icon: XCircle, color: 'negative' },
];

const QuickActions = ({ onNewMiniChart }) => {
  const getButtonClass = (color) => {
    switch (color) {
      case 'accent':
        return 'bg-accent/20 text-accent hover:bg-accent/30';
      case 'negative':
        return 'bg-negative/20 text-negative hover:bg-negative/30';
      default:
        return 'bg-primary-bg hover:bg-border-color text-text-primary';
    }
  }

  return (
    <motion.div 
        className="bg-card-bg rounded-xl card-padding card-elevation border border-border-color"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
    >
        <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {actions.map(action => (
                <motion.button
                    key={action.label}
                    className={`flex items-center justify-center gap-2 border border-border-color rounded-lg font-bold transition-colors duration-200 text-sm py-3 px-4 ${getButtonClass(action.color)}`}
                    style={{ minHeight: '50px' }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <action.icon size={16} />
                    <span>{action.label}</span>
                </motion.button>
            ))}
            <motion.button
                onClick={onNewMiniChart}
                className={`flex items-center justify-center gap-2 border border-border-color rounded-lg font-bold transition-colors duration-200 text-sm py-3 px-4 bg-primary-bg hover:bg-border-color text-text-primary`}
                style={{ minHeight: '50px' }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
            >
                <PlusCircle size={16} />
                <span>Mini-Chart</span>
            </motion.button>
        </div>
    </motion.div>
  );
};

export default QuickActions;