import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadModuleConfig } from '../utils/dataLoader'

/**
 * SearchBar - Search across all learn content and dotpoints
 * Provides fast access to any topic across Biology and Chemistry
 */
const SearchBar = ({ onSelectResult, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [allContent, setAllContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all', 'biology', 'chemistry'

  // Load all dotpoint data on mount
  useEffect(() => {
    loadAllContent()
  }, [])

  const loadAllContent = async () => {
    setIsLoading(true)
    try {
      const config = await loadModuleConfig()
      const contentItems = []

      // Build searchable index
      Object.entries(config).forEach(([subjectKey, subject]) => {
        Object.entries(subject.modules).forEach(([moduleNum, module]) => {
          if (module.inquiryQuestions) {
            module.inquiryQuestions.forEach((iq) => {
              if (iq.dotpoints) {
                iq.dotpoints.forEach((dotpoint) => {
                  if (dotpoint.hasContent) {
                    contentItems.push({
                      subject: subjectKey,
                      subjectName: subject.name,
                      subjectIcon: subject.icon,
                      moduleNumber: moduleNum,
                      moduleName: module.name,
                      dotpointId: dotpoint.id,
                      dotpointTitle: dotpoint.title,
                      iqTitle: iq.title,
                      keywords: [
                        dotpoint.title.toLowerCase(),
                        dotpoint.id.toLowerCase(),
                        iq.title.toLowerCase(),
                        module.name.toLowerCase(),
                        subject.name.toLowerCase(),
                      ],
                    })
                  }
                })
              }
            })
          }
        })
      })

      setAllContent(contentItems)
    } catch (error) {
      console.error('Error loading content for search:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allContent.filter((item) => {
      // Apply subject filter
      if (selectedFilter !== 'all' && item.subject !== selectedFilter) {
        return false
      }

      // Check if query matches any keywords
      return item.keywords.some((keyword) => keyword.includes(query))
    })

    // Sort by relevance (exact matches first)
    const sorted = filtered.sort((a, b) => {
      const aExact = a.keywords.some((k) => k === query)
      const bExact = b.keywords.some((k) => k === query)
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      const aStarts = a.keywords.some((k) => k.startsWith(query))
      const bStarts = b.keywords.some((k) => k.startsWith(query))
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1

      return 0
    })

    setResults(sorted.slice(0, 10)) // Limit to 10 results
  }, [searchQuery, allContent, selectedFilter])

  const handleSelectResult = (result) => {
    if (onSelectResult) {
      onSelectResult(result.subject, result.moduleNumber, result.dotpointId)
    }
    setSearchQuery('')
    setResults([])
  }

  const highlightMatch = (text, query) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-20 max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for topics, dotpoints, or modules..."
                autoFocus
                className="flex-1 text-lg outline-none"
              />
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded border border-gray-300 hover:border-gray-400 transition"
              >
                ESC
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('biology')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition ${
                  selectedFilter === 'biology'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🧬 Biology
              </button>
              <button
                onClick={() => setSelectedFilter('chemistry')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition ${
                  selectedFilter === 'chemistry'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚗️ Chemistry
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Loading content...
              </div>
            ) : searchQuery.trim() === '' ? (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-sm font-medium">Start typing to search</p>
                <p className="text-xs mt-1">
                  Search across {allContent.length} topics in Biology and Chemistry
                </p>
              </div>
            ) : results.length === 0 ? (
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs mt-1">Try different keywords or filters</p>
              </div>
            ) : (
              <AnimatePresence>
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.subject}-${result.moduleNumber}-${result.dotpointId}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectResult(result)}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex items-start gap-3">
                      {/* Subject Icon */}
                      <div className="flex-shrink-0 text-2xl">{result.subjectIcon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                            {result.dotpointId}
                          </span>
                          <span className="text-xs text-gray-500">
                            {result.subjectName} M{result.moduleNumber}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {highlightMatch(result.dotpointTitle, searchQuery)}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {result.iqTitle}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
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
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                Showing {results.length} of {allContent.filter(item =>
                  selectedFilter === 'all' || item.subject === selectedFilter
                ).length} results
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SearchBar
