import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

const TabsContext = createContext();

const Tabs = ({ value, onValueChange, children, className = '' }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className = '', children }) => {
  return (
    <div className={`flex ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, className = '', children }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-accent text-white border-b-2 border-accent'
          : 'text-text-on-card-secondary hover:text-text-on-card-primary hover:bg-accent/10'
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className = '', children }) => {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (selectedValue !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };