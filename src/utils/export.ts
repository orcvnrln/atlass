import { format } from 'date-fns';

// Export data to CSV
export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from data if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers
    csvHeaders.join(','),
    // Data rows
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle different data types
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`; // Quote strings with commas
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value)}"`; // Stringify objects
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Export data to JSON
export const exportToJSON = (data: any, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Export chart as image
export const exportChartAsImage = (chartElement: HTMLElement, filename: string) => {
  // Use html2canvas to capture chart
  import('html2canvas').then(html2canvas => {
    html2canvas.default(chartElement, {
      backgroundColor: '#0f172a', // slate-900
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }).catch(error => {
    console.error('Error exporting chart:', error);
  });
};

// Export portfolio report
export const exportPortfolioReport = (portfolioData: any, performanceData: any) => {
  const report = {
    generatedAt: new Date().toISOString(),
    portfolio: portfolioData,
    performance: performanceData,
    summary: {
      totalValue: portfolioData.totalValue,
      totalPnl: portfolioData.totalPnl,
      totalPnlPercent: portfolioData.totalPnlPercent,
      winRate: performanceData.winRate,
      sharpeRatio: performanceData.sharpeRatio,
      maxDrawdown: performanceData.maxDrawdown
    }
  };

  exportToJSON(report, 'portfolio_report');
};

// Export backtest results
export const exportBacktestResults = (results: any, parameters: any) => {
  const report = {
    generatedAt: new Date().toISOString(),
    parameters,
    results,
    summary: {
      totalReturn: results.totalReturn,
      annualizedReturn: results.annualizedReturn,
      winRate: results.winRate,
      profitFactor: results.profitFactor,
      sharpeRatio: results.sharpeRatio,
      maxDrawdown: results.maxDrawdown,
      totalTrades: results.totalTrades
    }
  };

  exportToJSON(report, 'backtest_results');
};

// Export signal history
export const exportSignalHistory = (signals: any[]) => {
  const headers = [
    'Date',
    'Time',
    'Asset',
    'Signal',
    'Confidence',
    'Entry',
    'Status',
    'P&L',
    'P&L%',
    'Hold Time'
  ];

  const csvData = signals.map(signal => ({
    Date: signal.date,
    Time: signal.time,
    Asset: signal.asset,
    Signal: signal.signal,
    Confidence: signal.confidence,
    Entry: signal.entry,
    Status: signal.status,
    'P&L': signal.pnl,
    'P&L%': signal.pnlPercent,
    'Hold Time': signal.holdTime || '-'
  }));

  exportToCSV(csvData, 'signal_history', headers);
};

// Export trade data
export const exportTradeData = (trades: any[]) => {
  const headers = [
    'Trade ID',
    'Date',
    'Symbol',
    'Side',
    'Entry Price',
    'Exit Price',
    'Quantity',
    'P&L',
    'P&L%',
    'Hold Time',
    'Risk/Reward'
  ];

  const csvData = trades.map(trade => ({
    'Trade ID': trade.id,
    Date: trade.date,
    Symbol: trade.symbol,
    Side: trade.side,
    'Entry Price': trade.entry,
    'Exit Price': trade.exit,
    Quantity: trade.quantity,
    'P&L': trade.pnl,
    'P&L%': trade.pnlPercent,
    'Hold Time': trade.holdTime,
    'Risk/Reward': trade.riskReward
  }));

  exportToCSV(csvData, 'trade_data', headers);
};

// Export correlation matrix
export const exportCorrelationMatrix = (correlations: any[]) => {
  const headers = [
    'Symbol 1',
    'Symbol 2',
    'Correlation',
    'P-Value',
    'Confidence',
    'Last Updated'
  ];

  const csvData = correlations.map(corr => ({
    'Symbol 1': corr.symbol1,
    'Symbol 2': corr.symbol2,
    Correlation: corr.correlation,
    'P-Value': corr.pValue,
    Confidence: corr.confidence,
    'Last Updated': corr.lastUpdated
  }));

  exportToCSV(csvData, 'correlation_matrix', headers);
};

// Export news data
export const exportNewsData = (news: any[]) => {
  const headers = [
    'Headline',
    'Source',
    'Timestamp',
    'Sentiment',
    'Trust Score',
    'Impact on Price',
    'Time Horizon',
    'Confidence',
    'Category'
  ];

  const csvData = news.map(article => ({
    Headline: article.headline,
    Source: article.source,
    Timestamp: article.timestamp,
    Sentiment: article.sentiment,
    'Trust Score': article.trust,
    'Impact on Price': article.impactOnPrice,
    'Time Horizon': article.timeHorizon,
    Confidence: article.confidence,
    Category: article.category
  }));

  exportToCSV(csvData, 'news_data', headers);
};

// Print report
export const printReport = (title: string, content: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .content {
              white-space: pre-wrap;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Generated on ${format(new Date(), 'MMMM dd, yyyy at HH:mm')}</p>
          </div>
          <div class="content">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

export default {
  exportToCSV,
  exportToJSON,
  exportChartAsImage,
  exportPortfolioReport,
  exportBacktestResults,
  exportSignalHistory,
  exportTradeData,
  exportCorrelationMatrix,
  exportNewsData,
  printReport
};
