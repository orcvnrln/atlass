import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';
import ChartCard from '../components/ChartCard';
import Tabs from '../components/Tabs';
import { ArrowUp, ArrowDown } from 'lucide-react';

// --- MOCK DATA ---
const generateTimeSeries = (numPoints, startVal, variance) => 
  Array.from({ length: numPoints }, (_, i) => ({
    time: `T-${numPoints - i}`,
    value: startVal + (Math.random() - 0.5) * variance * i,
  }));

const generateOptionsData = (numStrikes) =>
    Array.from({ length: numStrikes }, (_, i) => ({
    strike: 40000 + i * 1000,
    calls: Math.random() * 5000,
    puts: Math.random() * 5000,
}));
  
const liquidityHistoryData = Array.from({ length: 20 }, (_, x) => 
    Array.from({ length: 20 }, (_, y) => ({ x, y, value: Math.random() * 100 }))
).flat();
const liquidityMapData = generateTimeSeries(30, 68000, 100);
const orderbookDeltaData = generateTimeSeries(30, 0, 500).map(d => ({ ...d, value: d.value - 250 }));
const openInterestData = generateTimeSeries(50, 10e9, 0.1e9);
const fundingRateData = generateTimeSeries(50, 0.01, 0.005);
const insuranceFundData = generateTimeSeries(50, 1e9, 0.05e9);
const volume24hData = [{ name: 'Volume', value: 45e9 }];
const historicalVolumeData = generateTimeSeries(50, 30e9, 1e9);
const premiumIndexData = generateTimeSeries(50, 50, 20);
const maxPainData = generateOptionsData(10).map(d => ({...d, loss: Math.random() * 1e6}));
const optionsOiByExpiryData = [
    { expiry: '2024-10-25', calls: 8000, puts: 6000 },
    { expiry: '2024-11-29', calls: 12000, puts: 9000 },
    { expiry: '2024-12-27', calls: 15000, puts: 11000 },
];
const optionsOiByStrikeData = generateOptionsData(10);
const bitcoinDominanceData = [{ name: 'BTC', value: 52 }, { name: 'Others', value: 48 }];

// --- Reusable Components ---
const StatCard = ({ title, value, change, isPositive }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-200">{value}</p>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{change}</span>
        </div>
    </div>
);

