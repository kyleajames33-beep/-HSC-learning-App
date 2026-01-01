import { useState, useEffect, useCallback } from 'react';
import { gamificationAPI } from '../utils/gamificationAPI';

const INITIAL_PROGRESS = {
  currentXP: 0,
  currentLevel: 1,
  xpToNextLevel: 250,
  totalPoints: 0,
  totalAchievements: 0,
  completedAchievements: 0,
  completionPercentage: 0,
};

const calculateLevelFromXP = (xp = 0) => Math.max(1, Math.floor(xp / 250) + 1);

const calculateXpToNextLevel = (xp = 0) => {
  const level = calculateLevelFromXP(xp);
  const nextThreshold = level * 250;
  const remaining = nextThreshold - xp;
  return remaining > 0 ? remaining : 250;
};

const buildUserProgress = (summary) => {
  if (!summary) {
    return INITIAL_PROGRESS;
  }

  const totalXP = summary.total_xp ?? summary.totalXP ?? 0;
  const level = calculateLevelFromXP(totalXP);

  return {
    currentXP: totalXP,
    currentLevel: level,
    xpToNextLevel: calculateXpToNextLevel(totalXP),
    totalPoints: summary.total_points ?? summary.totalPoints ?? 0,
    totalAchievements: summary.total_achievements ?? summary.totalAchievements ?? 0,
    completedAchievements: summary.completed_achievements ?? summary.completedAchievements ?? 0,
    completionPercentage: summary.completion_percentage ?? summary.completionPercentage ?? 0,
  };
};

const normalizeAchievementResponse = (response) => {
  if (!response) {
    return {
      achievements: [],
      summary: null,
      completed: [],
      inProgress: [],
      categories: {},
      featuredBadges: [],
    };
  }

  if (Array.isArray(response.achievements)) {
    return {
      achievements: response.achievements,
      summary: null,
      completed: [],
      inProgress: [],
      categories: {},
      featuredBadges: [],
    };
  }

  const data = response.data ?? {};
  return {
    achievements: data.userAchievements || data.achievements || [],
    summary: data.summary || null,
    completed: data.completedAchievements || [],
    inProgress: data.inProgressAchievements || [],
    categories: data.achievementsByCategory || {},
    featuredBadges: data.featuredBadges || [],
  };
};

const normalizeStreakResponse = (response) => {
  if (!response) {
    return null;
  }

  if (response.currentStreak !== undefined) {
    const freezes = response.freezesAvailable ?? response.streakFreeze ?? 0;
    return {
      currentStreak: response.currentStreak,
      longestStreak: response.longestStreak,
      lastStudyDate: response.lastStudyDate,
      freezesAvailable: freezes,
      streakFreeze: freezes,
      isActive: response.streakActive ?? true,
      recentActivity: [],
      achievedMilestones: [],
      daysSinceLastActivity: null,
    };
  }

  const data = response.data ?? {};
  const stats = data.streakStats || {};

  const freezes = stats.freeze_available ?? stats.freezeAvailable ?? 0;

  return {
    currentStreak: stats.current_streak ?? stats.currentStreak ?? 0,
    longestStreak: stats.max_streak ?? stats.longestStreak ?? 0,
    lastStudyDate: stats.last_activity_date ?? stats.lastStudyDate ?? null,
    freezesAvailable: freezes,
    streakFreeze: freezes,
    isActive: stats.is_active ?? stats.streakActive ?? false,
    recentActivity: data.recentActivity || [],
    achievedMilestones: data.achievedMilestones || [],
    daysSinceLastActivity: data.daysSinceLastActivity ?? null,
  };
};

