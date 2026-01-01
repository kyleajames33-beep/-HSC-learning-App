import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import analyticsService from '../services/analyticsService';

const ModernAnalyticsDashboard = ({ onBack }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedView, setSelectedView] = useState('overview');
  const [realTimeEvents, setRealTimeEvents] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    activeUsers: 1,
    questionsThisSession: 0,
    currentScore: 0,
    sessionTime: 0
  });

  const realtimeListenerRef = useRef(null);
  const sessionStartTime = useRef(Date.now());

  useEffect(() => {
    loadDashboardData();
    setupRealTimeUpdates();
    
    return () => {
      if (realtimeListenerRef.current) {
        realtimeListenerRef.current();
      }
    };
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getDashboardAnalytics('demo-user', selectedTimeframe);
      setDashboardData(data);
      console.log('📊 Dashboard data loaded:', data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    if (realtimeListenerRef.current) {
      realtimeListenerRef.current();
    }

    realtimeListenerRef.current = analyticsService.addRealTimeListener((event) => {
      console.log('📈 Real-time analytics event:', event);

      // Update live metrics
      setLiveMetrics(prev => {
        const updated = { ...prev };
        updated.sessionTime = Math.floor((Date.now() - sessionStartTime.current) / 1000 / 60);
        
        if (event.type === 'quiz_completed') {
          updated.questionsThisSession += event.data?.totalQuestions || 1;
          updated.currentScore = event.data?.score || 0;
        }
        
        return updated;
      });

      // Update real-time events feed
      setRealTimeEvents(prev => [
        {
          id: event.id || Date.now(),
          ...event,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 19)
      ]);
    });
  };

  const StatCard = ({ title, value, subtitle, color = 'blue', icon, trend = null, isLive = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${color}-500 relative overflow-hidden`}
    >
      {isLive && (
        <div className="absolute top-2 right-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLive && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">LIVE</span>}
          </div>
          <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {trend !== null && (
          <div className={`text-xl ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {trend > 0 ? '↗️' : trend < 0 ? '↘️' : '➡️'}
          </div>
        )}
      </div>
    </motion.div>
  );

  const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = 'blue' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${percentage / 100 * circumference} ${circumference}`;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={`text-${color}-500`}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold text-${color}-600`}>{percentage}%</span>
        </div>
      </div>
    );
  };

  const SubjectCard = ({ subject, data, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{subject === 'biology' ? '🧬' : '⚗️'}</span>
          <h3 className="text-lg font-semibold capitalize">{subject}</h3>
        </div>
        <ProgressRing 
          percentage={data?.overall?.averageProgress || 0} 
          size={80} 
          strokeWidth={6}
          color={color}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className={`text-xl font-bold text-${color}-600`}>
            {data?.overall?.averageScore || 0}%
          </p>
          <p className="text-sm text-gray-600">Avg Score</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className={`text-xl font-bold text-${color}-600`}>
            {Math.round((data?.overall?.totalTimeSpent || 0) / 60)}h
          </p>
          <p className="text-sm text-gray-600">Time Spent</p>
        </div>
      </div>

      <div className="space-y-3">
        {data?.strongAreas?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">Strong Areas:</p>
            <div className="flex flex-wrap gap-1">
              {data.strongAreas.slice(0, 3).map((area, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {data?.strugglingAreas?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-red-600 mb-1">Focus Areas:</p>
            <div className="flex flex-wrap gap-1">
              {data.strugglingAreas.slice(0, 3).map((area, index) => (
                <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const PerformanceTrend = ({ trends }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
      
      <div className="space-y-4">
        {trends?.slice(-7).map((trend, index) => {
          const date = new Date(trend.date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isToday ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium">
                  {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-blue-600">{Math.round(trend.score)}%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-purple-600">{trend.questionsAnswered}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-green-600">{Math.round(trend.timeSpent)}m</p>
                  <p className="text-xs text-gray-500">Time</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const RealTimeActivity = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Activity</h3>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-green-600 font-medium">Live</span>
        </motion.div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {realTimeEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            >
              <div className="text-xl">
                {event.type === 'quiz_completed' && '✅'}
                {event.type === 'progress_update' && '📊'}
                {event.type === 'achievement_unlocked' && '🏆'}
                {event.type === 'content_access' && '📚'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {event.type === 'quiz_completed' && 'Quiz Completed'}
                  {event.type === 'progress_update' && 'Progress Updated'}
                  {event.type === 'achievement_unlocked' && 'Achievement Unlocked'}
                  {event.type === 'content_access' && 'Content Accessed'}
                </p>
                <p className="text-sm text-gray-500">
                  {event.agent} agent - {event.data?.subject || 'Unknown subject'}
                  {event.data?.score && ` (${event.data.score}%)`}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {realTimeEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-2xl mb-2">📊</p>
            <p>Waiting for activity...</p>
            <p className="text-sm">Real-time events will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl text-gray-700">Loading Analytics...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
                <p className="text-gray-600">Real-time insights into your HSC preparation journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="1d">Today</option>
                <option value="7d">This Week</option>
                <option value="30d">This Month</option>
              </select>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['overview', 'subjects', 'performance'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedView === view
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Live Session Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Session Time"
            value={`${liveMetrics.sessionTime}m`}
            subtitle="current session"
            color="purple"
            icon="⏱️"
            isLive={true}
          />
          <StatCard
            title="Questions Today"
            value={liveMetrics.questionsThisSession}
            subtitle="this session"
            color="blue"
            icon="❓"
            isLive={true}
          />
          <StatCard
            title="Current Score"
            value={`${liveMetrics.currentScore}%`}
            subtitle="latest quiz"
            color="green"
            icon="🎯"
            isLive={true}
          />
          <StatCard
            title="Active Users"
            value={liveMetrics.activeUsers}
            subtitle="currently online"
            color="orange"
            icon="👥"
            isLive={true}
          />
        </div>

        {/* Overview Metrics */}
        {selectedView === 'overview' && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Overall Progress"
                value={`${dashboardData.overall?.overallProgress || 0}%`}
                subtitle="across all subjects"
                color="blue"
                icon="📈"
                trend={5}
              />
              <StatCard
                title="Average Score"
                value={`${dashboardData.overall?.averageScore || 0}%`}
                subtitle="quiz performance"
                color="green"
                icon="🎯"
                trend={3}
              />
              <StatCard
                title="Study Time"
                value={`${Math.round((dashboardData.overall?.totalTimeSpent || 0) / 60)}h`}
                subtitle="total time invested"
                color="purple"
                icon="⏰"
                trend={8}
              />
              <StatCard
                title="Streak Days"
                value={dashboardData.overall?.streakDays || 0}
                subtitle="consecutive days"
                color="orange"
                icon="🔥"
                trend={1}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <PerformanceTrend trends={dashboardData.performance?.trends} />
              </div>
              <div>
                <RealTimeActivity />
              </div>
            </div>
          </>
        )}

        {/* Subject Analysis */}
        {selectedView === 'subjects' && dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dashboardData.subjects?.biology && (
              <SubjectCard 
                subject="biology" 
                data={dashboardData.subjects.biology} 
                color="green"
              />
            )}
            {dashboardData.subjects?.chemistry && (
              <SubjectCard 
                subject="chemistry" 
                data={dashboardData.subjects.chemistry} 
                color="purple"
              />
            )}
          </div>
        )}

        {/* Performance Analysis */}
        {selectedView === 'performance' && dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PerformanceTrend trends={dashboardData.performance?.trends} />
            <RealTimeActivity />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernAnalyticsDashboard;