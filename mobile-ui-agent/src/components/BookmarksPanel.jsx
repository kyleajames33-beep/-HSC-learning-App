import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBookmarks, getRecent, removeBookmark } from '../utils/bookmarks'
import moduleConfig from '../data/moduleConfig.json'

/**
 * BookmarksPanel - Beautiful sidebar showing bookmarks and recent history
 */
const BookmarksPanel = ({ onSelectDotpoint, onClose }) => {
  const [activeTab, setActiveTab] = useState('bookmarks') // 'bookmarks' or 'recent'
  const [bookmarks, setBookmarks] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setBookmarks(getBookmarks())
    setRecent(getRecent(15))
  }

  const handleRemoveBookmark = (subject, moduleNumber, dotpointId, e) => {
    e.stopPropagation()
    removeBookmark(subject, moduleNumber, dotpointId)
    loadData()
  }

  const handleSelectItem = (item) => {
    if (onSelectDotpoint) {
      onSelectDotpoint(item.subject, item.moduleNumber, item.dotpointId)
    }
    if (onClose) {
      onClose()
    }
  }

  const getSubjectIcon = (subject) => {
    return moduleConfig[subject]?.icon || '📚'
  }

  const getSubjectColor = (subject) => {
    return moduleConfig[subject]?.color === 'green' ? 'green' : 'blue'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const renderItems = (items, showRemove = false) => {
    if (items.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                showRemove
                  ? 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                  : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              }
            />
          </svg>
          <p className="text-sm font-medium">
            {showRemove ? 'No bookmarks yet' : 'No recent activity'}
          </p>
          <p className="text-xs mt-1">
            {showRemove
              ? 'Bookmark dotpoints to quickly access them later'
              : 'Your recently viewed dotpoints will appear here'}
          </p>
        </div>
      )
    }

    return (
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <motion.div
            key={`${item.subject}-${item.moduleNumber}-${item.dotpointId}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelectItem(item)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition group"
          >
            <div className="flex items-start gap-3">
              {/* Subject Icon */}
              <div className="flex-shrink-0 text-2xl">
                {getSubjectIcon(item.subject)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      getSubjectColor(item.subject) === 'green'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.dotpointId}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.subjectName || item.subject} M{item.moduleNumber}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.title || item.dotpointTitle}
                </h4>
                {item.timestamp && (
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(item.timestamp)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {showRemove && (
                  <button
                    onClick={(e) =>
                      handleRemoveBookmark(
                        item.subject,
                        item.moduleNumber,
                        item.dotpointId,
                        e
                      )
                    }
                    className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                    title="Remove bookmark"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Quick Access</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'bookmarks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                  {bookmarks.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Recent</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'bookmarks' ? (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderItems(bookmarks, true)}
            </motion.div>
          ) : (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderItems(recent, false)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookmarksPanel
