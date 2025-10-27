import { format } from 'date-fns';

// Format currency with a dollar sign, commas, and 2 decimal places.
export const formatCurrency = (value: number, compact = false) => {
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format a number as a percentage.
export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Format a number with a sign (+/-).
export const formatSigned = (value: number) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatCurrency(value)}`;
};

// Format a date to a readable string, e.g., "Sep 15, 2024"
export const formatDate = (date: string | number | Date) => {
  return format(new Date(date), 'MMM d, yyyy');
};
