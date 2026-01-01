import React from 'react';
import { Flame, Star } from 'lucide-react';
import { useGamificationContext } from '../context/GamificationContext';

/**
 * A component to display the user's current XP and streak.
 */
const UserStats = () => {
  // This hook consumes the shared context for gamification data.
  const { currentXP, currentStreak, loading, error } = useGamificationContext();

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="h-4 w-12 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-8 animate-pulse rounded-md bg-gray-700"></div>
      </div>
    );
  }

  if (error) {
    // In case of an error, we can hide the stats or show a subtle error state.
    return null;
  }

  return (
    <div className="flex items-center gap-4 font-semibold text-white">
      <div className="flex items-center gap-1 text-gaming-gold">
        <Star size={18} className="fill-current" />
        <span>{currentXP.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1 text-orange-400">
        <Flame size={18} className="fill-current" />
        <span>{currentStreak}</span>
      </div>
    </div>
  );
};

export default UserStats;