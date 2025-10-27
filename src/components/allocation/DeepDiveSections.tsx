import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart2, PieChart, Globe } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- Mock Data ---
const stocksData = {
  topHoldings: [
    { name: 'AAPL', value: '$15,000', weight: '11.8%' },
    { name: 'MSFT', value: '$12,500', weight: '9.8%' },
    { name: 'GOOGL', value: '$10,000', weight: '7.8%' },
  ],
  sectorBreakdown: [
    { name: 'Technology', value: 40, color: '#3B82F6' },
    { name: 'Healthcare', value: 25, color: '#10B981' },
    { name: 'Financials', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 20, color: '#6B7280' },
  ],
  stats: { peRatio: 25.4, marketCap: 'Large', dividendYield: '1.8%' },
};

const cryptoData = {
  performance: [
    { name: 'BTC', price: '$42,150', change: '+2.1%', vol: 'High' },
    { name: 'ETH', price: '$2,340', change: '+5.8%', vol: 'Very High' },
    { name: 'SOL', price: '$95', change: '-1.5%', vol: 'Medium' },
  ],
  stakingRewards: '$520.45 (YTD)',
  defiExposure: '25% (Aave, Uniswap)',
};

// --- Reusable Components ---
const ExpandableCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card-bg rounded-xl border border-border-color overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-text-primary">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <div className="border-t border-border-color pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Section Components ---
const StocksSection: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-bold mb-2">Top 10 Holdings</h4>
      <table className="w-full text-sm">
        <tbody>
          {stocksData.topHoldings.map(h => (
            <tr key={h.name} className="border-b border-border-color">
              <td className="py-1">{h.name}</td>
              <td className="text-right">{h.value}</td>
              <td className="text-right font-bold">{h.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div>
      <h4 className="font-bold mb-2">Sector Breakdown</h4>
      <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie data={stocksData.sectorBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
              {stocksData.sectorBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const CryptoSection: React.FC = () => (
  <div>
    <h4 className="font-bold mb-2">Performance & Volatility</h4>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border-color">
          <th className="text-left py-1">Coin</th>
          <th className="text-right">Price</th>
          <th className="text-right">24h Change</th>
          <th className="text-right">Volatility</th>
        </tr>
      </thead>
      <tbody>
        {cryptoData.performance.map(c => (
          <tr key={c.name}>
            <td className="py-1">{c.name}</td>
            <td className="text-right">{c.price}</td>
            <td className={`text-right ${c.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{c.change}</td>
            <td className="text-right">{c.vol}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div><span className="font-bold">Staking Rewards:</span> {cryptoData.stakingRewards}</div>
      <div><span className="font-bold">DeFi Exposure:</span> {cryptoData.defiExposure}</div>
    </div>
  </div>
);

const ForexSection: React.FC = () => (
    <div>Forex Details Placeholder</div>
);

// --- Main Component ---
const DeepDiveSections: React.FC = () => {
  return (
    <div className="space-y-4">
      <ExpandableCard title="Stocks Deep Dive" icon={BarChart2}>
        <StocksSection />
      </ExpandableCard>
      <ExpandableCard title="Crypto Deep Dive" icon={PieChart}>
        <CryptoSection />
      </ExpandableCard>
      <ExpandableCard title="Forex Deep Dive" icon={Globe}>
        <ForexSection />
      </ExpandableCard>
    </div>
  );
};

export default DeepDiveSections;

