import React from 'react';
import { Button } from '@/components/ui/button';
import { Key, Plus } from 'lucide-react';

const ApiKeysTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">API Keys</h3>
        <p className="text-sm text-text-secondary">Manage your API keys for third-party integrations.</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus size={16} /> Generate New Key
      </Button>
    </div>
  );
};

export default ApiKeysTab;
