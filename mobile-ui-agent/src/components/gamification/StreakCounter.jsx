import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StreakCounter = ({ userId, className = '' }) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`/api/achievements/streak/${userId}`, { headers });
      const data = await response.json();

      if (data.success) {
        const streakInfo = data.data || {};
        setStreakData({
          currentStreak: streakInfo.current_streak || 0,
          bestStreak: streakInfo.longest_streak || 0,
          streakGoal: 7, // Could be configurable
          lastActivityDate: streakInfo.last_activity_date || new Date().toISOString(),
          streakHistory: streakInfo.activity_days || [] // Last activity days
        });
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
      // Fallback to default data
      setStreakData({
        currentStreak: 0,
        bestStreak: 0,
        streakGoal: 7,
        lastActivityDate: new Date().toISOString(),
        streakHistory: []
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      } : {
        'Content-Type': 'application/json'
      };

      const response = await fetch(`/api/achievements/streak`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          activityDate: new Date().toISOString(),
          activityType: 'manual_checkin',
          timeMinutes: 0,
          points: 0,
          xp: 10 // Small XP bonus for maintaining streak
        })
      });

      const data = await response.json();

      if (data.success) {
        const streakInfo = data.data || {};
        const newStreak = streakInfo.currentStreak || streakInfo.current_streak || 0;
        const wasNewStreak = newStreak > (streakData?.currentStreak || 0);

        setStreakData(prev => ({
          ...prev,
          currentStreak: newStreak,
          bestStreak: Math.max(prev?.bestStreak || 0, newStreak),
          lastActivityDate: new Date().toISOString()
        }));

        if (wasNewStreak) {
          setCelebrating(true);
          setTimeout(() => setCelebrating(false), 2000);
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600">Unable to load streak data</p>
      </div>
    );
  }

  const { currentStreak, bestStreak, streakGoal, streakHistory } = streakData;
  const progressToGoal = Math.min((currentStreak / streakGoal) * 100, 100);
  const isGoalReached = currentStreak >= streakGoal;

  return (
    <div className={`bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 relative ${className}`}>
      {/* Celebration Animation */}
      {celebrating && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.5, 1], rotate: [0, 360, 0] }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="text-6xl">🎉</div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ 
              scale: currentStreak > 0 ? [1, 1.2, 1] : 1,
              rotate: currentStreak > 0 ? [0, 10, -10, 0] : 0
            }}
            transition={{ 
              duration: 2, 
              repeat: currentStreak > 0 ? Infinity : 0,
              repeatDelay: 3
            }}
            className="text-2xl"
          >
            🔥
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Streak</h3>
            <p className="text-sm text-gray-600">Keep it going!</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
          <div className="text-xs text-gray-500">days</div>
        </div>
      </div>

      {/* Progress to Goal */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Goal: {streakGoal} days</span>
          <span className={isGoalReached ? 'text-green-600 font-bold' : ''}>
            {isGoalReached ? '🎯 Goal reached!' : `${streakGoal - currentStreak} to go`}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              isGoalReached 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressToGoal, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Streak History */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 mb-2">Last 7 days</div>
        <div className="flex space-x-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayIndex = 6 - i; // Reverse to show most recent first
            const hasActivity = dayIndex < streakHistory.length;
            
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  hasActivity 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {hasActivity ? '✓' : '○'}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/50 rounded-lg p-2">
          <div className="text-lg font-bold text-gray-800">{bestStreak}</div>
          <div className="text-xs text-gray-600">Best Streak</div>
        </div>
        <div className="bg-white/50 rounded-lg p-2">
          <div className="text-lg font-bold text-orange-600">{currentStreak}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={updateStreak}
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Continue Streak
      </button>
    </div>
  );
};

export default StreakCounter;