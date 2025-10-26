/**
 * 🔄 EVENT BUS
 * State dəyişikliklərini dinləyir və side effect-lər trigger edir
 * Bloomberg Terminal tərzi event orchestration
 */

import { useTradingStore } from '../state/store';

// ─────────────────────────────────────────────────────────────────────────────
// EVENT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type TradingEvent =
  | { type: 'SYMBOL_CHANGED'; payload: { symbol: string; timestamp: number } }
  | { type: 'TIMEFRAME_CHANGED'; payload: { timeframe: string; timestamp: number } }
  | { type: 'PRICE_UPDATED'; payload: { price: number; timestamp: number } }
  | { type: 'AI_SIGNAL_GENERATED'; payload: { signalId: string; timestamp: number } }
  | { type: 'ORDER_PLACED'; payload: { orderId: string; timestamp: number } }
  | { type: 'POSITION_OPENED'; payload: { positionId: string; timestamp: number } }
  | { type: 'POSITION_CLOSED'; payload: { positionId: string; timestamp: number } };

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

type EventHandler = (event: TradingEvent) => void | Promise<void>;

class EventBus {
  private handlers: Map<TradingEvent['type'], Set<EventHandler>> = new Map();
  private eventLog: TradingEvent[] = [];
  private maxLogSize = 1000;

  /**
   * Event-ə subscribe ol
   */
  on(eventType: TradingEvent['type'], handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // Unsubscribe funksiyası
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Event emit et
   */
  async emit(event: TradingEvent): Promise<void> {
    // Log event
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    // Trigger handlers
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    const promises = Array.from(handlers).map((handler) => {
      try {
        return handler(event);
      } catch (error) {
        console.error(`[EventBus] Handler error for ${event.type}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Event log-u əldə et (debugging üçün)
   */
  getEventLog(): TradingEvent[] {
    return [...this.eventLog];
  }

  /**
   * Event log-u təmizlə
   */
  clearEventLog(): void {
    this.eventLog = [];
  }
}

export const eventBus = new EventBus();

// ─────────────────────────────────────────────────────────────────────────────
// STATE SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Zustand state dəyişikliklərini dinləyir və event-lər emit edir
 */
export function initializeEventBus() {
  const store = useTradingStore;

  // Symbol dəyişəndə
  store.subscribe(
    (state) => state.symbol,
    (symbol, prevSymbol) => {
      if (symbol !== prevSymbol) {
        eventBus.emit({
          type: 'SYMBOL_CHANGED',
          payload: { symbol, timestamp: Date.now() },
        });
      }
    }
  );

  // Timeframe dəyişəndə
  store.subscribe(
    (state) => state.timeframe,
    (timeframe, prevTimeframe) => {
      if (timeframe !== prevTimeframe) {
        eventBus.emit({
          type: 'TIMEFRAME_CHANGED',
          payload: { timeframe, timestamp: Date.now() },
        });
      }
    }
  );

  // Price update
  store.subscribe(
    (state) => state.currentPrice,
    (price) => {
      if (price > 0) {
        eventBus.emit({
          type: 'PRICE_UPDATED',
          payload: { price, timestamp: Date.now() },
        });
      }
    }
  );

  // AI signal əlavə olanda
  store.subscribe(
    (state) => state.signals.length,
    () => {
      const signals = store.getState().signals;
      const lastSignal = signals[signals.length - 1];
      if (lastSignal) {
        eventBus.emit({
          type: 'AI_SIGNAL_GENERATED',
          payload: { signalId: lastSignal.id, timestamp: Date.now() },
        });
      }
    }
  );

  // Order əlavə olanda
  store.subscribe(
    (state) => state.orders.length,
    () => {
      const orders = store.getState().orders;
      const lastOrder = orders[orders.length - 1];
      if (lastOrder) {
        eventBus.emit({
          type: 'ORDER_PLACED',
          payload: { orderId: lastOrder.id, timestamp: Date.now() },
        });
      }
    }
  );

  // Position açılanda
  store.subscribe(
    (state) => state.positions.length,
    (newLength, prevLength) => {
      if (newLength > prevLength) {
        const positions = store.getState().positions;
        const lastPosition = positions[positions.length - 1];
        if (lastPosition) {
          eventBus.emit({
            type: 'POSITION_OPENED',
            payload: { positionId: lastPosition.id, timestamp: Date.now() },
          });
        }
      }
    }
  );

  console.log('[EventBus] Initialized and subscribed to state changes');
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Debounced Event Emitter
// ─────────────────────────────────────────────────────────────────────────────

export function createDebouncedEmitter(
  eventType: TradingEvent['type'],
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (payload: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      eventBus.emit({ type: eventType, payload } as TradingEvent);
    }, delay);
  };
}

