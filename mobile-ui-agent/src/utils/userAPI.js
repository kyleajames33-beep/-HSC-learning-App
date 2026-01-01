import api from './api.js'

const unwrapPayload = (response) => {
  const payload = response?.data ?? {}
  return {
    success: payload?.success ?? true,
    message: payload?.message ?? null,
    data: payload?.data ?? null,
    meta: payload?.meta ?? {},
    raw: payload,
  }
}

const extractData = async (requestPromise) => {
  const response = await requestPromise
  const { data, raw } = unwrapPayload(response)
  return data ?? raw
}

export const userAPI = {
  getProfile: async () => extractData(api.get('/user/profile')),
  getProgress: async () => extractData(api.get('/user/progress')),
  getAchievements: async () => extractData(api.get('/user/achievements')),
  updateDailyGoal: async (goal) => extractData(api.put('/user/daily-goal', { goal })),
  getSubjectProgress: async (subjectId) =>
    extractData(api.get(`/user/subjects/${subjectId}/progress`)),
  updatePreferences: async (preferences) =>
    extractData(api.put('/user/preferences', preferences)),
  recordStudySession: async (sessionData) =>
    extractData(api.post('/user/study-sessions', sessionData)),
  getStudyStreak: async () => extractData(api.get('/user/streak')),
}

const unwrapContent = async (requestPromise) => {
  const response = await requestPromise
  return unwrapPayload(response)
}

const fallbackSubjects = [
  {
    id: 'biology',
    name: 'Biology',
    description: 'HSC Biology Modules 5-8',
    color: '#10b981',
    icon: 'Bio',
    modules: [5, 6, 7, 8],
    progress: 42,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'HSC Chemistry Modules 5-8',
    color: '#8b5cf6',
    icon: 'Chem',
    modules: [5, 6, 7, 8],
    progress: 28,
  },
]

export const contentAPI = {
  async getSubjects() {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      return fallbackSubjects
    }

    try {
      const { data } = await unwrapContent(api.get('/content/subjects'))
      return Array.isArray(data) ? data : fallbackSubjects
    } catch (error) {
      console.warn('Failed to load subjects from API, using fallback subjects')
      return fallbackSubjects
    }
  },

  async getModules(subjectId) {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      return getDemoModules(subjectId)
    }

    try {
      const { data, meta } = await unwrapContent(api.get(`/content/modules/${subjectId}`))
      return {
        modules: Array.isArray(data) ? data : [],
        meta,
      }
    } catch (error) {
      console.warn(`Failed to load modules for ${subjectId}, using fallback data`)
      return getDemoModules(subjectId)
    }
  },

  async getTopics(subjectId, moduleId) {
    const { data, meta } = await unwrapContent(api.get(`/content/topics/${subjectId}/${moduleId}`))
    return {
      topics: Array.isArray(data) ? data : [],
      meta,
    }
  },

  async getRecommendedTopics() {
    return extractData(api.get('/content/recommended'))
  },
}

function getDemoModules(subjectId) {
  if (subjectId === 'biology') {
    return {
      modules: [
        {
          id: 5,
          name: 'Heredity',
          description: 'Genetic inheritance, pedigrees, genetic crosses',
          progress: 65,
        },
        {
          id: 6,
          name: 'Genetic Change',
          description: 'Mutations, biotechnology, genetic engineering',
          progress: 45,
          topics: [
            'Mutagens',
            'Somatic vs Germline',
            'Coding Regions',
            'Evolution Effects',
            'Chromosomal Aberrations',
            'Environmental Factors',
          ],
          inquiry_questions: [
            'How does mutation introduce new alleles into a population?',
            "How do genetic techniques affect Earth's biodiversity?",
            'Does artificial manipulation of DNA have the potential to change populations forever?',
          ],
        },
        {
          id: 7,
          name: 'Infectious Disease',
          description: 'Pathogens, immune responses, epidemiology',
          progress: 20,
        },
        {
          id: 8,
          name: 'Non-infectious Disease',
          description: 'Lifestyle disease, prevention, epidemiology',
          progress: 10,
        },
      ],
      meta: { total: 4 },
    }
  }

  return { modules: [], meta: {} }
}
