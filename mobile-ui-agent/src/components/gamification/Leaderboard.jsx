import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Leaderboard = ({ subject = 'biology', userId, className = '' }) => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('weekly');
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [subject, timeframe]);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`/api/achievements/leaderboard?category=${subject}&limit=50`, { headers });
      const data = await response.json();

      if (data.success) {
        // Transform data to match expected format
        const transformedData = (data.data?.leaderboard || []).map((entry, index) => ({
          userId: entry.user_id,
          displayName: entry.display_name || entry.name || 'Anonymous',
          xp: entry.total_xp || entry.total_points || 0,
          level: Math.floor((entry.total_xp || 0) / 1000) + 1,
          rank: index + 1
        }));

        setLeaderboardData(transformedData);

        // Find user's rank
        const userEntry = transformedData.find(entry => entry.userId === userId);
        setUserRank(userEntry?.rank || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeframes = [
    { id: 'weekly', name: 'This Week', icon: '📅' },
    { id: 'monthly', name: 'This Month', icon: '🗓️' },
    { id: 'alltime', name: 'All Time', icon: '🏆' }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600">Unable to load leaderboard</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
          <p className="text-sm text-gray-600 capitalize">{subject} • {timeframe}</p>
        </div>
        <div className="text-3xl">🏆</div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {timeframes.map(tf => (
          <button
            key={tf.id}
            onClick={() => setTimeframe(tf.id)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              timeframe === tf.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tf.icon}</span>
            <span>{tf.name}</span>
          </button>
        ))}
      </div>

      {/* User's Rank (if not in top 10) */}
      {userRank && userRank > 10 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Your rank:</span>
            <span className="font-bold text-blue-800">#{userRank}</span>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="mb-6">
          <div className="flex items-end justify-center space-x-4">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                {leaderboardData[1]?.displayName?.[0] || '?'}
              </div>
              <div className="bg-gray-300 h-12 w-20 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold">2nd</span>
              </div>
              <div className="text-xs mt-1 text-gray-600">{leaderboardData[1]?.displayName}</div>
              <div className="text-xs font-bold text-gray-800">{leaderboardData[1]?.xp?.toLocaleString()} XP</div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 relative">
                {leaderboardData[0]?.displayName?.[0] || '?'}
                <div className="absolute -top-2 -right-2 text-2xl">👑</div>
              </div>
              <div className="bg-yellow-400 h-16 w-24 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold">1st</span>
              </div>
              <div className="text-sm mt-1 font-semibold text-gray-800">{leaderboardData[0]?.displayName}</div>
              <div className="text-sm font-bold text-yellow-600">{leaderboardData[0]?.xp?.toLocaleString()} XP</div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                {leaderboardData[2]?.displayName?.[0] || '?'}
              </div>
              <div className="bg-amber-600 h-8 w-20 rounded-t-lg flex items-center justify-center">
                <span className="text-white font-bold">3rd</span>
              </div>
              <div className="text-xs mt-1 text-gray-600">{leaderboardData[2]?.displayName}</div>
              <div className="text-xs font-bold text-gray-800">{leaderboardData[2]?.xp?.toLocaleString()} XP</div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="space-y-2">
        {leaderboardData.slice(0, 10).map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              entry.userId === userId
                ? 'bg-blue-100 border-2 border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100'
            } ${getRankStyle(entry.rank)}`}
          >
            {/* Rank */}
            <div className="w-8 h-8 flex items-center justify-center font-bold">
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {entry.displayName?.[0] || '?'}
            </div>

            {/* Name and Level */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 truncate">
                {entry.displayName}
                {entry.userId === userId && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">You</span>
                )}
              </div>
              <div className="text-sm text-gray-600">Level {entry.level}</div>
            </div>

            {/* XP */}
            <div className="text-right">
              <div className="font-bold text-gray-800">{entry.xp?.toLocaleString()}</div>
              <div className="text-xs text-gray-600">XP</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      {leaderboardData.length > 10 && (
        <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          Show more rankings
        </button>
      )}

      {/* Empty State */}
      {leaderboardData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🏆</div>
          <p>No rankings available yet</p>
          <p className="text-sm">Be the first to start learning!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;