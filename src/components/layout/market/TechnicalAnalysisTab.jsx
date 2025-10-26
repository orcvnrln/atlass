import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const technicalData = {
    pattern: { name: 'Head & Shoulders', status: 'Bearish' },
    levels: [
        { type: 'Resistance', value: 1.0950 },
        { type: 'Support', value: 1.0750 },
    ],
    indicators: [
        { name: 'RSI (14)', value: 45.2, summary: 'Neutral' },
        { name: 'MACD (12, 26, 9)', value: -0.0012, summary: 'Bearish Crossover' },
        { name: 'EMA (50)', value: 1.0855, summary: 'Price below EMA' },
        { name: 'Bollinger Bands®', value: 'Mid Band', summary: 'Price near Mid' },
    ]
};

const Indicator = ({ name, value, summary }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-border-color/50">
        <div>
            <p className="text-white">{name}</p>
            <p className="text-xs text-text-secondary">{summary}</p>
        </div>
        <p className="font-mono text-white">{value}</p>
    </div>
);

const TechnicalAnalysisTab = () => {
  return (
    <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h4 className="text-md font-semibold text-white mb-2">AI Pattern Detection</h4>
            <div className="bg-card-bg p-3 rounded-lg flex items-center justify-between">
                <span className="text-text-secondary">Detected Pattern:</span>
                <span className={`font-bold flex items-center gap-2 ${technicalData.pattern.status === 'Bearish' ? 'text-negative' : 'text-positive'}`}>
                    {technicalData.pattern.name} {technicalData.pattern.status === 'Bearish' ? <TrendingDown size={16}/> : <TrendingUp size={16}/>}
                </span>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h4 className="text-md font-semibold text-white mb-2">Support & Resistance</h4>
            <div className="space-y-2">
                {technicalData.levels.map(level => (
                    <div key={level.type} className="flex justify-between items-center bg-card-bg p-3 rounded-lg text-sm">
                        <span className="text-text-secondary">{level.type}</span>
                        <span className="font-mono text-white">{level.value}</span>
                    </div>
                ))}
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h4 className="text-md font-semibold text-white mb-2">Indicator Summary</h4>
            <div className="space-y-2">
                {technicalData.indicators.map(ind => <Indicator key={ind.name} {...ind} />)}
            </div>
        </motion.div>
    </div>
  );
};

export default TechnicalAnalysisTab;
