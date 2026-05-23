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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-ivory/70 font-body">
            {label}
            {props.required && <span className="text-gold ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-charcoal border rounded-sm px-4 py-3 text-ivory placeholder-ivory/30',
            'focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors font-body text-sm',
            error ? 'border-red-500/60' : 'border-white/20 focus:border-gold',
            props.disabled ? 'opacity-50 cursor-not-allowed' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-body">{error}</p>}
        {hint && !error && <p className="text-xs text-ivory/40 font-body">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
