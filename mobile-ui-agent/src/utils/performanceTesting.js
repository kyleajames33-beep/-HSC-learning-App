import { useState } from 'react';

// Performance testing utilities for mobile devices

export class MobilePerformanceTester {
  constructor() {
    this.results = {
      deviceInfo: {},
      performanceMetrics: {},
      featureSupport: {},
      benchmarks: {}
    };

    this.init();
  }

  async init() {
    await this.detectDevice();
    this.setupPerformanceMonitoring();
  }

  async detectDevice() {
    const userAgent = navigator.userAgent;
    const deviceInfo = {
      userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0,
      deviceMemory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : 'unknown'
    };

    // Screen information
    deviceInfo.screen = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation?.type || 'unknown',
      devicePixelRatio: window.devicePixelRatio || 1
    };

    // Viewport information
    deviceInfo.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    };

    // Battery information
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        deviceInfo.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        deviceInfo.battery = 'unavailable';
      }
    }

    // Device classification
    deviceInfo.deviceClass = this.classifyDevice(deviceInfo);

    this.results.deviceInfo = deviceInfo;
    return deviceInfo;
  }

  classifyDevice(info) {
    const { hardwareConcurrency, deviceMemory, connection, screen } = info;

    // Budget device indicators
    const isBudgetDevice = (
      hardwareConcurrency <= 4 ||
      deviceMemory <= 2 ||
      (connection !== 'unknown' && connection.effectiveType === '2g') ||
      screen.width <= 360 ||
      screen.devicePixelRatio <= 1.5
    );

    // Mid-range device indicators
    const isMidRange = (
      hardwareConcurrency <= 6 &&
      deviceMemory <= 4 &&
      screen.width <= 414 &&
      screen.devicePixelRatio <= 2.5
    );

    if (isBudgetDevice) return 'budget';
    if (isMidRange) return 'mid-range';
    return 'high-end';
  }

  setupPerformanceMonitoring() {
    // Frame rate monitoring
    this.monitorFrameRate();

    // Memory monitoring
    this.monitorMemoryUsage();

    // Network monitoring
    this.monitorNetworkPerformance();

    // Touch response monitoring
    this.monitorTouchPerformance();
  }

  monitorFrameRate() {
    let frameCount = 0;
    let lastTime = performance.now();
    const frameTimes = [];

    const measureFrame = (currentTime) => {
      frameCount++;
      frameTimes.push(currentTime - lastTime);

      if (frameCount >= 60) { // Measure every 60 frames
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avgFrameTime;

        this.results.performanceMetrics.fps = {
          current: Math.round(fps),
          average: this.results.performanceMetrics.fps?.average
            ? (this.results.performanceMetrics.fps.average + fps) / 2
            : fps,
          frameTime: avgFrameTime
        };

        frameCount = 0;
        frameTimes.length = 0;
      }

      lastTime = currentTime;
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  monitorMemoryUsage() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      this.results.performanceMetrics.memory = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
        usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100) // %
      };
    };

    checkMemory();
    setInterval(checkMemory, 5000); // Check every 5 seconds
  }

  monitorNetworkPerformance() {
    if (!navigator.connection) return;

    const updateNetworkInfo = () => {
      this.results.performanceMetrics.network = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    };

    updateNetworkInfo();
    navigator.connection.addEventListener('change', updateNetworkInfo);
  }

  monitorTouchPerformance() {
    let touchStartTime = 0;
    const touchResponseTimes = [];

    document.addEventListener('touchstart', (e) => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (touchStartTime) {
        const responseTime = performance.now() - touchStartTime;
        touchResponseTimes.push(responseTime);

        // Keep only last 10 measurements
        if (touchResponseTimes.length > 10) {
          touchResponseTimes.shift();
        }

        const avgResponseTime = touchResponseTimes.reduce((a, b) => a + b, 0) / touchResponseTimes.length;

        this.results.performanceMetrics.touch = {
          averageResponseTime: Math.round(avgResponseTime),
          lastResponseTime: Math.round(responseTime),
          samples: touchResponseTimes.length
        };
      }
    }, { passive: true });
  }

  async runBenchmarks() {
    console.log('Running performance benchmarks...');

    // CPU benchmark
    await this.benchmarkCPU();

    // Rendering benchmark
    await this.benchmarkRendering();

    // Animation benchmark
    await this.benchmarkAnimations();

    // Network benchmark
    await this.benchmarkNetwork();

    return this.results.benchmarks;
  }

  async benchmarkCPU() {
    const iterations = 100000;
    const start = performance.now();

    // Simple CPU-intensive task
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }

    const end = performance.now();
    this.results.benchmarks.cpu = {
      iterations,
      timeMs: Math.round(end - start),
      score: Math.round(iterations / (end - start))
    };
  }

  async benchmarkRendering() {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const iterations = 1000;
      let currentIteration = 0;
      const start = performance.now();

      const renderFrame = () => {
        // Clear canvas
        ctx.clearRect(0, 0, 300, 300);

        // Draw complex shapes
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 300, Math.random() * 300, Math.random() * 50, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
          ctx.fill();
        }

        currentIteration++;
        if (currentIteration < iterations) {
          requestAnimationFrame(renderFrame);
        } else {
          const end = performance.now();
          document.body.removeChild(canvas);

          this.results.benchmarks.rendering = {
            iterations,
            timeMs: Math.round(end - start),
            fps: Math.round(iterations / ((end - start) / 1000))
          };

          resolve();
        }
      };

      requestAnimationFrame(renderFrame);
    });
  }

  async benchmarkAnimations() {
    return new Promise((resolve) => {
      const element = document.createElement('div');
      element.style.cssText = `
        position: fixed;
        top: -100px;
        left: -100px;
        width: 50px;
        height: 50px;
        background: red;
        transform: translateZ(0);
      `;
      document.body.appendChild(element);

      const iterations = 100;
      let currentIteration = 0;
      const start = performance.now();

      const animate = () => {
        element.style.transform = `translateX(${Math.sin(currentIteration / 10) * 50}px) translateY(${Math.cos(currentIteration / 10) * 50}px) translateZ(0)`;

        currentIteration++;
        if (currentIteration < iterations) {
          requestAnimationFrame(animate);
        } else {
          const end = performance.now();
          document.body.removeChild(element);

          this.results.benchmarks.animation = {
            iterations,
            timeMs: Math.round(end - start),
            fps: Math.round(iterations / ((end - start) / 1000))
          };

          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  async benchmarkNetwork() {
    const start = performance.now();

    try {
      // Test with a small image
      await fetch('/vite.svg', { cache: 'no-cache' });
      const end = performance.now();

      this.results.benchmarks.network = {
        latency: Math.round(end - start),
        success: true
      };
    } catch (error) {
      this.results.benchmarks.network = {
        latency: -1,
        success: false,
        error: error.message
      };
    }
  }

  checkFeatureSupport() {
    const features = {
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'PushManager' in window,
      notifications: 'Notification' in window,
      geolocation: 'geolocation' in navigator,
      battery: 'getBattery' in navigator,
      deviceMemory: 'deviceMemory' in navigator,
      connection: 'connection' in navigator,
      webGL: !!document.createElement('canvas').getContext('webgl'),
      webGL2: !!document.createElement('canvas').getContext('webgl2'),
      indexedDB: 'indexedDB' in window,
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window,
      touchEvents: 'ontouchstart' in window,
      pointerEvents: 'onpointerdown' in window,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      vibration: 'vibrate' in navigator,
      speechSynthesis: 'speechSynthesis' in window,
      speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      fullscreen: 'requestFullscreen' in document.documentElement,
      intersectionObserver: 'IntersectionObserver' in window,
      mutationObserver: 'MutationObserver' in window,
      performanceObserver: 'PerformanceObserver' in window
    };

    this.results.featureSupport = features;
    return features;
  }

  generateReport() {
    const { deviceInfo, performanceMetrics, featureSupport, benchmarks } = this.results;

    const recommendations = [];

    // Device-specific recommendations
    if (deviceInfo.deviceClass === 'budget') {
      recommendations.push('Enable battery saver mode');
      recommendations.push('Disable complex animations');
      recommendations.push('Reduce image quality');
      recommendations.push('Limit background processes');
    }

    // Performance-based recommendations
    if (performanceMetrics.fps?.current < 30) {
      recommendations.push('Reduce animation complexity');
      recommendations.push('Implement frame rate limiting');
    }

    if (performanceMetrics.memory?.usage > 80) {
      recommendations.push('Implement memory cleanup');
      recommendations.push('Reduce cached data');
    }

    if (performanceMetrics.touch?.averageResponseTime > 50) {
      recommendations.push('Optimize touch event handlers');
      recommendations.push('Reduce DOM manipulation during touch');
    }

    return {
      deviceInfo,
      performanceMetrics,
      featureSupport,
      benchmarks,
      recommendations,
      overallScore: this.calculateOverallScore(),
      timestamp: new Date().toISOString()
    };
  }

  calculateOverallScore() {
    let score = 100;

    // Deduct points based on performance
    if (this.results.performanceMetrics.fps?.current < 30) score -= 20;
    if (this.results.performanceMetrics.memory?.usage > 80) score -= 15;
    if (this.results.performanceMetrics.touch?.averageResponseTime > 50) score -= 10;

    // Deduct points for budget device
    if (this.results.deviceInfo.deviceClass === 'budget') score -= 15;

    // Add points for feature support
    const supportedFeatures = Object.values(this.results.featureSupport || {}).filter(Boolean).length;
    score += Math.min(supportedFeatures, 20);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  getRecommendations() {
    const report = this.generateReport();
    return report.recommendations;
  }
}

// Global instance
export const performanceTester = new MobilePerformanceTester();

// React hook for performance testing
export const usePerformanceTesting = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runFullTest = async () => {
    setIsRunning(true);

    await performanceTester.checkFeatureSupport();
    await performanceTester.runBenchmarks();

    const report = performanceTester.generateReport();
    setTestResults(report);
    setIsRunning(false);

    return report;
  };

  return {
    testResults,
    isRunning,
    runFullTest,
    getRecommendations: performanceTester.getRecommendations.bind(performanceTester)
  };
};
