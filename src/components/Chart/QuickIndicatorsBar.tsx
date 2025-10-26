import React from 'react';
import { EventBus } from '../../core/eventBus';
import { SlidersHorizontal } from 'lucide-react';

const indicators: { key: 'MA' | 'RSI' | 'VOLUME' | 'VWAP' | 'LIQUIDITY'; label: string }[] = [
  { key: 'MA', label: 'MA' },
  { key: 'RSI', label: 'RSI' },
  { key: 'VOLUME', label: 'Vol' },
  { key: 'VWAP', label: 'VWAP' },
  { key: 'LIQUIDITY', label: 'Liquidity' },
];

export default function QuickIndicatorsBar({ symbol }: { symbol: string }) {
  return (
    <div className="flex items-center gap-2 p-2 border-t border-border bg-card/50">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <SlidersHorizontal className="w-3 h-3" />
        Quick Indicators
      </div>
      {indicators.map((i) => (
        <button
          key={i.key}
          onClick={() => EventBus.emit('chart:addIndicator', { symbol, indicator: i.key })}
          className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 border border-border text-foreground"
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}

