import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherParentDashboard = ({ 
  userType = 'teacher', // 'teacher' or 'parent'
  userId, 
  className = '' 
}) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [students, setStudents] = useState([]);
  const [classData, setClassData] = useState(null);
  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [userId, timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in production, this would come from API
      const mockData = generateMockData();
      setStudents(mockData.students);
      setClassData(mockData.classData);
      setAlerts(mockData.alerts);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => ({
    students: [
      {
        id: 'student1',
        name: 'Sarah Johnson',
        yearLevel: 'Year 12',
        subjects: ['Biology', 'Chemistry'],
        performance: {
          currentGrade: 85,
          trend: 'improving',
          weeklyHours: 12.5,
          accuracy: 0.78,
          mastery: {
            'BIO11-7.1': 0.92,
            'BIO11-7.2': 0.65,
            'BIO11-8.1': 0.73
          },
          weakAreas: ['Adaptive Immunity', 'Disease Classification'],
          strengths: ['Pathogen Structure', 'Meiosis'],
          streakDays: 8,
          lastActive: '2 hours ago'
        },
        socialLearning: {
          studyGroups: 2,
          peerInteractions: 15,
          helpProvided: 8,
          helpReceived: 3,
          collaborationRating: 4.2
        },
        behavioralMetrics: {
          engagement: 0.85,
          persistence: 0.78,
          curiosity: 0.82,
          selfRegulation: 0.75
        }
      },
      {
        id: 'student2',
        name: 'Michael Chen',
        yearLevel: 'Year 12',
        subjects: ['Biology', 'Physics'],
        performance: {
          currentGrade: 91,
          trend: 'stable',
          weeklyHours: 15.2,
          accuracy: 0.89,
          mastery: {
            'BIO11-7.1': 0.88,
            'BIO11-7.2': 0.94,
            'BIO11-8.1': 0.86
          },
          weakAreas: ['Genetic Mutations'],
          strengths: ['Immune System', 'Cell Biology'],
          streakDays: 15,
          lastActive: '30 minutes ago'
        },
        socialLearning: {
          studyGroups: 3,
          peerInteractions: 22,
          helpProvided: 12,
          helpReceived: 5,
          collaborationRating: 4.8
        },
        behavioralMetrics: {
          engagement: 0.92,
          persistence: 0.89,
          curiosity: 0.91,
          selfRegulation: 0.87
        }
      },
      {
        id: 'student3',
        name: 'Emma Rodriguez',
        yearLevel: 'Year 12',
        subjects: ['Biology', 'Chemistry'],
        performance: {
          currentGrade: 73,
          trend: 'declining',
          weeklyHours: 8.3,
          accuracy: 0.62,
          mastery: {
            'BIO11-7.1': 0.45,
            'BIO11-7.2': 0.38,
            'BIO11-8.1': 0.67
          },
          weakAreas: ['Adaptive Immunity', 'Pathogen Structure', 'Inheritance'],
          strengths: ['Basic Cell Structure'],
          streakDays: 2,
          lastActive: '1 day ago'
        },
        socialLearning: {
          studyGroups: 1,
          peerInteractions: 8,
          helpProvided: 2,
          helpReceived: 7,
          collaborationRating: 3.1
        },
        behavioralMetrics: {
          engagement: 0.58,
          persistence: 0.52,
          curiosity: 0.65,
          selfRegulation: 0.48
        }
      }
    ],
    classData: {
      totalStudents: 25,
      averageGrade: 82.4,
      averageStudyTime: 11.8,
      averageAccuracy: 0.76,
      topicProgress: {
        'Heredity': 0.85,
        'Genetic Change': 0.72,
        'Infectious Disease': 0.68,
        'Non-infectious Disease': 0.59
      },
      weeklyEngagement: [0.78, 0.82, 0.75, 0.79, 0.84, 0.81, 0.86],
      assignmentCompletion: 0.89,
      collaborationMetrics: {
        studyGroupParticipation: 0.72,
        peerTutoringEvents: 156,
        knowledgeSharing: 0.68
      }
    },
    alerts: [
      {
        id: 'alert1',
        type: 'performance_decline',
        severity: 'high',
        student: 'Emma Rodriguez',
        message: 'Emma\'s performance has declined by 15% this week. Consider intervention.',
        timestamp: '2 hours ago',
        suggestions: [
          'Schedule one-on-one session',
          'Assign to peer tutor',
          'Review study methods'
        ]
      },
      {
        id: 'alert2',
        type: 'engagement_low',
        severity: 'medium',
        student: 'James Wilson',
        message: 'James has been inactive for 3 days. Last active: Monday.',
        timestamp: '5 hours ago',
        suggestions: [
          'Send motivation message',
          'Check personal circumstances',
          'Adjust difficulty level'
        ]
      },
      {
        id: 'alert3',
        type: 'milestone_achieved',
        severity: 'positive',
        student: 'Sarah Johnson',
        message: 'Sarah achieved 90% mastery in Module 7. Ready for advancement.',
        timestamp: '1 day ago',
        suggestions: [
          'Provide advanced materials',
          'Assign as peer tutor',
          'Celebrate achievement'
        ]
      }
    ]
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: userType === 'teacher' ? 'Total Students' : 'Children', 
            value: userType === 'teacher' ? classData.totalStudents : 1, 
            icon: '👥', 
            color: 'blue' 
          },
          { 
            label: 'Average Grade', 
            value: `${classData.averageGrade}%`, 
            icon: '📊', 
            color: 'green' 
          },
          { 
            label: 'Study Hours/Week', 
            value: `${classData.averageStudyTime}h`, 
            icon: '⏰', 
            color: 'purple' 
          },
          { 
            label: 'Accuracy Rate', 
            value: `${Math.round(classData.averageAccuracy * 100)}%`, 
            icon: '🎯', 
            color: 'orange' 
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
              </div>
              <div className="text-3xl">{metric.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Engagement Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Engagement Trends</h3>
        <div className="flex items-end space-x-2 h-32">
          {classData.weeklyEngagement.map((engagement, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <motion.div
                className="bg-blue-500 rounded-t w-full"
                initial={{ height: 0 }}
                animate={{ height: `${engagement * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Progress */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">HSC Module Progress</h3>
        <div className="space-y-3">
          {Object.entries(classData.topicProgress).map(([topic, progress]) => (
            <div key={topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{topic}</span>
                <span className="text-gray-600">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    progress > 0.8 ? 'bg-green-500' :
                    progress > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentList = () => (
    <div className="space-y-4">
      {students.map((student, index) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedStudent(student)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.yearLevel} • {student.subjects.join(', ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    student.performance.currentGrade >= 90 ? 'text-green-600' :
                    student.performance.currentGrade >= 75 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {student.performance.currentGrade}%
                  </div>
                  <div className="text-xs text-gray-500">Current Grade</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{student.performance.weeklyHours}h</div>
                  <div className="text-xs text-gray-500">Study Time</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{student.performance.streakDays}</div>
                  <div className="text-xs text-gray-500">Day Streak</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    student.performance.trend === 'improving' ? 'text-green-600' :
                    student.performance.trend === 'stable' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {student.performance.trend === 'improving' ? '📈' :
                     student.performance.trend === 'stable' ? '➡️' : '📉'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{student.performance.trend}</div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2">Last active: {student.performance.lastActive}</div>
              <div className="flex space-x-2">
                {student.performance.weakAreas.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    ⚠️ {student.performance.weakAreas.length} weak areas
                  </span>
                )}
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                  ⭐ {student.performance.strengths.length} strengths
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border-l-4 ${
            alert.severity === 'high' ? 'border-red-500 bg-red-50' :
            alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
            alert.severity === 'positive' ? 'border-green-500 bg-green-50' :
            'border-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{alert.student}</h4>
              <p className="text-sm text-gray-700">{alert.message}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                alert.severity === 'positive' ? 'bg-green-200 text-green-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                {alert.severity}
              </span>
              <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
            </div>
          </div>

          {alert.suggestions && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Suggested Actions:</h5>
              <div className="flex flex-wrap gap-2">
                {alert.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="text-xs bg-white border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderStudentDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {selectedStudent.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h2>
            <p className="text-gray-600">{selectedStudent.yearLevel} • {selectedStudent.subjects.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Grade', value: `${selectedStudent.performance.currentGrade}%`, color: 'blue' },
          { label: 'Accuracy Rate', value: `${Math.round(selectedStudent.performance.accuracy * 100)}%`, color: 'green' },
          { label: 'Study Hours', value: `${selectedStudent.performance.weeklyHours}h/week`, color: 'purple' },
          { label: 'Streak Days', value: selectedStudent.performance.streakDays, color: 'orange' }
        ].map((metric, index) => (
          <div key={index} className={`bg-${metric.color}-50 p-4 rounded-lg border border-${metric.color}-200`}>
            <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Mastery Levels */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Concept Mastery</h3>
        <div className="space-y-3">
          {Object.entries(selectedStudent.performance.mastery).map(([concept, level]) => (
            <div key={concept}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{concept}</span>
                <span className="text-gray-600">{Math.round(level * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    level > 0.8 ? 'bg-green-500' :
                    level > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${level * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Learning</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Study Groups</span>
              <span className="font-medium">{selectedStudent.socialLearning.studyGroups}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peer Interactions</span>
              <span className="font-medium">{selectedStudent.socialLearning.peerInteractions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Help Provided</span>
              <span className="font-medium text-green-600">{selectedStudent.socialLearning.helpProvided}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Help Received</span>
              <span className="font-medium text-blue-600">{selectedStudent.socialLearning.helpReceived}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collaboration Rating</span>
              <span className="font-medium">⭐ {selectedStudent.socialLearning.collaborationRating}/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Behavior</h3>
          <div className="space-y-3">
            {Object.entries(selectedStudent.behavioralMetrics).map(([metric, value]) => (
              <div key={metric}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-gray-600">{Math.round(value * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      value > 0.8 ? 'bg-green-500' :
                      value > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const views = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'students', name: userType === 'teacher' ? 'Students' : 'My Child', icon: '👥' },
    { id: 'alerts', name: 'Alerts', icon: '🚨' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  if (loading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
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
            <h1 className="text-2xl font-bold text-gray-800">
              {userType === 'teacher' ? 'Teacher Dashboard' : 'Parent Dashboard'}
            </h1>
            <p className="text-gray-600">
              {userType === 'teacher' 
                ? 'Monitor and support your students\' learning journey' 
                : 'Track your child\'s academic progress'
              }
            </p>
          </div>
          
          {/* Timeframe selector */}
          <div className="flex space-x-2">
            {[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'term', label: 'This Term' }
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

        {/* Navigation */}
        <div className="flex space-x-1 mt-4">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => {
                setSelectedView(view.id);
                setSelectedStudent(null);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === view.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{view.icon}</span>
              <span>{view.name}</span>
              {view.id === 'alerts' && alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStudent ? 'student-detail' : selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedStudent ? renderStudentDetails() :
           selectedView === 'overview' ? renderOverview() :
           selectedView === 'students' ? renderStudentList() :
           selectedView === 'alerts' ? renderAlerts() :
           renderOverview()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TeacherParentDashboard;