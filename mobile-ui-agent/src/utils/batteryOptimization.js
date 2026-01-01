import { useEffect, useState } from 'react';

// Battery and performance optimization utilities

export class BatteryOptimizer {
  constructor() {
    this.batteryInfo = null;
    this.performanceMode = 'auto'; // auto, performance, battery-saver
    this.optimizations = {
      animations: true,
      backgroundSync: true,
      autoplay: true,
      highRefreshRate: true,
      gpuAcceleration: true,
      backgroundTasks: true
    };

    this.init();
  }

  async init() {
    // Get battery information if available
    if ('getBattery' in navigator) {
      try {
        this.batteryInfo = await navigator.getBattery();
        this.setupBatteryListeners();
        this.updateOptimizations();
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }

    // Monitor performance
    this.monitorPerformance();
  }

  setupBatteryListeners() {
    if (!this.batteryInfo) return;

    const updateOptimizations = () => this.updateOptimizations();

    this.batteryInfo.addEventListener('levelchange', updateOptimizations);
    this.batteryInfo.addEventListener('chargingchange', updateOptimizations);
    this.batteryInfo.addEventListener('chargingtimechange', updateOptimizations);
    this.batteryInfo.addEventListener('dischargingtimechange', updateOptimizations);
  }

  updateOptimizations() {
    if (!this.batteryInfo) return;

    const { level, charging } = this.batteryInfo;
    const isLowBattery = level < 0.2; // Below 20%
    const isCriticalBattery = level < 0.1; // Below 10%

    // Auto mode: adjust based on battery level
    if (this.performanceMode === 'auto') {
      if (isCriticalBattery) {
        this.setBatterySaverMode(true);
      } else if (isLowBattery && !charging) {
        this.setOptimizedMode();
      } else if (charging || level > 0.5) {
        this.setPerformanceMode();
      }
    }

    // Notify components of changes
    this.dispatchOptimizationEvent();
  }

  setBatterySaverMode(aggressive = false) {
    this.optimizations = {
      animations: false,
      backgroundSync: false,
      autoplay: false,
      highRefreshRate: false,
      gpuAcceleration: false,
      backgroundTasks: false
    };

    if (aggressive) {
      // Additional aggressive optimizations
      this.optimizations.networkRequests = 'minimal';
      this.optimizations.imageQuality = 'low';
      this.optimizations.cacheOnly = true;
    }

    this.performanceMode = 'battery-saver';
    console.log('Battery saver mode activated');
  }

  setOptimizedMode() {
    this.optimizations = {
      animations: true,
      backgroundSync: true,
      autoplay: false,
      highRefreshRate: false,
      gpuAcceleration: true,
      backgroundTasks: true
    };

    this.performanceMode = 'optimized';
    console.log('Optimized mode activated');
  }

  setPerformanceMode() {
    this.optimizations = {
      animations: true,
      backgroundSync: true,
      autoplay: true,
      highRefreshRate: true,
      gpuAcceleration: true,
      backgroundTasks: true
    };

    this.performanceMode = 'performance';
    console.log('Performance mode activated');
  }

  monitorPerformance() {
    if (!('performance' in window)) return;

    // Monitor frame rate
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const measureFPS = (currentTime) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Adjust optimizations based on FPS
        if (fps < 30 && this.performanceMode !== 'battery-saver') {
          this.setOptimizedMode();
        } else if (fps > 55 && this.performanceMode === 'optimized') {
          this.setPerformanceMode();
        }
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usedPercent > 85) {
          this.triggerMemoryCleanup();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  triggerMemoryCleanup() {
    // Dispatch event for components to clean up
    window.dispatchEvent(new CustomEvent('memory-pressure', {
      detail: { action: 'cleanup' }
    }));

    // Force garbage collection if available (Chrome DevTools)
    if (window.gc) {
      window.gc();
    }

    console.log('Memory cleanup triggered');
  }

  dispatchOptimizationEvent() {
    window.dispatchEvent(new CustomEvent('performance-optimization', {
      detail: {
        mode: this.performanceMode,
        optimizations: this.optimizations,
        batteryLevel: this.batteryInfo?.level || 1,
        isCharging: this.batteryInfo?.charging || false
      }
    }));
  }

  // Network optimization
  optimizeNetworkRequests() {
    if (!this.optimizations.backgroundSync) {
      // Disable background sync
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'DISABLE_BACKGROUND_SYNC'
        });
      }
    }

    // Prioritize critical requests
    return {
      priority: this.performanceMode === 'battery-saver' ? 'low' : 'high',
      cache: this.optimizations.cacheOnly ? 'cache-only' : 'cache-first',
      timeout: this.performanceMode === 'battery-saver' ? 10000 : 5000
    };
  }

  // Image optimization
  getImageOptimization() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    let quality = 1;
    let maxWidth = window.innerWidth * devicePixelRatio;

    switch (this.performanceMode) {
      case 'battery-saver':
        quality = 0.6;
        maxWidth = Math.min(maxWidth, 800);
        break;
      case 'optimized':
        quality = 0.8;
        maxWidth = Math.min(maxWidth, 1200);
        break;
      case 'performance':
        quality = 1;
        // No width limit
        break;
    }

    return { quality, maxWidth };
  }

  // Animation optimization
  getAnimationConfig() {
    return {
      enabled: this.optimizations.animations,
      duration: this.optimizations.animations ? (this.performanceMode === 'performance' ? 300 : 200) : 0,
      easing: this.performanceMode === 'performance' ? 'ease-out' : 'linear'
    };
  }

  // Public API
  getOptimizations() {
    return {
      mode: this.performanceMode,
      ...this.optimizations,
      batteryLevel: this.batteryInfo?.level || 1,
      isCharging: this.batteryInfo?.charging || false
    };
  }

  setMode(mode) {
    this.performanceMode = mode;
    switch (mode) {
      case 'performance':
        this.setPerformanceMode();
        break;
      case 'optimized':
        this.setOptimizedMode();
        break;
      case 'battery-saver':
        this.setBatterySaverMode();
        break;
      default:
        this.performanceMode = 'auto';
        this.updateOptimizations();
    }
  }
}

// Singleton instance
export const batteryOptimizer = new BatteryOptimizer();

// React hook for battery optimization
export const useBatteryOptimization = () => {
  const [optimizations, setOptimizations] = useState(batteryOptimizer.getOptimizations());

  useEffect(() => {
    const handleOptimizationChange = (event) => {
      setOptimizations(event.detail);
    };

    window.addEventListener('performance-optimization', handleOptimizationChange);

    return () => {
      window.removeEventListener('performance-optimization', handleOptimizationChange);
    };
  }, []);

  return {
    ...optimizations,
    setMode: batteryOptimizer.setMode.bind(batteryOptimizer),
    getImageOptimization: batteryOptimizer.getImageOptimization.bind(batteryOptimizer),
    getAnimationConfig: batteryOptimizer.getAnimationConfig.bind(batteryOptimizer),
    optimizeNetworkRequests: batteryOptimizer.optimizeNetworkRequests.bind(batteryOptimizer)
  };
};
