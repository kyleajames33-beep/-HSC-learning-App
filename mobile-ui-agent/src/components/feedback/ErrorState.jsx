import React from 'react';
import { motion } from 'framer-motion';

const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't complete that action. Please try again shortly.",
  actionLabel = 'Try again',
  onRetry,
  details,
  showBackground = true
}) => (
  <div className={`${showBackground ? 'min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50' : ''} flex items-center justify-center px-4 py-16`}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg p-6 space-y-4 text-center"
    >
      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M20.385 20.389L3.615 3.611M9 5.434A7.962 7.962 0 0112 5c4.418 0 8 3.582 8 8a7.962 7.962 0 01-.432 2.594" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{message}</p>
        {details && <p className="text-xs text-gray-400">{details}</p>}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  </div>
);

export default ErrorState;
