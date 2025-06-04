import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    icon,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100',
    };

    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5 rounded-full',
      md: 'px-5 py-2.5 rounded-full',
      lg: 'text-lg px-7 py-3.5 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out',
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'opacity-70 cursor-not-allowed',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        <span className={cn(isLoading && 'opacity-0')}>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;