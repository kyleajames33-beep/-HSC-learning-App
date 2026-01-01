import { motion } from 'framer-motion';

// Animation variants for consistent motion across the app
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const slideUp = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' }
};

export const slideDown = {
  initial: { opacity: 0, y: '-100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '-100%' }
};

// Staggered children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Button press animations
export const buttonPress = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// Success/Error animations
export const successPulse = {
  scale: [1, 1.1, 1],
  transition: { duration: 0.6, times: [0, 0.5, 1] }
};

export const errorShake = {
  x: [-10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
};

// Loading animations
export const loadingSpinner = {
  rotate: 360,
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
};

export const loadingDots = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }
};

// Quiz-specific animations
export const questionSlide = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export const answerReveal = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.2 }
};

export const progressBar = {
  initial: { width: 0 },
  animate: { width: '100%' },
  transition: { duration: 0.8, ease: 'easeOut' }
};

// Achievement animations
export const achievementPop = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 200, damping: 15 }
};

export const confettiParticle = {
  initial: { opacity: 1, y: -10, scale: 0 },
  animate: {
    opacity: [1, 1, 0],
    y: 100,
    scale: [0, 1, 0.5],
    rotate: [0, 180, 360]
  },
  transition: { duration: 2, ease: 'easeOut' }
};

// Level up animations
export const levelUpGlow = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8]
  },
  transition: { duration: 2, repeat: Infinity }
};

// Streak fire animations
export const fireFlicker = {
  animate: {
    scale: [1, 1.1, 0.9, 1.05, 1],
    rotate: [-2, 2, -1, 1, 0]
  },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: { duration: 0.3 }
};

// Card hover animations
export const cardHover = {
  y: -5,
  scale: 1.02,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: { duration: 0.2 }
};

// Haptic feedback simulation (for browsers that support it)
export const triggerHaptic = (intensity = 'medium') => {
  if ('vibrate' in navigator) {
    switch (intensity) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      default:
        navigator.vibrate(25);
    }
  }
};

// Spring configurations
export const springConfigs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  moderate: { type: 'spring', stiffness: 200, damping: 15 },
  bouncy: { type: 'spring', stiffness: 300, damping: 10 },
  quick: { type: 'spring', stiffness: 400, damping: 25 }
};

// Custom transition timing
export const easings = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  snappy: [0.68, -0.55, 0.265, 1.55],
  gentle: [0.25, 0.1, 0.25, 1]
};

// Animation utilities
export const createStaggeredList = (children, delay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay,
      delayChildren: 0.1
    }
  }
});

export const createDelayedAnimation = (animation, delay = 0) => ({
  ...animation,
  transition: {
    ...animation.transition,
    delay
  }
});

// Performance-optimized animations for mobile
export const mobileOptimized = {
  // Use transform instead of changing layout properties
  slideUpMobile: {
    initial: { opacity: 0, transform: 'translateY(20px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: 0.3 }
  },

  // Reduced motion for accessibility
  reducedMotion: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  }
};

// Check if user prefers reduced motion
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get appropriate animation based on user preferences
export const getAccessibleAnimation = (animation) => {
  return respectsReducedMotion() ? mobileOptimized.reducedMotion : animation;
};

export default {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideUp,
  slideDown,
  staggerContainer,
  staggerItem,
  buttonPress,
  buttonHover,
  successPulse,
  errorShake,
  loadingSpinner,
  loadingDots,
  questionSlide,
  answerReveal,
  progressBar,
  achievementPop,
  confettiParticle,
  levelUpGlow,
  fireFlicker,
  pageTransition,
  cardHover,
  triggerHaptic,
  springConfigs,
  easings,
  createStaggeredList,
  createDelayedAnimation,
  mobileOptimized,
  respectsReducedMotion,
  getAccessibleAnimation
};