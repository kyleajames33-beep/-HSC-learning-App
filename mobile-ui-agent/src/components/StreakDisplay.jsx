import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StreakDisplay = ({
  currentStreak,
  longestStreak,
  lastStudyDate,
  streakFreeze = 0,
  onStreakFreeze,
  animated = true
}) => {
  const [flameAnimation, setFlameAnimation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isStreakActive = isDateToday(lastStudyDate) || isDateYesterday(lastStudyDate);
  const streakStatus = getStreakStatus(currentStreak, lastStudyDate);

  useEffect(() => {
    if (animated && currentStreak > 0) {
      setFlameAnimation(true);
      // Check for milestone celebrations
      if (currentStreak % 7 === 0 && currentStreak > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [currentStreak, animated]);

  function isDateToday(date) {
    if (!date) return false;
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  }

  function isDateYesterday(date) {
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const checkDate = new Date(date);
    return yesterday.toDateString() === checkDate.toDateString();
  }

  function getStreakStatus(streak, lastDate) {
    if (!lastDate) return { message: "Start your streak today!", color: "text-gray-500", icon: "" };

    if (isDateToday(lastDate)) {
      return { message: "Streak active today! ", color: "text-green-600", icon: "" };
    }

    if (isDateYesterday(lastDate)) {
      return { message: "Study today to continue!", color: "text-yellow-600", icon: "" };
    }

    return { message: "Streak broken. Start again!", color: "text-red-500", icon: "" };
  }

  const getStreakMessage = (streak) => {
    if (streak >= 30) return "Legendary Scholar! ";
    if (streak >= 21) return "Study Master! ";
    if (streak >= 14) return "Two weeks strong! ";
    if (streak >= 7) return "One week streak! ";
    if (streak >= 3) return "Building momentum! ";
    if (streak >= 1) return "Great start! ";
    return "Ready to begin? ";
  };

  const getFlameIntensity = (streak) => {
    if (streak >= 21) return { size: 'text-4xl', color: 'from-orange-400 to-red-500', flames: 5 };
    if (streak >= 14) return { size: 'text-3xl', color: 'from-yellow-400 to-orange-500', flames: 4 };
    if (streak >= 7) return { size: 'text-2xl', color: 'from-yellow-300 to-yellow-500', flames: 3 };
    if (streak >= 3) return { size: 'text-xl', color: 'from-yellow-200 to-yellow-400', flames: 2 };
    return { size: 'text-lg', color: 'from-gray-300 to-gray-400', flames: 1 };
  };

  const intensity = getFlameIntensity(currentStreak);

  return (
    <div className="relative">
      {/* Milestone Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center z-10"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                
              </motion.div>
              <div className="font-bold">Week Streak!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${intensity.color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}
      >
        {/* Background flame particles */}
        {isStreakActive && currentStreak > 0 && (
          <>
            {[...Array(intensity.flames)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-200 opacity-30"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  fontSize: `${12 + i * 2}px`,
                }}
                animate={flameAnimation ? {
                  y: [-5, -15, -5],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                
              </motion.div>
            ))}
          </>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={flameAnimation && currentStreak > 0 ? {
                  scale: [1, 1.2, 1],
                  rotate: [-5, 5, -5],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`${intensity.size}`}
              >
                {currentStreak > 0 ? '' : ''}
              </motion.div>
              <div>
                <div className="font-bold text-lg">Study Streak</div>
                <div className="text-xs text-white/80">{streakStatus.message}</div>
              </div>
            </div>

            {/* Streak freeze counter */}
            {streakFreeze > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
              >
                <span></span>
                <span>{streakFreeze}</span>
              </motion.div>
            )}
          </div>

          {/* Current Streak Display */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-4xl font-bold mb-1"
            >
              {currentStreak}
            </motion.div>
            <div className="text-sm text-white/90">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </div>
            <div className="text-xs text-white/70 mt-1">
              {getStreakMessage(currentStreak)}
            </div>
          </div>

          {/* Progress to next milestone */}
          {currentStreak > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Next milestone</span>
                <span>{getNextMilestone(currentStreak)} days</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getMilestoneProgress(currentStreak)}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="bg-white/60 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold">{longestStreak}</div>
              <div className="text-xs text-white/80">Best Streak</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold">
                {lastStudyDate ? formatDaysAgo(lastStudyDate) : 'Never'}
              </div>
              <div className="text-xs text-white/80">Last Study</div>
            </div>
          </div>

          {/* Streak freeze button */}
          {currentStreak > 0 && !isDateToday(lastStudyDate) && streakFreeze === 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={onStreakFreeze}
              className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
            >
               Use Streak Freeze (Save your streak!)
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

function getNextMilestone(current) {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 365];
  return milestones.find(m => m > current) || current + 30;
}

function getMilestoneProgress(current) {
  const nextMilestone = getNextMilestone(current);
  const prevMilestone = [0, 3, 7, 14, 21, 30, 60, 90].reverse().find(m => m <= current) || 0;
  return ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
}

function formatDaysAgo(date) {
  if (!date) return 'Never';
  const now = new Date();
  const studyDate = new Date(date);
  const diffTime = Math.abs(now - studyDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export default StreakDisplay;
