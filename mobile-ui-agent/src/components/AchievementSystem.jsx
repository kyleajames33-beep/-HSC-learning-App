import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AchievementSystem.css';

const AchievementSystem = ({ onClose, userProgress }) => {
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlocked, setShowUnlocked] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [newAchievements, setNewAchievements] = useState([]);

  const achievementCategories = {
    all: ' All',
    knowledge: ' Knowledge',
    streak: ' Consistency', 
    speed: ' Speed',
    mastery: ' Mastery',
    social: ' Social',
    challenge: ' Challenge',
    exploration: ' Explorer'
  };

  const achievementDatabase = {
    // Knowledge Achievements
    'first-question': {
      id: 'first-question',
      name: 'First Steps',
      description: 'Answer your first question correctly',
      icon: '',
      category: 'knowledge',
      xpReward: 10,
      rarity: 'common',
      condition: (stats) => stats.correctAnswers >= 1
    },
    'century-club': {
      id: 'century-club',
      name: 'Century Club',
      description: 'Answer 100 questions correctly',
      icon: '',
      category: 'knowledge',
      xpReward: 100,
      rarity: 'rare',
      condition: (stats) => stats.correctAnswers >= 100
    },
    'knowledge-seeker': {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 500 questions',
      icon: '',
      category: 'knowledge',
      xpReward: 250,
      rarity: 'epic',
      condition: (stats) => stats.totalQuestions >= 500
    },
    'perfectionist': {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Get 10 questions in a row correct',
      icon: '',
      category: 'knowledge',
      xpReward: 50,
      rarity: 'uncommon',
      condition: (stats) => stats.longestStreak >= 10
    },

    // Streak Achievements
    'daily-warrior': {
      id: 'daily-warrior',
      name: 'Daily Warrior',
      description: 'Study for 7 days in a row',
      icon: '',
      category: 'streak',
      xpReward: 70,
      rarity: 'uncommon',
      condition: (stats) => stats.studyStreak >= 7
    },
    'dedication-master': {
      id: 'dedication-master',
      name: 'Dedication Master',
      description: 'Study for 30 days in a row',
      icon: '',
      category: 'streak',
      xpReward: 300,
      rarity: 'legendary',
      condition: (stats) => stats.studyStreak >= 30
    },
    'weekend-warrior': {
      id: 'weekend-warrior',
      name: 'Weekend Warrior',
      description: 'Study on both weekend days',
      icon: '',
      category: 'streak',
      xpReward: 25,
      rarity: 'common',
      condition: (stats) => stats.weekendStudySessions >= 2
    },

    // Speed Achievements
    'lightning-fast': {
      id: 'lightning-fast',
      name: 'Lightning Fast',
      description: 'Answer a question in under 10 seconds',
      icon: '',
      category: 'speed',
      xpReward: 20,
      rarity: 'common',
      condition: (stats) => stats.fastestAnswer <= 10000
    },
    'speed-demon': {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete 20 questions in under 5 minutes',
      icon: '',
      category: 'speed',
      xpReward: 100,
      rarity: 'rare',
      condition: (stats) => stats.speedChallengeRecord <= 300000
    },
    'flash-thinker': {
      id: 'flash-thinker',
      name: 'Flash Thinker',
      description: 'Average under 15 seconds per question',
      icon: '',
      category: 'speed',
      xpReward: 75,
      rarity: 'uncommon',
      condition: (stats) => stats.averageAnswerTime <= 15000
    },

    // Mastery Achievements
    'module-master': {
      id: 'module-master',
      name: 'Module Master',
      description: 'Get 90%+ on all topics in a module',
      icon: '',
      category: 'mastery',
      xpReward: 200,
      rarity: 'epic',
      condition: (stats) => stats.modulesCompleted >= 1
    },
    'expert-level': {
      id: 'expert-level',
      name: 'Expert Level',
      description: 'Achieve expert mastery in 5 different topics',
      icon: '',
      category: 'mastery',
      xpReward: 500,
      rarity: 'legendary',
      condition: (stats) => stats.expertTopics >= 5
    },
    'difficulty-crusher': {
      id: 'difficulty-crusher',
      name: 'Difficulty Crusher',
      description: 'Get 80%+ accuracy on hard questions',
      icon: '',
      category: 'mastery',
      xpReward: 150,
      rarity: 'rare',
      condition: (stats) => stats.hardQuestionAccuracy >= 80
    },

    // Challenge Achievements
    'boss-slayer': {
      id: 'boss-slayer',
      name: 'Boss Slayer',
      description: 'Defeat 10 boss battles',
      icon: '',
      category: 'challenge',
      xpReward: 300,
      rarity: 'epic',
      condition: (stats) => stats.bossesDefeated >= 10
    },
    'challenger': {
      id: 'challenger',
      name: 'Challenger',
      description: 'Complete 50 challenge questions',
      icon: '',
      category: 'challenge',
      xpReward: 100,
      rarity: 'rare',
      condition: (stats) => stats.challengeQuestionsCompleted >= 50
    },
    'olympian': {
      id: 'olympian',
      name: 'Olympian',
      description: 'Win 5 speed quiz competitions',
      icon: '',
      category: 'challenge',
      xpReward: 250,
      rarity: 'epic',
      condition: (stats) => stats.speedQuizWins >= 5
    },

    // Social Achievements
    'helpful-peer': {
      id: 'helpful-peer',
      name: 'Helpful Peer',
      description: 'Help 10 other students',
      icon: '',
      category: 'social',
      xpReward: 75,
      rarity: 'uncommon',
      condition: (stats) => stats.studentsHelped >= 10
    },
    'study-buddy': {
      id: 'study-buddy',
      name: 'Study Buddy',
      description: 'Join a study group session',
      icon: '',
      category: 'social',
      xpReward: 25,
      rarity: 'common',
      condition: (stats) => stats.studyGroupSessions >= 1
    },

    // Exploration Achievements
    'curious-mind': {
      id: 'curious-mind',
      name: 'Curious Mind',
      description: 'Try all question types',
      icon: '',
      category: 'exploration',
      xpReward: 100,
      rarity: 'rare',
      condition: (stats) => stats.questionTypesAttempted >= 10
    },
    'subject-hopper': {
      id: 'subject-hopper',
      name: 'Subject Hopper',
      description: 'Study 3 different subjects',
      icon: '',
      category: 'exploration',
      xpReward: 150,
      rarity: 'rare',
      condition: (stats) => stats.subjectsStudied >= 3
    }
  };

  useEffect(() => {
    checkAchievements();
    loadUserAchievements();
  }, [userProgress]);

  const loadUserAchievements = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('userAchievements') || '[]');
      const achievementList = Object.values(achievementDatabase).map(achievement => ({
        ...achievement,
        unlocked: saved.includes(achievement.id),
        unlockedAt: saved.find(a => a.id === achievement.id)?.unlockedAt || null
      }));
      
      setAchievements(achievementList);
      
      const unlockedXP = achievementList
        .filter(a => a.unlocked)
        .reduce((total, a) => total + a.xpReward, 0);
      setTotalXP(unlockedXP);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const checkAchievements = () => {
    if (!userProgress) return;

    const stats = calculateUserStats(userProgress);
    const savedAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
    const newlyUnlocked = [];

    Object.values(achievementDatabase).forEach(achievement => {
      if (!savedAchievements.includes(achievement.id) && achievement.condition(stats)) {
        newlyUnlocked.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });

    if (newlyUnlocked.length > 0) {
      const updatedSaved = [
        ...savedAchievements,
        ...newlyUnlocked.map(a => a.id)
      ];
      
      localStorage.setItem('userAchievements', JSON.stringify(updatedSaved));
      setNewAchievements(newlyUnlocked);
      
      // Show achievement notifications
      newlyUnlocked.forEach((achievement, index) => {
        setTimeout(() => {
          showAchievementNotification(achievement);
        }, index * 1000);
      });
    }
  };

  const calculateUserStats = (progress) => {
    // Mock stats calculation - replace with real data
    return {
      correctAnswers: progress.correctAnswers || Math.floor(Math.random() * 150),
      totalQuestions: progress.totalQuestions || Math.floor(Math.random() * 200),
      studyStreak: progress.studyStreak || Math.floor(Math.random() * 15),
      longestStreak: progress.longestStreak || Math.floor(Math.random() * 20),
      fastestAnswer: progress.fastestAnswer || Math.floor(Math.random() * 30000) + 5000,
      averageAnswerTime: progress.averageAnswerTime || Math.floor(Math.random() * 20000) + 10000,
      speedChallengeRecord: progress.speedChallengeRecord || Math.floor(Math.random() * 400000) + 200000,
      modulesCompleted: progress.modulesCompleted || Math.floor(Math.random() * 3),
      expertTopics: progress.expertTopics || Math.floor(Math.random() * 8),
      hardQuestionAccuracy: progress.hardQuestionAccuracy || Math.floor(Math.random() * 100),
      bossesDefeated: progress.bossesDefeated || Math.floor(Math.random() * 15),
      challengeQuestionsCompleted: progress.challengeQuestionsCompleted || Math.floor(Math.random() * 100),
      speedQuizWins: progress.speedQuizWins || Math.floor(Math.random() * 10),
      studentsHelped: progress.studentsHelped || Math.floor(Math.random() * 20),
      studyGroupSessions: progress.studyGroupSessions || Math.floor(Math.random() * 5),
      questionTypesAttempted: progress.questionTypesAttempted || Math.floor(Math.random() * 12),
      subjectsStudied: progress.subjectsStudied || Math.floor(Math.random() * 4),
      weekendStudySessions: progress.weekendStudySessions || Math.floor(Math.random() * 10)
    };
  };

  const showAchievementNotification = (achievement) => {
    // Create a floating achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notification-content">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-details">
          <h3>Achievement Unlocked!</h3>
          <p>${achievement.name}</p>
          <span class="xp-reward">+${achievement.xpReward} XP</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#94a3b8',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityGlow = (rarity) => {
    const glows = {
      common: 'none',
      uncommon: '0 0 10px rgba(16, 185, 129, 0.5)',
      rare: '0 0 15px rgba(59, 130, 246, 0.5)',
      epic: '0 0 20px rgba(139, 92, 246, 0.5)',
      legendary: '0 0 25px rgba(245, 158, 11, 0.7)'
    };
    return glows[rarity] || glows.common;
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    if (showUnlocked && !achievement.unlocked) {
      return false;
    }
    return true;
  });

  const categoryStats = Object.keys(achievementCategories).reduce((stats, category) => {
    if (category === 'all') return stats;
    
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
    
    stats[category] = {
      total: categoryAchievements.length,
      unlocked: unlockedCount,
      percentage: categoryAchievements.length > 0 
        ? Math.round((unlockedCount / categoryAchievements.length) * 100)
        : 0
    };
    
    return stats;
  }, {});

  const overallProgress = achievements.length > 0 
    ? Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)
    : 0;

  return (
    <div className="achievement-system-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="achievement-system-modal"
      >
        <header className="achievement-header">
          <div className="header-content">
            <h1> Achievements</h1>
            <button onClick={onClose} className="close-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="progress-summary">
            <div className="overall-progress">
              <div className="progress-circle">
                <svg className="progress-ring" width="80" height="80">
                  <circle
                    className="progress-ring-bg"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="transparent"
                    r="32"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="progress-ring-fill"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    r="32"
                    cx="40"
                    cy="40"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - overallProgress / 100)}`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percentage">{overallProgress}%</span>
                </div>
              </div>
              <div className="progress-details">
                <h3>Overall Progress</h3>
                <p>{achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked</p>
                <div className="xp-total">
                  <span className="xp-icon"></span>
                  <span>{totalXP} Total XP</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="achievement-controls">
          <div className="category-filters">
            {Object.entries(achievementCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`category-filter ${selectedCategory === key ? 'active' : ''}`}
              >
                <span>{label}</span>
                {key !== 'all' && categoryStats[key] && (
                  <span className="category-count">
                    {categoryStats[key].unlocked}/{categoryStats[key].total}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="view-options">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showUnlocked}
                onChange={(e) => setShowUnlocked(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Unlocked Only</span>
            </label>
          </div>
        </div>

        <div className="achievements-grid">
          <AnimatePresence>
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
                style={{
                  borderColor: getRarityColor(achievement.rarity),
                  boxShadow: achievement.unlocked ? getRarityGlow(achievement.rarity) : 'none'
                }}
              >
                <div className="achievement-icon-container">
                  <div 
                    className="achievement-icon"
                    style={{ 
                      filter: achievement.unlocked ? 'none' : 'grayscale(100%) brightness(0.5)' 
                    }}
                  >
                    {achievement.icon}
                  </div>
                  {!achievement.unlocked && (
                    <div className="lock-overlay">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1046 2 14 2.89543 14 4V6H18C18.5523 6 19 6.44772 19 7V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V7C5 6.44772 5.44772 6 6 6H10V4C10 2.89543 10.8954 2 12 2ZM12 4V6H12V4ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10Z"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="achievement-details">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  
                  <div className="achievement-meta">
                    <span className={`rarity-badge ${achievement.rarity}`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    <span className="xp-reward">+{achievement.xpReward} XP</span>
                  </div>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="unlock-date">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAchievements.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>No achievements found</h3>
            <p>Try adjusting your filters or unlock more achievements!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AchievementSystem;
