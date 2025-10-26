import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getAssetData } from '@/data/marketData';
import TradingViewChart from '@/components/charts/TradingViewChart';
import Tabs from '@/components/ui/Tabs'; // Import the new Tabs component
import NewsSentimentTab from '@/components/layout/market/NewsSentimentTab';
import TechnicalAnalysisTab from '@/components/layout/market/TechnicalAnalysisTab';
import FundamentalAnalysisTab from '@/components/layout/market/FundamentalAnalysisTab';
import AITradingSignalTab from '@/components/layout/market/AITradingSignalTab';
import CommunityAlertsTab from '@/components/layout/market/CommunityAlertsTab';
import OrderBookPanel from '@/components/layout/market/OrderBookPanel';
import SmartOrderEntry from '@/components/trading/SmartOrderEntry';
import DepthOfMarketChart from '@/components/layout/market/DepthOfMarketChart';
import { Newspaper, BarChart2, BookOpen, Bot, MessageSquare, Layers } from 'lucide-react';

const MarketDepthTab = () => (
    <div className="flex flex-col gap-4">
        <OrderBookPanel />
        <DepthOfMarketChart />
    </div>
);

const AssetDetail = () => {
  const { symbol } = useParams();
  const asset = getAssetData(symbol);

  const analysisTabs = [
    { label: 'AI Signal', icon: Bot, content: <AITradingSignalTab /> },
    { label: 'News', icon: Newspaper, content: <NewsSentimentTab /> },
    { label: 'Technical', icon: BarChart2, content: <TechnicalAnalysisTab /> },
    { label: 'Fundamental', icon: BookOpen, content: <FundamentalAnalysisTab /> },
    { label: 'Community', icon: MessageSquare, content: <CommunityAlertsTab /> },
  ];

  if (!asset) {
    return <div>Asset not found</div>; // Or a proper loading/error state
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>{asset.name} ({asset.symbol}) - Blommy</title>
        <meta name="description" content={`Detailed analysis and real-time data for ${asset.name} with AI insights and technical indicators.`} />
      </Helmet>

      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{asset.flag}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
              <p className="text-md text-text-secondary monospace">{asset.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold monospace ${asset.change >= 0 ? 'positive' : 'negative'}`}>
              {asset.price.toFixed(asset.price < 10 ? 4 : 2)}
            </p>
            <p className={`text-md font-medium monospace ${asset.change >= 0 ? 'positive' : 'negative'}`}>
              {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)} ({asset.percent.toFixed(2)}%)
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
             <div className="h-[60vh] bg-card-bg rounded-xl card-elevation overflow-hidden mb-6">
                <TradingViewChart symbol={asset.symbol} />
             </div>
             <div className="h-[calc(40vh-150px)] bg-card-bg rounded-xl card-elevation">
                <Tabs tabs={analysisTabs} />
             </div>
          </div>
          <div className="lg:col-span-3">
            <div className="h-full flex flex-col gap-6">
                <SmartOrderEntry asset={asset} />
                <OrderBookPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;