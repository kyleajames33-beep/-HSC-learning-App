import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const shuffleArray = (items) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const ClickToMatchFlashcards = ({
  terms = [],
  onComplete,
  xpReward = 25,
}) => {
  const [termCards, setTermCards] = useState([])
  const [definitionCards, setDefinitionCards] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedDefinition, setSelectedDefinition] = useState(null)
  const [matchedIndexes, setMatchedIndexes] = useState(new Set())
  const [attempts, setAttempts] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!terms || terms.length === 0) return

    const itemsWithIndex = terms.map((item, index) => ({
      index,
      term: item.term,
      definition: item.definition,
    }))

    setTermCards(shuffleArray(itemsWithIndex))
    setDefinitionCards(shuffleArray(itemsWithIndex))
    setMatchedIndexes(new Set())
    setSelectedTerm(null)
    setSelectedDefinition(null)
    setAttempts(0)
    setCompleted(false)
  }, [terms])

  const accuracy = useMemo(() => {
    if (attempts === 0) return 0
    return Math.round((matchedIndexes.size / attempts) * 100)
  }, [attempts, matchedIndexes.size])

  const handleTermClick = (item) => {
    if (completed || matchedIndexes.has(item.index)) return
    setSelectedTerm(item)

    if (selectedDefinition) {
      evaluateMatch(item, selectedDefinition)
    }
  }

  const handleDefinitionClick = (item) => {
    if (completed || matchedIndexes.has(item.index)) return
    setSelectedDefinition(item)

    if (selectedTerm) {
      evaluateMatch(selectedTerm, item)
    }
  }

  const evaluateMatch = (termItem, definitionItem) => {
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)

    const isMatch = termItem.index === definitionItem.index
    if (isMatch) {
      const updated = new Set(matchedIndexes)
      updated.add(termItem.index)
      setMatchedIndexes(updated)
      setSelectedTerm(null)
      setSelectedDefinition(null)

      if (updated.size === terms.length) {
        setCompleted(true)
        if (typeof onComplete === 'function') {
          onComplete({
            score: Math.round((updated.size / nextAttempts) * 100),
            attempts: nextAttempts,
            xpEarned: xpReward,
          })
        }
      }
    } else {
      setTimeout(() => {
        setSelectedTerm(null)
        setSelectedDefinition(null)
      }, 800)
    }
  }

  if (!terms || terms.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        Flashcard data is not available yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        <p className="font-semibold text-yellow-900">How it works</p>
        <p>Select a term, then select the matching definition.</p>
        <div className="mt-3 flex gap-4 text-xs text-yellow-700">
          <span>Matches: {matchedIndexes.size}/{terms.length}</span>
          <span>Attempts: {attempts}</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <MatchColumn
          title="Terms"
          items={termCards}
          selectedItem={selectedTerm}
          matchedIndexes={matchedIndexes}
          highlightColor="blue"
          onSelect={handleTermClick}
        />
        <MatchColumn
          title="Definitions"
          items={definitionCards.map((item) => ({
            ...item,
            display: item.definition,
          }))}
          selectedItem={selectedDefinition}
          matchedIndexes={matchedIndexes}
          highlightColor="purple"
          onSelect={handleDefinitionClick}
          renderText={(item) => item.definition}
        />
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <p className="font-semibold">
              All terms matched! XP earned: {xpReward}
            </p>
            <p>Attempts: {attempts}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MatchColumn = ({
  title,
  items,
  matchedIndexes,
  selectedItem,
  onSelect,
  highlightColor,
  renderText = (item) => item.term,
}) => {
  const highlightClass =
    highlightColor === 'blue'
      ? 'border-blue-400 bg-blue-50 text-blue-700'
      : 'border-purple-400 bg-purple-50 text-purple-700'

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-700">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => {
          const isMatched = matchedIndexes.has(item.index)
          const isSelected = selectedItem?.index === item.index
          return (
            <button
              type="button"
              key={`${title}-${item.index}`}
              onClick={() => onSelect(item)}
              disabled={isMatched}
              className={[
                'w-full rounded-lg border px-4 py-3 text-left text-sm transition',
                isMatched
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : isSelected
                  ? highlightClass
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                isMatched ? 'cursor-default' : '',
              ].join(' ')}
            >
              {renderText(item)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ClickToMatchFlashcards
