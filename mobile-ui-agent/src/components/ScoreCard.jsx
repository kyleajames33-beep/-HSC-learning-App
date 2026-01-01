import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressRing from './ProgressRing';
import Confetti from './Confetti';

const ScoreCard = ({ score, totalQuestions, timeSpent, averageTime, onAnimationComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScore, setShowScore] = useState(false);

  const percentage = Math.round((score / totalQuestions) * 100);
  const letterGrade = getLetterGrade(percentage);
  const performanceLevel = getPerformanceLevel(percentage);

  useEffect(() => {
    // Stagger the animations
    setTimeout(() => setShowScore(true), 500);

    if (percentage >= 80) {
      setTimeout(() => setShowConfetti(true), 1000);
    }
  }, [percentage]);

  function getLetterGrade(percent) {
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
  }

  function getPerformanceLevel(percent) {
    if (percent >= 95) return {
      level: 'Exceptional! ',
      message: 'You absolutely crushed it! Perfect HSC level performance!',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    };
    if (percent >= 85) return {
      level: 'Excellent! ',
      message: 'Outstanding work! You\'re ready for the HSC exam!',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    };
    if (percent >= 75) return {
      level: 'Very Good! ',
      message: 'Great progress! Keep up the excellent work!',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    };
    if (percent >= 65) return {
      level: 'Good! ',
      message: 'You\'re on the right track! Review and keep practicing!',
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'from-yellow-50 to-yellow-50'
    };
    if (percent >= 50) return {
      level: 'Getting There! ',
      message: 'Don\'t give up! Every question is progress!',
      color: 'from-orange-400 to-orange-500',
      bgColor: 'from-orange-50 to-orange-50'
    };
    return {
      level: 'Keep Trying! ',
      message: 'Learning takes time. You\'re building knowledge with every attempt!',
      color: 'from-purple-400 to-purple-500',
      bgColor: 'from-purple-50 to-purple-50'
    };
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <>
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className={`bg-gradient-to-br ${performanceLevel.bgColor} rounded-3xl p-6 border border-white/50 shadow-xl relative overflow-hidden`}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Main Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={showScore ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <ProgressRing
              progress={percentage}
              size={140}
              strokeWidth={12}
              color={percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={showScore ? { scale: 1 } : {}}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {score}/{totalQuestions}
                </motion.div>
                <div className="text-lg font-semibold text-gray-700">{percentage}%</div>
                <div className={`text-sm font-bold px-2 py-1 rounded-full bg-gradient-to-r ${performanceLevel.color} text-white mt-1`}>
                  Grade {letterGrade}
                </div>
              </div>
            </ProgressRing>
          </motion.div>

          {/* Performance Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-4"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {performanceLevel.level}
            </h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              {performanceLevel.message}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-2 gap-4 mt-6"
          >
            {timeSpent && (
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            )}

            {averageTime && (
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(averageTime)}
                </div>
                <div className="text-sm text-gray-600">Avg per Question</div>
              </div>
            )}

            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50">
              <div className="text-lg font-bold text-gray-900">
                {Math.round((score / totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50">
              <div className="text-lg font-bold text-gray-900">
                +{score * 10}
              </div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </div>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/50"
          >
            <div className="text-sm text-gray-700 italic">
              {getMotivationalQuote(percentage)}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

function getMotivationalQuote(percentage) {
  const quotes = {
    90: [
      "\"Excellence is never an accident. It is always the result of high intention.\" ",
      "\"Success is the sum of small efforts repeated day in and day out.\" ",
      "\"Your dedication is paying off brilliantly!\" "
    ],
    80: [
      "\"Progress, not perfection, is the goal.\" ",
      "\"You're building the foundation for HSC success!\" ",
      "\"Consistency beats perfection every time.\" "
    ],
    70: [
      "\"Every expert was once a beginner.\" ",
      "\"Improvement is impossible without change.\" ",
      "\"You're getting stronger with each question!\" "
    ],
    60: [
      "\"Learning is a journey, not a destination.\" ",
      "\"Every mistake is a step toward mastery.\" ",
      "\"Growth happens outside your comfort zone.\" "
    ],
    0: [
      "\"It always seems impossible until it's done.\" ",
      "\"The only way to learn is to practice.\" ",
      "\"Believe in yourself and keep going!\" "
    ]
  };

  const level = percentage >= 90 ? 90 : percentage >= 80 ? 80 : percentage >= 70 ? 70 : percentage >= 60 ? 60 : 0;
  const levelQuotes = quotes[level];
  return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
}

export default ScoreCard;
