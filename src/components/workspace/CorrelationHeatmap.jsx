import React from 'react';

const GroupSelector = ({ groups, activeGroup, onGroupChange }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-6">
    {Object.keys(groups).map((key) => (
      <button
        key={key}
        onClick={() => onGroupChange(key)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-[#1e293b] shadow ${
          activeGroup === key
            ? 'bg-[#3b82f6] text-white shadow-lg'
            : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
        }`}
      >
        {key.toUpperCase()}
      </button>
    ))}
  </div>
);

const HeatmapCell = ({ value, isActive, onClick, rowLabel, colLabel }) => {
  const abs = Math.abs(value);
  const positive = value >= 0;

  const colorScale = () => {
    if (abs >= 0.8) return positive ? 'bg-green-600/90' : 'bg-red-600/90';
    if (abs >= 0.5) return positive ? 'bg-green-600/70' : 'bg-red-600/70';
    if (abs >= 0.3) return positive ? 'bg-green-500/50' : 'bg-red-500/50';
    if (abs >= 0.1) return positive ? 'bg-green-500/30' : 'bg-red-500/30';
    return 'bg-slate-800/60';
  };

  return (
    <button
      onClick={onClick}
      className={`relative h-16 w-16 rounded-md transition-transform border border-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] ${
        isActive ? 'ring-2 ring-[#38bdf8] scale-[1.03]' : 'hover:scale-[1.02]'
      } ${colorScale()}`}
      aria-label={`${rowLabel} vs ${colLabel} correlation ${value.toFixed(2)}`}
    >
      <span className="text-xs font-semibold text-white/90">
        {value.toFixed(2)}
      </span>
      <div className="absolute inset-x-0 bottom-1 text-[10px] text-white/60 font-mono">
        {positive ? 'POS' : 'NEG'}
      </div>
    </button>
  );
};

const CorrelationHeatmap = ({
  groups,
  activeGroup,
  onGroupChange,
  matrixData,
  selectedPair,
  onSelectPair,
}) => {
  const { pairs, values } = matrixData;

  return (
    <div className="max-w-6xl mx-auto">
      <GroupSelector groups={groups} activeGroup={activeGroup} onGroupChange={onGroupChange} />

      <div className="relative overflow-x-auto rounded-xl border border-[#1e293b] bg-[#111827]/80 p-4">
        <div className="grid" style={{ gridTemplateColumns: `auto repeat(${pairs.length}, minmax(3.5rem, 1fr))` }}>
          <div />
          {pairs.map((pair) => (
            <div key={`header-${pair}`} className="h-16 flex items-center justify-center">
              <span className="text-xs font-semibold text-[#94a3b8]">{pair}</span>
            </div>
          ))}

          {pairs.map((rowPair, rowIdx) => (
            <React.Fragment key={rowPair}>
              <div className="flex items-center justify-end pr-3 text-xs font-semibold text-[#94a3b8]">
                {rowPair}
              </div>
              {values[rowIdx].map((value, colIdx) => (
                <HeatmapCell
                  key={`${rowPair}-${pairs[colIdx]}`}
                  value={value}
                  rowLabel={rowPair}
                  colLabel={pairs[colIdx]}
                  isActive={selectedPair === rowPair || selectedPair === pairs[colIdx]}
                  onClick={() => onSelectPair(pairs[colIdx])}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <footer className="mt-6 text-center text-xs text-[#94a3b8]">
        Tap any cell to route into Institutional Cockpit • Data is mock for design preview
      </footer>
    </div>
  );
};

export default CorrelationHeatmap;

