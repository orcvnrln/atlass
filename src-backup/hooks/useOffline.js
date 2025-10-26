import { useState, useEffect } from 'react';
import { errorLogger } from '@/lib/errorHandler';

/**
 * Custom hook for offline/online detection and management
 */
export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastOnline, setLastOnline] = useState(new Date().toISOString());
  const [connectionQuality, setConnectionQuality] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastOnline(new Date().toISOString());
      
      // Log connection restoration
      errorLogger.log({
        type: 'CONNECTION_RESTORED',
        severity: 'low',
        message: 'Internet connection restored'
      });

      // Show success toast
      window.showToast?.({
        type: 'success',
        title: 'Back Online',
        message: 'Your internet connection has been restored.',
        duration: 3000
      });

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('app-online'));
    };

    const handleOffline = () => {
      setIsOffline(true);
      
      // Log connection loss
      errorLogger.log({
        type: 'CONNECTION_LOST',
        severity: 'high',
        message: 'Internet connection lost'
      });

      // Show offline toast
      window.showToast?.({
        type: 'offline',
        title: 'You\'re Offline',
        message: 'Some features may not work without an internet connection.',
        duration: 0 // Don't auto-hide
      });

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('app-offline'));
    };

    // Monitor connection quality if available
    const handleConnectionChange = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        const quality = connection.effectiveType || 'unknown';
        setConnectionQuality(quality);
        
        // Log connection quality changes
        errorLogger.log({
          type: 'CONNECTION_QUALITY_CHANGE',
          severity: 'low',
          message: `Connection quality changed to: ${quality}`
        });
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    // Initial connection quality check
    handleConnectionChange();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return {
    isOffline,
    lastOnline,
    connectionQuality,
    isOnline: !isOffline
  };
};
