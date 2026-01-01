import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import XPProgress from './XPProgress';
import StreakCounter from './StreakCounter';
import AchievementGallery from './AchievementGallery';
import Leaderboard from './Leaderboard';

const GamificationDashboard = ({ userId, subject = 'biology', className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🎯' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'leaderboard', name: 'Leaderboard', icon: '📊' },
    { id: 'progress', name: 'Progress', icon: '📈' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <XPProgress userId={userId} />
              <StreakCounter userId={userId} />
            </div>

            {/* Quick Achievements Preview */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Achievements</h3>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All →
                </button>
              </div>
              <AchievementGallery userId={userId} className="max-h-48 overflow-hidden" />
            </div>

            {/* Quick Leaderboard Preview */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Top Performers</h3>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View Full Rankings →
                </button>
              </div>
              <Leaderboard userId={userId} subject={subject} className="max-h-64 overflow-hidden" />
            </div>
          </div>
        );

      case 'achievements':
        return <AchievementGallery userId={userId} />;

      case 'leaderboard':
        return <Leaderboard userId={userId} subject={subject} />;

      case 'progress':
        return (
          <div className="space-y-6">
            <XPProgress userId={userId} />
            <StreakCounter userId={userId} />
            
            {/* Detailed Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Progress</h3>
                <WeeklyProgressChart userId={userId} />
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Mastery</h3>
                <SubjectMasteryChart userId={userId} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-gray-50 ${className}`}>
      {/* Collapsible Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              className="text-2xl"
            >
              🎮
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Gamification Hub</h2>
              <p className="text-sm text-gray-600">Track your learning journey</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </button>
        </div>

        {/* Tab Navigation */}
        {!isCollapsed && (
          <div className="flex space-x-1 px-4 pb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isCollapsed ? 0 : 'auto',
          opacity: isCollapsed ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple chart components for progress tracking
const WeeklyProgressChart = ({ userId }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mock data for weekly progress
    const mockData = [
      { day: 'Mon', xp: 120 },
      { day: 'Tue', xp: 180 },
      { day: 'Wed', xp: 90 },
      { day: 'Thu', xp: 240 },
      { day: 'Fri', xp: 150 },
      { day: 'Sat', xp: 300 },
      { day: 'Sun', xp: 200 }
    ];
    setChartData(mockData);
  }, [userId]);

  const maxXP = Math.max(...chartData.map(d => d.xp));

  return (
    <div className="space-y-3">
      {chartData.map((day, index) => (
        <div key={day.day} className="flex items-center space-x-3">
          <div className="w-12 text-sm text-gray-600">{day.day}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(day.xp / maxXP) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            />
          </div>
          <div className="w-12 text-sm font-semibold text-gray-800">{day.xp}</div>
        </div>
      ))}
    </div>
  );
};

const SubjectMasteryChart = ({ userId }) => {
  const subjects = [
    { name: 'Biology', progress: 75, color: 'from-green-500 to-emerald-500' },
    { name: 'Chemistry', progress: 60, color: 'from-blue-500 to-cyan-500' },
    { name: 'Physics', progress: 45, color: 'from-purple-500 to-pink-500' },
    { name: 'Math', progress: 30, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="space-y-4">
      {subjects.map((subject, index) => (
        <div key={subject.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{subject.name}</span>
            <span className="text-gray-600">{subject.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`bg-gradient-to-r ${subject.color} h-2 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${subject.progress}%` }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamificationDashboard;