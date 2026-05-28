import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury';
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
    'inline-flex items-center justify-center font-body font-medium transition-all duration-[400ms] rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-obsidian disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-gold to-gold-dark text-obsidian shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 border border-transparent',
    secondary:
      'bg-transparent border border-gold/40 text-gold hover:bg-gold hover:text-obsidian hover:border-gold hover:shadow-gold',
    ghost:
      'bg-transparent text-ivory/80 hover:text-gold relative after:content-[""] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-gold after:transition-all after:duration-300 hover:after:w-full',
    luxury:
      'bg-obsidian/40 backdrop-blur-sm border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/60 shadow-warm hover:shadow-gold-glow',
  };

  const sizes = {
    sm: 'text-[13px] px-5 py-2 uppercase tracking-wider',
    md: 'text-sm px-7 py-3 uppercase tracking-wider',
    lg: 'text-[15px] px-10 py-4 uppercase tracking-[0.15em]',
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
