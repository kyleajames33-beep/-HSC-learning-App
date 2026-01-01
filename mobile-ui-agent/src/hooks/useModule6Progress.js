import { useState, useEffect, useCallback } from 'react';
import { BIOLOGY_MODULE_6_PATHWAY } from '../data/biologyModule6Pathway';

// Content Access Tracking Hook for Module 6 Biology Pathway
export const useModule6Progress = (userId = 'demo-user') => {
  const [pathwayProgress, setPathwayProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user progress structure
  const initializeProgress = useCallback(() => {
    const savedProgress = localStorage.getItem(`module6-progress-${userId}`);
    
    // FORCE UNLOCK ALL DOTPOINTS - even if saved progress exists
    const baseProgress = savedProgress ? JSON.parse(savedProgress) : {};
    
    // Always ensure ALL dotpoints are unlocked (override saved state)
    return {
      userId,
      moduleId: 'biology-module-6',
      startedAt: baseProgress.startedAt || new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      unlockedDotPoints: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ1.4', 'IQ1.5', 'IQ1.6', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ2.4', 'IQ2.5', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ3.4', 'IQ3.5', 'IQ3.6', 'IQ3.7'], // FORCE ALL UNLOCKED
      contentAccess: baseProgress.contentAccess || {}, // Preserve existing content access
      quizProgress: baseProgress.quizProgress || {}, // Preserve existing quiz progress
      completedDotPoints: baseProgress.completedDotPoints || [],
      overallProgress: baseProgress.overallProgress || 0,
      analytics: baseProgress.analytics || {
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
    localStorage.setItem(`module6-progress-${userId}`, JSON.stringify(updatedProgress));
    setPathwayProgress(updatedProgress);
  }, [userId]);

  // Check if dot point is accessible (unlocked)
  const isContentAccessible = useCallback((dotPointId) => {
    if (!pathwayProgress) return false;
    return pathwayProgress.unlockedDotPoints.includes(dotPointId);
  }, [pathwayProgress]);

  // Check if all content for a dot point has been accessed
  const hasAccessedAllContent = useCallback((dotPointId) => {
    if (!pathwayProgress) return false;
    
    const contentAccess = pathwayProgress.contentAccess[dotPointId];
    if (!contentAccess) return false;

    return contentAccess.podcast && contentAccess.video && contentAccess.slides;
  }, [pathwayProgress]);

  // Check if quiz is accessible for a dot point (always available for unlocked dotpoints)
  const isQuizAccessible = useCallback((dotPointId, quizType) => {
    if (!pathwayProgress) return false;
    
    // Always accessible if dotpoint is unlocked (no content requirements)
    return isContentAccessible(dotPointId);
  }, [pathwayProgress, isContentAccessible]);

  // Track content access
  const trackContentAccess = useCallback((dotPointId, contentType, contentId) => {
    if (!pathwayProgress || !isContentAccessible(dotPointId)) {
      return { success: false, reason: 'Not accessible' };
    }

    const updatedProgress = { ...pathwayProgress };
    
    // Initialize content access for this dot point if needed
    if (!updatedProgress.contentAccess[dotPointId]) {
      updatedProgress.contentAccess[dotPointId] = {
        podcast: false,
        video: false,
        slides: false
      };
    }

    // Mark this content as accessed
    updatedProgress.contentAccess[dotPointId][contentType] = true;
    
    // Log access
    updatedProgress.analytics.contentAccessLog.push({
      dotPointId,
      contentType,
      contentId,
      accessedAt: new Date().toISOString()
    });

    // Update last accessed time
    updatedProgress.lastAccessedAt = new Date().toISOString();

    // Check if all content accessed for this dot point
    const allContentAccessed = hasAccessedAllContent(dotPointId);

    saveProgress(updatedProgress);

    return {
      success: true,
      allContentAccessed,
      unlockedQuizzes: allContentAccessed
    };
  }, [pathwayProgress, isContentAccessible, hasAccessedAllContent, saveProgress]);

  // Submit quiz attempt and unlock next content if passed
  const submitQuizAttempt = useCallback((dotPointId, quizType, score, answers, timeSpent) => {
    if (!pathwayProgress) return { success: false };

    const updatedProgress = { ...pathwayProgress };
    const passed = score >= BIOLOGY_MODULE_6_PATHWAY.requiredPassPercentage;

    // Initialize quiz progress for this dot point if needed
    if (!updatedProgress.quizProgress[dotPointId]) {
      updatedProgress.quizProgress[dotPointId] = {
        quickQuizAttempts: 0,
        quickQuizBestScore: 0,
        quickQuizPassed: false,
        longResponseAttempts: 0,
        longResponseBestScore: 0,
        longResponsePassed: false
      };
    }

    const quizProgress = updatedProgress.quizProgress[dotPointId];

    // Update quiz-specific progress
    if (quizType === 'quickQuiz') {
      quizProgress.quickQuizAttempts += 1;
      quizProgress.quickQuizBestScore = Math.max(quizProgress.quickQuizBestScore, score);
      if (passed) quizProgress.quickQuizPassed = true;
    } else {
      quizProgress.longResponseAttempts += 1;
      quizProgress.longResponseBestScore = Math.max(quizProgress.longResponseBestScore, score);
      if (passed) quizProgress.longResponsePassed = true;
    }

    // Log quiz attempt
    updatedProgress.analytics.quizAttemptLog.push({
      dotPointId,
      quizType,
      score,
      passed,
      timeSpent,
      attemptedAt: new Date().toISOString()
    });

    let unlockedContent = false;

    // Check if dot point is completed (both quizzes passed with 65%+)
    if (quizProgress.quickQuizPassed && quizProgress.longResponsePassed) {
      if (!updatedProgress.completedDotPoints.includes(dotPointId)) {
        updatedProgress.completedDotPoints.push(dotPointId);
        
        // Unlock next dot point(s)
        const nextDotPoints = getNextDotPoints(dotPointId);
        nextDotPoints.forEach(nextDotPoint => {
          if (!updatedProgress.unlockedDotPoints.includes(nextDotPoint)) {
            updatedProgress.unlockedDotPoints.push(nextDotPoint);
            unlockedContent = true;
          }
        });
      }
    }

    // Update overall progress
    updatedProgress.overallProgress = Math.round(
      (updatedProgress.completedDotPoints.length / BIOLOGY_MODULE_6_PATHWAY.totalDotPoints) * 100
    );

    saveProgress(updatedProgress);

    return {
      success: true,
      passed,
      score,
      unlockedContent,
      overallProgress: updatedProgress.overallProgress
    };
  }, [pathwayProgress, saveProgress]);

  // Get next dot points to unlock based on prerequisites
  const getNextDotPoints = useCallback((completedDotPointId) => {
    const nextDotPoints = [];
    
    // Check all dot points to see which ones have this as a prerequisite
    Object.values(BIOLOGY_MODULE_6_PATHWAY.inquiryQuestions).forEach(iq => {
      Object.entries(iq.dotPoints).forEach(([dotPointId, dotPoint]) => {
        if (dotPoint.prerequisites && dotPoint.prerequisites.includes(completedDotPointId)) {
          nextDotPoints.push(dotPointId);
        }
      });
    });

    return nextDotPoints;
  }, []);

  // Get dot point status for UI display
  const getDotPointStatus = useCallback((dotPointId) => {
    if (!pathwayProgress) return { status: 'locked', progress: 0, icon: '🔒' };

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

    // Calculate progress based on content access and quiz completion
    let progress = 0;
    const contentAccess = pathwayProgress.contentAccess[dotPointId];
    
    if (contentAccess) {
      const accessedCount = Object.values(contentAccess).filter(Boolean).length;
      progress += (accessedCount / 3) * 60; // Content worth 60% of progress
    }

    if (quizProgress) {
      if (quizProgress.quickQuizPassed) progress += 20; // Quick quiz worth 20%
      if (quizProgress.longResponsePassed) progress += 20; // Long response worth 20%
    }

    const status = progress > 0 ? 'in_progress' : 'available';
    const icon = progress > 0 ? '🔄' : '▶️';

    return { status, progress: Math.round(progress), icon };
  }, [pathwayProgress, hasAccessedAllContent]);

  // Get overall pathway statistics
  const getPathwayStats = useCallback(() => {
    if (!pathwayProgress) return null;

    return {
      overallProgress: pathwayProgress.overallProgress,
      unlockedDotPoints: pathwayProgress.unlockedDotPoints.length,
      completedDotPoints: pathwayProgress.completedDotPoints.length,
      totalDotPoints: BIOLOGY_MODULE_6_PATHWAY.totalDotPoints,
      totalQuizzesPassed: Object.values(pathwayProgress.quizProgress).reduce((total, dp) => {
        return total + (dp.quickQuizPassed ? 1 : 0) + (dp.longResponsePassed ? 1 : 0);
      }, 0)
    };
  }, [pathwayProgress]);

  return {
    pathwayProgress,
    loading,
    trackContentAccess,
    submitQuizAttempt,
    isContentAccessible,
    hasAccessedAllContent,
    isQuizAccessible,
    getDotPointStatus,
    getPathwayStats
  };
};