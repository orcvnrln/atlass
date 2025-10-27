/**
 * 🎨 AI CHART OVERLAYS
 * Visual overlays for Order Blocks, FVGs, Liquidity Pools, and Trade Markers
 * SVG-based overlays positioned on top of the chart
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OrderBlock,
  FairValueGap,
  LiquidityPool,
  TradeSetup,
} from '../../services/aiTradingAnalyzer';
import { Target, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AIChartOverlaysProps {
  orderBlocks: OrderBlock[];
  fairValueGaps: FairValueGap[];
  liquidityPools: LiquidityPool[];
  tradeSetups: TradeSetup[];
  chartWidth: number;
  chartHeight: number;
  priceToY: (price: number) => number;
  timeToX: (timestamp: number) => number;
  onMarkerClick?: (setup: TradeSetup) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AIChartOverlays: React.FC<AIChartOverlaysProps> = ({
  orderBlocks,
  fairValueGaps,
  liquidityPools,
  tradeSetups,
  chartWidth,
  chartHeight,
  priceToY,
  timeToX,
  onMarkerClick,
}) => {
  // ─── RENDER ORDER BLOCKS ───
  const renderOrderBlocks = () => {
    return orderBlocks.map((ob) => {
      const x = timeToX(ob.timestamp);
      const yHigh = priceToY(ob.high);
      const yLow = priceToY(ob.low);
      const height = Math.abs(yLow - yHigh);
      const width = 100; // Fixed width for visibility

      const color = ob.type === 'bullish' ? 'rgba(0, 200, 150, 0.2)' : 'rgba(232, 69, 69, 0.2)';
      const borderColor = ob.type === 'bullish' ? '#00C896' : '#E84545';

      return (
        <motion.g
          key={ob.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Rectangle */}
          <rect
            x={x - width / 2}
            y={yHigh}
            width={width}
            height={height}
            fill={color}
            stroke={borderColor}
            strokeWidth="1"
            strokeDasharray="4,4"
            rx="2"
          />
          
          {/* Label */}
          <text
            x={x - width / 2 + 5}
            y={yHigh + 12}
            fill={borderColor}
            fontSize="9"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            OB {ob.type === 'bullish' ? '↑' : '↓'}
          </text>
        </motion.g>
      );
    });
  };

  // ─── RENDER FAIR VALUE GAPS ───
  const renderFairValueGaps = () => {
    return fairValueGaps.map((fvg) => {
      const xStart = timeToX(fvg.startTime);
      const xEnd = timeToX(fvg.endTime);
      const yUpper = priceToY(fvg.upper);
      const yLower = priceToY(fvg.lower);
      const height = Math.abs(yLower - yUpper);
      const width = Math.abs(xEnd - xStart);

      const color = fvg.type === 'bullish' ? 'rgba(0, 200, 150, 0.15)' : 'rgba(232, 69, 69, 0.15)';
      const borderColor = fvg.type === 'bullish' ? '#00C896' : '#E84545';

      return (
        <motion.g
          key={fvg.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* FVG Zone */}
          <rect
            x={xStart}
            y={yUpper}
            width={width}
            height={height}
            fill={color}
            stroke={borderColor}
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          
          {/* Diagonal Stripes Pattern */}
          <pattern
            id={`fvg-pattern-${fvg.id}`}
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="10"
              y2="10"
              stroke={borderColor}
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>
          <rect
            x={xStart}
            y={yUpper}
            width={width}
            height={height}
            fill={`url(#fvg-pattern-${fvg.id})`}
          />
          
          {/* Label */}
          <text
            x={xStart + 5}
            y={yUpper + 12}
            fill={borderColor}
            fontSize="8"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            FVG
          </text>
        </motion.g>
      );
    });
  };

  // ─── RENDER LIQUIDITY POOLS ───
  const renderLiquidityPools = () => {
    return liquidityPools.map((pool) => {
      const y = priceToY(pool.price);
      const color = pool.type === 'buy' ? '#00C896' : '#E84545';

      return (
        <motion.g
          key={pool.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Horizontal Line */}
          <line
            x1={0}
            y1={y}
            x2={chartWidth}
            y2={y}
            stroke={color}
            strokeWidth="2"
            strokeDasharray="8,4"
            opacity="0.6"
          />
          
          {/* Circle Markers */}
          {[...Array(Math.floor(chartWidth / 100))].map((_, i) => (
            <circle
              key={i}
              cx={i * 100 + 50}
              cy={y}
              r="3"
              fill={color}
              opacity="0.8"
            />
          ))}
          
          {/* Label */}
          <rect
            x={chartWidth - 100}
            y={y - 10}
            width="95"
            height="18"
            fill="rgba(11, 13, 16, 0.9)"
            stroke={color}
            strokeWidth="1"
            rx="3"
          />
          <text
            x={chartWidth - 95}
            y={y + 3}
            fill={color}
            fontSize="9"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            {pool.type === 'buy' ? 'Buy' : 'Sell'} Liquidity
          </text>
        </motion.g>
      );
    });
  };

  // ─── RENDER TRADE MARKERS ───
  const renderTradeMarkers = () => {
    return tradeSetups.map((setup) => {
      const xEntry = chartWidth - 150; // Position on right side
      const yEntry = priceToY(setup.entry);
      const ySL = priceToY(setup.stopLoss);
      const yTP1 = priceToY(setup.takeProfit1);
      const yTP2 = priceToY(setup.takeProfit2);
      const yTP3 = priceToY(setup.takeProfit3);

      const isBuy = setup.type === 'BUY';
      const mainColor = isBuy ? '#00C896' : '#E84545';

      return (
        <motion.g
          key={setup.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          {/* Entry Marker */}
          <g
            className="cursor-pointer"
            onClick={() => onMarkerClick?.(setup)}
          >
            {/* Entry Line */}
            <line
              x1={xEntry - 30}
              y1={yEntry}
              x2={chartWidth - 10}
              y2={yEntry}
              stroke={mainColor}
              strokeWidth="2"
            />
            
            {/* Entry Icon */}
            <circle
              cx={xEntry}
              cy={yEntry}
              r="12"
              fill={mainColor}
              stroke="#0B0D10"
              strokeWidth="2"
            />
            {isBuy ? (
              <path
                d={`M${xEntry} ${yEntry - 5} L${xEntry - 4} ${yEntry + 3} L${xEntry + 4} ${yEntry + 3} Z`}
                fill="white"
              />
            ) : (
              <path
                d={`M${xEntry} ${yEntry + 5} L${xEntry - 4} ${yEntry - 3} L${xEntry + 4} ${yEntry - 3} Z`}
                fill="white"
              />
            )}
            
            {/* Entry Label */}
            <rect
              x={xEntry + 15}
              y={yEntry - 10}
              width="55"
              height="18"
              fill="rgba(11, 13, 16, 0.95)"
              stroke={mainColor}
              strokeWidth="1.5"
              rx="3"
            />
            <text
              x={xEntry + 20}
              y={yEntry + 3}
              fill={mainColor}
              fontSize="10"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              ${setup.entry.toFixed(2)}
            </text>
          </g>

          {/* Stop Loss Marker */}
          <g>
            <line
              x1={xEntry - 20}
              y1={ySL}
              x2={chartWidth - 10}
              y2={ySL}
              stroke="#E84545"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            />
            <circle cx={xEntry} cy={ySL} r="6" fill="#E84545" opacity="0.8" />
            <text
              x={xEntry + 10}
              y={ySL + 3}
              fill="#E84545"
              fontSize="8"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              SL
            </text>
          </g>

          {/* Take Profit Markers */}
          {[
            { y: yTP1, label: 'TP1', color: '#00C896' },
            { y: yTP2, label: 'TP2', color: '#00E5A5' },
            { y: yTP3, label: 'TP3', color: '#00FFB3' },
          ].map((tp, i) => (
            <g key={i}>
              <line
                x1={xEntry - 20}
                y1={tp.y}
                x2={chartWidth - 10}
                y2={tp.y}
                stroke={tp.color}
                strokeWidth="1.5"
                strokeDasharray="4,2"
                opacity="0.8"
              />
              <circle cx={xEntry} cy={tp.y} r="5" fill={tp.color} opacity="0.8" />
              <text
                x={xEntry + 8}
                y={tp.y + 3}
                fill={tp.color}
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {tp.label}
              </text>
            </g>
          ))}

          {/* R/R Badge */}
          <g transform={`translate(${xEntry - 40}, ${yEntry - 35})`}>
            <rect
              width="70"
              height="20"
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3B82F6"
              strokeWidth="1"
              rx="4"
            />
            <text
              x="35"
              y="13"
              fill="#60A5FA"
              fontSize="9"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              R/R 1:{setup.riskReward.toFixed(2)}
            </text>
          </g>
        </motion.g>
      );
    });
  };

  // ─── RENDER ───
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={chartWidth}
      height={chartHeight}
      style={{ zIndex: 10 }}
    >
      <defs>
        {/* Gradient for glow effects */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="pointer-events-auto">
        {renderOrderBlocks()}
        {renderFairValueGaps()}
        {renderLiquidityPools()}
        {renderTradeMarkers()}
      </g>
    </svg>
  );
};

export default AIChartOverlays;
