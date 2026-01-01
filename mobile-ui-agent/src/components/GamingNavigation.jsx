import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { useAuth } from '../context/AuthContext';

const GamingNavigation = ({
  currentView,
  onNavigate,
  userLevel,
  userXP,
  userXPToNext,
  notifications = [],
  dailyStreak = 0
}) => {
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: '',
      activeIcon: '',
      description: 'Main dashboard'
    },
    {
      id: 'boss-battles',
      label: 'Boss Battles',
      icon: '',
      activeIcon: '',
      description: 'Epic challenges',
      badge: notifications.filter(n => n.type === 'boss').length || null
    },
    {
      id: 'mini-games',
      label: 'Mini Games',
      icon: '',
      activeIcon: '',
      description: 'Quick challenges'
    },
    {
      id: 'analytics',
      label: 'Progress',
      icon: '',
      activeIcon: '',
      description: 'Your insights'
    },
    {
      id: 'character',
      label: 'Character',
      icon: '',
      activeIcon: '',
      description: 'Level & skills'
    }
  ];

  const quickActions = [
    {
      id: 'daily-quest',
      label: 'Daily Quest',
      icon: '',
      color: 'from-orange-400 to-red-500',
      action: () => onNavigate('daily-quest')
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: '',
      color: 'from-yellow-400 to-orange-500',
      action: () => onNavigate('achievements')
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: '',
      color: 'from-purple-400 to-pink-500',
      action: () => onNavigate('leaderboard')
    }
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      boss: '',
      achievement: '',
      streak: '',
      level: '',
      challenge: ''
    };
    return icons[type] || '';
  };

  return (
    <>
      {/* Top Gaming Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white p-4">
        <div className="flex items-center justify-between">
          {/* User Info & Level */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              {/* User Name & Level */}
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-24">
                  {user?.name ? user.name.split(' ')[0] : 'User'}
                </span>
                <span className="text-xs text-white/80">Level {userLevel}</span>
              </div>
            </div>
            
            {/* XP Progress */}
            <div className="flex-1 min-w-0 max-w-32">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/80">{userXP} XP</span>
                <span className="text-white/80">{userXPToNext}</span>
              </div>
              <ProgressBar
                progress={(userXP / userXPToNext) * 100}
                height={4}
                color="#fbbf24"
                backgroundColor="rgba(255,255,255,0.2)"
                showPercentage={false}
              />
            </div>
          </div>

          {/* Notifications & Streak */}
          <div className="flex items-center space-x-3">
            {/* Daily Streak */}
            {dailyStreak > 0 && (
              <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
                <span className="streak-flame"></span>
                <span className="text-sm font-bold">{dailyStreak}</span>
              </div>
            )}

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex space-x-3 mt-4 overflow-x-auto"
        >
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`flex-shrink-0 bg-gradient-to-r ${action.color} text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow`}
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-2 z-40">
        <div className="flex justify-around">
          {navigationItems.map((item) => {
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gaming-gradient text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {/* Icon */}
                <motion.div
                  className="text-xl mb-1"
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </motion.div>

                {/* Label */}
                <span className="text-xs font-medium">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {item.badge}
                  </motion.div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 left-4 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900"> Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2"></div>
                  <p className="text-gray-600">No new notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for notifications */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default GamingNavigation;
