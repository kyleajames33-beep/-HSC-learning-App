import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const XPProgress = ({ userId, className = '' }) => {
  const [xpData, setXpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentXP, setRecentXP] = useState(0);

  useEffect(() => {
    fetchXPData();
  }, [userId]);

  const fetchXPData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`/api/achievements/user/${userId}`, { headers });
      const data = await response.json();

      if (data.success) {
        // Transform to match expected format
        const summary = data.data?.summary || {};
        const totalXP = summary.total_xp || 0;
        const currentLevel = Math.floor(totalXP / 1000) + 1;
        const xpInCurrentLevel = totalXP % 1000;
        const xpToNext = 1000 - xpInCurrentLevel;
        const progress = (xpInCurrentLevel / 1000) * 100;

        setXpData({
          success: true,
          user: {
            level: currentLevel,
            xp: totalXP,
            accuracy: 85, // Could calculate from quiz history
            totalQuestionsAnswered: summary.total_achievements || 0,
            correctAnswers: summary.completed_achievements || 0
          },
          progressInfo: {
            nextLevel: currentLevel + 1,
            xpToNext: xpToNext,
            progress: progress
          }
        });
      }
    } catch (error) {
      console.error('Error fetching XP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateXPGain = (xpGained) => {
    setRecentXP(xpGained);
    setTimeout(() => setRecentXP(0), 2000);
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!xpData) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600">Unable to load XP data</p>
      </div>
    );
  }

  const { user, progressInfo } = xpData;
  const progressPercentage = progressInfo ? progressInfo.progress : 0;

  return (
    <div className={`bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 relative overflow-hidden ${className}`}>
      {/* Recent XP Animation */}
      {recentXP > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -30, scale: 1.2 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-2 right-2 text-green-600 font-bold text-lg z-10"
        >
          +{recentXP} XP
        </motion.div>
      )}

      {/* Level and XP Display */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Level {user.level}</h3>
          <p className="text-sm text-gray-600">{user.xp.toLocaleString()} XP</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Accuracy</div>
          <div className="text-lg font-semibold text-blue-600">{user.accuracy}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      {progressInfo && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress to Level {progressInfo.nextLevel}</span>
            <span>{progressInfo.xpToNext} XP to go</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 relative">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* Level indicator */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
        <div className="bg-white/50 rounded-lg p-2">
          <div className="text-lg font-bold text-gray-800">{user.totalQuestionsAnswered}</div>
          <div className="text-xs text-gray-600">Questions</div>
        </div>
        <div className="bg-white/50 rounded-lg p-2">
          <div className="text-lg font-bold text-green-600">{user.correctAnswers}</div>
          <div className="text-xs text-gray-600">Correct</div>
        </div>
      </div>
    </div>
  );
};

export default XPProgress;