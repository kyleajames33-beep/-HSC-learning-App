import React from 'react';
import { motion } from 'framer-motion';

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear'
    }
  }
};

const LoadingState = ({
  title = 'Loading…',
  message = 'Hang tight while we get things ready.',
  icon,
  showBackground = true
}) => (
  <div className={`${showBackground ? 'min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50' : ''} flex items-center justify-center px-4 py-16`}>
    <div className="text-center space-y-4">
      <motion.div
        className="w-16 h-16 border-4 border-primary-500/40 border-t-primary-500 rounded-full mx-auto"
        variants={spinnerVariants}
        animate="animate"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">{message}</p>
      </div>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
  </div>
);

export default LoadingState;
