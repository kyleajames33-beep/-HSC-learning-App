import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamificationContext } from '../context/GamificationContext'

/**
 * InteractiveReadingSection - Transform boring text into engaging, gamified reading
 * Features: Reading speed challenges, word highlighting, comprehension pop-ups, reading streaks
 */
const InteractiveReadingSection = ({ content, onComplete, title, dotpointId }) => {
  const { addXP } = useGamificationContext()
  const readingRef = useRef(null)
  
  // Reading gamification state
  const [readingStartTime, setReadingStartTime] = useState(null)
  const [wordsRead, setWordsRead] = useState(0)
  const [readingSpeed, setReadingSpeed] = useState(0) // WPM
  const [highlightedWords, setHighlightedWords] = useState(new Set())
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [comprehensionQuestions, setComprehensionQuestions] = useState([])
  const [showSpeedChallenge, setShowSpeedChallenge] = useState(false)
  const [readingStreak, setReadingStreak] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showWordDefinition, setShowWordDefinition] = useState(null)
  const [readingBadges, setReadingBadges] = useState([])

  // Break content into paragraphs and words
  const paragraphs = content?.split('\n\n').filter(p => p.trim()) || []
  const totalWords = paragraphs.join(' ').split(' ').filter(w => w.trim()).length

  useEffect(() => {
    setReadingStartTime(Date.now())
  }, [])

  // Calculate reading speed and progress
  useEffect(() => {
    if (readingStartTime && wordsRead > 0) {
      const timeElapsed = (Date.now() - readingStartTime) / 1000 / 60 // minutes
      const wpm = Math.round(wordsRead / timeElapsed)
      setReadingSpeed(wpm)
      setReadingProgress((wordsRead / totalWords) * 100)
    }
  }, [wordsRead, readingStartTime, totalWords])

  // Simulated comprehension questions based on content
  const generateComprehensionQuestion = (paragraph) => {
    const questions = [
      "What is the main concept discussed in this paragraph?",
      "How does this connect to what you learned previously?",
      "Can you identify the key scientific term mentioned?",
      "What would happen if this process was disrupted?",
      "How might this apply in a real-world scenario?"
    ]
    return questions[Math.floor(Math.random() * questions.length)]
  }

  // Track word reading progress
  const handleWordClick = async (word, index) => {
    if (!highlightedWords.has(index)) {
      setHighlightedWords(prev => new Set([...prev, index]))
      setWordsRead(prev => prev + 1)
      
      // Award micro-XP for active reading
      if (Math.random() < 0.1) { // 10% chance
        await addXP(1, 'Active reading')
      }
      
      // Show word definition for scientific terms
      if (isScientificTerm(word)) {
        setShowWordDefinition({ word, index })
      }
    }
  }

  const isScientificTerm = (word) => {
    const scientificTerms = [
      'photosynthesis', 'mitochondria', 'chromosome', 'enzyme', 'protein',
      'carbohydrate', 'membrane', 'nucleus', 'cytoplasm', 'ribosome'
    ]
    return scientificTerms.some(term => 
      word.toLowerCase().includes(term.toLowerCase())
    )
  }

  const completeReadingChallenge = async (type, bonus = 0) => {
    let xp = 15 + bonus
    let badgeText = ''
    
    switch (type) {
      case 'speed':
        badgeText = `Speed Reader: ${readingSpeed} WPM`
        xp += readingSpeed > 200 ? 20 : readingSpeed > 150 ? 10 : 5
        break
      case 'comprehension':
        badgeText = 'Comprehension Master'
        break
      case 'focus':
        badgeText = 'Laser Focus'
        xp += 25
        break
      default:
        badgeText = 'Reading Complete'
    }
    
    await addXP(xp, badgeText)
    setReadingBadges(prev => [...prev, { type, text: badgeText, xp }])
    setReadingStreak(prev => prev + 1)
  }

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
    if (!focusMode) {
      // Entering focus mode
      setTimeout(() => {
        completeReadingChallenge('focus')
      }, 30000) // Award after 30 seconds of focus
    }
  }

  const SpeedChallengePopup = () => (
    <AnimatePresence mode="wait">
      {showSpeedChallenge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 shadow-xl z-50 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-bold">Speed Reading Challenge!</h3>
              <p className="text-sm text-orange-100">Read the next paragraph in under 30 seconds for bonus XP!</p>
              <button
                onClick={() => setShowSpeedChallenge(false)}
                className="mt-2 px-3 py-1 bg-yellow-400 text-orange-800 rounded-lg text-sm font-bold"
              >
                Let's Go! ⚡
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const ReadingStats = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 z-50"
    >
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl text-blue-500">📖</div>
          <div className="font-bold text-gray-700">{Math.round(readingProgress)}%</div>
          <div className="text-xs text-gray-500">Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-green-500">⚡</div>
          <div className="font-bold text-gray-700">{readingSpeed}</div>
          <div className="text-xs text-gray-500">WPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-purple-500">🎯</div>
          <div className="font-bold text-gray-700">{wordsRead}</div>
          <div className="text-xs text-gray-500">Words</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-orange-500">🔥</div>
          <div className="font-bold text-gray-700">{readingStreak}</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
      </div>
    </motion.div>
  )

  const WordDefinitionPopup = () => (
    <AnimatePresence>
      {showWordDefinition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowWordDefinition(null)}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📚</span>
              <h3 className="text-xl font-bold text-gray-900">
                {showWordDefinition.word}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              Scientific term detected! This word is important for understanding the concept.
            </p>
            <button
              onClick={() => setShowWordDefinition(null)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition"
            >
              Got it! +2 XP
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const ComprehensionCheck = ({ question, onAnswer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 my-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤔</span>
        <div className="flex-1">
          <h4 className="font-bold text-blue-900 mb-2">Quick Comprehension Check</h4>
          <p className="text-blue-800 mb-3">{question}</p>
          <button
            onClick={() => {
              onAnswer()
              completeReadingChallenge('comprehension', 10)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
          >
            I understand! ✓
          </button>
        </div>
      </div>
    </motion.div>
  )

  const InteractiveParagraph = ({ paragraph, index }) => {
    const words = paragraph.split(' ')
    const [showComprehension, setShowComprehension] = useState(false)
    
    useEffect(() => {
      // Show comprehension check after reading paragraph
      if (currentParagraph === index && wordsRead > 0) {
        const timer = setTimeout(() => {
          setShowComprehension(true)
        }, 3000) // 3 seconds after starting paragraph
        return () => clearTimeout(timer)
      }
    }, [currentParagraph, index, wordsRead])

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`mb-6 p-6 rounded-xl transition-all duration-500 ${
          currentParagraph === index
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg'
            : 'bg-gray-50 border border-gray-200'
        } ${focusMode && currentParagraph !== index ? 'opacity-30 blur-sm' : ''}`}
      >
        <motion.p 
          className="text-lg leading-relaxed text-gray-800"
          style={{ lineHeight: '1.8' }}
        >
          {words.map((word, wordIndex) => {
            const globalWordIndex = index * 1000 + wordIndex // Unique word ID
            const isHighlighted = highlightedWords.has(globalWordIndex)
            const isScientific = isScientificTerm(word)
            
            return (
              <motion.span
                key={wordIndex}
                onClick={() => handleWordClick(word, globalWordIndex)}
                className={`cursor-pointer transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-yellow-200 text-yellow-900 font-semibold'
                    : 'hover:bg-yellow-100'
                } ${isScientific ? 'text-blue-600 font-semibold underline decoration-dotted' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {word}{' '}
              </motion.span>
            )
          })}
        </motion.p>
        
        {showComprehension && currentParagraph === index && (
          <ComprehensionCheck
            question={generateComprehensionQuestion(paragraph)}
            onAnswer={() => {
              setShowComprehension(false)
              setCurrentParagraph(index + 1)
            }}
          />
        )}
      </motion.div>
    )
  }

  const ReadingControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 z-50"
    >
      <div className="flex gap-2">
        <motion.button
          onClick={toggleFocusMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            focusMode 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {focusMode ? '🎯 Focus ON' : '🎯 Focus Mode'}
        </motion.button>
        
        <motion.button
          onClick={() => setShowSpeedChallenge(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition"
        >
          ⚡ Speed Challenge
        </motion.button>
      </div>
    </motion.div>
  )

  const ProgressBar = () => (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="h-1 bg-gray-200">
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <ProgressBar />
      <ReadingStats />
      <SpeedChallengePopup />
      <WordDefinitionPopup />
      <ReadingControls />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200 p-6 mb-8"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>📖 {totalWords} words</span>
            <span>⏱️ Est. {Math.ceil(totalWords / 200)} min read</span>
            <span>🎯 {Math.round(readingProgress)}% complete</span>
          </div>
        </div>
      </motion.div>

      {/* Interactive Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          ref={readingRef}
          className="space-y-6"
        >
          {paragraphs.map((paragraph, index) => (
            <InteractiveParagraph
              key={index}
              paragraph={paragraph}
              index={index}
            />
          ))}
        </motion.div>

        {/* Reading Badges */}
        <AnimatePresence>
          {readingBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 100 }}
              className="fixed right-4 top-20 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4 shadow-xl z-50 mb-2"
              style={{ top: `${120 + index * 80}px` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="font-bold">{badge.text}</div>
                  <div className="text-sm text-green-100">+{badge.xp} XP</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Completion */}
        {readingProgress >= 95 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-8 shadow-xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">Reading Complete!</h2>
              <p className="text-green-100 mb-4">
                You read {wordsRead} words at {readingSpeed} WPM
              </p>
              <button
                onClick={() => {
                  completeReadingChallenge('completion', 25)
                  onComplete?.()
                }}
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
              >
                Claim Rewards! 🏆
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InteractiveReadingSection