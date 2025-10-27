/**
 * 🎨 DRAWING TOOLS MANAGER
 * Interactive drawing tools for technical analysis
 * Trendlines, Fibonacci, Rectangles, Horizontal Lines, etc.
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Grid3x3,
  Square,
  Minus,
  Type,
  Trash2,
  Edit3,
  Palette,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type DrawingType =
  | 'trendline'
  | 'horizontal'
  | 'vertical'
  | 'rectangle'
  | 'fibonacci'
  | 'text'
  | 'arrow';

export interface Drawing {
  id: string;
  type: DrawingType;
  points: Array<{ x: number; y: number }>;
  color: string;
  strokeWidth: number;
  text?: string;
  locked: boolean;
}

interface DrawingToolsManagerProps {
  activeTool: DrawingType | null;
  onToolChange: (tool: DrawingType | null) => void;
  chartWidth: number;
  chartHeight: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const DrawingToolsManager: React.FC<DrawingToolsManagerProps> = ({
  activeTool,
  onToolChange,
  chartWidth,
  chartHeight,
}) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null);
  const [drawingColor, setDrawingColor] = useState('#00C896');
  const svgRef = useRef<SVGSVGElement>(null);

  // ─── DRAWING TOOLS ───
  const tools: Array<{
    type: DrawingType;
    icon: React.ReactNode;
    name: string;
    hotkey: string;
  }> = [
    { type: 'trendline', icon: <TrendingUp />, name: 'Trend Line', hotkey: 'T' },
    { type: 'horizontal', icon: <Minus />, name: 'Horizontal', hotkey: 'H' },
    { type: 'rectangle', icon: <Square />, name: 'Rectangle', hotkey: 'R' },
    { type: 'fibonacci', icon: <Grid3x3 />, name: 'Fibonacci', hotkey: 'F' },
    { type: 'text', icon: <Type />, name: 'Text', hotkey: 'X' },
  ];

  // ─── HANDLE MOUSE DOWN ───
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!activeTool) return;

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newDrawing: Drawing = {
        id: `drawing_${Date.now()}`,
        type: activeTool,
        points: [{ x, y }],
        color: drawingColor,
        strokeWidth: 2,
        locked: false,
      };

      setCurrentDrawing(newDrawing);
    },
    [activeTool, drawingColor]
  );

  // ─── HANDLE MOUSE MOVE ───
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!currentDrawing) return;

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCurrentDrawing({
        ...currentDrawing,
        points: [currentDrawing.points[0], { x, y }],
      });
    },
    [currentDrawing]
  );

  // ─── HANDLE MOUSE UP ───
  const handleMouseUp = useCallback(() => {
    if (!currentDrawing) return;

    // Only save if we have at least 2 points
    if (currentDrawing.points.length >= 2) {
      setDrawings([...drawings, currentDrawing]);
    }

    setCurrentDrawing(null);
  }, [currentDrawing, drawings]);

  // ─── DELETE DRAWING ───
  const deleteDrawing = (id: string) => {
    setDrawings(drawings.filter((d) => d.id !== id));
    if (selectedDrawing === id) {
      setSelectedDrawing(null);
    }
  };

  // ─── CLEAR ALL ───
  const clearAll = () => {
    if (confirm('Clear all drawings?')) {
      setDrawings([]);
      setCurrentDrawing(null);
      setSelectedDrawing(null);
    }
  };

  // ─── RENDER TRENDLINE ───
  const renderTrendline = (drawing: Drawing) => {
    if (drawing.points.length < 2) return null;

    const [p1, p2] = drawing.points;

    return (
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={drawing.color}
        strokeWidth={drawing.strokeWidth}
        strokeLinecap="round"
      />
    );
  };

  // ─── RENDER HORIZONTAL LINE ───
  const renderHorizontal = (drawing: Drawing) => {
    if (drawing.points.length < 1) return null;

    const y = drawing.points[0].y;

    return (
      <line
        x1={0}
        y1={y}
        x2={chartWidth}
        y2={y}
        stroke={drawing.color}
        strokeWidth={drawing.strokeWidth}
        strokeDasharray="5,5"
      />
    );
  };

  // ─── RENDER RECTANGLE ───
  const renderRectangle = (drawing: Drawing) => {
    if (drawing.points.length < 2) return null;

    const [p1, p2] = drawing.points;
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke={drawing.color}
        strokeWidth={drawing.strokeWidth}
        rx="2"
      />
    );
  };

  // ─── RENDER FIBONACCI ───
  const renderFibonacci = (drawing: Drawing) => {
    if (drawing.points.length < 2) return null;

    const [p1, p2] = drawing.points;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

    return (
      <g>
        {levels.map((level, i) => {
          const y = p1.y + (p2.y - p1.y) * level;

          return (
            <g key={i}>
              <line
                x1={Math.min(p1.x, p2.x)}
                y1={y}
                x2={Math.max(p1.x, p2.x)}
                y2={y}
                stroke={drawing.color}
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.6}
              />
              <text
                x={Math.max(p1.x, p2.x) + 5}
                y={y + 3}
                fill={drawing.color}
                fontSize="10"
                fontFamily="monospace"
              >
                {(level * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // ─── RENDER DRAWING ───
  const renderDrawing = (drawing: Drawing) => {
    const isSelected = selectedDrawing === drawing.id;

    return (
      <g
        key={drawing.id}
        className={isSelected ? 'cursor-move' : 'cursor-pointer'}
        onClick={() => setSelectedDrawing(drawing.id)}
        opacity={drawing.locked ? 0.5 : 1}
      >
        {drawing.type === 'trendline' && renderTrendline(drawing)}
        {drawing.type === 'horizontal' && renderHorizontal(drawing)}
        {drawing.type === 'rectangle' && renderRectangle(drawing)}
        {drawing.type === 'fibonacci' && renderFibonacci(drawing)}

        {/* Selection Handles */}
        {isSelected &&
          drawing.points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke={drawing.color}
              strokeWidth="2"
              className="cursor-grab"
            />
          ))}
      </g>
    );
  };

  // ─── RENDER ───
  return (
    <div className="relative w-full h-full">
      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="absolute inset-0 cursor-crosshair"
        width={chartWidth}
        height={chartHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ zIndex: activeTool ? 20 : 5 }}
      >
        {/* Existing Drawings */}
        {drawings.map(renderDrawing)}

        {/* Current Drawing (Preview) */}
        {currentDrawing && (
          <g opacity={0.7}>
            {currentDrawing.type === 'trendline' && renderTrendline(currentDrawing)}
            {currentDrawing.type === 'horizontal' && renderHorizontal(currentDrawing)}
            {currentDrawing.type === 'rectangle' && renderRectangle(currentDrawing)}
            {currentDrawing.type === 'fibonacci' && renderFibonacci(currentDrawing)}
          </g>
        )}
      </svg>

      {/* Floating Toolbar */}
      {selectedDrawing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-2 flex items-center gap-2 z-30"
        >
          <button
            onClick={() => {
              const drawing = drawings.find((d) => d.id === selectedDrawing);
              if (drawing) {
                // Toggle color
                const newColor = drawing.color === '#00C896' ? '#E84545' : '#00C896';
                setDrawings(
                  drawings.map((d) =>
                    d.id === selectedDrawing ? { ...d, color: newColor } : d
                  )
                );
              }
            }}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            title="Change Color"
          >
            <Palette className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => deleteDrawing(selectedDrawing)}
            className="p-2 hover:bg-red-900/20 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </motion.div>
      )}

      {/* Drawings List */}
      {drawings.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-lg p-3 z-30 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-semibold">
              Drawings ({drawings.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className={`flex items-center justify-between p-2 rounded text-xs transition-colors ${
                  selectedDrawing === drawing.id
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
                onClick={() => setSelectedDrawing(drawing.id)}
              >
                <span className="capitalize">{drawing.type}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDrawing(drawing.id);
                  }}
                  className="hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingToolsManager;
