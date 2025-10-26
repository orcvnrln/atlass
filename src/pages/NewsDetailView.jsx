import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, Clock, BookOpen, BrainCircuit, Shield, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA (Self-contained in the component) ---
const mockNewsData = {
    id: 1,
    headline: 'Federal Reserve Hints at Interest Rate Hikes to Curb Inflation',
    source: 'Bloomberg',
    timestamp: 'October 2, 2025, 08:30 AM GMT',
    sentiment: 'bearish',
    fullText: `Federal Reserve officials, speaking at the annual economic symposium, suggested that a series of aggressive interest rate hikes might be necessary to bring soaring inflation under control. The market, which had previously priced in a more dovish stance, is now recalibrating for a potentially prolonged period of monetary tightening. \n\n"We will not hesitate to act decisively to restore price stability," one governor was quoted as saying, a statement that sent ripples through equity and bond markets. The US Dollar Index (DXY) surged to multi-year highs following the news, while major stock indices like the S&P 500 and Nasdaq 100 saw a sharp sell-off. \n\nAnalysts are now forecasting a 75 basis point hike at the next Federal Open Market Committee (FOMC) meeting, with a non-zero probability of a 100 basis point move if upcoming inflation data remains elevated. The hawkish pivot marks a significant shift from the central bank's previous rhetoric and is expected to increase borrowing costs for consumers and corporations alike, potentially slowing down economic growth in the coming quarters. This development puts additional pressure on emerging markets, which may face capital outflows as investors seek the safety of higher-yielding US assets.`,
    aiSummary: {
        summary: 'The Federal Reserve has signaled a more aggressive stance on interest rate hikes to combat high inflation. Markets are now anticipating larger rate increases, leading to a stronger US Dollar and a downturn in stock markets. This hawkish policy shift is expected to slow economic growth and impact global capital flows.',
        impactScore: 5,
        affectedAssets: ['USD', 'SPX500', 'NASDAQ', 'BONDS'],
    },
    aiDeepAnalysis: {
        whyItMatters: 'This represents a major pivot from the Fed\'s previous "transitory" inflation narrative. It signals that the central bank is now prioritizing inflation control over short-term economic growth, which has significant implications for asset valuation models that rely on low discount rates.',
        historicalPrecedent: 'The current rhetoric is reminiscent of the early 1980s under Fed Chair Paul Volcker, who aggressively raised rates to break the back of stagflation. While the economic context is different, the parallel suggests a willingness to endure economic pain to achieve long-term price stability.',
        marketRegimeCorrelation: 'In the current "high inflation, slowing growth" market regime, this news reinforces a risk-off sentiment. It strengthens the existing negative correlation between equities and bonds and enhances the US Dollar\'s status as the primary safe-haven asset.',
    },
    stressTestScenarios: [
        { id: 'cpi', label: 'If next CPI > 4%', impact: { BTC: -7.5, SPX: -4.2, USD: 2.1 } },
        { id: 'fed', label: 'If Fed hikes by 100bps', impact: { BTC: -12.0, SPX: -6.8, USD: 3.5 } },
    ],
    tradeIdeas: [
        {
            idea: 'Short EUR/USD below 1.0800',
            rationale: 'A strengthening USD and potential economic slowdown in Europe could pressure the pair.',
            risk: 'High',
            rr: '3.5:1',
            timeHorizon: '1-2 Weeks',
        },
        {
            idea: 'Buy Gold (XAU/USD) on dips',
            rationale: 'As a traditional inflation hedge and safe-haven, gold may attract inflows if equity market volatility persists.',
            risk: 'Medium',
            rr: '2.5:1',
            timeHorizon: '2-4 Weeks',
        },
    ],
};


// --- SUB-COMPONENTS (Self-contained) ---

