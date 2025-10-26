import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, X, Bell, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AssetSearch from '@/components/workspace/AssetSearch';
import { getAssetData } from '@/data/marketData';
import { Link } from 'react-router-dom';

const mockWatchlist = [
    getAssetData('EURUSD'),
    getAssetData('BTCUSD'),
    getAssetData('AAPL'),
];

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState(mockWatchlist);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addAssetToWatchlist = (symbol) => {
        // Avoid adding duplicates
        if (watchlist.find(item => item.symbol === symbol)) return;

        const newAsset = getAssetData(symbol.replace('/', ''));
        if (newAsset) {
            setWatchlist(prev => [...prev, newAsset]);
        }
        setIsModalOpen(false);
    };

    const removeAsset = (symbol) => {
        setWatchlist(watchlist.filter(item => item.symbol !== symbol));
    };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Watchlist - Blommy</title>
        <meta name="description" content="Customizable watchlist with real-time data and AI alerts." />
      </Helmet>
      <div className="max-w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-1">My Watchlist</h1>
                <p className="text-md text-text-secondary">Your personalized list of assets to track</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Symbol</Button>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            </div>
        </motion.div>
        
        {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-card-bg/80 backdrop-blur-sm flex items-center justify-center">
                <div className='relative'>
                    <AssetSearch onSelectAsset={addAssetToWatchlist} />
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 text-white hover:bg-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="bg-card-bg rounded-xl card-elevation overflow-hidden border border-border-on-card">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
                <thead className="bg-white/5 text-text-on-card-secondary uppercase">
                <tr>
                    <th className="table-padding font-semibold">Symbol</th>
                    <th className="table-padding font-semibold">Price</th>
                    <th className="table-padding font-semibold">Change</th>
                    <th className="table-padding font-semibold">% Change</th>
                    <th className="table-padding font-semibold">Volume</th>
                    <th className="table-padding font-semibold">AI Signal</th>
                    <th className="table-padding font-semibold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {watchlist.map((item) => (
                    <tr key={item.symbol} className="table-row border-t border-border-on-card">
                        <td className="table-padding font-bold text-text-on-card-primary">
                            <Link to={`/asset/${item.symbol}`} className="flex items-center gap-3 group">
                                <span className="text-2xl">{item.flag}</span>
                                <div>
                                    <p className="font-mono text-lg group-hover:text-primary transition-colors">{item.symbol}</p>
                                    <p className="text-xs text-text-on-card-secondary font-light">{item.name}</p>
                                </div>
                            </Link>
                        </td>
                        <td className="table-padding font-mono text-text-on-card-primary text-lg font-semibold">{item.price.toFixed(item.price < 10 ? 4 : 2)}</td>
                        <td className={`table-padding font-mono text-lg font-semibold ${item.change >= 0 ? 'positive' : 'negative'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                        </td>
                        <td className={`table-padding font-mono text-lg font-semibold ${item.percent >= 0 ? 'positive' : 'negative'}`}>
                            {item.percent >= 0 ? '+' : ''}{item.percent.toFixed(2)}%
                        </td>
                        <td className="table-padding font-mono text-text-on-card-secondary text-base">{item.volume}</td>
                        <td className="table-padding font-mono text-accent text-base font-semibold">{item.aiSignal}</td>
                        <td className="table-padding flex gap-3">
                            <Button variant="ghost" size="sm" className="hover:bg-accent/20 transition-all duration-200 text-text-on-card-secondary hover:text-accent">
                                <Bell size={18} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => removeAsset(item.symbol)} className="hover:bg-negative/20 transition-all duration-200 text-text-on-card-secondary hover:text-negative">
                                <X size={18} />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Watchlist;