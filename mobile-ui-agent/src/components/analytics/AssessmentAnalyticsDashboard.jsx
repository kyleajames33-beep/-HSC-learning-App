import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AssessmentAnalyticsDashboard = ({ userId, subject = 'biology', className = '' }) => {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [userId, subject, timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch adaptive learning analytics
      const response = await fetch(`/api/adaptive-learning/analytics/${userId}?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => ({
    timeframe: timeframe,
    overview: {
      totalQuestions: 147,
      accuracy: 0.78,
      averageMastery: 0.65,
      averageCognitiveLoad: 0.62,
      adaptationsMade: 23,
      studyTime: 18.5, // hours
      sessionsCompleted: 12
    },
    performanceByModule: {
      'module5': { name: 'Heredity', mastery: 0.82, questions: 45, accuracy: 0.84 },
      'module6': { name: 'Genetic Change', mastery: 0.71, questions: 38, accuracy: 0.79 },
      'module7': { name: 'Infectious Disease', mastery: 0.45, questions: 41, accuracy: 0.71 },
      'module8': { name: 'Non-infectious Disease', mastery: 0.62, questions: 23, accuracy: 0.76 }
    },
    performanceByDifficulty: {
      easy: { attempted: 52, correct: 47, accuracy: 0.90, avgTime: 15.3 },
      medium: { attempted: 68, correct: 51, accuracy: 0.75, avgTime: 22.7 },
      hard: { attempted: 27, correct: 16, accuracy: 0.59, avgTime: 35.2 }
    },
    learningTrends: {
      dailyAccuracy: [0.65, 0.72, 0.69, 0.78, 0.81, 0.79, 0.84],
      dailySessions: [2, 3, 1, 2, 3, 2, 3],
      weeklyMastery: [0.45, 0.52, 0.58, 0.65]
    },
    strongestAreas: [
      { dotPoint: 'BIO11-5.1', name: 'Meiosis Process', mastery: 0.92 },
      { dotPoint: 'BIO11-5.2', name: 'Inheritance Patterns', mastery: 0.88 },
      { dotPoint: 'BIO11-6.1', name: 'Genetic Mutations', mastery: 0.85 }
    ],
    weakestAreas: [
      { dotPoint: 'BIO11-7.2', name: 'Adaptive Immunity', mastery: 0.34 },
      { dotPoint: 'BIO11-7.1', name: 'Pathogen Structure', mastery: 0.41 },
      { dotPoint: 'BIO11-8.1', name: 'Disease Classification', mastery: 0.47 }
    ],
    studyRecommendations: [
      {
        type: 'focus_area',
        priority: 'high',
        message: 'Spend more time on Module 7 (Infectious Disease) - current mastery only 45%'
      },
      {
        type: 'difficulty_adjustment',
        priority: 'medium',
        message: 'Consider more medium-difficulty questions to bridge the gap between easy and hard'
      },
      {
        type: 'spaced_repetition',
        priority: 'medium',
        message: '5 concepts due for review to maintain long-term retention'
      }
    ],
    cognitiveLoadAnalysis: {
      current: 0.62,
      optimal: 0.70,
      trend: 'increasing',
      factors: [
        'Response times have increased by 15% this week',
        'Accuracy on hard questions suggests cognitive overload',
        'Best performance occurs during morning study sessions'
      ]
    }
  });

  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Questions', value: analytics.overview.totalQuestions, icon: '❓', color: 'blue' },
        { label: 'Accuracy', value: `${Math.round(analytics.overview.accuracy * 100)}%`, icon: '🎯', color: 'green' },
        { label: 'Average Mastery', value: `${Math.round(analytics.overview.averageMastery * 100)}%`, icon: '📊', color: 'purple' },
        { label: 'Study Hours', value: `${analytics.overview.studyTime}h`, icon: '⏰', color: 'orange' }
      ].map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 p-4 rounded-lg border border-${metric.color}-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPerformanceByModule = () => (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">📚 Performance by Module</h4>
      <div className="space-y-3">
        {Object.entries(analytics.performanceByModule).map(([moduleId, module]) => (
          <div key={moduleId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">{module.name}</span>
                <span className="text-sm text-gray-600">{module.questions} questions</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      module.mastery > 0.8 ? 'bg-green-500' :
                      module.mastery > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${module.mastery * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {Math.round(module.mastery * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDifficultyAnalysis = () => (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">📈 Performance by Difficulty</h4>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(analytics.performanceByDifficulty).map(([difficulty, data]) => (
          <div key={difficulty} className="text-center">
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              difficulty === 'easy' ? 'bg-green-500' :
              difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {Math.round(data.accuracy * 100)}%
            </div>
            <p className="font-medium text-gray-800 capitalize">{difficulty}</p>
            <p className="text-sm text-gray-600">{data.attempted} attempted</p>
            <p className="text-xs text-gray-500">Avg: {data.avgTime}s</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLearningTrends = () => (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Learning Trends</h4>
      
      {/* Daily Accuracy Chart */}
      <div className="mb-6">
        <h5 className="font-medium text-gray-700 mb-3">Daily Accuracy (Last 7 Days)</h5>
        <div className="flex items-end space-x-2 h-32">
          {analytics.learningTrends.dailyAccuracy.map((accuracy, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <motion.div
                className="bg-blue-500 rounded-t w-full"
                initial={{ height: 0 }}
                animate={{ height: `${accuracy * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Mastery Progress */}
      <div>
        <h5 className="font-medium text-gray-700 mb-3">Weekly Mastery Progress</h5>
        <div className="flex items-end space-x-3 h-20">
          {analytics.learningTrends.weeklyMastery.map((mastery, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <motion.div
                className="bg-purple-500 rounded-t w-full"
                initial={{ height: 0 }}
                animate={{ height: `${mastery * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              />
              <span className="text-xs text-gray-500 mt-1">Week {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStrengthsAndWeaknesses = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Strongest Areas */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="text-lg font-semibold text-green-800 mb-3">💪 Strongest Areas</h4>
        <div className="space-y-2">
          {analytics.strongestAreas.map((area, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
              <div>
                <p className="font-medium text-gray-800">{area.name}</p>
                <p className="text-xs text-gray-600">{area.dotPoint}</p>
              </div>
              <span className="font-bold text-green-600">{Math.round(area.mastery * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weakest Areas */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="text-lg font-semibold text-red-800 mb-3">🎯 Areas for Improvement</h4>
        <div className="space-y-2">
          {analytics.weakestAreas.map((area, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
              <div>
                <p className="font-medium text-gray-800">{area.name}</p>
                <p className="text-xs text-gray-600">{area.dotPoint}</p>
              </div>
              <span className="font-bold text-red-600">{Math.round(area.mastery * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="text-lg font-semibold text-blue-800 mb-3">💡 AI Recommendations</h4>
      <div className="space-y-3">
        {analytics.studyRecommendations.map((rec, index) => (
          <div key={index} className={`p-3 rounded-lg border-l-4 ${
            rec.priority === 'high' ? 'border-red-500 bg-red-50' :
            rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
              }`}>
                {rec.priority} priority
              </span>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {rec.type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-700">{rec.message}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Assessment Analytics</h2>
            <p className="text-gray-600">Detailed insights into your learning progress</p>
          </div>
          
          {/* Timeframe selector */}
          <div className="flex space-x-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setTimeframe(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      {renderOverviewMetrics()}

      {/* Main Analytics Content */}
      <div className="space-y-6">
        {renderPerformanceByModule()}
        {renderDifficultyAnalysis()}
        {renderLearningTrends()}
        {renderStrengthsAndWeaknesses()}
        {renderRecommendations()}
      </div>
    </div>
  );
};

export default AssessmentAnalyticsDashboard;