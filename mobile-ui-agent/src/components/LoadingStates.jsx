import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { usePWA } from '../hooks/usePWA';

// Spinner Component
export const Spinner = ({ 
  size = 'md', 
  color = 'blue', 
  className = '',
  text = null 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    white: 'text-white'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizes[size]} ${colors[color]}`} />
      {text && (
        <span className={`text-sm font-medium ${colors[color]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Page Loading Component
export const PageLoader = ({ message = 'Loading...', showProgress = false, progress = 0 }) => {
  const { isMobile } = useMobileOptimization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <motion.div
        className="text-center space-y-6 p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <motion.div
          className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-white font-bold text-2xl">H</span>
        </motion.div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">HSC Learning</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-48 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
          </div>
        )}

        {/* Spinner */}
        <Spinner size="lg" color="blue" />
      </motion.div>
    </div>
  );
};

// Skeleton Loading Components (enhanced from existing)
export const SkeletonPulse = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  rounded = 'rounded'
}) => (
  <div 
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${rounded} ${className}`}
    style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }}
  />
);

// Content Loading States
export const ContentLoader = ({ type = 'card', className = '' }) => {
  const renderLoader = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`p-4 border rounded-lg space-y-3 ${className}`}>
            <SkeletonPulse height="8rem" />
            <div className="space-y-2">
              <SkeletonPulse width="75%" />
              <SkeletonPulse width="50%" />
            </div>
          </div>
        );

      case 'list-item':
        return (
          <div className={`flex items-center space-x-3 p-3 ${className}`}>
            <SkeletonPulse width="40px" height="40px" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse width="60%" />
              <SkeletonPulse width="40%" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <SkeletonPulse width="100%" />
            <SkeletonPulse width="75%" />
            <SkeletonPulse width="50%" />
          </div>
        );

      case 'button':
        return (
          <SkeletonPulse 
            width="120px" 
            height="40px" 
            rounded="rounded-lg"
            className={className}
          />
        );

      default:
        return <SkeletonPulse className={className} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {renderLoader()}
    </motion.div>
  );
};

// Network Status Loading
export const NetworkLoader = ({ message, onRetry }) => {
  const { isOnline } = usePWA();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-4"
      >
        {isOnline ? (
          <Wifi className="w-12 h-12 text-blue-600" />
        ) : (
          <WifiOff className="w-12 h-12 text-gray-400" />
        )}
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isOnline ? 'Connecting...' : 'You\'re Offline'}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {message || (isOnline 
          ? 'Trying to connect to the server...' 
          : 'Some features may be limited while offline.'
        )}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

// Lazy Loading Wrapper
export const LazyLoader = ({ 
  children, 
  loading = false, 
  error = null, 
  fallback = null,
  onRetry
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return fallback || <ContentLoader type="card" />;
  }

  return children;
};

// Infinite Loading Component
export const InfiniteLoader = ({ 
  hasMore = true, 
  loading = false, 
  onLoad 
}) => {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setInView(true);
          onLoad?.();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoad]);

  if (!hasMore) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No more items to load</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex justify-center py-8">
      {loading ? (
        <Spinner size="lg" text="Loading more..." />
      ) : (
        <div className="text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-300 rounded-full mx-auto mb-2" />
          <p className="text-sm">Scroll for more</p>
        </div>
      )}
    </div>
  );
};

// Progress Loading Component
export const ProgressLoader = ({ 
  progress = 0, 
  total = 100, 
  label = 'Loading...',
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

// Global Loading Context
const LoadingContext = React.createContext();

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Loading...');

  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setGlobalLoading(true);
  };

  const hideLoading = () => {
    setGlobalLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {globalLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Spinner size="lg" text={loadingMessage} />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export default {
  Spinner,
  PageLoader,
  ContentLoader,
  NetworkLoader,
  LazyLoader,
  InfiniteLoader,
  ProgressLoader,
  LoadingProvider,
  useLoading
};