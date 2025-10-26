/**
 * 🔘 IMPROVED BUTTON COMPONENT
 * Accessible, performanslı, variant-based
 */

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'buy' | 'sell' | 'ghost' | 'danger' | 'ai';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all-base
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-primary text-white
      hover:bg-[var(--accent-primary-hover)] hover:shadow-glow-primary hover:scale-[1.02]
      focus:ring-[var(--accent-primary-glow)]
    `,
    secondary: `
      bg-elevated text-secondary border border-default
      hover:bg-hover hover:border-strong hover:text-primary
      focus:ring-[var(--border-focus)]
    `,
    buy: `
      bg-buy text-white
      hover:bg-[var(--accent-buy-hover)] hover:shadow-glow-buy hover:scale-[1.02]
      focus:ring-[var(--accent-buy-glow)]
    `,
    sell: `
      bg-sell text-white
      hover:bg-[var(--accent-sell-hover)] hover:shadow-glow-sell hover:scale-[1.02]
      focus:ring-[var(--accent-sell-glow)]
    `,
    ghost: `
      bg-transparent text-secondary
      hover:bg-hover hover:text-primary
      focus:ring-[var(--border-focus)]
    `,
    danger: `
      bg-sell text-white
      hover:bg-[var(--accent-sell-hover)] hover:shadow-glow-sell
      focus:ring-[var(--accent-sell-glow)]
    `,
    ai: `
      bg-ai text-white
      hover:bg-[var(--accent-ai-hover)] hover:shadow-glow-ai hover:scale-[1.02]
      focus:ring-[var(--accent-ai-glow)]
      relative overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
    `,
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <svg
          className="animate-spin w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left icon */}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}

      {/* Children */}
      <span>{children}</span>

      {/* Right icon */}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ICON BUTTON (Square button with icon only)
// ─────────────────────────────────────────────────────────────────────────────

interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string; // Required for accessibility
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  return (
    <Button
      {...props}
      size={size}
      className={`${sizeStyles[size]} ${className}`}
    >
      {icon}
    </Button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON GROUP
// ─────────────────────────────────────────────────────────────────────────────

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg ${className}`} role="group">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        return React.cloneElement(child as React.ReactElement<any>, {
          className: `
            ${(child as React.ReactElement<any>).props.className || ''}
            ${!isFirst ? 'rounded-l-none border-l-0' : ''}
            ${!isLast ? 'rounded-r-none' : ''}
          `.trim(),
        });
      })}
    </div>
  );
};

export default Button;

