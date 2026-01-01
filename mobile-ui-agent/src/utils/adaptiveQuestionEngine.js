import React from 'react';
class AdaptiveQuestionEngine {
  constructor() {
    this.learningModel = {
      knowledgeState: {},
      difficultyPreferences: {},
      learningVelocity: {},
      masteryThresholds: {
        expert: 90,
        proficient: 75,
        competent: 60,
        developing: 45,
        novice: 0
      },
      questionTypeWeights: {
        'multiple-choice': 1.0,
        'multiple-select': 1.2,
        'drag-sequence': 1.3,
        'image-hotspot': 1.4,
        'category-sort': 1.5,
        'timeline-builder': 1.6,
        'flowchart-complete': 1.7,
        'graph-construct': 1.8,
        'slider-scale': 1.3,
        'venn-diagram': 1.6,
        'virtual-microscope': 1.9
      }
    };
    
    this.init();
  }

  init() {
    try {
      const savedModel = localStorage.getItem('adaptiveLearningModel');
      if (savedModel) {
        this.learningModel = { ...this.learningModel, ...JSON.parse(savedModel) };
      }
    } catch (error) {
      console.error('Error loading adaptive learning model:', error);
    }
  }

  saveModel() {
    try {
      localStorage.setItem('adaptiveLearningModel', JSON.stringify(this.learningModel));
    } catch (error) {
      console.error('Error saving adaptive learning model:', error);
    }
  }

  updateKnowledgeState(dotPoint, questionType, performance) {
    if (!this.learningModel.knowledgeState[dotPoint]) {
      this.learningModel.knowledgeState[dotPoint] = {};
    }

    if (!this.learningModel.knowledgeState[dotPoint][questionType]) {
      this.learningModel.knowledgeState[dotPoint][questionType] = {
        attempts: 0,
        correctAttempts: 0,
        averageScore: 0,
        totalScore: 0,
        averageTime: 0,
        totalTime: 0,
        confidence: [],
        lastAttempt: null,
        masteryLevel: 'novice',
        consistencyScore: 0,
        recentScores: []
      };
    }

    const state = this.learningModel.knowledgeState[dotPoint][questionType];
    
    state.attempts += 1;
    if (performance.correct) state.correctAttempts += 1;
    
    state.totalScore += performance.score;
    state.averageScore = state.totalScore / state.attempts;
    
    state.totalTime += performance.timeSpent;
    state.averageTime = state.totalTime / state.attempts;
    
    if (performance.confidence) {
      state.confidence.push(performance.confidence);
      if (state.confidence.length > 10) {
        state.confidence = state.confidence.slice(-10);
      }
    }
    
    state.lastAttempt = performance.timestamp;
    state.recentScores.push(performance.score);
    if (state.recentScores.length > 5) {
      state.recentScores = state.recentScores.slice(-5);
    }
    
    state.consistencyScore = this.calculateConsistency(state.recentScores);
    state.masteryLevel = this.calculateMasteryLevel(state);
    
    this.updateLearningVelocity(dotPoint, questionType, performance);
    this.saveModel();
  }

  calculateConsistency(scores) {
    if (scores.length < 2) return 100;
    
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    const consistencyScore = Math.max(0, 100 - (standardDeviation * 2));
    return Math.round(consistencyScore);
  }

  calculateMasteryLevel(state) {
    const accuracy = (state.correctAttempts / state.attempts) * 100;
    const averageScore = state.averageScore;
    const consistency = state.consistencyScore;
    const avgConfidence = state.confidence.length > 0 
      ? state.confidence.reduce((sum, c) => sum + c, 0) / state.confidence.length 
      : 3;

    const masteryScore = (
      accuracy * 0.4 + 
      averageScore * 0.3 + 
      consistency * 0.2 + 
      (avgConfidence / 5) * 100 * 0.1
    );

    if (masteryScore >= this.learningModel.masteryThresholds.expert) return 'expert';
    if (masteryScore >= this.learningModel.masteryThresholds.proficient) return 'proficient';
    if (masteryScore >= this.learningModel.masteryThresholds.competent) return 'competent';
    if (masteryScore >= this.learningModel.masteryThresholds.developing) return 'developing';
    return 'novice';
  }

