import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data Generation
const generateHistoricalVolume = () => {
    return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString(),
        spot: Math.random() * 100000,
        perpetual: Math.random() * 500000,
    }));
};

const generateVolumeByExpiration = () => {
    return ['2024-10-25', '2024-11-29', '2024-12-27', '2025-03-28'].map(exp => ({
        expiry: exp,
        volume: Math.random() * 50000,
    }));
};

const TwentyFourHourVolumeCard = ({ spot, perpetual }) => (
    <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="text-white font-bold mb-2">24h Volume</h4>
        <div className="flex justify-between">
            <div>
                <p className="text-sm text-gray-400">Spot</p>
                <p className="text-2xl font-bold text-white">${spot.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-gray-400">Perpetual</p>
                <p className="text-2xl font-bold text-white">${perpetual.toLocaleString()}</p>
            </div>
        </div>
    </div>
);

const HistoricalVolumeChart = ({ data }) => (
    <div className="bg-gray-700 p-4 rounded-lg h-80">
        <h4 className="text-white font-bold mb-4">Historical Volume</h4>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Legend />
                <Line type="monotone" dataKey="spot" stroke="#8884d8" name="Spot Volume" dot={false} />
                <Line type="monotone" dataKey="perpetual" stroke="#82ca9d" name="Perpetual Volume" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const VolumeByExpirationChart = ({ data }) => (
    <div className="bg-gray-700 p-4 rounded-lg h-80">
        <h4 className="text-white font-bold mb-4">Volume by Expiration</h4>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="expiry" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Bar dataKey="volume" fill="#FFBB28" name="Volume" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);


const VolumeChart = () => {
    const [historicalData] = useState(generateHistoricalVolume());
    const [expirationData] = useState(generateVolumeByExpiration());
    const latestVolume = historicalData[historicalData.length - 1];

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-4">Volume & Market Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <TwentyFourHourVolumeCard spot={latestVolume.spot} perpetual={latestVolume.perpetual} />
                </div>
                <HistoricalVolumeChart data={historicalData} />
                <VolumeByExpirationChart data={expirationData} />
            </div>
        </div>
    );
};

export default VolumeChart;
