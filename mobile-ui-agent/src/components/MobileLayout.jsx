import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { usePWA } from '../hooks/usePWA';
import UserStats from './UserStats.jsx';
import PullToRefresh from './PullToRefresh';
import { GamificationProvider } from '../context/GamificationContext.jsx';
import {
  Home,
  BookOpen,
  Trophy,
  Users,
  BarChart3
} from 'lucide-react';

const MobileLayout = ({
  children,
  showHeader = true,
  showBottomNav = true,
  className = '',
  enablePullToRefresh = false,
  onRefresh,
  headerContent,
  bottomNavContent
}) => {
  const {
    isMobile,
    orientation,
    viewport,
    getPerformanceConfig,
    handleTouchStart,
    handleTouchEnd
  } = useMobileOptimization();

  const { isOnline } = usePWA();
  const performanceConfig = getPerformanceConfig();

  // Safe area inset support for devices with notches
  const safeAreaStyles = {
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    paddingBottom: 'env(safe-area-inset-bottom)'
  };

  // Dynamic viewport height handling for mobile browsers
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  const layoutClasses = `
    min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50
    flex flex-col overflow-hidden
    ${isMobile ? 'mobile-optimized' : ''}
    ${performanceConfig.enableAnimations ? '' : 'low-power'}
    ${className}
  `;

  const contentClasses = `
    flex-1 overflow-y-auto smooth-scroll
    ${showHeader ? 'pt-16' : ''}
    ${showBottomNav ? 'pb-20' : ''}
    ${isMobile ? 'px-4' : 'px-6'}
    py-4
  `;

  return (
    <GamificationProvider>
      {/* Status indicators */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 p-2 text-center text-sm font-medium z-50">
           You&apos;re offline - Limited functionality available
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <motion.header
          className={`
            fixed top-0 left-0 right-0 z-40
            bg-white/80 backdrop-blur-md border-b border-gray-200
            h-16 flex items-center justify-between px-4
            ${performanceConfig.enableShadows ? 'shadow-sm' : ''}
          `}
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {headerContent || (
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">HSC App</h1>
              {!isOnline && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  Offline
                </span>
              )}
            </div>
          )}
          <div className="flex items-center">
            <UserStats />
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main
        className={contentClasses}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {enablePullToRefresh && isMobile ? (
          <PullToRefresh onRefresh={onRefresh}>
            {children}
          </PullToRefresh>
        ) : (
          children
        )}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <motion.nav
          className={`
            fixed bottom-0 left-0 right-0 z-40
            bg-white/80 backdrop-blur-md border-t border-gray-200
            h-20 flex items-center justify-around px-4
            ${performanceConfig.enableShadows ? 'shadow-lg' : ''}
          `}
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        >
          {bottomNavContent || <DefaultBottomNav />}
        </motion.nav>
      )}

      {/* Orientation change indicator */}
      {isMobile && (
        <OrientationIndicator orientation={orientation} />
      )}

      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor />
      )}
    </GamificationProvider>
  );
};

// Default bottom navigation
const DefaultBottomNav = () => {
  // This should be driven by a navigation context or props in a real app
  const [activePage, setActivePage] = React.useState('Home');

  const navItems = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Study', icon: BookOpen, label: 'Study' },
    { id: 'Games', icon: Trophy, label: 'Games' },
    { id: 'Social', icon: Users, label: 'Social' },
    { id: 'Progress', icon: BarChart3, label: 'Progress' }
  ];

  return (
    <>
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`
              flex flex-col items-center justify-center space-y-1 p-2 rounded-lg
              min-w-[44px] min-h-[44px] touch-optimized transition-colors
              ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}
            `}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        );
      })}
    </>
  );
};

// Orientation change indicator
const OrientationIndicator = ({ orientation }) => {
  const [showIndicator, setShowIndicator] = React.useState(false);

  React.useEffect(() => {
    setShowIndicator(true);
    const timer = setTimeout(() => setShowIndicator(false), 2000);
    return () => clearTimeout(timer);
  }, [orientation]);

  if (!showIndicator) return null;

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {orientation === 'portrait' ? '' : ''}
          </span>
          <span className="text-sm font-medium capitalize">
            {orientation} Mode
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Performance monitoring component for development
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({});

  React.useEffect(() => {
    const updateMetrics = () => {
      if ('memory' in performance) {
        setMetrics({
          memory: performance.memory,
          timing: performance.timing,
          navigation: performance.navigation
        });
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-white p-2 rounded text-xs z-50 max-w-xs">
      <div>Memory: {Math.round(metrics.memory?.usedJSHeapSize / 1024 / 1024)}MB</div>
      <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
      <div>Pixel Ratio: {window.devicePixelRatio}</div>
    </div>
  );
};

export default MobileLayout;