  updateLearningVelocity(dotPoint, questionType, performance) {
    const key = `${dotPoint}_${questionType}`;
    
    if (!this.learningModel.learningVelocity[key]) {
      this.learningModel.learningVelocity[key] = {
        improvementRate: 0,
        timeToMastery: 0,
        learningCurve: [],
        plateauDetection: false
      };
    }

    const velocity = this.learningModel.learningVelocity[key];
    velocity.learningCurve.push({
      timestamp: performance.timestamp,
      score: performance.score,
      attempt: this.learningModel.knowledgeState[dotPoint][questionType].attempts
    });

    if (velocity.learningCurve.length > 20) {
      velocity.learningCurve = velocity.learningCurve.slice(-20);
    }

    velocity.improvementRate = this.calculateImprovementRate(velocity.learningCurve);
    velocity.plateauDetection = this.detectPlateau(velocity.learningCurve);
  }

  calculateImprovementRate(learningCurve) {
    if (learningCurve.length < 5) return 0;
    
    const recent = learningCurve.slice(-5);
    const early = learningCurve.slice(0, 5);
    
    const recentAvg = recent.reduce((sum, point) => sum + point.score, 0) / recent.length;
    const earlyAvg = early.reduce((sum, point) => sum + point.score, 0) / early.length;
    
    return recentAvg - earlyAvg;
  }

  detectPlateau(learningCurve) {
    if (learningCurve.length < 10) return false;
    
    const recent = learningCurve.slice(-6);
    const scores = recent.map(point => point.score);
    
    const variance = this.calculateVariance(scores);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return variance < 25 && mean < 85;
  }

  calculateVariance(numbers) {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDifferences.reduce((sum, sq) => sum + sq, 0) / numbers.length;
  }

  selectAdaptiveQuestions(dotPoint, questionCount = 5, preferences = {}) {
    const allQuestions = this.getQuestionBank(dotPoint);
    if (!allQuestions || allQuestions.length === 0) return [];

    const userState = this.learningModel.knowledgeState[dotPoint] || {};
    const selectedQuestions = [];
    
    const targetDistribution = this.calculateTargetDistribution(userState, preferences);
    
    const categorizedQuestions = this.categorizeQuestions(allQuestions, userState);
    
    for (const category in targetDistribution) {
      const count = Math.ceil(questionCount * targetDistribution[category]);
      const categoryQuestions = categorizedQuestions[category] || [];
      
      const selected = this.selectFromCategory(categoryQuestions, count, userState);
      selectedQuestions.push(...selected);
    }
    
    const finalSelection = this.balanceAndOptimize(selectedQuestions, questionCount, userState);
    
    return this.shuffleArray(finalSelection);
  }

  calculateTargetDistribution(userState, preferences) {
    const totalQuestions = Object.keys(userState).length;
    const masteryLevels = Object.values(userState).map(state => state.masteryLevel);
    
    const noviceCount = masteryLevels.filter(level => level === 'novice').length;
    const developingCount = masteryLevels.filter(level => level === 'developing').length;
    const competentCount = masteryLevels.filter(level => level === 'competent').length;
    const proficientCount = masteryLevels.filter(level => level === 'proficient').length;
    const expertCount = masteryLevels.filter(level => level === 'expert').length;

    let distribution = {
      review: 0.1,
      reinforce: 0.2,
      challenge: 0.4,
      advance: 0.2,
      mastery: 0.1
    };

    if (noviceCount > totalQuestions * 0.5) {
      distribution = { review: 0.4, reinforce: 0.4, challenge: 0.2, advance: 0, mastery: 0 };
    } else if (developingCount > totalQuestions * 0.3) {
      distribution = { review: 0.2, reinforce: 0.4, challenge: 0.3, advance: 0.1, mastery: 0 };
    } else if (expertCount > totalQuestions * 0.7) {
      distribution = { review: 0.1, reinforce: 0.1, challenge: 0.2, advance: 0.3, mastery: 0.3 };
    }

    if (preferences.focusWeak) {
      distribution.review += 0.2;
      distribution.reinforce += 0.2;
      distribution.challenge -= 0.2;
      distribution.advance -= 0.2;
    }

    if (preferences.accelerated) {
      distribution.advance += 0.2;
      distribution.mastery += 0.2;
      distribution.review -= 0.2;
      distribution.reinforce -= 0.2;
    }

    return distribution;
  }

