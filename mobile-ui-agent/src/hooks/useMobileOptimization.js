import { useState, useEffect, useCallback } from 'react';

const isClient = typeof window !== 'undefined';
const getNavigator = () => (isClient ? window.navigator : undefined);
const getWindow = () => (isClient ? window : undefined);

const detectMobile = () => {
  const nav = getNavigator();
  if (!nav) {
    return false;
  }

  const userAgent = nav.userAgent ?? '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const hasTouch = (isClient && 'ontouchstart' in window) || nav.maxTouchPoints > 0;

  return mobileRegex.test(userAgent) || hasTouch;
};

const getInitialViewport = () => {
  const win = getWindow();
  return {
    width: win?.innerWidth ?? 0,
    height: win?.innerHeight ?? 0,
  };
};

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(detectMobile);
  const [orientation, setOrientation] = useState('portrait');
  const [viewport, setViewport] = useState(getInitialViewport);
  const [touchPoints, setTouchPoints] = useState(0);
  const [isLowMemory, setIsLowMemory] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    setIsMobile(detectMobile());
  }, []);

  useEffect(() => {
    if (!isClient) {
      return undefined;
    }

    const win = getWindow();
    if (!win) {
      return undefined;
    }

    const updateViewport = () => {
      setViewport({
        width: win.innerWidth,
        height: win.innerHeight,
      });

      setOrientation(win.innerHeight > win.innerWidth ? 'portrait' : 'landscape');
    };

    updateViewport();
    win.addEventListener('resize', updateViewport);
    win.addEventListener('orientationchange', updateViewport);

    return () => {
      win.removeEventListener('resize', updateViewport);
      win.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isClient || typeof performance === 'undefined' || !('memory' in performance)) {
      return undefined;
    }

    const checkMemory = () => {
      const memory = performance.memory;
      if (!memory) {
        return;
      }
      const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      setIsLowMemory(usedPercent > 80);
    };

    checkMemory();
    const interval = window.setInterval(checkMemory, 30000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const nav = getNavigator();
    if (!nav || typeof nav.getBattery !== 'function') {
      return undefined;
    }

    let batteryRef;
    const applyBatteryState = (battery) => {
      setBatteryLevel(battery.level);
      setIsLowBattery(battery.level < 0.2);
    };

    const handleLevelChange = () => {
      if (batteryRef) {
        applyBatteryState(batteryRef);
      }
    };

    nav
      .getBattery()
      .then((battery) => {
        batteryRef = battery;
        applyBatteryState(battery);
        battery.addEventListener('levelchange', handleLevelChange);
      })
      .catch(() => {
        /* no-op */
      });

    return () => {
      if (batteryRef) {
        batteryRef.removeEventListener('levelchange', handleLevelChange);
      }
    };
  }, []);

  const handleTouchStart = useCallback((event) => {
    setTouchPoints(event.touches.length);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchPoints(0);
  }, []);

  const getPerformanceConfig = useCallback(() => {
    const config = {
      enableAnimations: true,
      enableParticles: true,
      enableShadows: true,
      maxParticles: 100,
      animationDuration: 300,
    };

    if (isLowMemory || isLowBattery) {
      config.enableAnimations = false;
      config.enableParticles = false;
      config.enableShadows = false;
      config.maxParticles = 20;
      config.animationDuration = 150;
    }

    if (viewport.width < 375) {
      config.enableParticles = false;
      config.maxParticles = 10;
    }

    return config;
  }, [isLowMemory, isLowBattery, viewport.width]);

  const triggerHaptic = useCallback(
    (type = 'light') => {
      const nav = getNavigator();
      if (!nav || typeof nav.vibrate !== 'function' || !isMobile) {
        return;
      }

      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100],
        success: [50, 50, 50],
        error: [100, 50, 100],
      };

      nav.vibrate(patterns[type] || patterns.light);
    },
    [isMobile]
  );

  const getOptimizedImageSize = useCallback(
    (baseSize) => {
      const win = getWindow();
      const pixelRatio = win?.devicePixelRatio ?? 1;
      const scaledSize = baseSize * pixelRatio;

      if (isLowMemory) {
        return Math.min(scaledSize, baseSize * 1.5);
      }

      return scaledSize;
    },
    [isLowMemory]
  );

  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function throttled(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }, []);

  return {
    isMobile,
    orientation,
    viewport,
    touchPoints,
    isLowMemory,
    batteryLevel,
    isLowBattery,
    getPerformanceConfig,
    triggerHaptic,
    getOptimizedImageSize,
    throttle,
    handleTouchStart,
    handleTouchEnd,
  };
};
