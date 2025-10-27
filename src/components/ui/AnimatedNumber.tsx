import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isPrice?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 0.8,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 2,
  isPrice = false
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(true);
  
  const spring = useSpring(value, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001 
  });
  
  const display = useTransform(spring, (current) => {
    if (isPrice) {
      return current.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    return current.toFixed(decimals);
  });

  useEffect(() => {
    setIsIncreasing(value > prevValue);
    setPrevValue(value);
    spring.set(value);
  }, [value, spring, prevValue]);

  return (
    <motion.span
      className={`${className} ${isIncreasing ? 'text-green-400' : 'text-red-400'}`}
      animate={{
        scale: [1, 1.05, 1],
        color: isIncreasing ? '#48bb78' : '#f56565'
      }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
