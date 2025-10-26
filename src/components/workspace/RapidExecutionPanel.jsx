import React from 'react';
import { Zap, Brain } from 'lucide-react';
import AdvancedTradingPanel from '@/components/trading/AdvancedTradingPanel';

const RapidExecutionPanel = ({ symbol = 'EUR/USD', currentPrice }) => {
    const normalizedPrice = currentPrice || 1.0;
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/50">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md">
                    <Zap size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                    AI-Powered Execution Suite
                </h3>
                <div className="ml-auto">
                    <Brain size={14} className="text-blue-400 animate-pulse" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <AdvancedTradingPanel symbol={symbol} currentPrice={normalizedPrice} />
            </div>
        </div>
    );
};

export default RapidExecutionPanel;
