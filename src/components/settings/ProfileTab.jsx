import React from 'react';
import { Button } from '@/components/ui/button';

const ProfileTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Profile</h3>
        <p className="text-sm text-text-secondary">Manage your public profile and account details.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="w-20 h-20 rounded-full" />
            <div>
                <Button>Change Avatar</Button>
                <p className="text-xs text-text-secondary mt-2">JPG, GIF or PNG. 1MB max.</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-text-secondary">Full Name</label>
                <input type="text" defaultValue="Yengen Kizar" className="w-full mt-1 bg-primary-bg border border-border-color rounded-lg px-3 py-2 text-white placeholder-text-secondary focus:outline-none focus:border-accent text-sm" />
            </div>
            <div>
                <label className="text-sm text-text-secondary">Email</label>
                <input type="email" defaultValue="yengen.kizar@example.com" className="w-full mt-1 bg-primary-bg border border-border-color rounded-lg px-3 py-2 text-white placeholder-text-secondary focus:outline-none focus:border-accent text-sm" />
            </div>
        </div>
        <div>
            <label className="text-sm text-text-secondary">Subscription Tier</label>
            <p className="text-lg font-semibold text-accent">Institutional Pro</p>
        </div>
      </div>
      <Button>Save Changes</Button>
    </div>
  );
};

export default ProfileTab;
