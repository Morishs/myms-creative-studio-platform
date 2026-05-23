import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-[#A0A0A0] mb-2"
          >
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-white placeholder-[#6B7280]',
            'focus:outline-none focus:ring-2 focus:ring-[#6C3CE1] focus:border-transparent',
            'transition-all duration-200 resize-none',
            error ? 'border-[#EF4444]' : 'border-[#2A2A2A] hover:border-[#3A3A3A]',
            className
          )}
          rows={4}
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

Textarea.displayName = 'Textarea';
