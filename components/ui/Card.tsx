/**
 * Reusable Card component for consistent card styling.
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  padding = 'none',
}) => {
  const baseClasses = 'rounded-lg bg-white border border-slate-200 shadow-sm';
  const hoverClasses = hoverable
    ? 'transition-all duration-300 hover:shadow-lg hover:border-rio-primary hover:-translate-y-1'
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Header component for consistent card header styling.
 */
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  border = true,
}) => {
  const borderClass = border ? 'border-b border-slate-200' : '';
  return <div className={`p-4 ${borderClass} ${className}`}>{children}</div>;
};

/**
 * Card Content component for consistent card content styling.
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

/**
 * Card Footer component for consistent card footer styling.
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  border = true,
}) => {
  const borderClass = border ? 'border-t border-slate-200' : '';
  return <div className={`p-4 ${borderClass} ${className}`}>{children}</div>;
};
