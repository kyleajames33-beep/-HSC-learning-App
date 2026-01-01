import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { getTopicById, getNextTopic } from '../data/learningPathways';
import ScoreCard from '../components/ScoreCard';
import XPDisplay from '../components/XPDisplay';
import AchievementBadge from '../components/AchievementBadge';
import StreakDisplay from '../components/StreakDisplay';
import EmptyState from '../components/feedback/EmptyState';

const QuizResults = ({ quizData, onRetakeQuiz, onBackToDashboard, onReviewAnswers }) => {
  const safeQuizData = quizData ?? {};
  const {
    answers = {},
    totalQuestions = 0,
    correctAnswers,
    score,
    timeSpent,
    config = {},
  } = safeQuizData;
  const subjectId = config.subjectId || config.subject?.id || safeQuizData.subjectId || null;
  const safeAnswers = typeof answers === 'object' && answers !== null ? answers : {};
  const questionTotal = totalQuestions || Object.keys(safeAnswers).length;
  const { userProgress: progressData, getSubjectData } = useProgressTracking();
  const [newAchievements, setNewAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nextTopic, setNextTopic] = useState(null);

  // Use passed values or calculate from answers if not provided
  const calculatedCorrectAnswers = typeof correctAnswers === 'number'
    ? correctAnswers
    : Object.values(safeAnswers).filter((answer) => answer?.correct).length;
  const scorePercentage = typeof score === 'number' && Number.isFinite(score)
    ? score
    : (questionTotal > 0 ? Math.round((calculatedCorrectAnswers / questionTotal) * 100) : 0);
  
  // Calculate XP based on topic reward and performance
  let xpEarned = 0;
  if (config.topic?.id && subjectId) {
    const topic = getTopicById(subjectId, config.topic.id);
    if (topic) {
      const xpMultiplier = scorePercentage / 100;
      xpEarned = Math.round(topic.xpReward * xpMultiplier);
    }
  } else if (typeof calculatedCorrectAnswers === 'number') {
    xpEarned = calculatedCorrectAnswers * 10;
  }
  const totalTimeSpent = typeof timeSpent === 'number'
    ? timeSpent
    : (config.timer ? Object.values(safeAnswers).reduce((sum, answer) => sum + (answer?.timeSpent || 0), 0) : null);
  const averageTime = typeof totalTimeSpent === 'number' && questionTotal > 0
    ? Math.round(totalTimeSpent / questionTotal)
    : null;

  // Get real user progress data
  const subjectData = subjectId ? getSubjectData(subjectId) : null;
  const userProgressData = {
    currentXP: subjectData?.totalXP || 0,
    previousXP: (subjectData?.totalXP || 0) - xpEarned,
    currentLevel: subjectData?.level || 1,
    xpToNextLevel: (subjectData?.level || 1) * 500,
    currentStreak: subjectData?.streak || 0,
    longestStreak: subjectData?.longestStreak || 0,
    lastStudyDate: new Date().toISOString(),
    streakFreeze: 0
  };

  useEffect(() => {
    if (!progressData || !subjectId) {
      setNextTopic(null);
      return;
    }

    const achievements = checkNewAchievements(scorePercentage, calculatedCorrectAnswers, averageTime, questionTotal);
    setNewAchievements(achievements);

    if (config.topic?.id) {
      const completedTopics = progressData[subjectId]?.completedTopics || [];
      const next = getNextTopic(subjectId, config.topic.id, completedTopics);
      setNextTopic(next);
    } else {
      setNextTopic(null);
    }
  }, [progressData, subjectId, scorePercentage, calculatedCorrectAnswers, averageTime, questionTotal, config]);

  // Performance categories
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'from-green-500 to-emerald-600', emoji: '', message: 'Outstanding! You\'ve mastered this topic!' };
    if (percentage >= 80) return { level: 'Very Good', color: 'from-blue-500 to-cyan-600', emoji: '', message: 'Great work! You\'re well-prepared for the HSC.' };
    if (percentage >= 70) return { level: 'Good', color: 'from-yellow-500 to-orange-600', emoji: '', message: 'Good progress! Review the topics you missed.' };
    if (percentage >= 60) return { level: 'Fair', color: 'from-orange-500 to-red-500', emoji: '', message: 'Keep studying! Focus on understanding concepts.' };
    return { level: 'Needs Work', color: 'from-red-500 to-red-600', emoji: '', message: 'Don\'t give up! Practice makes perfect.' };
  };

  const performance = getPerformanceLevel(scorePercentage);

  const checkNewAchievements = (percentage, correct, avgTime, total) => {
    const achievements = [];

    if (percentage === 100) {
      achievements.push({
        id: 'perfect_score',
        name: 'Perfect Score',
        icon: '',
        description: 'Answered every question correctly!',
        color: 'from-yellow-400 to-orange-500',
        rarity: 'epic',
        earned: true,
        earnedDate: new Date().toISOString()
      });
    }

    if (correct >= 5) {
      achievements.push({
        id: 'quiz_master',
        name: 'Quiz Master',
        icon: '',
        description: 'Scored 5+ correct answers in a quiz',
        color: 'from-blue-400 to-purple-500',
        rarity: 'rare',
        earned: true,
        earnedDate: new Date().toISOString()
      });
    }

    if (avgTime && avgTime <= 60) {
      achievements.push({
        id: 'speed_demon',
        name: 'Speed Demon',
        icon: '',
        description: 'Average under 60 seconds per question',
        color: 'from-green-400 to-emerald-500',
        rarity: 'rare',
        earned: true,
        earnedDate: new Date().toISOString()
      });
    }

    if (percentage >= 90) {
      achievements.push({
        id: 'excellence',
        name: 'Excellence',
        icon: '',
        description: 'Scored 90% or higher on a quiz',
        color: 'from-purple-400 to-pink-500',
        rarity: 'common',
        earned: true,
        earnedDate: new Date().toISOString()
      });
    }

    return achievements;
  };

  const handleLevelUp = () => {
    setShowLevelUp(true);
  };

  const handleStreakFreeze = () => {
    // Handle streak freeze logic
    console.log('Streak freeze used!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="px-4 py-8 max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">
            {config.topic ? (
              `${config.subject.name}  ${config.topic.name}  Level ${config.topic.level}`
            ) : (
              `${config.subject.name}  Module ${config.module?.id}  ${config.difficulty?.name}`
            )}
          </p>
        </motion.div>

        {/* Enhanced Score Display */}
        <ScoreCard
          score={calculatedCorrectAnswers}
          totalQuestions={totalQuestions}
          timeSpent={totalTimeSpent}
          averageTime={averageTime}
        />

        {/* XP and Level Progress */}
        <XPDisplay
          currentXP={userProgressData.currentXP}
          xpGained={xpEarned}
          currentLevel={userProgressData.currentLevel}
          xpToNextLevel={userProgressData.xpToNextLevel}
          onLevelUp={handleLevelUp}
          animated={true}
        />

        {/* Streak Display */}
        <StreakDisplay
          currentStreak={userProgressData.currentStreak}
          longestStreak={userProgressData.longestStreak}
          lastStudyDate={userProgressData.lastStudyDate}
          streakFreeze={userProgressData.streakFreeze}
          onStreakFreeze={handleStreakFreeze}
          animated={true}
        />

        {/* Newly Unlocked Content */}
        {nextTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 border border-white/50 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-center"
            >
              <div className="text-4xl mb-2"></div>
              <h3 className="text-white font-bold text-lg mb-2">New Topic Unlocked!</h3>
              <p className="text-white/90 text-sm mb-3">{nextTopic.name}</p>
              <div className="text-white/80 text-xs">
                Level {nextTopic.level}  {nextTopic.xpReward} XP  {nextTopic.difficulty}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* New Achievements */}
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 border border-white/50 shadow-xl"
          >
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-white font-bold text-center text-xl mb-4"
            >
               New Achievements Unlocked!
            </motion.h3>
            <div className="flex justify-center space-x-4 flex-wrap gap-2">
              {newAchievements.map((achievement, index) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  size="large"
                  showAnimation={true}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 mb-3">Question Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(answers).map(([questionId, answer], index) => (
              <div key={questionId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50">
                <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                <div className="flex items-center space-x-2">
                  {config.timer && (
                    <span className="text-xs text-gray-500">{answer.timeSpent || 0}s</span>
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    answer.correct ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {answer.correct ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-3"
        >
          <button
            onClick={onReviewAnswers}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all"
          >
            Review Answers
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRetakeQuiz}
              className="bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-white/90 transition-all"
            >
              Retake Quiz
            </button>
            <button
              onClick={onBackToDashboard}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all"
            >
              Dashboard
            </button>
          </div>
        </motion.div>

        {/* Study Recommendations */}
        {scorePercentage < 80 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Study Recommendations</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li> Review {config.module.name} concepts</li>
                  <li> Practice more {config.difficulty.name.toLowerCase()} level questions</li>
                  <li> Focus on understanding rather than memorizing</li>
                  <li> Try the AI tutor for personalized help</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default QuizResults;








