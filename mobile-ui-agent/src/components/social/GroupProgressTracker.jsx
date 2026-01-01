import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GroupProgressTracker = ({ groupId, userId, className = '' }) => {
  const [groupProgress, setGroupProgress] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [memberProgress, setMemberProgress] = useState([]);
  const [studyGoals, setStudyGoals] = useState([]);

  useEffect(() => {
    fetchGroupProgress();
  }, [groupId, selectedTimeframe]);

  const fetchGroupProgress = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the API
      // const response = await fetch(`/api/study-groups/${groupId}/progress?timeframe=${selectedTimeframe}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = generateMockProgressData();
      setGroupProgress(mockData.groupProgress);
      setMemberProgress(mockData.memberProgress);
      setStudyGoals(mockData.studyGoals);
      
    } catch (error) {
      console.error('Error fetching group progress:', error);
      const mockData = generateMockProgressData();
      setGroupProgress(mockData.groupProgress);
      setMemberProgress(mockData.memberProgress);
      setStudyGoals(mockData.studyGoals);
    } finally {
      setLoading(false);
    }
  };

  const generateMockProgressData = () => ({
    groupProgress: {
      totalStudyHours: 127.5,
      questionsCompleted: 1847,
      averageAccuracy: 0.78,
      conceptsMastered: [
        'BIO11-5.1', 'BIO11-5.2', 'BIO11-6.1'
      ],
      weakAreas: [
        'BIO11-7.2', 'BIO11-8.1'
      ],
      currentFocus: [
        'BIO11-7.1', 'BIO11-7.2'
      ],
      weeklyProgress: {
        studyHours: [8.5, 12.3, 15.2, 18.7, 21.4, 19.8, 22.1],
        accuracy: [0.72, 0.75, 0.78, 0.76, 0.81, 0.79, 0.83],
        questionsCompleted: [87, 134, 178, 203, 245, 267, 289]
      },
      subjectBreakdown: {
        'Module 5': { mastery: 0.85, hours: 32.5, questions: 456 },
        'Module 6': { mastery: 0.72, hours: 28.3, questions: 398 },
        'Module 7': { mastery: 0.61, hours: 35.7, questions: 521 },
        'Module 8': { mastery: 0.68, hours: 31.0, questions: 472 }
      },
      achievements: [
        { type: 'study_streak', milestone: '7_days', achievedBy: ['user_1', 'user_2'] },
        { type: 'collaboration', milestone: 'team_spirit', achievedBy: ['user_1', 'user_2', 'user_3'] },
        { type: 'mastery', milestone: 'module_expert', achievedBy: ['user_1'] }
      ]
    },
    memberProgress: [
      {
        userId: 'user_1',
        displayName: 'Sarah Chen',
        role: 'moderator',
        stats: {
          studyHours: 45.2,
          questionsCompleted: 623,
          accuracy: 0.87,
          helpProvided: 23,
          sessionsAttended: 12
        },
        strengths: ['BIO11-5.1', 'BIO11-5.2'],
        weaknesses: ['BIO11-7.2'],
        trend: 'improving',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        userId: 'user_2',
        displayName: 'Alex Kumar',
        role: 'member',
        stats: {
          studyHours: 38.7,
          questionsCompleted: 534,
          accuracy: 0.74,
          helpProvided: 15,
          sessionsAttended: 10
        },
        strengths: ['BIO11-6.1'],
        weaknesses: ['BIO11-8.1', 'BIO11-7.2'],
        trend: 'stable',
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        userId: 'user_3',
        displayName: 'Emma Watson',
        role: 'member',
        stats: {
          studyHours: 43.6,
          questionsCompleted: 690,
          accuracy: 0.81,
          helpProvided: 31,
          sessionsAttended: 14
        },
        strengths: ['BIO11-6.1', 'BIO11-7.1'],
        weaknesses: ['BIO11-8.2'],
        trend: 'improving',
        lastActive: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ],
    studyGoals: [
      {
        id: 'goal_1',
        title: 'Master Module 7 Concepts',
        description: 'Achieve 80% mastery in all Module 7 dot points',
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        progress: 67,
        type: 'mastery',
        assignedTo: 'all',
        milestones: [
          { name: 'Complete pathogen structure questions', completed: true },
          { name: 'Understand adaptive immunity', completed: false },
          { name: 'Practice disease mechanisms', completed: false }
        ]
      },
      {
        id: 'goal_2',
        title: 'Group Study Marathon',
        description: 'Complete 100 hours of collective study time',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 85,
        type: 'collaboration',
        assignedTo: 'all',
        milestones: [
          { name: 'Reach 50 hours', completed: true },
          { name: 'Reach 75 hours', completed: true },
          { name: 'Reach 100 hours', completed: false }
        ]
      },
      {
        id: 'goal_3',
        title: 'Weekly Quiz Challenge',
        description: 'Each member completes 50 questions this week',
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        progress: 78,
        type: 'practice',
        assignedTo: 'individual',
        milestones: [
          { name: 'Everyone at 25 questions', completed: true },
          { name: 'Everyone at 40 questions', completed: false },
          { name: 'Everyone at 50 questions', completed: false }
        ]
      }
    ]
  });

  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { 
          label: 'Total Study Hours', 
          value: `${groupProgress.totalStudyHours}h`, 
          icon: '⏰', 
          color: 'blue',
          change: '+12.5%'
        },
        { 
          label: 'Questions Completed', 
          value: groupProgress.questionsCompleted.toLocaleString(), 
          icon: '❓', 
          color: 'green',
          change: '+8.3%'
        },
        { 
          label: 'Average Accuracy', 
          value: `${Math.round(groupProgress.averageAccuracy * 100)}%`, 
          icon: '🎯', 
          color: 'purple',
          change: '+2.1%'
        },
        { 
          label: 'Concepts Mastered', 
          value: groupProgress.conceptsMastered.length, 
          icon: '📚', 
          color: 'orange',
          change: '+3 new'
        }
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
              <p className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} this week
              </p>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderWeeklyProgressChart = () => (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">📈 Weekly Progress</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Hours Chart */}
        <div>
          <h5 className="font-medium text-gray-700 mb-3">Study Hours</h5>
          <div className="flex items-end space-x-1 h-32">
            {groupProgress.weeklyProgress.studyHours.map((hours, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="bg-blue-500 rounded-t w-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${(hours / Math.max(...groupProgress.weeklyProgress.studyHours)) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Chart */}
        <div>
          <h5 className="font-medium text-gray-700 mb-3">Accuracy</h5>
          <div className="flex items-end space-x-1 h-32">
            {groupProgress.weeklyProgress.accuracy.map((accuracy, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="bg-green-500 rounded-t w-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${accuracy * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Questions Chart */}
        <div>
          <h5 className="font-medium text-gray-700 mb-3">Questions</h5>
          <div className="flex items-end space-x-1 h-32">
            {groupProgress.weeklyProgress.questionsCompleted.map((questions, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="bg-purple-500 rounded-t w-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${(questions / Math.max(...groupProgress.weeklyProgress.questionsCompleted)) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMemberProgress = () => (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">👥 Member Progress</h4>
      
      <div className="space-y-4">
        {memberProgress.map((member, index) => (
          <motion.div
            key={member.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {member.displayName.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  new Date() - member.lastActive < 60 * 60 * 1000 ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h5 className="font-semibold text-gray-800">{member.displayName}</h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.role === 'moderator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {member.role}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.trend === 'improving' ? 'bg-green-100 text-green-800' :
                    member.trend === 'stable' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {member.trend === 'improving' ? '📈' : member.trend === 'stable' ? '➡️' : '📉'} {member.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Last active: {getRelativeTime(member.lastActive)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">{member.stats.studyHours}h</p>
                <p className="text-xs text-gray-600">Study Time</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{Math.round(member.stats.accuracy * 100)}%</p>
                <p className="text-xs text-gray-600">Accuracy</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{member.stats.helpProvided}</p>
                <p className="text-xs text-gray-600">Help Given</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSubjectBreakdown = () => (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Subject Mastery</h4>
      
      <div className="space-y-4">
        {Object.entries(groupProgress.subjectBreakdown).map(([subject, data], index) => (
          <div key={subject} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{subject}</span>
              <div className="text-sm text-gray-600">
                {Math.round(data.mastery * 100)}% • {data.hours}h • {data.questions} questions
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full ${
                  data.mastery > 0.8 ? 'bg-green-500' :
                  data.mastery > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${data.mastery * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudyGoals = () => (
    <div className="bg-white p-6 rounded-lg border mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Study Goals</h4>
      
      <div className="space-y-4">
        {studyGoals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800">{goal.title}</h5>
                <p className="text-sm text-gray-600">{goal.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Due: {goal.targetDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  goal.type === 'mastery' ? 'bg-purple-100 text-purple-800' :
                  goal.type === 'collaboration' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {goal.type}
                </span>
                <p className="text-sm font-semibold text-gray-800 mt-1">{goal.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <motion.div
                className={`h-2 rounded-full ${
                  goal.progress > 80 ? 'bg-green-500' :
                  goal.progress > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>

            {/* Milestones */}
            <div className="space-y-1">
              {goal.milestones.map((milestone, mIndex) => (
                <div key={mIndex} className="flex items-center space-x-2 text-sm">
                  <span className={`${milestone.completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {milestone.completed ? '✅' : '⭕'}
                  </span>
                  <span className={`${milestone.completed ? 'text-gray-800' : 'text-gray-600'}`}>
                    {milestone.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const getRelativeTime = (date) => {
    const diff = new Date() - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

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
            <h2 className="text-2xl font-bold text-gray-800">Group Progress Tracker</h2>
            <p className="text-gray-600">Monitor your study group&apos;s collective learning journey</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'all', label: 'All Time' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedTimeframe(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === option.value
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

      {/* Weekly Progress Charts */}
      {renderWeeklyProgressChart()}

      {/* Member Progress */}
      {renderMemberProgress()}

      {/* Subject Breakdown */}
      {renderSubjectBreakdown()}

      {/* Study Goals */}
      {renderStudyGoals()}

      {/* Group Achievements */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🏆 Recent Achievements</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupProgress.achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-lg border-l-4 ${
                achievement.type === 'study_streak' ? 'border-orange-500 bg-orange-50' :
                achievement.type === 'collaboration' ? 'border-blue-500 bg-blue-50' :
                'border-purple-500 bg-purple-50'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">
                  {achievement.type === 'study_streak' ? '🔥' :
                   achievement.type === 'collaboration' ? '🤝' : '🧠'}
                </span>
                <h5 className="font-semibold text-gray-800">
                  {achievement.type === 'study_streak' ? 'Study Streak' :
                   achievement.type === 'collaboration' ? 'Team Spirit' : 'Module Expert'}
                </h5>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {achievement.milestone.replace('_', ' ').toUpperCase()}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Achieved by:</span>
                <div className="flex space-x-1">
                  {achievement.achievedBy.slice(0, 3).map((userId, i) => (
                    <div key={i} className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  ))}
                  {achievement.achievedBy.length > 3 && (
                    <span className="text-xs text-gray-500">+{achievement.achievedBy.length - 3}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupProgressTracker;
