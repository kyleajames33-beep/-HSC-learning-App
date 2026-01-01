// HSC Learning Pathways - Structured curriculum with sequential unlocking
export const learningPathways = {
  biology: {
    id: 'biology',
    name: 'HSC Biology',
    icon: '',
    color: 'from-green-500 to-emerald-600',
    description: 'Master HSC Biology through a structured learning journey',
    totalLevels: 24,
    modules: [
      {
        id: 'module-5',
        name: 'Module 5: Heredity',
        description: 'DNA, inheritance, and genetic variation',
        totalLevels: 6,
        topics: [
          {
            id: 'dna-structure',
            name: 'DNA Structure & Function',
            level: 1,
            description: 'Understanding the molecular basis of heredity',
            prerequisites: [],
            xpReward: 100,
            questions: 15,
            difficulty: 'beginner',
            estimatedTime: '30 min'
          },
          {
            id: 'dna-replication',
            name: 'DNA Replication',
            level: 2,
            description: 'How genetic material is copied',
            prerequisites: ['dna-structure'],
            xpReward: 120,
            questions: 12,
            difficulty: 'beginner',
            estimatedTime: '25 min'
          },
          {
            id: 'protein-synthesis',
            name: 'Protein Synthesis',
            level: 3,
            description: 'From genes to proteins',
            prerequisites: ['dna-replication'],
            xpReward: 150,
            questions: 18,
            difficulty: 'intermediate',
            estimatedTime: '40 min'
          },
          {
            id: 'mutations',
            name: 'Mutations & Genetic Variation',
            level: 4,
            description: 'Changes in genetic material',
            prerequisites: ['protein-synthesis'],
            xpReward: 140,
            questions: 14,
            difficulty: 'intermediate',
            estimatedTime: '35 min'
          },
          {
            id: 'inheritance-patterns',
            name: 'Inheritance Patterns',
            level: 5,
            description: 'How traits are passed down',
            prerequisites: ['mutations'],
            xpReward: 160,
            questions: 20,
            difficulty: 'intermediate',
            estimatedTime: '45 min'
          },
          {
            id: 'genetic-technologies',
            name: 'Genetic Technologies',
            level: 6,
            description: 'Modern genetic engineering techniques',
            prerequisites: ['inheritance-patterns'],
            xpReward: 180,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          }
        ]
      },
      {
        id: 'module-6',
        name: 'Module 6: Genetic Change',
        description: 'Evolution and genetic diversity',
        totalLevels: 6,
        topics: [
          {
            id: 'natural-selection',
            name: 'Natural Selection',
            level: 7,
            description: 'Mechanisms of evolutionary change',
            prerequisites: ['genetic-technologies'],
            xpReward: 140,
            questions: 15,
            difficulty: 'intermediate',
            estimatedTime: '35 min'
          },
          {
            id: 'speciation',
            name: 'Speciation',
            level: 8,
            description: 'How new species form',
            prerequisites: ['natural-selection'],
            xpReward: 160,
            questions: 14,
            difficulty: 'intermediate',
            estimatedTime: '40 min'
          },
          {
            id: 'human-evolution',
            name: 'Human Evolution',
            level: 9,
            description: 'Our evolutionary history',
            prerequisites: ['speciation'],
            xpReward: 150,
            questions: 16,
            difficulty: 'intermediate',
            estimatedTime: '35 min'
          },
          {
            id: 'population-genetics',
            name: 'Population Genetics',
            level: 10,
            description: 'Genetic variation in populations',
            prerequisites: ['human-evolution'],
            xpReward: 170,
            questions: 18,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'molecular-evidence',
            name: 'Molecular Evidence',
            level: 11,
            description: 'DNA and protein evidence for evolution',
            prerequisites: ['population-genetics'],
            xpReward: 180,
            questions: 15,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'phylogenetics',
            name: 'Phylogenetics',
            level: 12,
            description: 'Evolutionary relationships',
            prerequisites: ['molecular-evidence'],
            xpReward: 200,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          }
        ]
      },
      {
        id: 'module-7',
        name: 'Module 7: Infectious Disease',
        description: 'Pathogens and immune responses',
        totalLevels: 6,
        topics: [
          {
            id: 'pathogens',
            name: 'Pathogens & Disease',
            level: 13,
            description: 'Types of disease-causing organisms',
            prerequisites: ['phylogenetics'],
            xpReward: 140,
            questions: 16,
            difficulty: 'intermediate',
            estimatedTime: '35 min'
          },
          {
            id: 'immune-system',
            name: 'Immune System',
            level: 14,
            description: 'Body\'s defense mechanisms',
            prerequisites: ['pathogens'],
            xpReward: 160,
            questions: 20,
            difficulty: 'intermediate',
            estimatedTime: '45 min'
          },
          {
            id: 'vaccination',
            name: 'Vaccination & Immunity',
            level: 15,
            description: 'Artificial immunity and prevention',
            prerequisites: ['immune-system'],
            xpReward: 150,
            questions: 14,
            difficulty: 'intermediate',
            estimatedTime: '40 min'
          },
          {
            id: 'antibiotics',
            name: 'Antibiotics & Resistance',
            level: 16,
            description: 'Treatment and resistance evolution',
            prerequisites: ['vaccination'],
            xpReward: 170,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'epidemiology',
            name: 'Epidemiology',
            level: 17,
            description: 'Disease spread and control',
            prerequisites: ['antibiotics'],
            xpReward: 180,
            questions: 15,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'biotechnology-health',
            name: 'Biotechnology in Health',
            level: 18,
            description: 'Modern medical applications',
            prerequisites: ['epidemiology'],
            xpReward: 200,
            questions: 18,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          }
        ]
      },
      {
        id: 'module-8',
        name: 'Module 8: Non-infectious Disease',
        description: 'Lifestyle and genetic diseases',
        totalLevels: 6,
        topics: [
          {
            id: 'cancer-biology',
            name: 'Cancer Biology',
            level: 19,
            description: 'Cell cycle and cancer development',
            prerequisites: ['biotechnology-health'],
            xpReward: 160,
            questions: 18,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'genetic-disorders',
            name: 'Genetic Disorders',
            level: 20,
            description: 'Inherited diseases and testing',
            prerequisites: ['cancer-biology'],
            xpReward: 170,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'lifestyle-diseases',
            name: 'Lifestyle Diseases',
            level: 21,
            description: 'Diet, exercise and health',
            prerequisites: ['genetic-disorders'],
            xpReward: 150,
            questions: 15,
            difficulty: 'intermediate',
            estimatedTime: '35 min'
          },
          {
            id: 'environmental-health',
            name: 'Environmental Health',
            level: 22,
            description: 'Environmental factors and disease',
            prerequisites: ['lifestyle-diseases'],
            xpReward: 180,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'personalised-medicine',
            name: 'Personalised Medicine',
            level: 23,
            description: 'Genomics in treatment',
            prerequisites: ['environmental-health'],
            xpReward: 200,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          },
          {
            id: 'biology-mastery',
            name: 'Biology Mastery',
            level: 24,
            description: 'Integration and application',
            prerequisites: ['personalised-medicine'],
            xpReward: 250,
            questions: 25,
            difficulty: 'expert',
            estimatedTime: '60 min'
          }
        ]
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    name: 'HSC Chemistry',
    icon: '',
    color: 'from-blue-500 to-purple-600',
    description: 'Master HSC Chemistry through a structured learning journey',
    totalLevels: 24,
    modules: [
      {
        id: 'module-5',
        name: 'Module 5: Equilibrium & Acid Reactions',
        description: 'Chemical equilibrium and acid-base chemistry',
        totalLevels: 6,
        topics: [
          {
            id: 'equilibrium-intro',
            name: 'Introduction to Equilibrium',
            level: 1,
            description: 'Dynamic equilibrium and Le Chatelier\'s principle',
            prerequisites: [],
            xpReward: 100,
            questions: 15,
            difficulty: 'beginner',
            estimatedTime: '30 min'
          },
          {
            id: 'equilibrium-calculations',
            name: 'Equilibrium Calculations',
            level: 2,
            description: 'Equilibrium constants and calculations',
            prerequisites: ['equilibrium-intro'],
            xpReward: 120,
            questions: 18,
            difficulty: 'intermediate',
            estimatedTime: '40 min'
          },
          {
            id: 'acids-bases',
            name: 'Acids and Bases',
            level: 3,
            description: 'Brnsted-Lowry theory and pH',
            prerequisites: ['equilibrium-calculations'],
            xpReward: 130,
            questions: 16,
            difficulty: 'intermediate',
            estimatedTime: '35 min'
          },
          {
            id: 'buffer-solutions',
            name: 'Buffer Solutions',
            level: 4,
            description: 'Maintaining pH in solutions',
            prerequisites: ['acids-bases'],
            xpReward: 150,
            questions: 14,
            difficulty: 'intermediate',
            estimatedTime: '40 min'
          },
          {
            id: 'titrations',
            name: 'Acid-Base Titrations',
            level: 5,
            description: 'Analytical techniques and indicators',
            prerequisites: ['buffer-solutions'],
            xpReward: 160,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'solubility-equilibrium',
            name: 'Solubility Equilibrium',
            level: 6,
            description: 'Precipitation and dissolution',
            prerequisites: ['titrations'],
            xpReward: 170,
            questions: 15,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          }
        ]
      },
      {
        id: 'module-6',
        name: 'Module 6: Acid/Base Reactions',
        description: 'Advanced acid-base chemistry',
        totalLevels: 6,
        topics: [
          {
            id: 'weak-acids-bases',
            name: 'Weak Acids and Bases',
            level: 7,
            description: 'Partial ionisation and calculations',
            prerequisites: ['solubility-equilibrium'],
            xpReward: 140,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'polyprotic-acids',
            name: 'Polyprotic Acids',
            level: 8,
            description: 'Multiple proton transfer',
            prerequisites: ['weak-acids-bases'],
            xpReward: 160,
            questions: 14,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'amphiprotic-species',
            name: 'Amphiprotic Species',
            level: 9,
            description: 'Species that can donate or accept protons',
            prerequisites: ['polyprotic-acids'],
            xpReward: 150,
            questions: 15,
            difficulty: 'advanced',
            estimatedTime: '35 min'
          },
          {
            id: 'salt-hydrolysis',
            name: 'Salt Hydrolysis',
            level: 10,
            description: 'pH of salt solutions',
            prerequisites: ['amphiprotic-species'],
            xpReward: 170,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'indicators-design',
            name: 'Indicator Design',
            level: 11,
            description: 'How indicators work',
            prerequisites: ['salt-hydrolysis'],
            xpReward: 180,
            questions: 13,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'industrial-applications',
            name: 'Industrial Applications',
            level: 12,
            description: 'Acid-base chemistry in industry',
            prerequisites: ['indicators-design'],
            xpReward: 190,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          }
        ]
      },
      {
        id: 'module-7',
        name: 'Module 7: Organic Chemistry',
        description: 'Carbon chemistry and reactions',
        totalLevels: 6,
        topics: [
          {
            id: 'hydrocarbons',
            name: 'Hydrocarbons',
            level: 13,
            description: 'Alkanes, alkenes, and alkynes',
            prerequisites: ['industrial-applications'],
            xpReward: 140,
            questions: 18,
            difficulty: 'intermediate',
            estimatedTime: '40 min'
          },
          {
            id: 'functional-groups',
            name: 'Functional Groups',
            level: 14,
            description: 'Alcohols, aldehydes, ketones, acids',
            prerequisites: ['hydrocarbons'],
            xpReward: 160,
            questions: 20,
            difficulty: 'intermediate',
            estimatedTime: '45 min'
          },
          {
            id: 'isomerism',
            name: 'Isomerism',
            level: 15,
            description: 'Structural and stereoisomerism',
            prerequisites: ['functional-groups'],
            xpReward: 150,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'reaction-mechanisms',
            name: 'Reaction Mechanisms',
            level: 16,
            description: 'How organic reactions occur',
            prerequisites: ['isomerism'],
            xpReward: 180,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          },
          {
            id: 'polymers',
            name: 'Polymers',
            level: 17,
            description: 'Addition and condensation polymers',
            prerequisites: ['reaction-mechanisms'],
            xpReward: 170,
            questions: 15,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'biomolecules',
            name: 'Biomolecules',
            level: 18,
            description: 'Carbohydrates, proteins, lipids',
            prerequisites: ['polymers'],
            xpReward: 190,
            questions: 19,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          }
        ]
      },
      {
        id: 'module-8',
        name: 'Module 8: Applying Chemical Ideas',
        description: 'Chemistry in the real world',
        totalLevels: 6,
        topics: [
          {
            id: 'synthesis-design',
            name: 'Synthesis Design',
            level: 19,
            description: 'Planning chemical syntheses',
            prerequisites: ['biomolecules'],
            xpReward: 180,
            questions: 16,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'green-chemistry',
            name: 'Green Chemistry',
            level: 20,
            description: 'Sustainable chemical processes',
            prerequisites: ['synthesis-design'],
            xpReward: 170,
            questions: 14,
            difficulty: 'advanced',
            estimatedTime: '40 min'
          },
          {
            id: 'analytical-techniques',
            name: 'Analytical Techniques',
            level: 21,
            description: 'Spectroscopy and chromatography',
            prerequisites: ['green-chemistry'],
            xpReward: 190,
            questions: 18,
            difficulty: 'advanced',
            estimatedTime: '50 min'
          },
          {
            id: 'medicinal-chemistry',
            name: 'Medicinal Chemistry',
            level: 22,
            description: 'Drug design and action',
            prerequisites: ['analytical-techniques'],
            xpReward: 200,
            questions: 17,
            difficulty: 'advanced',
            estimatedTime: '45 min'
          },
          {
            id: 'materials-science',
            name: 'Materials Science',
            level: 23,
            description: 'Advanced materials and nanotechnology',
            prerequisites: ['medicinal-chemistry'],
            xpReward: 210,
            questions: 16,
            difficulty: 'expert',
            estimatedTime: '50 min'
          },
          {
            id: 'chemistry-mastery',
            name: 'Chemistry Mastery',
            level: 24,
            description: 'Integration and real-world applications',
            prerequisites: ['materials-science'],
            xpReward: 250,
            questions: 25,
            difficulty: 'expert',
            estimatedTime: '60 min'
          }
        ]
      }
    ]
  }
};

// Helper functions for pathway navigation
export const getTopicById = (subjectId, topicId) => {
  const subject = learningPathways[subjectId];
  if (!subject) return null;
  
  for (const module of subject.modules) {
    const topic = module.topics.find(t => t.id === topicId);
    if (topic) return { ...topic, moduleId: module.id, moduleName: module.name };
  }
  return null;
};

export const getNextTopic = (subjectId, currentTopicId) => {
  const subject = learningPathways[subjectId];
  if (!subject) return null;
  
  let foundCurrent = false;
  for (const module of subject.modules) {
    for (const topic of module.topics) {
      if (foundCurrent) {
        return { ...topic, moduleId: module.id, moduleName: module.name };
      }
      if (topic.id === currentTopicId) {
        foundCurrent = true;
      }
    }
  }
  return null;
};

export const getUnlockedTopics = (subjectId, completedTopics = []) => {
  const subject = learningPathways[subjectId];
  if (!subject) return [];
  
  const unlocked = [];
  const completed = new Set(completedTopics);
  
  for (const module of subject.modules) {
    for (const topic of module.topics) {
      // Check if all prerequisites are completed
      const prerequisitesMet = topic.prerequisites.every(prereq => completed.has(prereq));
      
      if (prerequisitesMet) {
        unlocked.push({ ...topic, moduleId: module.id, moduleName: module.name });
      }
    }
  }
  
  return unlocked;
};

export const calculateSubjectProgress = (subjectId, completedTopics = []) => {
  const subject = learningPathways[subjectId];
  if (!subject) return { progress: 0, level: 1, totalXP: 0 };
  
  const totalTopics = subject.modules.reduce((sum, module) => sum + module.topics.length, 0);
  const progress = (completedTopics.length / totalTopics) * 100;
  
  // Calculate XP and level
  let totalXP = 0;
  const completedSet = new Set(completedTopics);
  
  for (const module of subject.modules) {
    for (const topic of module.topics) {
      if (completedSet.has(topic.id)) {
        totalXP += topic.xpReward;
      }
    }
  }
  
  // Level calculation (every 500 XP = 1 level, starting at level 1)
  const level = Math.floor(totalXP / 500) + 1;
  
  return { progress: Math.round(progress), level, totalXP };
};
