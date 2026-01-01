import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PerformanceTracker = ({ 
  questionId, 
  questionType, 
  dotPoint, 
  difficulty, 
  onPerformanceUpdate 
}) => {
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const trackAttempt = (correct = false) => {
    setAttempts(prev => prev + 1);
    setIsCorrect(correct);
    
    if (correct) {
      const performanceData = calculatePerformance();
      onPerformanceUpdate?.(performanceData);
      saveToLocalStorage(performanceData);
    }
  };

  const trackHint = () => {
    setHints(prev => prev + 1);
  };

  const trackConfidence = (confidenceLevel) => {
    setConfidence(confidenceLevel);
  };

  const calculatePerformance = () => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    const baseScore = isCorrect ? 100 : 0;
    const attemptPenalty = Math.max(0, (attempts - 1) * 10);
    const hintPenalty = hints * 5;
    const timePenalty = Math.max(0, (totalTime - 30000) / 1000);
    
    const finalScore = Math.max(0, baseScore - attemptPenalty - hintPenalty - timePenalty);
    
    const difficultyMultipliers = {
      easy: 1.0,
      medium: 1.2,
      hard: 1.5
    };
    
    const adjustedScore = finalScore * (difficultyMultipliers[difficulty] || 1.0);
    
    const efficiency = totalTime > 0 ? Math.min(100, (30000 / totalTime) * 100) : 100;
    
    const mastery = calculateMastery(adjustedScore, attempts, totalTime, confidence);

    return {
      questionId,
      questionType,
      dotPoint,
      difficulty,
      score: Math.round(adjustedScore),
      attempts,
      hints,
      timeSpent: totalTime,
      efficiency: Math.round(efficiency),
      mastery,
      confidence,
      timestamp: endTime,
      correct: isCorrect
    };
  };

  const calculateMastery = (score, attempts, time, confidence) => {
    let masteryScore = 0;
    
    if (score >= 90 && attempts === 1) masteryScore += 30;
    else if (score >= 80 && attempts <= 2) masteryScore += 25;
    else if (score >= 70) masteryScore += 20;
    else if (score >= 60) masteryScore += 15;
    else if (score >= 50) masteryScore += 10;
    
    if (time <= 15000) masteryScore += 20;
    else if (time <= 30000) masteryScore += 15;
    else if (time <= 60000) masteryScore += 10;
    
    if (hints === 0) masteryScore += 15;
    else if (hints === 1) masteryScore += 10;
    else if (hints === 2) masteryScore += 5;
    
    if (confidence >= 4) masteryScore += 10;
    else if (confidence >= 3) masteryScore += 7;
    else if (confidence >= 2) masteryScore += 5;
    
    const difficultyBonus = {
      easy: 0,
      medium: 5,
      hard: 10
    };
    
    masteryScore += difficultyBonus[difficulty] || 0;
    
    const masteryLevel = Math.min(100, Math.max(0, masteryScore));
    
    if (masteryLevel >= 90) return 'Expert';
    if (masteryLevel >= 75) return 'Proficient';
    if (masteryLevel >= 60) return 'Competent';
    if (masteryLevel >= 45) return 'Developing';
    return 'Novice';
  };

  const saveToLocalStorage = (performanceData) => {
    try {
      const existing = JSON.parse(localStorage.getItem('performanceData') || '[]');
      existing.push(performanceData);
      
      if (existing.length > 1000) {
        existing.splice(0, existing.length - 1000);
      }
      
      localStorage.setItem('performanceData', JSON.stringify(existing));
      
      updateAggregateStats(performanceData);
      
    } catch (error) {
      console.error('Error saving performance data:', error);
    }
  };

  const updateAggregateStats = (performanceData) => {
    try {
      const existing = JSON.parse(localStorage.getItem('aggregatePerformance') || '{}');
      
      const key = `${performanceData.dotPoint}_${performanceData.questionType}`;
      
      if (!existing[key]) {
        existing[key] = {
          totalAttempts: 0,
          totalScore: 0,
          totalTime: 0,
          bestScore: 0,
          worstScore: 100,
          masteryLevels: [],
          recentScores: []
        };
      }
      
      const stats = existing[key];
      stats.totalAttempts += 1;
      stats.totalScore += performanceData.score;
      stats.totalTime += performanceData.timeSpent;
      stats.bestScore = Math.max(stats.bestScore, performanceData.score);
      stats.worstScore = Math.min(stats.worstScore, performanceData.score);
      stats.masteryLevels.push(performanceData.mastery);
      stats.recentScores.push({
        score: performanceData.score,
        timestamp: performanceData.timestamp
      });
      
      if (stats.recentScores.length > 10) {
        stats.recentScores.splice(0, stats.recentScores.length - 10);
      }
      
      localStorage.setItem('aggregatePerformance', JSON.stringify(existing));
      
    } catch (error) {
      console.error('Error updating aggregate stats:', error);
    }
  };

  const getPerformanceInsights = () => {
    const performanceData = JSON.parse(localStorage.getItem('performanceData') || '[]');
    const recent = performanceData.slice(-20);
    
    if (recent.length === 0) return null;
    
    const avgScore = recent.reduce((sum, p) => sum + p.score, 0) / recent.length;
    const avgTime = recent.reduce((sum, p) => sum + p.timeSpent, 0) / recent.length;
    const avgAttempts = recent.reduce((sum, p) => sum + p.attempts, 0) / recent.length;
    
    const strengths = [];
    const improvements = [];
    
    if (avgScore >= 85) strengths.push('High accuracy');
    if (avgTime <= 20000) strengths.push('Quick response time');
    if (avgAttempts <= 1.5) strengths.push('Few mistakes');
    
    if (avgScore < 70) improvements.push('Focus on accuracy');
    if (avgTime > 45000) improvements.push('Work on speed');
    if (avgAttempts > 2.5) improvements.push('Think before answering');
    
    return {
      avgScore: Math.round(avgScore),
      avgTime: Math.round(avgTime / 1000),
      avgAttempts: Math.round(avgAttempts * 10) / 10,
      strengths,
      improvements
    };
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="performance-tracker">
      <div className="hidden">
        <button onClick={() => trackAttempt(false)} id="track-incorrect" />
        <button onClick={() => trackAttempt(true)} id="track-correct" />
        <button onClick={trackHint} id="track-hint" />
      </div>
      
      <div className="performance-overlay fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-40">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-blue-600">{formatTime(timeSpent)}</span>
          </div>
          
          {attempts > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Attempts:</span>
              <span className="font-medium text-orange-600">{attempts}</span>
            </div>
          )}
          
          {hints > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Hints:</span>
              <span className="font-medium text-purple-600">{hints}</span>
            </div>
          )}
        </div>
        
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-2 px-2 py-1 rounded text-xs font-medium text-center ${
              isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? ' Correct!' : ' Incorrect'}
          </motion.div>
        )}
      </div>
      
      {isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="confidence-rating fixed bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg z-50"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2">How confident did you feel?</h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => trackConfidence(level)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  confidence === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 1 ? '' : level === 2 ? '' : level === 3 ? '' : level === 4 ? '' : ''}
              </button>
            ))}
          </div>
          
          {confidence && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 text-xs text-gray-600 text-center"
            >
              Thanks for the feedback! This helps improve your learning experience.
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PerformanceTracker;

export const usePerformanceTracking = () => {
  const trackQuestionStart = (questionId, questionType, dotPoint, difficulty) => {
    const startData = {
      questionId,
      questionType,
      dotPoint,
      difficulty,
      startTime: Date.now(),
      sessionId: Date.now().toString()
    };
    
    sessionStorage.setItem('currentQuestion', JSON.stringify(startData));
    return startData;
  };

  const trackQuestionEnd = (correct, attempts = 1, hints = 0, confidence = null) => {
    try {
      const startData = JSON.parse(sessionStorage.getItem('currentQuestion') || '{}');
      if (!startData.questionId) return null;

      const endTime = Date.now();
      const timeSpent = endTime - startData.startTime;
      
      const performanceData = {
        ...startData,
        endTime,
        timeSpent,
        correct,
        attempts,
        hints,
        confidence,
        score: calculateQuestionScore(correct, attempts, hints, timeSpent, startData.difficulty)
      };

      const existing = JSON.parse(localStorage.getItem('detailedPerformance') || '[]');
      existing.push(performanceData);
      
      if (existing.length > 500) {
        existing.splice(0, existing.length - 500);
      }
      
      localStorage.setItem('detailedPerformance', JSON.stringify(existing));
      sessionStorage.removeItem('currentQuestion');
      
      return performanceData;
    } catch (error) {
      console.error('Error tracking question end:', error);
      return null;
    }
  };

  const calculateQuestionScore = (correct, attempts, hints, timeSpent, difficulty) => {
    if (!correct) return 0;
    
    let baseScore = 100;
    const attemptPenalty = Math.max(0, (attempts - 1) * 15);
    const hintPenalty = hints * 10;
    const timePenalty = Math.max(0, (timeSpent - 30000) / 2000);
    
    const finalScore = Math.max(0, baseScore - attemptPenalty - hintPenalty - timePenalty);
    
    const difficultyMultipliers = {
      easy: 1.0,
      medium: 1.3,
      hard: 1.6
    };
    
    return Math.round(finalScore * (difficultyMultipliers[difficulty] || 1.0));
  };

  const getPerformanceAnalytics = () => {
    try {
      const data = JSON.parse(localStorage.getItem('detailedPerformance') || '[]');
      const recent = data.slice(-50);
      
      if (recent.length === 0) {
        return {
          totalQuestions: 0,
          averageScore: 0,
          averageTime: 0,
          accuracy: 0,
          recentTrend: 'stable',
          topicBreakdown: {},
          difficultyBreakdown: {}
        };
      }

      const totalQuestions = recent.length;
      const correctAnswers = recent.filter(q => q.correct).length;
      const averageScore = recent.reduce((sum, q) => sum + q.score, 0) / totalQuestions;
      const averageTime = recent.reduce((sum, q) => sum + q.timeSpent, 0) / totalQuestions;
      const accuracy = (correctAnswers / totalQuestions) * 100;
      
      const recentTrend = calculateTrend(recent);
      const topicBreakdown = calculateTopicBreakdown(recent);
      const difficultyBreakdown = calculateDifficultyBreakdown(recent);
      
      return {
        totalQuestions,
        averageScore: Math.round(averageScore),
        averageTime: Math.round(averageTime / 1000),
        accuracy: Math.round(accuracy),
        recentTrend,
        topicBreakdown,
        difficultyBreakdown
      };
    } catch (error) {
      console.error('Error getting performance analytics:', error);
      return null;
    }
  };

  const calculateTrend = (data) => {
    if (data.length < 10) return 'stable';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, q) => sum + q.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, q) => sum + q.score, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 10) return 'improving';
    if (difference < -10) return 'declining';
    return 'stable';
  };

  const calculateTopicBreakdown = (data) => {
    const breakdown = {};
    
    data.forEach(q => {
      if (!breakdown[q.dotPoint]) {
        breakdown[q.dotPoint] = {
          total: 0,
          correct: 0,
          averageScore: 0,
          totalScore: 0
        };
      }
      
      breakdown[q.dotPoint].total += 1;
      breakdown[q.dotPoint].totalScore += q.score;
      breakdown[q.dotPoint].averageScore = Math.round(
        breakdown[q.dotPoint].totalScore / breakdown[q.dotPoint].total
      );
      
      if (q.correct) {
        breakdown[q.dotPoint].correct += 1;
      }
    });
    
    Object.keys(breakdown).forEach(topic => {
      breakdown[topic].accuracy = Math.round(
        (breakdown[topic].correct / breakdown[topic].total) * 100
      );
    });
    
    return breakdown;
  };

  const calculateDifficultyBreakdown = (data) => {
    const breakdown = { easy: [], medium: [], hard: [] };
    
    data.forEach(q => {
      if (breakdown[q.difficulty]) {
        breakdown[q.difficulty].push(q.score);
      }
    });
    
    Object.keys(breakdown).forEach(difficulty => {
      const scores = breakdown[difficulty];
      breakdown[difficulty] = {
        count: scores.length,
        averageScore: scores.length > 0 
          ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
          : 0
      };
    });
    
    return breakdown;
  };

  return {
    trackQuestionStart,
    trackQuestionEnd,
    getPerformanceAnalytics
  };
};
