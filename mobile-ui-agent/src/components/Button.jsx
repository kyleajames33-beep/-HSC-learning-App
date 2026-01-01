import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}) => {
  const { isMobile, triggerHaptic } = useMobileOptimization();

  const handleClick = (event) => {
    if (disabled || loading) return;
    
    if (isMobile) {
      triggerHaptic('medium');
    }
    
    onClick?.(event);
  };

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-transparent',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
    success: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent',
    link: 'bg-transparent hover:bg-transparent text-blue-600 border-transparent underline'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs min-h-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    xl: 'px-8 py-4 text-xl min-h-[52px]'
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    mobile-optimized touch-optimized
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {/* Left Icon */}
      {leftIcon && !loading && (
        <span className="mr-2 flex items-center">
          {leftIcon}
        </span>
      )}
      
      {/* Button Content */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {/* Right Icon */}
      {rightIcon && !loading && (
        <span className="ml-2 flex items-center">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};

// Icon Button Component
export const IconButton = ({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => {
  const iconSizes = {
    xs: 'w-6 h-6 p-1',
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
    xl: 'w-14 h-14 p-3'
  };

  return (
    <Button
      variant={variant}
      className={`${iconSizes[size]} rounded-full ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

// Floating Action Button
export const FAB = ({
  children,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right',
  className = '',
  ...props
}) => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const fabSizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`fixed z-40 ${positions[position]}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant={variant}
        className={`
          ${fabSizes[size]} rounded-full shadow-lg hover:shadow-xl
          focus:ring-offset-4
          ${className}
        `}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

// Button Group Component
export const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  className = '',
  spacing = 'attached'
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const spacingClasses = {
    attached: orientation === 'horizontal' ? 'space-x-0 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:last-child)]:border-r-0' : 'space-y-0 [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:last-child)]:border-b-0',
    spaced: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2'
  };

  return (
    <div className={`
      inline-flex ${orientationClasses[orientation]} ${spacingClasses[spacing]} ${className}
    `}>
      {children}
    </div>
  );
};

// Split Button Component
export const SplitButton = ({
  children,
  onMainClick,
  onMenuClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}) => {
  return (
    <ButtonGroup spacing="attached" className={className}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        onClick={onMainClick}
      >
        {children}
      </Button>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={onMenuClick}
        className="px-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>
    </ButtonGroup>
  );
};

export default Button;