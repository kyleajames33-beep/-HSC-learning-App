import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { usePWA } from '../hooks/usePWA';

const Navigation = ({ currentPage = 'dashboard', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, triggerHaptic, getPerformanceConfig } = useMobileOptimization();
  const { isOnline } = usePWA();
  const performanceConfig = getPerformanceConfig();

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      color: 'blue',
      description: 'Overview and progress'
    },
    { 
      id: 'study', 
      label: 'Study', 
      icon: BookOpen, 
      color: 'green',
      description: 'Learning modules and content'
    },
    { 
      id: 'games', 
      label: 'Games', 
      icon: Trophy, 
      color: 'purple',
      description: 'Interactive learning games'
    },
    { 
      id: 'social', 
      label: 'Social', 
      icon: Users, 
      color: 'pink',
      description: 'Connect with peers',
      requiresOnline: true
    },
    { 
      id: 'analytics', 
      label: 'Progress', 
      icon: BarChart3, 
      color: 'orange',
      description: 'Track your performance'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      color: 'gray',
      description: 'App preferences'
    }
  ];

  const handleNavigate = (pageId) => {
    const item = navigationItems.find(item => item.id === pageId);
    
    if (item?.requiresOnline && !isOnline) {
      // Show offline message
      return;
    }
    
    if (isMobile) {
      triggerHaptic('medium');
    }
    
    onNavigate?.(pageId);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (isMobile) {
      triggerHaptic('light');
    }
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Bottom Navigation Bar */}
        <motion.nav
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-around px-2 py-1 ios-safe-area">
            {navigationItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isDisabled = item.requiresOnline && !isOnline;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  disabled={isDisabled}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-lg min-w-[44px] min-h-[44px]
                    transition-colors duration-200 touch-optimized
                    ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}
                  `}
                  whileTap={performanceConfig.enableAnimations ? { scale: 0.95 } : {}}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              );
            })}
            
            {/* More Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="flex flex-col items-center justify-center p-2 rounded-lg min-w-[44px] min-h-[44px] text-gray-600 hover:text-blue-600 touch-optimized"
              whileTap={performanceConfig.enableAnimations ? { scale: 0.95 } : {}}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">More</span>
            </motion.button>
          </div>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-xl max-h-[70vh] overflow-hidden"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Navigation</h3>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg touch-optimized"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      const isDisabled = item.requiresOnline && !isOnline;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          disabled={isDisabled}
                          className={`
                            w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors
                            ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar Navigation
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">HSC Learning</h1>
            {!isOnline && (
              <span className="text-xs text-yellow-600">Offline Mode</span>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isDisabled = item.requiresOnline && !isOnline;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                disabled={isDisabled}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// Quick Actions Floating Menu
export const QuickActions = ({ actions = [], className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile, triggerHaptic, getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  const toggleMenu = () => {
    if (isMobile) {
      triggerHaptic('medium');
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed bottom-20 right-4 z-40 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 bg-white shadow-lg rounded-xl p-3 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={performanceConfig.enableAnimations ? { scale: 1.05 } : {}}
                whileTap={performanceConfig.enableAnimations ? { scale: 0.95 } : {}}
              >
                <action.icon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={toggleMenu}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
        whileHover={performanceConfig.enableAnimations ? { scale: 1.1 } : {}}
        whileTap={performanceConfig.enableAnimations ? { scale: 0.9 } : {}}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default Navigation;