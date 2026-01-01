import { quizAPI } from './quizAPI.js';

// Cache for quiz statistics (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let statisticsCache = {
  data: null,
  timestamp: 0,
  loading: false
};

// Helper functions for statistical calculations
const calculateMean = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

const calculateMedian = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

const calculateStandardDeviation = (numbers) => {
  if (!numbers || numbers.length <= 1) return 0;
  const mean = calculateMean(numbers);
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  const variance = calculateMean(squaredDiffs);
  return Math.sqrt(variance);
};

// Get date ranges for trends
const getDateRanges = () => {
  const now = new Date();
  const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  return {
    last7Days: last7Days.toISOString().split('T')[0],
    last30Days: last30Days.toISOString().split('T')[0],
    today: now.toISOString().split('T')[0]
  };
};

// Filter quiz results by date range
const filterByDateRange = (quizResults, startDate, endDate = null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  return quizResults.filter(quiz => {
    const quizDate = new Date(quiz.completedAt || quiz.timestamp || quiz.date);
    return quizDate >= start && quizDate <= end;
  });
};

// Filter quiz results by subject
const filterBySubject = (quizResults, subject) => {
  if (!subject) return quizResults;
  return quizResults.filter(quiz => 
    quiz.subject === subject || quiz.subjectId === subject
  );
};

// Filter quiz results by module
const filterByModule = (quizResults, moduleId) => {
  if (!moduleId) return quizResults;
  return quizResults.filter(quiz => 
    quiz.module === moduleId || quiz.moduleId === moduleId
  );
};

// Calculate comprehensive quiz statistics
const calculateQuizStatistics = (quizResults) => {
  if (!quizResults || quizResults.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      medianScore: 0,
      bestScore: 0,
      worstScore: 0,
      standardDeviation: 0,
      totalQuestions: 0,
      perfectScores: 0,
      improvementTrend: 0,
      subjectBreakdown: {},
      moduleBreakdown: {},
      recentTrends: {
        last7Days: { count: 0, avgScore: 0 },
        last30Days: { count: 0, avgScore: 0 }
      }
    };
  }

  // Extract scores and ensure they're numbers
  const scores = quizResults
    .map(quiz => {
      const score = quiz.score || quiz.percentage || quiz.finalScore;
      return typeof score === 'number' ? score : parseFloat(score) || 0;
    })
    .filter(score => !isNaN(score) && score >= 0 && score <= 100);

  if (scores.length === 0) {
    return {
      totalQuizzes: quizResults.length,
      averageScore: 0,
      medianScore: 0,
      bestScore: 0,
      worstScore: 0,
      standardDeviation: 0,
      totalQuestions: 0,
      perfectScores: 0,
      improvementTrend: 0,
      subjectBreakdown: {},
      moduleBreakdown: {},
      recentTrends: {
        last7Days: { count: 0, avgScore: 0 },
        last30Days: { count: 0, avgScore: 0 }
      }
    };
  }

  // Basic statistics
  const averageScore = calculateMean(scores);
  const medianScore = calculateMedian(scores);
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);
  const standardDeviation = calculateStandardDeviation(scores);
  const perfectScores = scores.filter(score => score === 100).length;
  const totalQuestions = quizResults.reduce((sum, quiz) => 
    sum + (quiz.totalQuestions || quiz.questionsAnswered || 0), 0
  );

  // Calculate improvement trend (compare first half vs second half of results)
  const midPoint = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, midPoint);
  const secondHalf = scores.slice(midPoint);
  const improvementTrend = firstHalf.length > 0 && secondHalf.length > 0 
    ? calculateMean(secondHalf) - calculateMean(firstHalf)
    : 0;

  // Subject breakdown
  const subjectBreakdown = {};
  const subjectGroups = quizResults.reduce((groups, quiz) => {
    const subject = quiz.subject || quiz.subjectId || 'unknown';
    if (!groups[subject]) groups[subject] = [];
    const score = quiz.score || quiz.percentage || quiz.finalScore;
    if (typeof score === 'number' && !isNaN(score)) {
      groups[subject].push(score);
    }
    return groups;
  }, {});

  Object.keys(subjectGroups).forEach(subject => {
    const subjectScores = subjectGroups[subject];
    if (subjectScores.length > 0) {
      subjectBreakdown[subject] = {
        totalQuizzes: subjectScores.length,
        averageScore: calculateMean(subjectScores),
        medianScore: calculateMedian(subjectScores),
        bestScore: Math.max(...subjectScores),
        worstScore: Math.min(...subjectScores)
      };
    }
  });

  // Module breakdown
  const moduleBreakdown = {};
  const moduleGroups = quizResults.reduce((groups, quiz) => {
    const module = quiz.module || quiz.moduleId || 'unknown';
    if (!groups[module]) groups[module] = [];
    const score = quiz.score || quiz.percentage || quiz.finalScore;
    if (typeof score === 'number' && !isNaN(score)) {
      groups[module].push(score);
    }
    return groups;
  }, {});

  Object.keys(moduleGroups).forEach(module => {
    const moduleScores = moduleGroups[module];
    if (moduleScores.length > 0) {
      moduleBreakdown[module] = {
        totalQuizzes: moduleScores.length,
        averageScore: calculateMean(moduleScores),
        medianScore: calculateMedian(moduleScores),
        bestScore: Math.max(...moduleScores),
        worstScore: Math.min(...moduleScores)
      };
    }
  });

  // Recent trends
  const dateRanges = getDateRanges();
  const last7DaysResults = filterByDateRange(quizResults, dateRanges.last7Days);
  const last30DaysResults = filterByDateRange(quizResults, dateRanges.last30Days);

  const last7DaysScores = last7DaysResults
    .map(quiz => quiz.score || quiz.percentage || quiz.finalScore)
    .filter(score => typeof score === 'number' && !isNaN(score));

  const last30DaysScores = last30DaysResults
    .map(quiz => quiz.score || quiz.percentage || quiz.finalScore)
    .filter(score => typeof score === 'number' && !isNaN(score));

  return {
    totalQuizzes: quizResults.length,
    averageScore: Math.round(averageScore * 100) / 100,
    medianScore: Math.round(medianScore * 100) / 100,
    bestScore: Math.round(bestScore * 100) / 100,
    worstScore: Math.round(worstScore * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    totalQuestions,
    perfectScores,
    improvementTrend: Math.round(improvementTrend * 100) / 100,
    subjectBreakdown,
    moduleBreakdown,
    recentTrends: {
      last7Days: {
        count: last7DaysResults.length,
        avgScore: last7DaysScores.length > 0 
          ? Math.round(calculateMean(last7DaysScores) * 100) / 100 
          : 0
      },
      last30Days: {
        count: last30DaysResults.length,
        avgScore: last30DaysScores.length > 0 
          ? Math.round(calculateMean(last30DaysScores) * 100) / 100 
          : 0
      }
    }
  };
};

