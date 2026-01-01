import api from './api.js';

const isDev = Boolean(import.meta.env?.DEV);
const devBypass = isDev && import.meta.env?.VITE_DEV_BYPASS_AUTH === 'true';

const shouldUseOffline = () => {
  if (devBypass) {
    return true;
  }

  return typeof navigator !== 'undefined' && !navigator.onLine;
};

const ACHIEVEMENT_EVENTS = {
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_SCORE: 'quiz_score',
  STUDY_TIME: 'study_time',
  DAILY_STUDY: 'daily_study',
  MODULE_COMPLETED: 'module_completed',
};

const resolveUserId = (explicitUserId) => {
  if (explicitUserId) {
    return explicitUserId;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(storedUser);
    return (
      parsedUser?.id ||
      parsedUser?.userId ||
      parsedUser?.uuid ||
      parsedUser?.sub ||
      null
    );
  } catch (error) {
    console.error('Failed to resolve user id for gamification API:', error);
    return null;
  }
};

const postAchievementEvent = async ({ eventType, eventValue = 1, eventMetadata = {} }) => {
  if (!eventType) {
    throw new Error('eventType is required to record achievement progress');
  }

  if (shouldUseOffline()) {
    return storeProgressOffline({
      eventType,
      eventValue,
      eventMetadata,
      recordedAt: new Date().toISOString(),
    });
  }

  try {
    const response = await api.post('/achievements/progress', {
      eventType,
      eventValue,
      eventMetadata,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to record achievement progress:', error);
    return storeProgressOffline({
      eventType,
      eventValue,
      eventMetadata,
      error: error.message,
      recordedAt: new Date().toISOString(),
    });
  }
};

export const gamificationAPI = {
  // User Progress and XP
  updateUserProgress: async (progressData = {}) => {
    const {
      eventType = ACHIEVEMENT_EVENTS.QUIZ_COMPLETED,
      xpEarned,
      correctAnswers,
      totalQuestions,
      score,
      timeSpent,
      subject,
      difficulty,
      quizId,
      quizDate,
      eventValue: explicitEventValue,
      metadata = {},
    } = progressData;

    const computedScore =
      typeof score === 'number'
        ? score
        : typeof correctAnswers === 'number' &&
          typeof totalQuestions === 'number' &&
          totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : undefined;

    const eventValue =
      typeof explicitEventValue === 'number'
        ? explicitEventValue
        : typeof correctAnswers === 'number'
        ? correctAnswers
        : typeof computedScore === 'number'
        ? computedScore
        : 1;

    const metadataPayload = {
      ...metadata,
      correctAnswers,
      totalQuestions,
      score: computedScore,
      timeSpent,
      subject,
      difficulty,
      quizId,
      quizDate: quizDate || new Date().toISOString(),
    };

    if (typeof xpEarned === 'number') {
      metadataPayload.xpEarned = xpEarned;
    } else if (typeof correctAnswers === 'number') {
      metadataPayload.xpEarned = correctAnswers * 10;
    }

    return postAchievementEvent({
      eventType,
      eventValue,
      eventMetadata: metadataPayload,
    });
  },

  getUserProgress: async (userId) => {
    if (shouldUseOffline()) {
      return getOfflineProgress();
    }

    const resolvedUserId = resolveUserId(userId);

    if (!resolvedUserId) {
      console.warn('Unable to resolve user id for gamification progress; falling back to offline progress');
      return getOfflineProgress();
    }

    try {
      const response = await api.get(`/achievements/user/${resolvedUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user achievement summary:', error);
      return getOfflineProgress();
    }
  },

  // XP and Leveling
  addXP: async (xpAmount = 0, source = 'manual_award') => {
    const amount = Number.isFinite(xpAmount) ? xpAmount : 0;

    const result = await postAchievementEvent({
      eventType: ACHIEVEMENT_EVENTS.STUDY_TIME,
      eventValue: amount || 1,
      eventMetadata: {
        source,
        xpEarned: amount,
        awardType: 'manual_xp',
      },
    });

    if (result?.success) {
      return result;
    }

    // If offline fallback was triggered, ensure we return consistent shape
    return {
      success: false,
      offline: !!result?.offline,
      message: result?.error || 'XP recorded offline; will sync when online.',
    };
  },

  checkLevelUp: async (currentXP) => {
    return checkLevelUpOffline(currentXP);
  },

  // Achievements
  checkAchievements: async (quizData) => {
    if (shouldUseOffline()) {
      return checkAchievementsOffline(quizData);
    }

    // The achievements progress endpoint already returns newly unlocked achievements.
    // This helper now serves as a lightweight wrapper to keep existing callers working.
    return { success: true, newAchievements: [] };
  },

  unlockAchievement: async (achievementId) => {
    console.warn('Manual achievement unlocks are not supported via API. Request ignored for:', achievementId);
    return { success: false, error: 'Manual achievement unlocks are not supported.' };
  },

  getUserAchievements: async (userId) => {
    if (shouldUseOffline()) {
      return getOfflineAchievements();
    }

    const resolvedUserId = resolveUserId(userId);

    if (!resolvedUserId) {
      console.warn('Unable to resolve user id for achievements; returning offline defaults.');
      return getOfflineAchievements();
    }

    try {
      const response = await api.get(`/achievements/user/${resolvedUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return getOfflineAchievements();
    }
  },

  // Study Streaks
  updateStreak: async (params) => {
    if (shouldUseOffline()) {
      return updateStreakOffline(typeof params === 'string' ? params : params?.activityDate);
    }

    const {
      activityType = 'study_session',
      activityDate,
      timeMinutes = 0,
      points = 0,
      xp = 0,
    } = typeof params === 'object' && params !== null
      ? params
      : { activityDate: params };

    try {
      const response = await api.post('/achievements/streak', {
        activityType,
        activityDate: activityDate || new Date().toISOString().split('T')[0],
        timeMinutes,
        points,
        xp,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update streak:', error);
      return updateStreakOffline(activityDate);
    }
  },

  useStreakFreeze: async () => {
    if (shouldUseOffline()) {
      return applyStreakFreezeOffline();
    }

    try {
      const response = await api.post('/achievements/streak/freeze');
      return response.data;
    } catch (error) {
      console.error('Failed to use streak freeze:', error);
      return applyStreakFreezeOffline();
    }
  },

  getStreak: async (userId) => {
    if (shouldUseOffline()) {
      return getOfflineStreak();
    }

    const resolvedUserId = resolveUserId(userId);

    if (!resolvedUserId) {
      console.warn('Unable to resolve user id for streak stats; returning offline defaults.');
      return getOfflineStreak();
    }

    try {
      const response = await api.get(`/achievements/streak/${resolvedUserId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get streak:', error);
      return getOfflineStreak();
    }
  },

  // Analytics and Statistics
  getStudyAnalytics: async (timeframe = '30d') => {
    if (shouldUseOffline()) {
      return getOfflineAnalytics();
    }

    try {
      const response = await api.get(`/analytics/dashboard?timeframe=${encodeURIComponent(timeframe)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return getOfflineAnalytics();
    }
  },

  // Sync offline data when back online
  syncOfflineData: async () => {
    if (shouldUseOffline()) {
      return { success: true, message: 'Offline mode active' };
    }

    try {
      const offlineData = getOfflineGamificationData();
      const pendingEvents = offlineData?.progress || [];

      if (!pendingEvents.length) {
        return { success: true, message: 'No offline data to sync' };
      }

      const results = [];

      for (const event of pendingEvents) {
        try {
          const result = await postAchievementEvent({
            eventType: event.eventType,
            eventValue: event.eventValue,
            eventMetadata: event.eventMetadata,
          });
          results.push(result);
        } catch (error) {
          console.error('Failed to replay offline achievement event:', error);
          results.push({ success: false, error: error.message });
        }
      }

      clearOfflineGamificationData();
      return {
        success: true,
        message: `Synced ${results.filter(r => r?.success).length} of ${pendingEvents.length} events`,
        results,
      };
    } catch (error) {
      console.error('Failed to sync offline data:', error);
      return { success: false, error: error.message };
    }
  }
};

// Offline Storage Functions
const GAMIFICATION_STORAGE_KEY = 'hsc_gamification_offline';

function getOfflineGamificationData() {
  try {
    const data = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading offline gamification data:', error);
    return {};
  }
}

function saveOfflineGamificationData(data) {
  try {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving offline gamification data:', error);
  }
}

function clearOfflineGamificationData() {
  try {
    localStorage.removeItem(GAMIFICATION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing offline gamification data:', error);
  }
}

// Offline Implementation Functions
function storeProgressOffline(progressData) {
  const offlineData = getOfflineGamificationData();
  offlineData.progress = offlineData.progress || [];
  offlineData.progress.push({
    ...progressData,
    timestamp: new Date().toISOString(),
    synced: false
  });
  saveOfflineGamificationData(offlineData);
  return { success: true, offline: true };
}

function getOfflineProgress() {
  // Return mock progress when offline
  return {
    currentXP: 2850,
    currentLevel: 12,
    xpToNextLevel: 3200,
    totalQuestions: 847,
    averageScore: 87,
    offline: true
  };
}

function addXPOffline(xpAmount, source) {
  const offlineData = getOfflineGamificationData();
  offlineData.xp = offlineData.xp || [];
  offlineData.xp.push({
    amount: xpAmount,
    source,
    timestamp: new Date().toISOString(),
    synced: false
  });
  saveOfflineGamificationData(offlineData);
  return { success: true, offline: true, xpAdded: xpAmount };
}

function checkLevelUpOffline(currentXP) {
  // Simple level calculation
  const level = Math.floor(currentXP / 250) + 1;
  const xpToNext = (level * 250) - currentXP;
  return {
    currentLevel: level,
    xpToNextLevel: Math.max(xpToNext, 250),
    leveledUp: false,
    offline: true
  };
}

function checkAchievementsOffline(quizData) {
  // Return empty achievements when offline
  return {
    newAchievements: [],
    allAchievements: getOfflineAchievements().achievements || [],
    offline: true
  };
}

function unlockAchievementOffline(achievementId) {
  const offlineData = getOfflineGamificationData();
  offlineData.achievements = offlineData.achievements || [];
  offlineData.achievements.push({
    achievementId,
    timestamp: new Date().toISOString(),
    synced: false
  });
  saveOfflineGamificationData(offlineData);
  return { success: true, offline: true };
}

function getOfflineAchievements() {
  return {
    achievements: [
      {
        id: 'first_quiz',
        name: 'First Steps',
        icon: '',
        description: 'Completed your first quiz',
        earned: true,
        earnedDate: new Date().toISOString()
      }
    ],
    offline: true
  };
}

function updateStreakOffline(studyDate) {
  const offlineData = getOfflineGamificationData();
  offlineData.streaks = offlineData.streaks || [];
  offlineData.streaks.push({
    studyDate: studyDate || new Date().toISOString(),
    timestamp: new Date().toISOString(),
    synced: false
  });
  saveOfflineGamificationData(offlineData);
  return { success: true, offline: true };
}

function applyStreakFreezeOffline() {
  const offlineData = getOfflineGamificationData();
  offlineData.streakFreezes = offlineData.streakFreezes || [];
  offlineData.streakFreezes.push({
    timestamp: new Date().toISOString(),
    synced: false
  });
  saveOfflineGamificationData(offlineData);
  return { success: true, freezesRemaining: 2, offline: true };
}

function getOfflineStreak() {
  return {
    currentStreak: 7,
    longestStreak: 15,
    lastStudyDate: new Date().toISOString(),
    freezesAvailable: 3,
    offline: true
  };
}

function getOfflineAnalytics() {
  return {
    questionsAnswered: 245,
    averageScore: 87,
    timeStudied: 3600, // seconds
    subjectsStudied: ['biology', 'chemistry'],
    streakHistory: [1, 2, 3, 4, 5, 6, 7],
    offline: true
  };
}

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online - syncing gamification data...');
    gamificationAPI.syncOfflineData().then(result => {
      if (result.success) {
        console.log('Gamification data synced successfully');
      }
    });
  });
}

export default gamificationAPI;