  categorizeQuestions(questions, userState) {
    const categorized = {
      review: [],
      reinforce: [],
      challenge: [],
      advance: [],
      mastery: []
    };

    questions.forEach(question => {
      const state = userState[question.type] || {};
      const masteryLevel = state.masteryLevel || 'novice';
      const averageScore = state.averageScore || 0;
      const attempts = state.attempts || 0;
      
      const difficulty = this.estimateQuestionDifficulty(question);
      
      if (masteryLevel === 'novice' || averageScore < 40) {
        categorized.review.push(question);
      } else if (masteryLevel === 'developing' || (averageScore < 70 && attempts >= 3)) {
        categorized.reinforce.push(question);
      } else if (masteryLevel === 'competent' || averageScore < 85) {
        categorized.challenge.push(question);
      } else if (masteryLevel === 'proficient' && difficulty >= 0.7) {
        categorized.advance.push(question);
      } else if (masteryLevel === 'expert' && difficulty >= 0.9) {
        categorized.mastery.push(question);
      } else {
        categorized.challenge.push(question);
      }
    });

    return categorized;
  }

  estimateQuestionDifficulty(question) {
    const baseWeights = this.learningModel.questionTypeWeights;
    const typeWeight = baseWeights[question.type] || 1.0;
    
    let complexity = 0.5;
    
    if (question.options && question.options.length > 4) complexity += 0.1;
    if (question.correctAnswers && question.correctAnswers.length > 1) complexity += 0.2;
    if (question.text && question.text.length > 200) complexity += 0.1;
    if (question.requiresCalculation) complexity += 0.3;
    if (question.requiresAnalysis) complexity += 0.2;
    
    const difficulty = Math.min(1.0, complexity * typeWeight);
    return difficulty;
  }

  selectFromCategory(questions, count, userState) {
    if (questions.length === 0) return [];
    
    const scored = questions.map(question => ({
      ...question,
      adaptiveScore: this.calculateAdaptiveScore(question, userState)
    }));
    
    scored.sort((a, b) => b.adaptiveScore - a.adaptiveScore);
    
    return scored.slice(0, count);
  }

  calculateAdaptiveScore(question, userState) {
    const state = userState[question.type] || {};
    const timeSinceLastAttempt = state.lastAttempt 
      ? Date.now() - state.lastAttempt 
      : Infinity;
    
    const recencyBonus = Math.min(0.3, timeSinceLastAttempt / (1000 * 60 * 60 * 24));
    
    const masteryPenalty = {
      'novice': 0,
      'developing': 0.1,
      'competent': 0.2,
      'proficient': 0.4,
      'expert': 0.6
    };
    
    const masteryLevel = state.masteryLevel || 'novice';
    const penalty = masteryPenalty[masteryLevel] || 0;
    
    const attempts = state.attempts || 0;
    const attemptBonus = Math.max(0, 0.5 - (attempts * 0.1));
    
    const difficulty = this.estimateQuestionDifficulty(question);
    const difficultyMatch = this.calculateDifficultyMatch(masteryLevel, difficulty);
    
    const adaptiveScore = (
      recencyBonus * 0.3 +
      attemptBonus * 0.2 +
      difficultyMatch * 0.3 +
      (1 - penalty) * 0.2
    );
    
    return adaptiveScore;
  }

  calculateDifficultyMatch(masteryLevel, questionDifficulty) {
    const optimalDifficulty = {
      'novice': 0.3,
      'developing': 0.5,
      'competent': 0.7,
      'proficient': 0.8,
      'expert': 0.9
    };
    
    const optimal = optimalDifficulty[masteryLevel] || 0.5;
    const difference = Math.abs(optimal - questionDifficulty);
    
    return Math.max(0, 1 - (difference * 2));
  }

  balanceAndOptimize(questions, targetCount, userState) {
    if (questions.length <= targetCount) return questions;
    
    const typeDistribution = {};
    questions.forEach(q => {
      typeDistribution[q.type] = (typeDistribution[q.type] || 0) + 1;
    });
    
    const maxPerType = Math.ceil(targetCount / Object.keys(typeDistribution).length);
    const balanced = [];
    const typeCounts = {};
    
    questions.sort((a, b) => b.adaptiveScore - a.adaptiveScore);
    
    for (const question of questions) {
      const currentCount = typeCounts[question.type] || 0;
      
      if (currentCount < maxPerType && balanced.length < targetCount) {
        balanced.push(question);
        typeCounts[question.type] = currentCount + 1;
      }
    }
    
    while (balanced.length < targetCount && questions.length > balanced.length) {
      const remaining = questions.filter(q => !balanced.includes(q));
      if (remaining.length === 0) break;
      
      balanced.push(remaining[0]);
    }
    
    return balanced.slice(0, targetCount);
  }

