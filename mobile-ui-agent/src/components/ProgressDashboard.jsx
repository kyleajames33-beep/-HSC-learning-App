import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loadModuleConfig, getTotalXP, getProgress } from '../utils/dataLoader'

/**
 * ProgressDashboard - Beautiful analytics showing student progress
 * Displays XP, completion rates, study streaks, and recommendations
 */
const ProgressDashboard = ({ onClose }) => {
  const [stats, setStats] = useState({
    totalXP: 0,
    biologyXP: 0,
    chemistryXP: 0,
    completedDotpoints: 0,
    totalDotpoints: 97,
    studyStreak: 0,
    lastStudyDate: null,
    moduleProgress: {},
  })

  useEffect(() => {
    calculateStats()
  }, [])

  const calculateStats = async () => {
    const config = await loadModuleConfig()

    // Calculate XP
    const biologyXP = getTotalXP('biology')
    const chemistryXP = getTotalXP('chemistry')
    const totalXP = biologyXP + chemistryXP

    // Calculate completed dotpoints and module progress
    let completedCount = 0
    const moduleProgress = {}

    for (const [subject, subjectData] of Object.entries(config)) {
      for (const [moduleNum, moduleData] of Object.entries(subjectData.modules || {})) {
        const key = `${subject}_m${moduleNum}`
        let moduleCompleted = 0
        let moduleTotal = 0

        for (const iq of moduleData.inquiryQuestions || []) {
          for (const dotpoint of iq.dotpoints || []) {
            if (dotpoint.hasContent) {
              moduleTotal++
              // Check if all 7 sections are complete
              const sectionTypes = ['video', 'cards', 'podcast', 'flashcards', 'worked-example', 'detailed-content', 'notes']
              const allComplete = sectionTypes.every(type => {
                const progress = getProgress(subject, moduleNum, dotpoint.id, type)
                return progress && progress.completed
              })

              if (allComplete) {
                moduleCompleted++
                completedCount++
              }
            }
          }
        }

        moduleProgress[key] = {
          completed: moduleCompleted,
          total: moduleTotal,
          percentage: moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0,
          name: moduleData.name,
          subject: subjectData.name,
        }
      }
    }

    // Calculate study streak
    const { streak, lastDate } = calculateStreak()

    setStats({
      totalXP,
      biologyXP,
      chemistryXP,
      completedDotpoints: completedCount,
      totalDotpoints: 97,
      studyStreak: streak,
      lastStudyDate: lastDate,
      moduleProgress,
    })
  }

  const calculateStreak = () => {
    const studyDates = []

    // Get all study dates from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('progress_')) {
        const data = localStorage.getItem(key)
        if (data) {
          const progress = JSON.parse(data)
          if (progress.timestamp) {
            const date = new Date(progress.timestamp).toDateString()
            if (!studyDates.includes(date)) {
              studyDates.push(date)
            }
          }
        }
      }
    }

    if (studyDates.length === 0) return { streak: 0, lastDate: null }

    // Sort dates
    studyDates.sort((a, b) => new Date(b) - new Date(a))

    // Calculate streak
    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (studyDates[0] === today || studyDates[0] === yesterday) {
      streak = 1
      let currentDate = new Date(studyDates[0])

      for (let i = 1; i < studyDates.length; i++) {
        const prevDate = new Date(currentDate)
        prevDate.setDate(prevDate.getDate() - 1)

        if (studyDates[i] === prevDate.toDateString()) {
          streak++
          currentDate = new Date(studyDates[i])
        } else {
          break
        }
      }
    }

    return { streak, lastDate: studyDates[0] }
  }

  const completionPercentage = Math.round((stats.completedDotpoints / stats.totalDotpoints) * 100)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Your Progress
              </h1>
              <p className="text-gray-300">
                Track your learning journey across all modules
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* XP Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-3xl font-bold mb-1">{stats.totalXP.toLocaleString()}</div>
              <div className="text-yellow-100 text-sm">Total XP Earned</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="text-5xl mb-2">🧬</div>
              <div className="text-3xl font-bold mb-1">{stats.biologyXP.toLocaleString()}</div>
              <div className="text-green-100 text-sm">Biology XP</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="text-5xl mb-2">⚗️</div>
              <div className="text-3xl font-bold mb-1">{stats.chemistryXP.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Chemistry XP</div>
            </motion.div>
          </div>

          {/* Overall Progress & Streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Overall Completion */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Completion</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {stats.completedDotpoints} of {stats.totalDotpoints} dotpoints
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {stats.totalDotpoints - stats.completedDotpoints} dotpoints remaining
              </p>
            </motion.div>

            {/* Study Streak */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4">Study Streak</h2>
              <div className="flex items-center gap-4">
                <div className="text-6xl">🔥</div>
                <div>
                  <div className="text-5xl font-bold">{stats.studyStreak}</div>
                  <div className="text-purple-100 text-sm">
                    {stats.studyStreak === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
              {stats.lastStudyDate && (
                <p className="text-purple-100 text-sm mt-4">
                  Last studied: {new Date(stats.lastStudyDate).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          </div>

          {/* Module Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress by Module</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.moduleProgress).map(([key, module], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
                >
                  <div className="text-2xl mb-2">
                    {key.startsWith('biology') ? '🧬' : '⚗️'}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{module.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{module.subject}</p>

                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        {module.completed}/{module.total}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{module.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          key.startsWith('biology') ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${module.percentage}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">Keep Going! 🚀</h2>
            <p className="text-indigo-100 mb-4">
              You're making great progress! {completionPercentage >= 50 && "You're over halfway there!"}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-sm text-indigo-100">Dotpoints to go</div>
                <div className="text-2xl font-bold">{stats.totalDotpoints - stats.completedDotpoints}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-sm text-indigo-100">Average completion</div>
                <div className="text-2xl font-bold">{completionPercentage}%</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProgressDashboard
