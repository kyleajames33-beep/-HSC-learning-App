import { useMemo } from 'react';

class PersonalizedFeedbackEngine {
  constructor() {
    this.feedbackTemplates = {
      encouragement: [
        "Great job on improving your {topic} performance!",
        "You're showing excellent progress in {topic}!",
        "Keep up the fantastic work with {topic}!",
        "Your dedication to {topic} is really paying off!",
        "Impressive improvement in {topic} - you're on the right track!"
      ],
      
      constructive: [
        "Let's focus on strengthening your understanding of {topic}.",
        "Consider spending more time reviewing {topic} concepts.",
        "Your {topic} skills could benefit from additional practice.",
        "Try breaking down {topic} problems into smaller steps.",
        "Consider using different study methods for {topic}."
      ],
      
      strategic: [
        "Try tackling {topic} questions more systematically.",
        "Consider using visual aids to better understand {topic}.",
        "Practice {topic} concepts daily in short sessions.",
        "Connect {topic} to real-world examples you're familiar with.",
        "Review {topic} fundamentals before attempting harder problems."
      ],
      
      motivational: [
        "Every expert was once a beginner - keep practicing {topic}!",
        "Your effort in {topic} will definitely pay off in your HSC!",
        "Remember, understanding {topic} is a journey, not a destination.",
        "You're building valuable {topic} skills step by step!",
        "Each {topic} question you attempt makes you stronger!"
      ],
      
      celebration: [
        " Outstanding achievement in {topic}!",
        " You've mastered {topic} - incredible work!",
        " Your {topic} expertise is truly impressive!",
        " Perfect performance in {topic} - you're amazing!",
        " You've hit your {topic} targets - well done!"
      ]
    };
    
    this.studyTips = {
      'IQ1.1': {
        topic: 'Sexual and Asexual Reproduction',
        tips: [
          'Create comparison charts between sexual and asexual reproduction methods',
          'Use diagrams to visualize different reproductive strategies',
          'Practice identifying reproductive methods in various organisms',
          'Connect reproductive strategies to evolutionary advantages'
        ]
      },
      'IQ1.2': {
        topic: 'Reproductive Technologies',
        tips: [
          'Understand the science behind each reproductive technology',
          'Consider ethical implications and social impacts',
          'Practice comparing different assisted reproductive techniques',
          'Connect technologies to biological principles'
        ]
      },
      'IQ1.3': {
        topic: 'Reproductive Hormones',
        tips: [
          'Create hormone pathway diagrams',
          'Practice tracing feedback loops in reproductive systems',
          'Use mnemonics to remember hormone functions',
          'Connect hormones to observable reproductive behaviors'
        ]
      },
      'IQ2.1': {
        topic: 'Genetic Variation Sources',
        tips: [
          'Visualize crossing over and independent assortment',
          'Practice calculating genetic diversity outcomes',
          'Use Punnett squares for complex genetic scenarios',
          'Connect genetic principles to population genetics'
        ]
      },
      'IQ2.2': {
        topic: 'Chromosome Structure and Inheritance',
        tips: [
          'Study chromosome structure at different cell cycle stages',
          'Practice karyotype analysis and interpretation',
          'Connect chromosome abnormalities to genetic disorders',
          'Understand the relationship between DNA packaging and gene expression'
        ]
      },
      'IQ3.1': {
        topic: 'DNA and RNA Structure',
        tips: [
          'Build 3D models of DNA and RNA structures',
          'Practice identifying structural differences between DNA and RNA',
          'Connect structure to function in nucleic acids',
          'Use visual aids to understand base pairing rules'
        ]
      },
      'IQ3.2': {
        topic: 'Gene Expression and Regulation',
        tips: [
          'Create flowcharts of transcription and translation',
          'Practice identifying regulatory elements in gene sequences',
          'Connect gene expression to cellular responses',
          'Study examples of gene regulation in different organisms'
        ]
      },
      'IQ3.3': {
        topic: 'Biotechnology Applications',
        tips: [
          'Understand the scientific principles behind biotechnology tools',
          'Practice analyzing biotechnology applications and their impacts',
          'Consider ethical implications of genetic technologies',
          'Connect biotechnology to current research and applications'
        ]
      },
      'IQ4.1': {
        topic: 'Evolutionary Processes',
        tips: [
          'Use examples to understand natural selection mechanisms',
          'Practice identifying evolutionary pressures in different environments',
          'Connect genetic variation to evolutionary outcomes',
          'Study case studies of evolution in action'
        ]
      },
      'IQ4.2': {
        topic: 'Evolution Evidence',
        tips: [
          'Analyze different types of evolutionary evidence',
          'Practice interpreting phylogenetic trees and fossil records',
          'Connect molecular evidence to evolutionary relationships',
          'Study comparative anatomy and embryology examples'
        ]
      },
      'IQ5.1': {
        topic: 'Population Genetics',
        tips: [
          'Practice Hardy-Weinberg equilibrium calculations',
          'Understand factors affecting allele frequencies',
          'Connect population genetics to evolutionary outcomes',
          'Study real-world examples of population genetic changes'
        ]
      },
      'IQ5.2': {
        topic: 'Species and Speciation',
        tips: [
          'Understand different species concepts and their applications',
          'Practice identifying speciation mechanisms',
          'Study examples of speciation in different environments',
          'Connect reproductive isolation to species formation'
        ]
      }
    };
    
    this.difficultyAdjustments = {
      struggling: {
        recommendations: [
          'Start with easier questions to build confidence',
          'Take more time to understand basic concepts',
          'Use visual aids and diagrams',
          'Break complex topics into smaller parts',
          'Seek additional help or resources'
        ]
      },
      developing: {
        recommendations: [
          'Practice regularly with medium difficulty questions',
          'Focus on understanding rather than memorizing',
          'Connect new concepts to what you already know',
          'Use active learning techniques',
          'Review mistakes carefully'
        ]
      },
      competent: {
        recommendations: [
          'Challenge yourself with harder questions',
          'Focus on application and analysis',
          'Practice explaining concepts to others',
          'Look for connections between topics',
          'Time yourself on practice questions'
        ]
      },
      proficient: {
        recommendations: [
          'Tackle the most challenging questions',
          'Focus on synthesis and evaluation',
          'Help others learn the material',
          'Explore advanced applications',
          'Prepare for exam conditions'
        ]
      }
    };
    
    this.personalityAdaptations = {
      visual: {
        suggestions: [
          'Use diagrams, charts, and visual representations',
          'Create mind maps for complex topics',
          'Watch educational videos',
          'Use color coding in your notes'
        ]
      },
      auditory: {
        suggestions: [
          'Read concepts aloud',
          'Discuss topics with study partners',
          'Use educational podcasts',
          'Create audio recordings of key points'
        ]
      },
      kinesthetic: {
        suggestions: [
          'Use hands-on activities and models',
          'Take breaks during study sessions',
          'Walk while reviewing notes',
          'Use physical manipulatives for concepts'
        ]
      }
    };
  }

