import React from 'react';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, change, isCurrency = true, positive }) => (
  <motion.div
    className={`card-elevation rounded-xl card-padding flex flex-col justify-between bg-card-bg border border-border-on-card ${positive ? 'card-hover-glow' : 'card-hover-glow-negative'} card-click-glow`}
    style={{ minHeight: '180px' }}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <div>
      <p className="text-lg font-semibold text-text-on-card-secondary mb-2">{title}</p>
    </div>
    <div>
      <p className={`text-3xl font-bold font-mono mb-2 ${positive ? 'positive' : 'negative'}`}>
        {isCurrency && '$'}{value}
      </p>
      <p className={`text-base font-semibold ${positive ? 'positive' : 'negative'}`}>
        {change}
      </p>
    </div>
  </motion.div>
);

export default KpiCard;
