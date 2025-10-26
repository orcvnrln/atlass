// This is a mock datafeed for the TradingView Charting Library.
// In a real application, this would be connected to a live data source.

const configurationData = {
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    supports_marks: true,
    supports_timescale_marks: true,
};

const lastBarsCache = new Map();

// Generates some random historical data
const generateBars = (count) => {
    const bars = [];
    let lastClose = 100;
    for (let i = 0; i < count; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (count - i));
        const open = lastClose;
        const close = open + (Math.random() - 0.45) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        bars.push({
            time: date.getTime(),
            open,
            high,
            low,
            close,
            volume: Math.random() * 1000,
        });
        lastClose = close;
    }
    return bars;
};

export const datafeed = {
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },

    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('[searchSymbols]: Method call');
        // Implement symbol search logic here
        onResultReadyCallback([]);
    },

    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.log('[resolveSymbol]: Method call', symbolName);
        const symbolInfo = {
            ticker: symbolName,
            name: symbolName,
            description: symbolName,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: 'BLOMMY',
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            has_no_volume: false,
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 2,
            data_status: 'streaming',
        };
        setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
    },

    getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        console.log('[getBars]: Method call', symbolInfo, resolution, periodParams);
        const { from, to, firstDataRequest } = periodParams;

        if (firstDataRequest) {
            const bars = generateBars(500);
            lastBarsCache.set(symbolInfo.full_name, { ...bars[bars.length - 1] });
            onHistoryCallback(bars, { noData: false });
        } else {
            onHistoryCallback([], { noData: true });
        }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);

        setInterval(() => {
            const lastBar = lastBarsCache.get(symbolInfo.full_name);
            const nextBar = {
                ...lastBar,
                time: new Date().getTime(),
                close: lastBar.close + (Math.random() - 0.48) * 2,
            };
            nextBar.high = Math.max(lastBar.high, nextBar.close);
            nextBar.low = Math.min(lastBar.low, nextBar.close);

            lastBarsCache.set(symbolInfo.full_name, nextBar);
            onRealtimeCallback(nextBar);
        }, 1000); // New bar every second
    },

    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
};
