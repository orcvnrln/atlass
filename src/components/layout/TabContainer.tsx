import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Import tab components (we'll create these next)
import SignalsHistoryTab from '../tabs/SignalsHistoryTab';
import OrderFlowTab from '../tabs/OrderFlowTab';
import SmartMoneyTab from '../tabs/SmartMoneyTab';
import RiskDashboardTab from '../tabs/RiskDashboardTab';
import BacktestTab from '../tabs/BacktestTab';
import NewsTab from '../tabs/NewsTab';
import PortfolioTab from '../tabs/PortfolioTab';
import SettingsTab from '../tabs/SettingsTab';

interface TabContainerProps {
  activeTab: string;
}

const TabContainer: React.FC<TabContainerProps> = ({ activeTab }) => {
  const { asset } = useSelector((state: RootState) => state.chart);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chart':
        return (
          <div className="text-center py-8 text-slate-400">
            <p>Chart controls and drawing tools will be displayed here</p>
          </div>
        );
      
      case 'signals':
        return <SignalsHistoryTab />;
      
      case 'order-flow':
        return <OrderFlowTab asset={asset} />;
      
      case 'smart-money':
        return <SmartMoneyTab asset={asset} />;
      
      case 'risk':
        return <RiskDashboardTab />;
      
      case 'backtest':
        return <BacktestTab />;
      
      case 'news':
        return <NewsTab asset={asset} />;
      
      case 'portfolio':
        return <PortfolioTab />;
      
      case 'settings':
        return <SettingsTab />;
      
      default:
        return (
          <div className="text-center py-8 text-slate-400">
            <p>Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg min-h-[400px]">
      {renderTabContent()}
    </div>
  );
};

export default TabContainer;
