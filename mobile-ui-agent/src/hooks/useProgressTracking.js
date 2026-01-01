import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { learningPathways, getUnlockedTopics, calculateSubjectProgress, getNextTopic, getAllTopicIds } from '../data/learningPathways';
import { progressAPI } from '../utils/progressAPI.js';
import syncManager from '../utils/syncManager.js';
import { useOnlineStatus } from './useOnlineStatus.js';

// Real progress tracking hook - fixed loading issue!
export const useProgressTracking = () => {
  const { user } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [userProgress, setUserProgress] = useState({
    biology: {
      completedTopics: [],
      currentTopic: null,
      streak: 0,
      totalXP: 0,
      level: 1,
      lastStudied: null
    },
    chemistry: {
      completedTopics: [],
      currentTopic: null,
      streak: 0,
      totalXP: 0,
      level: 1,
      lastStudied: null
    },
    dailyGoal: 3,
    dailyCompleted: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(' useProgressTracking useEffect: user changed:', user?.email);
    if (user) {
      console.log(' useProgressTracking useEffect: calling loadUserProgress');
      loadUserProgress();
    } else {
      console.log(' useProgressTracking useEffect: no user, not loading progress');
    }
  }, [user]);

  // Sync pending progress when coming online
  useEffect(() => {
    if (isOnline && user) {
      console.log(' useProgressTracking: online status changed, attempting sync');
      syncManager.syncProgressQueue();
    }
  }, [isOnline, user]);

  const loadUserProgress = async () => {
    try {
      console.log(' loadUserProgress: Starting for user:', user?.email);
      setLoading(true);
      
      let localProgress = null;
      let backendProgress = null;
      
      // Load from localStorage
      const savedProgress = localStorage.getItem(`progress_${user.email}`);
      if (savedProgress) {
        localProgress = JSON.parse(savedProgress);
        console.log(' loadUserProgress: Found local progress');
      }
      
      // Try to load from backend if online
      if (isOnline) {
        try {
          backendProgress = await progressAPI.getProgress();
          console.log(' loadUserProgress: Found backend progress');
        } catch (error) {
          console.warn(' loadUserProgress: Backend unavailable, using local only:', error.message);
          
          // If authentication failed, clear local data
          if (error.message.includes('Authentication failed')) {
            console.warn(' loadUserProgress: Authentication failed, clearing local progress');
            localStorage.removeItem(`progress_${user.email}`);
            localProgress = null;
          }
        }
      }
      
      // Resolve conflicts and merge progress
      const resolvedProgress = await resolveProgressConflicts(localProgress, backendProgress);
      
      if (resolvedProgress) {
        console.log(' loadUserProgress: Using resolved progress');
        setUserProgress(resolvedProgress);
        // Save resolved progress locally
        localStorage.setItem(`progress_${user.email}`, JSON.stringify(resolvedProgress));
      } else {
        console.log(' loadUserProgress: No saved progress, creating initial progress');
        // New user - start with clean slate
        const initialProgress = {
          biology: {
            completedTopics: [],
            currentTopic: 'dna-structure', // First topic
            streak: 0,
            totalXP: 0,
            level: 1,
            lastStudied: null
          },
          chemistry: {
            completedTopics: [],
            currentTopic: 'equilibrium-intro', // First topic
            streak: 0,
            totalXP: 0,
            level: 1,
            lastStudied: null
          },
          dailyGoal: 3,
          dailyCompleted: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          lastSyncedAt: Date.now()
        };
        
        setUserProgress(initialProgress);
        saveProgress(initialProgress);
      }
    } catch (error) {
      console.error(' loadUserProgress: Error loading user progress:', error);
    } finally {
      console.log(' loadUserProgress: Completed, setting loading to false');
      setLoading(false);
    }
  };

  // Conflict resolution function for multi-device sync
  const resolveProgressConflicts = async (localProgress, backendProgress) => {
    if (!localProgress && !backendProgress) {
      return null;
    }
    
    if (!localProgress) {
      return { ...backendProgress, lastSyncedAt: Date.now() };
    }
    
    if (!backendProgress) {
      return { ...localProgress, lastSyncedAt: Date.now() };
    }
    
    // Both exist - merge with conflict resolution
    const resolved = { ...localProgress };
    
    // Use most recent timestamp for basic fields
    const localTimestamp = localProgress.lastSyncedAt || 0;
    const backendTimestamp = backendProgress.lastSyncedAt || 0;
    
    if (backendTimestamp > localTimestamp) {
      resolved.dailyGoal = backendProgress.dailyGoal;
      resolved.dailyCompleted = backendProgress.dailyCompleted;
      resolved.joinedDate = backendProgress.joinedDate;
    }
    
    // Merge subject progress (union of completed topics, highest XP/level)
    ['biology', 'chemistry'].forEach(subject => {
      if (backendProgress[subject] && localProgress[subject]) {
        const local = localProgress[subject];
        const backend = backendProgress[subject];
        
        // Union of completed topics
        const allCompletedTopics = [...new Set([
          ...local.completedTopics,
          ...backend.completedTopics
        ])];
        
        // Use highest values for numerical fields
        resolved[subject] = {
          completedTopics: allCompletedTopics,
          currentTopic: backend.totalXP > local.totalXP ? backend.currentTopic : local.currentTopic,
          streak: Math.max(local.streak, backend.streak),
          totalXP: Math.max(local.totalXP, backend.totalXP),
          level: Math.max(local.level, backend.level),
          lastStudied: backend.lastStudied > local.lastStudied ? backend.lastStudied : local.lastStudied
        };
      } else if (backendProgress[subject]) {
        resolved[subject] = backendProgress[subject];
      }
    });
    
    resolved.lastSyncedAt = Date.now();
    return resolved;
  };

  const saveProgress = (progress) => {
    try {
      // Add sync timestamp
      const progressWithTimestamp = {
        ...progress,
        lastSyncedAt: Date.now()
      };
      
      // Always save to localStorage first (never lose data)
      try {
        localStorage.setItem(`progress_${user.email}`, JSON.stringify(progressWithTimestamp));
        console.log(' saveProgress: Saved to localStorage successfully');
      } catch (localError) {
        console.error(' saveProgress: Failed to save to localStorage:', localError);
        // Continue - still try to queue for backend sync
      }
      
      // Queue for backend sync (whether online or offline)
      try {
        syncManager.addProgressToQueue({
          action: 'SAVE_PROGRESS',
          data: progressWithTimestamp,
          priority: 2 // Medium priority
        });
        
        if (!isOnline) {
          console.log(' saveProgress: Queued for backend sync when online');
        }
      } catch (queueError) {
        console.error(' saveProgress: Failed to queue for sync:', queueError);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      
      // Try to save progress to a backup key if main save fails
      try {
        const backupKey = `progress_backup_${user.email}_${Date.now()}`;
        localStorage.setItem(backupKey, JSON.stringify(progress));
        console.log(' saveProgress: Saved backup progress to localStorage');
      } catch (backupError) {
        console.error(' saveProgress: Failed to save backup progress:', backupError);
      }
    }
  };

  const completeQuiz = (subjectId, topicId, score, questionsAnswered) => {
    setUserProgress(prev => {
      const updated = { ...prev };
      const subject = updated[subjectId];
      
      // Only add to completed if not already completed
      let topicDetails = null;

      if (!subject.completedTopics.includes(topicId)) {
        subject.completedTopics.push(topicId);
        
        // Award XP based on score and topic
        topicDetails = learningPathways[subjectId]?.modules
          ?.flatMap(m => m.topics)
          ?.find(t => t.id === topicId);
        
        if (topicDetails) {
          const xpMultiplier = score / 100; // XP based on score percentage
          const earnedXP = Math.round(topicDetails.xpReward * xpMultiplier);
          subject.totalXP += earnedXP;
          
          // Recalculate level
          subject.level = Math.floor(subject.totalXP / 500) + 1;
        } else {
          // Fallback XP system if no topic found
          const earnedXP = Math.round((score / 100) * 100); // Base 100 XP per quiz
          subject.totalXP += earnedXP;
          subject.level = Math.floor(subject.totalXP / 500) + 1;
        }
      }
      
      // Update current topic to next available
      const nextTopic = getNextUnlockedTopic(subjectId, subject.completedTopics);
      if (nextTopic) {
        subject.currentTopic = nextTopic.id;
      }
      
      // Update daily progress
      updated.dailyCompleted += 1;
      
      // Update streak if studied today
      const today = new Date().toISOString().split('T')[0];
      if (subject.lastStudied !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (subject.lastStudied === yesterdayStr) {
          subject.streak += 1;
        } else if (subject.lastStudied !== today) {
          subject.streak = 1; // Reset streak if gap
        }
      }
      
      subject.lastStudied = today;
      
      // Save progress and also sync quiz completion specifically
      saveProgress(updated);
      
      // Add quiz completion to sync queue with high priority
      const quizCompletionData = {
        userId: user.email,
        subjectId,
        topicId,
        score,
        questionsAnswered,
        completedAt: Date.now(),
        earnedXP: topicDetails ? Math.round(topicDetails.xpReward * (score / 100)) : Math.round((score / 100) * 100),
        timestamp: Date.now()
      };
      
      syncManager.addProgressToQueue({
        action: 'QUIZ_COMPLETION',
        data: quizCompletionData,
        priority: 3 // High priority
      });
      
      return updated;
    });
  };

  const getNextUnlockedTopic = (subjectId, completedTopics) => {
    const unlockedTopics = getUnlockedTopics(subjectId, completedTopics);
    return unlockedTopics.find(topic => !completedTopics.includes(topic.id));
  };

  const getSubjectData = (subjectId) => {
    const subjectProgress = userProgress[subjectId];
    const pathwayData = learningPathways[subjectId];
    
    if (!subjectProgress || !pathwayData) return null;
    
    const { progress, level, totalXP } = calculateSubjectProgress(subjectId, subjectProgress.completedTopics);
    const unlockedTopics = getUnlockedTopics(subjectId, subjectProgress.completedTopics);
    const nextTopic = getNextUnlockedTopic(subjectId, subjectProgress.completedTopics);
    
    // Process modules to add progress information
    const processedModules = pathwayData.modules.map(module => ({
      ...module,
      progress: module.topics ? 
        Math.round((module.topics.filter(topic => subjectProgress.completedTopics.includes(topic.id)).length / module.topics.length) * 100) 
        : 0,
      topicsCount: module.topics ? module.topics.length : 0
    }));
    
    return {
      ...pathwayData,
      modules: processedModules,
      progress,
      level: subjectProgress.level,
      totalXP: subjectProgress.totalXP,
      streak: subjectProgress.streak,
      completedTopics: subjectProgress.completedTopics,
      unlockedTopics,
      nextTopic,
      lastStudied: subjectProgress.lastStudied,
      totalTopics: pathwayData.modules.reduce((sum, module) => sum + (module.topics ? module.topics.length : 0), 0),
      completedCount: subjectProgress.completedTopics.length
    };
  };

  const isTopicUnlocked = (subjectId, topicId) => {
    const unlockedTopics = getUnlockedTopics(subjectId, userProgress[subjectId]?.completedTopics || []);
    return unlockedTopics.some(topic => topic.id === topicId);
  };

  const getTopicDetails = (subjectId, topicId) => {
    const subject = learningPathways[subjectId];
    if (!subject) return null;
    
    for (const module of subject.modules) {
      const topic = module.topics.find(t => t.id === topicId);
      if (topic) {
        return {
          ...topic,
          moduleId: module.id,
          moduleName: module.name,
          isUnlocked: isTopicUnlocked(subjectId, topicId),
          isCompleted: userProgress[subjectId]?.completedTopics.includes(topicId) || false
        };
      }
    }
    return null;
  };

  const resetProgress = (subjectId) => {
    setUserProgress(prev => {
      const updated = { ...prev };
      updated[subjectId] = {
        completedTopics: [],
        currentTopic: subjectId === 'biology' ? 'dna-structure' : 'equilibrium-intro',
        streak: 0,
        totalXP: 0,
        level: 1,
        lastStudied: null
      };
      saveProgress(updated);
      
      // Also sync reset specifically
      syncManager.addProgressToQueue({
        action: 'RESET_SUBJECT',
        data: { subjectId },
        priority: 2 // Medium priority
      });
      
      return updated;
    });
  };

  const updateDailyGoal = (newGoal) => {
    setUserProgress(prev => {
      const updated = { ...prev, dailyGoal: newGoal };
      saveProgress(updated);
      
      // Also sync daily goal specifically
      syncManager.addProgressToQueue({
        action: 'UPDATE_DAILY_GOAL',
        data: { goal: newGoal },
        priority: 1 // Low priority
      });
      
      return updated;
    });
  };

  return {
    userProgress,
    loading,
    completeQuiz,
    getSubjectData,
    isTopicUnlocked,
    getTopicDetails,
    resetProgress,
    updateDailyGoal,
    saveProgress,
    syncStatus: syncManager.getStatus().progressQueue,
    isOnline
  };
};

export default useProgressTracking;
