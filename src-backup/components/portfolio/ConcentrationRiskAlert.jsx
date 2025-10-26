import React from 'react';
import Card from '@/components/dashboard/Card';
import { AlertTriangle } from 'lucide-react';

const ConcentrationRiskAlert = ({ data, threshold = 0.3 }) => {
    const concentration = data.reduce((acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + asset.weight;
        return acc;
    }, {});

    const highConcentration = Object.entries(concentration).find(([type, weight]) => weight > threshold);

    return (
        <Card title="Concentration Risk Alert" className="col-span-1">
             <p className="text-sm text-text-secondary mb-4">
                Monitors if a large portion of your portfolio is allocated to a single asset or sector.
            </p>
            {highConcentration ? (
                <div className="bg-negative/20 border border-negative text-negative p-4 rounded-lg flex items-center gap-4">
                    <AlertTriangle size={32} />
                    <div>
                        <h4 className="font-bold">High Concentration Risk Detected!</h4>
                        <p className="text-sm">{(highConcentration[1] * 100).toFixed(0)}% of your portfolio is in {highConcentration[0]}s. Consider diversifying.</p>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-text-secondary">No significant concentration risks detected.</div>
            )}
        </Card>
    );
};

export default ConcentrationRiskAlert;
