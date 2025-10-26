import React, { useState, useCallback } from 'react';
import ErrorToast from './ErrorToast';

const ToastManager = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Provide toast functions through context or global
  React.useEffect(() => {
    window.showToast = addToast;
    window.clearAllToasts = clearAllToasts;
    
    return () => {
      delete window.showToast;
      delete window.clearAllToasts;
    };
  }, [addToast, clearAllToasts]);

  return (
    <>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ErrorToast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </>
  );
};

export default ToastManager;
