import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Card = ({ title, children, className = '' }) => {
  return (
    <motion.div
      className={`card-elevation bg-card-bg p-4 sm:p-6 rounded-xl shadow-lg ${className}`}
      variants={cardVariants}
    >
      {title && <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>}
      <div>{children}</div>
    </motion.div>
  );
};

export default Card;
