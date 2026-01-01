import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

const PullToRefresh = ({ onRefresh, children, threshold = 60 }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef(null);
  const y = useMotionValue(0);
  const pullProgress = useTransform(y, [0, threshold], [0, 1]);
  const rotation = useTransform(pullProgress, [0, 1], [0, 180]);
  const { isMobile, triggerHaptic, getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  const handlePullStart = () => {
    if (containerRef.current?.scrollTop === 0) {
      setIsPulling(true);
      if (isMobile) {
        triggerHaptic('light');
      }
    }
  };

  const handlePullEnd = async () => {
    if (isPulling && y.get() >= threshold) {
      setIsRefreshing(true);
      if (isMobile) {
        triggerHaptic('medium');
      }
      try {
        await onRefresh();
        if (isMobile) {
          triggerHaptic('success');
        }
      } catch (error) {
        console.error('Refresh failed:', error);
        if (isMobile) {
          triggerHaptic('error');
        }
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    y.set(0);
  };

  return (
    <div ref={containerRef} className="overflow-auto smooth-scroll">
      {/* Pull to refresh indicator */}
      <motion.div
        style={{ y }}
        className="relative mobile-optimized"
        drag={isPulling && isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: threshold }}
        dragElastic={0.2}
        onDragStart={handlePullStart}
        onDragEnd={handlePullEnd}
      >
        {/* Refresh indicator */}
        <motion.div
          style={{
            opacity: pullProgress,
            scale: pullProgress,
          }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg z-10"
        >
          {isRefreshing ? (
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <motion.svg
              style={{ rotate: rotation }}
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          )}
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
