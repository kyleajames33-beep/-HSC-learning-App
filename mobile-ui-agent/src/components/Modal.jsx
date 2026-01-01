import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  fullScreen = false,
  dismissible = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  animationType = 'slide-up'
}) => {
  const { isMobile, triggerHaptic } = useMobileOptimization();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && dismissible) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, dismissible, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && dismissible) {
      if (isMobile) {
        triggerHaptic('light');
      }
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const animations = {
    'fade': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    'scale': {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    },
    'slide-up': {
      initial: { opacity: 0, y: '100%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '100%' }
    },
    'slide-down': {
      initial: { opacity: 0, y: '-100%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '-100%' }
    },
    'slide-left': {
      initial: { opacity: 0, x: '100%' },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: '100%' }
    },
    'slide-right': {
      initial: { opacity: 0, x: '-100%' },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: '-100%' }
    }
  };

  const animation = animations[animationType] || animations['slide-up'];

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/50 backdrop-blur-sm
          ${overlayClassName}
        `}
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.exit}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            relative w-full mx-auto bg-white rounded-lg shadow-xl
            ${fullScreen || isMobile ? 'h-full max-h-full' : 'max-h-[90vh]'}
            ${fullScreen ? 'max-w-full' : sizeClasses[size]}
            ${isMobile ? 'rounded-t-lg rounded-b-none' : ''}
            mobile-optimized
            ${contentClassName}
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 pr-4">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 touch-optimized"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`
            ${(title || showCloseButton) ? '' : 'pt-4'}
            ${fullScreen || isMobile ? 'flex-1 overflow-auto' : 'max-h-[calc(90vh-8rem)] overflow-auto'}
          `}>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

// Confirmation Modal Component
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false
}) => {
  const { triggerHaptic } = useMobileOptimization();

  const handleConfirm = async () => {
    triggerHaptic('medium');
    await onConfirm();
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      dismissible={!isLoading}
    >
      <div className="p-4">
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 touch-optimized"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg disabled:opacity-50 touch-optimized
              ${variantClasses[variant]}
              ${isLoading ? 'cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Bottom Sheet Modal for mobile
export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  dismissible = true,
  showHandle = true,
  className = ''
}) => {
  const { isMobile, triggerHaptic } = useMobileOptimization();

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100 && dismissible) {
      triggerHaptic('light');
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={dismissible ? onClose : undefined}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          drag={isMobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            absolute bottom-0 left-0 right-0
            bg-white rounded-t-xl shadow-xl
            max-h-[90vh] overflow-hidden
            mobile-optimized
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {showHandle && (
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 bg-gray-300 rounded-full" />
            </div>
          )}
          
          {title && (
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          )}
          
          <div className="overflow-auto max-h-[calc(90vh-4rem)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;