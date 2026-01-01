import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

// Animation variants and presets
export const animationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  
  scaleUp: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 }
  },

  // Slide animations
  slideInUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' }
  },
  
  slideInDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' }
  },
  
  slideInLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' }
  },
  
  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' }
  },

  // Rotate animations
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 }
  },

  // Bounce animations
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { opacity: 0, scale: 0.3 }
  },

  // Flip animations
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 }
  },

  // Shake animation
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },

  // Pulse animation
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Floating animation
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // List stagger
  listContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  
  listItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
};

// Base animated component
export const Animated = ({ 
  children, 
  variant = 'fadeIn',
  duration = 0.3,
  delay = 0,
  className = '',
  ...props 
}) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  // Disable animations if performance is low
  if (!performanceConfig.enableAnimations) {
    return <div className={className} {...props}>{children}</div>;
  }

  const animation = animationVariants[variant] || animationVariants.fadeIn;
  
  return (
    <motion.div
      className={className}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ 
        duration: performanceConfig.animationDuration / 1000 || duration,
        delay 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, className = '' }) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  if (!performanceConfig.enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: performanceConfig.animationDuration / 1000 || 0.3,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Modal animation wrapper
export const ModalAnimation = ({ children, isOpen, onClose }) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  if (!performanceConfig.enableAnimations) {
    return isOpen ? children : null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: performanceConfig.animationDuration / 1000 || 0.3
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// List animation component
export const AnimatedList = ({ 
  children, 
  staggerDelay = 0.1,
  className = '' 
}) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  if (!performanceConfig.enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={animationVariants.listContainer}
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: staggerDelay }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={animationVariants.listItem}
          transition={{ 
            duration: performanceConfig.animationDuration / 1000 || 0.3
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Hover animation wrapper
export const HoverAnimation = ({ 
  children, 
  scale = 1.05,
  rotate = 0,
  y = -2,
  className = '',
  disabled = false,
  ...props 
}) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  if (!performanceConfig.enableAnimations || disabled) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale, 
        rotate, 
        y,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Progress animation component
export const ProgressAnimation = ({ 
  progress = 0, 
  className = '',
  color = 'bg-blue-600' 
}) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          duration: performanceConfig.enableAnimations ? 0.5 : 0,
          ease: "easeOut"
        }}
      />
    </div>
  );
};

// Loading dots animation
export const LoadingDots = ({ size = 'md', color = 'bg-blue-600' }) => {
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  if (!performanceConfig.enableAnimations) {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`${sizes[size]} ${color} rounded-full`} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className={`${sizes[size]} ${color} rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Count up animation
export const CountUpAnimation = ({ 
  from = 0, 
  to, 
  duration = 1,
  className = '' 
}) => {
  const [count, setCount] = React.useState(from);
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  React.useEffect(() => {
    if (!performanceConfig.enableAnimations) {
      setCount(to);
      return;
    }

    const increment = (to - from) / (duration * 60); // 60fps
    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + increment;
        if (next >= to) {
          clearInterval(timer);
          return to;
        }
        return next;
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [from, to, duration, performanceConfig.enableAnimations]);

  return (
    <span className={className}>
      {Math.round(count)}
    </span>
  );
};

// Parallax scrolling component
export const ParallaxScroll = ({ 
  children, 
  speed = 0.5,
  className = '' 
}) => {
  const [offsetY, setOffsetY] = React.useState(0);
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  React.useEffect(() => {
    if (!performanceConfig.enableAnimations) return;

    const handleScroll = () => setOffsetY(window.pageYOffset);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [performanceConfig.enableAnimations]);

  if (!performanceConfig.enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ y: offsetY * speed }}
    >
      {children}
    </motion.div>
  );
};

// Entrance animation for sections
export const EntranceAnimation = ({ 
  children, 
  threshold = 0.1,
  className = '' 
}) => {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef();
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();

  React.useEffect(() => {
    if (!performanceConfig.enableAnimations) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, performanceConfig.enableAnimations]);

  if (!performanceConfig.enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: performanceConfig.animationDuration / 1000 || 0.6,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  Animated,
  PageTransition,
  ModalAnimation,
  AnimatedList,
  HoverAnimation,
  ProgressAnimation,
  LoadingDots,
  CountUpAnimation,
  ParallaxScroll,
  EntranceAnimation,
  animationVariants
};