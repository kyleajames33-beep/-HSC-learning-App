import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementGallery = ({ userId, className = '' }) => {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    fetchAchievements();
  }, [userId]);

  const fetchAchievements = async () => {
    try {
      // Get auth token
      const token = localStorage.getItem('token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`
      } : {};

      const response = await fetch(`/api/achievements/user/${userId}`, { headers });
      const data = await response.json();

      if (data.success) {
        // Transform data to match expected format
        const transformedData = {
          success: true,
          achievements: (data.data?.userAchievements || []).map(ach => ({
            id: ach.achievement_id,
            name: ach.achievement_name || ach.achievements?.name,
            icon: ach.badge_icon || ach.achievements?.badge_icon || '🏆',
            description: ach.achievement_description || ach.achievements?.description,
            category: ach.achievements?.category || 'learning',
            unlocked: ach.is_completed,
            unlockedAt: ach.completed_at,
            xpReward: ach.achievements?.xp_reward || 0,
            isNew: false // Could track this
          })),
          stats: {
            unlocked: data.data?.summary?.completed_achievements || 0,
            total: data.data?.summary?.total_achievements || 0,
            progress: data.data?.summary?.completion_percentage || 0
          }
        };
        setAchievements(transformedData);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNewAchievements = (newAchievementList) => {
    setNewAchievements(newAchievementList);
    setTimeout(() => setNewAchievements([]), 5000);
  };

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'streak', name: 'Streaks', icon: '🔥' },
    { id: 'mastery', name: 'Mastery', icon: '⭐' },
    { id: 'social', name: 'Social', icon: '👥' }
  ];

  const getFilteredAchievements = () => {
    if (!achievements) return [];
    
    if (selectedCategory === 'all') {
      return achievements.achievements;
    }
    
    return achievements.achievements.filter(a => a.category === selectedCategory);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!achievements) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600">Unable to load achievements</p>
      </div>
    );
  }

  const filteredAchievements = getFilteredAchievements();

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      {/* New Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 bg-yellow-400 text-black p-4 rounded-lg shadow-lg z-50 max-w-sm"
            style={{ marginTop: index * 80 }}
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm">{achievement.name}</div>
                <div className="text-xs opacity-75">+{achievement.xpReward} XP</div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
          <p className="text-sm text-gray-600">
            {achievements.stats.unlocked} of {achievements.stats.total} unlocked ({achievements.stats.progress}%)
          </p>
        </div>
        <div className="text-3xl">🏆</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${achievements.stats.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-gray-50 rounded-lg p-3 text-center border-2 transition-all hover:shadow-md ${
              achievement.unlocked
                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                : 'border-gray-200 opacity-60'
            }`}
            title={achievement.description}
          >
            {/* Achievement Icon */}
            <div className={`text-2xl mb-1 ${achievement.unlocked ? '' : 'grayscale'}`}>
              {achievement.icon}
            </div>
            
            {/* Achievement Name */}
            <div className={`text-xs font-semibold ${
              achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {achievement.name}
            </div>
            
            {/* XP Reward */}
            <div className={`text-xs ${
              achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
            }`}>
              {achievement.xpReward} XP
            </div>

            {/* Unlock Date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}

            {/* Lock Overlay for Unearned */}
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <div className="text-lg opacity-50">🔒</div>
              </div>
            )}

            {/* New Achievement Glow */}
            {achievement.unlocked && achievement.isNew && (
              <motion.div
                className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(250, 204, 21, 0)',
                    '0 0 0 4px rgba(250, 204, 21, 0.3)',
                    '0 0 0 0 rgba(250, 204, 21, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🏆</div>
          <p>No achievements in this category yet</p>
          <p className="text-sm">Keep studying to unlock more!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;