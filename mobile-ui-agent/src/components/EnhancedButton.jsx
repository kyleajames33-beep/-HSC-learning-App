import React from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic, buttonPress, buttonHover, getAccessibleAnimation } from '../utils/animations';
import { useAnalytics } from '../hooks/useAnalytics';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

const EnhancedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  haptic = true,
  className = '',
  icon,
  ...props
}) => {
  const { track, EVENTS } = useAnalytics();
  const { isMobile, triggerHaptic: mobileHaptic, getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Trigger haptic feedback on mobile
    if (haptic && isMobile) {
      mobileHaptic('light');
    }

    // Track button interaction
    track(EVENTS.BUTTON_CLICKED, {
      variant,
      size,
      hasIcon: !!icon,
      isMobile
    });

    onClick?.(e);
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium
    ${performanceConfig.enableAnimations ? 'transition-all duration-200' : ''}
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    touch-optimized mobile-optimized
    ${isMobile ? 'active:scale-95' : 'hover:scale-105'}
    ${className}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 text-white
      hover:from-blue-700 hover:to-purple-700
      focus:ring-blue-500 shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-white border border-gray-300 text-gray-700
      hover:bg-gray-50 focus:ring-blue-500 shadow-sm hover:shadow-md
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-600 text-white
      hover:from-green-600 hover:to-emerald-700
      focus:ring-green-500 shadow-lg hover:shadow-xl
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700
      focus:ring-red-500 shadow-lg hover:shadow-xl
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100
      focus:ring-gray-500
    `,
    glassmorphism: `
      bg-white/20 backdrop-blur-md border border-white/30 text-white
      hover:bg-white/30 focus:ring-white/50 shadow-lg hover:shadow-xl
    `
  };

  const sizes = {
    small: `px-3 py-2 text-sm rounded-lg ${isMobile ? 'min-h-[44px]' : ''}`,
    medium: `px-4 py-3 text-base rounded-xl ${isMobile ? 'min-h-[48px]' : ''}`,
    large: `px-6 py-4 text-lg rounded-xl ${isMobile ? 'min-h-[52px]' : ''}`,
    xl: `px-8 py-5 text-xl rounded-2xl ${isMobile ? 'min-h-[56px]' : ''}`
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={disabled || loading || !performanceConfig.enableAnimations ? {} : getAccessibleAnimation(buttonHover)}
      whileTap={disabled || loading || !performanceConfig.enableAnimations ? {} : getAccessibleAnimation(buttonPress)}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <motion.div
            className={`border-2 border-current border-t-transparent rounded-full ${iconSizes[size]}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && (
            <motion.div
              className={iconSizes[size]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            >
              {icon}
            </motion.div>
          )}
          <span>{children}</span>
        </div>
      )}
    </motion.button>
  );
};

// Specialized button components
export const PrimaryButton = (props) => <EnhancedButton variant="primary" {...props} />;
export const SecondaryButton = (props) => <EnhancedButton variant="secondary" {...props} />;
export const SuccessButton = (props) => <EnhancedButton variant="success" {...props} />;
export const DangerButton = (props) => <EnhancedButton variant="danger" {...props} />;
export const GhostButton = (props) => <EnhancedButton variant="ghost" {...props} />;
export const GlassmorphismButton = (props) => <EnhancedButton variant="glassmorphism" {...props} />;

// Quiz-specific buttons
export const QuizAnswerButton = ({
  children,
  isSelected = false,
  isCorrect = null,
  disabled = false,
  onClick,
  ...props
}) => {
  const getVariant = () => {
    if (disabled && isCorrect === true) return 'success';
    if (disabled && isCorrect === false) return 'danger';
    if (isSelected) return 'primary';
    return 'secondary';
  };

  return (
    <EnhancedButton
      variant={getVariant()}
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left justify-start p-4 min-h-[60px]"
      haptic={!disabled}
      {...props}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${isSelected || disabled ? 'border-current' : 'border-gray-300'}
        `}>
          {isSelected && !disabled && (
            <motion.div
              className="w-3 h-3 bg-current rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          )}
          {disabled && isCorrect === true && (
            <motion.svg
              className="w-4 h-4 text-current"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
          {disabled && isCorrect === false && (
            <motion.svg
              className="w-4 h-4 text-current"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          )}
        </div>
        <span className="flex-1">{children}</span>
      </div>
    </EnhancedButton>
  );
};

// Floating Action Button
export const FloatingActionButton = ({
  children,
  onClick,
  className = '',
  position = 'bottom-right',
  ...props
}) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <motion.div
      className={`${positions[position]} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
    >
      <EnhancedButton
        variant="primary"
        size="large"
        onClick={onClick}
        className={`rounded-full shadow-2xl hover:shadow-3xl ${className}`}
        {...props}
      >
        {children}
      </EnhancedButton>
    </motion.div>
  );
};

export default EnhancedButton;