import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border-color">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 p-3 text-sm font-medium transition-colors ${
              activeTab === index
                ? 'text-white border-b-2 border-accent'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
