import { computePathwayProgress } from '../utils/pathwayUtils';

const TOPIC_XP = 125;

export const learningPathways = {
  biology: {
    id: 'biology',
    name: 'HSC Biology',
    color: 'from-green-500 to-emerald-600',
    icon: '??',
    modules: [
      {
        id: 5,
        sequence: 1,
        name: 'Module 5: Heredity',
        prerequisiteModules: [],
        topics: [
          {
            id: 'bio5_dna_structure',
            name: 'DNA structure',
            xpReward: TOPIC_XP,
            prerequisites: []
          },
          {
            id: 'bio5_dna_replication',
            name: 'DNA replication',
            xpReward: TOPIC_XP,
            prerequisites: ['bio5_dna_structure']
          },
          {
            id: 'bio5_inheritance_patterns',
            name: 'Inheritance patterns',
            xpReward: TOPIC_XP,
            prerequisites: ['bio5_dna_structure', 'bio5_dna_replication']
          },
          {
            id: 'bio5_pedigrees',
            name: 'Pedigrees',
            xpReward: TOPIC_XP,
            prerequisites: ['bio5_inheritance_patterns']
          }
        ]
      },
      {
        id: 6,
        sequence: 2,
        name: 'Module 6: Genetic Change',
        prerequisiteModules: [5],
        topics: [
          {
            id: 'bio6_mutations',
            name: 'Mutations',
            xpReward: TOPIC_XP,
            prerequisites: ['bio5_dna_replication']
          },
          {
            id: 'bio6_natural_selection',
            name: 'Natural selection',
            xpReward: TOPIC_XP,
            prerequisites: ['bio6_mutations']
          },
          {
            id: 'bio6_evolution',
            name: 'Evolution',
            xpReward: TOPIC_XP,
            prerequisites: ['bio6_natural_selection']
          },
          {
            id: 'bio6_biotechnology',
            name: 'Biotechnology',
            xpReward: TOPIC_XP,
            prerequisites: ['bio6_mutations', 'bio5_inheritance_patterns']
          }
        ]
      },
      {
        id: 7,
        sequence: 3,
        name: 'Module 7: Infectious Disease',
        prerequisiteModules: [5, 6],
        topics: [
          {
            id: 'bio7_pathogens',
            name: 'Pathogens',
            xpReward: TOPIC_XP,
            prerequisites: []
          },
          {
            id: 'bio7_immune_response',
            name: 'Immune response',
            xpReward: TOPIC_XP,
            prerequisites: ['bio7_pathogens', 'bio6_mutations']
          },
          {
            id: 'bio7_vaccines',
            name: 'Vaccines',
            xpReward: TOPIC_XP,
            prerequisites: ['bio7_immune_response']
          },
          {
            id: 'bio7_prevention',
            name: 'Prevention',
            xpReward: TOPIC_XP,
            prerequisites: ['bio7_pathogens', 'bio7_vaccines']
          }
        ]
      },
      {
        id: 8,
        sequence: 4,
        name: 'Module 8: Non-infectious Disease',
        prerequisiteModules: [5, 6, 7],
        topics: [
          {
            id: 'bio8_risk_factors',
            name: 'Risk factors',
            xpReward: TOPIC_XP,
            prerequisites: ['bio7_prevention']
          },
          {
            id: 'bio8_disease_types',
            name: 'Disease types',
            xpReward: TOPIC_XP,
            prerequisites: ['bio8_risk_factors']
          },
          {
            id: 'bio8_treatment',
            name: 'Treatment',
            xpReward: TOPIC_XP,
            prerequisites: ['bio8_disease_types', 'bio7_immune_response']
          },
          {
            id: 'bio8_prevention',
            name: 'Prevention',
            xpReward: TOPIC_XP,
            prerequisites: ['bio8_risk_factors', 'bio7_prevention']
          }
        ]
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    name: 'HSC Chemistry',
    color: 'from-blue-500 to-cyan-600',
    icon: '??',
    modules: [
      {
        id: 5,
        sequence: 1,
        name: 'Module 5: Equilibrium',
        prerequisiteModules: [],
        topics: [
          {
            id: 'chem5_le_chat',
            name: 'Le Chatelier',
            xpReward: TOPIC_XP,
            prerequisites: []
          },
          {
            id: 'chem5_equilibrium_calculations',
            name: 'Equilibrium calculations',
            xpReward: TOPIC_XP,
            prerequisites: ['chem5_le_chat']
          },
          {
            id: 'chem5_acid_base_intro',
            name: 'Acid/base intro',
            xpReward: TOPIC_XP,
            prerequisites: ['chem5_equilibrium_calculations']
          }
        ]
      },
      {
        id: 6,
        sequence: 2,
        name: 'Module 6: Acid/Base',
        prerequisiteModules: [5],
        topics: [
          {
            id: 'chem6_ph_calculations',
            name: 'pH calculations',
            xpReward: TOPIC_XP,
            prerequisites: ['chem5_acid_base_intro']
          },
          {
            id: 'chem6_buffers',
            name: 'Buffers',
            xpReward: TOPIC_XP,
            prerequisites: ['chem6_ph_calculations']
          },
          {
            id: 'chem6_titrations',
            name: 'Titrations',
            xpReward: TOPIC_XP,
            prerequisites: ['chem6_buffers']
          },
          {
            id: 'chem6_indicators',
            name: 'Indicators',
            xpReward: TOPIC_XP,
            prerequisites: ['chem6_titrations']
          }
        ]
      },
      {
        id: 7,
        sequence: 3,
        name: 'Module 7: Organic',
        prerequisiteModules: [5, 6],
        topics: [
          {
            id: 'chem7_functional_groups',
            name: 'Functional groups',
            xpReward: TOPIC_XP,
            prerequisites: ['chem6_indicators']
          },
          {
            id: 'chem7_reactions',
            name: 'Reactions',
            xpReward: TOPIC_XP,
            prerequisites: ['chem7_functional_groups']
          },
          {
            id: 'chem7_mechanisms',
            name: 'Mechanisms',
            xpReward: TOPIC_XP,
            prerequisites: ['chem7_reactions']
          },
          {
            id: 'chem7_polymers',
            name: 'Polymers',
            xpReward: TOPIC_XP,
            prerequisites: ['chem7_mechanisms']
          }
        ]
      },
      {
        id: 8,
        sequence: 4,
        name: 'Module 8: Monitoring',
        prerequisiteModules: [5, 6, 7],
        topics: [
          {
            id: 'chem8_analysis_techniques',
            name: 'Analysis techniques',
            xpReward: TOPIC_XP,
            prerequisites: ['chem7_mechanisms']
          },
          {
            id: 'chem8_quantitative',
            name: 'Quantitative',
            xpReward: TOPIC_XP,
            prerequisites: ['chem8_analysis_techniques']
          },
          {
            id: 'chem8_qualitative',
            name: 'Qualitative',
            xpReward: TOPIC_XP,
            prerequisites: ['chem8_analysis_techniques']
          },
          {
            id: 'chem8_applications',
            name: 'Applications',
            xpReward: TOPIC_XP,
            prerequisites: ['chem8_quantitative', 'chem8_qualitative']
          }
        ]
      }
    ]
  }
};

const getSubjectPathway = (subjectId) => learningPathways[subjectId] || null;

export const getTopicById = (subjectId, topicId) => {
  const subject = getSubjectPathway(subjectId);
  if (!subject) {
    return null;
  }

  for (const module of subject.modules) {
    const topic = module.topics.find((item) => item.id === topicId);
    if (topic) {
      return {
        ...topic,
        moduleId: module.id,
        moduleName: module.name,
      };
    }
  }

  return null;
};

export const getUnlockedTopics = (subjectId, completedTopics = []) => {
  const subject = getSubjectPathway(subjectId);
  if (!subject) {
    return [];
  }

  const { modules } = computePathwayProgress(subject.modules, completedTopics);
  return modules
    .flatMap((module) => module.topics.map((topic) => ({
      ...topic,
      moduleId: module.id,
      moduleName: module.name,
    })))
    .filter((topic) => topic.unlocked);
};

export const getNextTopic = (subjectId, completedTopics = []) => {
  const subject = getSubjectPathway(subjectId);
  if (!subject) {
    return null;
  }

  const { nextTopic } = computePathwayProgress(subject.modules, completedTopics);
  return nextTopic;
};

export const calculateSubjectProgress = (subjectId, completedTopics = []) => {
  const subject = getSubjectPathway(subjectId);
  if (!subject) {
    return {
      progress: 0,
      level: 1,
      totalXP: 0,
    };
  }

  const { totalTopics, completedTopics: completedCount } = computePathwayProgress(
    subject.modules,
    completedTopics,
  );

  const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const totalXP = completedCount * TOPIC_XP;
  const level = Math.floor(totalXP / 500) + 1;

  return {
    progress,
    level,
    totalXP,
  };
};

/**
 * Gets all topic IDs for a given subject.
 * Useful for development overrides or bulk operations.
 * @param {string} subjectId - The ID of the subject (e.g., 'biology').
 * @returns {string[]} An array of all topic IDs for the subject.
 */
export const getAllTopicIds = (subjectId) => {
  const pathway = learningPathways[subjectId];
  if (!pathway || !pathway.modules) {
    return [];
  }

  return pathway.modules.flatMap(module => 
    (module.topics || []).map(topic => topic.id)
  );
};