  generatePersonalizedFeedback(performanceData) {
    const {
      dotPoint,
      questionType,
      score,
      timeSpent,
      attempts,
      difficulty,
      confidence,
      recentPerformance = [],
      overallTrends = {}
    } = performanceData;

    const feedback = {
      primary: this.generatePrimaryFeedback(performanceData),
      encouragement: this.generateEncouragement(performanceData),
      suggestions: this.generateSuggestions(performanceData),
      nextSteps: this.generateNextSteps(performanceData),
      studyTips: this.getStudyTips(dotPoint, performanceData),
      motivationalMessage: this.generateMotivationalMessage(performanceData)
    };

    return feedback;
  }

  generatePrimaryFeedback(data) {
    const { score, attempts, timeSpent, difficulty, confidence } = data;
    
    let feedback = '';
    
    if (score >= 90) {
      feedback = this.getRandomTemplate('celebration', data.dotPoint);
    } else if (score >= 75) {
      feedback = this.getRandomTemplate('encouragement', data.dotPoint);
    } else if (score >= 60) {
      feedback = this.getRandomTemplate('constructive', data.dotPoint);
    } else {
      feedback = this.getRandomTemplate('strategic', data.dotPoint);
    }
    
    // Add specific performance observations
    if (attempts > 3) {
      feedback += ` Take your time to think through each question carefully.`;
    }
    
    if (timeSpent > 120000) { // 2 minutes
      feedback += ` Consider reviewing the fundamental concepts to improve your response time.`;
    } else if (timeSpent < 30000 && score < 70) { // 30 seconds
      feedback += ` Slow down and read questions more carefully for better accuracy.`;
    }
    
    if (confidence && confidence < 3) {
      feedback += ` Building confidence comes with practice - you're on the right path!`;
    }
    
    return feedback;
  }

