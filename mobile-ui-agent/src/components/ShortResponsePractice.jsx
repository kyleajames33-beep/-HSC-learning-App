import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamificationContext } from '../context/GamificationContext'
import Confetti from './Confetti'

const STORAGE_KEY = (id) => `practice-progress:${id}`

const ShortResponsePractice = ({
  dotPointId,
  practiceQuestions = [],
  onComplete,
  onBack,
}) => {
  const { addXP } = useGamificationContext()
  const [responses, setResponses] = useState({})
  const [completed, setCompleted] = useState({})
  const [showMarking, setShowMarking] = useState({})
  const [showSample, setShowSample] = useState({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [reportedComplete, setReportedComplete] = useState(false)

  // Load progress
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY(dotPointId))
    if (!stored) return
    try {
      const { responses: savedResponses, completed: savedCompleted } = JSON.parse(stored)
      setResponses(savedResponses || {})
      setCompleted(savedCompleted || {})
    } catch {
      // ignore malformed payload
    }
  }, [dotPointId])

  // Persist progress
  useEffect(() => {
    const payload = JSON.stringify({ responses, completed })
    window.localStorage.setItem(STORAGE_KEY(dotPointId), payload)
  }, [dotPointId, responses, completed])

  const totalQuestions = practiceQuestions.length
  const completedCount = useMemo(
    () => practiceQuestions.filter((q) => completed[q.id]).length,
    [completed, practiceQuestions],
  )

  const progressPercent =
    totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0

  useEffect(() => {
    if (totalQuestions === 0) return
    if (completedCount === totalQuestions && !reportedComplete) {
      setShowConfetti(true)
      setReportedComplete(true)
      onComplete?.({
        passed: true,
        completedCount,
        totalQuestions,
      })
    }
  }, [completedCount, totalQuestions, reportedComplete, onComplete])

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const toggleMarkingGuide = (id) => {
    setShowMarking((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleSampleAnswer = (id) => {
    setShowSample((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleQuestionReviewed = async (question) => {
    if (completed[question.id]) return

    // Award XP only once per question
    await addXP(35, `Reviewed practice question for ${dotPointId}`)

    setCompleted((prev) => ({
      ...prev,
      [question.id]: true,
    }))
  }

  const handleReset = () => {
    setResponses({})
    setCompleted({})
    setShowMarking({})
    setShowSample({})
    setShowConfetti(false)
    setReportedComplete(false)
    window.localStorage.removeItem(STORAGE_KEY(dotPointId))
  }

  if (totalQuestions === 0) {
    return (
      <EmptyState
        onBack={onBack}
        title="Practice Available!"
        message="Practice questions for this dotpoint are available. You can still earn XP for your progress!"
      />
    )
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col gap-6 py-8">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Short-response practice
            </p>
            <h2 className="text-xl font-bold text-slate-900">Open-answer mastery check</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Answer each 2–6 mark question, then reveal the marking guide to self-assess. Mark a
              question as reviewed once you’ve compared your response. Finish all questions to claim
              the bonus XP.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-semibold text-slate-800">{progressPercent}% complete</span>
            <span className="text-xs text-slate-500">
              {completedCount} of {totalQuestions} questions reviewed
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:border-slate-300 hover:text-slate-800"
            >
              Reset practice
            </button>
          </div>
        </div>
      </motion.header>

      <div className="space-y-6">
        {practiceQuestions.map((question, idx) => {
          const response = responses[question.id] || ''
          const isComplete = completed[question.id]
          const showGuide = Boolean(showMarking[question.id])
          const showSampleAnswer = Boolean(showSample[question.id])

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl border p-6 shadow-sm transition ${
                isComplete
                  ? 'border-emerald-300 bg-emerald-50/60'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    Question {idx + 1}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900">{question.prompt}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">{question.marks} marks</p>
                </div>
                {isComplete ? (
                  <span className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-600">
                    Reviewed
                  </span>
                ) : null}
              </div>

              <textarea
                value={response}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Type your answer here…"
                className="mt-4 h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <ToggleButton
                  active={showGuide}
                  label="Marking guide"
                  onClick={() => toggleMarkingGuide(question.id)}
                />
                <ToggleButton
                  active={showSampleAnswer}
                  label="Sample answer"
                  onClick={() => toggleSampleAnswer(question.id)}
                />
                <button
                  type="button"
                  onClick={() => handleQuestionReviewed(question)}
                  disabled={isComplete}
                  className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
                    isComplete
                      ? 'border border-emerald-200 bg-white text-emerald-500'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {isComplete ? 'Marked as reviewed' : 'Mark as reviewed (+35 XP)'}
                </button>
              </div>

              <AnimatePresence>
                {showGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                  >
                    <h4 className="font-semibold">Suggested marking points</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {question.markingGuide?.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                    {question.keywords?.length ? (
                      <p className="mt-3 text-xs uppercase tracking-wide text-amber-700">
                        KEY TERMS:{' '}
                        <span className="font-semibold">
                          {question.keywords.join(', ')}
                        </span>
                      </p>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showSampleAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
                  >
                    <h4 className="font-semibold text-slate-900">Sample answer</h4>
                    <p className="mt-2 whitespace-pre-line leading-relaxed">{question.sampleAnswer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {showConfetti && <Confetti />}
    </div>
  )
}

const ToggleButton = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
    }`}
  >
    {label}
  </button>
)

const EmptyState = ({ title, message, onBack }) => (
  <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
      >
        Back to pathway
      </button>
    </div>
  </div>
)

export default ShortResponsePractice
