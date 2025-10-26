export const mockEvents = [
    { 
        date: '2025-06-10', time: '14:00', currency: 'USD', event: 'US CPI (YoY)', 
        impact: 3, actual: '3.5%', forecast: '3.4%', previous: '3.1%',
        volatilityForecast: 85, // in percentage
        assetReaction: 'A higher than expected CPI reading is typically bullish for the USD as it signals persistent inflation, prompting a hawkish Fed response. Expect potential downside for equity indices like SPX500.'
    },
    { 
        date: '2025-06-12', time: '10:30', currency: 'GBP', event: 'UK GDP (MoM)', 
        impact: 2, actual: '0.2%', forecast: '0.1%', previous: '0.0%',
        volatilityForecast: 60,
        assetReaction: 'GDP growth stronger than forecasted is bullish for GBP. This could lead to upward movement in GBP/USD and FTSE 100, reflecting a healthier economic outlook.'
    },
    { 
        date: '2025-06-13', time: '16:00', currency: 'EUR', event: 'ECB Press Conference', 
        impact: 3, actual: '-', forecast: '-', previous: '-',
        volatilityForecast: 90,
        assetReaction: 'The tone of the press conference is key. A hawkish tone (hinting at rate hikes) will be bullish for EUR, while a dovish tone (hinting at rate cuts or stimulus) will be bearish. High volatility is expected across all EUR pairs.'
    },
    { 
        date: '2025-06-14', time: '02:30', currency: 'JPY', event: 'BOJ Policy Rate', 
        impact: 3, actual: '-0.1%', forecast: '-0.1%', previous: '-0.1%',
        volatilityForecast: 75,
        assetReaction: 'Any deviation from the long-held -0.1% rate would cause extreme volatility in JPY pairs. A surprise rate hike would be significantly bullish for the JPY.'
    },
];
