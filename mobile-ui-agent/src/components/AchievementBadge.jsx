import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementBadge = ({
  achievement,
  size = 'medium',
  showAnimation = false,
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    small: 'w-12 h-12 text-xl',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-20 h-20 text-3xl'
  };

  const getBadgeStyle = () => {
    if (achievement.earned) {
      return {
        bg: `bg-gradient-to-br ${achievement.color || 'from-yellow-400 to-orange-500'}`,
        border: 'border-yellow-300',
        shadow: 'shadow-lg shadow-yellow-500/25',
        text: 'text-white'
      };
    } else {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        shadow: 'shadow-md',
        text: 'text-gray-400'
      };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="relative">
      <motion.button
        onClick={onClick}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onTap={() => setShowTooltip(!showTooltip)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={showAnimation ? { scale: 0, rotate: -180 } : { scale: 1 }}
        animate={showAnimation ? { scale: 1, rotate: 0 } : {}}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10
        }}
        className={`
          ${sizeClasses[size]}
          ${style.bg}
          ${style.border}
          ${style.shadow}
          ${style.text}
          border-2 rounded-2xl flex flex-col items-center justify-center
          font-bold transition-all duration-200 relative overflow-hidden
        `}
      >
        {/* Sparkle animation for earned badges */}
        {achievement.earned && showAnimation && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: 3,
                  delay: 0.5 + i * 0.1,
                }}
              />
            ))}
          </>
        )}

        {/* Badge Icon */}
        <div className={`${size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'} mb-1`}>
          {achievement.icon}
        </div>

        {/* Badge Name (for larger sizes) */}
        {size !== 'small' && (
          <div className={`text-xs font-bold text-center leading-tight px-1 ${
            size === 'large' ? 'text-sm' : 'text-xs'
          }`}>
            {achievement.name.split(' ').map((word, i) => (
              <div key={i}>{word}</div>
            ))}
          </div>
        )}

        {/* Progress indicator for unearned badges */}
        {!achievement.earned && achievement.progress !== undefined && (
          <div className="absolute bottom-1 left-1 right-1">
            <div className="w-full bg-gray-300 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Rarity indicator */}
        {achievement.rarity && achievement.earned && (
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center ${
            achievement.rarity === 'legendary' ? 'bg-purple-500' :
            achievement.rarity === 'epic' ? 'bg-blue-500' :
            achievement.rarity === 'rare' ? 'bg-green-500' : 'bg-gray-500'
          } text-white`}>
            {achievement.rarity === 'legendary' ? '' : achievement.rarity === 'epic' ? '' : ''}
          </div>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg max-w-40">
              <div className="font-bold text-center">{achievement.name}</div>
              <div className="text-gray-300 text-center mt-1">
                {achievement.description}
              </div>
              {!achievement.earned && achievement.requirement && (
                <div className="text-blue-300 text-center mt-1 border-t border-gray-700 pt-1">
                  {achievement.requirement}
                </div>
              )}
              {achievement.earnedDate && (
                <div className="text-yellow-300 text-center mt-1 text-xs">
                  Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                </div>
              )}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementBadge;
