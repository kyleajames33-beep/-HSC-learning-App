import React, { useEffect, useState } from 'react'
import learnSections from '../data/biologyModule5LearnSections.json'

const DotPointStats = ({
  dotPointId,
  dotPointData,
  learnComplete,
  quizComplete,
  practiceComplete,
  onBack,
}) => {
  const [learnProgress, setLearnProgress] = useState({
    sectionsCompleted: 0,
    totalSections: (learnSections[dotPointId] || []).length,
    xpEarned: 0,
  })

  useEffect(() => {
    const stored = readFirstKey([
      `learn-progress:${dotPointId}`,
      `learn-progress-${dotPointId}`,
    ])

    if (!stored) {
      setLearnProgress((prev) => ({
        ...prev,
        sectionsCompleted: 0,
        xpEarned: 0,
      }))
      return
    }

    const completedList =
      stored.completedIds || stored.completed || stored.completedSections || []

    setLearnProgress((prev) => ({
      ...prev,
      sectionsCompleted: Array.isArray(completedList)
        ? completedList.length
        : Number(completedList) || 0,
      xpEarned: stored.totalXP ?? stored.xp ?? 0,
    }))
  }, [dotPointId])

  const overallProgress = (() => {
    let count = 0
    if (learnComplete) count += 1
    if (quizComplete) count += 1
    if (practiceComplete) count += 1
    return Math.round((count / 3) * 100)
  })()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
          >
            Back
          </button>
          <div className="flex-1 text-center">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              {dotPointId}
            </p>
            <h1 className="truncate text-sm font-semibold text-slate-900">
              {dotPointData?.title || 'Dotpoint stats'}
            </h1>
          </div>
          <div className="text-xs text-slate-500">
            Overall progress: <span className="font-semibold text-slate-800">{overallProgress}%</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
          <h2 className="text-base font-semibold text-slate-900">Learning progress</h2>
          <p className="mt-1 text-sm text-slate-600">
            {learnProgress.sectionsCompleted} of {learnProgress.totalSections || '—'} sections complete
          </p>
          <p className="mt-3 text-sm text-slate-600">
            XP earned from learning: <span className="font-semibold text-emerald-600">+{learnProgress.xpEarned}</span>
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Learn tab"
            description="Complete every section to unlock the quiz."
            status={learnComplete ? 'Complete' : 'In progress'}
          />
          <StatusCard
            title="Quick quiz"
            description="Score 65% or higher to unlock the practice tab."
            status={quizComplete ? 'Passed' : 'Not passed yet'}
          />
          <StatusCard
            title="Practice questions"
            description="Review every short-response question and compare with the marking guide."
            status={practiceComplete ? 'Finished' : 'Not finished yet'}
          />
        </section>
      </main>
    </div>
  )
}

const StatusCard = ({ title, description, status }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    <p className="mt-1 text-xs text-slate-500">{description}</p>
    <p className="mt-3 text-sm font-semibold text-slate-800">{status}</p>
  </div>
)

const readFirstKey = (keys) => {
  for (const key of keys) {
    const raw = localStorage.getItem(key)
    if (!raw) continue
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return null
}

export default DotPointStats
