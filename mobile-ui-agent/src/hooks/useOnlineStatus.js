import { useEffect, useState } from 'react';

const getOnlineState = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(getOnlineState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};
