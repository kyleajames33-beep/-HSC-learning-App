import React from 'react'
import { motion } from 'framer-motion'
import moduleConfig from '../data/moduleConfig.json'

const SubjectSelector = ({ onSelectSubject }) => {
  const subjects = Object.entries(moduleConfig)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HSC Learning App
          </h1>
          <p className="text-lg text-gray-600">
            Choose your subject to begin studying
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(([subjectKey, subject]) => (
            <motion.div
              key={subjectKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSubject(subjectKey)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="text-6xl mb-4 text-center">
                {subject.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {subject.name}
              </h2>

              {/* Module Count */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Object.keys(subject.modules).length}
                  </p>
                  <p className="text-sm text-gray-600">Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Object.values(subject.modules).reduce(
                      (sum, mod) => sum + mod.totalDotpoints,
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Dotpoints</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Progress
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(
                      (Object.values(subject.modules).reduce(
                        (sum, mod) => sum + mod.completedDotpoints,
                        0
                      ) /
                        Object.values(subject.modules).reduce(
                          (sum, mod) => sum + mod.totalDotpoints,
                          0
                        )) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      subject.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                    } transition-all`}
                    style={{
                      width: `${
                        (Object.values(subject.modules).reduce(
                          (sum, mod) => sum + mod.completedDotpoints,
                          0
                        ) /
                          Object.values(subject.modules).reduce(
                            (sum, mod) => sum + mod.totalDotpoints,
                            0
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <span className="text-sm font-semibold text-gray-900">
                  Start Studying →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Your Study Stats
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {subjects.reduce(
                  (sum, [, subject]) =>
                    sum +
                    Object.values(subject.modules).reduce(
                      (s, mod) => s + mod.completedDotpoints,
                      0
                    ),
                  0
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Dotpoints Completed
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {subjects.reduce(
                  (sum, [, subject]) =>
                    sum +
                    Object.values(subject.modules).reduce(
                      (s, mod) => s + mod.totalDotpoints,
                      0
                    ),
                  0
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Dotpoints</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {Math.round(
                  (subjects.reduce(
                    (sum, [, subject]) =>
                      sum +
                      Object.values(subject.modules).reduce(
                        (s, mod) => s + mod.completedDotpoints,
                        0
                      ),
                    0
                  ) /
                    subjects.reduce(
                      (sum, [, subject]) =>
                        sum +
                        Object.values(subject.modules).reduce(
                          (s, mod) => s + mod.totalDotpoints,
                          0
                        ),
                      0
                    )) *
                    100
                )}
                %
              </p>
              <p className="text-sm text-gray-600 mt-1">Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectSelector
