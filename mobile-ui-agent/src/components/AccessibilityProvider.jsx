import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    voiceNavigation: false,
    keyboardNavigation: false,
    focusVisible: true,
    announcements: true
  });

  const { triggerHaptic } = useMobileOptimization();

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      // Detect reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Detect high contrast preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

      // Detect screen reader
      const hasScreenReader = 'speechSynthesis' in window || navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS');

      // Detect keyboard navigation
      const hasKeyboard = window.matchMedia('(pointer: fine)').matches;

      setSettings(prev => ({
        ...prev,
        reduceMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        screenReader: hasScreenReader,
        keyboardNavigation: hasKeyboard
      }));
    };

    detectSystemPreferences();

    // Listen for changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    reducedMotionQuery.addEventListener('change', detectSystemPreferences);
    highContrastQuery.addEventListener('change', detectSystemPreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', detectSystemPreferences);
      highContrastQuery.removeEventListener('change', detectSystemPreferences);
    };
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.setProperty('--base-font-size', {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    }[settings.fontSize]);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [settings]);

  // Screen reader announcements
  const announce = (message, priority = 'polite') => {
    if (!settings.announcements) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Text-to-speech for mobile devices
  const speak = (text, options = {}) => {
    if (!settings.screenReader || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';

    speechSynthesis.speak(utterance);
  };

  // Keyboard navigation helpers
  const handleKeyboardNavigation = (event, callbacks = {}) => {
    if (!settings.keyboardNavigation) return;

    const { key } = event;

    switch (key) {
      case 'ArrowUp':
        callbacks.up?.();
        event.preventDefault();
        break;
      case 'ArrowDown':
        callbacks.down?.();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        callbacks.left?.();
        event.preventDefault();
        break;
      case 'ArrowRight':
        callbacks.right?.();
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        callbacks.select?.();
        event.preventDefault();
        break;
      case 'Escape':
        callbacks.escape?.();
        event.preventDefault();
        break;
      case 'Tab':
        callbacks.tab?.(event.shiftKey ? 'previous' : 'next');
        break;
    }
  };

  // Focus management
  const focusElement = (selector, options = {}) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus(options);

      // Haptic feedback for mobile
      if (triggerHaptic) {
        triggerHaptic('light');
      }

      // Announce focus change
      if (settings.announcements && element.getAttribute('aria-label')) {
        announce(`Focused on ${element.getAttribute('aria-label')}`);
      }
    }
  };

  // Skip links for keyboard navigation
  const SkipLinks = () => (
    <div className="sr-only">
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-50 bg-blue-600 text-white p-2 rounded-br transform -translate-y-full focus:translate-y-0 transition-transform"
        onFocus={() => announce('Skip to main content')}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="fixed top-0 left-20 z-50 bg-blue-600 text-white p-2 rounded-br transform -translate-y-full focus:translate-y-0 transition-transform"
        onFocus={() => announce('Skip to navigation')}
      >
        Skip to navigation
      </a>
    </div>
  );

  // Accessibility settings panel
  const AccessibilitySettings = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Accessibility Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg touch-optimized"
              aria-label="Close accessibility settings"
            >
              <span className="sr-only">Close</span>
              
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                className="w-full p-2 border rounded-lg touch-optimized"
                aria-label="Select font size"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">High Contrast</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                className={`w-12 h-6 rounded-full transition-colors touch-optimized ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Turn ${settings.highContrast ? 'off' : 'on'} high contrast`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Reduce Motion</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }))}
                className={`w-12 h-6 rounded-full transition-colors touch-optimized ${
                  settings.reduceMotion ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Turn ${settings.reduceMotion ? 'off' : 'on'} reduced motion`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.reduceMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Screen Reader Support</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, screenReader: !prev.screenReader }))}
                className={`w-12 h-6 rounded-full transition-colors touch-optimized ${
                  settings.screenReader ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Turn ${settings.screenReader ? 'off' : 'on'} screen reader support`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Announcements */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Voice Announcements</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, announcements: !prev.announcements }))}
                className={`w-12 h-6 rounded-full transition-colors touch-optimized ${
                  settings.announcements ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Turn ${settings.announcements ? 'off' : 'on'} voice announcements`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.announcements ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => {
                // Reset to defaults
                setSettings({
                  fontSize: 'medium',
                  highContrast: false,
                  reduceMotion: false,
                  screenReader: false,
                  voiceNavigation: false,
                  keyboardNavigation: false,
                  focusVisible: true,
                  announcements: true
                });
                announce('Accessibility settings reset to defaults');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 touch-optimized"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 touch-optimized"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  const value = {
    settings,
    setSettings,
    announce,
    speak,
    handleKeyboardNavigation,
    focusElement,
    SkipLinks,
    AccessibilitySettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <SkipLinks />
      {children}
    </AccessibilityContext.Provider>
  );
};
