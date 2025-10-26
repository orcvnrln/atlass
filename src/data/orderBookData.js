// This file simulates a real-time order book data stream.

const INITIAL_PRICE = 1.07255;
const PRICE_RANGE = 0.0050; // +- 25 pips
const VISIBLE_LEVELS = 100; // Number of price levels to show

// Generates the initial set of price levels
const generateInitialLevels = () => {
    const levels = [];
    for (let i = 0; i < VISIBLE_LEVELS; i++) {
        const price = INITIAL_PRICE - (PRICE_RANGE / 2) + (i * (PRICE_RANGE / VISIBLE_LEVELS));
        levels.push({
            price: parseFloat(price.toFixed(5)),
            ask: 0, // Sell orders
            bid: 0, // Buy orders
        });
    }
    return levels;
};

let orderBook = generateInitialLevels();

// Simulate random liquidity spikes
const addLiquiditySpike = () => {
    const spikeLevelIndex = Math.floor(Math.random() * VISIBLE_LEVELS);
    const volume = 50 + Math.random() * 200; // 50 to 250 lots
    const type = Math.random() > 0.5 ? 'bid' : 'ask';
    
    if (orderBook[spikeLevelIndex]) {
        orderBook[spikeLevelIndex][type] += volume;
    }
};

// Simulate liquidity decay over time
const decayLiquidity = () => {
    orderBook = orderBook.map(level => ({
        ...level,
        ask: Math.max(0, level.ask * (0.95 + Math.random() * 0.04)), // Decay between 1% and 5%
        bid: Math.max(0, level.bid * (0.95 + Math.random() * 0.04)),
    }));
};

// Simulate market movement by adding/removing levels at the top/bottom
const driftMarket = () => {
    const drift = Math.random();
    if (drift < 0.1) { // 10% chance of upward drift
        const lastLevel = orderBook[orderBook.length - 1];
        const newPrice = lastLevel.price + (PRICE_RANGE / VISIBLE_LEVELS);
        orderBook.push({ price: parseFloat(newPrice.toFixed(5)), ask: 0, bid: 0 });
        orderBook.shift();
    } else if (drift > 0.9) { // 10% chance of downward drift
        const firstLevel = orderBook[0];
        const newPrice = firstLevel.price - (PRICE_RANGE / VISIBLE_LEVELS);
        orderBook.unshift({ price: parseFloat(newPrice.toFixed(5)), ask: 0, bid: 0 });
        orderBook.pop();
    }
}

// Add some initial random spikes
for (let i = 0; i < 15; i++) {
    addLiquiditySpike();
}

export const getOrderBookData = () => {
    // Simulate real-time changes
    if (Math.random() > 0.5) {
        addLiquiditySpike();
    }
    decayLiquidity();
    driftMarket();

    return [...orderBook];
};

export const getCurrentPrice = () => {
    // A simple way to get a "current" price from the book
    return orderBook[Math.floor(VISIBLE_LEVELS / 2)].price;
}
