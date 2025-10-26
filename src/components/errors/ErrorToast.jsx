import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

const ErrorToast = ({ 
  error, 
  type = 'error', 
  title, 
  message, 
  duration = 5000,
  position = 'top-right',
  onClose,
  id
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose(id);
      }
    }, 300);
  };

  const getToastConfig = () => {
    const configs = {
      error: {
        icon: XCircle,
        bgColor: 'bg-red-900/90',
        borderColor: 'border-red-500/50',
        textColor: 'text-red-100',
        iconColor: 'text-red-400'
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-900/90',
        borderColor: 'border-yellow-500/50',
        textColor: 'text-yellow-100',
        iconColor: 'text-yellow-400'
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-900/90',
        borderColor: 'border-blue-500/50',
        textColor: 'text-blue-100',
        iconColor: 'text-blue-400'
      },
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-900/90',
        borderColor: 'border-green-500/50',
        textColor: 'text-green-100',
        iconColor: 'text-green-400'
      },
      offline: {
        icon: WifiOff,
        bgColor: 'bg-gray-900/90',
        borderColor: 'border-gray-500/50',
        textColor: 'text-gray-100',
        iconColor: 'text-gray-400'
      },
      online: {
        icon: Wifi,
        bgColor: 'bg-green-900/90',
        borderColor: 'border-green-500/50',
        textColor: 'text-green-100',
        iconColor: 'text-green-400'
      }
    };

    return configs[type] || configs.error;
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position] || positions['top-right'];
  };

  if (!isVisible) return null;

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed ${getPositionClasses()} z-50 max-w-sm w-full
        ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isLeaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor} flex-shrink-0`} />
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`font-semibold ${config.textColor} mb-1 text-sm`}>
                {title}
              </h4>
            )}
            
            <p className={`text-xs ${config.textColor}`}>
              {message || error?.message || 'An error occurred'}
            </p>
          </div>

          <button
            onClick={handleClose}
            className={`${config.textColor} hover:opacity-75 transition-opacity ml-2`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;
