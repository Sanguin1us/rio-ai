/**
 * Reusable Badge component for labels and tags.
 * Supports various color variants for different use cases.
 */

import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'primary';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
  warning: 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
  info: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
  primary: 'bg-rio-primary/10 text-rio-primary',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Tag Badge - specifically for model tags in the catalog.
 */
interface TagBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * Open Source Badge - for marking open source models.
 */
export const OpenSourceBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Badge variant="success" size="md" className={className}>
      Open Source
    </Badge>
  );
};
