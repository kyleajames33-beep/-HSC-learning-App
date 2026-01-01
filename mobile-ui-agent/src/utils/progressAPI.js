import api from './api.js';

const unwrapPayload = (response) => {
  const payload = response?.data ?? {};
  return {
    success: payload?.success ?? true,
    message: payload?.message ?? null,
    data: payload?.data ?? null,
    meta: payload?.meta ?? {},
    raw: payload,
  };
};

const extractData = async (requestPromise) => {
  try {
    const response = await requestPromise;
    const { data, raw } = unwrapPayload(response);
    return data ?? raw;
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Add specific error context
    if (error.response) {
      // HTTP error
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      if (status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (status === 403) {
        throw new Error('Access denied. You do not have permission to perform this action.');
      } else if (status === 404) {
        throw new Error('Resource not found. The requested data may have been deleted.');
      } else if (status === 409) {
        throw new Error('Conflict detected. Your data may be out of sync.');
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Request failed: ${message}`);
      }
    } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      throw new Error('Network error. Check your internet connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const progressAPI = {
  // Save complete user progress
  saveProgress: async (progressData) => extractData(api.post('/api/progress/save', progressData)),

  // Get user progress from backend
  getProgress: async () => extractData(api.get('/api/progress')),

  // Save quiz completion specifically
  saveQuizCompletion: async (quizData) => extractData(api.post('/api/progress/quiz', quizData)),

  // Bulk sync progress data (for conflict resolution)
  bulkSync: async (progressUpdates) => extractData(api.post('/api/progress/bulk-sync', progressUpdates)),

  // Get last sync timestamp
  getLastSync: async () => extractData(api.get('/api/progress/last-sync')),

  // Update daily goal
  updateDailyGoal: async (goal) => extractData(api.put('/api/progress/daily-goal', { goal })),

  // Get progress for specific subject
  getSubjectProgress: async (subjectId) => extractData(api.get(`/api/progress/subjects/${subjectId}`)),

  // Reset progress for a subject
  resetSubjectProgress: async (subjectId) => extractData(api.delete(`/api/progress/subjects/${subjectId}`)),

  // Health check for sync availability
  checkSyncHealth: async () => {
    try {
      const response = await api.get('/api/progress/health', { timeout: 5000 });
      return { 
        available: true, 
        data: response.data,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Progress API health check failed:', error.message);
      return { 
        available: false, 
        error: error.message,
        timestamp: Date.now(),
        shouldRetry: !error.response || error.response.status >= 500
      };
    }
  }
};