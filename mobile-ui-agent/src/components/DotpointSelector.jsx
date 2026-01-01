import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import moduleConfig from '../data/moduleConfig.json'
import { isBookmarked, toggleBookmark } from '../utils/bookmarks'

const DotpointSelector = ({ subject, moduleNumber, onSelectDotpoint, onSelectPractice, onBack }) => {
  const subjectData = moduleConfig[subject]
  const moduleData = subjectData.modules[moduleNumber]
  const [bookmarkedDotpoints, setBookmarkedDotpoints] = useState({})

  // For now, we'll use Biology M5's detailed inquiry questions if available
  // Otherwise show a simple list
  const inquiryQuestions = moduleData.inquiryQuestions || []

  // Load bookmark status for all dotpoints
  useEffect(() => {
    const bookmarks = {}
    inquiryQuestions.forEach((iq) => {
      iq.dotpoints.forEach((dotpoint) => {
        bookmarks[dotpoint.id] = isBookmarked(subject, moduleNumber, dotpoint.id)
      })
    })
    setBookmarkedDotpoints(bookmarks)
  }, [subject, moduleNumber, inquiryQuestions])

  // Handle bookmark toggle
  const handleToggleBookmark = (dotpoint, e) => {
    e.stopPropagation()
    const newStatus = toggleBookmark({
      subject,
      moduleNumber,
      dotpointId: dotpoint.id,
      title: dotpoint.title,
      subjectName: subjectData.name,
    })
    setBookmarkedDotpoints((prev) => ({
      ...prev,
      [dotpoint.id]: newStatus,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back to Modules
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{subjectData.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Module {moduleNumber}: {moduleData.name}
              </h1>
              <p className="text-gray-600">{moduleData.description}</p>
            </div>
          </div>

          {/* Module Progress */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Module Progress
              </span>
              <span className="text-sm font-medium text-gray-900">
                {moduleData.completedDotpoints}/{moduleData.totalDotpoints} dotpoints
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  subjectData.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${
                    moduleData.totalDotpoints > 0
                      ? (moduleData.completedDotpoints / moduleData.totalDotpoints) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Inquiry Questions */}
        {inquiryQuestions.length > 0 ? (
          <div className="space-y-6">
            {inquiryQuestions.map((iq, iqIndex) => (
              <div
                key={iq.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {/* IQ Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {iq.id}: {iq.title}
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>

                {/* Dotpoints */}
                <div className="grid grid-cols-1 gap-3">
                  {iq.dotpoints.map((dotpoint) => (
                    <div
                      key={dotpoint.id}
                      className={`
                        rounded-lg border p-4 transition-all
                        ${
                          dotpoint.hasContent
                            ? 'border-gray-200 bg-white'
                            : 'border-gray-100 bg-gray-50 opacity-60'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        {/* Dotpoint ID Badge */}
                        <div
                          className={`
                            flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center font-bold
                            ${
                              dotpoint.hasContent
                                ? subjectData.color === 'green'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                                : 'bg-gray-200 text-gray-500'
                            }
                          `}
                        >
                          {dotpoint.id}
                        </div>

                        {/* Dotpoint Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {dotpoint.title}
                            </h3>
                            {dotpoint.hasContent && (
                              <button
                                onClick={(e) => handleToggleBookmark(dotpoint, e)}
                                className={`p-1.5 rounded-lg transition ${
                                  bookmarkedDotpoints[dotpoint.id]
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                }`}
                                title={bookmarkedDotpoints[dotpoint.id] ? 'Remove bookmark' : 'Add bookmark'}
                              >
                                <svg className="w-4 h-4" fill={bookmarkedDotpoints[dotpoint.id] ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {dotpoint.hasContent ? (
                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
                                ✓ Content Available
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600 font-medium">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {dotpoint.hasContent && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelectDotpoint(subject, moduleNumber, dotpoint.id)}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
                          >
                            📚 Learn
                          </button>
                          {onSelectPractice && (
                            <button
                              onClick={() => onSelectPractice(subject, moduleNumber, dotpoint.id)}
                              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition bg-purple-600 text-white hover:bg-purple-700"
                            >
                              ✏️ Practice
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-2">
              Content for this module is being prepared.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon for comprehensive learn sections!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DotpointSelector
