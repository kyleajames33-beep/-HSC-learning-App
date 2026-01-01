import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import ProgressRing from './ProgressRing';

const CharacterProgression = ({
  character,
  level,
  xp,
  xpToNext,
  biologyLevel,
  chemistryLevel,
  biologyXP,
  chemistryXP,
  achievements,
  showLevelUpAnimation = false,
  onAnimationComplete
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (showLevelUpAnimation) {
      setAnimationStep(1);
      const timer = setTimeout(() => {
        setAnimationStep(2);
        if (onAnimationComplete) onAnimationComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUpAnimation, onAnimationComplete]);

  const getCharacterAvatar = (level) => {
    if (level >= 30) return ''; // HSC Legend
    if (level >= 25) return ''; // Master Scholar
    if (level >= 20) return ''; // Star Student
    if (level >= 15) return ''; // Science Expert
    if (level >= 10) return ''; // Dedicated Learner
    if (level >= 5) return ''; // Growing Scholar
    return ''; // Beginner
  };

  const getCharacterTitle = (level) => {
    if (level >= 30) return 'HSC Legend';
    if (level >= 25) return 'Master Scholar';
    if (level >= 20) return 'Star Student';
    if (level >= 15) return 'Science Expert';
    if (level >= 10) return 'Dedicated Learner';
    if (level >= 5) return 'Growing Scholar';
    return 'Aspiring Scholar';
  };

  const skillTrees = {
    biology: {
      name: 'Biology Mastery',
      color: 'from-green-400 to-green-600',
      skills: [
        { id: 'cell-biology', name: 'Cell Biology', level: biologyLevel >= 5 ? 'unlocked' : 'locked', icon: '' },
        { id: 'genetics', name: 'Genetics', level: biologyLevel >= 10 ? 'unlocked' : 'locked', icon: '' },
        { id: 'evolution', name: 'Evolution', level: biologyLevel >= 15 ? 'unlocked' : 'locked', icon: '' },
        { id: 'ecology', name: 'Ecology', level: biologyLevel >= 20 ? 'unlocked' : 'locked', icon: '' },
      ]
    },
    chemistry: {
      name: 'Chemistry Mastery',
      color: 'from-purple-400 to-purple-600',
      skills: [
        { id: 'atomic-structure', name: 'Atomic Structure', level: chemistryLevel >= 5 ? 'unlocked' : 'locked', icon: '' },
        { id: 'chemical-bonds', name: 'Chemical Bonds', level: chemistryLevel >= 10 ? 'unlocked' : 'locked', icon: '' },
        { id: 'reactions', name: 'Reactions', level: chemistryLevel >= 15 ? 'unlocked' : 'locked', icon: '' },
        { id: 'organic-chem', name: 'Organic Chemistry', level: chemistryLevel >= 20 ? 'unlocked' : 'locked', icon: '' },
      ]
    }
  };

  return (
    <div className="gaming-card p-6">
      {/* Level Up Animation Overlay */}
      <AnimatePresence>
        {showLevelUpAnimation && animationStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center max-w-sm w-full mx-4 shadow-2xl"
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">LEVEL UP!</h2>
              <div className="text-6xl font-bold text-white mb-2">{level}</div>
              <p className="text-white/90 text-lg mb-4">{getCharacterTitle(level)}</p>
              <motion.div
                className="text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {getCharacterAvatar(level)}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        {['overview', 'skills', 'achievements'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedTab === tab
                ? 'bg-gaming-gradient text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Character Avatar and Info */}
            <div className="text-center">
              <motion.div
                className="text-8xl mb-4 inline-block"
                animate={{ float: true }}
                whileHover={{ scale: 1.1 }}
              >
                {getCharacterAvatar(level)}
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Level {level} {getCharacterTitle(level)}
              </h3>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="level-badge">{level}</span>
                <span>{xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Overall XP Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Level Progress</span>
                <span className="text-gray-600">{xpToNext - (xp % xpToNext)} XP to next level</span>
              </div>
              <ProgressBar
                progress={((xp % xpToNext) / xpToNext) * 100}
                height={12}
                color="#8b5cf6"
                backgroundColor="#e5e7eb"
                className="xp-bar"
              />
            </div>

            {/* Subject Progress */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <ProgressRing
                  progress={(biologyXP % 1000) / 10}
                  size={80}
                  color="#10b981"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{biologyLevel}</div>
                    <div className="text-xs text-gray-600">Bio</div>
                  </div>
                </ProgressRing>
                <p className="text-sm font-medium mt-2">Biology</p>
              </div>
              <div className="text-center">
                <ProgressRing
                  progress={(chemistryXP % 1000) / 10}
                  size={80}
                  color="#8b5cf6"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{chemistryLevel}</div>
                    <div className="text-xs text-gray-600">Chem</div>
                  </div>
                </ProgressRing>
                <p className="text-sm font-medium mt-2">Chemistry</p>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {Object.entries(skillTrees).map(([subject, tree]) => (
              <div key={subject} className="space-y-3">
                <h4 className={`text-lg font-bold bg-gradient-to-r ${tree.color} bg-clip-text text-transparent`}>
                  {tree.name}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {tree.skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      whileHover={{ scale: 1.05 }}
                      className={`skill-tree-node ${skill.level}`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{skill.icon}</div>
                        <div className="text-xs font-medium">{skill.name}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {selectedTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-3">
              {achievements?.slice(0, 9).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    w-20 h-20 rounded-xl flex flex-col items-center justify-center text-xs font-bold border-2
                    ${achievement.earned
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 text-white achievement-glow'
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                    }
                  `}
                >
                  <div className="text-lg mb-1">{achievement.icon}</div>
                  <div className="text-center leading-tight">
                    {achievement.name.split(' ').slice(0, 2).map((word, i) => (
                      <div key={i}>{word}</div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterProgression;
