import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[#A0A0A0] mb-2"
          >
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-white placeholder-[#6B7280]',
            'focus:outline-none focus:ring-2 focus:ring-[#6C3CE1] focus:border-transparent',
            'transition-all duration-200',
            error ? 'border-[#EF4444]' : 'border-[#2A2A2A] hover:border-[#3A3A3A]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
