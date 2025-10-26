import React from 'react';
import { Button } from '@/components/ui/button';

const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Security</h3>
        <p className="text-sm text-text-secondary">Manage your account security settings.</p>
      </div>
      <div className="space-y-4">
        <div>
            <label className="text-sm text-text-secondary">Password</label>
            <Button variant="outline" className="w-full mt-1">Change Password</Button>
        </div>
        <div>
            <label className="text-sm text-text-secondary">Two-Factor Authentication</label>
            <Button className="w-full mt-1">Enable 2FA</Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
