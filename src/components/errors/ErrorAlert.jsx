import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

const ErrorAlert = ({ 
  error, 
  type = 'error', 
  title, 
  message, 
  dismissible = true, 
  autoHide = false, 
  duration = 5000,
  onDismiss,
  actions = []
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      if (onDismiss) {
        onDismiss();
      }
    }, 300); // Match transition duration
  };

  const getAlertConfig = () => {
    const configs = {
      error: {
        icon: XCircle,
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-500/50',
        textColor: 'text-red-400',
        iconColor: 'text-red-500'
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-900/20',
        borderColor: 'border-yellow-500/50',
        textColor: 'text-yellow-400',
        iconColor: 'text-yellow-500'
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-900/20',
        borderColor: 'border-blue-500/50',
        textColor: 'text-blue-400',
        iconColor: 'text-blue-500'
      },
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500/50',
        textColor: 'text-green-400',
        iconColor: 'text-green-500'
      },
      offline: {
        icon: WifiOff,
        bgColor: 'bg-gray-900/20',
        borderColor: 'border-gray-500/50',
        textColor: 'text-gray-400',
        iconColor: 'text-gray-500'
      },
      online: {
        icon: Wifi,
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500/50',
        textColor: 'text-green-400',
        iconColor: 'text-green-500'
      }
    };

    return configs[type] || configs.error;
  };

  if (isDismissed) return null;

  const config = getAlertConfig();
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-4
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor} flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold ${config.textColor} mb-1`}>
              {title}
            </h4>
          )}
          
          <p className={`text-sm ${config.textColor}`}>
            {message || error?.message || 'An error occurred'}
          </p>

          {actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                    ${action.variant === 'primary' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`${config.textColor} hover:opacity-75 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
