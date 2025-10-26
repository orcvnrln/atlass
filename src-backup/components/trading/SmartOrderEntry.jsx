import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Target, ArrowRight } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';

const SmartOrderEntry = ({ asset }) => {
  const { addEntry } = useJournal();
  const { user } = useUser();
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [riskPercent, setRiskPercent] = useState(user.riskPercentage.toString());
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const calculateAmountFromRisk = () => {
    if (!asset || !stopLoss) return '';
    const riskAmount = user.portfolioValue * (parseFloat(riskPercent) / 100);
    const riskPerShare = Math.abs(asset.price - parseFloat(stopLoss));
    if (riskPerShare === 0) return '';
    const quantity = riskAmount / riskPerShare;
    return quantity.toFixed(4);
  };

  const handlePlaceOrder = () => {
    const tradeAmount = amount || calculateAmountFromRisk();
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      toast({
        title: 'Invalid Order',
        description: 'Please set an amount or risk parameters.',
        variant: 'destructive',
      });
      return;
    }

    addEntry({
      type: 'auto',
      asset: asset.symbol,
      action: side,
      price: asset.price,
      amount: parseFloat(tradeAmount),
      stopLoss: parseFloat(stopLoss),
      takeProfit: parseFloat(takeProfit),
    });

    toast({
      title: 'Trade Executed & Journaled',
      description: `${side.toUpperCase()} ${tradeAmount} ${asset.symbol} at ${asset.price}`,
    });
  };

  return (
    <motion.div 
        className="bg-card-bg rounded-xl card-elevation border border-border-on-card p-4 h-full flex flex-col"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-text-primary mb-4">Trade {asset.symbol}</h3>
      
      {/* Side (Buy/Sell) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => setSide('buy')} className={`py-2 rounded-md font-semibold transition-colors ${side === 'buy' ? 'bg-positive text-black' : 'bg-white/5 hover:bg-white/10'}`}>BUY</button>
        <button onClick={() => setSide('sell')} className={`py-2 rounded-md font-semibold transition-colors ${side === 'sell' ? 'bg-negative text-black' : 'bg-white/5 hover:bg-white/10'}`}>SELL</button>
      </div>

      {/* Order Type */}
      <div className="flex text-sm border-b border-border-color mb-4">
        {['market', 'limit'].map(type => (
          <button key={type} onClick={() => setOrderType(type)} className={`capitalize pb-2 px-4 font-semibold transition-colors ${orderType === type ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white'}`}>
            {type}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="space-y-3 flex-grow">
        <div>
          <label className="text-xs text-text-secondary">Amount ({asset.symbol.split('/')[0]})</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-primary-bg p-2 rounded-md border border-border-color focus:outline-none focus:border-accent"/>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="flex-grow">
                <label className="text-xs text-text-secondary">Risk</label>
                <select value={riskPercent} onChange={e => setRiskPercent(e.target.value)} className="w-full bg-primary-bg p-2 rounded-md border border-border-color focus:outline-none focus:border-accent appearance-none">
                    <option value="0.5">0.5%</option>
                    <option value="1">1%</option>
                    <option value="2">2%</option>
                </select>
           </div>
           <ArrowRight size={16} className="text-text-secondary mt-5"/>
           <div className="flex-grow">
               <label className="text-xs text-text-secondary">Calculated Amount</label>
               <div className="w-full bg-primary-bg p-2 rounded-md border border-border-color text-text-primary font-mono">{calculateAmountFromRisk()}</div>
           </div>
        </div>

        <div>
          <label className="text-xs text-text-secondary flex items-center"><Shield size={12} className="mr-1"/> Stop Loss</label>
          <input type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="Price" className="w-full bg-primary-bg p-2 rounded-md border border-border-color focus:outline-none focus:border-accent"/>
        </div>
        <div>
          <label className="text-xs text-text-secondary flex items-center"><Target size={12} className="mr-1"/> Take Profit</label>
          <input type="number" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="Price" className="w-full bg-primary-bg p-2 rounded-md border border-border-color focus:outline-none focus:border-accent"/>
        </div>
      </div>
      
      {/* Submit Button */}
      <button 
        onClick={handlePlaceOrder}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 mt-4"
      >
        <span>Place {side.toUpperCase()} Order</span>
        <Zap size={16} />
      </button>

    </motion.div>
  );
};

export default SmartOrderEntry;
