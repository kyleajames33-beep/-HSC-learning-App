import api from './api.js';
import { learningPathways, getTopicById } from '../data/learningPathways.js';

export const quizAPI = {
  // Biology Agent API calls (port 3002)
  biology: {
    // Get quiz questions for a specific module and difficulty
    getQuestions: async (module, difficulty, count = 10) => {
      try {
        const response = await fetch(`http://localhost:3002/quiz/biology/module/${module}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            difficulty,
            count,
            format: 'multiple-choice'
          })
        });
        const result = await response.json();
        if (result.success === false) {
          throw new Error(result.error?.message || 'Biology API error');
        }
        return result;
      } catch (error) {
        console.log('Biology API not available, using mock data');
        return getMockBiologyQuestions(module, difficulty, count);
      }
    },

    // Submit answer for validation and explanation
    submitAnswer: async (questionId, answer) => {
      try {
        const response = await fetch(`http://localhost:3002/quiz/biology/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            questionId,
            answer,
            timestamp: new Date().toISOString()
          })
        });
        return await response.json();
      } catch (error) {
        console.log('Biology submission API not available');
        return { success: false, error: error.message };
      }
    },

    // Get detailed explanation for a question
    getExplanation: async (questionId) => {
      try {
        const response = await fetch(`http://localhost:3002/quiz/biology/explanation/${questionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return await response.json();
      } catch (error) {
        console.log('Biology explanation API not available');
        return null;
      }
    }
  },

  // Chemistry Agent API calls (port 3003)
  chemistry: {
    // Get quiz questions for a specific module and difficulty
    getQuestions: async (module, difficulty, count = 10) => {
      try {
        const response = await fetch(`http://localhost:3003/quiz/chemistry/module/${module}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            difficulty,
            count,
            format: 'multiple-choice'
          })
        });
        const result = await response.json();
        if (result.success === false) {
          throw new Error(result.error?.message || 'Chemistry API error');
        }
        return result;
      } catch (error) {
        console.log('Chemistry API not available, using mock data');
        return getMockChemistryQuestions(module, difficulty, count);
      }
    },

    // Submit answer for validation (handles chemical equations)
    submitAnswer: async (questionId, answer, workingOut = null) => {
      try {
        const response = await fetch(`http://localhost:3003/quiz/chemistry/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            questionId,
            answer,
            workingOut,
            timestamp: new Date().toISOString()
          })
        });
        return await response.json();
      } catch (error) {
        console.log('Chemistry submission API not available');
        return { success: false, error: error.message };
      }
    },

    // Get detailed explanation with chemical equations
    getExplanation: async (questionId) => {
      try {
        const response = await fetch(`http://localhost:3003/quiz/chemistry/explanation/${questionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return await response.json();
      } catch (error) {
        console.log('Chemistry explanation API not available');
        return null;
      }
    }
  },

  // Record quiz results
  recordResults: async (quizResults) => {
    try {
      const response = await api.post('/user/quiz-results', quizResults);
      return response.data;
    } catch (error) {
      console.error('Failed to record quiz results:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user quiz history
  getQuizHistory: async (subject = null, limit = 10) => {
    try {
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      params.append('limit', limit.toString());

      const response = await api.get(`/user/quiz-history?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get quiz history:', error);
      return [];
    }
  },

  // Get comprehensive quiz results for statistics
  getAllQuizResults: async () => {
    try {
      const response = await api.get('/user/quiz-results');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to get all quiz results:', error);
      return [];
    }
  },

  // Get quiz results by date range
  getQuizResultsByDateRange: async (startDate, endDate, subject = null) => {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      if (subject) params.append('subject', subject);

      const response = await api.get(`/user/quiz-results/range?${params}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to get quiz results by date range:', error);
      return [];
    }
  },

  // Get quiz statistics summary
  getQuizStatistics: async () => {
    try {
      const response = await api.get('/user/quiz-results/statistics');
      return response.data || {};
    } catch (error) {
      console.error('Failed to get quiz statistics:', error);
      return {};
    }
  },

  // Get questions for a specific topic (pathway-based)
  getTopicQuestions: async (subjectId, topicId, count = 10) => {
    const topic = getTopicById(subjectId, topicId);
    if (!topic) {
      return { success: false, error: 'Topic not found' };
    }

    try {
      // Try API first
      const api = quizAPI[subjectId];
      if (api) {
        // For pathway topics, we'll use module-based API with topic filtering
        const moduleId = topic.module || 5; // fallback to module 5
        const response = await api.getQuestions(moduleId, topic.difficulty, count);
        
        if (response.success && response.questions) {
          // Filter questions to match topic content if possible
          return {
            success: true,
            questions: response.questions.slice(0, Math.min(count, topic.questions))
          };
        }
      }
    } catch (error) {
      console.log(`${subjectId} API not available for topic ${topicId}, using mock data`);
    }

    // Fallback to mock data for specific topic
    return getTopicMockQuestions(subjectId, topicId, count);
  },

  // Get mixed questions from completed topics (for random quizzes)
  getMixedQuestionsFromCompletedTopics: async (subjectId, completedTopics, count = 10) => {
    if (!completedTopics || completedTopics.length === 0) {
      return { success: false, error: 'No completed topics available' };
    }

    const allQuestions = [];
    
    // Collect questions from all completed topics
    for (const topicId of completedTopics) {
      const topicQuestions = await quizAPI.getTopicQuestions(subjectId, topicId, 5); // Get 5 from each topic
      if (topicQuestions.success && topicQuestions.questions) {
        allQuestions.push(...topicQuestions.questions);
      }
    }

    if (allQuestions.length === 0) {
      return { success: false, error: 'No questions available from completed topics' };
    }

    // Shuffle and select requested count
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return {
      success: true,
      questions: shuffled.slice(0, count)
    };
  }
};

// Mock data for development when APIs are not available
const getMockBiologyQuestions = (module, difficulty, count) => {
  const questions = [
    // Module 5 - Heredity questions
    {
      id: 'bio_m5_1',
      type: 'multiple-choice',
      question: 'What is the primary function of DNA polymerase during DNA replication?',
      options: [
        'Unwinding the DNA double helix',
        'Adding nucleotides to the growing DNA strand',
        'Proofreading for errors in the DNA sequence',
        'Joining Okazaki fragments together'
      ],
      correctAnswer: 1,
      explanation: 'DNA polymerase is responsible for adding complementary nucleotides to the growing DNA strand during replication. It reads the template strand and adds the appropriate nucleotides in the 5\' to 3\' direction.',
      difficulty: 'medium',
      module: 5,
      timeLimit: 120
    },
    {
      id: 'bio_m5_2',
      type: 'multiple-choice',
      question: 'What type of bond connects the two strands of DNA?',
      options: [
        'Covalent bonds',
        'Ionic bonds',
        'Hydrogen bonds',
        'Van der Waals forces'
      ],
      correctAnswer: 2,
      explanation: 'Hydrogen bonds form between complementary base pairs (A-T and G-C) to hold the two strands of DNA together in the double helix structure.',
      difficulty: 'easy',
      module: 5,
      timeLimit: 120
    },
    {
      id: 'bio_m5_3',
      type: 'multiple-choice',
      question: 'In which direction does DNA replication occur?',
      options: [
        '3\' to 5\' direction only',
        '5\' to 3\' direction only',
        'Both 3\' to 5\' and 5\' to 3\' directions',
        'Direction depends on the chromosome'
      ],
      correctAnswer: 1,
      explanation: 'DNA replication occurs in the 5\' to 3\' direction. This means nucleotides are added to the 3\' end of the growing strand.',
      difficulty: 'medium',
      module: 5,
      timeLimit: 120
    },
    // Module 6 - Genetic Change questions
    {
      id: 'bio_m6_1',
      type: 'multiple-choice',
      question: 'Which of the following best describes natural selection?',
      options: [
        'The process by which organisms acquire new traits during their lifetime',
        'The survival and reproduction of individuals with favorable traits',
        'The random changes in gene frequencies in a population',
        'The movement of genes between different populations'
      ],
      correctAnswer: 1,
      explanation: 'Natural selection is the process where individuals with traits that are advantageous for survival and reproduction in their environment are more likely to pass these traits to their offspring.',
      difficulty: 'easy',
      module: 6,
      timeLimit: 120
    },
    {
      id: 'bio_m6_2',
      type: 'multiple-choice',
      question: 'What is genetic drift?',
      options: [
        'Directed changes in allele frequency due to environmental pressure',
        'Random changes in allele frequency in a population',
        'The movement of alleles between populations',
        'The creation of new alleles through mutation'
      ],
      correctAnswer: 1,
      explanation: 'Genetic drift refers to random changes in allele frequencies that occur in populations, especially smaller ones, due to chance events during reproduction.',
      difficulty: 'medium',
      module: 6,
      timeLimit: 120
    },
    {
      id: 'bio_m6_3',
      type: 'multiple-choice',
      question: 'Which mechanism provides the raw material for evolution?',
      options: [
        'Natural selection',
        'Genetic drift',
        'Mutation',
        'Gene flow'
      ],
      correctAnswer: 2,
      explanation: 'Mutations provide the raw material for evolution by creating new alleles and genetic variations that other evolutionary forces can act upon.',
      difficulty: 'medium',
      module: 6,
      timeLimit: 120
    },
    // Module 7 - Infectious Disease questions
    {
      id: 'bio_m7_1',
      type: 'multiple-choice',
      question: 'Which type of pathogen causes malaria?',
      options: [
        'Virus',
        'Bacterium',
        'Protozoan',
        'Fungus'
      ],
      correctAnswer: 2,
      explanation: 'Malaria is caused by Plasmodium species, which are protozoans. These single-celled parasites are transmitted through mosquito bites and infect red blood cells.',
      difficulty: 'easy',
      module: 7,
      timeLimit: 120
    },
    {
      id: 'bio_m7_2',
      type: 'multiple-choice',
      question: 'What is the primary function of antibodies?',
      options: [
        'To directly kill pathogens',
        'To identify and mark pathogens for destruction',
        'To prevent pathogen reproduction',
        'To repair damaged tissues'
      ],
      correctAnswer: 1,
      explanation: 'Antibodies primarily function to bind to specific antigens on pathogens, marking them for destruction by other immune cells like macrophages and neutrophils.',
      difficulty: 'medium',
      module: 7,
      timeLimit: 120
    },
    {
      id: 'bio_m7_3',
      type: 'multiple-choice',
      question: 'Which cells are responsible for immunological memory?',
      options: [
        'Neutrophils',
        'Memory B and T cells',
        'Macrophages',
        'Natural killer cells'
      ],
      correctAnswer: 1,
      explanation: 'Memory B cells and memory T cells are responsible for immunological memory, allowing for faster and stronger immune responses upon re-exposure to the same pathogen.',
      difficulty: 'medium',
      module: 7,
      timeLimit: 120
    },
    // Module 8 - Non-infectious Disease questions
    {
      id: 'bio_m8_1',
      type: 'multiple-choice',
      question: 'What is a key characteristic of cancer cells?',
      options: [
        'They divide at a normal rate',
        'They respond to growth inhibition signals',
        'They can invade surrounding tissues',
        'They undergo programmed cell death easily'
      ],
      correctAnswer: 2,
      explanation: 'Cancer cells have the ability to invade surrounding tissues and potentially metastasize to other parts of the body. This invasiveness is one of the hallmarks that distinguishes cancer cells from normal cells.',
      difficulty: 'medium',
      module: 8,
      timeLimit: 120
    },
    {
      id: 'bio_m8_2',
      type: 'multiple-choice',
      question: 'Which of the following is a risk factor for cardiovascular disease?',
      options: [
        'Regular exercise',
        'High HDL cholesterol',
        'High blood pressure',
        'Adequate sleep'
      ],
      correctAnswer: 2,
      explanation: 'High blood pressure (hypertension) is a major risk factor for cardiovascular disease as it puts additional strain on the heart and blood vessels.',
      difficulty: 'easy',
      module: 8,
      timeLimit: 120
    },
    {
      id: 'bio_m8_3',
      type: 'multiple-choice',
      question: 'What is the difference between Type 1 and Type 2 diabetes?',
      options: [
        'Type 1 affects adults, Type 2 affects children',
        'Type 1 is autoimmune, Type 2 is lifestyle-related',
        'Type 1 is curable, Type 2 is not',
        'Type 1 affects the kidneys, Type 2 affects the liver'
      ],
      correctAnswer: 1,
      explanation: 'Type 1 diabetes is an autoimmune condition where the immune system destroys insulin-producing cells, while Type 2 diabetes is primarily lifestyle-related and involves insulin resistance.',
      difficulty: 'hard',
      module: 8,
      timeLimit: 120
    }
  ];

  return {
    questions: questions
      .filter(q => q.module === module)
      .filter(q => difficulty === 'all' || q.difficulty === difficulty)
      .slice(0, count),
    success: true
  };
};

const getMockChemistryQuestions = (module, difficulty, count) => {
  const questions = [
    // Module 5 - Equilibrium & Acid Reactions questions
    {
      id: 'chem_m5_1',
      type: 'multiple-choice',
      question: 'What is the pH of a 0.01 M solution of hydrochloric acid (HCl)?',
      options: [
        'pH = 1',
        'pH = 2',
        'pH = 12',
        'pH = 14'
      ],
      correctAnswer: 1,
      explanation: 'HCl is a strong acid that completely ionizes. For a 0.01 M HCl solution: [H] = 0.01 M = 10 M. Therefore, pH = -log[H] = -log(10) = 2.',
      difficulty: 'medium',
      module: 5,
      timeLimit: 120
    },
    {
      id: 'chem_m5_2',
      type: 'multiple-choice',
      question: 'According to Le Chatelier\'s principle, what happens when temperature is increased in an exothermic reaction?',
      options: [
        'The equilibrium shifts to the right',
        'The equilibrium shifts to the left',
        'The equilibrium position remains unchanged',
        'The reaction rate increases but equilibrium is unchanged'
      ],
      correctAnswer: 1,
      explanation: 'For an exothermic reaction, increasing temperature shifts the equilibrium to the left (toward reactants) to counteract the temperature increase by absorbing heat.',
      difficulty: 'medium',
      module: 5,
      timeLimit: 120
    },
    {
      id: 'chem_m5_3',
      type: 'multiple-choice',
      question: 'What is a buffer solution?',
      options: [
        'A solution that maintains constant pH',
        'A solution with a pH of exactly 7',
        'A solution that resists changes in pH',
        'A solution with equal concentrations of acid and base'
      ],
      correctAnswer: 2,
      explanation: 'A buffer solution resists changes in pH when small amounts of acid or base are added. It consists of a weak acid and its conjugate base (or weak base and its conjugate acid).',
      difficulty: 'easy',
      module: 5,
      timeLimit: 120
    },
    // Module 6 - Acid/Base Reactions questions
    {
      id: 'chem_m6_1',
      type: 'multiple-choice',
      question: 'In a titration, what is the equivalence point?',
      options: [
        'When the indicator changes color',
        'When equal moles of acid and base have reacted',
        'When the pH equals 7',
        'When the solution becomes neutral'
      ],
      correctAnswer: 1,
      explanation: 'The equivalence point occurs when the number of moles of acid equals the number of moles of base added. This may not necessarily be at pH 7, especially for weak acid-strong base or strong acid-weak base titrations.',
      difficulty: 'medium',
      module: 6,
      timeLimit: 120
    },
    {
      id: 'chem_m6_2',
      type: 'multiple-choice',
      question: 'What is the difference between a strong acid and a weak acid?',
      options: [
        'Strong acids have higher concentrations',
        'Strong acids completely ionize in water',
        'Strong acids have lower pH values',
        'Strong acids are more corrosive'
      ],
      correctAnswer: 1,
      explanation: 'Strong acids completely ionize (dissociate) in water, releasing all their hydrogen ions, while weak acids only partially ionize.',
      difficulty: 'easy',
      module: 6,
      timeLimit: 120
    },
    {
      id: 'chem_m6_3',
      type: 'multiple-choice',
      question: 'What happens at the equivalence point of a weak acid-strong base titration?',
      options: [
        'pH = 7',
        'pH > 7',
        'pH < 7',
        'pH is unpredictable'
      ],
      correctAnswer: 1,
      explanation: 'At the equivalence point of a weak acid-strong base titration, the pH > 7 because the salt formed undergoes hydrolysis to produce OH ions.',
      difficulty: 'hard',
      module: 6,
      timeLimit: 120
    },
    // Module 7 - Organic Chemistry questions
    {
      id: 'chem_m7_1',
      type: 'multiple-choice',
      question: 'What functional group is present in alcohols?',
      options: [
        'Carbonyl (-C=O)',
        'Hydroxyl (-OH)',
        'Carboxyl (-COOH)',
        'Amino (-NH)'
      ],
      correctAnswer: 1,
      explanation: 'Alcohols contain the hydroxyl functional group (-OH) attached to a carbon atom. This functional group is responsible for many of the characteristic properties of alcohols.',
      difficulty: 'easy',
      module: 7,
      timeLimit: 120
    },
    {
      id: 'chem_m7_2',
      type: 'multiple-choice',
      question: 'What type of reaction converts an alkene to an alkane?',
      options: [
        'Substitution',
        'Addition',
        'Elimination',
        'Condensation'
      ],
      correctAnswer: 1,
      explanation: 'Addition reactions convert alkenes to alkanes by adding hydrogen (hydrogenation) across the double bond, typically using a metal catalyst.',
      difficulty: 'medium',
      module: 7,
      timeLimit: 120
    },
    {
      id: 'chem_m7_3',
      type: 'multiple-choice',
      question: 'Which type of isomerism occurs when molecules have the same molecular formula but different structural arrangements?',
      options: [
        'Optical isomerism',
        'Geometric isomerism',
        'Structural isomerism',
        'Conformational isomerism'
      ],
      correctAnswer: 2,
      explanation: 'Structural isomerism occurs when compounds have the same molecular formula but different structural arrangements of atoms, such as chain, positional, or functional group isomers.',
      difficulty: 'medium',
      module: 7,
      timeLimit: 120
    },
    // Module 8 - Applying Chemical Ideas questions
    {
      id: 'chem_m8_1',
      type: 'multiple-choice',
      question: 'Which process is used to extract aluminum from its ore?',
      options: [
        'Fractional distillation',
        'Electrolysis',
        'Precipitation',
        'Crystallization'
      ],
      correctAnswer: 1,
      explanation: 'Aluminum is extracted from bauxite ore using electrolysis in the Hall-Hroult process. The aluminum oxide is dissolved in molten cryolite and electrolyzed to produce pure aluminum metal.',
      difficulty: 'medium',
      module: 8,
      timeLimit: 120
    },
    {
      id: 'chem_m8_2',
      type: 'multiple-choice',
      question: 'What is the main advantage of using catalysts in industrial processes?',
      options: [
        'They increase the yield of products',
        'They lower the activation energy',
        'They change the equilibrium position',
        'They prevent side reactions'
      ],
      correctAnswer: 1,
      explanation: 'Catalysts lower the activation energy required for reactions, allowing them to proceed faster and under milder conditions, making industrial processes more efficient and economical.',
      difficulty: 'easy',
      module: 8,
      timeLimit: 120
    },
    {
      id: 'chem_m8_3',
      type: 'multiple-choice',
      question: 'What is nanotechnology primarily concerned with?',
      options: [
        'Materials at the atomic and molecular scale',
        'Very large molecular structures',
        'High-temperature chemical reactions',
        'Biological systems only'
      ],
      correctAnswer: 0,
      explanation: 'Nanotechnology involves manipulating matter at the atomic and molecular scale (typically 1-100 nanometers) to create materials and devices with novel properties.',
      difficulty: 'easy',
      module: 8,
      timeLimit: 120
    }
  ];

  return {
    questions: questions
      .filter(q => q.module === module)
      .filter(q => difficulty === 'all' || q.difficulty === difficulty)
      .slice(0, count),
    success: true
  };
};

// Mock questions for specific pathway topics
const getTopicMockQuestions = (subjectId, topicId, count) => {
  const topic = getTopicById(subjectId, topicId);
  if (!topic) {
    return { success: false, error: 'Topic not found' };
  }

  // Map topic IDs to mock questions based on the pathway structure
  const topicQuestions = {
    // Biology topics
    'dna-structure': [
      {
        id: 'bio_dna_1',
        type: 'multiple-choice',
        question: 'What is the primary function of DNA polymerase during DNA replication?',
        options: [
          'Unwinding the DNA double helix',
          'Adding nucleotides to the growing DNA strand',
          'Proofreading for errors in the DNA sequence',
          'Joining Okazaki fragments together'
        ],
        correctAnswer: 1,
        explanation: 'DNA polymerase is responsible for adding complementary nucleotides to the growing DNA strand during replication.',
        difficulty: topic.difficulty,
        timeLimit: 120
      },
      {
        id: 'bio_dna_2',
        type: 'multiple-choice',
        question: 'What type of bond connects the two strands of DNA?',
        options: [
          'Covalent bonds',
          'Ionic bonds',
          'Hydrogen bonds',
          'Van der Waals forces'
        ],
        correctAnswer: 2,
        explanation: 'Hydrogen bonds form between complementary base pairs (A-T and G-C) to hold the two strands of DNA together.',
        difficulty: topic.difficulty,
        timeLimit: 120
      }
    ],
    'protein-synthesis': [
      {
        id: 'bio_protein_1',
        type: 'multiple-choice',
        question: 'Where does transcription occur in eukaryotic cells?',
        options: [
          'Cytoplasm',
          'Nucleus',
          'Ribosomes',
          'Mitochondria'
        ],
        correctAnswer: 1,
        explanation: 'In eukaryotic cells, transcription occurs in the nucleus where DNA is transcribed into mRNA.',
        difficulty: topic.difficulty,
        timeLimit: 120
      }
    ],
    // Chemistry topics
    'atomic-structure': [
      {
        id: 'chem_atomic_1',
        type: 'multiple-choice',
        question: 'What determines the chemical properties of an element?',
        options: [
          'Number of protons',
          'Number of neutrons',
          'Number of electrons in the outermost shell',
          'Atomic mass'
        ],
        correctAnswer: 2,
        explanation: 'The number of electrons in the outermost shell (valence electrons) determines the chemical properties of an element.',
        difficulty: topic.difficulty,
        timeLimit: 120
      }
    ]
  };

  // Get questions for the specific topic, or use module-based fallback
  let questions = topicQuestions[topicId] || [];
  
  if (questions.length === 0) {
    // Fallback to module-based questions if topic-specific ones aren't available
    if (subjectId === 'biology') {
      const moduleQuestions = getMockBiologyQuestions(5, topic.difficulty, count * 2);
      questions = moduleQuestions.questions || [];
    } else if (subjectId === 'chemistry') {
      const moduleQuestions = getMockChemistryQuestions(5, topic.difficulty, count * 2);
      questions = moduleQuestions.questions || [];
    }
  }

  return {
    success: true,
    questions: questions.slice(0, Math.min(count, topic.questions))
  };
};

export default quizAPI;