export const useGamification = (userId = null) => {
  const [userProgress, setUserProgress] = useState(INITIAL_PROGRESS);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [lastEventAchievements, setLastEventAchievements] = useState([]);

  const loadGamificationData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [achievementsResponse, streakResponse] = await Promise.all([
        gamificationAPI.getUserAchievements(userId),
        gamificationAPI.getStreak(userId),
      ]);

      const normalizedAchievements = normalizeAchievementResponse(achievementsResponse);
      const normalizedStreak = normalizeStreakResponse(streakResponse);
      const mappedProgress = buildUserProgress(normalizedAchievements.summary);

      setAchievements(normalizedAchievements.achievements);
      setStreak(normalizedStreak);
      setUserProgress(mappedProgress);

      return {
        achievements: normalizedAchievements.achievements,
        summary: normalizedAchievements.summary,
        streak: normalizedStreak,
        progress: mappedProgress,
      };
    } catch (err) {
      console.error('Error loading gamification data:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshData = useCallback(async () => {
    try {
      return await loadGamificationData();
    } catch (err) {
      return null;
    }
  }, [loadGamificationData]);

  const syncOfflineData = useCallback(async () => {
    const result = await gamificationAPI.syncOfflineData();
    if (result?.success) {
      await refreshData();
    }
    return result;
  }, [refreshData]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineData();
    };

    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineData]);

  useEffect(() => {
    loadGamificationData().catch(() => {
      // Error state already handled inside loadGamificationData
    });
  }, [loadGamificationData]);

  const updateProgress = useCallback(
    async (quizResults) => {
      try {
        const { correctAnswers = 0 } = quizResults || {};
        const xpEarned = Number.isFinite(correctAnswers) ? correctAnswers * 10 : 0;
        const previousXP = userProgress?.currentXP ?? 0;
        const previousLevel = userProgress?.currentLevel ?? 1;

        const result = await gamificationAPI.updateUserProgress({
          ...quizResults,
          xpEarned,
        });

        const newAchievements =
          result?.data?.newlyCompletedAchievements ||
          result?.newlyCompletedAchievements ||
          [];

        setLastEventAchievements(newAchievements);

        if (!result?.offline) {
          const refreshed = await refreshData();
          const newXP = refreshed?.progress?.currentXP ?? previousXP + xpEarned;
          const newLevel = calculateLevelFromXP(newXP);

          return {
            success: result?.success !== false,
            xpEarned,
            newAchievements,
            leveledUp: newLevel > previousLevel,
          };
        }

        return {
          success: true,
          offline: true,
          xpEarned,
          newAchievements: [],
          leveledUp: false,
        };
      } catch (err) {
        console.error('Error updating gamification progress:', err);
        return { success: false, error: err.message };
      }
    },
    [refreshData, userProgress]
  );

  const updateStudyStreak = useCallback(
    async (params = {}) => {
      try {
        const result = await gamificationAPI.updateStreak(params);
        if (!result?.offline) {
          await refreshData();
        }
        return result;
      } catch (err) {
        console.error('Error updating study streak:', err);
        return { success: false, error: err.message };
      }
    },
    [refreshData]
  );

  const useStreakFreeze = useCallback(async () => {
    try {
      const result = await gamificationAPI.useStreakFreeze();
      if (result?.success) {
        await refreshData();
      }
      return result;
    } catch (err) {
      console.error('Error using streak freeze:', err);
      return { success: false, error: err.message };
    }
  }, [refreshData]);

  const addXP = useCallback(
    async (amount, source) => {
      try {
        const previousLevel = userProgress?.currentLevel ?? 1;
        const result = await gamificationAPI.addXP(amount, source);
        if (!result?.offline) {
          const refreshed = await refreshData();
          const newLevel = calculateLevelFromXP(
            refreshed?.progress?.currentXP ?? userProgress?.currentXP ?? 0
          );
          return {
            ...result,
            leveledUp: newLevel > previousLevel,
          };
        }
        return result;
      } catch (err) {
        console.error('Error adding XP:', err);
        return { success: false, error: err.message };
      }
    },
    [refreshData, userProgress]
  );

  const getAnalytics = useCallback(async (timeframe) => {
    try {
      return await gamificationAPI.getStudyAnalytics(timeframe);
    } catch (err) {
      console.error('Error getting analytics:', err);
      return null;
    }
  }, []);

  const checkNewAchievements = useCallback(async () => {
    return { success: true, newAchievements: lastEventAchievements };
  }, [lastEventAchievements]);

  return {
    userProgress,
    achievements,
    streak,
    loading,
    error,
    isOffline,
    updateProgress,
    updateStudyStreak,
    useStreakFreeze,
    addXP,
    checkNewAchievements,
    getAnalytics,
    refreshData,
    syncOfflineData,
    currentLevel: userProgress?.currentLevel ?? 1,
    currentXP: userProgress?.currentXP ?? 0,
    xpToNextLevel: userProgress?.xpToNextLevel ?? 0,
    totalAchievements: userProgress?.totalAchievements ?? achievements.length,
    earnedAchievements: achievements.filter((a) => a.is_completed ?? a.earned).length,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
  };
};

export const useQuizGamification = (quizResults) => {
  const [processedResults, setProcessedResults] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [xpGained, setXpGained] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [processing, setProcessing] = useState(true);

  const gamification = useGamification();

  const processQuizResults = useCallback(async () => {
    try {
      setProcessing(true);

      const result = await gamification.updateProgress(quizResults);

      if (result.success) {
        setXpGained(result.xpEarned || 0);
        setNewAchievements(result.newAchievements || []);
        setLeveledUp(result.leveledUp || false);
        setProcessedResults(result);
      }
    } catch (error) {
      console.error('Error processing quiz results:', error);
    } finally {
      setProcessing(false);
    }
  }, [gamification, quizResults]);

  useEffect(() => {
    if (quizResults && gamification.userProgress) {
      processQuizResults();
    }
  }, [quizResults, gamification.userProgress, processQuizResults]);

  return {
    ...gamification,
    processedResults,
    newAchievements,
    xpGained,
    leveledUp,
    processing,
  };
};

export default useGamification;
