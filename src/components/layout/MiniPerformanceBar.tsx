import React, { useMemo } from 'react';
import { Brain, Activity } from 'lucide-react';
import { useTradingStore } from '../../core/state/store';

export default function MiniPerformanceBar() {
  const positions = useTradingStore((s) => s.positions);
  const isThinking = useTradingStore((s) => s.isThinking);
  const currentPrice = useTradingStore((s) => s.currentPrice);

  const { equity, pnl, exposure } = useMemo(() => {
    const pnl = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    const exposure = positions.reduce((sum, p) => sum + Math.abs(p.quantity * (p.currentPrice || currentPrice || 0)), 0);
    const equity = 100000 + pnl; // placeholder base equity
    return { equity, pnl, exposure };
  }, [positions, currentPrice]);

  return (
    <div className="flex items-center gap-3 text-xs bg-card/50 rounded px-3 py-2 border border-border">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Equity</span>
        <span className="font-mono">${equity.toFixed(0)}</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className={`flex items-center gap-1 ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        <span>PnL</span>
        <span className="font-mono">{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1 text-muted-foreground">
        <span>Exposure</span>
        <span className="font-mono">${(exposure/1000).toFixed(1)}k</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1 text-muted-foreground">
        <Brain className={`w-3 h-3 ${isThinking ? 'text-accent animate-pulse' : ''}`} />
        <span>AI</span>
        <Activity className={`w-3 h-3 ${isThinking ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
      </div>
    </div>
  );
}

