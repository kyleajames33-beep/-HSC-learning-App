import { useState, useEffect, useCallback } from 'react';
import { CHEMISTRY_MODULE_5_PATHWAY } from '../data/chemistryModule5Pathway';

// Content Access Tracking Hook for Chemistry Module 5 Pathway
export const useChemistryModule5Progress = (userId = 'demo-user') => {
  const [pathwayProgress, setPathwayProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user progress structure
  const initializeProgress = useCallback(() => {
    const savedProgress = localStorage.getItem(`chemistry-module5-progress-${userId}`);
    
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }

    // Initialize with IQ1.1 unlocked (starting point)
    return {
      userId,
      moduleId: 'chemistry-module-5',
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      unlockedDotPoints: ['IQ1.1'], // Only first dot point unlocked
      contentAccess: {}, // Track content access per dot point
      quizProgress: {}, // Track quiz attempts and scores
      completedDotPoints: [],
      overallProgress: 0,
      analytics: {
        totalTimeSpent: 0,
        contentAccessLog: [],
        quizAttemptLog: [],
        strugglingAreas: [],
        strongAreas: []
      }
    };
  }, [userId]);

  // Load progress on mount
  useEffect(() => {
    setLoading(true);
    const progress = initializeProgress();
    setPathwayProgress(progress);
    setLoading(false);
  }, [initializeProgress]);

  // Save progress to localStorage
  const saveProgress = useCallback((updatedProgress) => {
    localStorage.setItem(`chemistry-module5-progress-${userId}`, JSON.stringify(updatedProgress));
    setPathwayProgress(updatedProgress);
  }, [userId]);

  // Track content access (podcast, video, slides)
  const trackContentAccess = useCallback((dotPointId, contentType, contentId) => {
    if (!pathwayProgress) return;

    const timestamp = new Date().toISOString();
    const updatedProgress = { ...pathwayProgress };

    // Initialize content access for dot point if not exists
    if (!updatedProgress.contentAccess[dotPointId]) {
      updatedProgress.contentAccess[dotPointId] = {
        podcast: false,
        video: false,
        slides: false,
        accessTimestamps: {}
      };
    }

    // Mark content as accessed
    updatedProgress.contentAccess[dotPointId][contentType] = true;
    updatedProgress.contentAccess[dotPointId].accessTimestamps[contentType] = timestamp;

    // Add to analytics log
    updatedProgress.analytics.contentAccessLog.push({
      dotPointId,
      contentType,
      contentId,
      timestamp,
      sessionId: `session-${Date.now()}`
    });

    // Update last accessed time
    updatedProgress.lastAccessedAt = timestamp;

    // Check if all content for this dot point has been accessed
    const contentAccess = updatedProgress.contentAccess[dotPointId];
    const allContentAccessed = contentAccess.podcast && contentAccess.video && contentAccess.slides;

    if (allContentAccessed) {
      // Unlock quizzes for this dot point
      if (!updatedProgress.quizProgress[dotPointId]) {
        updatedProgress.quizProgress[dotPointId] = {
          quickQuizUnlocked: true,
          longResponseUnlocked: true,
          quickQuizAttempts: 0,
          longResponseAttempts: 0,
          quickQuizBestScore: null,
          longResponseBestScore: null,
          quickQuizPassed: false,
          longResponsePassed: false
        };
      } else {
        updatedProgress.quizProgress[dotPointId].quickQuizUnlocked = true;
        updatedProgress.quizProgress[dotPointId].longResponseUnlocked = true;
      }
    }

    saveProgress(updatedProgress);
    
    console.log(`🧪 Chemistry content accessed: ${dotPointId} - ${contentType} (All accessed: ${allContentAccessed})`);
    
    return { allContentAccessed, quizzesUnlocked: allContentAccessed };
  }, [pathwayProgress, saveProgress]);

  // Submit quiz attempt
  const submitQuizAttempt = useCallback((dotPointId, quizType, score, totalQuestions, timeSpent) => {
    if (!pathwayProgress) return { passed: false, canRetry: false };

    const timestamp = new Date().toISOString();
    const updatedProgress = { ...pathwayProgress };
    const passingScore = CHEMISTRY_MODULE_5_PATHWAY.requiredPassPercentage; // 65%
    const passed = score >= passingScore;

    // Initialize quiz progress if not exists
    if (!updatedProgress.quizProgress[dotPointId]) {
      updatedProgress.quizProgress[dotPointId] = {
        quickQuizUnlocked: false,
        longResponseUnlocked: false,
        quickQuizAttempts: 0,
        longResponseAttempts: 0,
        quickQuizBestScore: null,
        longResponseBestScore: null,
        quickQuizPassed: false,
        longResponsePassed: false
      };
    }

    const dotPointProgress = updatedProgress.quizProgress[dotPointId];

    // Update quiz-specific progress
    if (quizType === 'quickQuiz') {
      dotPointProgress.quickQuizAttempts++;
      if (!dotPointProgress.quickQuizBestScore || score > dotPointProgress.quickQuizBestScore) {
        dotPointProgress.quickQuizBestScore = score;
      }
      if (passed) dotPointProgress.quickQuizPassed = true;
    } else if (quizType === 'longResponse') {
      dotPointProgress.longResponseAttempts++;
      if (!dotPointProgress.longResponseBestScore || score > dotPointProgress.longResponseBestScore) {
        dotPointProgress.longResponseBestScore = score;
      }
      if (passed) dotPointProgress.longResponsePassed = true;
    }

    // Add to analytics log
    updatedProgress.analytics.quizAttemptLog.push({
      dotPointId,
      quizType,
      score,
      totalQuestions,
      timeSpent,
      passed,
      attempt: quizType === 'quickQuiz' ? dotPointProgress.quickQuizAttempts : dotPointProgress.longResponseAttempts,
      timestamp
    });

    // Check if dot point is fully completed (both quizzes passed)
    const dotPointCompleted = dotPointProgress.quickQuizPassed && dotPointProgress.longResponsePassed;
    
    if (dotPointCompleted && !updatedProgress.completedDotPoints.includes(dotPointId)) {
      updatedProgress.completedDotPoints.push(dotPointId);
      
      // Unlock next dot point
      const nextDotPoint = getNextDotPointToUnlock(dotPointId);
      if (nextDotPoint && !updatedProgress.unlockedDotPoints.includes(nextDotPoint)) {
        updatedProgress.unlockedDotPoints.push(nextDotPoint);
        console.log(`🧪 Unlocked next chemistry dot point: ${nextDotPoint}`);
      }
    }

    // Update analytics for struggling/strong areas
    if (score < 50) {
      const area = getDotPointTopic(dotPointId);
      if (!updatedProgress.analytics.strugglingAreas.includes(area)) {
        updatedProgress.analytics.strugglingAreas.push(area);
      }
    } else if (score >= 85) {
      const area = getDotPointTopic(dotPointId);
      if (!updatedProgress.analytics.strongAreas.includes(area)) {
        updatedProgress.analytics.strongAreas.push(area);
      }
    }

    // Update overall progress
    updatedProgress.overallProgress = calculateOverallProgress(updatedProgress);
    updatedProgress.lastAccessedAt = timestamp;

    saveProgress(updatedProgress);

    console.log(`🧪 Chemistry quiz completed: ${dotPointId} - ${quizType} - ${score}% (${passed ? 'PASSED' : 'FAILED'})`);

    return {
      passed,
      canRetry: !passed, // Can always retry failed quizzes
      dotPointCompleted,
      nextUnlocked: dotPointCompleted ? getNextDotPointToUnlock(dotPointId) : null
    };
  }, [pathwayProgress, saveProgress]);

  // Get next dot point to unlock based on current completion
  const getNextDotPointToUnlock = (completedDotPointId) => {
    const dotPointOrder = [
      'IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ1.4',
      'IQ2.1', 'IQ2.2', 'IQ2.3',
      'IQ3.1', 'IQ3.2', 'IQ3.3',
      'IQ4.1', 'IQ4.2', 'IQ4.3'
    ];
    
    const currentIndex = dotPointOrder.indexOf(completedDotPointId);
    return currentIndex >= 0 && currentIndex < dotPointOrder.length - 1 
      ? dotPointOrder[currentIndex + 1] 
      : null;
  };

  // Get topic name for analytics
  const getDotPointTopic = (dotPointId) => {
    const pathwayData = CHEMISTRY_MODULE_5_PATHWAY;
    for (const iq of Object.values(pathwayData.inquiryQuestions)) {
      for (const dotPoint of Object.values(iq.dotPoints)) {
        if (dotPoint.id === dotPointId) {
          return dotPoint.title;
        }
      }
    }
    return 'Unknown Topic';
  };

  // Calculate overall progress percentage
  const calculateOverallProgress = (progress) => {
    const totalDotPoints = 13; // 4+3+3+3
    return Math.round((progress.completedDotPoints.length / totalDotPoints) * 100);
  };

  // Check if content is accessible
  const isContentAccessible = useCallback((dotPointId) => {
    return pathwayProgress?.unlockedDotPoints?.includes(dotPointId) || false;
  }, [pathwayProgress]);

  // Check if all content has been accessed for a dot point
  const hasAccessedAllContent = useCallback((dotPointId) => {
    const contentAccess = pathwayProgress?.contentAccess?.[dotPointId];
    return contentAccess?.podcast && contentAccess?.video && contentAccess?.slides;
  }, [pathwayProgress]);

  // Check if quiz is available
  const isQuizAccessible = useCallback((dotPointId, quizType) => {
    if (!hasAccessedAllContent(dotPointId)) return false;
    
    const quizProgress = pathwayProgress?.quizProgress?.[dotPointId];
    if (!quizProgress) return false;

    if (quizType === 'quickQuiz') {
      return quizProgress.quickQuizUnlocked && !quizProgress.quickQuizPassed;
    } else if (quizType === 'longResponse') {
      return quizProgress.longResponseUnlocked && !quizProgress.longResponsePassed;
    }
    
    return false;
  }, [pathwayProgress, hasAccessedAllContent]);

  // Get dot point status
  const getDotPointStatus = useCallback((dotPointId) => {
    if (!pathwayProgress) return { status: 'locked', progress: 0 };

    const isUnlocked = pathwayProgress.unlockedDotPoints.includes(dotPointId);
    const isCompleted = pathwayProgress.completedDotPoints.includes(dotPointId);
    const hasContent = hasAccessedAllContent(dotPointId);
    const quizProgress = pathwayProgress.quizProgress[dotPointId];

    if (isCompleted) {
      return { status: 'completed', progress: 100, icon: '✅' };
    }
    
    if (!isUnlocked) {
      return { status: 'locked', progress: 0, icon: '🔒' };
    }

    let progress = 0;
    if (hasContent) progress += 50; // Content accessed = 50%
    if (quizProgress?.quickQuizPassed) progress += 25; // Quick quiz = 25%
    if (quizProgress?.longResponsePassed) progress += 25; // Long response = 25%

    return {
      status: progress > 0 ? 'in_progress' : 'available',
      progress,
      icon: progress > 0 ? '🔄' : '▶️'
    };
  }, [pathwayProgress, hasAccessedAllContent]);

  // Get pathway statistics for analytics
  const getPathwayStats = useCallback(() => {
    if (!pathwayProgress) return null;

    const analytics = pathwayProgress.analytics;
    const totalContentItems = pathwayProgress.unlockedDotPoints.length * 3; // 3 content items per dot point
    const accessedContentItems = analytics.contentAccessLog.length;
    const totalQuizzes = pathwayProgress.completedDotPoints.length * 2; // 2 quizzes per completed dot point
    const passedQuizzes = analytics.quizAttemptLog.filter(log => log.passed).length;

    return {
      overallProgress: pathwayProgress.overallProgress,
      unlockedDotPoints: pathwayProgress.unlockedDotPoints.length,
      completedDotPoints: pathwayProgress.completedDotPoints.length,
      contentAccessRate: totalContentItems > 0 ? Math.round((accessedContentItems / totalContentItems) * 100) : 0,
      quizPassRate: totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0,
      strugglingAreas: analytics.strugglingAreas,
      strongAreas: analytics.strongAreas,
      totalTimeSpent: analytics.totalTimeSpent,
      lastAccessed: pathwayProgress.lastAccessedAt
    };
  }, [pathwayProgress]);

  // Reset progress (for testing/admin)
  const resetProgress = useCallback(() => {
    localStorage.removeItem(`chemistry-module5-progress-${userId}`);
    const freshProgress = initializeProgress();
    setPathwayProgress(freshProgress);
  }, [userId, initializeProgress]);

  return {
    pathwayProgress,
    loading,
    trackContentAccess,
    submitQuizAttempt,
    isContentAccessible,
    hasAccessedAllContent,
    isQuizAccessible,
    getDotPointStatus,
    getPathwayStats,
    resetProgress
  };
};