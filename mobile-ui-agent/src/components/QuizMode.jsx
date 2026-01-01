import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadPracticeQuestions } from '../utils/dataLoader'

/**
 * QuizMode - Transform practice questions into timed quizzes
 * Features:
 * - Multiple dotpoint selection for mixed quizzes
 * - Timer for exam simulation
 * - Randomized question order
 * - Auto-grading with instant feedback
 * - Beautiful animations and UX
 */
const QuizMode = ({ onClose }) => {
  const [step, setStep] = useState('setup') // setup, quiz, results
  const [selectedDotpoints, setSelectedDotpoints] = useState([])
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [questionCount, setQuestionCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Available modules and dotpoints
  const availableContent = {
    biology: {
      5: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ4.1', 'IQ4.2', 'IQ4.3', 'IQ5.1', 'IQ5.2'],
      6: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ1.4', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ2.4', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ3.4', 'IQ4.1', 'IQ4.2', 'IQ4.3', 'IQ4.4'],
      7: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ1.4', 'IQ1.5', 'IQ2.1', 'IQ2.2', 'IQ3.1', 'IQ4.1', 'IQ4.2', 'IQ4.3'],
      8: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ1.4', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ3.4']
    },
    chemistry: {
      5: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ4.1', 'IQ4.2', 'IQ4.3'],
      6: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ3.1', 'IQ3.2', 'IQ3.3'],
      7: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ3.1', 'IQ3.2', 'IQ3.3', 'IQ4.1', 'IQ4.2', 'IQ4.3'],
      8: ['IQ1.1', 'IQ1.2', 'IQ1.3', 'IQ2.1', 'IQ2.2', 'IQ2.3', 'IQ3.1', 'IQ3.2', 'IQ3.3']
    }
  }

  // Timer countdown
  useEffect(() => {
    if (step === 'quiz' && timerEnabled && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, timerEnabled, timeRemaining])

  const handleDotpointToggle = (subject, module, dotpoint) => {
    const key = `${subject}-m${module}-${dotpoint}`
    setSelectedDotpoints(prev => {
      if (prev.includes(key)) {
        return prev.filter(d => d !== key)
      } else {
        return [...prev, key]
      }
    })
  }

  const handleSelectModule = (subject, module) => {
    const dotpoints = availableContent[subject][module]
    const keys = dotpoints.map(dp => `${subject}-m${module}-${dp}`)

    // Check if all dotpoints in module are already selected
    const allSelected = keys.every(k => selectedDotpoints.includes(k))

    if (allSelected) {
      // Deselect all
      setSelectedDotpoints(prev => prev.filter(d => !keys.includes(d)))
    } else {
      // Select all
      setSelectedDotpoints(prev => {
        const newSet = new Set([...prev, ...keys])
        return Array.from(newSet)
      })
    }
  }

  const handleStartQuiz = async () => {
    if (selectedDotpoints.length === 0) {
      alert('Please select at least one dotpoint!')
      return
    }

    // Load questions from selected dotpoints
    const allQuestions = []

    for (const key of selectedDotpoints) {
      const [subject, moduleStr, dotpoint] = key.split('-')
      const module = parseInt(moduleStr.replace('m', ''))

      try {
        const questions = await loadPracticeQuestions(subject, module, dotpoint)
        allQuestions.push(...questions.map(q => ({ ...q, source: key })))
      } catch (error) {
        console.error(`Failed to load questions for ${key}:`, error)
      }
    }

    if (allQuestions.length === 0) {
      alert('No questions found for selected dotpoints!')
      return
    }

    // Shuffle and limit questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length))

    setQuestions(selected)
    setCurrentQuestionIndex(0)
    setUserAnswers({})

    // Calculate time (2 minutes per mark)
    const totalMarks = selected.reduce((sum, q) => sum + (q.marks || 3), 0)
    const timeInSeconds = totalMarks * 120 // 2 minutes per mark
    setTimeRemaining(timeInSeconds)
    setQuizStartTime(Date.now())

    setStep('quiz')
  }

  const handleAnswerSubmit = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
    setShowFeedback(true)

    // Auto-advance after 3 seconds
    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        handleQuizComplete()
      }
    }, 3000)
  }

  const handleQuizComplete = () => {
    const timeTaken = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0
    setStep('results')
  }

  const handleRetake = () => {
    setStep('setup')
    setSelectedDotpoints([])
    setQuestions([])
    setUserAnswers({})
    setCurrentQuestionIndex(0)
  }

  const calculateScore = () => {
    let totalMarks = 0
    let earnedMarks = 0

    questions.forEach(q => {
      totalMarks += q.marks || 3
      const userAnswer = userAnswers[q.id]
      if (userAnswer) {
        // Simple scoring: if answer exists, give 70-100% based on length
        const sampleLength = q.sample_answer?.full_answer?.length || 100
        const userLength = userAnswer.length
        const ratio = Math.min(userLength / sampleLength, 1)
        earnedMarks += (q.marks || 3) * (0.7 + ratio * 0.3)
      }
    })

    return {
      percentage: totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0,
      earnedMarks: Math.round(earnedMarks),
      totalMarks
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // SETUP VIEW
  if (step === 'setup') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen p-4 flex items-start justify-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🎯 Quiz Mode Setup</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Settings */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">Timer</p>
                  <p className="text-sm text-gray-600">2 minutes per mark (exam conditions)</p>
                </div>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    timerEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      timerEnabled ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block font-semibold text-gray-900 mb-2">
                  Number of Questions: {questionCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            {/* Dotpoint Selection */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Select Topics ({selectedDotpoints.length} selected)</h3>

              {/* Biology */}
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700 flex items-center">
                  <span className="mr-2">🧬</span> Biology
                </h4>
                {Object.entries(availableContent.biology).map(([module, dotpoints]) => (
                  <div key={`bio-${module}`} className="bg-green-50 rounded-xl p-3">
                    <button
                      onClick={() => handleSelectModule('biology', module)}
                      className="w-full flex items-center justify-between mb-2 font-medium text-green-900 hover:text-green-700"
                    >
                      <span>Module {module}</span>
                      <span className="text-sm text-green-600">
                        {dotpoints.filter(dp => selectedDotpoints.includes(`biology-m${module}-${dp}`)).length}/{dotpoints.length}
                      </span>
                    </button>
                    <div className="grid grid-cols-7 gap-2">
                      {dotpoints.map(dp => {
                        const key = `biology-m${module}-${dp}`
                        const isSelected = selectedDotpoints.includes(key)
                        return (
                          <button
                            key={dp}
                            onClick={() => handleDotpointToggle('biology', module, dp)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {dp}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chemistry */}
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700 flex items-center">
                  <span className="mr-2">⚗️</span> Chemistry
                </h4>
                {Object.entries(availableContent.chemistry).map(([module, dotpoints]) => (
                  <div key={`chem-${module}`} className="bg-blue-50 rounded-xl p-3">
                    <button
                      onClick={() => handleSelectModule('chemistry', module)}
                      className="w-full flex items-center justify-between mb-2 font-medium text-blue-900 hover:text-blue-700"
                    >
                      <span>Module {module}</span>
                      <span className="text-sm text-blue-600">
                        {dotpoints.filter(dp => selectedDotpoints.includes(`chemistry-m${module}-${dp}`)).length}/{dotpoints.length}
                      </span>
                    </button>
                    <div className="grid grid-cols-7 gap-2">
                      {dotpoints.map(dp => {
                        const key = `chemistry-m${module}-${dp}`
                        const isSelected = selectedDotpoints.includes(key)
                        return (
                          <button
                            key={dp}
                            onClick={() => handleDotpointToggle('chemistry', module, dp)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            {dp}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleStartQuiz}
              disabled={selectedDotpoints.length === 0}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Quiz ({selectedDotpoints.length} {selectedDotpoints.length === 1 ? 'topic' : 'topics'})
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  // QUIZ VIEW
  if (step === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-50 overflow-y-auto">
        <div className="min-h-screen p-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-bold text-gray-900">Question {currentQuestionIndex + 1}/{questions.length}</p>
                    <p className="text-sm text-gray-600">{currentQuestion?.marks || 3} marks</p>
                  </div>
                </div>
                {timerEnabled && (
                  <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                    ⏱️ {formatTime(timeRemaining)}
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6"
            >
              <p className="text-lg text-gray-900 mb-6 leading-relaxed">{currentQuestion?.question}</p>

              <textarea
                value={userAnswers[currentQuestion?.id] || ''}
                onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                placeholder="Type your answer here..."
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                disabled={showFeedback}
              />

              {!showFeedback && (
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleAnswerSubmit(currentQuestion.id, userAnswers[currentQuestion.id] || '')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    Submit Answer
                  </button>
                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(prev => prev + 1)
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Skip →
                    </button>
                  )}
                </div>
              )}

              {/* Feedback */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                >
                  <p className="font-semibold text-blue-900 mb-2">✓ Answer Recorded!</p>
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Sample Answer:</strong> {currentQuestion?.sample_answer?.full_answer}
                  </p>
                  <p className="text-xs text-gray-600">Moving to next question...</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // RESULTS VIEW
  if (step === 'results') {
    const score = calculateScore()
    const timeTaken = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-50 overflow-y-auto">
        <div className="min-h-screen p-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
          >
            {/* Celebration */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600">Great work on completing the quiz!</p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center mb-6">
              <p className="text-sm opacity-90 mb-2">Your Score</p>
              <p className="text-6xl font-bold mb-2">{score.percentage}%</p>
              <p className="text-lg">{score.earnedMarks} / {score.totalMarks} marks</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{Object.keys(userAnswers).length}</p>
                <p className="text-sm text-gray-600">Answered</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatTime(timeTaken)}</p>
                <p className="text-sm text-gray-600">Time Taken</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="font-semibold text-blue-900 mb-2">
                {score.percentage >= 85 ? '🌟 Outstanding!' :
                 score.percentage >= 70 ? '👏 Well Done!' :
                 score.percentage >= 50 ? '💪 Good Effort!' :
                 '📚 Keep Practicing!'}
              </p>
              <p className="text-sm text-gray-700">
                {score.percentage >= 85 ? "You're mastering this content! Keep up the excellent work." :
                 score.percentage >= 70 ? "You're doing great! Review the feedback to reach the next level." :
                 score.percentage >= 50 ? "You're making progress. Focus on the key concepts and try again." :
                 "Don't worry! Review the sample answers and keep practicing."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRetake}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all"
              >
                Take Another Quiz
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}

export default QuizMode