// Main function to get quiz statistics with caching
export const getQuizStatistics = async (forceRefresh = false) => {
  const now = Date.now();
  
  // Return cached data if it's still valid and not forcing refresh
  if (!forceRefresh && 
      statisticsCache.data && 
      (now - statisticsCache.timestamp) < CACHE_DURATION) {
    return {
      ...statisticsCache.data,
      fromCache: true,
      lastUpdated: new Date(statisticsCache.timestamp).toISOString()
    };
  }

  // If already loading, return a promise that waits for the loading to complete
  if (statisticsCache.loading) {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!statisticsCache.loading) {
          resolve({
            ...statisticsCache.data,
            fromCache: true,
            lastUpdated: new Date(statisticsCache.timestamp).toISOString()
          });
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  try {
    statisticsCache.loading = true;

    // Fetch all quiz results
    const quizResults = await quizAPI.getAllQuizResults();
    
    // Calculate statistics
    const statistics = calculateQuizStatistics(quizResults);
    
    // Update cache
    statisticsCache = {
      data: statistics,
      timestamp: now,
      loading: false
    };

    return {
      ...statistics,
      fromCache: false,
      lastUpdated: new Date(now).toISOString()
    };

  } catch (error) {
    console.error('Error calculating quiz statistics:', error);
    statisticsCache.loading = false;
    
    // Return cached data if available, otherwise return empty statistics
    if (statisticsCache.data) {
      return {
        ...statisticsCache.data,
        fromCache: true,
        error: error.message,
        lastUpdated: new Date(statisticsCache.timestamp).toISOString()
      };
    }
    
    return {
      ...calculateQuizStatistics([]),
      fromCache: false,
      error: error.message,
      lastUpdated: new Date(now).toISOString()
    };
  }
};

// Get statistics for a specific subject
export const getSubjectStatistics = async (subject, forceRefresh = false) => {
  try {
    const quizResults = await quizAPI.getAllQuizResults();
    const filteredResults = filterBySubject(quizResults, subject);
    return calculateQuizStatistics(filteredResults);
  } catch (error) {
    console.error(`Error calculating statistics for ${subject}:`, error);
    return calculateQuizStatistics([]);
  }
};

// Get statistics for a specific module
export const getModuleStatistics = async (moduleId, forceRefresh = false) => {
  try {
    const quizResults = await quizAPI.getAllQuizResults();
    const filteredResults = filterByModule(quizResults, moduleId);
    return calculateQuizStatistics(filteredResults);
  } catch (error) {
    console.error(`Error calculating statistics for module ${moduleId}:`, error);
    return calculateQuizStatistics([]);
  }
};

// Get statistics for a specific date range
export const getDateRangeStatistics = async (startDate, endDate = null, subject = null) => {
  try {
    const quizResults = await quizAPI.getAllQuizResults();
    let filteredResults = filterByDateRange(quizResults, startDate, endDate);
    
    if (subject) {
      filteredResults = filterBySubject(filteredResults, subject);
    }
    
    return calculateQuizStatistics(filteredResults);
  } catch (error) {
    console.error('Error calculating date range statistics:', error);
    return calculateQuizStatistics([]);
  }
};

// Clear the statistics cache
export const clearStatisticsCache = () => {
  statisticsCache = {
    data: null,
    timestamp: 0,
    loading: false
  };
};

// Get cache status
export const getCacheStatus = () => {
  const now = Date.now();
  const isValid = statisticsCache.data && (now - statisticsCache.timestamp) < CACHE_DURATION;
  const age = statisticsCache.timestamp ? now - statisticsCache.timestamp : 0;
  
  return {
    hasData: !!statisticsCache.data,
    isValid,
    age,
    lastUpdated: statisticsCache.timestamp ? new Date(statisticsCache.timestamp).toISOString() : null,
    loading: statisticsCache.loading
  };
};

export default {
  getQuizStatistics,
  getSubjectStatistics,
  getModuleStatistics,
  getDateRangeStatistics,
  clearStatisticsCache,
  getCacheStatus
};