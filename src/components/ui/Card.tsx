import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-alt border border-border rounded-3xl p-6 shadow-card',
        hover && 'transition-all duration-300 hover:border-brand/30 hover:shadow-[0_20px_80px_rgba(13,110,253,0.12)] hover:-translate-y-1',
        glow && 'shadow-lg shadow-accent/20',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
