import React, { useState } from 'react';
import { Cog, Palette, Bell, Shield, Database, Globe, User, Key } from 'lucide-react';

const SettingsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      signals: true,
      alerts: true,
      news: false,
      risk: true,
    },
    trading: {
      defaultPositionSize: 0.1,
      maxRiskPerTrade: 2.0,
      autoCloseOnSignal: false,
      slippageTolerance: 0.05,
    },
    display: {
      showVolumeProfile: true,
      showOrderFlow: true,
      showSmartMoneyZones: true,
      chartHeight: 500,
    },
    api: {
      dataProvider: 'binance',
      updateInterval: 1000,
      maxConnections: 5,
    },
  });

  const categories = [
    { id: 'general', label: 'General', icon: Cog },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'trading', label: 'Trading', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'account', label: 'Account', icon: User },
  ];

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const renderGeneral = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">General Settings</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => updateSetting('timezone', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="GMT">GMT</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Default Asset</label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100">
            <option value="BTC-USD">BTC-USD</option>
            <option value="ETH-USD">ETH-USD</option>
            <option value="EUR-USD">EUR-USD</option>
            <option value="SPY">SPY</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Default Timeframe</label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100">
            <option value="15m">15 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="1d">1 day</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Appearance Settings</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-2">Theme</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateSetting('theme', 'dark')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                settings.theme === 'dark'
                  ? 'bg-slate-700 text-slate-100'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => updateSetting('theme', 'light')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                settings.theme === 'light'
                  ? 'bg-slate-700 text-slate-100'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Light
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Chart Height</label>
          <input
            type="range"
            min="300"
            max="800"
            value={settings.display.chartHeight}
            onChange={(e) => updateSetting('display.chartHeight', Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-slate-500 mt-1">{settings.display.chartHeight}px</div>
        </div>

        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-slate-300">Chart Elements</h5>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.display.showVolumeProfile}
                onChange={(e) => updateSetting('display.showVolumeProfile', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">Show Volume Profile</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.display.showOrderFlow}
                onChange={(e) => updateSetting('display.showOrderFlow', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">Show Order Flow</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.display.showSmartMoneyZones}
                onChange={(e) => updateSetting('display.showSmartMoneyZones', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">Show Smart Money Zones</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Notification Settings</h4>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-slate-300">Signal Notifications</h5>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.signals}
                onChange={(e) => updateSetting('notifications.signals', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">New AI Signals</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.alerts}
                onChange={(e) => updateSetting('notifications.alerts', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">Risk Alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.news}
                onChange={(e) => updateSetting('notifications.news', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">High Impact News</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.risk}
                onChange={(e) => updateSetting('notifications.risk', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-300">Risk Threshold Breaches</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Notification Sound</label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100">
            <option value="default">Default</option>
            <option value="subtle">Subtle</option>
            <option value="none">None</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Email Notifications</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-300">Daily summary</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-slate-300">Weekly performance report</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrading = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Trading Settings</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-2">Default Position Size</label>
          <input
            type="number"
            step="0.01"
            value={settings.trading.defaultPositionSize}
            onChange={(e) => updateSetting('trading.defaultPositionSize', Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Max Risk Per Trade (%)</label>
          <input
            type="number"
            step="0.1"
            value={settings.trading.maxRiskPerTrade}
            onChange={(e) => updateSetting('trading.maxRiskPerTrade', Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Slippage Tolerance (%)</label>
          <input
            type="number"
            step="0.01"
            value={settings.trading.slippageTolerance}
            onChange={(e) => updateSetting('trading.slippageTolerance', Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.trading.autoCloseOnSignal}
              onChange={(e) => updateSetting('trading.autoCloseOnSignal', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-slate-300">Auto-close positions on opposite signal</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderData = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Data Settings</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-2">Data Provider</label>
          <select
            value={settings.api.dataProvider}
            onChange={(e) => updateSetting('api.dataProvider', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          >
            <option value="binance">Binance</option>
            <option value="coinbase">Coinbase Pro</option>
            <option value="kraken">Kraken</option>
            <option value="polygon">Polygon</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Update Interval (ms)</label>
          <input
            type="number"
            value={settings.api.updateInterval}
            onChange={(e) => updateSetting('api.updateInterval', Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Max WebSocket Connections</label>
          <input
            type="number"
            value={settings.api.maxConnections}
            onChange={(e) => updateSetting('api.maxConnections', Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-slate-300">Data Storage</h5>
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <span className="text-sm text-slate-300">Clear cached data</span>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Account Settings</h4>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-2">Account Type</label>
          <div className="px-3 py-2 bg-slate-700 rounded text-slate-300">
            Institutional Pro
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">API Keys</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <span className="text-sm text-slate-300">Trading API</span>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <span className="text-sm text-slate-300">Data API</span>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
                Configure
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Security</label>
          <div className="space-y-2">
            <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-slate-300">
              Change Password
            </button>
            <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-slate-300">
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case 'general': return renderGeneral();
      case 'appearance': return renderAppearance();
      case 'notifications': return renderNotifications();
      case 'trading': return renderTrading();
      case 'data': return renderData();
      case 'account': return renderAccount();
      default: return renderGeneral();
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <category.icon size={16} />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
