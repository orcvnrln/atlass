import React from 'react';
import Card from '@/components/dashboard/Card';
import { Leaf } from 'lucide-react';

const ESGImpactScore = ({ score }) => {
    const getScoreColor = (s) => {
        if (s > 70) return 'text-positive';
        if (s > 40) return 'text-yellow-500';
        return 'text-negative';
    };

    return (
        <Card title="ESG Impact Score" className="col-span-1">
            <p className="text-sm text-text-secondary mb-4">
                Measures your portfolio's alignment with Environmental, Social, and Governance criteria.
            </p>
            <div className="flex items-center justify-center gap-4">
                <Leaf size={48} className={getScoreColor(score)} />
                <div>
                    <p className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</p>
                    <p className="text-sm text-text-secondary">out of 100</p>
                </div>
            </div>
             <div className="mt-4 p-2 bg-primary-bg rounded-lg">
                <p className="text-sm text-accent">💡 AI Insight: Your portfolio is {score > 70 ? 'highly' : 'moderately'} ESG-compliant. Consider reallocating from lower-scoring assets to improve your impact.</p>
            </div>
        </Card>
    );
};

export default ESGImpactScore;
