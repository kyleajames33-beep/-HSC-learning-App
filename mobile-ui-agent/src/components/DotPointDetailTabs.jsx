import React, { useEffect, useMemo, useState } from 'react'
import LearnPage from './LearnPage'
import QuickQuiz from './QuickQuiz'
import ShortResponsePractice from './ShortResponsePractice'
import learnSections from '../data/biologyModule5LearnSections.json'
import practiceQuestions from '../data/biologyModule5PracticeQuestions.json'

const PROGRESS_KEY = (id) => `dotpoint-progress:${id}`
const placeHolderTabState = { learnComplete: false, quizComplete: false, practiceComplete: false }

const TABS = [
  { id: 'learn', label: 'Learn', icon: '📚', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'quiz', label: 'Quiz', icon: '⚡', gradient: 'from-purple-500 to-pink-500' },
  { id: 'practice', label: 'Practice', icon: '✍️', gradient: 'from-orange-500 to-red-500' },
]

const DotPointDetailTabs = ({
  dotPointId,
  dotPointData,
  onBack,
  pathwayData,
  progressHook,
}) => {
  const [activeTab, setActiveTab] = useState('learn')
  const [progress, setProgress] = useState(placeHolderTabState)

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(PROGRESS_KEY(dotPointId)), null)
    if (stored) {
      setProgress({
        learnComplete: Boolean(stored.learnComplete),
        quizComplete: Boolean(stored.quizComplete),
        practiceComplete: Boolean(
          stored.practiceComplete ?? stored.essayComplete ?? false,
        ),
      })
    } else {
      setProgress(placeHolderTabState)
    }
  }, [dotPointId])

  useEffect(() => {
    persistProgress(dotPointId, progress)
  }, [dotPointId, progress])

  const learnPageData = useMemo(() => {
    const sections = learnSections[dotPointId]
    if (!sections || sections.length === 0) return null

    if (sections[0]?.type === 'placeholder') {
      return { placeholder: true, ...sections[0].content }
    }

    return {
      sections,
      completionXP: 50,
    }
  }, [dotPointId])

  const practiceSet = useMemo(
    () => practiceQuestions[dotPointId] || [],
    [dotPointId],
  )

  const handleLearnComplete = () => {
    setProgress((prev) => ({ ...prev, learnComplete: true }))
    setActiveTab('quiz')
  }

  const handleQuizComplete = (result) => {
    const passed = result?.score != null ? result.score >= 65 : Boolean(result?.passed)
    if (passed) {
      setProgress((prev) => ({ ...prev, quizComplete: true }))
      setActiveTab('practice')
    }
  }

  const handlePracticeComplete = (result) => {
    if (result?.passed) {
      setProgress((prev) => ({ ...prev, practiceComplete: true }))
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'learn': {
        if (!learnPageData) {
          return (
            <PlaceholderPanel
              title="Learn content coming soon"
              message="This dotpoint does not have learn content yet. Try the quiz tab while the team finishes the lesson."
              actionLabel="Back to pathway"
              onAction={onBack}
            />
          )
        }

        if (learnPageData.placeholder) {
          return (
            <PlaceholderPanel
              title="Learn content is on the way"
              message={learnPageData.message || 'The content team is preparing this lesson.'}
              actionLabel="Go to quiz"
              onAction={() => setActiveTab('quiz')}
            />
          )
        }

        return (
          <LearnPage
            dotPointId={dotPointId}
            dotPointTitle={dotPointData?.title || dotPointId}
            learnPageData={learnPageData}
            onComplete={handleLearnComplete}
            onBack={onBack}
          />
        )
      }

      case 'quiz':
        return (
          <QuickQuiz
            subject={dotPointData?.subject || pathwayData?.subject || 'biology'}
            dotPointId={dotPointId}
            onQuizComplete={handleQuizComplete}
            onExit={() => setActiveTab('learn')}
          />
        )

      case 'practice':
        return (
          <ShortResponsePractice
            dotPointId={dotPointId}
            dotPointData={dotPointData}
            practiceSet={practiceSet}
            onComplete={handlePracticeComplete}
            onBack={() => setActiveTab('quiz')}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
          <div className="flex-1 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {dotPointId}
            </p>
            <h1 className="text-lg font-bold text-gray-800 mt-1">
              {dotPointData?.title || 'Dotpoint'}
            </h1>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Modern Tab Navigation with Gradients */}
      <nav className="bg-white/60 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex gap-3">
            {TABS.map((tab) => {
              const locked = false // All tabs unlocked
              const active = tab.id === activeTab

              return (
                <button
                  type="button"
                  key={tab.id}
                  className={`
                    flex-1 relative overflow-hidden rounded-2xl px-4 py-4 text-center font-bold transition-all duration-300 transform
                    ${locked
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : active
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl scale-105`
                        : 'bg-white text-gray-600 shadow-md hover:shadow-xl hover:scale-105'
                    }
                  `}
                  disabled={locked}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {/* Shine effect on active tab */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  )}

                  <div className="relative flex flex-col items-center gap-1">
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                    {locked && <span className="text-xs">🔒</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="pb-10 px-4">{renderContent()}</main>
    </div>
  )
}

const StatusPill = ({ label, done }) => (
  <span
    className={`
      rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm
      ${done
        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
        : 'bg-gray-100 text-gray-500'
      }
    `}
  >
    {done ? '✓' : '○'} {label}
  </span>
)

const PlaceholderPanel = ({ title, message, actionLabel, onAction }) => (
  <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
      >
        {actionLabel}
      </button>
    </div>
  </div>
)

const persistProgress = (dotPointId, state) => {
  localStorage.setItem(PROGRESS_KEY(dotPointId), JSON.stringify(state))
}

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const getSectionId = (section) =>
  section.sectionId || section.id || `${section.type}-${section.title || 'section'}`

export default DotPointDetailTabs




