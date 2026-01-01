import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({
  progress,
  height = 8,
  color = '#0ea5e9',
  backgroundColor = '#e5e7eb',
  label,
  showPercentage = true,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ backgroundColor, height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;