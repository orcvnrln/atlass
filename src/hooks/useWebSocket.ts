import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { marketDataService, signalService, newsService, correlationService } from '../services/api';
import { 
  updateCandles, 
  updateOrderFlow, 
  updateCurrentPrice 
} from '../store/slices/chartSlice';
import { 
  addSignal, 
  updateCurrentSignal 
} from '../store/slices/signalSlice';
import { 
  updateNews, 
  updateNewsSentiment 
} from '../store/slices/newsSlice';
import { 
  updateCorrelationMatrix 
} from '../store/slices/correlationSlice';

interface UseWebSocketOptions {
  symbol?: string;
  timeframe?: string;
  enablePriceUpdates?: boolean;
  enableOrderFlow?: boolean;
  enableSignals?: boolean;
  enableNews?: boolean;
  enableCorrelations?: boolean;
  symbols?: string[];
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    symbol = 'BTC-USD',
    timeframe = '1h',
    enablePriceUpdates = true,
    enableOrderFlow = true,
    enableSignals = true,
    enableNews = true,
    enableCorrelations = true,
    symbols = ['BTC-USD', 'ETH-USD', 'EUR-USD', 'SPY']
  } = options;

  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const connectionsRef = useRef<Map<string, WebSocket>>(new Map());
  const reconnectTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const reconnectAttemptsRef = useRef<Map<string, number>>(new Map());

  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  const cleanup = useCallback(() => {
    // Clear all reconnection timeouts
    reconnectTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    reconnectTimeoutsRef.current.clear();
    
    // Close all connections
    connectionsRef.current.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    connectionsRef.current.clear();
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const connect = useCallback((endpoint: string, onMessage: (data: any) => void) => {
    const wsUrl = `wss://ws.tradingplatform.com${endpoint}`;
    
    // Close existing connection if any
    const existingConnection = connectionsRef.current.get(endpoint);
    if (existingConnection) {
      existingConnection.close();
    }

    const ws = new WebSocket(wsUrl);
    connectionsRef.current.set(endpoint, ws);

    ws.onopen = () => {
      console.log(`WebSocket connected: ${endpoint}`);
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      
      // Reset reconnect attempts on successful connection
      reconnectAttemptsRef.current.set(endpoint, 0);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
        setLastUpdate(Date.now());
      } catch (err) {
        console.error('WebSocket message parse error:', err);
        setError('Failed to parse incoming data');
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket disconnected: ${endpoint}`, event.code, event.reason);
      connectionsRef.current.delete(endpoint);
      
      if (event.code !== 1000) { // Not a normal closure
        setConnectionStatus('reconnecting');
        attemptReconnect(endpoint, onMessage);
      } else {
        setConnectionStatus('disconnected');
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${endpoint}`, error);
      setError('WebSocket connection error');
      setConnectionStatus('error');
    };

    return ws;
  }, []);

  const attemptReconnect = useCallback((endpoint: string, onMessage: (data: any) => void) => {
    const attempts = reconnectAttemptsRef.current.get(endpoint) || 0;
    
    if (attempts < maxReconnectAttempts) {
      const delay = baseReconnectDelay * Math.pow(2, attempts);
      console.log(`Reconnecting ${endpoint} in ${delay}ms (attempt ${attempts + 1})`);
      
      const timeout = setTimeout(() => {
        reconnectAttemptsRef.current.set(endpoint, attempts + 1);
        connect(endpoint, onMessage);
      }, delay);
      
      reconnectTimeoutsRef.current.set(endpoint, timeout);
    } else {
      console.error(`Max reconnection attempts reached for ${endpoint}`);
      setError('Connection failed after multiple attempts');
      setConnectionStatus('failed');
    }
  }, [connect]);

  // Price updates handler
  const handlePriceUpdate = useCallback((data: any) => {
    if (data.symbol === symbol) {
      dispatch(updateCurrentPrice({
        price: data.price,
        timestamp: data.timestamp,
        volume: data.volume
      }));
      
      // Update candles if we have OHLCV data
      if (data.ohlcv) {
        dispatch(updateCandles({
          symbol: data.symbol,
          timeframe: data.timeframe,
          candles: [data.ohlcv]
        }));
      }
    }
  }, [dispatch, symbol]);

  // Order flow updates handler
  const handleOrderFlowUpdate = useCallback((data: any) => {
    if (data.symbol === symbol) {
      dispatch(updateOrderFlow({
        symbol: data.symbol,
        orderFlow: data.orderFlow
      }));
    }
  }, [dispatch, symbol]);

  // Signal updates handler
  const handleSignalUpdate = useCallback((data: any) => {
    if (data.symbol === symbol) {
      if (data.isNew) {
        dispatch(addSignal(data.signal));
      } else {
        dispatch(updateCurrentSignal(data.signal));
      }
    }
  }, [dispatch, symbol]);

  // News updates handler
  const handleNewsUpdate = useCallback((data: any) => {
    dispatch(updateNews(data.news));
    if (data.sentiment) {
      dispatch(updateNewsSentiment({
        symbol: data.symbol,
        sentiment: data.sentiment
      }));
    }
  }, [dispatch]);

  // Correlation updates handler
  const handleCorrelationUpdate = useCallback((data: any) => {
    dispatch(updateCorrelationMatrix(data.correlations));
  }, [dispatch]);

  // Initialize connections
  useEffect(() => {
    if (enablePriceUpdates) {
      connect(`/price/${symbol}`, handlePriceUpdate);
    }

    if (enableOrderFlow) {
      connect(`/orderflow/${symbol}`, handleOrderFlowUpdate);
    }

    if (enableSignals) {
      connect('/signals/live', handleSignalUpdate);
    }

    if (enableNews) {
      connect('/news/live', handleNewsUpdate);
    }

    if (enableCorrelations && symbols.length > 0) {
      connect(`/correlation/${symbols.join(',')}`, handleCorrelationUpdate);
    }

    return cleanup;
  }, [
    symbol,
    enablePriceUpdates,
    enableOrderFlow,
    enableSignals,
    enableNews,
    enableCorrelations,
    symbols,
    connect,
    handlePriceUpdate,
    handleOrderFlowUpdate,
    handleSignalUpdate,
    handleNewsUpdate,
    handleCorrelationUpdate,
    cleanup
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isConnected,
    connectionStatus,
    lastUpdate,
    error,
    reconnect: () => {
      cleanup();
      // Reconnect after a short delay
      setTimeout(() => {
        if (enablePriceUpdates) {
          connect(`/price/${symbol}`, handlePriceUpdate);
        }
        if (enableOrderFlow) {
          connect(`/orderflow/${symbol}`, handleOrderFlowUpdate);
        }
        if (enableSignals) {
          connect('/signals/live', handleSignalUpdate);
        }
        if (enableNews) {
          connect('/news/live', handleNewsUpdate);
        }
        if (enableCorrelations && symbols.length > 0) {
          connect(`/correlation/${symbols.join(',')}`, handleCorrelationUpdate);
        }
      }, 1000);
    }
  };
};

// Hook for market data
export const useMarketData = (symbol: string, timeframe: string = '1h') => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = useCallback(async (limit: number = 1000) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await marketDataService.getHistoricalData(symbol, timeframe, limit);
      dispatch(updateCandles({
        symbol,
        timeframe,
        candles: data.candles
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  }, [dispatch, symbol, timeframe]);

  const fetchCurrentPrice = useCallback(async () => {
    try {
      const data = await marketDataService.getCurrentPrice(symbol);
      dispatch(updateCurrentPrice({
        price: data.price,
        timestamp: data.timestamp,
        volume: data.volume
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current price');
    }
  }, [dispatch, symbol]);

  const fetchOrderBook = useCallback(async () => {
    try {
      const data = await marketDataService.getOrderBook(symbol);
      dispatch(updateOrderFlow({
        symbol,
        orderFlow: data
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order book');
    }
  }, [dispatch, symbol]);

  return {
    loading,
    error,
    fetchHistoricalData,
    fetchCurrentPrice,
    fetchOrderBook
  };
};

// Hook for signals
export const useSignals = (symbol?: string) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = useCallback(async (limit: number = 50) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await signalService.getSignals(symbol, limit);
      data.signals.forEach((signal: any) => {
        dispatch(addSignal(signal));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  }, [dispatch, symbol]);

  const fetchSignalHistory = useCallback(async (filters: any = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await signalService.getSignalHistory(filters);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch signal history');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchSignals,
    fetchSignalHistory
  };
};

export default useWebSocket;
