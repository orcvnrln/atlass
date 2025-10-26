// Lightweight Event Bus using browser EventTarget for pub/sub across modules
// Acts like a WebSocket Event Bus interface (can be wired to real WS later)

export type EventMap = {
  'ai:thinking': { active: boolean };
  'ai:signal': { symbol: string; type: string; payload?: any };
  'chart:addIndicator': { symbol: string; indicator: 'MA' | 'RSI' | 'VOLUME' | 'VWAP' | 'LIQUIDITY' };
  'risk:update': { positionSize?: number; riskPct?: number };
  'order:placed': { symbol: string; side: 'BUY' | 'SELL'; qty: number; price?: number };
};

class TypedEventBus {
  private target = new EventTarget();

  on<K extends keyof EventMap>(type: K, handler: (detail: EventMap[K]) => void) {
    const listener = ((e: Event) => handler((e as CustomEvent).detail)) as EventListener;
    this.target.addEventListener(type as string, listener);
    return () => this.target.removeEventListener(type as string, listener);
  }

  emit<K extends keyof EventMap>(type: K, detail: EventMap[K]) {
    this.target.dispatchEvent(new CustomEvent(type as string, { detail }));
  }
}

export const EventBus = new TypedEventBus();

// Example: wire to real WebSocket later
// export function connectWebSocket(url: string) { /* ... */ }

