import React from 'react';
import { motion } from 'framer-motion';

interface PulseIndicatorProps {
  isActive?: boolean;
  color?: 'green' | 'blue' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PulseIndicator: React.FC<PulseIndicatorProps> = ({
  isActive = true,
  color = 'green',
  size = 'sm',
  className = ''
}) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}
        animate={isActive ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-full ${colorClasses[color]} opacity-30`}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default PulseIndicator;
