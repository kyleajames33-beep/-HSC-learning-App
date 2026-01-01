import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({
  title = 'Nothing to show yet.',
  message = 'Check back soon once fresh data is available.',
  icon = null,
  actionLabel,
  onAction,
  showBackground = false,
  className = '',
  children
}) => (
  <div
    className={`${showBackground ? 'min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50' : ''} flex items-center justify-center px-4 py-12 ${className}`}
  >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center space-y-4 max-w-sm"
    >
      {icon && (
        <div className="text-4xl mx-auto flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      {children && <div className="text-sm text-gray-500">{children}</div>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
          disabled={!onAction}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  </div>
);

export default EmptyState;
