import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#2A2A2A] text-[#A0A0A0]',
    primary: 'bg-[#6C3CE1]/20 text-[#6C3CE1] border border-[#6C3CE1]/30',
    secondary: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30',
    success: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    warning: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30',
    error: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
