import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MinusCircle, ShieldCheck } from 'lucide-react';

const signalData = {
    recommendation: 'BUY',
    confidence: 85,
    timeHorizon: 'Swing (1-5 days)',
    riskLevel: 'Medium',
    entry: '1.0850',
    sl: '1.0800',
    tp: '1.0950',
    reasoning: [
        'RSI oversold on the 4H chart, suggesting potential reversal.',
        'Price is currently testing a key historical support level.',
        'AI sentiment analysis shows a recent uptick in bullish social media mentions.'
    ]
};

const getRecommendationIcon = (rec) => {
    switch (rec) {
        case 'BUY': return <CheckCircle className="w-8 h-8 text-positive" />;
        case 'SELL': return <XCircle className="w-8 h-8 text-negative" />;
        default: return <MinusCircle className="w-8 h-8 text-text-secondary" />;
    }
};

const ConfidenceBadge = ({ confidence }) => {
    let bgColor, textColor, text;

    if (confidence >= 80) {
        bgColor = 'bg-green-500/20';
        textColor = 'text-green-400';
        text = 'High Conviction';
    } else if (confidence >= 60) {
        bgColor = 'bg-yellow-500/20';
        textColor = 'text-yellow-400';
        text = 'Moderate Conviction';
    } else {
        bgColor = 'bg-red-500/20';
        textColor = 'text-red-400';
        text = 'Low Conviction';
    }

    return (
        <div className={`flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
            <ShieldCheck size={14} />
            {text}
        </div>
    );
};

const AITradingSignalTab = () => {
  return (
    <div className="space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card-bg p-4 rounded-lg text-center">
            <h4 className="text-md font-semibold text-text-secondary mb-2">AI Recommendation</h4>
            <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${signalData.recommendation === 'BUY' ? 'text-positive' : 'text-negative'}`}>
                {getRecommendationIcon(signalData.recommendation)}
                {signalData.recommendation}
            </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card-bg p-3 rounded-lg">
                <p className="text-sm text-text-secondary">Confidence</p>
                <div className="flex items-center justify-center gap-2">
                    <p className="text-xl font-bold text-accent">{signalData.confidence}%</p>
                    <ConfidenceBadge confidence={signalData.confidence} />
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card-bg p-3 rounded-lg">
                <p className="text-sm text-text-secondary">Risk Level</p>
                <p className="text-xl font-bold text-white">{signalData.riskLevel}</p>
            </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card-bg p-4 rounded-lg">
            <h4 className="text-md font-semibold text-white mb-2">Signal Details</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Time Horizon:</span> <span className="font-mono text-white">{signalData.timeHorizon}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Entry Price:</span> <span className="font-mono text-white">{signalData.entry}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Stop Loss:</span> <span className="font-mono text-negative">{signalData.sl}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Take Profit:</span> <span className="font-mono text-positive">{signalData.tp}</span></div>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h4 className="text-md font-semibold text-white mb-2">AI Reasoning</h4>
            <ul className="space-y-2 text-sm text-text-secondary list-disc list-inside">
                {signalData.reasoning.map((reason, i) => <li key={i}>{reason}</li>)}
            </ul>
        </motion.div>
    </div>
  );
};

export default AITradingSignalTab;
