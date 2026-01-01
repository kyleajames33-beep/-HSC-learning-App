import questionService from './questionService'
import contentService from './contentService'
import progressSyncService from './progressSyncService'

class LearningService {
  constructor() {
    this.sessions = new Map()
  }

  async initializeLearningSession(subject, moduleId, userId = 'demo-user') {
    const sessionId = `${subject}-${moduleId}-${userId}-${Date.now()}`

    const serviceHealth = await this.checkServiceHealth()
    const dotPoints = await this.getModuleDotPoints(subject, moduleId)
    const preload = await contentService.preloadContent?.(subject, moduleId, dotPoints.slice(0, 3))
    const existingProgress = await progressSyncService.getAggregatedProgress(userId)

    const session = {
      sessionId,
      subject,
      moduleId,
      userId,
      startedAt: new Date().toISOString(),
      serviceHealth,
      contentPreload: preload,
      existingProgress,
    }

    this.sessions.set(sessionId, session)
    return session
  }

  async getModuleDotPoints() {
    return [
      'IQ1.1',
      'IQ1.2',
      'IQ1.3',
      'IQ1.4',
      'IQ2.1',
      'IQ2.2',
      'IQ2.3',
      'IQ3.1',
      'IQ3.2',
      'IQ3.3',
      'IQ4.1',
      'IQ4.2',
      'IQ4.3',
    ]
  }

  async completeLearningActivity(sessionId, activityType, payload) {
    const session = this.sessions.get(sessionId)
    const details = { ...session, ...payload }
    const { subject, moduleId, dotPointId, userId } = details

    switch (activityType) {
      case 'content_access':
        return progressSyncService.syncContentAccess(
          subject,
          moduleId,
          dotPointId,
          payload.contentType,
          payload.contentId,
          userId,
        )
      case 'quiz_completion':
        return progressSyncService.syncQuizResults(
          subject,
          moduleId,
          dotPointId,
          payload.quizResults,
          userId,
        )
      case 'pathway_navigation':
        return progressSyncService.syncProgress(subject, moduleId, payload, userId)
      default:
        console.warn(`Unknown activity type: ${activityType}`)
        return { success: false, reason: 'unknown_activity' }
    }
  }

  async preloadQuestions(subject, moduleId, dotPointId, quizType) {
    return questionService.fetchQuestions(subject, moduleId, dotPointId, quizType)
  }

  async getLearningAnalytics(subject, moduleId, userId = 'demo-user') {
    const [questions, progress] = await Promise.all([
      questionService.getQuestionStats(subject, moduleId),
      progressSyncService.getProgressAnalytics(subject, moduleId, userId),
    ])

    return {
      subject,
      moduleId,
      userId,
      questions,
      progress,
    }
  }

  async checkServiceHealth() {
    const [questionHealth, progressHealth] = await Promise.all([
      questionService.checkAgentHealth?.() || {},
      progressSyncService.checkSyncHealth(),
    ])

    return {
      checkedAt: new Date().toISOString(),
      questions: questionHealth,
      progress: progressHealth,
    }
  }

  async endLearningSession(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return { success: false, reason: 'session_not_found' }
    }

    const endedAt = new Date().toISOString()
    const result = await progressSyncService.syncProgress(session.subject, session.moduleId, {
      type: 'session_end',
      data: { sessionId, startedAt: session.startedAt, endedAt },
    }, session.userId)

    this.sessions.delete(sessionId)
    return { success: result.success !== false }
  }

  clearCache() {
    this.sessions.clear()
  }

  getCacheStats() {
    return {
      size: this.sessions.size,
      keys: Array.from(this.sessions.keys()),
    }
  }
}

const learningService = new LearningService()

export default learningService