const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 border border-gray-700 p-2 rounded-md text-sm">
                <p className="label text-gray-400">{`Time: ${label}`}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>{`${p.name}: ${p.value.toLocaleString()}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

// --- Chart Groups ---
const MainCharts = () => (
    <div className="space-y-8">
        {/* Mini Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Funding Rate" value="0.012%" change="+0.002%" isPositive={true} />
            <StatCard title="Premium Index" value="$45.20" change="-$3.10" isPositive={false} />
            <StatCard title="24h Volume" value="$45.1B" change="+5.2B" isPositive={true} />
        </div>

        {/* Liquidity Charts */}
        <div>
            <h2 className="text-xl font-bold mb-4">Liquidity & Order Book</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Liquidity History Heatmap" tooltipText="Visualizes historical liquidity levels across different price points over time. Brighter areas indicate higher liquidity.">
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={liquidityHistoryData.slice(0, 20)}>
                            <XAxis dataKey="x" hide/>
                            <YAxis dataKey="y" hide/>
                            <Tooltip content={<p>Heatmap not available in Recharts, using Bar for representation.</p>} />
                            <Bar dataKey="value">
                                {liquidityHistoryData.slice(0, 20).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`rgba(0, 255, 170, ${entry.value / 100})`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Liquidity Map (Real-time)" tooltipText="Shows a real-time view of limit order concentrations on the order book.">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={liquidityMapData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="time" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip content={<CustomTooltipContent />} />
                            <Area type="monotone" dataKey="value" stroke="#00FFAA" fill="rgba(0, 255, 170, 0.1)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Orderbook Liquidity Delta" tooltipText="Tracks the net change in buy (bid) and sell (ask) liquidity over time.">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orderbookDeltaData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="time" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip content={<CustomTooltipContent />} />
                            <Bar dataKey="value" name="Delta">
                                {orderbookDeltaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#00FFAA' : '#FF0055'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>

        {/* Other Chart Groups */}
         <div className="grid grid-cols-1 gap-6">
             <ChartCard title="Historical Open Interest" tooltipText="Total value of all outstanding futures contracts over time.">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={openInterestData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="time" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" domain={['dataMin', 'dataMax']} tickFormatter={(val) => `${(val / 1e9).toFixed(1)}B`} />
                        <Tooltip content={<CustomTooltipContent />} />
                        <Area type="monotone" dataKey="value" name="Open Interest" stroke="#4C6EF5" fill="rgba(76, 110, 245, 0.1)" />
                    </AreaChart>
                </ResponsiveContainer>
             </ChartCard>
             <ChartCard title="Historical Volume" tooltipText="Total volume of assets traded over a period of time.">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalVolumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="time" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" tickFormatter={(val) => `${(val / 1e9).toFixed(1)}B`} />
                        <Tooltip content={<CustomTooltipContent />} />
                        <Bar dataKey="value" name="Volume" fill="#7C3AED" />
                    </BarChart>
                </ResponsiveContainer>
             </ChartCard>
        </div>

        <div>
            <h2 className="text-xl font-bold mb-4">Options, Sentiment & Risk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <ChartCard title="Max Pain" tooltipText="The strike price at which the largest number of options (puts and calls) expire worthless, causing maximum financial losses for option holders.">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={maxPainData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="strike" stroke="#A0AEC0" tickFormatter={(val) => `${val/1000}k`} />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip content={<CustomTooltipContent />} />
                            <Bar dataKey="loss" fill="#F59E0B" />
                        </BarChart>
                    </ResponsiveContainer>
                 </ChartCard>
                 <ChartCard title="Options OI by Expiry" tooltipText="Open interest for options contracts grouped by their expiration dates.">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={optionsOiByExpiryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="expiry" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip content={<CustomTooltipContent />} />
                            <Legend />
                            <Bar dataKey="calls" stackId="a" fill="#00FFAA" />
                            <Bar dataKey="puts" stackId="a" fill="#FF0055" />
                        </BarChart>
                    </ResponsiveContainer>
                 </ChartCard>
                 <ChartCard title="Options OI by Strike" tooltipText="Open interest for options contracts grouped by their strike prices.">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={optionsOiByStrikeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="strike" stroke="#A0AEC0" tickFormatter={(val) => `${val/1000}k`} />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip content={<CustomTooltipContent />} />
                            <Legend />
                            <Bar dataKey="calls" fill="#00FFAA" />
                            <Bar dataKey="puts" fill="#FF0055" />
                        </BarChart>
                    </ResponsiveContainer>
                 </ChartCard>
            </div>
        </div>

    </div>
);

const AdvancedCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Funding Rate History" tooltipText="Periodic payments exchanged between traders to keep futures contract prices close to the spot price.">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fundingRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="time" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" domain={['dataMin', 'dataMax']} />
                    <Tooltip content={<CustomTooltipContent />} />
                    <Line type="monotone" dataKey="value" name="Funding Rate" stroke="#16C784" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Insurance Fund History" tooltipText="A safety net to cover losses in the event of liquidations that cannot be filled at or better than the bankruptcy price.">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insuranceFundData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="time" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" domain={['dataMin', 'dataMax']} tickFormatter={(val) => `${(val / 1e9).toFixed(2)}B`} />
                    <Tooltip content={<CustomTooltipContent />} />
                    <Area type="monotone" dataKey="value" name="Fund Value" stroke="#4C6EF5" fill="rgba(76, 110, 245, 0.1)" />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Bitcoin Dominance" tooltipText="The ratio of Bitcoin's market capitalization to the total cryptocurrency market capitalization.">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={bitcoinDominanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                         <Cell key="cell-0" fill="#F59E0B" />
                         <Cell key="cell-1" fill="#4A5568" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    </div>
);

const DerivativesChartPage = () => {
  const tabs = [
    { id: 'main', label: 'Main', content: <MainCharts /> },
    { id: 'advanced', label: 'Advanced', content: <AdvancedCharts /> },
  ];

  return (
    <div className="bg-gray-950 min-h-screen text-gray-200 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Crypto Derivatives Charts</h1>
        <p className="text-gray-400">Advanced analytics for professional traders.</p>
      </header>
      <main>
        <Tabs tabs={tabs} defaultTab="main" />
      </main>
    </div>
  );
};

export default DerivativesChartPage;
