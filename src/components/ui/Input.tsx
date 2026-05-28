import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-[13px] text-ivory/60 font-body uppercase tracking-wider font-medium">
            {label}
            {props.required && <span className="text-gold ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-obsidian/80 border rounded-sm px-4 py-3.5 text-ivory placeholder:text-ivory/25',
            'focus:outline-none focus:ring-1 focus:ring-gold/30 focus:shadow-[0_0_15px_rgba(200,150,60,0.05)] transition-all duration-300 font-body text-[15px]',
            error ? 'border-terracotta/60' : 'border-gold/15 focus:border-gold/60',
            props.disabled ? 'opacity-50 cursor-not-allowed' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-terracotta font-body tracking-wide mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-ivory/40 font-body tracking-wide mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
