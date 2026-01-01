import React, { createContext, useContext } from 'react';
import { useGamification } from '../hooks/useGamification';
import { useAuth } from './AuthContext';

const GamificationContext = createContext(null);

/**
 * Provides gamification data (XP, streak, etc.) and a refetch function
 * to all child components.
 */
export const GamificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId =
    user?.id ||
    user?.userId ||
    (isAuthenticated && typeof user === 'string' ? user : null);

  const gamificationData = useGamification(userId);

  return (
    <GamificationContext.Provider value={gamificationData}>
      {children}
    </GamificationContext.Provider>
  );
};

/**
 * Custom hook to easily access the gamification context.
 */
export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};
