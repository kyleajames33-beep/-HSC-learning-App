import React from 'react'
import { motion } from 'framer-motion'
import moduleConfig from '../data/moduleConfig.json'

const ModuleSelector = ({ subject, onSelectModule, onBack }) => {
  const subjectData = moduleConfig[subject]
  const modules = Object.values(subjectData.modules)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back to Subjects
          </button>
          <div className="text-center">
            <div className="text-5xl mb-2">{subjectData.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {subjectData.name}
            </h1>
            <p className="text-lg text-gray-600">
              Select a module to begin studying
            </p>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => {
            const completionPercent = module.totalDotpoints > 0
              ? Math.round(
                  (module.completedDotpoints / module.totalDotpoints) * 100
                )
              : 0

            const isAvailable = module.completedDotpoints > 0 || module.number === 5

            return (
              <motion.div
                key={module.number}
                whileHover={isAvailable ? { scale: 1.03 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
                onClick={() => isAvailable && onSelectModule(module.number)}
                className={`
                  rounded-xl border p-6 shadow-sm transition-all
                  ${
                    isAvailable
                      ? 'cursor-pointer border-gray-200 bg-white hover:shadow-md'
                      : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60'
                  }
                `}
              >
                {/* Module Number Badge */}
                <div
                  className={`
                    inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4
                    ${
                      isAvailable
                        ? subjectData.color === 'green'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {module.number}
                </div>

                {/* Module Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {module.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {module.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-600">
                    {module.completedDotpoints}/{module.totalDotpoints} dotpoints
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    {completionPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      subjectData.color === 'green'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  {!isAvailable && (
                    <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs font-medium">
                      Coming Soon
                    </span>
                  )}
                  {isAvailable && completionPercent === 100 && (
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                      ✓ Complete
                    </span>
                  )}
                  {isAvailable && completionPercent > 0 && completionPercent < 100 && (
                    <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">
                      In Progress
                    </span>
                  )}
                  {isAvailable && completionPercent === 0 && (
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                      Start Here
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Module Info Section */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            About HSC {subjectData.name} Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">What you'll learn:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Comprehensive content for each dotpoint</li>
                <li>• Video lessons and interactive flashcards</li>
                <li>• HSC-style practice questions</li>
                <li>• Worked examples with step-by-step solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Study Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Track your progress with XP rewards</li>
                <li>• Earn achievements for completing modules</li>
                <li>• Review notes and summaries</li>
                <li>• Exam tips and common mistakes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleSelector
