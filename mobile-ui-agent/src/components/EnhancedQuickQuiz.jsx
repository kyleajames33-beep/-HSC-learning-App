import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getQuickQuizQuestions } from '../services/questionService'

/**
 * EnhancedQuickQuiz - Gamified, addictive quiz experience
 * Features: streak tracking, time pressure, answer feedback, XP rewards, celebrations
 */
const EnhancedQuickQuiz = ({ dotpointId, subjectColor = 'blue', onQuizComplete, onExit }) => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(15)
  const [totalXP, setTotalXP] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [speedBonus, setSpeedBonus] = useState(0)
  const [perfectStreak, setPerfectStreak] = useState(false)
  const [comboMultiplier, setComboMultiplier] = useState(1)

  // Color schemes
  const colorSchemes = {
    green: {
      primary: 'green',
      gradient: 'from-green-500 to-emerald-500',
      correct: 'bg-green-500',
      incorrect: 'bg-red-500',
      streakBg: 'bg-green-100',
      streakText: 'text-green-700',
      xpGradient: 'from-green-400 to-emerald-400',
      timerGlow: 'shadow-green-500/50',
    },
    blue: {
      primary: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      correct: 'bg-blue-500',
      incorrect: 'bg-red-500',
      streakBg: 'bg-blue-100',
      streakText: 'text-blue-700',
      xpGradient: 'from-blue-400 to-cyan-400',
      timerGlow: 'shadow-blue-500/50',
    },
  }

  const colors = colorSchemes[subjectColor] || colorSchemes.blue

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await getQuickQuizQuestions('biology', 5, dotpointId)
        if (data && data.length > 0) {
          setQuestions(data)
          setQuestionStartTime(Date.now())
        }
      } catch (error) {
        console.error('Failed to load quiz questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [dotpointId])

  // Timer countdown with visual effects
  useEffect(() => {
    if (!showResult && timeLeft > 0 && !answerFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !answerFeedback) {
      handleTimeUp()
    }
  }, [timeLeft, showResult, answerFeedback])

  const handleTimeUp = () => {
    setAnswerFeedback({
      isCorrect: false,
      message: "⏰ Time's up! Speed is key to mastery!",
      xpGained: 1,
      motivational: "Don't worry - every expert was once a beginner!"
    })
    setStreak(0)
    setComboMultiplier(1)
    setTimeout(() => {
      nextQuestion()
    }, 2500)
  }

  const calculateXP = (isCorrect, timeSpent) => {
    let baseXP = isCorrect ? 15 : 3
    let streakMultiplier = Math.min(streak * 0.3, 3) // Max 3x multiplier
    let speedBonusXP = 0
    let comboBonus = 0
    
    if (isCorrect && timeSpent < 8) {
      speedBonusXP = Math.floor((8 - timeSpent) * 3)
      setSpeedBonus(speedBonusXP)
    }
    
    // Combo multiplier for consecutive quick answers
    if (isCorrect && timeSpent < 6) {
      setComboMultiplier(prev => Math.min(prev + 0.5, 5))
      comboBonus = Math.floor(baseXP * (comboMultiplier - 1))
    }
    
    return Math.floor((baseXP * (1 + streakMultiplier) + speedBonusXP + comboBonus))
  }

  const getMotivationalMessage = (isCorrect, streak, timeSpent) => {
    if (isCorrect) {
      if (timeSpent < 5) return "⚡ Lightning fast! You're on fire!"
      if (streak >= 5) return "🔥 Unstoppable! You're in the zone!"
      if (streak >= 3) return "💪 Great momentum! Keep it up!"
      return "✨ Correct! You're learning fast!"
    } else {
      const encouragements = [
        "💭 Every mistake is a step toward mastery!",
        "🎯 Close! Your brain is making connections!",
        "🚀 Learning is a journey - you're progressing!",
        "💡 Great attempt! Knowledge is building!"
      ]
      return encouragements[Math.floor(Math.random() * encouragements.length)]
    }
  }

  const handleAnswerSelect = (answerIndex) => {
    if (answerFeedback) return

    const timeSpent = (Date.now() - questionStartTime) / 1000
    const currentQuestion = questions[currentQuestionIndex]
    const selectedOption = currentQuestion.options[answerIndex]
    const isCorrect = selectedOption?.text === currentQuestion.correctAnswer || selectedOption === currentQuestion.correctAnswer

    setSelectedAnswer(answerIndex)

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
      setMaxStreak(Math.max(maxStreak, streak + 1))
      
      // Trigger celebrations for achievements
      if (streak + 1 >= 5) {
        setShowCelebration('master')
        setPerfectStreak(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else if (streak + 1 >= 3) {
        setShowCelebration('streak')
        setTimeout(() => setShowCelebration(false), 2000)
      }
    } else {
      setStreak(0)
      setSpeedBonus(0)
      setComboMultiplier(1)
      setPerfectStreak(false)
    }

    const xpGained = calculateXP(isCorrect, timeSpent)
    setTotalXP(totalXP + xpGained)

    setAnswerFeedback({
      isCorrect,
      message: getMotivationalMessage(isCorrect, streak, timeSpent),
      xpGained,
      speedBonus: isCorrect ? speedBonus : 0,
      comboBonus: isCorrect && comboMultiplier > 1 ? Math.floor(15 * (comboMultiplier - 1)) : 0,
      correctAnswer: currentQuestion.correctAnswer
    })

    setTimeout(() => {
      nextQuestion()
    }, 3000)
  }

  const nextQuestion = () => {
    setAnswerFeedback(null)
    setSelectedAnswer(null)
    setSpeedBonus(0)
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(15)
      setQuestionStartTime(Date.now())
    } else {
      setShowResult(true)
      onQuizComplete?.({
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        maxStreak,
        totalXP,
        perfectStreak: score === questions.length
      })
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTimeLeft(15)
    setTotalXP(0)
    setAnswerFeedback(null)
    setComboMultiplier(1)
    setPerfectStreak(false)
    setQuestionStartTime(Date.now())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${colors.primary}-200 border-t-${colors.primary}-500 rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-gray-600 font-medium">Preparing your challenge...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-6xl mb-4">🎯</div>
        <p className="text-gray-500 font-medium">No quiz questions available for this dotpoint.</p>
        <p className="text-sm text-gray-400 mt-1">Content coming soon!</p>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    const isPerfect = score === questions.length
    const isExcellent = percentage >= 80
    const isGood = percentage >= 65

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl border border-gray-200 p-8 text-center relative overflow-hidden"
      >
        {/* Confetti background for perfect scores */}
        {isPerfect && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 opacity-50" />
        )}
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl ${
              isPerfect ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
              isExcellent ? `bg-gradient-to-br ${colors.xpGradient}` :
              isGood ? 'bg-gradient-to-br from-green-400 to-green-500' :
              'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}
          >
            {isPerfect ? '🏆' : isExcellent ? '⭐' : isGood ? '✓' : '📚'}
          </motion.div>
          
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {isPerfect ? 'PERFECT!' : isExcellent ? 'Excellent!' : isGood ? 'Well Done!' : 'Keep Learning!'}
          </motion.h3>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            {isPerfect ? 'Flawless performance! You\'ve mastered this topic!' :
             isExcellent ? 'Outstanding work! You\'re really getting it!' :
             isGood ? 'Great job! You\'re on the right track!' :
             'Every attempt makes you stronger!'}
          </motion.p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-gray-900">{score}/{questions.length}</p>
              <p className="text-xs text-gray-500">{percentage}%</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className={`${colors.streakBg} rounded-lg p-4`}
            >
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className={`text-2xl font-bold ${colors.streakText}`}>{maxStreak}</p>
              <p className="text-xs text-gray-500">in a row</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-yellow-50 rounded-lg p-4"
            >
              <p className="text-sm text-gray-600">XP Earned</p>
              <p className="text-2xl font-bold text-yellow-700">{totalXP}</p>
              <p className="text-xs text-gray-500">points</p>
            </motion.div>
          </div>

          {maxStreak >= 5 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 mb-6"
            >
              <div className="text-2xl mb-1">🎯</div>
              <p className="font-bold">Streak Master Achievement!</p>
              <p className="text-sm opacity-90">5+ correct answers in a row</p>
            </motion.div>
          )}

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={resetQuiz}
            className={`bg-gradient-to-r ${colors.gradient} text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition shadow-lg mr-4`}
          >
            Try Again
          </motion.button>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            onClick={onExit}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Continue Learning
          </motion.button>
        </div>
      </motion.div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const timerProgress = (timeLeft / 15) * 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
      {/* Celebration Overlays */}
      <AnimatePresence>
        {showCelebration === 'streak' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-red-500/90 flex items-center justify-center z-50 rounded-xl"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="text-8xl mb-4"
              >
                🔥
              </motion.div>
              <h3 className="text-3xl font-bold mb-2">STREAK!</h3>
              <p className="text-xl">{streak} in a row!</p>
            </div>
          </motion.div>
        )}
        
        {showCelebration === 'master' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90 flex items-center justify-center z-50 rounded-xl"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2 }}
                className="text-8xl mb-4"
              >
                👑
              </motion.div>
              <h3 className="text-4xl font-bold mb-2">MASTER!</h3>
              <p className="text-xl">5+ perfect answers!</p>
              <p className="text-lg opacity-90">You're unstoppable!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg ${timeLeft <= 5 ? colors.timerGlow + ' shadow-lg' : ''}`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Challenge Mode</h2>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Enhanced Timer */}
            <div className={`relative flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 
              timeLeft <= 10 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-lg">{timeLeft}s</span>
              <div className={`absolute -bottom-1 left-0 h-1 bg-current rounded-full transition-all duration-1000`} 
                   style={{ width: `${timerProgress}%` }} />
            </div>
            
            {/* Enhanced Streak Display */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.streakBg} ${colors.streakText} border-2 border-current`}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-xl"
                >
                  🔥
                </motion.span>
                <span className="font-bold text-lg">{streak}</span>
              </motion.div>
            )}
            
            {/* Combo Multiplier */}
            {comboMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-purple-100 text-purple-700 border-2 border-purple-300"
              >
                <span className="text-lg">⚡</span>
                <span className="font-bold">{comboMultiplier.toFixed(1)}x</span>
              </motion.div>
            )}
            
            {/* XP Display */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
              <span className="text-lg">⭐</span>
              <span className="font-bold text-lg">{totalXP}</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`bg-gradient-to-r ${colors.gradient} h-3 rounded-full relative`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Question */}
      <div className="p-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const optionText = option?.text || option
              const isSelected = selectedAnswer === index
              const isCorrect = optionText === currentQuestion.correctAnswer
              
              let buttonStyle = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              
              if (answerFeedback) {
                if (isCorrect) {
                  buttonStyle = `${colors.correct} text-white border-green-500 shadow-lg`
                } else if (isSelected && !isCorrect) {
                  buttonStyle = `${colors.incorrect} text-white border-red-500 shadow-lg`
                }
              } else if (isSelected) {
                buttonStyle = `bg-gradient-to-r ${colors.gradient} text-white border-transparent shadow-lg transform scale-105`
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={answerFeedback !== null}
                  className={`w-full p-5 rounded-xl text-left font-medium transition-all duration-200 ${buttonStyle}`}
                  whileHover={answerFeedback ? {} : { scale: 1.02 }}
                  whileTap={answerFeedback ? {} : { scale: 0.98 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-opacity-20 bg-current flex items-center justify-center text-lg font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg">{optionText}</span>
                    {answerFeedback && isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-2xl"
                      >
                        ✅
                      </motion.span>
                    )}
                    {answerFeedback && isSelected && !isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-2xl"
                      >
                        ❌
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Enhanced Answer Feedback */}
        <AnimatePresence>
          {answerFeedback && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.9 }}
              className={`p-6 rounded-xl border-2 ${
                answerFeedback.isCorrect 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
              }`}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl mb-3"
                >
                  {answerFeedback.isCorrect ? '🎉' : '💪'}
                </motion.div>
                
                <p className="text-xl font-bold mb-3 text-gray-800">
                  {answerFeedback.message}
                </p>
                
                {!answerFeedback.isCorrect && (
                  <p className="text-lg text-gray-700 mb-4">
                    The correct answer is: <span className="font-semibold text-green-700">{answerFeedback.correctAnswer}</span>
                  </p>
                )}
                
                <div className="flex justify-center gap-6 text-lg font-semibold">
                  <span className="text-blue-600">XP: +{answerFeedback.xpGained}</span>
                  {answerFeedback.speedBonus > 0 && (
                    <span className="text-yellow-600">⚡ Speed: +{answerFeedback.speedBonus}</span>
                  )}
                  {answerFeedback.comboBonus > 0 && (
                    <span className="text-purple-600">🔥 Combo: +{answerFeedback.comboBonus}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EnhancedQuickQuiz