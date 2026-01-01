import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModule5Progress } from '../hooks/useModule5Progress';

const Module5Analytics = ({ onBack }) => {
  const { pathwayProgress, getPathwayStats } = useModule5Progress();
  const [analytics, setAnalytics] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all'); // all, week, month

  useEffect(() => {
    if (pathwayProgress) {
      const stats = getPathwayStats();
      setAnalytics(generateAnalytics(stats, pathwayProgress));
    }
  }, [pathwayProgress, getPathwayStats]);

  const generateAnalytics = (stats, progress) => {
    const contentAccessLog = progress.analytics?.contentAccessLog || [];
    const quizAttemptLog = progress.analytics?.quizAttemptLog || [];
    
    // Filter by timeframe
    const now = new Date();
    const filterDate = selectedTimeframe === 'week' 
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : selectedTimeframe === 'month'
      ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      : new Date(0);

    const filteredContentAccess = contentAccessLog.filter(log => 
      new Date(log.timestamp) > filterDate
    );
    const filteredQuizAttempts = quizAttemptLog.filter(log => 
      new Date(log.timestamp) > filterDate
    );

    // Content access patterns
    const contentAccessByType = {
      podcast: filteredContentAccess.filter(log => log.contentType === 'podcast').length,
      video: filteredContentAccess.filter(log => log.contentType === 'video').length,
      slides: filteredContentAccess.filter(log => log.contentType === 'slides').length
    };

    // Quiz performance analysis
    const quizPerformance = {
      quickQuizAttempts: filteredQuizAttempts.filter(log => log.quizType === 'quickQuiz').length,
      longResponseAttempts: filteredQuizAttempts.filter(log => log.quizType === 'longResponse').length,
      averageQuickQuizScore: 0,
      averageLongResponseScore: 0,
      totalTimeSpent: 0
    };

    const quickQuizAttempts = filteredQuizAttempts.filter(log => log.quizType === 'quickQuiz');
    const longResponseAttempts = filteredQuizAttempts.filter(log => log.quizType === 'longResponse');

    if (quickQuizAttempts.length > 0) {
      quizPerformance.averageQuickQuizScore = Math.round(
        quickQuizAttempts.reduce((sum, log) => sum + log.score, 0) / quickQuizAttempts.length
      );
    }

    if (longResponseAttempts.length > 0) {
      quizPerformance.averageLongResponseScore = Math.round(
        longResponseAttempts.reduce((sum, log) => sum + log.score, 0) / longResponseAttempts.length
      );
    }

    quizPerformance.totalTimeSpent = filteredQuizAttempts.reduce((sum, log) => sum + (log.timeSpent || 0), 0);

    // Learning patterns
    const accessTimes = contentAccessLog.map(log => new Date(log.timestamp).getHours());
    const preferredStudyTimes = {
      morning: accessTimes.filter(hour => hour >= 6 && hour < 12).length,
      afternoon: accessTimes.filter(hour => hour >= 12 && hour < 18).length,
      evening: accessTimes.filter(hour => hour >= 18 && hour < 24).length,
      night: accessTimes.filter(hour => hour >= 0 && hour < 6).length
    };

    // Progress milestones
    const milestones = [];
    if (stats.completedDotPoints >= 3) {
      milestones.push({ icon: '', text: 'IQ1 Complete', achieved: true });
    }
    if (stats.completedDotPoints >= 5) {
      milestones.push({ icon: '', text: 'IQ2 Complete', achieved: true });
    }
    if (stats.completedDotPoints >= 8) {
      milestones.push({ icon: '', text: 'IQ3 Complete', achieved: true });
    }
    if (stats.completedDotPoints >= 11) {
      milestones.push({ icon: '', text: 'IQ4 Complete', achieved: true });
    }
    if (stats.completedDotPoints === 13) {
      milestones.push({ icon: '', text: 'Module 5 Master', achieved: true });
    }

    // Add upcoming milestones
    if (stats.completedDotPoints < 3) {
      milestones.push({ icon: '', text: 'IQ1 Complete', achieved: false, needed: 3 - stats.completedDotPoints });
    }
    if (stats.completedDotPoints >= 3 && stats.completedDotPoints < 5) {
      milestones.push({ icon: '', text: 'IQ2 Complete', achieved: false, needed: 5 - stats.completedDotPoints });
    }
    if (stats.completedDotPoints >= 5 && stats.completedDotPoints < 8) {
      milestones.push({ icon: '', text: 'IQ3 Complete', achieved: false, needed: 8 - stats.completedDotPoints });
    }

    return {
      overview: stats,
      contentAccess: contentAccessByType,
      quizPerformance,
      preferredStudyTimes,
      milestones,
      strugglingAreas: stats.strugglingAreas || [],
      strongAreas: stats.strongAreas || [],
      studyStreak: calculateStudyStreak(contentAccessLog, quizAttemptLog),
      recommendations: generateRecommendations(stats, quizPerformance, contentAccessByType)
    };
  };

  const calculateStudyStreak = (contentAccessLog, quizAttemptLog) => {
    const allActivities = [...contentAccessLog, ...quizAttemptLog]
      .map(log => new Date(log.timestamp).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort()
      .reverse();

    let streak = 0;
    const today = new Date().toDateString();
    let checkDate = new Date();

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = checkDate.toDateString();
      if (allActivities.includes(dateStr)) {
        streak++;
      } else if (dateStr !== today) { // Don't break streak if no activity today yet
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  const generateRecommendations = (stats, quizPerformance, contentAccess) => {
    const recommendations = [];

    // Content access recommendations
    const totalContentAccess = Object.values(contentAccess).reduce((sum, count) => sum + count, 0);
    if (totalContentAccess === 0) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        message: 'Start by accessing the podcast, video, and slides for IQ1.1',
        action: 'Access Content'
      });
    } else if (contentAccess.podcast < contentAccess.video || contentAccess.podcast < contentAccess.slides) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        message: 'Try listening to more podcasts - they\'re great for learning on the go!',
        action: 'Listen to Podcasts'
      });
    }

    // Quiz performance recommendations
    if (quizPerformance.averageQuickQuizScore < 65 && quizPerformance.quickQuizAttempts > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Focus on improving quick quiz scores. Review content before attempting.',
        action: 'Review & Practice'
      });
    }

    if (quizPerformance.averageLongResponseScore < 65 && quizPerformance.longResponseAttempts > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Work on HSC-style responses. Focus on using key scientific terms.',
        action: 'Practice Writing'
      });
    }

    // Progress recommendations
    if (stats.overallProgress < 20) {
      recommendations.push({
        type: 'progress',
        priority: 'medium',
        message: 'You\'re just getting started! Set a goal to complete one dot point this week.',
        action: 'Set Weekly Goal'
      });
    } else if (stats.overallProgress >= 50 && stats.overallProgress < 80) {
      recommendations.push({
        type: 'progress',
        priority: 'low',
        message: 'Great progress! You\'re over halfway through Module 5.',
        action: 'Keep Going'
      });
    }

    // Struggling areas
    if (stats.strugglingAreas.length > 0) {
      recommendations.push({
        type: 'help',
        priority: 'medium',
        message: `Review these challenging topics: ${stats.strugglingAreas.slice(0, 2).join(', ')}`,
        action: 'Review Difficult Topics'
      });
    }

    return recommendations.slice(0, 4); // Limit to top 4 recommendations
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg">
              
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Module 5 Analytics</h1>
              <p className="text-sm text-gray-600">Your learning insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Timeframe Selector */}
        <div className="flex justify-center space-x-2">
          {[
            { key: 'all', label: 'All Time' },
            { key: 'month', label: 'This Month' },
            { key: 'week', label: 'This Week' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedTimeframe(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === key
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/70 text-gray-600 hover:bg-purple-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center"
          >
            <div className="text-2xl font-bold text-green-600">{analytics.overview.overallProgress}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center"
          >
            <div className="text-2xl font-bold text-blue-600">{analytics.studyStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center"
          >
            <div className="text-2xl font-bold text-purple-600">
              {analytics.quizPerformance.quickQuizAttempts + analytics.quizPerformance.longResponseAttempts}
            </div>
            <div className="text-sm text-gray-600">Quiz Attempts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center"
          >
            <div className="text-2xl font-bold text-orange-600">
              {formatTime(analytics.quizPerformance.totalTimeSpent)}
            </div>
            <div className="text-sm text-gray-600">Time Studying</div>
          </motion.div>
        </div>

        {/* Content Access Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 mb-4">Content Access Pattern</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(analytics.contentAccess).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl">
                    {type === 'podcast' ? '' : type === 'video' ? '' : ''}
                  </span>
                </div>
                <div className="font-bold text-lg">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}s</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quiz Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 mb-4">Quiz Performance</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quick Quiz Average</span>
                <span className="text-sm text-gray-600">{analytics.quizPerformance.quickQuizAttempts} attempts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.quizPerformance.averageQuickQuizScore}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {analytics.quizPerformance.averageQuickQuizScore}%
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Long Response Average</span>
                <span className="text-sm text-gray-600">{analytics.quizPerformance.longResponseAttempts} attempts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.quizPerformance.averageLongResponseScore}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {analytics.quizPerformance.averageLongResponseScore}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Time Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 mb-4">Study Time Preferences</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(analytics.preferredStudyTimes).map(([time, count]) => {
              const maxCount = Math.max(...Object.values(analytics.preferredStudyTimes));
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={time} className="text-center">
                  <div className="mb-2">
                    <span className="text-lg">
                      {time === 'morning' ? '' : time === 'afternoon' ? '' : time === 'evening' ? '' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 capitalize">{time}</div>
                  <div className="text-sm font-medium">{count}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 mb-4">Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analytics.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  milestone.achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className={`text-xl ${milestone.achieved ? 'grayscale-0' : 'grayscale'}`}>
                  {milestone.icon}
                </span>
                <div className="flex-1">
                  <div className={`font-medium ${milestone.achieved ? 'text-green-900' : 'text-gray-600'}`}>
                    {milestone.text}
                  </div>
                  {!milestone.achieved && milestone.needed && (
                    <div className="text-xs text-gray-500">
                      {milestone.needed} more dot point{milestone.needed > 1 ? 's' : ''} needed
                    </div>
                  )}
                </div>
                {milestone.achieved && (
                  <div className="text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50"
        >
          <h3 className="font-bold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {analytics.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                  rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-medium ${
                      rec.priority === 'high' ? 'text-red-900' :
                      rec.priority === 'medium' ? 'text-yellow-900' :
                      'text-blue-900'
                    }`}>
                      {rec.message}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 capitalize">
                      {rec.type}  {rec.priority} priority
                    </div>
                  </div>
                  <button className={`text-xs font-medium px-3 py-1 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default Module5Analytics;
