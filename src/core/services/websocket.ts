/**
 * 📡 WEBSOCKET SERVICE
 * Real-time market data stream
 * Binance WebSocket API integration
 */

import { useTradingStore, Candle } from '../state/store';
import { eventBus } from '../events/eventBus';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface BinanceKline {
  t: number; // Kline start time
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  c: string; // Close price
  v: string; // Volume
  x: boolean; // Is this kline closed?
}

interface BinanceMessage {
  e: string; // Event type
  s: string; // Symbol
  k?: BinanceKline; // Kline data
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSOCKET MANAGER
// ─────────────────────────────────────────────────────────────────────────────

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private pingInterval: NodeJS.Timeout | null = null;
  private currentSymbol: string = '';
  private currentTimeframe: string = '';

  /**
   * WebSocket bağlantısını başlat
   */
  connect(symbol: string, timeframe: string): void {
    this.currentSymbol = symbol.toLowerCase();
    this.currentTimeframe = this.mapTimeframe(timeframe);

    const url = `wss://stream.binance.com:9443/ws/${this.currentSymbol}@kline_${this.currentTimeframe}`;

    console.log(`[WebSocket] Connecting to ${url}`);

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        this.stopPing();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      this.attemptReconnect();
    }
  }

  /**
   * WebSocket bağlantısını kəs
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopPing();
  }

  /**
   * Yeni symbol-a subscribe ol
   */
  subscribe(symbol: string, timeframe: string): void {
    this.disconnect();
    this.connect(symbol, timeframe);
  }

  /**
   * Mesajı işlə
   */
  private handleMessage(data: string): void {
    try {
      const message: BinanceMessage = JSON.parse(data);

      if (message.e === 'kline' && message.k) {
        const kline = message.k;
        const candle: Candle = {
          timestamp: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        };

        // Update current price
        useTradingStore.getState().updatePrice(candle.close);

        // Update candles (if kline is closed)
        if (kline.x) {
          const currentCandles = useTradingStore.getState().candles;
          const updatedCandles = [...currentCandles, candle].slice(-500); // Keep last 500
          useTradingStore.getState().updateCandles(updatedCandles);
        }
      }
    } catch (error) {
      console.error('[WebSocket] Message parse error:', error);
    }
  }

  /**
   * Reconnect cəhdi
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.currentSymbol, this.currentTimeframe);
    }, delay);
  }

  /**
   * Ping/Pong (keep-alive)
   */
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ method: 'ping' }));
      }
    }, 30000); // 30 saniyədə bir
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Timeframe mapping (Binance format)
   */
  private mapTimeframe(timeframe: string): string {
    const map: Record<string, string> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
    };
    return map[timeframe] || '15m';
  }

  /**
   * Connection status
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();

// ─────────────────────────────────────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Symbol dəyişəndə WebSocket-i yenidən subscribe et
 */
eventBus.on('SYMBOL_CHANGED', ({ payload }) => {
  const { timeframe } = useTradingStore.getState();
  console.log(`[WebSocket] Symbol changed to ${payload.symbol}, resubscribing...`);
  wsManager.subscribe(payload.symbol, timeframe);

  // Clear old candles
  useTradingStore.getState().updateCandles([]);
  useTradingStore.getState().setLoading(true);

  // Clear AI signals (köhnə symbol üçün)
  useTradingStore.getState().clearSignals();
  useTradingStore.getState().clearOverlays('AI');
});

/**
 * Timeframe dəyişəndə WebSocket-i yenidən subscribe et
 */
eventBus.on('TIMEFRAME_CHANGED', ({ payload }) => {
  const { symbol } = useTradingStore.getState();
  console.log(`[WebSocket] Timeframe changed to ${payload.timeframe}, resubscribing...`);
  wsManager.subscribe(symbol, payload.timeframe);

  // Clear old candles
  useTradingStore.getState().updateCandles([]);
  useTradingStore.getState().setLoading(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// HISTORICAL DATA FETCH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * İlk yükləmə üçün historical data çək
 */
export async function fetchHistoricalData(
  symbol: string,
  timeframe: string,
  limit: number = 500
): Promise<Candle[]> {
  const interval = wsManager['mapTimeframe'](timeframe);
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const candles: Candle[] = data.map((k: any) => ({
      timestamp: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    useTradingStore.getState().updateCandles(candles);
    useTradingStore.getState().setLoading(false);

    return candles;
  } catch (error) {
    console.error('[WebSocket] Historical data fetch error:', error);
    useTradingStore.getState().setLoading(false);
    return [];
  }
}

