// Biology Module 6: Genetic Change Pathway Data Structure
// Sequential unlocking system: IQ1→IQ2→IQ3
// Students start with only IQ1 Dot Point 1 unlocked

export const BIOLOGY_MODULE_6_PATHWAY = {
  id: 'biology-module-6',
  name: 'Module 6: Genetic Change',
  description: 'Mutation, biotechnology and population genetics',
  totalDotPoints: 18, // 6+5+7
  requiredPassPercentage: 65,

  inquiryQuestions: {
    IQ1: {
      id: 'IQ1',
      title: 'How does mutation introduce new alleles into a population?',
      description: 'Understanding mutation types, causes and effects on populations',
      dotPoints: {
        'IQ1.1': {
          id: 'IQ1.1',
          title: 'Range of Mutagens',
          description: 'Explain how a range of mutagens operate (electromagnetic radiation sources, chemicals, naturally occurring mutagens)',
          isStartingPoint: true,
          unlocked: true,
          prerequisites: [],
          content: {
            podcast: {
              id: 'IQ1.1-podcast',
              title: 'Mutagens in the Environment',
              url: '/content/biology/module6/IQ1.1/podcast.mp3',
              duration: 18,
              accessed: false
            },
            video: {
              id: 'IQ1.1-video',
              title: 'Types of Mutagens and DNA Damage',
              url: '/content/biology/module6/IQ1.1/video.mp4',
              duration: 14,
              accessed: false
            },
            slides: {
              id: 'IQ1.1-slides',
              title: 'Mutagens and DNA Damage Study Guide',
              url: '/content/biology/module6/IQ1.1/slides.pdf',
              pages: 22,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.1-quick',
              title: 'Quick Check: Mutagens',
              unlocked: false,
              questionTypes: ['multiple-choice', 'true-false', 'match-definitions'],
              questionCount: 6,
              timeLimit: 8,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.1-long',
              title: 'HSC Response: Mutagen Analysis',
              unlocked: false,
              questionCount: 2,
              timeLimit: 20,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ1.2': {
          id: 'IQ1.2',
          title: 'Mutation Types',
          description: 'Compare the causes, processes and effects of different types of mutation (point, chromosomal)',
          unlocked: false,
          prerequisites: ['IQ1.1'],
          content: {
            podcast: {
              id: 'IQ1.2-podcast',
              title: 'Point vs Chromosomal Mutations',
              url: '/content/biology/module6/IQ1.2/podcast.mp3',
              duration: 16,
              accessed: false
            },
            video: {
              id: 'IQ1.2-video',
              title: 'Mutation Mechanisms',
              url: '/content/biology/module6/IQ1.2/video.mp4',
              duration: 12,
              accessed: false
            },
            slides: {
              id: 'IQ1.2-slides',
              title: 'Mutation Classification',
              url: '/content/biology/module6/IQ1.2/slides.pdf',
              pages: 28,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.2-quick',
              title: 'Quick Check: Mutation Types',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.2-long',
              title: 'HSC Response: Mutation Comparison',
              unlocked: false,
              questionCount: 3,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ1.3': {
          id: 'IQ1.3',
          title: 'Somatic vs Germ-line Mutations',
          description: 'Distinguish between somatic and germ-line mutations and their effects',
          unlocked: false,
          prerequisites: ['IQ1.2'],
          content: {
            podcast: {
              id: 'IQ1.3-podcast',
              title: 'Inheritance of Mutations',
              url: '/content/biology/module6/IQ1.3/podcast.mp3',
              duration: 14,
              accessed: false
            },
            video: {
              id: 'IQ1.3-video',
              title: 'Somatic vs Germ-line Mutations',
              url: '/content/biology/module6/IQ1.3/video.mp4',
              duration: 10,
              accessed: false
            },
            slides: {
              id: 'IQ1.3-slides',
              title: 'Mutation Inheritance Patterns',
              url: '/content/biology/module6/IQ1.3/slides.pdf',
              pages: 18,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.3-quick',
              title: 'Quick Check: Mutation Inheritance',
              unlocked: false,
              questionCount: 6,
              timeLimit: 8,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.3-long',
              title: 'HSC Response: Somatic vs Germ-line',
              unlocked: false,
              questionCount: 2,
              timeLimit: 18,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ1.4': {
          id: 'IQ1.4',
          title: 'Coding vs Non-coding DNA',
          description: 'Assess the significance of coding and non-coding DNA segments in the process of mutation',
          unlocked: false,
          prerequisites: ['IQ1.3'],
          content: {
            podcast: {
              id: 'IQ1.4-podcast',
              title: 'DNA Regions and Mutation Impact',
              url: '/content/biology/module6/IQ1.4/podcast.mp3',
              duration: 20,
              accessed: false
            },
            video: {
              id: 'IQ1.4-video',
              title: 'Coding vs Non-coding DNA Mutations',
              url: '/content/biology/module6/IQ1.4/video.mp4',
              duration: 15,
              accessed: false
            },
            slides: {
              id: 'IQ1.4-slides',
              title: 'DNA Segments and Mutation Effects',
              url: '/content/biology/module6/IQ1.4/slides.pdf',
              pages: 24,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.4-quick',
              title: 'Quick Check: DNA Segments',
              unlocked: false,
              questionCount: 7,
              timeLimit: 9,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.4-long',
              title: 'HSC Response: Coding DNA Significance',
              unlocked: false,
              questionCount: 3,
              timeLimit: 22,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ1.5': {
          id: 'IQ1.5',
          title: 'Genetic Variation Causes',
          description: 'Investigate causes of genetic variation (fertilisation, meiosis, mutation)',
          unlocked: false,
          prerequisites: ['IQ1.4'],
          content: {
            podcast: {
              id: 'IQ1.5-podcast',
              title: 'Sources of Genetic Diversity',
              url: '/content/biology/module6/IQ1.5/podcast.mp3',
              duration: 22,
              accessed: false
            },
            video: {
              id: 'IQ1.5-video',
              title: 'Meiosis, Fertilisation and Mutation',
              url: '/content/biology/module6/IQ1.5/video.mp4',
              duration: 18,
              accessed: false
            },
            slides: {
              id: 'IQ1.5-slides',
              title: 'Genetic Variation Investigation',
              url: '/content/biology/module6/IQ1.5/slides.pdf',
              pages: 30,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.5-quick',
              title: 'Quick Check: Genetic Variation',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.5-long',
              title: 'HSC Response: Variation Sources',
              unlocked: false,
              questionCount: 3,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ1.6': {
          id: 'IQ1.6',
          title: 'Population Gene Pool Effects',
          description: 'Evaluate effect of mutation, gene flow and genetic drift on gene pool',
          unlocked: false,
          prerequisites: ['IQ1.5'],
          content: {
            podcast: {
              id: 'IQ1.6-podcast',
              title: 'Population Genetics Mechanisms',
              url: '/content/biology/module6/IQ1.6/podcast.mp3',
              duration: 24,
              accessed: false
            },
            video: {
              id: 'IQ1.6-video',
              title: 'Gene Pool Changes Over Time',
              url: '/content/biology/module6/IQ1.6/video.mp4',
              duration: 20,
              accessed: false
            },
            slides: {
              id: 'IQ1.6-slides',
              title: 'Population Genetics Analysis',
              url: '/content/biology/module6/IQ1.6/slides.pdf',
              pages: 26,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.6-quick',
              title: 'Quick Check: Gene Pool',
              unlocked: false,
              questionCount: 9,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.6-long',
              title: 'HSC Response: Population Genetics',
              unlocked: false,
              questionCount: 4,
              timeLimit: 30,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        }
      }
    },
    IQ2: {
      id: 'IQ2',
      title: 'How do genetic techniques affect Earth\'s biodiversity?',
      description: 'Examining biotechnology applications and their environmental impacts',
      dotPoints: {
        'IQ2.1': {
          id: 'IQ2.1',
          title: 'Biotechnology Applications',
          description: 'Investigate uses and applications of biotechnology (past, present, future)',
          unlocked: false,
          prerequisites: ['IQ1.6'],
          content: {
            podcast: {
              id: 'IQ2.1-podcast',
              title: 'Evolution of Biotechnology',
              url: '/content/biology/module6/IQ2.1/podcast.mp3',
              duration: 25,
              accessed: false
            },
            video: {
              id: 'IQ2.1-video',
              title: 'Biotechnology Timeline',
              url: '/content/biology/module6/IQ2.1/video.mp4',
              duration: 22,
              accessed: false
            },
            slides: {
              id: 'IQ2.1-slides',
              title: 'Biotechnology Applications Survey',
              url: '/content/biology/module6/IQ2.1/slides.pdf',
              pages: 32,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ2.1-quick',
              title: 'Quick Check: Biotech Applications',
              unlocked: false,
              questionCount: 10,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ2.1-long',
              title: 'HSC Response: Biotechnology Timeline',
              unlocked: false,
              questionCount: 3,
              timeLimit: 25,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        }
        // Continue with IQ2.2-IQ2.5 and IQ3.1-IQ3.7 following the same pattern...
      }
    }
  }
};