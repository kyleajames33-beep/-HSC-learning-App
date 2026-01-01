import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color = 'primary',
  delay = 0,
  onClick,
  isClickable = false
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  const Component = isClickable ? motion.button : motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-4 shadow-lg border border-gray-100
        ${isClickable ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{value}</h3>
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </Component>
  );
};

export default StatCard;