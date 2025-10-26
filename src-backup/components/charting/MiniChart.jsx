import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import 'react-resizable/css/styles.css';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const MiniChart = ({ isVisible, onClose }) => {
  const [size, setSize] = useState({ width: 400, height: 300 });

  if (!isVisible) return null;

  const onResize = (event, { size }) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <Draggable handle=".drag-handle">
      <Resizable width={size.width} height={size.height} onResize={onResize} minConstraints={[200, 150]}>
        <div className="bg-card-bg border border-border-color rounded-lg shadow-2xl flex flex-col" style={{ width: size.width, height: size.height }}>
          <div className="drag-handle bg-primary-bg p-2 flex justify-between items-center cursor-move rounded-t-lg">
            <span className="font-bold text-text-primary">EUR/USD</span>
            <div className="flex items-center">
              <button className="p-1 hover:bg-white/20 rounded"><Minimize2 size={16} /></button>
              <button className="p-1 hover:bg-white/20 rounded"><Maximize2 size={16} /></button>
              <button onClick={onClose} className="p-1 hover:bg-red-500/50 rounded"><X size={16} /></button>
            </div>
          </div>
          <div className="flex-grow p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip />
                <Line type="monotone" dataKey="pv" stroke="var(--accent)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default MiniChart;
