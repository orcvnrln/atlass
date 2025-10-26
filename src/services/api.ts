import axios from 'axios';
import { create } from 'zustand';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.tradingplatform.com';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'wss://ws.tradingplatform.com';

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// WebSocket Manager
class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;

  connect(endpoint: string, onMessage: (data: any) => void, onError?: (error: Event) => void): WebSocket {
    const url = `${WS_BASE_URL}${endpoint}`;
    
    if (this.connections.has(endpoint)) {
      return this.connections.get(endpoint)!;
    }

    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log(`WebSocket connected: ${endpoint}`);
      this.reconnectAttempts.set(endpoint, 0);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected: ${endpoint}`);
      this.connections.delete(endpoint);
      this.reconnect(endpoint, onMessage, onError);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${endpoint}`, error);
      onError?.(error);
    };

    this.connections.set(endpoint, ws);
    return ws;
  }

  private reconnect(endpoint: string, onMessage: (data: any) => void, onError?: (error: Event) => void) {
    const attempts = this.reconnectAttempts.get(endpoint) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Reconnecting WebSocket: ${endpoint} (attempt ${attempts + 1})`);
        this.reconnectAttempts.set(endpoint, attempts + 1);
        this.connect(endpoint, onMessage, onError);
      }, Math.pow(2, attempts) * 1000); // Exponential backoff
    }
  }

  disconnect(endpoint: string) {
    const ws = this.connections.get(endpoint);
    if (ws) {
      ws.close();
      this.connections.delete(endpoint);
    }
  }

  disconnectAll() {
    this.connections.forEach((ws) => ws.close());
    this.connections.clear();
  }
}

const wsManager = new WebSocketManager();

// API Services
export const marketDataService = {
  // Get historical data
  getHistoricalData: async (symbol: string, timeframe: string, limit: number = 1000) => {
    try {
      const response = await apiClient.get('/market/historical', {
        params: { symbol, timeframe, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  // Get current price
  getCurrentPrice: async (symbol: string) => {
    try {
      const response = await apiClient.get(`/market/price/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  },

  // Get order book
  getOrderBook: async (symbol: string) => {
    try {
      const response = await apiClient.get(`/market/orderbook/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order book:', error);
      throw error;
    }
  },

  // Subscribe to real-time price updates
  subscribeToPriceUpdates: (symbol: string, onUpdate: (data: any) => void) => {
    return wsManager.connect(`/price/${symbol}`, onUpdate);
  },

  // Subscribe to order flow updates
  subscribeToOrderFlow: (symbol: string, onUpdate: (data: any) => void) => {
    return wsManager.connect(`/orderflow/${symbol}`, onUpdate);
  },
};

export const signalService = {
  // Get AI signals
  getSignals: async (symbol?: string, limit: number = 50) => {
    try {
      const response = await apiClient.get('/signals', {
        params: { symbol, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },

  // Get signal history
  getSignalHistory: async (filters: any = {}) => {
    try {
      const response = await apiClient.get('/signals/history', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching signal history:', error);
      throw error;
    }
  },

  // Subscribe to real-time signals
  subscribeToSignals: (onSignal: (signal: any) => void) => {
    return wsManager.connect('/signals/live', onSignal);
  },
};

export const portfolioService = {
  // Get portfolio positions
  getPositions: async () => {
    try {
      const response = await apiClient.get('/portfolio/positions');
      return response.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  },

  // Get portfolio performance
  getPerformance: async (period: string = '1d') => {
    try {
      const response = await apiClient.get('/portfolio/performance', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching performance:', error);
      throw error;
    }
  },

  // Get risk metrics
  getRiskMetrics: async () => {
    try {
      const response = await apiClient.get('/portfolio/risk');
      return response.data;
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
      throw error;
    }
  },

  // Execute trade
  executeTrade: async (tradeData: any) => {
    try {
      const response = await apiClient.post('/portfolio/trade', tradeData);
      return response.data;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  },
};

export const backtestService = {
  // Run backtest
  runBacktest: async (parameters: any) => {
    try {
      const response = await apiClient.post('/backtest/run', parameters);
      return response.data;
    } catch (error) {
      console.error('Error running backtest:', error);
      throw error;
    }
  },

  // Get backtest results
  getBacktestResults: async (backtestId: string) => {
    try {
      const response = await apiClient.get(`/backtest/results/${backtestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching backtest results:', error);
      throw error;
    }
  },

  // Get backtest history
  getBacktestHistory: async () => {
    try {
      const response = await apiClient.get('/backtest/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching backtest history:', error);
      throw error;
    }
  },
};

export const newsService = {
  // Get news articles
  getNews: async (filters: any = {}) => {
    try {
      const response = await apiClient.get('/news', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Get news sentiment
  getNewsSentiment: async (symbol: string) => {
    try {
      const response = await apiClient.get(`/news/sentiment/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news sentiment:', error);
      throw error;
    }
  },

  // Subscribe to news updates
  subscribeToNews: (onNews: (news: any) => void) => {
    return wsManager.connect('/news/live', onNews);
  },
};

export const correlationService = {
  // Get correlation matrix
  getCorrelationMatrix: async (symbols: string[]) => {
    try {
      const response = await apiClient.post('/correlation/matrix', { symbols });
      return response.data;
    } catch (error) {
      console.error('Error fetching correlation matrix:', error);
      throw error;
    }
  },

  // Subscribe to correlation updates
  subscribeToCorrelations: (symbols: string[], onUpdate: (data: any) => void) => {
    return wsManager.connect(`/correlation/${symbols.join(',')}`, onUpdate);
  },
};

// Error handling utilities
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. Insufficient permissions.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data?.message || 'An error occurred.';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

// Connection status store
export const useConnectionStore = create((set) => ({
  isConnected: false,
  connectionStatus: 'disconnected',
  lastUpdate: null,
  
  setConnected: (status: boolean) => set({ isConnected: status }),
  setConnectionStatus: (status: string) => set({ connectionStatus: status }),
  setLastUpdate: (timestamp: number) => set({ lastUpdate: timestamp }),
}));

// Cleanup function
export const cleanup = () => {
  wsManager.disconnectAll();
};

export default {
  marketDataService,
  signalService,
  portfolioService,
  backtestService,
  newsService,
  correlationService,
  handleApiError,
  cleanup,
};
