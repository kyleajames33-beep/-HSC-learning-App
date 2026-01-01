import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * NotesSection - Beautiful, aesthetically pleasing notes display
 * Shows concise study notes with key points, mnemonics, and exam tips
 */
const NotesSection = ({ notes, dotpointId, subjectColor = 'blue' }) => {
  const [expandedSections, setExpandedSections] = useState({
    keyPoints: true,
    mnemonics: false,
    examTips: false,
    commonMistakes: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Color schemes based on subject
  const colorSchemes = {
    green: {
      primary: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
    },
    blue: {
      primary: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
    },
  }

  const colors = colorSchemes[subjectColor] || colorSchemes.blue

  if (!notes) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-500">Notes for this dotpoint are being prepared.</p>
        <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
      </div>
    )
  }

  const SectionHeader = ({ icon, title, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition rounded-lg group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconText} group-hover:scale-110 transition`}>
          {icon}
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {count && (
            <p className="text-xs text-gray-500">{count} items</p>
          )}
        </div>
      </div>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform ${
          expandedSections[section] ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Notes</h2>
            <p className="text-sm text-gray-600">{dotpointId} Summary</p>
          </div>
        </div>
        {notes.summary && (
          <p className="text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-gray-200">
            {notes.summary}
          </p>
        )}
      </div>

      {/* Key Points */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <SectionHeader
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          title="Key Points"
          section="keyPoints"
          count={notes.keyPoints?.length}
        />
        <AnimatePresence>
          {expandedSections.keyPoints && notes.keyPoints && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-3">
                {notes.keyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 group"
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full ${colors.badgeBg} ${colors.badgeText} flex items-center justify-center text-sm font-bold group-hover:scale-110 transition`}>
                      {index + 1}
                    </div>
                    <p className="flex-1 text-gray-700 leading-relaxed pt-0.5">{point}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mnemonics */}
      {notes.mnemonics && notes.mnemonics.length > 0 && (
        <div className="rounded-xl border border-purple-200 bg-white shadow-sm overflow-hidden">
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Memory Aids & Mnemonics"
            section="mnemonics"
            count={notes.mnemonics.length}
          />
          <AnimatePresence>
            {expandedSections.mnemonics && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  {notes.mnemonics.map((mnemonic, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4 border border-purple-200"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-2xl">💡</span>
                        <p className="font-semibold text-purple-900">{mnemonic.phrase}</p>
                      </div>
                      <p className="text-sm text-purple-700 ml-8">{mnemonic.explanation}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Exam Tips */}
      {notes.examTips && notes.examTips.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-white shadow-sm overflow-hidden">
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Exam Tips & Strategies"
            section="examTips"
            count={notes.examTips.length}
          />
          <AnimatePresence>
            {expandedSections.examTips && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  {notes.examTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 items-start p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover:border-yellow-300 transition"
                    >
                      <span className="text-xl flex-shrink-0">⭐</span>
                      <p className="text-gray-700 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Common Mistakes */}
      {notes.commonMistakes && notes.commonMistakes.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            title="Common Mistakes to Avoid"
            section="commonMistakes"
            count={notes.commonMistakes.length}
          />
          <AnimatePresence>
            {expandedSections.commonMistakes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  {notes.commonMistakes.map((mistake, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg bg-red-50 p-4 border border-red-200"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl flex-shrink-0">⚠️</span>
                        <p className="font-semibold text-red-900">{mistake.mistake}</p>
                      </div>
                      <div className="ml-8">
                        <p className="text-sm text-red-700 mb-2">{mistake.why}</p>
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                          <p className="text-xs font-semibold text-green-900 mb-1">✓ Instead:</p>
                          <p className="text-sm text-green-700">{mistake.correct}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Reference */}
      {notes.quickReference && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📌</span>
            <h3 className="font-bold text-gray-900">Quick Reference</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(notes.quickReference).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200"
              >
                <span className={`px-2 py-1 rounded text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                  {key}
                </span>
                <span className="text-sm text-gray-700 flex-1">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesSection
