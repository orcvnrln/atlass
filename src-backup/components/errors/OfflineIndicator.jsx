import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';

const OfflineIndicator = ({ showWhenOnline = false, position = 'bottom-left' }) => {
  const { isOffline, connectionQuality, lastOnline } = useOffline();

  const getPositionClasses = () => {
    const positions = {
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4'
    };
    return positions[position] || positions['bottom-left'];
  };

  const getQualityColor = () => {
    switch (connectionQuality) {
      case '4g':
      case '3g':
        return 'text-green-400';
      case '2g':
      case 'slow-2g':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getQualityIcon = () => {
    if (isOffline) return WifiOff;
    
    switch (connectionQuality) {
      case '4g':
      case '3g':
        return Wifi;
      case '2g':
      case 'slow-2g':
        return AlertTriangle;
      default:
        return Wifi;
    }
  };

  const shouldShow = isOffline || showWhenOnline;
  if (!shouldShow) return null;

  const Icon = getQualityIcon();
  const qualityColor = getQualityColor();

  return (
    <div
      className={`
        fixed ${getPositionClasses()} z-50
        bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg
        px-3 py-2 shadow-lg
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${isOffline ? 'text-red-400' : qualityColor}`} />
        
        <div className="text-xs">
          {isOffline ? (
            <div className="text-red-400">
              <div className="font-medium">Offline</div>
              <div className="text-red-300">No internet connection</div>
            </div>
          ) : (
            <div className="text-gray-300">
              <div className="font-medium">Online</div>
              {connectionQuality !== 'unknown' && (
                <div className="text-gray-400 capitalize">
                  {connectionQuality} • Last seen: {new Date(lastOnline).toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
