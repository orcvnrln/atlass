import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const FavoriteButton = ({ symbol, isFavorite, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(symbol);
      }}
      className={`p-1 rounded-full transition-colors ${
        isFavorite 
          ? 'text-yellow-400 hover:text-yellow-300' 
          : 'text-gray-400 hover:text-yellow-400'
      }`}
    >
      <Star 
        size={16} 
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </motion.button>
  );
};

export default FavoriteButton;
