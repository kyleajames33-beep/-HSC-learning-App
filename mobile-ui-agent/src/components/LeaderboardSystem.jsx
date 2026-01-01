import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LeaderboardSystem.css';

const LeaderboardSystem = ({ onClose, currentUser }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  const periods = {
    day: ' Today',
    week: ' This Week',
    month: ' This Month',
    alltime: ' All Time'
  };

  const categories = {
    overall: ' Overall Score',
    streak: ' Study Streak',
    questions: ' Questions Answered',
    speed: ' Speed Champion',
    accuracy: ' Accuracy Master',
    xp: ' Experience Points',
    achievements: ' Achievement Hunter'
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [selectedPeriod, selectedCategory]);

  const loadLeaderboardData = async () => {
    setLoading(true);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = generateMockLeaderboardData();
      setLeaderboardData(mockData);
      
      // Find current user rank
      const userRank = mockData.findIndex(user => user.id === currentUser?.id) + 1;
      setCurrentUserRank(userRank > 0 ? userRank : null);
      
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboardData = () => {
    const names = [
      'Alex Chen', 'Sarah Kim', 'Michael Torres', 'Emma Watson', 'James Park',
      'Sophie Liu', 'David Rodriguez', 'Maya Patel', 'Ryan Zhang', 'Isabella Martinez',
      'Ethan Brown', 'Ava Singh', 'Noah Thompson', 'Mia Johnson', 'Lucas Davis',
      'Chloe Wilson', 'Mason Lee', 'Grace Taylor', 'Logan Anderson', 'Zoe White',
      'Owen Clark', 'Lily Hall', 'Carter Lewis', 'Ruby Walker', 'Hunter Young'
    ];
    
    const schools = [
      'Sydney Grammar', 'North Sydney Girls', 'James Ruse', 'Baulkham Hills',
      'Hornsby Girls', 'Knox Grammar', 'Abbotsleigh', 'St Ignatius',
      'Pymble Ladies', 'Cherrybrook Tech', 'Carlingford High', 'Epping Boys'
    ];

    const avatars = [
      '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', ''
    ];

    return names.map((name, index) => {
      const baseScore = Math.max(50, 1000 - index * 35 + Math.random() * 50);
      return {
        id: `user_${index}`,
        name: name,
        avatar: avatars[index % avatars.length],
        school: schools[index % schools.length],
        score: Math.round(baseScore),
        rank: index + 1,
        change: Math.floor(Math.random() * 21) - 10, // -10 to +10
        stats: {
          questionsAnswered: Math.floor(Math.random() * 500) + 100,
          studyStreak: Math.floor(Math.random() * 30) + 1,
          accuracy: Math.floor(Math.random() * 30) + 70,
          averageSpeed: Math.floor(Math.random() * 20) + 15,
          totalXP: Math.floor(Math.random() * 2000) + 500,
          achievements: Math.floor(Math.random() * 20) + 5,
          timeStudied: Math.floor(Math.random() * 100) + 20,
          modulesCompleted: Math.floor(Math.random() * 8) + 1
        },
        badges: generateUserBadges(),
        isOnline: Math.random() > 0.7,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      };
    });
  };

  const generateUserBadges = () => {
    const allBadges = [
      { icon: '', name: 'Hot Streak', color: '#ef4444' },
      { icon: '', name: 'Sharpshooter', color: '#10b981' },
      { icon: '', name: 'Speed Demon', color: '#f59e0b' },
      { icon: '', name: 'Big Brain', color: '#8b5cf6' },
      { icon: '', name: 'Champion', color: '#fbbf24' },
      { icon: '', name: 'Diamond', color: '#06b6d4' },
      { icon: '', name: 'Winner', color: '#84cc16' },
      { icon: '', name: 'Rising Star', color: '#ec4899' }
    ];
    
    const badgeCount = Math.floor(Math.random() * 4) + 1;
    return allBadges.sort(() => 0.5 - Math.random()).slice(0, badgeCount);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '';
    if (rank === 2) return '';
    if (rank === 3) return '';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#fbbf24';
    if (rank === 2) return '#94a3b8';
    if (rank === 3) return '#cd7c0f';
    return '#6b7280';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return { icon: '', color: '#10b981', text: `+${change}` };
    if (change < 0) return { icon: '', color: '#ef4444', text: change };
    return { icon: '', color: '#6b7280', text: '0' };
  };

  const getScoreForCategory = (user, category) => {
    switch (category) {
      case 'overall': return user.score;
      case 'streak': return user.stats.studyStreak;
      case 'questions': return user.stats.questionsAnswered;
      case 'speed': return user.stats.averageSpeed;
      case 'accuracy': return user.stats.accuracy;
      case 'xp': return user.stats.totalXP;
      case 'achievements': return user.stats.achievements;
      default: return user.score;
    }
  };

  const getScoreUnit = (category) => {
    switch (category) {
      case 'overall': return 'pts';
      case 'streak': return 'days';
      case 'questions': return 'questions';
      case 'speed': return 'sec avg';
      case 'accuracy': return '% accuracy';
      case 'xp': return 'XP';
      case 'achievements': return 'unlocked';
      default: return 'pts';
    }
  };

  const sortedData = [...leaderboardData].sort((a, b) => {
    const scoreA = getScoreForCategory(a, selectedCategory);
    const scoreB = getScoreForCategory(b, selectedCategory);
    
    // For speed, lower is better
    if (selectedCategory === 'speed') {
      return scoreA - scoreB;
    }
    
    return scoreB - scoreA;
  }).map((user, index) => ({ ...user, rank: index + 1 }));

  if (loading) {
    return (
      <div className="leaderboard-overlay">
        <div className="leaderboard-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3>Loading Leaderboard...</h3>
            <p>Fetching the latest rankings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="leaderboard-modal"
      >
        <header className="leaderboard-header">
          <div className="header-content">
            <h1> Leaderboard</h1>
            <button onClick={onClose} className="close-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="leaderboard-controls">
            <div className="period-selector">
              {Object.entries(periods).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key)}
                  className={`period-button ${selectedPeriod === key ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="category-selector">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {currentUserRank && (
          <div className="current-user-rank">
            <div className="rank-info">
              <span className="rank-position">Your Rank: {getRankIcon(currentUserRank)}</span>
              <span className="rank-score">
                {getScoreForCategory(currentUser, selectedCategory)} {getScoreUnit(selectedCategory)}
              </span>
            </div>
          </div>
        )}

        <div className="podium-section">
          {sortedData.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`podium-user podium-${index + 1}`}
            >
              <div className="podium-rank">
                <span className="rank-icon">{getRankIcon(index + 1)}</span>
              </div>
              
              <div className="podium-avatar">
                <div className="avatar-container">
                  <span className="avatar">{user.avatar}</span>
                  {user.isOnline && <div className="online-indicator"></div>}
                </div>
              </div>
              
              <div className="podium-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-school">{user.school}</p>
                <div className="user-score">
                  <span className="score-value">
                    {getScoreForCategory(user, selectedCategory)}
                  </span>
                  <span className="score-unit">{getScoreUnit(selectedCategory)}</span>
                </div>
                
                <div className="user-badges">
                  {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="badge"
                      style={{ backgroundColor: badge.color }}
                      title={badge.name}
                    >
                      {badge.icon}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="leaderboard-list">
          <div className="list-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Score</span>
            <span>Change</span>
          </div>
          
          <div className="list-content">
            <AnimatePresence>
              {sortedData.slice(3).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`leaderboard-row ${user.id === currentUser?.id ? 'current-user' : ''}`}
                >
                  <div className="row-rank">
                    <span 
                      className="rank-number"
                      style={{ color: getRankColor(user.rank) }}
                    >
                      #{user.rank}
                    </span>
                  </div>
                  
                  <div className="row-user">
                    <div className="user-avatar">
                      <span className="avatar">{user.avatar}</span>
                      {user.isOnline && <div className="online-indicator"></div>}
                    </div>
                    <div className="user-details">
                      <span className="name">{user.name}</span>
                      <span className="school">{user.school}</span>
                    </div>
                    <div className="user-badges-small">
                      {user.badges.slice(0, 2).map((badge, badgeIndex) => (
                        <div
                          key={badgeIndex}
                          className="badge-small"
                          style={{ backgroundColor: badge.color }}
                          title={badge.name}
                        >
                          {badge.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="row-score">
                    <span className="score-value">
                      {getScoreForCategory(user, selectedCategory)}
                    </span>
                    <span className="score-unit">{getScoreUnit(selectedCategory)}</span>
                  </div>
                  
                  <div className="row-change">
                    <div 
                      className="change-indicator"
                      style={{ color: getChangeIcon(user.change).color }}
                    >
                      <span className="change-icon">{getChangeIcon(user.change).icon}</span>
                      <span className="change-value">{getChangeIcon(user.change).text}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="leaderboard-footer">
          <div className="competitive-stats">
            <div className="stat">
              <span className="stat-label">Total Competitors</span>
              <span className="stat-value">{sortedData.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Average Score</span>
              <span className="stat-value">
                {Math.round(sortedData.reduce((sum, user) => sum + getScoreForCategory(user, selectedCategory), 0) / sortedData.length)}
                {' '}{getScoreUnit(selectedCategory)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Top Score</span>
              <span className="stat-value">
                {getScoreForCategory(sortedData[0], selectedCategory)}
                {' '}{getScoreUnit(selectedCategory)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardSystem;
