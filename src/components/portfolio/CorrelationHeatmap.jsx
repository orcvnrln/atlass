import React from 'react';
import Card from '@/components/dashboard/Card';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';

const CorrelationHeatmap = ({ data }) => {
    const getColor = (value) => {
        const intensity = Math.abs(value);
        if (value > 0) return `rgba(22, 199, 132, ${intensity})`; // Green for positive
        if (value < 0) return `rgba(234, 57, 67, ${intensity})`; // Red for negative
        return '#374151'; // Neutral
    };

    const handleNewInsight = () => {
        toast({
            title: "💡 New AI Correlation Insight",
            description: "Gold and the S&P 500 show a strong negative correlation (-0.72) in your portfolio. This is a classic hedging relationship, providing good diversification.",
        });
    };

    return (
        <Card title="Correlation Heatmap" className="col-span-1 lg:col-span-2">
            <p className="text-sm text-text-secondary mb-4">
                Visualizes how assets in your portfolio move in relation to each other.
            </p>
            <button
                onClick={handleNewInsight}
                className="absolute top-4 right-4 text-text-secondary hover:text-primary transition-colors"
                aria-label="Get new AI insight"
            >
                <Sparkles size={20} />
            </button>
            <div className="flex justify-end mb-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                    <span>Negative</span>
                    <div className="w-24 h-2 rounded-full bg-gradient-to-r from-negative via-gray-500 to-positive"></div>
                    <span>Positive</span>
                </div>
            </div>
            <table className="w-full text-center text-xs">
                <thead>
                    <tr>
                        <th className="p-2"></th>
                        {data.labels.map(label => <th key={label} className="p-2 font-mono">{label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.matrix.map((row, i) => (
                        <tr key={i}>
                            <td className="p-2 font-mono font-bold text-left">{data.labels[i]}</td>
                            {row.map((value, j) => (
                                <td key={j} className="p-2">
                                    <motion.div
                                        className="w-full h-8 flex items-center justify-center rounded"
                                        style={{ backgroundColor: getColor(value) }}
                                        whileHover={{ scale: 1.1, zIndex: 10 }}
                                    >
                                        <span className="font-mono text-white font-bold mix-blend-difference">{value.toFixed(2)}</span>
                                    </motion.div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 p-3 bg-primary-bg rounded-lg border border-border-color">
                <p className="text-sm text-accent"><span className="font-bold">AI Insight:</span> High positive correlation (+0.85) detected between BTC/USD and NASDAQ. This suggests a concentration of risk in tech-sensitive assets.</p>
            </div>
        </Card>
    );
};

export default CorrelationHeatmap;
