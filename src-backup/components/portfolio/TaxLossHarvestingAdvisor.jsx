import React from 'react';
import Card from '@/components/dashboard/Card';
import { Button } from '@/components/ui/button';

const TaxLossHarvestingAdvisor = ({ data }) => {
    const opportunities = data.filter(pos => pos.pnl < 0);

    return (
        <Card title="Tax-Loss Harvesting Advisor" className="col-span-1">
            <p className="text-sm text-text-secondary mb-4">
                Identifies opportunities to sell assets at a loss to offset capital gains taxes.
            </p>
            {opportunities.length > 0 ? (
                <div className="space-y-2">
                    {opportunities.map(opp => (
                        <div key={opp.symbol} className="bg-card-bg p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-mono text-text-primary">{opp.symbol}</p>
                                <p className="text-xs text-text-secondary">Unrealized Loss: <span className="text-negative font-mono">{opp.pnl.toFixed(2)}</span></p>
                            </div>
                            <Button variant="outline" size="sm">Harvest</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-text-secondary">No tax-loss harvesting opportunities found.</p>
            )}
             <div className="mt-4 p-2 bg-primary-bg rounded-lg">
                <p className="text-sm text-accent">💡 AI Insight: Harvesting losses from AAPL could offset up to $29.40 in capital gains, improving your tax efficiency.</p>
            </div>
        </Card>
    );
};

export default TaxLossHarvestingAdvisor;
