import React from 'react';
import { LayoutGrid, Rows, Columns } from 'lucide-react';

const layouts = [
  { id: '1x1', icon: <LayoutGrid size={20} />, name: 'Single' },
  { id: '2x1', icon: <Columns size={20} />, name: '2 Columns' },
  { id: '1x2', icon: <Rows size={20} />, name: '2 Rows' },
  { id: '2x2', icon: <LayoutGrid size={20} />, name: 'Grid' },
];

const LayoutControls = ({ onLayoutChange, activeLayout }) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-card-bg rounded-lg border border-border-color">
      <span className="text-sm font-semibold text-text-secondary mr-2">Layout:</span>
      {layouts.map((layout) => (
        <button
          key={layout.id}
          onClick={() => onLayoutChange(layout.id)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeLayout === layout.id
              ? 'bg-primary text-white'
              : 'bg-transparent text-text-secondary hover:bg-white/10'
          }`}
        >
          {layout.icon}
          <span>{layout.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LayoutControls;
