/**
 * 🃏 IMPROVED CARD COMPONENT
 * Flexible, accessible, variant-based
 */

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';

interface CardProps {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  onClick,
}) => {
  const baseStyles = 'rounded-lg transition-all-base';

  const variantStyles: Record<CardVariant, string> = {
    default: `
      bg-panel border border-default
    `,
    elevated: `
      bg-elevated border border-strong shadow-md
    `,
    bordered: `
      bg-panel border-2 border-default
    `,
    interactive: `
      bg-panel border border-default
      hover:bg-hover hover:border-strong hover:shadow-md hover:scale-[1.01]
      cursor-pointer
    `,
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={combinedClassName}
      onClick={onClick}
      {...(onClick && { type: 'button' })}
    >
      {children}
    </Component>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div>
        <h3 className="heading-3">{title}</h3>
        {subtitle && <p className="text-caption mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD CONTENT
// ─────────────────────────────────────────────────────────────────────────────

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD FOOTER
// ─────────────────────────────────────────────────────────────────────────────

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-default ${className}`}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD (Metrics display)
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  className = '',
}) => {
  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-label mb-2">{label}</p>
          <p className="price-large">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={change.isPositive ? 'text-buy' : 'text-sell'}>
                {change.isPositive ? '↑' : '↓'}
              </span>
              <span className={`text-sm font-medium ${change.isPositive ? 'text-buy' : 'text-sell'}`}>
                {Math.abs(change.value).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-elevated flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL CARD (AI/Trading signals)
// ─────────────────────────────────────────────────────────────────────────────

interface SignalCardProps {
  side: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  reasoning?: string;
  timestamp: number;
  onAccept?: () => void;
  className?: string;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  side,
  entry,
  stopLoss,
  takeProfit,
  confidence,
  reasoning,
  timestamp,
  onAccept,
  className = '',
}) => {
  const rrRatio = Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

  return (
    <Card
      variant="bordered"
      padding="md"
      className={`border-l-4 ${side === 'BUY' ? 'border-l-buy' : 'border-l-sell'} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-sm font-bold rounded-lg ${
              side === 'BUY' ? 'bg-buy/20 text-buy' : 'bg-sell/20 text-sell'
            }`}
          >
            {side}
          </span>
          <span className="text-xs text-muted">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${confidence > 70 ? 'bg-buy' : 'bg-info'}`} />
          <span className="text-sm text-muted">{confidence}%</span>
        </div>
      </div>

      {/* Levels */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-label mb-1">Entry</p>
          <p className="text-number text-primary">{entry.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-label mb-1">Stop Loss</p>
          <p className="text-number text-sell">{stopLoss.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-label mb-1">Take Profit</p>
          <p className="text-number text-buy">{takeProfit.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-label mb-1">R/R</p>
          <p className="text-number text-info">1:{rrRatio.toFixed(2)}</p>
        </div>
      </div>

      {/* Reasoning */}
      {reasoning && (
        <div className="pt-3 border-t border-default">
          <p className="text-sm text-secondary leading-relaxed line-clamp-2">{reasoning}</p>
        </div>
      )}

      {/* Action */}
      {onAccept && (
        <button
          onClick={onAccept}
          className={`mt-3 w-full px-4 py-2 rounded-lg font-medium text-white transition-all-base hover:scale-[1.02] ${
            side === 'BUY'
              ? 'bg-buy hover:bg-[var(--accent-buy-hover)] hover:shadow-glow-buy'
              : 'bg-sell hover:bg-[var(--accent-sell-hover)] hover:shadow-glow-sell'
          }`}
        >
          Accept Signal
        </button>
      )}
    </Card>
  );
};

export default Card;

