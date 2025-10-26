/**
 * ⚠️ AI RISK MARKER COMPONENT
 * Displays AI-calculated risk zones, support/resistance levels, and risk-reward areas
 * Professional risk visualization with transparent overlays and dynamic markers
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IChartApi } from 'lightweight-charts';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AISignal {
  id: string;
  type: 'breakout' | 'pullback' | 'liquidity_grab' | 'reversal';
  confidence: number;
  price: number;
  timestamp: number;
  message: string;
  riskReward?: number;
}

interface RiskZone {
  id: string;
  type: 'support' | 'resistance' | 'risk' | 'reward';
  price: number;
  strength: number;
  width: number;
}

interface AIRiskMarkerProps {
  signals: AISignal[];
  chartRef: React.RefObject<IChartApi | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AIRiskMarker: React.FC<AIRiskMarkerProps> = ({
  signals,
  chartRef
}) => {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [currentPrice, setCurrentPrice] = useState(45000);

  // ─── GENERATE RISK ZONES FROM AI SIGNALS ───
  useEffect(() => {
    const generateRiskZones = () => {
      const zones: RiskZone[] = [];

      signals.forEach((signal) => {
        // Support/Resistance zones based on signal type
        if (signal.type === 'breakout') {
          zones.push({
            id: `resistance-${signal.id}`,
            type: 'resistance',
            price: signal.price + (signal.price * 0.002), // 0.2% above
            strength: signal.confidence,
            width: signal.price * 0.001 // 0.1% width
          });
        }

        if (signal.type === 'reversal') {
          zones.push({
            id: `support-${signal.id}`,
            type: 'support',
            price: signal.price - (signal.price * 0.002), // 0.2% below
            strength: signal.confidence,
            width: signal.price * 0.001 // 0.1% width
          });
        }

        // Risk/Reward zones
        if (signal.riskReward) {
          const riskDistance = signal.price * 0.01; // 1% risk
          const rewardDistance = riskDistance * signal.riskReward;

          zones.push({
            id: `risk-${signal.id}`,
            type: 'risk',
            price: signal.price - riskDistance,
            strength: 0.8,
            width: riskDistance * 0.5
          });

          zones.push({
            id: `reward-${signal.id}`,
            type: 'reward',
            price: signal.price + rewardDistance,
            strength: 0.8,
            width: rewardDistance * 0.3
          });
        }
      });

      // Add dynamic support/resistance based on price action
      const priceRanges = [
        currentPrice * 0.995, // 0.5% below
        currentPrice * 1.005, // 0.5% above
        currentPrice * 0.99,  // 1% below
        currentPrice * 1.01   // 1% above
      ];

      priceRanges.forEach((price, index) => {
        zones.push({
          id: `dynamic-${index}`,
          type: index % 2 === 0 ? 'support' : 'resistance',
          price,
          strength: 0.6 - (index * 0.1),
          width: price * 0.0005
        });
      });

      setRiskZones(zones);
    };

    generateRiskZones();
  }, [signals, currentPrice]);

  // ─── MOCK CURRENT PRICE UPDATE ───
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 10);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ─── ZONE STYLING ───
  const getZoneStyle = (zone: RiskZone) => {
    switch (zone.type) {
      case 'support':
        return {
          backgroundColor: `rgba(0, 255, 156, ${zone.strength * 0.2})`,
          borderColor: '#00ff9c',
          label: 'Support',
          icon: '🛡️'
        };
      case 'resistance':
        return {
          backgroundColor: `rgba(255, 77, 77, ${zone.strength * 0.2})`,
          borderColor: '#ff4d4d',
          label: 'Resistance',
          icon: '🚧'
        };
      case 'risk':
        return {
          backgroundColor: `rgba(255, 77, 77, ${zone.strength * 0.15})`,
          borderColor: '#ff4d4d',
          label: 'Risk Zone',
          icon: '⚠️'
        };
      case 'reward':
        return {
          backgroundColor: `rgba(0, 255, 156, ${zone.strength * 0.15})`,
          borderColor: '#00ff9c',
          label: 'Target Zone',
          icon: '🎯'
        };
      default:
        return {
          backgroundColor: 'rgba(0, 194, 255, 0.1)',
          borderColor: '#00c2ff',
          label: 'Zone',
          icon: '📍'
        };
    }
  };

  // ─── RISK ZONE COMPONENT ───
  const RiskZone: React.FC<{ zone: RiskZone; index: number }> = ({ zone, index }) => {
    const style = getZoneStyle(zone);
    const distanceFromCurrent = Math.abs(zone.price - currentPrice);
    const isNearCurrent = distanceFromCurrent < currentPrice * 0.01; // Within 1%

    return (
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="absolute left-0 right-0 border-dashed border-l-2 pointer-events-none"
        style={{
          top: `${40 + index * 60}px`, // Mock positioning
          height: `${zone.width / zone.price * 10000}px`,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          minHeight: '2px'
        }}
      >
        {/* Zone Label */}
        <motion.div
          className="absolute right-2 top-0 flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            color: style.borderColor
          }}
          animate={isNearCurrent ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isNearCurrent ? Infinity : 0 }}
        >
          <span>{style.icon}</span>
          <span>{style.label}</span>
          <span className="text-gray-400">${zone.price.toFixed(2)}</span>
        </motion.div>

        {/* Strength Indicator */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-current to-transparent opacity-50" />
      </motion.div>
    );
  };

  // ─── RISK SUMMARY ───
  const RiskSummary: React.FC = () => {
    const supportZones = riskZones.filter(z => z.type === 'support').length;
    const resistanceZones = riskZones.filter(z => z.type === 'resistance').length;
    const riskRewardRatio = signals.find(s => s.riskReward)?.riskReward || 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 left-4 z-20"
      >
        <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-yellow-500 text-sm font-semibold">Risk Analysis</span>
          </div>
          
          <div className="space-y-1 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Support Levels:</span>
              <span className="text-[#00ff9c]">{supportZones}</span>
            </div>
            <div className="flex justify-between">
              <span>Resistance Levels:</span>
              <span className="text-[#ff4d4d]">{resistanceZones}</span>
            </div>
            {riskRewardRatio > 0 && (
              <div className="flex justify-between">
                <span>R/R Ratio:</span>
                <span className="text-[#00c2ff]">{riskRewardRatio}:1</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── CURRENT PRICE MARKER ───
  const CurrentPriceMarker: React.FC = () => (
    <motion.div
      className="absolute left-0 right-0 z-30 pointer-events-none"
      style={{ top: '300px' }} // Mock current price position
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        <div className="h-px bg-[#00c2ff] shadow-lg shadow-[#00c2ff]/50" />
        <div className="absolute right-2 top-0 transform -translate-y-1/2 bg-[#00c2ff] text-black px-2 py-1 rounded text-xs font-semibold">
          ${currentPrice.toFixed(2)}
        </div>
        <div className="absolute left-0 top-0 w-2 h-2 bg-[#00c2ff] rounded-full transform -translate-y-1/2 animate-pulse" />
      </div>
    </motion.div>
  );

  // ─── RENDER ───
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Risk Zones */}
      <AnimatePresence mode="popLayout">
        {riskZones.map((zone, index) => (
          <RiskZone key={zone.id} zone={zone} index={index} />
        ))}
      </AnimatePresence>

      {/* Current Price Marker */}
      <CurrentPriceMarker />

      {/* Risk Summary */}
      <RiskSummary />

      {/* AI Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 z-20"
      >
        <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500 text-sm font-semibold">Risk Level</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-xs text-white">Medium</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIRiskMarker;
