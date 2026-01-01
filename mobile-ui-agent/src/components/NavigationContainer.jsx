import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import SubjectSelector from './SubjectSelector'
import ModuleSelector from './ModuleSelector'
import DotpointSelector from './DotpointSelector'
import LearnPage from './LearnPage'
import PracticeQuestionViewer from './PracticeQuestionViewer'
import SearchBar from './SearchBar'
import BookmarksPanel from './BookmarksPanel'
import { loadLearnSections, loadPracticeQuestions, loadModuleConfig } from '../utils/dataLoader'
import { addToRecent } from '../utils/bookmarks'
import moduleConfig from '../data/moduleConfig.json'

/**
 * NavigationContainer - Main navigation controller
 * Handles routing between Subject → Module → Dotpoint → Learn Page
 */
const NavigationContainer = () => {
  const [view, setView] = useState('subject') // 'subject', 'module', 'dotpoint', 'learn', 'practice'
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedDotpoint, setSelectedDotpoint] = useState(null)
  const [learnData, setLearnData] = useState(null)
  const [practiceQuestions, setPracticeQuestions] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSearch])

  // Helper function to get dotpoint details
  const getDotpointDetails = (subject, moduleNumber, dotpointId) => {
    try {
      const subjectData = moduleConfig[subject]
      const moduleData = subjectData?.modules?.[moduleNumber]

      if (!moduleData) return null

      for (const iq of moduleData.inquiryQuestions || []) {
        for (const dotpoint of iq.dotpoints || []) {
          if (dotpoint.id === dotpointId) {
            return {
              title: dotpoint.title,
              subjectName: subjectData.name,
              moduleName: moduleData.name,
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting dotpoint details:', error)
    }
    return null
  }

  // Navigate to module selection
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject)
    setView('module')
  }

  // Navigate to dotpoint selection
  const handleSelectModule = (moduleNumber) => {
    setSelectedModule(moduleNumber)
    setView('dotpoint')
  }

  // Navigate to learn page
  const handleSelectDotpoint = async (subject, moduleNumber, dotpointId) => {
    setSelectedDotpoint(dotpointId)

    // Add to recent history
    const dotpointDetails = getDotpointDetails(subject, moduleNumber, dotpointId)
    if (dotpointDetails) {
      addToRecent({
        subject,
        moduleNumber,
        dotpointId,
        title: dotpointDetails.title,
        subjectName: dotpointDetails.subjectName,
      })
    }

    // Load learn sections
    const sections = await loadLearnSections(subject, moduleNumber, dotpointId)

    setLearnData({
      sections: sections,
      completionXP: 50, // Bonus XP for completing all sections
    })

    setView('learn')
  }

  // Navigate back to dotpoint selector
  const handleBackFromLearn = () => {
    setView('dotpoint')
    setLearnData(null)
    setSelectedDotpoint(null)
  }

  // Navigate back to module selector
  const handleBackToModules = () => {
    setView('module')
    setSelectedModule(null)
    setSelectedDotpoint(null)
  }

  // Navigate back to subject selector
  const handleBackToSubjects = () => {
    setView('subject')
    setSelectedSubject(null)
    setSelectedModule(null)
    setSelectedDotpoint(null)
  }

  // Handle completion of learn page
  const handleCompleteLearn = () => {
    // Could add achievement logic here
    console.log('Learn page completed!')
    handleBackFromLearn()
  }

  // Navigate to practice questions
  const handleSelectPractice = async (subject, moduleNumber, dotpointId) => {
    setSelectedDotpoint(dotpointId)

    // Add to recent history
    const dotpointDetails = getDotpointDetails(subject, moduleNumber, dotpointId)
    if (dotpointDetails) {
      addToRecent({
        subject,
        moduleNumber,
        dotpointId,
        title: dotpointDetails.title,
        subjectName: dotpointDetails.subjectName,
      })
    }

    // Load practice questions
    const questions = await loadPracticeQuestions(subject, moduleNumber, dotpointId)
    setPracticeQuestions(questions)

    setView('practice')
  }

  // Navigate back from practice
  const handleBackFromPractice = () => {
    setView('dotpoint')
    setPracticeQuestions([])
    setSelectedDotpoint(null)
  }

  // Handle completion of practice questions
  const handleCompletePractice = () => {
    console.log('Practice completed!')
    handleBackFromPractice()
  }

  // Handle search result selection
  const handleSearchSelect = async (subject, moduleNumber, dotpointId) => {
    setShowSearch(false)
    setShowBookmarks(false) // Close bookmarks too if open
    setSelectedSubject(subject)
    setSelectedModule(moduleNumber)
    setSelectedDotpoint(dotpointId)

    // Add to recent history
    const dotpointDetails = getDotpointDetails(subject, moduleNumber, dotpointId)
    if (dotpointDetails) {
      addToRecent({
        subject,
        moduleNumber,
        dotpointId,
        title: dotpointDetails.title,
        subjectName: dotpointDetails.subjectName,
      })
    }

    // Load learn sections
    const sections = await loadLearnSections(subject, moduleNumber, dotpointId)
    setLearnData({
      sections: sections,
      completionXP: 50,
    })

    setView('learn')
  }

  // Render based on current view
  let mainContent
  switch (view) {
    case 'subject':
      mainContent = <SubjectSelector onSelectSubject={handleSelectSubject} />
      break

    case 'module':
      mainContent = (
        <ModuleSelector
          subject={selectedSubject}
          onSelectModule={handleSelectModule}
          onBack={handleBackToSubjects}
        />
      )
      break

    case 'dotpoint':
      mainContent = (
        <DotpointSelector
          subject={selectedSubject}
          moduleNumber={selectedModule}
          onSelectDotpoint={handleSelectDotpoint}
          onSelectPractice={handleSelectPractice}
          onBack={handleBackToModules}
        />
      )
      break

    case 'learn':
      mainContent = (
        <LearnPage
          dotPointId={selectedDotpoint}
          learnPageData={learnData}
          onComplete={handleCompleteLearn}
          onBack={handleBackFromLearn}
          dotPointTitle={`${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} M${selectedModule} - ${selectedDotpoint}`}
        />
      )
      break

    case 'practice':
      mainContent = (
        <PracticeQuestionViewer
          questions={practiceQuestions}
          dotpointId={selectedDotpoint}
          onBack={handleBackFromPractice}
          onComplete={handleCompletePractice}
        />
      )
      break

    default:
      mainContent = <SubjectSelector onSelectSubject={handleSelectSubject} />
  }

  return (
    <>
      {mainContent}

      {/* Floating Search Button */}
      {view !== 'learn' && view !== 'practice' && (
        <button
          onClick={() => setShowSearch(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all z-40 flex items-center justify-center"
          title="Search (Cmd/Ctrl + K)"
        >
          <svg
            className="w-6 h-6"
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
        </button>
      )}

      {/* Floating Bookmarks Button */}
      {view !== 'learn' && view !== 'practice' && (
        <button
          onClick={() => setShowBookmarks(true)}
          className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all z-40 flex items-center justify-center"
          title="Bookmarks & Recent"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      )}

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <SearchBar
            onSelectResult={handleSearchSelect}
            onClose={() => setShowSearch(false)}
          />
        )}
      </AnimatePresence>

      {/* Bookmarks Panel */}
      <AnimatePresence>
        {showBookmarks && (
          <BookmarksPanel
            onSelectDotpoint={handleSearchSelect}
            onClose={() => setShowBookmarks(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default NavigationContainer
