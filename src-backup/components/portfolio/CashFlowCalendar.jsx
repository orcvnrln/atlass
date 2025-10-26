import React from 'react';
import Card from '@/components/dashboard/Card';
import { Calendar, DollarSign } from 'lucide-react';

const mockCashFlow = [
    { date: '2025-10-15', type: 'Dividend', symbol: 'AAPL', amount: 120.00 },
    { date: '2025-10-22', type: 'Coupon', symbol: 'US10Y', amount: 55.00 },
    { date: '2025-11-01', type: 'Staking', symbol: 'ETH', amount: 25.50 },
];

const CashFlowCalendar = () => {
    return (
        <Card title="Cash Flow Calendar" className="col-span-1">
            <p className="text-sm text-text-secondary mb-4">
                Tracks upcoming income events like dividends and coupon payments.
            </p>
            <div className="space-y-3">
                {mockCashFlow.map(event => (
                    <div key={event.date} className="flex items-center justify-between bg-card-bg p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-accent" />
                            <div>
                                <p className="font-mono text-text-primary">{event.date}</p>
                                <p className="text-xs text-text-secondary">{event.type} from <span className="font-bold text-text-primary">{event.symbol}</span></p>
                            </div>
                        </div>
                        <p className="font-mono text-positive text-lg font-bold">+${event.amount.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CashFlowCalendar;
