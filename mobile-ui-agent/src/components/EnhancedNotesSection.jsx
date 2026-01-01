import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamificationContext } from '../context/GamificationContext'

/**
 * EnhancedNotesSection - Highly engaging, interactive notes with gamification
 * Features: Progress tracking, reading challenges, streak counters, interactive highlights
 */
const EnhancedNotesSection = ({ notes, dotpointId, subjectColor = 'blue' }) => {
  const { addXP } = useGamificationContext()
  
  // State for gamification features
  const [expandedSections, setExpandedSections] = useState({
    keyPoints: true,
    mnemonics: false,
    examTips: false,
    commonMistakes: false,
  })
  
  const [readingProgress, setReadingProgress] = useState({})
  const [highlightedPoints, setHighlightedPoints] = useState(new Set())
  const [readingStreak, setReadingStreak] = useState(0)
  const [studyTime, setStudyTime] = useState(0)
  const [showChallenge, setShowChallenge] = useState(false)
  const [challengeType, setChallengeType] = useState(null)
  const [completedChallenges, setCompletedChallenges] = useState(new Set())
  
  // Timer for study time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Color schemes with enhanced gradients
  const colorSchemes = {
    green: {
      primary: 'green',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badgeBg: 'bg-gradient-to-r from-green-100 to-emerald-100',
      badgeText: 'text-green-700',
      iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
      iconText: 'text-green-600',
      glow: 'shadow-green-200',
    },
    blue: {
      primary: 'blue',
      gradient: 'from-blue-500 via-cyan-500 to-indigo-500',
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badgeBg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      badgeText: 'text-blue-700',
      iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      iconText: 'text-blue-600',
      glow: 'shadow-blue-200',
    },
  }

  const colors = colorSchemes[subjectColor] || colorSchemes.blue

  // Reading challenges
  const challenges = [
    {
      id: 'speed-reader',
      title: 'Speed Reader',
      description: 'Read all key points in under 2 minutes',
      xp: 25,
      icon: '⚡',
      type: 'timed'
    },
    {
      id: 'highlight-master',
      title: 'Highlight Master',
      description: 'Highlight 5 important concepts',
      xp: 20,
      icon: '🖍️',
      type: 'interaction'
    },
    {
      id: 'memory-palace',
      title: 'Memory Palace',
      description: 'Create visual connections between concepts',
      xp: 30,
      icon: '🏰',
      type: 'creative'
    }
  ]

  const toggleSection = async (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
    
    // Track reading progress and award micro-XP
    if (!readingProgress[section]) {
      setReadingProgress(prev => ({ ...prev, [section]: true }))
      await addXP(5, `Explored ${section}`)
      
      // Trigger random challenge
      if (Math.random() < 0.3 && !showChallenge) {
        triggerRandomChallenge()
      }
    }
  }

  const triggerRandomChallenge = () => {
    const availableChallenges = challenges.filter(c => !completedChallenges.has(c.id))
    if (availableChallenges.length > 0) {
      const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)]
      setChallengeType(randomChallenge)
      setShowChallenge(true)
    }
  }

  const completeChallenge = async (challenge) => {
    setCompletedChallenges(prev => new Set([...prev, challenge.id]))
    setShowChallenge(false)
    setChallengeType(null)
    await addXP(challenge.xp, `Challenge: ${challenge.title}`)
    setReadingStreak(prev => prev + 1)
  }

  const highlightPoint = async (index, section) => {
    const pointId = `${section}-${index}`
    if (!highlightedPoints.has(pointId)) {
      setHighlightedPoints(prev => new Set([...prev, pointId]))
      await addXP(3, 'Highlighted key concept')
      
      // Check if highlight challenge is active
      if (challengeType?.id === 'highlight-master' && highlightedPoints.size >= 4) {
        completeChallenge(challengeType)
      }
    }
  }

  const formatStudyTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!notes) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300"
        />
        <p className="text-gray-500">Notes for this dotpoint are being prepared.</p>
        <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
      </div>
    )
  }

  const StudyTimeTracker = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200 z-50"
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xl">⏰</span>
        <span className="font-mono font-bold text-gray-700">{formatStudyTime(studyTime)}</span>
        {readingStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 ml-2"
          >
            <span className="text-orange-500">🔥</span>
            <span className="font-bold text-orange-600">{readingStreak}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )

  const ChallengePopup = () => (
    <AnimatePresence mode="wait">
      {showChallenge && challengeType && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 shadow-xl z-50 max-w-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{challengeType.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{challengeType.title}</h3>
              <p className="text-sm text-purple-100 mb-3">{challengeType.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-300 font-bold">+{challengeType.xp} XP</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChallenge(false)}
                    className="px-3 py-1 bg-white/20 rounded-lg text-sm"
                  >
                    Later
                  </button>
                  <button
                    onClick={() => completeChallenge(challengeType)}
                    className="px-3 py-1 bg-yellow-400 text-purple-800 rounded-lg text-sm font-bold"
                  >
                    Accept!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const EnhancedSectionHeader = ({ icon, title, section, count }) => (
    <motion.button
      onClick={() => toggleSection(section)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center justify-between p-4 hover:${colors.bg} transition rounded-lg group relative overflow-hidden`}
    >
      {/* Animated background on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
        initial={false}
        animate={{ x: expandedSections[section] ? 0 : "-100%" }}
      />
      
      <div className="flex items-center gap-3 relative z-10">
        <motion.div
          className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconText} shadow-lg ${colors.glow}`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
        <div className="text-left">
          <h3 className="font-bold text-gray-900">{title}</h3>
          {count && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">{count} items</p>
              {readingProgress[section] && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500 text-xs"
                >
                  ✅ Read
                </motion.span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <motion.svg
        className={`w-6 h-6 text-gray-400`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ rotate: expandedSections[section] ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </motion.svg>
    </motion.button>
  )

  return (
    <div className="space-y-6 relative">
      <StudyTimeTracker />
      <ChallengePopup />

      {/* Enhanced Header with Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-gradient-to-br ${colors.bg} p-6 border ${colors.border} shadow-lg ${colors.glow}/20`}
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-xl`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Interactive Study Notes</h2>
            <p className="text-gray-600">{dotpointId} Deep Dive</p>
            
            {/* Progress indicators */}
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-green-500">📖</span>
                <span className="text-sm font-bold text-green-600">
                  {Object.values(readingProgress).filter(Boolean).length}/4 sections explored
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">🎯</span>
                <span className="text-sm font-bold text-purple-600">
                  {completedChallenges.size} challenges completed
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {notes.summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-inner"
          >
            <p className="text-gray-700 leading-relaxed">{notes.summary}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Key Points with Interactive Highlighting */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
      >
        <EnhancedSectionHeader
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          title="Key Concepts"
          section="keyPoints"
          count={notes.keyPoints?.length}
        />
        <AnimatePresence>
          {expandedSections.keyPoints && notes.keyPoints && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 space-y-4">
                {notes.keyPoints.map((point, index) => {
                  const pointId = `keyPoints-${index}`
                  const isHighlighted = highlightedPoints.has(pointId)
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => highlightPoint(index, 'keyPoints')}
                      className={`group cursor-pointer transition-all duration-300 ${
                        isHighlighted ? 'bg-yellow-100 border-yellow-300' : 'hover:bg-gray-50'
                      } rounded-xl p-4 border-2 ${isHighlighted ? 'border-yellow-300' : 'border-transparent'}`}
                    >
                      <div className="flex gap-4">
                        <motion.div 
                          className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.badgeBg} ${colors.badgeText} flex items-center justify-center text-lg font-bold shadow-lg`}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed font-medium">{point}</p>
                          {isHighlighted && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-2 flex items-center gap-2"
                            >
                              <span className="text-yellow-600">🖍️</span>
                              <span className="text-sm font-bold text-yellow-700">Highlighted!</span>
                              <span className="text-xs text-green-600">+3 XP</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                
                {/* Highlight challenge progress */}
                {challengeType?.id === 'highlight-master' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-100 border border-purple-300 rounded-xl p-4 mt-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-500">🎯</span>
                      <span className="font-bold text-purple-800">Challenge Active!</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-purple-200 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(highlightedPoints.size / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-purple-700">
                        {highlightedPoints.size}/5
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Mnemonics with Memory Palace */}
      {notes.mnemonics && notes.mnemonics.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg overflow-hidden"
        >
          <EnhancedSectionHeader
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Memory Palace & Mnemonics"
            section="mnemonics"
            count={notes.mnemonics.length}
          />
          <AnimatePresence>
            {expandedSections.mnemonics && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-4">
                  {notes.mnemonics.map((mnemonic, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <motion.span 
                          className="text-3xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          💡
                        </motion.span>
                        <p className="font-bold text-purple-900 text-lg">{mnemonic.phrase}</p>
                      </div>
                      <p className="text-purple-700 ml-12 leading-relaxed">{mnemonic.explanation}</p>
                      
                      {/* Interactive memory connection builder */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 ml-12 p-3 bg-white/50 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-purple-500">🧠</span>
                          <span className="text-purple-700 font-medium">Tip: Visualize this in your mind palace</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Additional sections would follow the same enhanced pattern... */}
      
    </div>
  )
}

export default EnhancedNotesSection