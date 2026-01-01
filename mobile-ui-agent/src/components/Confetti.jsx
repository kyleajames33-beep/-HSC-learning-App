import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti = ({ show, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Auto-complete after animation
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
              }}
              initial={{
                y: -20,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 50,
                opacity: 0,
                rotate: particle.rotation,
              }}
              transition={{
                duration: 2.5,
                delay: particle.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;