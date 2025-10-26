import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, TrendingUp, TrendingDown, DollarSign, Percent, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PortfolioSimulationModal = ({
  isOpen,
  onClose,
  symbol,
  currentPrice,
  onAddPosition
}) => {
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setEntryPrice] = useState(currentPrice?.toString() || '');
  const [positionType, setPositionType] = useState('long');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity && entryPrice) {
      onAddPosition(symbol, {
        quantity: parseFloat(quantity),
        entryPrice: parseFloat(entryPrice),
        positionType,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        leverage: parseFloat(leverage),
        entryDate: new Date().toISOString()
      });
      onClose();
      setQuantity('');
      setEntryPrice(currentPrice?.toString() || '');
      setStopLoss('');
      setTakeProfit('');
      setLeverage('1');
    }
  };

  const calculateNotionalValue = () => {
    return (parseFloat(quantity) || 0) * (parseFloat(entryPrice) || 0) * (parseFloat(leverage) || 1);
  };

  const calculateRiskReward = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return null;

    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);

    return risk > 0 ? (reward / risk).toFixed(2) : null;
  };

  const calculateMaxLoss = () => {
    if (!quantity || !entryPrice || !stopLoss) return 0;

    const qty = parseFloat(quantity);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const lev = parseFloat(leverage) || 1;

    return Math.abs((entry - sl) * qty * lev);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card-bg rounded-xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Calculator size={20} />
              Add to Portfolio Simulation
            </h3>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-text-secondary text-sm mb-2">Symbol: <span className="text-text-primary font-mono">{symbol}</span></p>
            <p className="text-text-secondary text-sm">Current Price: <span className="text-text-primary font-mono">${currentPrice}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Position Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPositionType('long')}
                  className={`flex-1 p-2 rounded-lg border transition-colors ${
                    positionType === 'long'
                      ? 'border-accent-green bg-accent-green/10 text-accent-green'
                      : 'border-border-on-card text-text-secondary hover:border-accent-green/50'
                  }`}
                >
                  <TrendingUp size={16} className="inline mr-2" />
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setPositionType('short')}
                  className={`flex-1 p-2 rounded-lg border transition-colors ${
                    positionType === 'short'
                      ? 'border-accent-red bg-accent-red/10 text-accent-red'
                      : 'border-border-on-card text-text-secondary hover:border-accent-red/50'
                  }`}
                >
                  <TrendingDown size={16} className="inline mr-2" />
                  Short
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Quantity
              </label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 bg-primary-bg border border-border-on-card rounded-lg text-text-primary focus:border-accent-orange focus:outline-none"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Entry Price
              </label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full p-3 bg-primary-bg border border-border-on-card rounded-lg text-text-primary focus:border-accent-orange focus:outline-none"
                placeholder="Enter entry price"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Target size={14} className="inline mr-1" />
                  Stop Loss
                </label>
                <input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full p-3 bg-primary-bg border border-border-on-card rounded-lg text-text-primary focus:border-accent-orange focus:outline-none"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Target size={14} className="inline mr-1" />
                  Take Profit
                </label>
                <input
                  type="number"
                  step="any"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full p-3 bg-primary-bg border border-border-on-card rounded-lg text-text-primary focus:border-accent-orange focus:outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <DollarSign size={14} className="inline mr-1" />
                Leverage
              </label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full p-3 bg-primary-bg border border-border-on-card rounded-lg text-text-primary focus:border-accent-orange focus:outline-none"
              >
                <option value="1">1:1 (No Leverage)</option>
                <option value="2">1:2</option>
                <option value="5">1:5</option>
                <option value="10">1:10</option>
                <option value="20">1:20</option>
                <option value="50">1:50</option>
                <option value="100">1:100</option>
              </select>
            </div>

            {quantity && entryPrice && (
              <div className="bg-primary-bg p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">Notional Value:</p>
                    <p className="text-lg font-bold text-text-primary">
                      ${calculateNotionalValue().toLocaleString()}
                    </p>
                  </div>
                  {stopLoss && (
                    <div>
                      <p className="text-sm text-text-secondary">Max Loss:</p>
                      <p className="text-lg font-bold text-accent-red">
                        ${calculateMaxLoss().toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                {calculateRiskReward() && (
                  <div className="pt-2 border-t border-border-on-card">
                    <p className="text-sm text-text-secondary">Risk:Reward Ratio:</p>
                    <p className="text-lg font-bold text-accent-green">
                      1:{calculateRiskReward()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                Add Position
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PortfolioSimulationModal;
