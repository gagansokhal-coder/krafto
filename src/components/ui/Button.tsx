import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  /** Render as child element (e.g. wrap an <a> tag) */
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-body font-medium transition-all duration-[250ms] rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-obsidian disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-gold to-gold-dark text-obsidian shadow-sm hover:shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:-translate-y-0.5',
    secondary:
      'bg-transparent border border-gold text-gold hover:bg-gold hover:text-obsidian',
    ghost:
      'bg-transparent text-ivory hover:text-gold hover:underline underline-offset-4',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };

  const classes = [
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // asChild: clone the single child element and pass button classes + props to it
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      className: [
        classes,
        (children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.className ?? '',
      ]
        .filter(Boolean)
        .join(' '),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
