/**
 * 🔢 NUMBER FORMATTING UTILITIES
 * Institutional-grade number formatting
 */

// ─────────────────────────────────────────────────────────────────────────────
// PRICE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format price with appropriate decimal places
 * @example formatPrice(42567.89) => "42,567.89"
 */
export function formatPrice(price: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

/**
 * Format price with currency symbol
 * @example formatCurrency(42567.89, 'USD') => "$42,567.89"
 */
export function formatCurrency(amount: number, currency: string = 'USD', decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format crypto price with dynamic decimals
 * @example formatCryptoPrice(0.00012345) => "0.00012345"
 */
export function formatCryptoPrice(price: number): string {
  if (price >= 1) {
    return formatPrice(price, 2);
  } else if (price >= 0.01) {
    return formatPrice(price, 4);
  } else if (price >= 0.0001) {
    return formatPrice(price, 6);
  } else {
    return formatPrice(price, 8);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PERCENTAGE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format percentage with sign
 * @example formatPercent(5.67) => "+5.67%"
 * @example formatPercent(-2.34) => "-2.34%"
 */
export function formatPercent(value: number, decimals: number = 2, showSign: boolean = true): string {
  const formatted = value.toFixed(decimals);
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${formatted}%`;
}

/**
 * Format percentage change with color class
 * @example formatPercentChange(5.67) => { text: "+5.67%", className: "text-buy" }
 */
export function formatPercentChange(value: number, decimals: number = 2): {
  text: string;
  className: string;
} {
  const text = formatPercent(value, decimals);
  const className = value > 0 ? 'text-buy' : value < 0 ? 'text-sell' : 'text-muted';
  return { text, className };
}

// ─────────────────────────────────────────────────────────────────────────────
// VOLUME FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format large numbers with K/M/B suffixes
 * @example formatVolume(1234567) => "1.23M"
 */
export function formatVolume(value: number, decimals: number = 2): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  } else {
    return value.toFixed(decimals);
  }
}

/**
 * Format market cap
 * @example formatMarketCap(42567890000) => "$42.57B"
 */
export function formatMarketCap(value: number): string {
  return `$${formatVolume(value)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// POSITION SIZE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format position size with asset symbol
 * @example formatPositionSize(1.5, 'BTC') => "1.50 BTC"
 */
export function formatPositionSize(size: number, asset: string, decimals: number = 2): string {
  return `${formatPrice(size, decimals)} ${asset}`;
}

/**
 * Format leverage
 * @example formatLeverage(10) => "10x"
 */
export function formatLeverage(leverage: number): string {
  return `${leverage}x`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TIME FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format timestamp to time string
 * @example formatTime(1699876543000) => "14:35:43"
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format timestamp to date string
 * @example formatDate(1699876543000) => "Nov 13, 2023"
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format timestamp to datetime string
 * @example formatDateTime(1699876543000) => "Nov 13, 2023 14:35:43"
 */
export function formatDateTime(timestamp: number): string {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
}

/**
 * Format relative time (e.g., "5 minutes ago")
 * @example formatRelativeTime(Date.now() - 300000) => "5 minutes ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK/REWARD FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format risk/reward ratio
 * @example formatRRRatio(2.5) => "1:2.50"
 */
export function formatRRRatio(ratio: number): string {
  return `1:${ratio.toFixed(2)}`;
}

/**
 * Calculate and format PnL
 * @example formatPnL(1250.50) => { text: "+$1,250.50", className: "text-buy" }
 */
export function formatPnL(pnl: number): {
  text: string;
  className: string;
} {
  const sign = pnl > 0 ? '+' : '';
  const text = `${sign}${formatCurrency(pnl)}`;
  const className = pnl > 0 ? 'text-buy' : pnl < 0 ? 'text-sell' : 'text-muted';
  return { text, className };
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if number is valid
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safe number parsing
 */
export function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value.replace(/,/g, ''));
  return isValidNumber(parsed) ? parsed : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default {
  formatPrice,
  formatCurrency,
  formatCryptoPrice,
  formatPercent,
  formatPercentChange,
  formatVolume,
  formatMarketCap,
  formatPositionSize,
  formatLeverage,
  formatTime,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatRRRatio,
  formatPnL,
  isValidNumber,
  parseNumber,
};

