// Health check utility for verifying all systems are operational
import { authAPI } from './api';
import { quizAPI } from './quizAPI';
import { gamificationAPI } from './gamificationAPI';

export const healthCheck = {
  // Test all API endpoints
  async testAPIs() {
    const results = {
      mainAPI: { status: 'unknown', error: null },
      biologyAPI: { status: 'unknown', error: null },
      chemistryAPI: { status: 'unknown', error: null },
      gamificationAPI: { status: 'unknown', error: null }
    };

    // Test main authentication API
    try {
      const response = await fetch('http://localhost:3004/api/health', {
        method: 'GET',
        timeout: 5000
      });
      results.mainAPI.status = response.ok ? 'healthy' : 'error';
    } catch (error) {
      results.mainAPI.status = 'offline';
      results.mainAPI.error = error.message;
      console.log('Main API (port 3001) is offline - using fallbacks');
    }

    // Test Biology API
    try {
      const response = await fetch('http://localhost:3002/health', {
        method: 'GET',
        timeout: 5000
      });
      results.biologyAPI.status = response.ok ? 'healthy' : 'error';
    } catch (error) {
      results.biologyAPI.status = 'offline';
      results.biologyAPI.error = error.message;
      console.log('Biology API (port 3002) is offline - using mock data');
    }

    // Test Chemistry API
    try {
      const response = await fetch('http://localhost:3003/health', {
        method: 'GET',
        timeout: 5000
      });
      results.chemistryAPI.status = response.ok ? 'healthy' : 'error';
    } catch (error) {
      results.chemistryAPI.status = 'offline';
      results.chemistryAPI.error = error.message;
      console.log('Chemistry API (port 3003) is offline - using mock data');
    }

    // Test Gamification system
    try {
      const mockQuizResults = {
        correctAnswers: 8,
        totalQuestions: 10,
        timeSpent: 600,
        subject: 'biology',
        difficulty: 'medium'
      };
      const response = await gamificationAPI.updateUserProgress(mockQuizResults);
      results.gamificationAPI.status = response.success ? 'healthy' : 'error';
    } catch (error) {
      results.gamificationAPI.status = 'error';
      results.gamificationAPI.error = error.message;
    }

    return results;
  },

  // Test responsive design breakpoints
  testResponsiveDesign() {
    const breakpoints = {
      mobile: window.matchMedia('(max-width: 768px)').matches,
      tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches,
      desktop: window.matchMedia('(min-width: 1025px)').matches,
      touchSupport: 'ontouchstart' in window,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    };

    const viewportInfo = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth
    };

    const performance = {
      memory: window.performance?.memory ? {
        used: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024)
      } : null,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };

    return {
      breakpoints,
      viewport: viewportInfo,
      performance,
      accessibility: {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    };
  },

  // Test core app functionality
  async testCoreFeatures() {
    const features = {
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
      serviceWorker: false,
      notifications: false,
      geolocation: false,
      camera: false,
      vibration: false,
      fullscreen: false,
      webGL: false
    };

    // Test localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      features.localStorage = true;
    } catch (e) {
      console.warn('localStorage not available');
    }

    // Test sessionStorage
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      features.sessionStorage = true;
    } catch (e) {
      console.warn('sessionStorage not available');
    }

    // Test IndexedDB
    features.indexedDB = 'indexedDB' in window;

    // Test Service Worker
    features.serviceWorker = 'serviceWorker' in navigator;

    // Test Notifications
    features.notifications = 'Notification' in window;

    // Test Geolocation
    features.geolocation = 'geolocation' in navigator;

    // Test Camera/Media
    features.camera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

    // Test Vibration
    features.vibration = 'vibrate' in navigator;

    // Test Fullscreen
    features.fullscreen = 'requestFullscreen' in document.documentElement;

    // Test WebGL
    try {
      const canvas = document.createElement('canvas');
      features.webGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      features.webGL = false;
    }

    return features;
  },

  // Test quiz system functionality
  async testQuizSystem() {
    const results = {
      biologyQuestions: false,
      chemistryQuestions: false,
      answerSubmission: false,
      explanations: false,
      gamificationUpdate: false
    };

    try {
      // Test Biology questions
      const bioQuestions = await quizAPI.biology.getQuestions(5, 'medium', 5);
      results.biologyQuestions = bioQuestions.success && bioQuestions.questions.length > 0;

      // Test Chemistry questions
      const chemQuestions = await quizAPI.chemistry.getQuestions(6, 'easy', 5);
      results.chemistryQuestions = chemQuestions.success && chemQuestions.questions.length > 0;

      // Test answer submission (mock)
      if (bioQuestions.questions && bioQuestions.questions.length > 0) {
        const submission = await quizAPI.biology.submitAnswer(
          bioQuestions.questions[0].id,
          bioQuestions.questions[0].correctAnswer
        );
        results.answerSubmission = submission !== null;
      }

      // Test explanations
      if (bioQuestions.questions && bioQuestions.questions.length > 0) {
        const explanation = await quizAPI.biology.getExplanation(bioQuestions.questions[0].id);
        results.explanations = explanation !== null;
      }

      // Test gamification update
      const mockResults = {
        correctAnswers: 4,
        totalQuestions: 5,
        timeSpent: 300,
        subject: 'biology',
        difficulty: 'medium'
      };
      const gamificationUpdate = await gamificationAPI.updateUserProgress(mockResults);
      results.gamificationUpdate = gamificationUpdate.success || gamificationUpdate.offline;

    } catch (error) {
      console.error('Quiz system test error:', error);
    }

    return results;
  },

  // Run comprehensive system check
  async runFullDiagnostic() {
    console.log(' Starting comprehensive system diagnostic...');

    const diagnostic = {
      timestamp: new Date().toISOString(),
      apis: await this.testAPIs(),
      responsive: this.testResponsiveDesign(),
      features: await this.testCoreFeatures(),
      quizSystem: await this.testQuizSystem(),
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      }
    };

    // Generate summary
    const summary = {
      overallHealth: 'healthy',
      criticalIssues: [],
      warnings: [],
      recommendations: []
    };

    // Check for critical issues
    if (!diagnostic.features.localStorage) {
      summary.criticalIssues.push('localStorage not available - offline functionality disabled');
      summary.overallHealth = 'degraded';
    }

    if (!diagnostic.quizSystem.biologyQuestions && !diagnostic.quizSystem.chemistryQuestions) {
      summary.criticalIssues.push('No quiz questions available');
      summary.overallHealth = 'critical';
    }

    // Check for warnings
    if (diagnostic.apis.mainAPI.status === 'offline') {
      summary.warnings.push('Main API offline - using fallback functionality');
    }

    if (diagnostic.apis.biologyAPI.status === 'offline') {
      summary.warnings.push('Biology API offline - using mock questions');
    }

    if (diagnostic.apis.chemistryAPI.status === 'offline') {
      summary.warnings.push('Chemistry API offline - using mock questions');
    }

    // Add recommendations
    if (diagnostic.responsive.performance.memory && diagnostic.responsive.performance.memory.used > 50) {
      summary.recommendations.push('High memory usage detected - consider refreshing the app');
    }

    if (diagnostic.responsive.performance.connection && diagnostic.responsive.performance.connection.effectiveType === 'slow-2g') {
      summary.recommendations.push('Slow network detected - offline mode recommended');
    }

    diagnostic.summary = summary;

    // Log results
    console.log(' System Diagnostic Results:', diagnostic);

    if (summary.overallHealth === 'healthy') {
      console.log(' All systems operational!');
    } else if (summary.overallHealth === 'degraded') {
      console.log(' System operational with some limitations');
    } else {
      console.log(' Critical issues detected');
    }

    return diagnostic;
  }
};

// Auto-run diagnostic in development
if (process.env.NODE_ENV === 'development') {
  // Run diagnostic after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      healthCheck.runFullDiagnostic();
    }, 2000);
  });
}

export default healthCheck;
