import React from 'react';
import { motion } from 'framer-motion';

const MacroKpiCard = ({ title, value, change, positive, icon }) => (
  <motion.div
    className={`bg-card-bg rounded-xl p-4 flex flex-col justify-between border border-border-color`}
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center justify-between text-text-secondary mb-2">
      <p className="text-sm font-medium">{title}</p>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
      <p className={`text-sm font-semibold ${positive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  </motion.div>
);

export default MacroKpiCard;
