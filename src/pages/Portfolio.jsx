import React from 'react';
import EnhancedPortfolio from './EnhancedPortfolio';

const Portfolio = () => {
  return <EnhancedPortfolio />;
};

export default Portfolio;
    { name: 'Crypto', value: 35000, color: '#7C3AED' },
    { name: 'Forex', value: 20000, color: '#16C784' },
    { name: 'Commodities', value: 7450.32, color: '#F59E0B' },
  ],
  positions: [
    { symbol: 'TSLA', quantity: 10, avgPrice: 240.78, currentPrice: 248.67, pnl: 78.90, pnlPercent: 3.28, type: 'Stock', weight: 0.20 },
    { symbol: 'AAPL', quantity: 20, avgPrice: 190.90, currentPrice: 189.43, pnl: -29.40, pnlPercent: -0.77, type: 'Stock', weight: 0.30 },
    { symbol: 'BTC/USD', quantity: 0.5, avgPrice: 42550.00, currentPrice: 43250.00, pnl: 350.00, pnlPercent: 0.82, type: 'Crypto', weight: 0.17 },
    { symbol: 'EUR/USD', quantity: 50000, avgPrice: 1.0833, currentPrice: 1.0845, pnl: 60.00, pnlPercent: 0.11, type: 'Forex', weight: 0.25 },
    { symbol: 'GOLD', quantity: 5, avgPrice: 2039.17, currentPrice: 2034.50, pnl: -23.35, pnlPercent: -0.23, type: 'Commodity', weight: 0.08 },
  ],
  performanceHistory: [
    { name: 'Jan', value: 110000 }, { name: 'Feb', value: 112500 }, { name: 'Mar', value: 118000 },
    { name: 'Apr', value: 115000 }, { name: 'May', value: 122000 }, { name: 'Jun', value: 127450 },
  ],
  riskMetrics: {
    var: -2549.01,
    sharpeRatio: 1.84,
    beta: 1.12,
    maxDrawdown: -8.45,
  },
  attribution: [
    { name: 'Stocks', value: 60, color: '#4C6EF5' },
    { name: 'Crypto', value: 30, color: '#7C3AED' },
    { name: 'Forex', value: 10, color: '#16C784' },
  ],
  correlation: {
      labels: ['TSLA', 'AAPL', 'BTC/USD', 'EUR/USD', 'GOLD'],
      matrix: [
          [1.00, 0.65, 0.45, -0.10, -0.30],
          [0.65, 1.00, 0.55, -0.15, -0.35],
          [0.45, 0.55, 1.00, 0.20, -0.50],
          [-0.10, -0.15, 0.20, 1.00, 0.60],
          [-0.30, -0.35, -0.50, 0.60, 1.00],
      ]
  },
  drawdownHistory: [
      { name: 'Jan', drawdown: -2.5 }, { name: 'Feb', drawdown: -1.8 }, { name: 'Mar', drawdown: -5.6 },
      { name: 'Apr', drawdown: -8.45 }, { name: 'May', drawdown: -3.2 }, { name: 'Jun', drawdown: -1.5 },
  ],
  liquidity: [
      { symbol: 'TSLA', score: 95, weight: 0.25 },
      { symbol: 'AAPL', score: 98, weight: 0.30 },
      { symbol: 'BTC/USD', score: 85, weight: 0.20 },
      { symbol: 'EUR/USD', score: 99, weight: 0.15 },
      { symbol: 'GOLD', score: 92, weight: 0.05 },
      { symbol: 'PNSTK', score: 30, weight: 0.05 },
  ],
  sharpeHistory: [
      { name: 'Jan', ratio: 1.5 }, { name: 'Feb', ratio: 1.6 }, { name: 'Mar', ratio: 1.4 },
      { name: 'Apr', ratio: 1.7 }, { name: 'May', ratio: 1.9 }, { name: 'Jun', ratio: 1.83 },
  ],
  allocationScenarios: [
      { name: 'Stocks', value: 50, risk: 8, return: 12 },
      { name: 'Crypto', value: 20, risk: 15, return: 25 },
      { name: 'Bonds', value: 30, risk: 3, return: 5 },
  ],
  esgScore: 78,
  cashFlow: [
      { date: '2025-10-15', type: 'Dividend', symbol: 'AAPL', amount: 120.00 },
      { date: '2025-10-22', type: 'Coupon', symbol: 'US10Y', amount: 55.00 },
      { date: '2025-11-01', type: 'Staking', symbol: 'ETH', amount: 25.50 },
  ],
  benchmarks: [
      { name: 'My Portfolio', return: 15.86 },
      { name: 'S&P 500', return: 12.5 },
      { name: 'Nasdaq 100', return: 18.2 },
      { name: 'Global Crypto', return: 25.5 },
      { name: 'Blommy Pro Users', return: 14.2 },
  ]
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-primary-bg text-text-primary p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Portfolio Analytics</title>
        <meta name="description" content="Advanced portfolio analytics with risk metrics, performance tracking, and stress testing." />
      </Helmet>

      <div className="max-w-full mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
          <p className="text-md text-text-secondary">Deep dive into your investment performance and risk exposure.</p>
        </motion.div>

        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <SummaryCard icon={DollarSign} title="Total Balance" value={portfolioData.summary.totalBalance} pnl={portfolioData.summary.todayPNL} pnlPercent={portfolioData.summary.todayPNLPercent} positive={portfolioData.summary.todayPNL >= 0} />
          <SummaryCard icon={Activity} title="Total Return" value={portfolioData.summary.totalReturn} pnlPercent={portfolioData.summary.totalReturnPercent} positive={portfolioData.summary.totalReturn >= 0} />
          <SummaryCard icon={TrendingUp} title="Best Performer" value={portfolioData.summary.bestPerformer.pnl} isCurrency={true} />
          <SummaryCard icon={TrendingDown} title="Worst Performer" value={portfolioData.summary.worstPerformer.pnl} isCurrency={true} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart data={portfolioData.performanceHistory} />
          </div>
          <AssetAllocation data={portfolioData.allocations} />
        </div>

        <OpenPositions data={portfolioData.positions} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CorrelationHeatmap data={portfolioData.correlation} />
            <DrawdownTracker data={portfolioData.drawdownHistory} />
            <LiquidityScore data={portfolioData.liquidity} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaxLossHarvestingAdvisor data={portfolioData.positions} />
            <ConcentrationRiskAlert data={portfolioData.positions} />
            <RollingSharpeRatio data={portfolioData.sharpeHistory} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AllocationAdvisor data={portfolioData.allocationScenarios} />
            <ESGImpactScore score={portfolioData.esgScore} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CashFlowCalendar data={portfolioData.cashFlow} />
            <PeerBenchmarking data={portfolioData.benchmarks} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;