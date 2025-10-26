import React from 'react';
import { motion } from 'framer-motion';

const fundamentalData = {
    'stocks': [
        { label: 'P/E Ratio', value: '29.5' },
        { label: 'EPS', value: '$6.41' },
        { label: 'Market Cap', value: '$2.9T' },
    ],
    'forex': [
        { label: 'Interest Rate', value: '5.50% (USD)' },
        { label: 'Interest Rate', value: '4.50% (EUR)' },
        { label: 'GDP Growth', value: '2.1% (USD)' },
    ],
    'crypto': [
        { label: 'Market Cap', value: '$850B' },
        { label: 'On-Chain Volume (24h)', value: '$25.4B' },
        { label: 'Active Addresses', value: '950K' },
    ],
    interpretation: {
        rating: 'Fairly Valued',
        summary: 'Current price seems aligned with fundamental metrics, though macroeconomic factors present some uncertainty.'
    }
};

const DataRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-border-color/50">
        <p className="text-text-secondary">{label}</p>
        <p className="font-mono text-white">{value}</p>
    </div>
);

const FundamentalAnalysisTab = ({ assetType = 'forex' }) => {
  const data = fundamentalData[assetType] || [];

  return (
    <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h4 className="text-md font-semibold text-white mb-2">Key Metrics</h4>
            <div className="space-y-2">
                {data.map(item => <DataRow key={item.label} {...item} />)}
            </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h4 className="text-md font-semibold text-white mb-2">AI Interpretation</h4>
            <div className="bg-card-bg p-3 rounded-lg">
                <p className="text-center font-bold text-lg text-accent mb-2">{fundamentalData.interpretation.rating}</p>
                <p className="text-sm text-text-secondary">{fundamentalData.interpretation.summary}</p>
            </div>
        </motion.div>
    </div>
  );
};

export default FundamentalAnalysisTab;
