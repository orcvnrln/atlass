import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon, Shield, Key } from 'lucide-react';
import ProfileTab from '@/components/settings/ProfileTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import SecurityTab from '@/components/settings/SecurityTab';
import ApiKeysTab from '@/components/settings/ApiKeysTab';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const tabs = [
        { name: 'Profile', icon: User, content: <ProfileTab /> },
        { name: 'Preferences', icon: SettingsIcon, content: <PreferencesTab /> },
        { name: 'Security', icon: Shield, content: <SecurityTab /> },
        { name: 'API Keys', icon: Key, content: <ApiKeysTab /> },
    ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Settings - Blommy</title>
        <meta name="description" content="Manage your platform settings and preferences." />
      </Helmet>
      <div className="max-w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-md text-text-secondary">Customize your trading platform experience</p>
        </motion.div>
        
        <div className="flex gap-6">
            <div className="w-1/4">
                {tabs.map(tab => (
                    <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors ${activeTab === tab.name ? 'bg-accent text-white' : 'hover:bg-card-bg text-text-secondary'}`}>
                        <tab.icon size={18} /> {tab.name}
                    </button>
                ))}
            </div>
            <div className="w-3/4 bg-card-bg rounded-xl card-elevation p-6">
                {tabs.find(tab => tab.name === activeTab).content}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;