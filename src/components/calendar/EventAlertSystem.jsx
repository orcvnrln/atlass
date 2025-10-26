import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, TrendingUp, TrendingDown, AlertTriangle, Settings } from 'lucide-react';
import { mockEvents } from '@/data/calendarData';

const EventAlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    enabled: true,
    highImpactOnly: false,
    currencies: ['USD', 'EUR', 'GBP'],
    timeBeforeEvent: 30 // minutes
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    if (alertSettings.enabled) {
      checkForUpcomingEvents();
      const interval = setInterval(checkForUpcomingEvents, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [alertSettings]);

  const checkForUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = mockEvents.filter(event => {
      const eventDate = new Date(`${event.date} ${event.time}`);
      const timeDiff = eventDate - now;
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Check if event is within alert timeframe
      const isUpcoming = minutesDiff > 0 && minutesDiff <= alertSettings.timeBeforeEvent;
      
      // Check filters
      const matchesCurrency = alertSettings.currencies.includes(event.currency);
      const matchesImpact = !alertSettings.highImpactOnly || event.impact >= 3;
      
      return isUpcoming && matchesCurrency && matchesImpact;
    });

    // Create alerts for new upcoming events
    upcomingEvents.forEach(event => {
      const alertId = `${event.date}_${event.time}_${event.event}`;
      if (!activeAlerts.find(alert => alert.id === alertId)) {
        const newAlert = {
          id: alertId,
          event,
          timestamp: new Date(),
          type: 'upcoming'
        };
        setActiveAlerts(prev => [...prev, newAlert]);
        showNotification(newAlert);
      }
    });
  };

  const showNotification = (alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Economic Event Alert`, {
        body: `${alert.event.event} (${alert.event.currency}) in ${alertSettings.timeBeforeEvent} minutes`,
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const dismissAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 3: return 'text-accent-red';
      case 2: return 'text-accent-orange';
      default: return 'text-accent-green';
    }
  };

  const getTimeUntilEvent = (event) => {
    const now = new Date();
    const eventDate = new Date(`${event.date} ${event.time}`);
    const timeDiff = eventDate - now;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesDiff < 60) return `${minutesDiff}m`;
    const hoursDiff = Math.floor(minutesDiff / 60);
    return `${hoursDiff}h ${minutesDiff % 60}m`;
  };

  return (
    <>
      {/* Alert Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 p-3 bg-accent-orange rounded-full shadow-lg hover:bg-accent-orange/80 transition-colors z-40"
      >
        <Bell size={20} className="text-white" />
        {activeAlerts.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeAlerts.length}
          </span>
        )}
      </button>

      {/* Active Alerts */}
      <div className="fixed top-20 right-6 space-y-2 z-50">
        <AnimatePresence>
          {activeAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className="bg-card-bg border border-border-on-card rounded-lg p-4 shadow-lg max-w-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className={getImpactColor(alert.event.impact)} />
                  <span className="text-sm font-medium text-text-primary">Event Alert</span>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X size={14} />
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-text-primary">{alert.event.event}</h4>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="font-mono">{alert.event.currency}</span>
                  <span>•</span>
                  <Clock size={12} />
                  <span>in {getTimeUntilEvent(alert.event)}</span>
                </div>
                <div className="text-xs text-text-secondary">
                  Expected volatility: {alert.event.volatilityForecast}%
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card-bg rounded-xl p-6 w-full max-w-md border border-border-on-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Settings size={20} />
                  Alert Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Enable Alerts */}
                <div className="flex items-center justify-between">
                  <label className="text-text-primary">Enable Alerts</label>
                  <button
                    onClick={() => setAlertSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      alertSettings.enabled ? 'bg-accent-green' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      alertSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* High Impact Only */}
                <div className="flex items-center justify-between">
                  <label className="text-text-primary">High Impact Only</label>
                  <button
                    onClick={() => setAlertSettings(prev => ({ ...prev, highImpactOnly: !prev.highImpactOnly }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      alertSettings.highImpactOnly ? 'bg-accent-green' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      alertSettings.highImpactOnly ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Time Before Event */}
                <div>
                  <label className="block text-text-primary mb-2">Alert Time (minutes before)</label>
                  <select
                    value={alertSettings.timeBeforeEvent}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, timeBeforeEvent: Number(e.target.value) }))}
                    className="w-full p-2 bg-primary-bg border border-border-on-card rounded text-text-primary focus:border-accent-orange focus:outline-none"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-text-primary mb-2">Currencies to Monitor</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD'].map(currency => (
                      <button
                        key={currency}
                        onClick={() => {
                          setAlertSettings(prev => ({
                            ...prev,
                            currencies: prev.currencies.includes(currency)
                              ? prev.currencies.filter(c => c !== currency)
                              : [...prev.currencies, currency]
                          }));
                        }}
                        className={`p-2 rounded text-sm font-medium transition-colors ${
                          alertSettings.currencies.includes(currency)
                            ? 'bg-accent-orange text-white'
                            : 'bg-primary-bg text-text-secondary border border-border-on-card hover:text-text-primary'
                        }`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Browser Notifications */}
                <div>
                  <button
                    onClick={requestNotificationPermission}
                    className="w-full p-2 bg-accent-blue/10 text-accent-blue rounded hover:bg-accent-blue/20 transition-colors"
                  >
                    Enable Browser Notifications
                  </button>
                  <p className="text-xs text-text-secondary mt-1">
                    Get desktop notifications for important events
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventAlertSystem;
