// Biology Module 5: Reproduction Pathway Data Structure
// Sequential unlocking system: IQ1IQ2IQ3IQ4IQ5
// Students start with only IQ1 Dot Point 1 unlocked

export const BIOLOGY_MODULE_5_PATHWAY = {
  id: 'biology-module-5',
  name: 'Module 5: Reproduction',
  description: 'Cell Replication and Inheritance Patterns',
  totalDotPoints: 13, // 3+2+3+3+2
  requiredPassPercentage: 65,

  inquiryQuestions: {
    IQ1: {
      id: 'IQ1',
      title: 'How does reproduction ensure the continuity of a species?',
      description: 'Understanding reproductive processes and species survival',
      dotPoints: {
        'IQ1.1': {
          id: 'IQ1.1',
          title: 'Sexual and Asexual Reproduction Mechanisms',
          description: 'Analyse sexual and asexual methods in animals, plants, fungi, bacteria, and protists',
          isStartingPoint: true,
          unlocked: true, // Starting point - always unlocked
          prerequisites: [],
          content: {
            podcast: {
              id: 'IQ1.1-podcast',
              title: 'Reproductive Strategies in Nature',
              url: '/content/biology/module5/IQ1.1/podcast.mp3',
              duration: 15, // minutes
              accessed: false
            },
            video: {
              id: 'IQ1.1-video',
              title: 'Cell Division and Species Survival',
              url: '/content/biology/module5/IQ1.1/video.mp4',
              duration: 12,
              accessed: false
            },
            slides: {
              id: 'IQ1.1-slides',
              title: 'Reproduction Presentation Notes',
              url: '/content/biology/module5/IQ1.1/slides.pdf',
              pages: 24,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.1-quick',
              title: 'Quick Check: Reproduction Basics',
              unlocked: false, // Unlocked after all content accessed
              questionTypes: ['multiple-choice', 'true-false', 'match-definitions', 'fill-blanks'],
              questionCount: 8,
              timeLimit: 10, // minutes
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.1-long',
              title: 'HSC Response: Reproductive Strategies',
              unlocked: false,
              questionCount: 3,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true // Uses drag-drop sentence construction
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ1.2': {
          id: 'IQ1.2',
          title: 'Fertilisation, Implantation and Pregnancy',
          description: 'Analyse fertilisation, implantation and hormonal control of pregnancy in mammals',
          unlocked: false,
          prerequisites: ['IQ1.1'],
          content: {
            podcast: {
              id: 'IQ1.2-podcast',
              title: 'Sexual vs Asexual Reproduction Advantages',
              url: '/content/biology/module5/IQ1.2/podcast.mp3',
              duration: 18,
              accessed: false
            },
            video: {
              id: 'IQ1.2-video',
              title: 'Reproductive Methods in Biology',
              url: '/content/biology/module5/IQ1.2/video.mp4',
              duration: 16,
              accessed: false
            },
            slides: {
              id: 'IQ1.2-slides',
              title: 'Reproduction Types Study Guide',
              url: '/content/biology/module5/IQ1.2/slides.pdf',
              pages: 32,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.2-quick',
              title: 'Quick Check: Reproduction Types',
              unlocked: false,
              questionTypes: ['multiple-choice', 'cloze-passage', 'unjumble-words'],
              questionCount: 10,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.2-long',
              title: 'HSC Response: Advantages of Reproduction Types',
              unlocked: false,
              questionCount: 2,
              timeLimit: 20,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ1.3': {
          id: 'IQ1.3',
          title: 'Agricultural Manipulation of Reproduction',
          description: 'Evaluate the impact of scientific knowledge on manipulation of plant and animal reproduction in agriculture',
          unlocked: false,
          prerequisites: ['IQ1.2'],
          content: {
            podcast: {
              id: 'IQ1.3-podcast',
              title: 'Environment and Reproductive Success',
              url: '/content/biology/module5/IQ1.3/podcast.mp3',
              duration: 20,
              accessed: false
            },
            video: {
              id: 'IQ1.3-video',
              title: 'Environmental Pressures on Reproduction',
              url: '/content/biology/module5/IQ1.3/video.mp4',
              duration: 14,
              accessed: false
            },
            slides: {
              id: 'IQ1.3-slides',
              title: 'Reproductive Success Factors',
              url: '/content/biology/module5/IQ1.3/slides.pdf',
              pages: 28,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.3-quick',
              title: 'Quick Check: Environmental Factors',
              unlocked: false,
              questionTypes: ['multiple-choice', 'drag-drop', 'interactive'],
              questionCount: 9,
              timeLimit: 15,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.3-long',
              title: 'HSC Response: Environmental Impact Analysis',
              unlocked: false,
              questionCount: 4,
              timeLimit: 30,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        }
      }
    },

    IQ2: {
      id: 'IQ2',
      title: 'How important is it for genetic material to be replicated exactly?',
      description: 'Cell replication processes and their importance for species continuity',
      dotPoints: {
        'IQ2.1': {
          id: 'IQ2.1',
          title: 'Mitosis, Meiosis & DNA Replication',
          description: 'Model mitosis, meiosis and DNA replication using Watson-Crick model',
          unlocked: false,
          prerequisites: ['IQ1.3'],
          content: {
            podcast: {
              id: 'IQ2.1-podcast',
              title: 'Cell Cycle Checkpoints and Control',
              url: '/content/biology/module5/IQ2.1/podcast.mp3',
              duration: 22,
              accessed: false
            },
            video: {
              id: 'IQ2.1-video',
              title: 'Molecular Control of Cell Division',
              url: '/content/biology/module5/IQ2.1/video.mp4',
              duration: 18,
              accessed: false
            },
            slides: {
              id: 'IQ2.1-slides',
              title: 'Cell Cycle Control Mechanisms',
              url: '/content/biology/module5/IQ2.1/slides.pdf',
              pages: 35,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ2.1-quick',
              title: 'Quick Check: Cell Cycle Control',
              unlocked: false,
              questionTypes: ['multiple-choice', 'sequence-order', 'label-diagram'],
              questionCount: 12,
              timeLimit: 18,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ2.1-long',
              title: 'HSC Response: Cell Cycle Regulation',
              unlocked: false,
              questionCount: 3,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ2.2': {
          id: 'IQ2.2',
          title: 'Cell Replication and Species Continuity',
          description: 'Assess the effect of cell replication processes on continuity of species',
          unlocked: false,
          prerequisites: ['IQ2.1'],
          content: {
            podcast: {
              id: 'IQ2.2-podcast',
              title: 'Cell Differentiation in Development',
              url: '/content/biology/module5/IQ2.2/podcast.mp3',
              duration: 19,
              accessed: false
            },
            video: {
              id: 'IQ2.2-video',
              title: 'From Stem Cells to Specialized Cells',
              url: '/content/biology/module5/IQ2.2/video.mp4',
              duration: 21,
              accessed: false
            },
            slides: {
              id: 'IQ2.2-slides',
              title: 'Cell Differentiation Pathways',
              url: '/content/biology/module5/IQ2.2/slides.pdf',
              pages: 41,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ2.2-quick',
              title: 'Quick Check: Cell Differentiation',
              unlocked: false,
              questionTypes: ['multiple-choice', 'match-pairs', 'categorize'],
              questionCount: 10,
              timeLimit: 15,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ2.2-long',
              title: 'HSC Response: Development Processes',
              unlocked: false,
              questionCount: 4,
              timeLimit: 35,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        }
      }
    },

    IQ3: {
      id: 'IQ3',
      title: 'Why is polypeptide synthesis important?',
      description: 'DNA to protein synthesis processes and their importance',
      dotPoints: {
        'IQ3.1': {
          id: 'IQ3.1',
          title: 'DNA Forms in Eukaryotes and Prokaryotes',
          description: 'Model and compare DNA forms in eukaryotes and prokaryotes',
          unlocked: false,
          prerequisites: ['IQ2.2'],
          content: {
            podcast: {
              id: 'IQ3.1-podcast',
              title: 'DNA Structure and Gene Expression Control',
              url: '/content/biology/module5/IQ3.1/podcast.mp3',
              duration: 24,
              accessed: false
            },
            video: {
              id: 'IQ3.1-video',
              title: 'From DNA to Proteins: Gene Expression',
              url: '/content/biology/module5/IQ3.1/video.mp4',
              duration: 19,
              accessed: false
            },
            slides: {
              id: 'IQ3.1-slides',
              title: 'Gene Expression and Regulation',
              url: '/content/biology/module5/IQ3.1/slides.pdf',
              pages: 38,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ3.1-quick',
              title: 'Quick Check: DNA and Genes',
              unlocked: false,
              questionTypes: ['multiple-choice', 'sequence-dna', 'base-pairing'],
              questionCount: 11,
              timeLimit: 16,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ3.1-long',
              title: 'HSC Response: Gene Expression Regulation',
              unlocked: false,
              questionCount: 3,
              timeLimit: 28,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ3.2': {
          id: 'IQ3.2',
          title: 'Transcription Process',
          description: 'DNA to RNA transcription mechanisms',
          unlocked: false,
          prerequisites: ['IQ3.1'],
          content: {
            podcast: {
              id: 'IQ3.2-podcast',
              title: 'Transcription: DNA to RNA',
              url: '/content/biology/module5/IQ3.2/podcast.mp3',
              duration: 21,
              accessed: false
            },
            video: {
              id: 'IQ3.2-video',
              title: 'RNA Polymerase and Transcription',
              url: '/content/biology/module5/IQ3.2/video.mp4',
              duration: 17,
              accessed: false
            },
            slides: {
              id: 'IQ3.2-slides',
              title: 'Transcription Process and Control',
              url: '/content/biology/module5/IQ3.2/slides.pdf',
              pages: 33,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ3.2-quick',
              title: 'Quick Check: Transcription',
              unlocked: false,
              questionTypes: ['multiple-choice', 'process-steps', 'rna-types'],
              questionCount: 9,
              timeLimit: 14,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ3.2-long',
              title: 'HSC Response: Transcription Analysis',
              unlocked: false,
              questionCount: 2,
              timeLimit: 20,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ3.3': {
          id: 'IQ3.3',
          title: 'Translation and Protein Synthesis',
          description: 'RNA to protein translation process',
          unlocked: false,
          prerequisites: ['IQ3.2'],
          content: {
            podcast: {
              id: 'IQ3.3-podcast',
              title: 'Translation: RNA to Protein',
              url: '/content/biology/module5/IQ3.3/podcast.mp3',
              duration: 26,
              accessed: false
            },
            video: {
              id: 'IQ3.3-video',
              title: 'Ribosome and Protein Synthesis',
              url: '/content/biology/module5/IQ3.3/video.mp4',
              duration: 23,
              accessed: false
            },
            slides: {
              id: 'IQ3.3-slides',
              title: 'Translation and Protein Folding',
              url: '/content/biology/module5/IQ3.3/slides.pdf',
              pages: 45,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ3.3-quick',
              title: 'Quick Check: Translation',
              unlocked: false,
              questionTypes: ['multiple-choice', 'genetic-code', 'amino-acid-sequence'],
              questionCount: 13,
              timeLimit: 20,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ3.3-long',
              title: 'HSC Response: Protein Synthesis Process',
              unlocked: false,
              questionCount: 5,
              timeLimit: 40,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        }
      }
    },

    IQ4: {
      id: 'IQ4',
      title: 'How do genetic variations arise?',
      description: 'Mechanisms of genetic diversity and mutation',
      dotPoints: {
        'IQ4.1': {
          id: 'IQ4.1',
          title: 'Meiosis and Genetic Recombination',
          description: 'Sexual reproduction and genetic shuffling',
          unlocked: false,
          prerequisites: ['IQ3.3'],
          content: {
            podcast: {
              id: 'IQ4.1-podcast',
              title: 'Meiosis and Genetic Diversity',
              url: '/content/biology/module5/IQ4.1/podcast.mp3',
              duration: 25,
              accessed: false
            },
            video: {
              id: 'IQ4.1-video',
              title: 'Crossing Over and Independent Assortment',
              url: '/content/biology/module5/IQ4.1/video.mp4',
              duration: 22,
              accessed: false
            },
            slides: {
              id: 'IQ4.1-slides',
              title: 'Meiosis and Genetic Recombination',
              url: '/content/biology/module5/IQ4.1/slides.pdf',
              pages: 42,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ4.1-quick',
              title: 'Quick Check: Meiosis',
              unlocked: false,
              questionTypes: ['multiple-choice', 'meiosis-phases', 'genetic-crosses'],
              questionCount: 12,
              timeLimit: 18,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ4.1-long',
              title: 'HSC Response: Genetic Recombination',
              unlocked: false,
              questionCount: 4,
              timeLimit: 35,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ4.2': {
          id: 'IQ4.2',
          title: 'Mutations and Mutagens',
          description: 'Sources and types of genetic mutations',
          unlocked: false,
          prerequisites: ['IQ4.1'],
          content: {
            podcast: {
              id: 'IQ4.2-podcast',
              title: 'Mutations: Types and Causes',
              url: '/content/biology/module5/IQ4.2/podcast.mp3',
              duration: 23,
              accessed: false
            },
            video: {
              id: 'IQ4.2-video',
              title: 'Mutagens and DNA Damage',
              url: '/content/biology/module5/IQ4.2/video.mp4',
              duration: 20,
              accessed: false
            },
            slides: {
              id: 'IQ4.2-slides',
              title: 'Mutation Types and Effects',
              url: '/content/biology/module5/IQ4.2/slides.pdf',
              pages: 36,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ4.2-quick',
              title: 'Quick Check: Mutations',
              unlocked: false,
              questionTypes: ['multiple-choice', 'mutation-types', 'mutagen-effects'],
              questionCount: 10,
              timeLimit: 15,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ4.2-long',
              title: 'HSC Response: Mutation Analysis',
              unlocked: false,
              questionCount: 3,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ4.3': {
          id: 'IQ4.3',
          title: 'Environmental Factors and Genetic Variation',
          description: 'How environment influences genetic expression',
          unlocked: false,
          prerequisites: ['IQ4.2'],
          content: {
            podcast: {
              id: 'IQ4.3-podcast',
              title: 'Environment and Gene Expression',
              url: '/content/biology/module5/IQ4.3/podcast.mp3',
              duration: 21,
              accessed: false
            },
            video: {
              id: 'IQ4.3-video',
              title: 'Epigenetics and Environmental Influence',
              url: '/content/biology/module5/IQ4.3/video.mp4',
              duration: 18,
              accessed: false
            },
            slides: {
              id: 'IQ4.3-slides',
              title: 'Environmental Genetics',
              url: '/content/biology/module5/IQ4.3/slides.pdf',
              pages: 29,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ4.3-quick',
              title: 'Quick Check: Environmental Genetics',
              unlocked: false,
              questionTypes: ['multiple-choice', 'environmental-scenarios', 'epigenetics'],
              questionCount: 8,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ4.3-long',
              title: 'HSC Response: Environmental Impact on Genetics',
              unlocked: false,
              questionCount: 3,
              timeLimit: 30,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        }
      }
    },

    IQ5: {
      id: 'IQ5',
      title: 'How do inheritance patterns explain genetic diversity?',
      description: 'Mendel\'s laws and inheritance mechanisms',
      dotPoints: {
        'IQ5.1': {
          id: 'IQ5.1',
          title: 'Mendelian Inheritance Patterns',
          description: 'Classic inheritance laws and genetic crosses',
          unlocked: false,
          prerequisites: ['IQ4.3'],
          content: {
            podcast: {
              id: 'IQ5.1-podcast',
              title: 'Mendel\'s Laws of Inheritance',
              url: '/content/biology/module5/IQ5.1/podcast.mp3',
              duration: 27,
              accessed: false
            },
            video: {
              id: 'IQ5.1-video',
              title: 'Genetic Crosses and Punnett Squares',
              url: '/content/biology/module5/IQ5.1/video.mp4',
              duration: 24,
              accessed: false
            },
            slides: {
              id: 'IQ5.1-slides',
              title: 'Mendelian Genetics and Inheritance',
              url: '/content/biology/module5/IQ5.1/slides.pdf',
              pages: 48,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ5.1-quick',
              title: 'Quick Check: Mendelian Genetics',
              unlocked: false,
              questionTypes: ['multiple-choice', 'punnett-squares', 'genetic-ratios'],
              questionCount: 14,
              timeLimit: 22,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ5.1-long',
              title: 'HSC Response: Inheritance Patterns',
              unlocked: false,
              questionCount: 5,
              timeLimit: 45,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        },
        'IQ5.2': {
          id: 'IQ5.2',
          title: 'Non-Mendelian Inheritance and Genetic Diversity',
          description: 'Complex inheritance patterns and population genetics',
          unlocked: false,
          prerequisites: ['IQ5.1'],
          content: {
            podcast: {
              id: 'IQ5.2-podcast',
              title: 'Beyond Mendel: Complex Inheritance',
              url: '/content/biology/module5/IQ5.2/podcast.mp3',
              duration: 29,
              accessed: false
            },
            video: {
              id: 'IQ5.2-video',
              title: 'Codominance, Polygenic, and Sex-linked Traits',
              url: '/content/biology/module5/IQ5.2/video.mp4',
              duration: 26,
              accessed: false
            },
            slides: {
              id: 'IQ5.2-slides',
              title: 'Complex Inheritance and Population Genetics',
              url: '/content/biology/module5/IQ5.2/slides.pdf',
              pages: 52,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ5.2-quick',
              title: 'Quick Check: Complex Inheritance',
              unlocked: false,
              questionTypes: ['multiple-choice', 'inheritance-patterns', 'population-genetics'],
              questionCount: 15,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ5.2-long',
              title: 'HSC Response: Genetic Diversity and Inheritance',
              unlocked: false,
              questionCount: 6,
              timeLimit: 50,
              attempts: 0,
              bestScore: null,
              passed: false,
              sentencePools: true
            }
          },
          completed: false,
          accessTimestamp: null,
          completedTimestamp: null
        }
      }
    }
  }
};

// Helper functions for pathway management
export const getPathwayProgress = (userProgress) => {
  if (!userProgress || !userProgress['biology-module-5']) return null;
  
  return userProgress['biology-module-5'];
};

export const isContentAccessible = (dotPointId, userProgress) => {
  const pathwayData = BIOLOGY_MODULE_5_PATHWAY;
  const userPathwayProgress = getPathwayProgress(userProgress);
  
  if (!userPathwayProgress) return false;
  
  // Find the dot point
  for (const iq of Object.values(pathwayData.inquiryQuestions)) {
    for (const dotPoint of Object.values(iq.dotPoints)) {
      if (dotPoint.id === dotPointId) {
        return dotPoint.unlocked || userPathwayProgress.unlockedDotPoints?.includes(dotPointId);
      }
    }
  }
  
  return false;
};

export const areAllContentItemsAccessed = (dotPointId, userProgress) => {
  const userPathwayProgress = getPathwayProgress(userProgress);
  if (!userPathwayProgress?.contentAccess) return false;
  
  const contentAccess = userPathwayProgress.contentAccess[dotPointId];
  if (!contentAccess) return false;
  
  return contentAccess.podcast && contentAccess.video && contentAccess.slides;
};

export const canTakeQuiz = (dotPointId, quizType, userProgress) => {
  // Must have accessed all content first
  if (!areAllContentItemsAccessed(dotPointId, userProgress)) return false;
  
  const userPathwayProgress = getPathwayProgress(userProgress);
  const quizProgress = userPathwayProgress?.quizProgress?.[dotPointId];
  
  if (!quizProgress) return true; // First attempt allowed
  
  // Allow immediate retry if failed
  if (quizType === 'quickQuiz') {
    return !quizProgress.quickQuizPassed;
  } else if (quizType === 'longResponse') {
    return !quizProgress.longResponsePassed;
  }
  
  return false;
};

export const isDotPointCompleted = (dotPointId, userProgress) => {
  const userPathwayProgress = getPathwayProgress(userProgress);
  if (!userPathwayProgress?.quizProgress) return false;
  
  const quizProgress = userPathwayProgress.quizProgress[dotPointId];
  return quizProgress?.quickQuizPassed && quizProgress?.longResponsePassed;
};

export const getNextUnlockedDotPoint = (userProgress) => {
  const pathwayData = BIOLOGY_MODULE_5_PATHWAY;
  const userPathwayProgress = getPathwayProgress(userProgress);
  
  if (!userPathwayProgress) return 'IQ1.1'; // Starting point
  
  const allDotPoints = [];
  for (const iq of Object.values(pathwayData.inquiryQuestions)) {
    for (const dotPoint of Object.values(iq.dotPoints)) {
      allDotPoints.push(dotPoint);
    }
  }
  
  // Find first incomplete dot point
  for (const dotPoint of allDotPoints) {
    if (!isDotPointCompleted(dotPoint.id, userProgress)) {
      return dotPoint.id;
    }
  }
  
  return null; // All completed
};

export const calculateModuleProgress = (userProgress) => {
  const pathwayData = BIOLOGY_MODULE_5_PATHWAY;
  const totalDotPoints = pathwayData.totalDotPoints;
  
  let completedDotPoints = 0;
  
  for (const iq of Object.values(pathwayData.inquiryQuestions)) {
    for (const dotPoint of Object.values(iq.dotPoints)) {
      if (isDotPointCompleted(dotPoint.id, userProgress)) {
        completedDotPoints++;
      }
    }
  }
  
  return Math.round((completedDotPoints / totalDotPoints) * 100);
};
