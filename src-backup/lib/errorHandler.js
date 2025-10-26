/**
 * Comprehensive Error Handling Utilities
 * Handles different types of errors with logging, user feedback, and graceful degradation
 */

// Error types enum
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
  COMPONENT: 'COMPONENT_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error logging service
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep only last 100 errors in memory
  }

  log(error, context = {}) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type: error.type || ERROR_TYPES.UNKNOWN,
      severity: error.severity || ERROR_SEVERITY.MEDIUM,
      message: error.message || 'Unknown error occurred',
      stack: error.stack,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        ...context
      },
      user: this.getUserContext()
    };

    this.errors.unshift(errorEntry);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error: ${errorEntry.type}`);
      console.error('Message:', errorEntry.message);
      console.error('Severity:', errorEntry.severity);
      console.error('Context:', errorEntry.context);
      console.error('Stack:', errorEntry.stack);
      console.groupEnd();
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorEntry);
    }

    return errorEntry;
  }

  getUserContext() {
    // Get user context if available
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async sendToExternalService(errorEntry) {
    try {
      // Replace with your actual logging service endpoint
      await fetch('/api/logs/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorEntry)
      });
    } catch (error) {
      console.error('Failed to send error to external service:', error);
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Network error handler
export const handleNetworkError = (error, context = {}) => {
  const networkError = {
    type: ERROR_TYPES.NETWORK,
    severity: ERROR_SEVERITY.HIGH,
    message: 'Network connection failed. Please check your internet connection.',
    originalError: error,
    ...context
  };

  return errorLogger.log(networkError, {
    ...context,
    networkStatus: navigator.onLine ? 'online' : 'offline'
  });
};

// API error handler
export const handleAPIError = (error, context = {}) => {
  let message = 'An error occurred while processing your request.';
  let severity = ERROR_SEVERITY.MEDIUM;

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    
    switch (status) {
      case 400:
        message = 'Invalid request. Please check your input.';
        severity = ERROR_SEVERITY.LOW;
        break;
      case 401:
        message = 'Authentication required. Please log in.';
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 404:
        message = 'The requested resource was not found.';
        severity = ERROR_SEVERITY.LOW;
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 500:
        message = 'Server error. Please try again later.';
        severity = ERROR_SEVERITY.HIGH;
        break;
      case 503:
        message = 'Service temporarily unavailable. Please try again later.';
        severity = ERROR_SEVERITY.HIGH;
        break;
      default:
        message = `Server error (${status}). Please try again.`;
        severity = ERROR_SEVERITY.MEDIUM;
    }
  } else if (error.request) {
    // Request was made but no response received
    message = 'Unable to connect to the server. Please check your connection.';
    severity = ERROR_SEVERITY.HIGH;
  }

  const apiError = {
    type: ERROR_TYPES.API,
    severity,
    message,
    originalError: error,
    ...context
  };

  return errorLogger.log(apiError, {
    ...context,
    status: error.response?.status,
    url: error.config?.url
  });
};

// Validation error handler
export const handleValidationError = (errors, context = {}) => {
  const validationError = {
    type: ERROR_TYPES.VALIDATION,
    severity: ERROR_SEVERITY.LOW,
    message: 'Please correct the following errors:',
    validationErrors: errors,
    ...context
  };

  return errorLogger.log(validationError, context);
};

// Generic error handler
export const handleError = (error, context = {}) => {
  // Determine error type based on error properties
  let type = ERROR_TYPES.UNKNOWN;
  
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    type = ERROR_TYPES.NETWORK;
  } else if (error.response || error.request) {
    type = ERROR_TYPES.API;
  } else if (error.validationErrors) {
    type = ERROR_TYPES.VALIDATION;
  }

  const errorData = {
    type,
    severity: ERROR_SEVERITY.MEDIUM,
    message: error.message || 'An unexpected error occurred',
    originalError: error,
    ...context
  };

  return errorLogger.log(errorData, context);
};

// Retry mechanism for failed requests
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      
      if (isLastAttempt) {
        throw error;
      }

      // Only retry on network errors or 5xx server errors
      const shouldRetry = 
        error.type === ERROR_TYPES.NETWORK ||
        (error.response && error.response.status >= 500);

      if (!shouldRetry) {
        throw error;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Offline detection and handling
export const setupOfflineHandling = () => {
  const handleOnline = () => {
    window.dispatchEvent(new CustomEvent('app-online'));
    errorLogger.log({
      type: 'CONNECTION_RESTORED',
      severity: ERROR_SEVERITY.LOW,
      message: 'Internet connection restored'
    });
  };

  const handleOffline = () => {
    window.dispatchEvent(new CustomEvent('app-offline'));
    errorLogger.log({
      type: 'CONNECTION_LOST',
      severity: ERROR_SEVERITY.HIGH,
      message: 'Internet connection lost'
    });
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Error recovery strategies
export const createErrorRecovery = (strategies = {}) => {
  return {
    recover: async (error, context = {}) => {
      const errorType = error.type || ERROR_TYPES.UNKNOWN;
      const strategy = strategies[errorType];

      if (strategy && typeof strategy === 'function') {
        try {
          return await strategy(error, context);
        } catch (recoveryError) {
          errorLogger.log(recoveryError, {
            ...context,
            originalError: error,
            recoveryFailed: true
          });
          throw recoveryError;
        }
      }

      // Default recovery: return null
      return null;
    }
  };
};
