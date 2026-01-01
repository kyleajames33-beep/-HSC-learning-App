const isDev = Boolean(import.meta.env?.DEV)
const devBypass = isDev && import.meta.env?.VITE_DEV_BYPASS_AUTH === 'true'

class ProgressSyncService {
  constructor() {
    this.disabled = devBypass
    this.baseUrls = {
      chemistry: 'http://localhost:3011',
      biology: 'http://localhost:3012',
      progress: 'http://localhost:3013',
      analytics: 'http://localhost:3014',
    }
    this.progressListeners = new Set()
  }

  addProgressListener(listener) {
    this.progressListeners.add(listener)
    return () => this.progressListeners.delete(listener)
  }

  notifyListeners(event) {
    this.progressListeners.forEach((listener) => {
      try {
        listener(event)
      } catch (error) {
        console.warn('Progress listener error', error)
      }
    })
  }

  async syncContentAccess(subject, moduleId, dotPointId, contentType, contentId, userId = 'demo-user') {
    if (this.disabled) {
      return { success: true, offline: true }
    }

    const url = this.resolveAgentUrl(subject, '/api/progress/content-access')
    return this.postJson(url, {
      userId,
      subject,
      moduleId,
      dotPointId,
      contentType,
      contentId,
      timestamp: new Date().toISOString(),
    })
  }

  async syncQuizResults(subject, moduleId, dotPointId, results, userId = 'demo-user') {
    if (this.disabled) {
      return { success: true, offline: true }
    }

    const url = this.resolveAgentUrl(subject, '/api/progress/quiz-results')
    return this.postJson(url, {
      userId,
      subject,
      moduleId,
      dotPointId,
      results,
      timestamp: new Date().toISOString(),
    })
  }

  async syncProgress(subject, moduleId, progressData, userId = 'demo-user') {
    if (this.disabled) {
      return { success: true, offline: true }
    }

    const url = this.resolveAgentUrl('progress', '/api/progress/sync')
    const payload = {
      userId,
      subject,
      moduleId,
      data: progressData,
      timestamp: new Date().toISOString(),
    }

    const result = await this.postJson(url, payload)
    if (result.success) {
      this.notifyListeners({ subject, moduleId, progressData })
    }
    return result
  }

  async getAggregatedProgress(userId = 'demo-user') {
    if (this.disabled) {
      return {
        userId,
        overallProgress: 0,
        dotPoints: [],
      }
    }

    const url = this.resolveAgentUrl('progress', `/api/progress/summary?userId=${userId}`)
    return this.getJson(url, { overallProgress: 0, dotPoints: [] })
  }

  async getProgressAnalytics(subject, moduleId, userId = 'demo-user') {
    if (this.disabled) {
      return { subject, moduleId, userId, analytics: [] }
    }

    const url = this.resolveAgentUrl(
      'analytics',
      `/api/analytics/progress?subject=${subject}&moduleId=${moduleId}&userId=${userId}`,
    )
    return this.getJson(url, { subject, moduleId, userId, analytics: [] })
  }

  async checkSyncHealth() {
    const result = {}

    await Promise.all(
      Object.entries(this.baseUrls).map(async ([agent, baseUrl]) => {
        if (this.disabled) {
          result[agent] = true
          return
        }
        try {
          const response = await fetch(`${baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) })
          result[agent] = response.ok
        } catch {
          result[agent] = false
        }
      }),
    )

    return result
  }

  resolveAgentUrl(agentKey, path) {
    const baseUrl = this.baseUrls[agentKey?.toLowerCase?.()] || this.baseUrls.progress
    return `${baseUrl}${path}`
  }

  async postJson(url, payload, fallback = { success: false, offline: true }) {
    if (!url) return fallback

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        return { success: false, status: response.status }
      }

      const data = await response.json().catch(() => ({}))
      return { success: true, data }
    } catch (error) {
      console.warn(`Failed POST to ${url}`, error)
      return fallback
    }
  }

  async getJson(url, fallback) {
    if (!url) return fallback

    try {
      const response = await fetch(url, { method: 'GET' })
      if (!response.ok) return fallback
      return await response.json()
    } catch (error) {
      console.warn(`Failed GET from ${url}`, error)
      return fallback
    }
  }
}

const progressSyncService = new ProgressSyncService()

export default progressSyncService
