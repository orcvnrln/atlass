import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SummaryCard = ({ icon: Icon, title, value, pnl, pnlPercent, isCurrency = true, positive }) => (
  <motion.div 
    className="bg-card-bg p-4 rounded-xl card-elevation"
    variants={cardVariants}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-primary-bg rounded-lg">
        <Icon className="w-5 h-5 text-accent-orange" />
      </div>
      {pnlPercent !== undefined && (
        <span className={`text-xs font-medium ${positive ? 'text-accent-green' : 'text-accent-red'}`}>
          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
        </span>
      )}
    </div>
    <p className="text-sm text-text-secondary">{title}</p>
    <p className="text-2xl font-bold monospace text-text-primary">
      {isCurrency ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : value}
    </p>
    {pnl !== undefined && (
      <p className={`text-sm monospace ${positive ? 'text-accent-green' : 'text-accent-red'}`}>
        {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Today
      </p>
    )}
  </motion.div>
);

export default SummaryCard;
