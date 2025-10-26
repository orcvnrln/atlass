import React from 'react';
import { Activity } from 'lucide-react';
import OrderBookPanel from '@/components/layout/market/OrderBookPanel';
import LiquidityHeatmapChart from '@/components/charts/LiquidityHeatmapChart';
import OrderbookLiquidityDelta from '@/components/charts/OrderbookLiquidityDelta';
import { Button } from '@/components/ui/button';

const OrderBookLiquidityPanel = () => {
    return (
        <div className="bg-card-bg border border-border-on-card rounded-xl p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity size={18} className="text-green-400" /> Order Book & Liquidity
              </h3>
              <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-white">
                Depth Settings
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
              <div className="border border-border-on-card rounded-lg overflow-hidden">
                <OrderBookPanel />
              </div>
              <div className="space-y-4 overflow-hidden flex flex-col">
                <div className="h-1/2 border border-border-on-card rounded-lg overflow-hidden">
                  <LiquidityHeatmapChart />
                </div>
                <div className="h-1/2 border border-border-on-card rounded-lg overflow-hidden">
                  <OrderbookLiquidityDelta />
                </div>
              </div>
            </div>
        </div>
    );
};

export default OrderBookLiquidityPanel;