const SentimentBadge = ({ sentiment }) => {
    const config = {
        bullish: { icon: <TrendingUp size={14} />, text: 'Bullish', color: 'text-green-400 bg-green-500/10' },
        bearish: { icon: <TrendingDown size={14} />, text: 'Bearish', color: 'text-red-400 bg-red-500/10' },
        neutral: { icon: <Zap size={14} />, text: 'Neutral', color: 'text-yellow-400 bg-yellow-500/10' },
    };
    const { icon, text, color } = config[sentiment] || config.neutral;
    return (
        <div className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${color}`}>
            {icon}
            <span>{text}</span>
        </div>
    );
};

const StressTestSimulator = ({ scenarios }) => {
    const [scenarioData, setScenarioData] = useState(scenarios[0].impact);
    const chartData = Object.keys(scenarioData).map(key => ({ name: key, value: scenarioData[key] }));

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2"><BrainCircuit size={20} /> Stress Test Simulator</h3>
            <div className="space-y-4">
                 {scenarios.map(s => <button key={s.id} onClick={() => setScenarioData(s.impact)} className="w-full text-left p-3 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors focus:outline-none focus:border-blue-500">{s.label}</button>)}
                <div className="h-48 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={50} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#26A69A' : '#EF5350'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

const NewsDetailView = () => {
    const navigate = useNavigate();
    const news = mockNewsData; // In a real app, you'd fetch this based on an ID from useParams

    return (
        <div className="bg-gray-950 min-h-screen text-gray-200">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                    <ChevronLeft size={20} />
                    Back to News Hub
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* News Header */}
                        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{news.headline}</h1>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center gap-3">
                                    <span>{news.source}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {news.timestamp}</span>
                                </div>
                                <SentimentBadge sentiment={news.sentiment} />
                            </div>
                        </motion.header>

                        {/* Full Article */}
                        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <div className="max-h-[40vh] overflow-y-auto scrollbar-thin p-4 bg-gray-900 rounded-lg border border-gray-800">
                                <p className="whitespace-pre-wrap leading-relaxed">{news.fullText}</p>
                            </div>
                        </motion.section>

                        {/* AI Deep Analysis */}
                        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                             <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen size={22} /> AI Deep Analysis</h2>
                                <div className="space-y-4 text-gray-300">
                                    <div>
                                        <h4 className="font-semibold text-gray-100">Why This Matters</h4>
                                        <p className="text-sm">{news.aiDeepAnalysis.whyItMatters}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-100">Historical Precedent</h4>
                                        <p className="text-sm">{news.aiDeepAnalysis.historicalPrecedent}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-100">Market Regime Correlation</h4>
                                        <p className="text-sm">{news.aiDeepAnalysis.marketRegimeCorrelation}</p>
                                    </div>
                                </div>
                             </div>
                        </motion.section>
                        
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1 space-y-8 mt-8 lg:mt-0">
                        {/* AI Summary */}
                        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 rounded-lg border border-gray-800 p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={22} /> AI Summary</h2>
                            <p className="text-sm text-gray-300 mb-4">{news.aiSummary.summary}</p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold">Market Impact Score:</span>
                                <span className="text-xl font-bold text-red-400">{news.aiSummary.impactScore}/5</span>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Affected Assets:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {news.aiSummary.affectedAssets.map(asset => <span key={asset} className="bg-gray-800 text-xs font-medium px-2 py-1 rounded">#{asset}</span>)}
                                </div>
                            </div>
                        </motion.aside>

                         {/* Stress Test */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                           <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                              <StressTestSimulator scenarios={news.stressTestScenarios} />
                           </div>
                        </motion.div>

                         {/* Trade Ideas */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                           <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={22} /> AI Trade Ideas</h2>
                                <div className="space-y-4">
                                    {news.tradeIdeas.map((idea, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                            <p className="font-semibold text-gray-100">{idea.idea}</p>
                                            <p className="text-xs text-gray-400 mb-2">{idea.rationale}</p>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="flex items-center gap-1"><Shield size={12}/>{idea.risk}</span>
                                                <span className="font-mono">R:R {idea.rr}</span>
                                                <span className="font-mono">{idea.timeHorizon}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Add to Journal
                                </button>
                           </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailView;