  generateEncouragement(data) {
    const { score, recentPerformance, overallTrends } = data;
    const encouragements = [];
    
    if (recentPerformance.length >= 3) {
      const recentScores = recentPerformance.slice(-3).map(p => p.score);
      const trend = this.calculateTrend(recentScores);
      
      if (trend > 5) {
        encouragements.push("Your recent performance shows great improvement!");
      } else if (trend < -5) {
        encouragements.push("Don't worry about recent setbacks - focus on understanding the concepts.");
      } else {
        encouragements.push("You're maintaining consistent performance - keep it up!");
      }
    }
    
    if (score >= 80) {
      encouragements.push("Your strong performance shows you're mastering this topic!");
    } else if (score >= 60) {
      encouragements.push("You're making good progress - keep practicing!");
    } else {
      encouragements.push("Every attempt helps you learn - stay persistent!");
    }
    
    return encouragements;
  }

  generateSuggestions(data) {
    const { score, questionType, difficulty, timeSpent, attempts } = data;
    const suggestions = [];
    
    // Performance-based suggestions
    if (score < 60) {
      suggestions.push(...this.difficultyAdjustments.struggling.recommendations);
    } else if (score < 75) {
      suggestions.push(...this.difficultyAdjustments.developing.recommendations);
    } else if (score < 85) {
      suggestions.push(...this.difficultyAdjustments.competent.recommendations);
    } else {
      suggestions.push(...this.difficultyAdjustments.proficient.recommendations);
    }
    
    // Question type specific suggestions
    if (questionType === 'multiple-select' && score < 70) {
      suggestions.push('For multiple-select questions, read each option carefully and consider all possibilities.');
    } else if (questionType === 'drag-sequence' && score < 70) {
      suggestions.push('For sequence questions, think about the logical order of biological processes.');
    } else if (questionType === 'virtual-microscope' && score < 70) {
      suggestions.push('Practice identifying cellular structures at different magnifications.');
    }
    
    // Time-based suggestions
    if (timeSpent > 120000) {
      suggestions.push('Try to work more efficiently by reviewing key concepts beforehand.');
    } else if (timeSpent < 30000 && score < 80) {
      suggestions.push('Take more time to carefully consider each answer option.');
    }
    
    // Attempt-based suggestions
    if (attempts > 2) {
      suggestions.push('Consider reviewing the topic thoroughly before attempting more questions.');
    }
    
    return this.shuffleArray(suggestions).slice(0, 3);
  }

  generateNextSteps(data) {
    const { dotPoint, score, questionType, overallTrends } = data;
    const nextSteps = [];
    
    if (score >= 85) {
      nextSteps.push(`Try more challenging ${questionType} questions`);
      nextSteps.push(`Explore advanced applications of ${this.studyTips[dotPoint]?.topic || dotPoint}`);
      nextSteps.push('Help others learn this topic to reinforce your understanding');
    } else if (score >= 70) {
      nextSteps.push(`Practice more ${questionType} questions at this difficulty level`);
      nextSteps.push(`Review specific areas where you made mistakes`);
      nextSteps.push(`Connect this topic to other related ${dotPoint} concepts`);
    } else {
      nextSteps.push(`Start with easier questions to build confidence`);
      nextSteps.push(`Review fundamental concepts for ${this.studyTips[dotPoint]?.topic || dotPoint}`);
      nextSteps.push(`Use additional learning resources like diagrams and videos`);
    }
    
    // Add topic-specific next steps
    if (this.studyTips[dotPoint]) {
      const topicTips = this.studyTips[dotPoint].tips;
      nextSteps.push(topicTips[Math.floor(Math.random() * topicTips.length)]);
    }
    
    return nextSteps.slice(0, 3);
  }

  getStudyTips(dotPoint, data) {
    const { score, questionType } = data;
    const baseTips = this.studyTips[dotPoint]?.tips || [];
    const customTips = [];
    
    // Add performance-specific tips
    if (score < 60) {
      customTips.push('Focus on understanding basic concepts before attempting practice questions');
      customTips.push('Use multiple learning resources to reinforce understanding');
    } else if (score < 80) {
      customTips.push('Practice applying concepts in different contexts');
      customTips.push('Create connections between different topics');
    } else {
      customTips.push('Challenge yourself with analysis and synthesis questions');
      customTips.push('Look for real-world applications of these concepts');
    }
    
    // Add question type specific tips
    const questionTypeTips = this.getQuestionTypeSpecificTips(questionType);
    
    return [...baseTips, ...customTips, ...questionTypeTips].slice(0, 4);
  }

