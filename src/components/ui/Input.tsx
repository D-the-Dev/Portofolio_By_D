import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono font-medium text-gray-300">
            {label}
            {props.required && <span className="text-emerald-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#050505] text-[#F3F4F6] placeholder-gray-500 rounded-lg border text-sm transition-all duration-200 outline-none
              ${leftIcon ? 'pl-9' : 'pl-3.5'}
              ${rightIcon ? 'pr-9' : 'pr-3.5'}
              py-2.5
              ${error ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#1F2924] hover:border-emerald-500/50 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/50'}
              ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !error && <p className="text-[11px] text-gray-500">{hint}</p>}
        {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-mono font-medium text-gray-300">
            {label}
            {props.required && <span className="text-emerald-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-[#050505] text-[#F3F4F6] placeholder-gray-500 rounded-lg border text-sm transition-all duration-200 outline-none px-3.5 py-2.5
            ${error ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#1F2924] hover:border-emerald-500/50 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/50'}
            ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-[11px] text-gray-500">{hint}</p>}
        {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
