import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamificationContext } from '../context/GamificationContext'
import Confetti from './Confetti'
import ClickToMatchFlashcards from './ClickToMatchFlashcards'
import NotesSection from './NotesSection'
import EnhancedNotesSection from './EnhancedNotesSection'
import InteractiveReadingSection from './InteractiveReadingSection'

const STORAGE_KEYS = {
  progress: (dotPointId) => `learn-progress:${dotPointId}`,
  notes: (dotPointId) => `learn-notes:${dotPointId}`,
}

const SECTION_ICONS = {
  video: 'VIDEO',
  'interactive-cards': 'CARDS',
  podcast: 'AUDIO',
  flashcards: 'FLASH',
  'worked-example': 'EXAMPLE',
  practice: 'PRACTICE',
  notes: 'NOTES',
}

const CompletionBadge = ({ message, xp }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-6 w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center"
  >
    <div className="text-3xl mb-2">🎉</div>
    <div className="text-lg font-semibold text-gray-900">{message}</div>
    {typeof xp === 'number' && (
      <div className="mt-2 text-sm font-medium text-green-600">+{xp} XP</div>
    )}
  </motion.div>
);

const DEFAULT_SECTION_XP = 15

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const useStoredNotes = (dotPointId) => {
  const storageKey = STORAGE_KEYS.notes(dotPointId)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const storedValue = localStorage.getItem(storageKey)
    if (typeof storedValue === 'string') {
      setNotes(storedValue)
    }
  }, [storageKey])

  const updateNotes = (value) => {
    setNotes(value)
    localStorage.setItem(storageKey, value)
  }

  return [notes, updateNotes]
}

