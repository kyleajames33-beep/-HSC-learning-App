import { useCallback, useEffect } from 'react';

// Analytics events enum
export const ANALYTICS_EVENTS = {
  // Authentication
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  USER_LOGOUT: 'user_logout',
  PASSWORD_RESET: 'password_reset',

  // Navigation
  PAGE_VIEW: 'page_view',
  SUBJECT_SELECTED: 'subject_selected',

  // Quiz System
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_ABANDONED: 'quiz_abandoned',
  QUESTION_ANSWERED: 'question_answered',
  ANSWER_CHANGED: 'answer_changed',

  // Gamification
  XP_EARNED: 'xp_earned',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  STREAK_UPDATED: 'streak_updated',
  STREAK_FREEZE_USED: 'streak_freeze_used',

  // Performance
  PERFORMANCE_METRIC: 'performance_metric',
  ERROR_OCCURRED: 'error_occurred',
  API_CALL: 'api_call',

  // Engagement
  PULL_TO_REFRESH: 'pull_to_refresh',
  BUTTON_CLICKED: 'button_clicked',
  FEATURE_USED: 'feature_used'
};

// Simple analytics implementation
class AnalyticsManager {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.isEnabled = true;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  track(eventName, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }
    };

    // Store in localStorage for offline scenarios
    this.events.push(event);
    this.saveToStorage();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(' Analytics Event:', event);
    }

    // Send to analytics service (would be real endpoint in production)
    this.sendEvent(event);
  }

  trackPerformance(metricName, value, unit = 'ms') {
    this.track(ANALYTICS_EVENTS.PERFORMANCE_METRIC, {
      metricName,
      value,
      unit,
      deviceMemory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection?.effectiveType || 'unknown'
    });
  }

  trackError(error, context = {}) {
    this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error: error.message,
      stack: error.stack,
      context,
      url: window.location.href
    });
  }

  trackPageView(pageName, properties = {}) {
    this.track(ANALYTICS_EVENTS.PAGE_VIEW, {
      pageName,
      ...properties
    });
  }

  saveToStorage() {
    try {
      localStorage.setItem('hsc_analytics_events', JSON.stringify(this.events.slice(-100)));
    } catch (e) {
      console.warn('Failed to save analytics to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('hsc_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load analytics from localStorage:', e);
    }
  }

  async sendEvent(event) {
    try {
      // In production, this would send to your analytics service
      // For now, we'll just simulate the API call
      if (navigator.onLine) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));

        // Here you would send to your analytics endpoint:
        // await fetch('/api/analytics/track', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(event)
        // });
      }
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1]),
      userId: this.userId,
      events: this.events
    };
  }

  flushEvents() {
    this.events = [];
    this.saveToStorage();
  }
}

// Create singleton instance
const analytics = new AnalyticsManager();

// Load persisted events on initialization
analytics.loadFromStorage();

// Auto-flush events before page unload
window.addEventListener('beforeunload', () => {
  analytics.flushEvents();
});

export const useAnalytics = () => {
  const track = useCallback((eventName, properties = {}) => {
    analytics.track(eventName, properties);
  }, []);

  const trackPerformance = useCallback((metricName, value, unit) => {
    analytics.trackPerformance(metricName, value, unit);
  }, []);

  const trackError = useCallback((error, context) => {
    analytics.trackError(error, context);
  }, []);

  const trackPageView = useCallback((pageName, properties) => {
    analytics.trackPageView(pageName, properties);
  }, []);

  const setUserId = useCallback((userId) => {
    analytics.setUserId(userId);
  }, []);

  const getSessionSummary = useCallback(() => {
    return analytics.getSessionSummary();
  }, []);

  // Track page views automatically
  useEffect(() => {
    const path = window.location.pathname;
    trackPageView(path);
  }, [trackPageView]);

  // Track performance metrics
  useEffect(() => {
    // Track initial page load performance
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      if (pageLoadTime > 0) {
        trackPerformance('page_load_time', pageLoadTime);
      }
    }

    // Track memory usage if available
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      trackPerformance('memory_used', memory.usedJSHeapSize, 'bytes');
    }
  }, [trackPerformance]);

  return {
    track,
    trackPerformance,
    trackError,
    trackPageView,
    setUserId,
    getSessionSummary,
    EVENTS: ANALYTICS_EVENTS
  };
};

export default useAnalytics;
