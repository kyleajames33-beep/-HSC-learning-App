import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  autoComplete,
  autoFocus = false,
  maxLength,
  pattern,
  inputMode,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isMobile, triggerHaptic } = useMobileOptimization();

  const handleFocus = (event) => {
    setIsFocused(true);
    if (isMobile) {
      triggerHaptic('light');
    }
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    if (isMobile) {
      triggerHaptic('medium');
    }
  };

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  };

  const variantClasses = {
    default: 'border-gray-300 bg-white',
    filled: 'border-transparent bg-gray-100',
    outlined: 'border-2 border-gray-300 bg-transparent'
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseInputClasses = `
    w-full px-4 rounded-lg transition-all duration-200
    placeholder:text-gray-500
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
    mobile-optimized touch-optimized
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
    ${!error && !success ? 'focus:border-blue-500 focus:ring-blue-500' : ''}
    ${isFocused ? 'ring-2 ring-opacity-20' : ''}
    ${leftIcon ? 'pl-12' : ''}
    ${rightIcon || showPasswordToggle ? 'pr-12' : ''}
    ${inputClassName}
  `;

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            scale: isFocused || value ? 0.85 : 1,
            y: isFocused || value ? -10 : 0,
            color: error ? '#ef4444' : success ? '#10b981' : isFocused ? '#3b82f6' : '#6b7280'
          }}
          className={`
            absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none
            font-medium origin-left transition-all duration-200 z-10
            ${isFocused || value ? 'bg-white px-1' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          pattern={pattern}
          inputMode={inputMode}
          className={baseInputClasses}
          {...props}
        />

        {/* Right Icon / Password Toggle */}
        {(rightIcon || showPasswordToggle) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            {type === 'password' && showPasswordToggle ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-500 hover:text-gray-700 touch-optimized"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}

        {/* Status Icons */}
        {(error || success) && !rightIcon && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Error/Success Message */}
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm flex items-center space-x-1 ${
            error ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {error ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{error || success}</span>
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  className = '',
  rows = 4,
  resize = 'vertical',
  maxLength,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isMobile, triggerHaptic } = useMobileOptimization();

  const handleFocus = (event) => {
    setIsFocused(true);
    if (isMobile) {
      triggerHaptic('light');
    }
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${error ? 'text-red-600' : success ? 'text-green-600' : isFocused ? 'text-blue-600' : 'text-gray-700'}
        `}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full p-4 rounded-lg border transition-all duration-200
          placeholder:text-gray-500
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          mobile-optimized touch-optimized
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
          ${!error && !success ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : ''}
          ${isFocused ? 'ring-2 ring-opacity-20' : ''}
          ${resizeClasses[resize]}
        `}
        {...props}
      />

      {/* Character Count */}
      {maxLength && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value?.length || 0}/{maxLength}
        </div>
      )}

      {/* Error/Success Message */}
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm flex items-center space-x-1 ${
            error ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {error ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{error || success}</span>
        </motion.div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;