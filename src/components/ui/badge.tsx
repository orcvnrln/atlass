import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  // A simple badge implementation
  const baseClasses = 'px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  // Note: In a real app, you'd have more complex variant styling.
  return <div className={`${baseClasses} ${className}`} {...props} />;
};

export { Badge };
