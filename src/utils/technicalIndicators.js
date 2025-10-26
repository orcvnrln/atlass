/**
 * Technical Indicators Library
 * Professional-grade calculations for institutional trading
 */

/**
 * Calculate Exponential Moving Average (EMA)
 * @param {number[]} data - Price data array
 * @param {number} period - EMA period
 * @returns {number[]} EMA values
 */
export function calculateEMA(data, period) {
  if (!data || data.length < period) return [];
  
  const ema = new Array(data.length).fill(null);
  const multiplier = 2 / (period + 1);
  
  // Calculate initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  ema[period - 1] = sum / period;
  
  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }
  
  return ema;
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param {number[]} data - Price data array
 * @param {number} period - SMA period
 * @returns {number[]} SMA values
 */
export function calculateSMA(data, period) {
  if (!data || data.length < period) return [];
  
  const sma = new Array(data.length).fill(null);
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    sma[i] = sum / period;
  }
  
  return sma;
}

/**
 * Calculate Relative Strength Index (RSI)
 * @param {number[]} data - Price data array
 * @param {number} period - RSI period (default: 14)
 * @returns {number[]} RSI values (0-100)
 */
export function calculateRSI(data, period = 14) {
  if (!data || data.length < period + 1) return [];
  
  const rsi = new Array(data.length).fill(null);
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = data[i] - data[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  rsi[period] = 100 - (100 / (1 + avgGain / avgLoss));
  
  // Calculate RSI for remaining data
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    rsi[i] = 100 - (100 / (1 + avgGain / avgLoss));
  }
  
  return rsi;
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * @param {number[]} data - Price data array
 * @param {number} fastPeriod - Fast EMA period (default: 12)
 * @param {number} slowPeriod - Slow EMA period (default: 26)
 * @param {number} signalPeriod - Signal line period (default: 9)
 * @returns {Object} { macd, signal, histogram }
 */
export function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (!data || data.length < slowPeriod) return { macd: [], signal: [], histogram: [] };
  
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  const macdLine = fastEMA.map((fast, i) => 
    fast !== null && slowEMA[i] !== null ? fast - slowEMA[i] : null
  );
  
  const signalLine = calculateEMA(macdLine.filter(v => v !== null), signalPeriod);
  
  // Align signal line with macd line
  const alignedSignal = new Array(macdLine.length).fill(null);
  let signalIndex = 0;
  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] !== null && signalIndex < signalLine.length) {
      alignedSignal[i] = signalLine[signalIndex];
      signalIndex++;
    }
  }
  
  const histogram = macdLine.map((macd, i) => 
    macd !== null && alignedSignal[i] !== null ? macd - alignedSignal[i] : null
  );
  
  return {
    macd: macdLine,
    signal: alignedSignal,
    histogram
  };
}

/**
 * Calculate VWAP (Volume Weighted Average Price)
 * @param {Object[]} candles - Array of candle objects with {high, low, close, volume}
 * @returns {number[]} VWAP values
 */
export function calculateVWAP(candles) {
  if (!candles || candles.length === 0) return [];
  
  const vwap = new Array(candles.length).fill(null);
  let cumulativeTPV = 0; // Typical Price * Volume
  let cumulativeVolume = 0;
  
  for (let i = 0; i < candles.length; i++) {
    const typicalPrice = (candles[i].high + candles[i].low + candles[i].close) / 3;
    cumulativeTPV += typicalPrice * candles[i].volume;
    cumulativeVolume += candles[i].volume;
    
    vwap[i] = cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : null;
  }
  
  return vwap;
}

/**
 * Calculate Bollinger Bands
 * @param {number[]} data - Price data array
 * @param {number} period - Period (default: 20)
 * @param {number} stdDev - Standard deviation multiplier (default: 2)
 * @returns {Object} { upper, middle, lower }
 */
export function calculateBollingerBands(data, period = 20, stdDev = 2) {
  if (!data || data.length < period) return { upper: [], middle: [], lower: [] };
  
  const middle = calculateSMA(data, period);
  const upper = new Array(data.length).fill(null);
  const lower = new Array(data.length).fill(null);
  
  for (let i = period - 1; i < data.length; i++) {
    // Calculate standard deviation
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[i - j] - middle[i], 2);
    }
    const sd = Math.sqrt(sum / period);
    
    upper[i] = middle[i] + (stdDev * sd);
    lower[i] = middle[i] - (stdDev * sd);
  }
  
  return { upper, middle, lower };
}

/**
 * Calculate Average True Range (ATR)
 * @param {Object[]} candles - Array of candle objects with {high, low, close}
 * @param {number} period - ATR period (default: 14)
 * @returns {number[]} ATR values
 */
export function calculateATR(candles, period = 14) {
  if (!candles || candles.length < period + 1) return [];
  
  const tr = new Array(candles.length).fill(null);
  const atr = new Array(candles.length).fill(null);
  
  // Calculate True Range
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;
    
    tr[i] = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
  }
  
  // Calculate initial ATR (SMA of TR)
  let sum = 0;
  for (let i = 1; i <= period; i++) {
    sum += tr[i];
  }
  atr[period] = sum / period;
  
  // Calculate ATR using smoothing
  for (let i = period + 1; i < candles.length; i++) {
    atr[i] = (atr[i - 1] * (period - 1) + tr[i]) / period;
  }
  
  return atr;
}

/**
 * Detect Support and Resistance Levels
 * @param {Object[]} candles - Array of candle objects
 * @param {number} lookback - Lookback period for pivot detection
 * @returns {Object} { support: [], resistance: [] }
 */
export function detectSupportResistance(candles, lookback = 20) {
  if (!candles || candles.length < lookback * 2) return { support: [], resistance: [] };
  
  const support = [];
  const resistance = [];
  
  for (let i = lookback; i < candles.length - lookback; i++) {
    const currentLow = candles[i].low;
    const currentHigh = candles[i].high;
    
    // Check if current low is a pivot low
    let isPivotLow = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && candles[j].low < currentLow) {
        isPivotLow = false;
        break;
      }
    }
    
    if (isPivotLow) {
      support.push({ price: currentLow, timestamp: candles[i].timestamp });
    }
    
    // Check if current high is a pivot high
    let isPivotHigh = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && candles[j].high > currentHigh) {
        isPivotHigh = false;
        break;
      }
    }
    
    if (isPivotHigh) {
      resistance.push({ price: currentHigh, timestamp: candles[i].timestamp });
    }
  }
  
  return { support, resistance };
}

/**
 * Calculate Stochastic Oscillator
 * @param {Object[]} candles - Array of candle objects
 * @param {number} period - %K period (default: 14)
 * @param {number} smoothK - %K smoothing (default: 3)
 * @param {number} smoothD - %D smoothing (default: 3)
 * @returns {Object} { k: [], d: [] }
 */
export function calculateStochastic(candles, period = 14, smoothK = 3, smoothD = 3) {
  if (!candles || candles.length < period) return { k: [], d: [] };
  
  const k = new Array(candles.length).fill(null);
  
  for (let i = period - 1; i < candles.length; i++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < period; j++) {
      highestHigh = Math.max(highestHigh, candles[i - j].high);
      lowestLow = Math.min(lowestLow, candles[i - j].low);
    }
    
    const range = highestHigh - lowestLow;
    k[i] = range > 0 ? ((candles[i].close - lowestLow) / range) * 100 : 50;
  }
  
  // Smooth %K
  const smoothedK = calculateSMA(k.filter(v => v !== null), smoothK);
  
  // Calculate %D (SMA of %K)
  const d = calculateSMA(smoothedK, smoothD);
  
  return { k: smoothedK, d };
}

