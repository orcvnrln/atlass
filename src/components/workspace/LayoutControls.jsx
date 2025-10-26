import React from 'react';
import { LayoutGrid, Rows, Columns, RotateCcw } from 'lucide-react';

const layouts = [
  { id: '1x1', icon: <LayoutGrid size={20} />, name: 'Single' },
  { id: '2x1', icon: <Columns size={20} />, name: '2 Columns' },
  { id: '1x2', icon: <Rows size={20} />, name: '2 Rows' },
  { id: '2x2', icon: <LayoutGrid size={20} />, name: 'Grid', disabled: true },
];

const LayoutControls = ({ onLayoutChange, onLayoutReset, activeLayout }) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-card-bg rounded-lg border border-border-color">
      <span className="text-sm font-semibold text-text-secondary mr-2">Layout:</span>
      {layouts.map((layout) => (
        <button
          key={layout.id}
          onClick={() => !layout.disabled && onLayoutChange(layout.id)}
          disabled={layout.disabled}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeLayout === layout.id
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-text-secondary hover:bg-white/10'
          } ${layout.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {layout.icon}
          <span>{layout.name}</span>
        </button>
      ))}
      <button
        onClick={onLayoutReset}
        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-transparent text-text-secondary hover:bg-white/10"
      >
        <RotateCcw size={16} />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default LayoutControls;