  getQuestionBank(dotPoint) {
    try {
      const Module5QuizComponent = JSON.parse(localStorage.getItem('module5QuestionBank') || 'null');
      
      if (Module5QuizComponent && Module5QuizComponent[dotPoint]) {
        return Module5QuizComponent[dotPoint];
      }
      
      const mockQuestions = this.generateMockQuestions(dotPoint);
      return mockQuestions;
    } catch (error) {
      console.error('Error loading question bank:', error);
      return this.generateMockQuestions(dotPoint);
    }
  }

  generateMockQuestions(dotPoint) {
    const questionTypes = Object.keys(this.learningModel.questionTypeWeights);
    const questions = [];
    
    for (let i = 0; i < 20; i++) {
      const type = questionTypes[i % questionTypes.length];
      questions.push({
        id: `${dotPoint}-mock-${i + 1}`,
        type,
        question: `Mock question ${i + 1} for ${dotPoint}`,
        options: type === 'multiple-choice' ? [
          'Option A', 'Option B', 'Option C', 'Option D'
        ] : undefined,
        correctAnswers: type === 'multiple-choice' ? ['Option B'] : undefined,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        explanation: `This is a mock explanation for question ${i + 1}`
      });
    }
    
    return questions;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getRecommendations(dotPoint) {
    const userState = this.learningModel.knowledgeState[dotPoint] || {};
    const recommendations = {
      focusAreas: [],
      questionTypes: [],
      studyStrategy: '',
      timeAllocation: {},
      nextSteps: []
    };

    const weakAreas = Object.entries(userState)
      .filter(([type, state]) => state.masteryLevel === 'novice' || state.averageScore < 60)
      .map(([type]) => type);

    const strongAreas = Object.entries(userState)
      .filter(([type, state]) => state.masteryLevel === 'expert' && state.averageScore >= 85)
      .map(([type]) => type);

    recommendations.focusAreas = weakAreas;

    if (weakAreas.length > 3) {
      recommendations.studyStrategy = 'foundation-building';
      recommendations.timeAllocation = { review: 60, practice: 30, challenge: 10 };
    } else if (strongAreas.length > weakAreas.length) {
      recommendations.studyStrategy = 'advancement';
      recommendations.timeAllocation = { review: 20, practice: 40, challenge: 40 };
    } else {
      recommendations.studyStrategy = 'balanced';
      recommendations.timeAllocation = { review: 30, practice: 40, challenge: 30 };
    }

    const plateauAreas = Object.entries(this.learningModel.learningVelocity)
      .filter(([key, velocity]) => velocity.plateauDetection && key.startsWith(dotPoint))
      .map(([key]) => key.split('_')[1]);

    if (plateauAreas.length > 0) {
      recommendations.nextSteps.push('Consider different learning approaches for plateau areas');
      recommendations.questionTypes = plateauAreas;
    }

    return recommendations;
  }

  exportLearningData() {
    return {
      knowledgeState: this.learningModel.knowledgeState,
      learningVelocity: this.learningModel.learningVelocity,
      exportDate: new Date().toISOString()
    };
  }

  importLearningData(data) {
    if (data.knowledgeState) {
      this.learningModel.knowledgeState = { ...this.learningModel.knowledgeState, ...data.knowledgeState };
    }
    
    if (data.learningVelocity) {
      this.learningModel.learningVelocity = { ...this.learningModel.learningVelocity, ...data.learningVelocity };
    }
    
    this.saveModel();
  }
}

export default AdaptiveQuestionEngine;

export const useAdaptiveEngine = () => {
  const [engine] = React.useState(() => new AdaptiveQuestionEngine());
  
  return {
    selectQuestions: (dotPoint, count, preferences) => 
      engine.selectAdaptiveQuestions(dotPoint, count, preferences),
    
    updatePerformance: (dotPoint, questionType, performance) => 
      engine.updateKnowledgeState(dotPoint, questionType, performance),
    
    getRecommendations: (dotPoint) => 
      engine.getRecommendations(dotPoint),
    
    exportData: () => 
      engine.exportLearningData(),
    
    importData: (data) => 
      engine.importLearningData(data),
    
    getMasteryLevel: (dotPoint, questionType) => {
      const state = engine.learningModel.knowledgeState[dotPoint]?.[questionType];
      return state?.masteryLevel || 'novice';
    },
    
    getKnowledgeState: () => 
      engine.learningModel.knowledgeState
  };
};