  getQuestionTypeSpecificTips(questionType) {
    const tips = {
      'multiple-choice': [
        'Eliminate obviously wrong answers first',
        'Look for key words that make options incorrect',
        'Consider all options carefully before choosing'
      ],
      'multiple-select': [
        'Read each option independently',
        'Consider partial relationships and exceptions',
        'Don\'t assume there\'s only one correct answer'
      ],
      'drag-sequence': [
        'Think about the logical flow of biological processes',
        'Consider cause and effect relationships',
        'Use your knowledge of biological timelines'
      ],
      'image-hotspot': [
        'Study anatomical diagrams regularly',
        'Practice identifying structures at different scales',
        'Connect structure to function in biological systems'
      ],
      'virtual-microscope': [
        'Practice with real microscope images',
        'Learn to identify structures at different magnifications',
        'Understand the principles behind different staining techniques'
      ]
    };
    
    return tips[questionType] || [];
  }

  generateMotivationalMessage(data) {
    const { score, recentPerformance, overallTrends } = data;
    const messages = [];
    
    if (score >= 90) {
      messages.push("You're demonstrating mastery-level understanding! ");
      messages.push("Your hard work is clearly paying off! ");
    } else if (score >= 75) {
      messages.push("You're on track for HSC success! ");
      messages.push("Your understanding is developing excellently! ");
    } else if (score >= 60) {
      messages.push("Keep building - you're making real progress! ");
      messages.push("Every question brings you closer to mastery! ");
    } else {
      messages.push("Learning is a journey - you're taking important steps! ");
      messages.push("Persistence is key to success - keep going! ");
    }
    
    if (recentPerformance.length >= 3) {
      const recentScores = recentPerformance.slice(-3).map(p => p.score);
      const improvement = this.calculateTrend(recentScores);
      
      if (improvement > 10) {
        messages.push("Your improvement trend is fantastic! ");
      }
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getRandomTemplate(category, topic) {
    const templates = this.feedbackTemplates[category];
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('{topic}', this.studyTips[topic]?.topic || topic);
  }

  calculateTrend(scores) {
    if (scores.length < 2) return 0;
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  generateProgressReport(studentData) {
    const { 
      overallPerformance,
      topicPerformance,
      recentActivity,
      strengths,
      improvements,
      goals 
    } = studentData;

    const report = {
      summary: this.generateProgressSummary(overallPerformance),
      achievements: this.identifyAchievements(topicPerformance, strengths),
      focusAreas: this.identifyFocusAreas(improvements, topicPerformance),
      recommendations: this.generateStudyRecommendations(studentData),
      goalProgress: this.assessGoalProgress(goals, overallPerformance),
      motivationalNote: this.generateProgressMotivation(overallPerformance)
    };

    return report;
  }

  generateProgressSummary(performance) {
    const { averageScore, totalQuestions, studyTime, streak } = performance;
    
    let summary = '';
    
    if (averageScore >= 85) {
      summary = `Excellent progress! You've maintained a ${averageScore}% average across ${totalQuestions} questions.`;
    } else if (averageScore >= 70) {
      summary = `Good progress! Your ${averageScore}% average shows solid understanding across ${totalQuestions} questions.`;
    } else {
      summary = `You're building your knowledge base with ${totalQuestions} questions completed. Keep practicing!`;
    }
    
    if (streak > 0) {
      summary += ` Your ${streak}-day study streak shows great consistency!`;
    }
    
    if (studyTime > 0) {
      const hours = Math.floor(studyTime / 60);
      const minutes = studyTime % 60;
      summary += ` Total study time: ${hours}h ${minutes}m.`;
    }
    
    return summary;
  }

  identifyAchievements(topicPerformance, strengths) {
    const achievements = [];
    
    Object.entries(topicPerformance).forEach(([topic, performance]) => {
      if (performance.averageScore >= 90) {
        achievements.push(` Mastered ${this.studyTips[topic]?.topic || topic}`);
      } else if (performance.averageScore >= 80) {
        achievements.push(` Excellent performance in ${this.studyTips[topic]?.topic || topic}`);
      }
      
      if (performance.improvement > 20) {
        achievements.push(` Significant improvement in ${this.studyTips[topic]?.topic || topic}`);
      }
    });
    
    strengths.forEach(strength => {
      achievements.push(` Strong in ${strength}`);
    });
    
    return achievements;
  }

  identifyFocusAreas(improvements, topicPerformance) {
    const focusAreas = [];
    
    improvements.forEach(area => {
      focusAreas.push({
        area: area,
        suggestion: this.getFocusAreaSuggestion(area),
        priority: this.calculatePriority(area, topicPerformance)
      });
    });
    
    return focusAreas.sort((a, b) => b.priority - a.priority);
  }

  getFocusAreaSuggestion(area) {
    const suggestions = {
      'Cell Division': 'Practice identifying phases of mitosis and meiosis with diagrams',
      'DNA Replication': 'Focus on understanding the molecular mechanisms and enzymes involved',
      'Protein Synthesis': 'Create flowcharts of transcription and translation processes',
      'Evolution': 'Study examples of natural selection and evolutionary evidence',
      'Genetics': 'Practice solving genetic crosses and inheritance patterns'
    };
    
    return suggestions[area] || 'Review fundamental concepts and practice related questions';
  }

  calculatePriority(area, topicPerformance) {
    // Higher priority for areas with lower performance and higher question frequency
    const areaPerformance = Object.values(topicPerformance).find(p => 
      p.topic && p.topic.toLowerCase().includes(area.toLowerCase())
    );
    
    if (!areaPerformance) return 1;
    
    const scorePriority = (100 - areaPerformance.averageScore) / 100;
    const frequencyPriority = areaPerformance.questionCount / 100;
    
    return scorePriority * 0.7 + frequencyPriority * 0.3;
  }

  generateStudyRecommendations(studentData) {
    const { overallPerformance, learningStyle, timePreferences } = studentData;
    const recommendations = [];
    
    // Performance-based recommendations
    if (overallPerformance.averageScore < 60) {
      recommendations.push('Focus on fundamental concepts before attempting practice questions');
      recommendations.push('Consider forming a study group or seeking additional help');
    } else if (overallPerformance.averageScore < 80) {
      recommendations.push('Balance concept review with regular practice questions');
      recommendations.push('Focus on understanding rather than memorization');
    } else {
      recommendations.push('Challenge yourself with more complex applications');
      recommendations.push('Consider teaching others to reinforce your understanding');
    }
    
    // Learning style adaptations
    if (learningStyle) {
      recommendations.push(...this.personalityAdaptations[learningStyle]?.suggestions || []);
    }
    
    // Time-based recommendations
    if (timePreferences === 'morning') {
      recommendations.push('Schedule challenging topics for your morning study sessions');
    } else if (timePreferences === 'evening') {
      recommendations.push('Use evening sessions for review and consolidation');
    }
    
    return recommendations.slice(0, 5);
  }

  assessGoalProgress(goals, performance) {
    if (!goals || goals.length === 0) return null;
    
    const progress = goals.map(goal => {
      let completion = 0;
      
      if (goal.type === 'score') {
        completion = Math.min(100, (performance.averageScore / goal.target) * 100);
      } else if (goal.type === 'questions') {
        completion = Math.min(100, (performance.totalQuestions / goal.target) * 100);
      } else if (goal.type === 'streak') {
        completion = Math.min(100, (performance.streak / goal.target) * 100);
      }
      
      return {
        ...goal,
        completion: Math.round(completion),
        onTrack: completion >= 80
      };
    });
    
    return progress;
  }

  generateProgressMotivation(performance) {
    const motivations = [
      "Your consistent effort is building towards HSC success! ",
      "Every question you complete strengthens your understanding! ",
      "You're developing the skills needed for academic excellence! ",
      "Your learning journey is preparing you for future challenges! ",
      "Keep building your knowledge - you're on the right path! "
    ];
    
    if (performance.averageScore >= 85) {
      motivations.push("Your outstanding performance shows true mastery! ");
    } else if (performance.improvement > 0) {
      motivations.push("Your improvement shows that hard work pays off! ");
    }
    
    return motivations[Math.floor(Math.random() * motivations.length)];
  }
}

export default PersonalizedFeedbackEngine;

export const usePersonalizedFeedback = () => {
  const engine = useMemo(() => new PersonalizedFeedbackEngine(), []);
  
  return {
    generateFeedback: (performanceData) => 
      engine.generatePersonalizedFeedback(performanceData),
    
    generateProgressReport: (studentData) => 
      engine.generateProgressReport(studentData),
    
    getStudyTips: (dotPoint, performanceData) => 
      engine.getStudyTips(dotPoint, performanceData),
    
    generateMotivation: (performanceData) => 
      engine.generateMotivationalMessage(performanceData)
  };
};
