import React from 'react';
import { motion } from 'framer-motion';

const OrderBookRow = ({ price, size, type, maxTotal }) => {
  const barWidth = (size / maxTotal) * 100;

  return (
    <motion.div
      className={`flex justify-between items-center text-xs px-1 py-0.5 relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`absolute top-0 bottom-0 ${type === 'ask' ? 'right-0 bg-red-500 bg-opacity-20' : 'left-0 bg-green-500 bg-opacity-20'}`}
        style={{ width: `${barWidth}%` }}
      ></div>
      <span className={type === 'ask' ? 'text-red-400' : 'text-green-400'}>{price}</span>
      <span>{size}</span>
    </motion.div>
  );
};

export default OrderBookRow;
