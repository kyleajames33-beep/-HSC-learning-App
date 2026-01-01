import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import ProgressRing from './ProgressRing';
import StatCard from './StatCard';

const StudentAnalytics = ({
  studentData,
  studyPatterns,
  goals,
  insights,
  onGoalCreate,
  onGoalUpdate
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: 'daily', target: '', deadline: '' });

  const periodOptions = [
    { id: 'week', label: 'This Week', icon: '' },
    { id: 'month', label: 'This Month', icon: '' },
    { id: 'term', label: 'This Term', icon: '' }
  ];

  const metricTabs = [
    { id: 'overview', label: 'Overview', icon: '' },
    { id: 'performance', label: 'Performance', icon: '' },
    { id: 'habits', label: 'Study Habits', icon: '' },
    { id: 'goals', label: 'Goals', icon: '' }
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
    if (confidence >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
  };

  const getPerformanceTrend = (data) => {
    if (!data || data.length < 2) return 'stable';
    const recent = data.slice(-5);
    const trend = recent[recent.length - 1] - recent[0];
    if (trend > 5) return 'improving';
    if (trend < -5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '';
    if (trend === 'declining') return '';
    return '';
  };

  const getOptimalStudyTime = () => {
    if (!studyPatterns?.timePreference) return 'Morning (9-11 AM)';
    const times = {
      'morning': 'Morning (9-11 AM)',
      'afternoon': 'Afternoon (2-4 PM)',
      'evening': 'Evening (7-9 PM)'
    };
    return times[studyPatterns.timePreference] || 'Morning (9-11 AM)';
  };

  const getStudyStreak = () => {
    return studyPatterns?.currentStreak || 0;
  };

  const handleCreateGoal = () => {
    if (newGoal.target && newGoal.deadline) {
      onGoalCreate({
        id: Date.now(),
        type: newGoal.type,
        target: newGoal.target,
        deadline: newGoal.deadline,
        progress: 0,
        created: new Date().toISOString()
      });
      setNewGoal({ type: 'daily', target: '', deadline: '' });
      setShowGoalModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="gaming-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900"> Your Learning Analytics</h2>
          <div className="flex space-x-2">
            {periodOptions.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-gaming-gradient text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.icon} {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {metricTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                selectedMetric === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on selected metric */}
      <AnimatePresence mode="wait">
        {selectedMetric === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon=""
                title="Overall Score"
                value={`${studentData?.averageScore || 0}%`}
                subtitle={`${getTrendIcon(getPerformanceTrend(studentData?.scoreHistory))} ${getPerformanceTrend(studentData?.scoreHistory)}`}
                color="primary"
              />
              <StatCard
                icon=""
                title="Study Streak"
                value={`${getStudyStreak()} days`}
                subtitle="Keep it going!"
                color="warning"
              />
            </div>

            {/* Subject Comparison */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Subject Strengths</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium"> Biology</span>
                    <span className="text-green-600">{studentData?.biologyScore || 0}%</span>
                  </div>
                  <ProgressBar
                    progress={studentData?.biologyScore || 0}
                    color="#10b981"
                    height={8}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium"> Chemistry</span>
                    <span className="text-purple-600">{studentData?.chemistryScore || 0}%</span>
                  </div>
                  <ProgressBar
                    progress={studentData?.chemistryScore || 0}
                    color="#8b5cf6"
                    height={8}
                  />
                </div>
              </div>
            </div>

            {/* Learning Velocity */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Learning Velocity</h3>
              <div className="text-center">
                <ProgressRing
                  progress={studentData?.learningVelocity || 0}
                  size={100}
                  color="#3b82f6"
                >
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {studentData?.learningVelocity || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Velocity</div>
                  </div>
                </ProgressRing>
                <p className="text-sm text-gray-600 mt-2">
                  Concepts mastered per week compared to your baseline
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {selectedMetric === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Confidence Tracking */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Academic Confidence</h3>
              <div className="space-y-3">
                {studentData?.confidenceBySubject?.map((subject) => {
                  const colors = getConfidenceColor(subject.confidence);
                  return (
                    <div key={subject.name} className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${colors.text}`}>{subject.name}</span>
                        <span className={`text-sm font-bold ${colors.text}`}>
                          {subject.confidence}% confident
                        </span>
                      </div>
                    </div>
                  );
                }) || []}
              </div>
            </div>

            {/* Weakness Areas */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Focus Areas</h3>
              <div className="space-y-2">
                {insights?.weakAreas?.map((area, index) => (
                  <motion.div
                    key={area.topic}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-red-800">{area.topic}</span>
                      <p className="text-sm text-red-600">{area.score}% accuracy</p>
                    </div>
                    <button className="gaming-button-primary text-xs py-1 px-3">
                      Practice
                    </button>
                  </motion.div>
                )) || []}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Recent Wins</h3>
              <div className="space-y-2">
                {insights?.recentAchievements?.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <span className="font-medium text-green-800">{achievement.name}</span>
                      <p className="text-sm text-green-600">{achievement.description}</p>
                    </div>
                  </motion.div>
                )) || []}
              </div>
            </div>
          </motion.div>
        )}

        {selectedMetric === 'habits' && (
          <motion.div
            key="habits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Optimal Study Time */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Your Optimal Study Time</h3>
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-3xl mb-2"></div>
                <p className="font-semibold text-blue-800">{getOptimalStudyTime()}</p>
                <p className="text-sm text-blue-600 mt-1">
                  You score {studyPatterns?.optimalTimeBoost || 0}% higher during this time
                </p>
              </div>
            </div>

            {/* Session Length Analysis */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Session Effectiveness</h3>
              <div className="space-y-3">
                <div className="analytics-metric">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Optimal Session Length</span>
                    <span className="text-blue-600 font-bold">
                      {studyPatterns?.optimalSessionLength || 25} minutes
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your focus peaks at this duration
                  </p>
                </div>
                <div className="analytics-metric">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Average Break Time</span>
                    <span className="text-green-600 font-bold">
                      {studyPatterns?.averageBreak || 5} minutes
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Recommended: 5-10 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Study Consistency */}
            <div className="gaming-card p-4">
              <h3 className="font-bold text-gray-900 mb-4"> Study Consistency</h3>
              <div className="grid grid-cols-7 gap-2">
                {(studyPatterns?.weeklyPattern || []).map((day, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-8 h-8 rounded-lg mb-1 ${
                      day.studied
                        ? 'bg-green-400'
                        : 'bg-gray-200'
                    }`} />
                    <span className="text-xs text-gray-600">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedMetric === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Add Goal Button */}
            <button
              onClick={() => setShowGoalModal(true)}
              className="w-full gaming-button-primary py-3"
            >
              <span className="mr-2"></span>
              Set New Goal
            </button>

            {/* Active Goals */}
            <div className="space-y-3">
              {goals?.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="gaming-card p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.target}</h4>
                      <p className="text-sm text-gray-600">Due: {new Date(goal.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.progress >= 100
                        ? 'bg-green-100 text-green-800'
                        : goal.progress >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={goal.progress}
                    color={goal.progress >= 100 ? '#10b981' : '#3b82f6'}
                    height={8}
                  />
                </motion.div>
              )) || []}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Creation Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4"> Create New Goal</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                    className="w-full input"
                  >
                    <option value="daily">Daily Target</option>
                    <option value="weekly">Weekly Target</option>
                    <option value="atar">ATAR Goal</option>
                    <option value="subject">Subject Mastery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="text"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    placeholder="e.g., Complete 5 Biology questions daily"
                    className="w-full input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full input"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="flex-1 gaming-button-primary py-2"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentAnalytics;
