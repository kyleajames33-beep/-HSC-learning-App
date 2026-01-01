import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';

const XPDisplay = ({
  currentXP,
  xpGained,
  currentLevel,
  xpToNextLevel,
  onLevelUp,
  animated = true
}) => {
  const [displayXP, setDisplayXP] = useState(currentXP - xpGained);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [animationStep, setAnimationStep] = useState(0); // 0: initial, 1: xp gain, 2: level up

  const previousLevel = currentLevel - (currentXP >= xpToNextLevel ? 1 : 0);
  const hasLeveledUp = currentLevel > previousLevel;

  useEffect(() => {
    if (!animated) {
      setDisplayXP(currentXP);
      return;
    }

    // Step 1: Animate XP gain
    setTimeout(() => {
      setAnimationStep(1);
      let startXP = currentXP - xpGained;
      const duration = 1500;
      const steps = 60;
      const increment = xpGained / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        startXP += increment;
        setDisplayXP(Math.min(Math.round(startXP), currentXP));

        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayXP(currentXP);

          // Step 2: Check for level up
          if (hasLeveledUp) {
            setTimeout(() => {
              setAnimationStep(2);
              setShowLevelUp(true);
              if (onLevelUp) onLevelUp();
            }, 500);
          }
        }
      }, duration / steps);
    }, 500);
  }, [currentXP, xpGained, animated, hasLeveledUp, onLevelUp]);

  const progress = ((currentXP % xpToNextLevel) / xpToNextLevel) * 100;

  return (
    <div className="relative">
      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLevelUp(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sparkle effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 text-white"
                  style={{
                    left: `${20 + (i % 4) * 20}%`,
                    top: `${20 + Math.floor(i / 4) * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  
                </motion.div>
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-6xl mb-4"
              >
                
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-white mb-2"
              >
                LEVEL UP!
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-6xl font-bold text-white mb-2"
              >
                {currentLevel}
              </motion.div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-white/90 text-lg mb-6"
              >
                You&apos;re getting stronger! 
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLevelUp(false)}
                className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
              >
                Awesome! 
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">Lv</span>
            </div>
            <div>
              <div className="text-lg font-bold">Level {currentLevel}</div>
              <div className="text-xs text-white/80">HSC Scholar</div>
            </div>
          </div>

          {/* XP Gained Animation */}
          <AnimatePresence>
            {xpGained > 0 && animationStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold"
              >
                +{xpGained} XP
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/80">
            <span>Experience</span>
            <span>{displayXP.toLocaleString()} XP</span>
          </div>

          <ProgressBar
            progress={progress}
            height={12}
            color="#fbbf24"
            backgroundColor="rgba(255,255,255,0.2)"
            showPercentage={false}
            className="mb-2"
          />

          <div className="flex justify-between text-xs text-white/60">
            <span>{(currentXP % xpToNextLevel).toLocaleString()} / {xpToNextLevel.toLocaleString()}</span>
            <span>{xpToNextLevel - (currentXP % xpToNextLevel)} to next level</span>
          </div>
        </div>

        {/* Level Benefits Preview */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-3 border-t border-white/20"
        >
          <div className="text-xs text-white/80 text-center">
            Next Level Unlock: {getNextLevelBenefit(currentLevel + 1)}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

function getNextLevelBenefit(level) {
  const benefits = {
    5: " Quiz Streak Tracker",
    10: " Advanced Analytics",
    15: " Speed Bonus Rewards",
    20: " Master Badge Collection",
    25: " Custom Study Plans",
    30: " HSC Legend Status",
  };

  // Find the next benefit level
  const nextBenefitLevel = Object.keys(benefits)
    .map(Number)
    .find(l => l >= level);

  return nextBenefitLevel ? benefits[nextBenefitLevel] : " Ultimate HSC Master";
}

export default XPDisplay;
