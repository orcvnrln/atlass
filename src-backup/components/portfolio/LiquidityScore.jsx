import React from 'react';
import Card from '@/components/dashboard/Card';
import { motion } from 'framer-motion';

const LiquidityScore = ({ data }) => {
    const overallScore = data.reduce((acc, asset) => acc + asset.score * asset.weight, 0);

    const getScoreColor = (score) => {
        if (score > 80) return 'bg-positive';
        if (score > 50) return 'bg-yellow-500';
        return 'bg-negative';
    };

    return (
        <Card title="Liquidity Score" className="col-span-1">
            <p className="text-sm text-text-secondary mb-4">
                Assesses how quickly your assets can be converted to cash without significant price impact.
            </p>
            <div className="text-center mb-4">
                <p className="text-sm text-text-secondary">Overall Portfolio Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(overallScore).replace('bg-', 'text-')}`}>{overallScore.toFixed(0)}</p>
            </div>
            <div className="space-y-2">
                {data.map(asset => (
                    <div key={asset.symbol} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-text-primary">{asset.symbol}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-border-color rounded-full">
                                <div className={`h-2 rounded-full ${getScoreColor(asset.score)}`} style={{width: `${asset.score}%`}}></div>
                            </div>
                            <span className="w-8 font-mono text-right">{asset.score}</span>
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 p-2 bg-primary-bg rounded-lg">
                <p className="text-sm text-accent">💡 AI Insight: Your portfolio has a healthy liquidity score, but be mindful of the lower score for Penny Stock.</p>
            </div>
        </Card>
    );
};

export default LiquidityScore;