const LearnPage = ({
  dotPointId,
  learnPageData,
  onComplete,
  onBack,
  dotPointTitle,
}) => {
  const sections = learnPageData?.sections || []
  const completionBonus = learnPageData?.completionXP || 50

  const { addXP } = useGamificationContext()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [completedIds, setCompletedIds] = useState(new Set())
  const [totalXP, setTotalXP] = useState(0)
  const [bonusAwarded, setBonusAwarded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const progressKey = STORAGE_KEYS.progress(dotPointId)

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(progressKey), null)
    if (!stored) {
      setCompletedIds(new Set())
      setTotalXP(0)
      setBonusAwarded(false)
      return
    }

    setCompletedIds(new Set(stored.completedIds || []))
    setTotalXP(stored.totalXP || 0)
    setBonusAwarded(Boolean(stored.bonusAwarded))
  }, [progressKey])

  useEffect(() => {
    if (sections.length === 0) {
      setCurrentSectionIndex(0)
      return
    }

    const firstIncomplete = sections.findIndex(
      (section) => !completedIds.has(getSectionId(section)),
    )

    setCurrentSectionIndex(firstIncomplete === -1 ? sections.length - 1 : firstIncomplete)
  }, [sections, completedIds])

  useEffect(() => {
    if (sections.length === 0 || bonusAwarded) return

    const allComplete = sections.every((section) =>
      completedIds.has(getSectionId(section)),
    )

    if (allComplete) {
      handleAllSectionsComplete()
    }
  }, [sections, completedIds, bonusAwarded])

  const saveProgress = useCallback(
    (updates = {}) => {
      const payload = {
        completedIds: Array.from(completedIds),
        totalXP,
        bonusAwarded,
        ...updates,
      }
      localStorage.setItem(progressKey, JSON.stringify(payload))
    },
    [completedIds, totalXP, bonusAwarded, progressKey],
  )

  const progressPercent = useMemo(() => {
    if (sections.length === 0) return 0
    return Math.round((completedIds.size / sections.length) * 100)
  }, [sections.length, completedIds])

  const currentSection = sections[currentSectionIndex]

  const markSectionComplete = useCallback(async () => {
    if (!currentSection) return

    const sectionId = getSectionId(currentSection)
    if (completedIds.has(sectionId)) {
      goToNextSection()
      return
    }

    const xpReward = currentSection.xp ?? DEFAULT_SECTION_XP
    const newTotal = totalXP + xpReward
    const updatedCompleted = new Set(completedIds)
    updatedCompleted.add(sectionId)

    setCompletedIds(updatedCompleted)
    setTotalXP(newTotal)
    setToastMessage(`Section complete. +${xpReward} XP`)

    try {
      await addXP(xpReward, `Completed ${currentSection.title}`)
    } catch {
      // ignore network errors; XP sync will retry elsewhere
    }

    saveProgress({
      completedIds: Array.from(updatedCompleted),
      totalXP: newTotal,
    })

    goToNextSection(updatedCompleted)
  }, [currentSection, completedIds, addXP, saveProgress, totalXP])

  const goToNextSection = useCallback(
    (completedSet = completedIds) => {
      const nextIndex = sections.findIndex(
        (section) => !completedSet.has(getSectionId(section)),
      )

      if (nextIndex === -1) {
        setCurrentSectionIndex(sections.length - 1)
      } else {
        setCurrentSectionIndex(nextIndex)
      }
    },
    [sections, completedIds],
  )

  const handleAllSectionsComplete = useCallback(async () => {
    if (bonusAwarded) return

    setBonusAwarded(true)
    setShowConfetti(true)
    setToastMessage(`All sections complete. Bonus +${completionBonus} XP`)
    const newTotal = totalXP + completionBonus
    setTotalXP(newTotal)

    try {
      await addXP(completionBonus, `Mastered ${dotPointTitle}`)
    } catch {
      // ignore
    }

    saveProgress({
      bonusAwarded: true,
      totalXP: newTotal,
    })

    if (typeof onComplete === 'function') {
      onComplete({
        totalXP: newTotal,
        sectionsCompleted: sections.length,
        dotPointId,
      })
    }

    setTimeout(() => setShowConfetti(false), 2500)
  }, [
    bonusAwarded,
    completionBonus,
    addXP,
    dotPointTitle,
    saveProgress,
    totalXP,
    onComplete,
    sections.length,
    dotPointId,
  ])

  const handleNavigate = (index) => {
    if (index < 0 || index >= sections.length) return

    const target = sections[index]
    if (!target) return

    const sectionId = getSectionId(target)
    const isOptional = Boolean(target.optional || target.metadata?.optional)
    const allowed =
      completedIds.has(sectionId) ||
      isOptional ||
      index <= completedIds.size

    if (allowed) {
      setCurrentSectionIndex(index)
    }
  }

  if (sections.length === 0) {
    return (
      <EmptyState
        title="Learn content is not available yet"
        message="Check back soon or try the quiz tab in the meantime."
        onBack={onBack}
      />
    )
  }

  const progressSummary =
    sections.length > 0
      ? `${completedIds.size}/${sections.length} complete`
      : '0/0 complete'

  return (
    <div className="min-h-screen bg-slate-50">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

      <Header
        dotPointTitle={dotPointTitle}
        progressSummary={progressSummary}
        totalXP={totalXP}
        progressPercent={progressPercent}
        onBack={onBack}
      />

      <SectionNavigator
        sections={sections}
        completedIds={completedIds}
        currentIndex={currentSectionIndex}
        onNavigate={handleNavigate}
      />

      <main className="mx-auto max-w-4xl px-4 py-6">
        <AnimatePresence mode="wait">
          {currentSection && (
            <motion.div
              key={getSectionId(currentSection)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <SectionRenderer
                section={currentSection}
                dotPointId={dotPointId}
                onComplete={markSectionComplete}
                isCompleted={completedIds.has(getSectionId(currentSection))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-40 w-full max-w-sm -translate-x-1/2"
          >
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow focus:outline-none focus-visible:ring focus-visible:ring-blue-400/50"
            >
              {toastMessage}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Header = ({
  dotPointTitle,
  progressSummary,
  totalXP,
  progressPercent,
  onBack,
}) => (
  <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
      >
        Back
      </button>
      <div className="flex-1 truncate">
        <p className="text-xs text-slate-500">{progressSummary}</p>
        <h1 className="truncate text-sm font-semibold text-slate-900">
          {dotPointTitle}
        </h1>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-emerald-600">+{totalXP}</p>
        <p className="text-xs text-slate-500">XP earned</p>
      </div>
    </div>
    <div className="h-2 bg-slate-100">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  </header>
)

const SectionNavigator = ({
  sections,
  completedIds,
  currentIndex,
  onNavigate,
}) => (
  <div className="border-b border-slate-200 bg-white/80">
    <div className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto px-4 py-3">
      {sections.map((section, index) => {
        const sectionId = getSectionId(section)
        const icon = SECTION_ICONS[section.type] || 'SECTION'
        const isCompleted = completedIds.has(sectionId)
        const isCurrent = currentIndex === index
        const isOptional = Boolean(section.optional || section.metadata?.optional)
        const isLocked = !isOptional && index > completedIds.size

        const baseClasses =
          'flex min-w-[70px] flex-col items-center justify-center rounded-xl border px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition'

        let stateClasses
        if (isCompleted) {
          stateClasses = 'border-emerald-300 bg-emerald-50 text-emerald-700'
        } else if (isCurrent) {
          stateClasses = 'border-blue-500 bg-blue-500 text-white shadow'
        } else if (isLocked) {
          stateClasses = 'border-slate-200 bg-slate-100 text-slate-400'
        } else {
          stateClasses =
            'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600'
        }

        return (
          <button
            type="button"
            key={sectionId}
            onClick={() => onNavigate(index)}
            disabled={isLocked}
            className={`${baseClasses} ${stateClasses}`}
          >
            <span className="text-[11px] font-bold">{icon}</span>
            <span>{index + 1}</span>
          </button>
        )
      })}
    </div>
  </div>
)

const SectionRenderer = ({ section, dotPointId, onComplete, isCompleted }) => {
  const commonProps = { section, onComplete, isCompleted }

  switch (section.type) {
    case 'video':
      return <VideoSection {...commonProps} />
    case 'interactive-cards':
      return <InteractiveCardsSection {...commonProps} />
    case 'podcast':
      return <PodcastSection {...commonProps} />
    case 'flashcards':
      return <FlashcardsSection {...commonProps} />
    case 'worked-example':
      return <WorkedExampleSection {...commonProps} />
    case 'practice':
      return <PracticeSection {...commonProps} />
    case 'detailed-content':
      return <DetailedContentSection {...commonProps} />
    case 'notes':
      return <NotesSectionRenderer {...commonProps} dotPointId={dotPointId} />
    default:
      return (
        <SectionShell
          title={section.title || 'Unsupported section'}
          icon="SECTION"
          subtitle="This section type has not been implemented yet."
        >
          <p className="text-sm text-slate-600">
            Please let the development team know if you are seeing this message.
          </p>
        </SectionShell>
      )
  }
}

const VideoSection = ({ section, onComplete, isCompleted }) => {
  const [watched, setWatched] = useState(isCompleted)

  const handleMarkWatched = () => {
    if (watched) return
    setWatched(true)
    onComplete()
  }

  const description =
    section.description ||
    'Watch the lesson video, then mark it as complete once you finish.'

  return (
    <SectionShell title={section.title} icon="VIDEO" subtitle={description}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
        <VideoEmbed url={section.url || section.content?.url} />
      </div>
      <SectionActions
        isCompleted={watched}
        onComplete={handleMarkWatched}
        xp={section.xp}
        completionLabel="Video completed"
        pendingLabel="Mark as watched"
      />
    </SectionShell>
  )
}

const InteractiveCardsSection = ({ section, onComplete, isCompleted }) => {
  const cards = section.cards || section.content?.cards || []
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [complete, setComplete] = useState(isCompleted)

  useEffect(() => {
    if (isCompleted) setComplete(true)
  }, [isCompleted])

  const currentCard = cards[index]

  const goNext = () => {
    if (index < cards.length - 1) {
      setIndex((value) => value + 1)
      setFlipped(false)
    } else if (!complete) {
      setComplete(true)
      onComplete()
    }
  }

  const goPrev = () => {
    if (index > 0) {
      setIndex((value) => value - 1)
      setFlipped(false)
    }
  }

  return (
    <SectionShell
      title={section.title}
      icon="CARDS"
      subtitle="Tap the card to reveal the answer, then move on to the next one."
    >
      {currentCard ? (
        <motion.div
          key={index}
          className="relative h-64 cursor-pointer overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center shadow"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={() => setFlipped((value) => !value)}
        >
          <CardFace heading={currentCard.front} hint="Tap to flip" rotated={false} />
          <CardFace heading="Answer" body={currentCard.back} rotated />
        </motion.div>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          This section does not contain cards yet.
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {index === cards.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      {complete && (
        <CompletionBanner message="All cards reviewed" xp={section.xp} />
      )}
    </SectionShell>
  )
}

const PodcastSection = ({ section, onComplete, isCompleted }) => {
  const [listened, setListened] = useState(isCompleted)

  const markComplete = () => {
    if (listened) return
    setListened(true)
    onComplete()
  }

  return (
    <SectionShell
      title={section.title}
      icon="AUDIO"
      subtitle={section.description || 'Listen to the short audio summary.'}
    >
      <audio
        controls
        className="w-full"
        onEnded={markComplete}
      >
        <source
          src={section.url || section.content?.url}
          type={section.mimeType || 'audio/mpeg'}
        />
        Your browser does not support the audio element.
      </audio>

      <SectionActions
        isCompleted={listened}
        onComplete={markComplete}
        xp={section.xp}
        completionLabel="Audio completed"
        pendingLabel="Mark as listened"
      />
    </SectionShell>
  )
}

const FlashcardsSection = ({ section, onComplete, isCompleted }) => {
  const [complete, setComplete] = useState(isCompleted)
  const terms = section.terms || section.content?.terms || []

  const handleComplete = () => {
    if (complete) return
    setComplete(true)
    onComplete()
  }

  return (
    <SectionShell
      title={section.title}
      icon="FLASH"
      subtitle="Match each term with its definition."
    >
      {complete ? (
        <CompletionBanner message="Flashcard match complete" xp={section.xp} />
      ) : (
        <ClickToMatchFlashcards
          terms={terms}
          onComplete={handleComplete}
          xpReward={section.xp || 25}
        />
      )}
    </SectionShell>
  )
}

const WorkedExampleSection = ({ section, onComplete, isCompleted }) => {
  const steps = section.steps || section.content?.steps || []
  const [stepIndex, setStepIndex] = useState(0)
  const [complete, setComplete] = useState(isCompleted)

  const goNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((value) => value + 1)
    } else if (!complete) {
      setComplete(true)
      onComplete()
    }
  }

  const goPrev = () => setStepIndex((value) => Math.max(0, value - 1))

  return (
    <SectionShell
      title={section.title}
      icon="EXAMPLE"
      subtitle="Study the worked example step by step."
    >
      {steps.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Worked example content will appear here when available.
        </p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-blue-600">
            Step {stepIndex + 1} of {steps.length}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {steps[stepIndex].title || `Step ${stepIndex + 1}`}
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {steps[stepIndex].content || steps[stepIndex]}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={goPrev}
              disabled={stepIndex === 0}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-600 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex-1 rounded-lg bg-indigo-500 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              {stepIndex === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {complete && (
        <CompletionBanner message="Worked example complete" xp={section.xp} />
      )}
    </SectionShell>
  )
}

const PracticeSection = ({ section, onComplete, isCompleted }) => {
  const questions = section.questions || section.content?.questions || []
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(isCompleted)
  const [score, setScore] = useState(0)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitted) return

    let correctAnswers = 0
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers += 1
      }
    })

    setScore(correctAnswers)
    setSubmitted(true)
    onComplete()
  }

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  return (
    <SectionShell
      title={section.title}
      icon="PRACTICE"
      subtitle="Answer the questions below and check your understanding."
    >
      {questions.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Practice questions for this section will appear here when available.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {questions.map((question, idx) => (
            <div
              key={question.id || idx}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-slate-900">
                {idx + 1}. {question.question}
              </p>
              <div className="mt-3 space-y-2">
                {question.options.map((option, optionIdx) => {
                  const selected = answers[question.id] === optionIdx
                  const correct =
                    submitted && optionIdx === question.correctAnswer
                  const incorrect =
                    submitted &&
                    selected &&
                    optionIdx !== question.correctAnswer

                  const optionClasses = [
                    'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition',
                    selected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white',
                    correct ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : '',
                    incorrect ? 'border-rose-400 bg-rose-50 text-rose-700' : '',
                  ].join(' ')

                  return (
                    <label key={optionIdx} className={optionClasses}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIdx}
                        checked={selected}
                        disabled={submitted}
                        onChange={() => handleSelect(question.id, optionIdx)}
                        className="h-4 w-4 border-slate-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>
              {submitted && question.explanation && (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  Explanation: {question.explanation}
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Submit answers
            </button>
          ) : (
            <CompletionBanner
              message={`Practice complete. Score ${score}/${questions.length}`}
              xp={section.xp}
            />
          )}
        </form>
      )}
    </SectionShell>
  )
}

const DetailedContentSection = ({ section, onComplete, isCompleted }) => {
  const [read, setRead] = useState(isCompleted)

  useEffect(() => {
    if (isCompleted) setRead(true)
  }, [isCompleted])

  const sections = section.content?.sections || []

  const handleMarkRead = () => {
    if (!read) {
      setRead(true)
      onComplete()
    }
  }

  return (
    <SectionShell
      title={section.title}
      icon="📖"
      subtitle="Deep dive into the concepts with detailed explanations and examples."
    >
      {/* Detailed Content Sections */}
      <div className="space-y-6">
        {sections.map((contentSection, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {/* Heading - clean, no gradient */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {contentSection.heading}
            </h3>

            {/* Interactive Reading Content */}
            <InteractiveReadingSection
              content={contentSection.content}
              sectionId={`content-${index}`}
              subjectColor="blue"
            />

            {/* Examples - simplified styling */}
            {contentSection.examples && contentSection.examples.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-gray-900">
                  Real-World Examples
                </p>
                {contentSection.examples.map((example, exIdx) => (
                  <div
                    key={exIdx}
                    className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 border border-blue-200"
                  >
                    <span className="text-xl flex-shrink-0">{example.split(' ')[0]}</span>
                    <p className="text-sm text-gray-700 flex-1">
                      {example.substring(example.indexOf(' ') + 1)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Real World Application - cleaner design */}
            {contentSection.realWorldApplication && (
              <div className="mt-6 rounded-lg bg-orange-50 border border-orange-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Real-World Application
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {contentSection.realWorldApplication}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mark as Read Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleMarkRead}
          disabled={read}
          className={`
            w-full px-6 py-3 rounded-lg font-semibold text-sm transition
            ${read
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {read ? '✓ Content Read' : `Mark as Read (+${section.xp || DEFAULT_SECTION_XP} XP)`}
        </button>
      </div>

      {read && (
        <CompletionBadge
          message={`You've completed this detailed content section!`}
          xp={section.xp}
        />
      )}
    </SectionShell>
  )
}

const NotesSectionRenderer = ({ section, onComplete, isCompleted, dotPointId }) => {
  const [read, setRead] = useState(isCompleted)

  useEffect(() => {
    if (isCompleted) setRead(true)
  }, [isCompleted])

  const notesData = section.content || section

  const handleMarkRead = () => {
    if (!read) {
      setRead(true)
      onComplete()
    }
  }

  return (
    <SectionShell
      title={section.title || 'Study Notes'}
      icon="NOTES"
      subtitle="Review key concepts, memory aids, and exam strategies."
    >
      <EnhancedNotesSection
        notes={notesData}
        dotpointId={dotPointId}
        subjectColor={section.subjectColor || 'blue'}
      />

      <div className="mt-6">
        <button
          type="button"
          onClick={handleMarkRead}
          disabled={read}
          className={`
            w-full px-6 py-3 rounded-lg font-semibold text-sm transition
            ${read
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {read ? '✓ Notes Reviewed' : `Mark as Read (+${section.xp || DEFAULT_SECTION_XP} XP)`}
        </button>
      </div>

      {read && (
        <CompletionBadge
          message={`Notes reviewed successfully!`}
          xp={section.xp}
        />
      )}
    </SectionShell>
  )
}

const SectionShell = ({ title, icon, subtitle, children }) => (
  <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
    <header className="flex items-center gap-4">
      <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-blue-500 text-[10px] font-semibold uppercase text-white">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
    </header>
    {children}
  </section>
)

const SectionActions = ({
  isCompleted,
  onComplete,
  xp,
  completionLabel,
  pendingLabel,
}) => {
  if (isCompleted) {
    return <CompletionBanner message={completionLabel} xp={xp} />
  }

  return (
    <button
      type="button"
      onClick={onComplete}
      className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-600"
    >
      {pendingLabel} (+{xp || DEFAULT_SECTION_XP} XP)
    </button>
  )
}

const CompletionBanner = ({ message, xp }) => (
  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
    Completed: {message}
    {typeof xp === 'number' && (
      <span className="ml-2 font-semibold text-emerald-600">+{xp} XP</span>
    )}
  </div>
)

const CardFace = ({ heading, body, hint, rotated }) => (
  <div
    className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 text-center"
    style={{
      backfaceVisibility: 'hidden',
      transform: rotated ? 'rotateY(180deg)' : 'rotateY(0deg)',
    }}
  >
    {heading && <h4 className="text-lg font-semibold text-slate-900">{heading}</h4>}
    {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
    {body && <p className="mt-3 text-sm text-slate-700">{body}</p>}
  </div>
)

const VideoEmbed = ({ url }) => {
  if (!url) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        Video link not available yet.
      </div>
    )
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const embedUrl = getYoutubeEmbedUrl(url)
    return (
      <iframe
        className="h-64 w-full sm:h-80"
        src={embedUrl}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <video controls className="h-64 w-full sm:h-80">
      <source src={url} />
      Your browser does not support the video element.
    </video>
  )
}

const getYoutubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }
    const videoId = parsed.searchParams.get('v')
    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return url
  }
}

const EmptyState = ({ title, message, onBack }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
    <div className="rounded-lg border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-slate-600">{message}</p>
    </div>
    <button
      type="button"
      onClick={onBack}
      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
    >
      Back to pathway
    </button>
  </div>
)

const getSectionId = (section) =>
  section.sectionId || section.id || `${section.type}-${section.title || 'untitled'}`

export default LearnPage
