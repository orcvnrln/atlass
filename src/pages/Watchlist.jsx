import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, X, Bell, Download, Star, TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AssetSearch from '@/components/workspace/AssetSearch';
import { getAssetData } from '@/data/marketData';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';
import FavoriteButton from '@/components/watchlist/FavoriteButton';
import PortfolioSimulationModal from '@/components/watchlist/PortfolioSimulationModal';
import PortfolioSimulationTab from '@/components/watchlist/PortfolioSimulationTab';
import PortfolioPnLTracker from '@/components/watchlist/PortfolioPnLTracker';
import FavoritesManager from '@/components/watchlist/FavoritesManager';

const mockWatchlist = [
    getAssetData('EURUSD'),
    getAssetData('BTCUSD'),
    getAssetData('AAPL'),
];

const Watchlist = () => {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState(mockWatchlist);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [favorites, setFavorites] = useLocalStorage('watchlist-favorites', []);
    const [portfolioSimulation, setPortfolioSimulation] = useLocalStorage('portfolio-simulation', {});
    const [activeTab, setActiveTab] = useState('watchlist');
    const [alerts, setAlerts] = useLocalStorage('watchlist-alerts', {});

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
        // Remove from favorites and portfolio simulation
        setFavorites(prev => prev.filter(fav => fav !== symbol));
        setPortfolioSimulation(prev => {
            const updated = { ...prev };
            delete updated[symbol];
            return updated;
        });
    };

    const toggleFavorite = (symbol) => {
        setFavorites(prev =>
            prev.includes(symbol)
                ? prev.filter(fav => fav !== symbol)
                : [...prev, symbol]
        );
    };

    const addToPortfolioSimulation = (symbol, positionData) => {
        setPortfolioSimulation(prev => ({
            ...prev,
            [symbol]: {
                ...positionData,
                currentPrice: getAssetData(symbol)?.price || positionData.entryPrice
            }
        }));
    };

    const updatePortfolioPosition = (symbol) => {
        const position = portfolioSimulation[symbol];
        if (position) {
            setSelectedSymbol(symbol);
            setSimulationModalOpen(true);
        }
    };

    const closePortfolioPosition = (symbol) => {
        setPortfolioSimulation(prev => {
            const updated = { ...prev };
            delete updated[symbol];
            return updated;
        });
    };

    const calculatePnL = (symbol, position) => {
        const currentAsset = getAssetData(symbol);
        if (!currentAsset || !position) return { pnl: 0, pnlPercent: 0 };

        const currentPrice = currentAsset.price;
        const pnl = (currentPrice - position.entryPrice) * position.quantity;
        const pnlPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;

        return { pnl, pnlPercent };
    };

    const handleOpenChart = (item) => {
        navigate('/workspace/institutional', {
            state: { symbol: item.symbol },
        });
    };

  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const openSimulationModal = (symbol) => {
    setSelectedSymbol(symbol);
    setSimulationModalOpen(true);
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-primary-bg p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-accent-orange text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Watchlist
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-accent-orange text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'simulation'
                ? 'bg-accent-orange text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Portfolio Simulation
          </button>
        </div>

        {activeTab === 'watchlist' && (
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
                    <tr 
                        key={item.symbol} 
                        className="table-row border-t border-border-on-card cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => handleOpenChart(item)}
                    >
                        <td className="table-padding font-bold text-text-on-card-primary">
                            <div className="flex items-center gap-3 group">
                                <span className="text-2xl">{item.flag}</span>
                                <div className="flex-1">
                                    <p className="font-mono text-lg group-hover:text-primary transition-colors">{item.symbol}</p>
                                    <p className="text-xs text-text-on-card-secondary font-light">{item.name}</p>
                                </div>
                                <FavoriteButton
                                    symbol={item.symbol}
                                    isFavorite={favorites.includes(item.symbol)}
                                    onToggle={toggleFavorite}
                                />
                            </div>
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
                        <td className="table-padding flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); }}
                                className="hover:bg-accent/20 transition-all duration-200 text-text-on-card-secondary hover:text-accent"
                                title="Set Alert"
                            >
                                <Bell size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); openSimulationModal(item.symbol); }}
                                className="hover:bg-accent-green/20 transition-all duration-200 text-text-on-card-secondary hover:text-accent-green"
                                title="Add to Portfolio Simulation"
                            >
                                <BarChart3 size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); removeAsset(item.symbol); }}
                                className="hover:bg-negative/20 transition-all duration-200 text-text-on-card-secondary hover:text-negative"
                                title="Remove from Watchlist"
                            >
                                <X size={16} />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <FavoritesManager
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              watchlist={watchlist}
              onNavigateToAsset={handleOpenChart}
            />
          </motion.div>
        )}

        {activeTab === 'simulation' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <PortfolioPnLTracker
              portfolioSimulation={portfolioSimulation}
              onUpdatePosition={updatePortfolioPosition}
              onClosePosition={closePortfolioPosition}
            />
          </motion.div>
        )}

        {/* Portfolio Simulation Modal */}
        <PortfolioSimulationModal
          isOpen={simulationModalOpen}
          onClose={() => setSimulationModalOpen(false)}
          symbol={selectedSymbol}
          currentPrice={selectedSymbol ? getAssetData(selectedSymbol)?.price : null}
          onAddPosition={addToPortfolioSimulation}
        />
      </div>
    </div>
  );
};

export default Watchlist;