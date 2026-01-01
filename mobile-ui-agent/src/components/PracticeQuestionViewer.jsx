import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PracticeQuestionViewer - Beautiful UI for HSC-style short answer questions
 * Shows question, allows student to attempt, then reveals marking criteria and sample answer
 */
const PracticeQuestionViewer = ({ questions, dotpointId, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studentAnswers, setStudentAnswers] = useState({})
  const [completedQuestions, setCompletedQuestions] = useState(new Set())

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600">No practice questions available.</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Learn
          </button>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    } else if (onComplete) {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleToggleAnswer = () => {
    if (!showAnswer) {
      setCompletedQuestions(new Set(completedQuestions).add(currentQuestion.id))
    }
    setShowAnswer(!showAnswer)
  }

  const handleAnswerChange = (value) => {
    setStudentAnswers({
      ...studentAnswers,
      [currentQuestion.id]: value,
    })
  }

  const difficultyColor = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
  }

  const progressPercent = ((completedQuestions.size / totalQuestions) * 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back to Learn
          </button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Practice Questions
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {completedQuestions.size}/{totalQuestions} attempted
              </span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm mb-6"
          >
            {/* Question Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-gray-500">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${
                      difficultyColor[currentQuestion.difficulty] ||
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {currentQuestion.marks} marks
                  </span>
                  <span className="text-xs text-gray-500">
                    ~{currentQuestion.time_estimate} min
                  </span>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Keywords */}
            {currentQuestion.keywords && currentQuestion.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs text-gray-500 font-medium">Key terms:</span>
                {currentQuestion.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Student Answer Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer:
              </label>
              <textarea
                value={studentAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Write your answer in full sentences. Aim for {currentQuestion.marks} distinct points.
              </p>
            </div>

            {/* Show Answer Button */}
            <div className="mb-6">
              <button
                onClick={handleToggleAnswer}
                className="w-full px-6 py-3 rounded-lg font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
              >
                {showAnswer ? 'Hide Sample Answer' : 'Show Sample Answer & Marking Criteria'}
              </button>
            </div>

            {/* Sample Answer Section */}
            <AnimatePresence>
              {showAnswer && currentQuestion.sample_answer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 pt-6"
                >
                  {/* Marking Criteria */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Marking Criteria
                    </h3>
                    <div className="space-y-3">
                      {currentQuestion.sample_answer.marking_criteria?.map((criterion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            {criterion.mark}
                          </div>
                          <p className="flex-1 text-sm text-gray-700 pt-1">
                            {criterion.criteria}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Answer */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Sample Answer
                    </h3>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {currentQuestion.sample_answer.full_answer}
                      </p>
                    </div>
                  </div>

                  {/* Key Terms Required */}
                  {currentQuestion.sample_answer.key_terms_required && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        Key Terms to Include:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentQuestion.sample_answer.key_terms_required.map((term, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Mistakes */}
                  {currentQuestion.sample_answer.common_mistakes && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        ⚠️ Common Mistakes:
                      </h4>
                      <ul className="space-y-2">
                        {currentQuestion.sample_answer.common_mistakes.map((mistake, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-red-500 flex-shrink-0">•</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600">
            {currentIndex + 1} / {totalQuestions}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
          >
            {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PracticeQuestionViewer
