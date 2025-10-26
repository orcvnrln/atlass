import React, { createContext, useContext, useState, useEffect } from 'react';
import { setupOfflineHandling } from '@/lib/errorHandler';
import { setupOfflineQueue } from '@/lib/apiErrorHandler';
import ToastManager from '@/components/errors/ToastManager';
import OfflineIndicator from '@/components/errors/OfflineIndicator';

const ErrorContext = createContext();

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Setup offline handling
    const cleanupOffline = setupOfflineHandling();
    const cleanupQueue = setupOfflineQueue();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global error handler for unhandled promises
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      window.showToast?.({
        type: 'error',
        title: 'Unexpected Error',
        message: 'An unexpected error occurred. Please try again.',
        duration: 5000
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      cleanupOffline();
      cleanupQueue();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const addError = (error) => {
    setErrors(prev => [...prev, { ...error, id: Date.now() + Math.random() }]);
  };

  const removeError = (id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const value = {
    errors,
    isOnline,
    addError,
    removeError,
    clearErrors
  };

  return (
    <ErrorContext.Provider value={value}>
      <ToastManager>
        {children}
        <OfflineIndicator />
      </ToastManager>
    </ErrorContext.Provider>
  );
};
