import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'

const isDev = Boolean(import.meta.env?.DEV)
const devBypass = isDev && import.meta.env?.VITE_DEV_BYPASS_AUTH === 'true'
const hasWindow = typeof window !== 'undefined'

const defaultSubjects = [
  {
    id: 'biology',
    name: 'Biology',
    icon: 'BIO',
    color: 'from-green-400 to-emerald-500',
    lastStudied: 'Not yet started',
    progress: 0
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'CHEM',
    color: 'from-sky-500 to-indigo-500',
    lastStudied: 'Not yet started',
    progress: 0
  }
]

const offlineUserData = {
  id: 'dev-user-123',
  name: 'Dev User',
  achievements: [],
  subjects: defaultSubjects,
  leaderboard: [],
  currentXP: 0,
  currentLevel: 1,
  streak: {
    currentStreak: 0,
    longestStreak: 0
  }
}

const resolveUserId = (explicitId) => {
  if (explicitId) {
    return explicitId
  }

  if (!hasWindow) {
    return null
  }

  try {
    const storedUserRaw = window.localStorage.getItem('user')
    if (!storedUserRaw) {
      return null
    }

    const storedUser = JSON.parse(storedUserRaw)
    return storedUser?.id || storedUser?._id || null
  } catch (error) {
    console.warn('[useUserData] Failed to parse stored user', error)
    return null
  }
}

const applyOfflineDefaults = (overrideId) => {
  if (overrideId) {
    return {
      ...offlineUserData,
      id: overrideId
    }
  }
  return offlineUserData
}

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const resolvedUserId = useMemo(() => resolveUserId(userId), [userId])

  const fetchData = useCallback(async () => {
    // Offline/dev bypass mode: serve mock data immediately
    if (devBypass) {
      setUserData(applyOfflineDefaults(resolvedUserId || offlineUserData.id))
      setError(null)
      setLoading(false)
      return
    }

    if (!resolvedUserId) {
      setUserData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch user achievements and progress from real endpoint
      const response = await axios.get(`/api/achievements/user/${resolvedUserId}`)

      if (response.data && response.data.success) {
        // Transform achievement data to match expected format
        const achievementData = response.data.data || {}
        const transformedData = {
          id: resolvedUserId,
          achievements: achievementData.userAchievements || [],
          currentXP: achievementData.summary?.total_xp || 0,
          currentLevel: Math.floor((achievementData.summary?.total_xp || 0) / 1000) + 1,
          streak: {
            currentStreak: achievementData.summary?.current_streak || 0,
            longestStreak: achievementData.summary?.longest_streak || 0
          },
          subjects: defaultSubjects, // Keep default subjects for now
          leaderboard: [] // Will be fetched separately if needed
        }
        setUserData(transformedData)
      } else {
        throw new Error(response.data?.message || 'Failed to fetch user data')
      }
    } catch (err) {
      if (isDev) {
        console.warn('[useUserData] Falling back to offline data due to request error:', err)
      }
      setError(err)
      setUserData(applyOfflineDefaults(resolvedUserId))
    } finally {
      setLoading(false)
    }
  }, [resolvedUserId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const achievements = userData?.achievements ?? userData?.recentAchievements ?? []
  const normalizedSubjects = userData?.subjects ?? userData?.learningModules ?? []
  const subjects = normalizedSubjects.length > 0 ? normalizedSubjects : defaultSubjects
  const leaderboard = userData?.leaderboard ?? []
  const streak = userData?.streak ?? userData?.currentStreak ?? 0
  const xp = userData?.xp ?? userData?.currentXP ?? 0
  const level = userData?.level ?? userData?.currentLevel ?? 1

  return {
    userData,
    achievements,
    subjects,
    leaderboard,
    streak,
    xp,
    level,
    loading,
    error,
    refetch: fetchData
  }
}

export default useUserData
