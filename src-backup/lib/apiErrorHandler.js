/**
 * API Error Handling Utilities
 * Provides enhanced error handling for API requests with retry, offline support, and user feedback
 */

import { handleAPIError, handleNetworkError, withRetry } from './errorHandler';

// Enhanced fetch with error handling
export const apiRequest = async (url, options = {}, config = {}) => {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    showToast = true,
    silent = false
  } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    signal: controller.signal,
    ...options
  };

  try {
    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);

    // Handle HTTP error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      const error = {
        response: {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        },
        request: { url, options: requestOptions },
        config
      };

      throw error;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle different types of errors
    if (error.name === 'AbortError') {
      const timeoutError = {
        type: 'TIMEOUT_ERROR',
        message: `Request timed out after ${timeout}ms`,
        originalError: error
      };
      
      handleAPIError(timeoutError, { url, timeout });
      
      if (showToast && !silent) {
        window.showToast?.({
          type: 'error',
          title: 'Request Timeout',
          message: 'The request took too long to complete. Please try again.',
          duration: 5000
        });
      }
      
      throw timeoutError;
    }

    if (!navigator.onLine) {
      const offlineError = {
        type: 'OFFLINE_ERROR',
        message: 'You are currently offline. Please check your connection.',
        originalError: error
      };
      
      handleNetworkError(offlineError, { url });
      
      if (showToast && !silent) {
        window.showToast?.({
          type: 'offline',
          title: 'Offline',
          message: 'Please check your internet connection and try again.',
          duration: 0 // Don't auto-hide offline messages
        });
      }
      
      throw offlineError;
    }

    // Handle fetch errors (network issues)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      handleNetworkError(error, { url });
      
      if (showToast && !silent) {
        window.showToast?.({
          type: 'error',
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your connection.',
          duration: 5000
        });
      }
      
      throw error;
    }

    // Handle API errors (HTTP status codes)
    handleAPIError(error, { url });
    
    if (showToast && !silent) {
      const status = error.response?.status;
      let message = 'An error occurred while processing your request.';
      
      switch (status) {
        case 401:
          message = 'Please log in to continue.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 429:
          message = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.response?.data?.message || message;
      }
      
      window.showToast?.({
        type: 'error',
        title: 'Request Failed',
        message,
        duration: 5000
      });
    }
    
    throw error;
  }
};

// API request with automatic retry
export const apiRequestWithRetry = (url, options = {}, config = {}) => {
  return withRetry(
    () => apiRequest(url, options, { ...config, retries: 1 }), // Disable internal retries
    config.retries || 3,
    config.retryDelay || 1000
  );
};

// Common API methods with error handling
export const api = {
  get: (url, config = {}) => 
    apiRequest(url, { method: 'GET' }, config),
    
  post: (url, data, config = {}) => 
    apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }, config),
    
  put: (url, data, config = {}) => 
    apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, config),
    
  patch: (url, data, config = {}) => 
    apiRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }, config),
    
  delete: (url, config = {}) => 
    apiRequest(url, { method: 'DELETE' }, config)
};

// API methods with retry
export const apiWithRetry = {
  get: (url, config = {}) => 
    apiRequestWithRetry(url, { method: 'GET' }, config),
    
  post: (url, data, config = {}) => 
    apiRequestWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }, config),
    
  put: (url, data, config = {}) => 
    apiRequestWithRetry(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, config),
    
  patch: (url, data, config = {}) => 
    apiRequestWithRetry(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }, config),
    
  delete: (url, config = {}) => 
    apiRequestWithRetry(url, { method: 'DELETE' }, config)
};

// Request queue for offline scenarios
class RequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  add(request) {
    this.queue.push({
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...request
    });
    
    if (navigator.onLine && !this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0 && navigator.onLine) {
      const request = this.queue.shift();
      
      try {
        await apiRequest(request.url, request.options, {
          ...request.config,
          silent: true // Don't show toasts for queued requests
        });
        
        // Success - request was processed
        console.log(`Queued request processed: ${request.url}`);
      } catch (error) {
        // If it fails, put it back at the front of the queue
        this.queue.unshift(request);
        break;
      }
    }
    
    this.isProcessing = false;
  }

  clear() {
    this.queue = [];
  }

  getQueue() {
    return [...this.queue];
  }
}

export const requestQueue = new RequestQueue();

// Setup offline/online handling for request queue
export const setupOfflineQueue = () => {
  const handleOnline = () => {
    requestQueue.processQueue();
  };

  const handleOffline = () => {
    // Queue is already set up to handle offline requests
    console.log('App went offline - requests will be queued');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Request interceptor for adding common headers, auth tokens, etc.
export const createRequestInterceptor = (interceptor) => {
  return async (url, options, config) => {
    const modifiedOptions = await interceptor(url, options, config);
    return apiRequest(url, modifiedOptions, config);
  };
};

// Example interceptor for authentication
export const authInterceptor = createRequestInterceptor(async (url, options, config) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    };
  }
  
  return options;
});
