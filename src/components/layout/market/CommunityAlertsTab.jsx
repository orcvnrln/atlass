import React from 'react';
import { motion } from 'framer-motion';
import { BellPlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockAlerts = [
    { id: 1, type: 'Price crosses above', value: '1.1000' },
    { id: 2, type: 'RSI enters oversold', value: '< 30' },
];

const CommunityAlertsTab = () => {
  return (
    <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h4 className="text-md font-semibold text-white mb-2">My Alerts</h4>
            <div className="space-y-2">
                {mockAlerts.map(alert => (
                    <div key={alert.id} className="flex justify-between items-center bg-card-bg p-3 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-accent" />
                            <span className="text-text-secondary">{alert.type}</span>
                        </div>
                        <span className="font-mono text-white">{alert.value}</span>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-4 flex items-center gap-2">
                <BellPlus size={16} /> Add New Alert
            </Button>
        </motion.div>
    </div>
  );
};

export default CommunityAlertsTab;
