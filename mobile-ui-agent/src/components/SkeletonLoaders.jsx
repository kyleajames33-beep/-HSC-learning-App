import React from 'react'
import { motion } from 'framer-motion'

/**
 * Skeleton Loaders - Beautiful loading states for better UX
 * Provides smooth, animated skeletons that match the actual component layouts
 */

// Base skeleton component with shimmer animation
const Skeleton = ({ className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded ${className}`}
  />
)

// Learn Section Card Skeleton
export const LearnSectionSkeleton = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 shadow-sm"
  >
    <div className="flex items-start space-x-4">
      {/* Icon skeleton */}
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />

      <div className="flex-1 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Progress bar skeleton */}
        <div className="pt-2">
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </div>
  </motion.div>
)

// Dotpoint List Skeleton
export const DotpointListSkeleton = () => (
  <div className="space-y-3">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-4/5" />
      </motion.div>
    ))}
  </div>
)

// Dashboard Card Skeleton
export const DashboardCardSkeleton = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 shadow-sm"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>

    {/* Content */}
    <div className="space-y-3">
      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
      <Skeleton className="h-8 w-24 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>

    {/* Button */}
    <Skeleton className="h-12 w-full mt-4 rounded-xl" />
  </motion.div>
)

// Notes Section Skeleton
export const NotesSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
    {/* Summary */}
    <div>
      <Skeleton className="h-5 w-24 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    {/* Key Points */}
    <div>
      <Skeleton className="h-5 w-28 mb-3" />
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-2">
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>

    {/* Mnemonics */}
    <div className="bg-purple-50 rounded-xl p-4">
      <Skeleton className="h-5 w-32 mb-3" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>

    {/* Exam Tips */}
    <div>
      <Skeleton className="h-5 w-28 mb-3" />
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  </div>
)

// Video Player Skeleton
export const VideoSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <Skeleton className="aspect-video w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
)

// Flashcard Skeleton
export const FlashcardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-3xl p-8 shadow-xl min-h-[400px] flex flex-col items-center justify-center space-y-6"
  >
    <Skeleton className="h-8 w-48 mb-4" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-5/6" />
    <Skeleton className="h-6 w-4/6" />
    <div className="pt-8 w-full flex justify-between">
      <Skeleton className="h-12 w-24 rounded-xl" />
      <Skeleton className="h-12 w-24 rounded-xl" />
    </div>
  </motion.div>
)

// Practice Question Skeleton
export const PracticeQuestionSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>

    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-4/5" />

    <div className="pt-4 space-y-3">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
)

// Progress Ring Skeleton
export const ProgressRingSkeleton = ({ size = 120 }) => (
  <div className="flex flex-col items-center space-y-3">
    <Skeleton className={`rounded-full`} style={{ width: size, height: size }} />
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-4 w-24" />
  </div>
)

// Module Card Skeleton
export const ModuleCardSkeleton = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl p-4 shadow-sm"
  >
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-5 w-16" />
    </div>

    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />

    <div className="space-y-2">
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </motion.div>
)

// Quiz Results Skeleton
export const QuizResultsSkeleton = () => (
  <div className="max-w-2xl mx-auto space-y-6 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-xl text-center space-y-6"
    >
      <Skeleton className="w-24 h-24 rounded-full mx-auto" />
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-12 w-32 mx-auto rounded-xl" />

      <div className="grid grid-cols-3 gap-4 pt-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </motion.div>
  </div>
)

// Generic Page Skeleton
export const PageSkeleton = ({ title = true, subtitle = false, cards = 3 }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
    <div className="max-w-md mx-auto space-y-6">
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          {subtitle && <Skeleton className="h-4 w-48" />}
        </div>
      )}

      <div className="space-y-4">
        {Array.from({ length: cards }).map((_, i) => (
          <DashboardCardSkeleton key={i} delay={i * 0.1} />
        ))}
      </div>
    </div>
  </div>
)

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `
  document.head.appendChild(style)
}

export default {
  LearnSectionSkeleton,
  DotpointListSkeleton,
  DashboardCardSkeleton,
  NotesSkeleton,
  VideoSkeleton,
  FlashcardSkeleton,
  PracticeQuestionSkeleton,
  ProgressRingSkeleton,
  ModuleCardSkeleton,
  QuizResultsSkeleton,
  PageSkeleton,
}
