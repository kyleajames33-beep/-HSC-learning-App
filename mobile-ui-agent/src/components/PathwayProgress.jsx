import React from 'react';
import { motion } from 'framer-motion';
import { getUnlockedTopics, calculateSubjectProgress } from '../data/learningPathways';

const PathwayProgress = ({ subject, userProgress, className = '' }) => {
  const subjectProgress = userProgress?.[subject.id] || {};
  const unlockedTopics = getUnlockedTopics(subject.id, subjectProgress.completedTopics || []);
  const progressData = calculateSubjectProgress(subject.id, subjectProgress.completedTopics || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 ${className}`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${subject.color} rounded-xl flex items-center justify-center text-white text-xl`}>
          {subject.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{subject.name}</h3>
          <p className="text-sm text-gray-600">Learning Pathway</p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{progressData.completedCount}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{unlockedTopics.length}</div>
          <div className="text-xs text-gray-600">Unlocked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{progressData.totalTopics}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Overall Progress</span>
          <span className="text-gray-500">{Math.round(progressData.progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`bg-gradient-to-r ${subject.color} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressData.progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Level & XP */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-700">Level {subjectProgress.level || 1}</div>
            <div className="text-xs text-gray-500">{subjectProgress.totalXP || 0} XP</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Next Level</div>
            <div className="text-sm font-medium text-gray-700">
              {((subjectProgress.level || 1) * 500) - (subjectProgress.totalXP || 0)} XP
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PathwayProgress;