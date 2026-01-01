let serviceWorkerRegistered = false;
import { useState, useEffect } from 'react';

const getNavigator = () => (typeof window !== 'undefined' ? window.navigator : undefined);

const getInitialOnlineState = () => {
  const nav = getNavigator();
  return nav ? nav.onLine : true;
};

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(getInitialOnlineState);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const nav = getNavigator();
    let mediaQuery;
    let handleDisplayModeChange;

    const registerSW = async () => {
    if (serviceWorkerRegistered) {
      return;
    }

    if (!nav || !("serviceWorker" in nav)) {
      return;
    }

    try {
      const registration = await nav.serviceWorker.register("/sw.js");
      serviceWorkerRegistered = true;

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) {
          return;
        }

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && nav.serviceWorker.controller) {
            if (window.confirm("New version available! Reload to update?")) {
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

    registerSW();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };
    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const checkIfInstalled = () => {
      const isStandalone = Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
      const isIOSStandalone = nav?.standalone === true;
      setIsPWAInstalled(isStandalone || isIOSStandalone);
    };

    checkIfInstalled();

    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(display-mode: standalone)');
      handleDisplayModeChange = () => checkIfInstalled();

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleDisplayModeChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleDisplayModeChange);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);

      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleDisplayModeChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleDisplayModeChange);
        }
      }
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsPWAInstalled(true);
        setCanInstall(false);
      }

      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  };

  return {
    isOnline,
    isPWAInstalled,
    canInstall,
    installPWA,
  };
};

