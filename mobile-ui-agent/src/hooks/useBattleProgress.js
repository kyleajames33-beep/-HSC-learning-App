import { useState, useEffect } from 'react';
import miniBossConfig from '../data/miniBossConfig.json';
import bossConfig from '../data/bossConfig.json';

/**
 * Custom hook for managing battle progress and unlock logic
 *
 * Unlock Requirements:
 * - Mini Boss: All IQ dotpoints completed + min 60% quiz average
 * - Boss Battle: All module Mini Bosses defeated + min 70% quiz average
 *
 * Progress tracked in localStorage:
 * {
 *   miniBossesDefeated: ['bio-m5-iq1', 'bio-m5-iq2'],
 *   bossesDefeated: ['bio-m5'],
 *   battleAttempts: {
 *     'bio-m5-iq1': { attempts: 2, lastAttempt: timestamp, victories: 1 }
 *   }
 * }
 */

const useBattleProgress = (subject, moduleId) => {
  const [battleProgress, setBattleProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const storageKey = `battle-progress-${subject}-${moduleId}`;

  // Initialize battle progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setBattleProgress(JSON.parse(saved));
        } else {
          // Initialize empty progress
          const initialProgress = {
            miniBossesDefeated: [],
            bossesDefeated: [],
            battleAttempts: {}
          };
          setBattleProgress(initialProgress);
          localStorage.setItem(storageKey, JSON.stringify(initialProgress));
        }
      } catch (error) {
        console.error('Failed to load battle progress:', error);
        setBattleProgress({
          miniBossesDefeated: [],
          bossesDefeated: [],
          battleAttempts: {}
        });
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [storageKey]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (battleProgress && !loading) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(battleProgress));
      } catch (error) {
        console.error('Failed to save battle progress:', error);
      }
    }
  }, [battleProgress, loading, storageKey]);

  /**
   * Check if a Mini Boss is unlocked
   * Requirements: All IQ dotpoints completed + min 60% quiz average
   */
  const isMiniBossUnlocked = (miniBossId, pathwayProgress) => {
    if (!pathwayProgress) return false;

    const miniBoss = getMiniBossConfig(miniBossId);
    if (!miniBoss) return false;

    // Check if all required dotpoints are completed
    const requiredDotpoints = miniBoss.unlockRequirements.completedDotpoints;
    const allDotpointsComplete = requiredDotpoints.every(dotpointId => {
      const dotpointStatus = pathwayProgress.dotPointProgress?.[dotpointId];
      return dotpointStatus?.completed === true;
    });

    if (!allDotpointsComplete) return false;

    // Check quiz score average
    const quizScores = [];
    requiredDotpoints.forEach(dotpointId => {
      const dotpointStatus = pathwayProgress.dotPointProgress?.[dotpointId];
      if (dotpointStatus?.quizAttempts?.quickQuiz?.length > 0) {
        const attempts = dotpointStatus.quizAttempts.quickQuiz;
        const bestScore = Math.max(...attempts.map(a => a.score));
        quizScores.push(bestScore);
      }
    });

    const averageScore = quizScores.length > 0
      ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
      : 0;

    return averageScore >= miniBoss.unlockRequirements.minQuizScore;
  };

  /**
   * Check if Boss Battle is unlocked
   * Requirements: All Mini Bosses defeated + min 70% average quiz score
   */
  const isBossBattleUnlocked = (bossId, pathwayProgress) => {
    if (!battleProgress || !pathwayProgress) return false;

    const boss = getBossConfig(bossId);
    if (!boss) return false;

    // Get all Mini Boss IDs for this module
    const moduleMiniBosses = boss.unlockRequirements.miniBossesDefeated;

    // Check if all Mini Bosses are defeated
    const allMiniBossesDefeated = moduleMiniBosses.every(miniBossId =>
      battleProgress.miniBossesDefeated.includes(miniBossId)
    );

    if (!allMiniBossesDefeated) return false;

    // Check overall quiz average
    const allQuizScores = [];
    Object.values(pathwayProgress.dotPointProgress || {}).forEach(dotpoint => {
      if (dotpoint.quizAttempts?.quickQuiz?.length > 0) {
        const attempts = dotpoint.quizAttempts.quickQuiz;
        const bestScore = Math.max(...attempts.map(a => a.score));
        allQuizScores.push(bestScore);
      }
    });

    const averageScore = allQuizScores.length > 0
      ? allQuizScores.reduce((sum, score) => sum + score, 0) / allQuizScores.length
      : 0;

    return averageScore >= boss.unlockRequirements.minQuizAverage;
  };

  /**
   * Check if a battle has been defeated
   */
  const isBattleDefeated = (battleId, battleType) => {
    if (!battleProgress) return false;

    if (battleType === 'mini-boss') {
      return battleProgress.miniBossesDefeated.includes(battleId);
    } else if (battleType === 'boss') {
      return battleProgress.bossesDefeated.includes(battleId);
    }
    return false;
  };

  /**
   * Record a battle attempt
   */
  const recordBattleAttempt = (battleId, victory = false) => {
    if (!battleProgress) return;

    const now = Date.now();
    const currentAttempts = battleProgress.battleAttempts[battleId] || {
      attempts: 0,
      victories: 0,
      lastAttempt: null
    };

    const updatedAttempts = {
      ...currentAttempts,
      attempts: currentAttempts.attempts + 1,
      victories: victory ? currentAttempts.victories + 1 : currentAttempts.victories,
      lastAttempt: now
    };

    setBattleProgress(prev => ({
      ...prev,
      battleAttempts: {
        ...prev.battleAttempts,
        [battleId]: updatedAttempts
      }
    }));
  };

  /**
   * Mark a Mini Boss as defeated
   */
  const defeatMiniBoss = (miniBossId, battleResults) => {
    if (!battleProgress) return;

    // Record the attempt
    recordBattleAttempt(miniBossId, true);

    // Add to defeated list if not already there
    if (!battleProgress.miniBossesDefeated.includes(miniBossId)) {
      setBattleProgress(prev => ({
        ...prev,
        miniBossesDefeated: [...prev.miniBossesDefeated, miniBossId]
      }));
    }

    return {
      success: true,
      xpEarned: battleResults.xpEarned || 100,
      badge: battleResults.badge || null
    };
  };

  /**
   * Mark a Boss Battle as defeated
   */
  const defeatBoss = (bossId, battleResults) => {
    if (!battleProgress) return;

    // Record the attempt
    recordBattleAttempt(bossId, true);

    // Add to defeated list if not already there
    if (!battleProgress.bossesDefeated.includes(bossId)) {
      setBattleProgress(prev => ({
        ...prev,
        bossesDefeated: [...prev.bossesDefeated, bossId]
      }));
    }

    return {
      success: true,
      xpEarned: battleResults.xpEarned || 500,
      badge: battleResults.badge || null,
      moduleComplete: true
    };
  };

  /**
   * Get Mini Boss configuration by ID
   */
  const getMiniBossConfig = (miniBossId) => {
    // Parse miniBossId (e.g., 'bio-m5-iq1' or 'biology-m5-iq1')
    const parts = miniBossId.split('-');
    const subjectShort = parts[0] === 'bio' ? 'biology' : parts[0] === 'chem' ? 'chemistry' : parts[0];
    const moduleKey = `module${parts[1].replace('m', '')}`;
    const iqKey = parts[2];

    return miniBossConfig[subjectShort]?.[moduleKey]?.[miniBossId];
  };

  /**
   * Get Boss Battle configuration by ID
   */
  const getBossConfig = (bossId) => {
    // Parse bossId (e.g., 'bio-m5' or 'biology-m5')
    const parts = bossId.split('-');
    const subjectShort = parts[0] === 'bio' ? 'biology' : parts[0] === 'chem' ? 'chemistry' : parts[0];

    return bossConfig[subjectShort]?.[bossId];
  };

  /**
   * Get battle statistics
   */
  const getBattleStats = () => {
    if (!battleProgress) return null;

    return {
      totalMiniBossesDefeated: battleProgress.miniBossesDefeated.length,
      totalBossesDefeated: battleProgress.bossesDefeated.length,
      totalBattles: Object.keys(battleProgress.battleAttempts).length,
      totalAttempts: Object.values(battleProgress.battleAttempts).reduce(
        (sum, attempt) => sum + attempt.attempts,
        0
      ),
      totalVictories: Object.values(battleProgress.battleAttempts).reduce(
        (sum, attempt) => sum + attempt.victories,
        0
      )
    };
  };

  return {
    battleProgress,
    loading,
    isMiniBossUnlocked,
    isBossBattleUnlocked,
    isBattleDefeated,
    recordBattleAttempt,
    defeatMiniBoss,
    defeatBoss,
    getMiniBossConfig,
    getBossConfig,
    getBattleStats
  };
};

export default useBattleProgress;
