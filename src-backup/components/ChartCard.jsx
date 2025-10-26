import React from 'react';
import { Info } from 'lucide-react';

const ChartCard = ({ title, tooltipText, children }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-200">{title}</h3>
        {tooltipText && (
          <div className="relative group">
            <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
            <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-800 text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700 shadow-lg">
              {tooltipText}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 w-full h-full min-h-[250px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
