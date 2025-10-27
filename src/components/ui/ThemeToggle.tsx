import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full p-1 transition-colors duration-300
        ${isDark ? 'bg-slate-700' : 'bg-blue-200'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`
          w-5 h-5 rounded-full flex items-center justify-center
          ${isDark ? 'bg-slate-900' : 'bg-white'}
          shadow-lg
        `}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <motion.div
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 180,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Moon size={12} className="text-blue-400" />
        </motion.div>
        
        <motion.div
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sun size={12} className="text-yellow-500" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
