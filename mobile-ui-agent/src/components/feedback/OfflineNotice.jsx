import React from 'react';

const OfflineNotice = ({ message = 'You are currently offline. Some features may be unavailable.' }) => (
  <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-900 shadow-sm">
    <div className="flex items-center gap-2">
      <span role="img" aria-label="offline" className="text-lg">??</span>
      <span>{message}</span>
    </div>
  </div>
);

export default OfflineNotice;
