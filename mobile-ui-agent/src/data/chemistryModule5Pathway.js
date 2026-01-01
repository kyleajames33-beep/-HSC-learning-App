// Chemistry Module 5: Equilibrium and Acid Reactions Pathway Data Structure
// Sequential unlocking system: IQ1→IQ2→IQ3→IQ4
// Students start with only IQ1 Dot Point 1 unlocked

export const CHEMISTRY_MODULE_5_PATHWAY = {
  id: 'chemistry-module-5',
  name: 'Module 5: Equilibrium and Acid Reactions',
  description: 'Chemical equilibrium, reaction rates, and acid-base theory',
  totalDotPoints: 13, // 4+3+3+3
  requiredPassPercentage: 65,

  inquiryQuestions: {
    IQ1: {
      id: 'IQ1',
      title: 'How do gas laws help to understand the behaviour of gases?',
      description: 'Understanding gas properties and behaviour using gas laws',
      dotPoints: {
        'IQ1.1': {
          id: 'IQ1.1',
          title: 'Gas Law Applications',
          description: 'Investigate the behaviour of gases using gas laws (PV=nRT)',
          isStartingPoint: true,
          unlocked: true,
          prerequisites: [],
          content: {
            podcast: {
              id: 'IQ1.1-podcast',
              title: 'Gas Laws and Real-World Applications',
              url: '/content/chemistry/module5/IQ1.1/podcast.mp3',
              duration: 18,
              accessed: false
            },
            video: {
              id: 'IQ1.1-video',
              title: 'Ideal Gas Law Calculations',
              url: '/content/chemistry/module5/IQ1.1/video.mp4',
              duration: 15,
              accessed: false
            },
            slides: {
              id: 'IQ1.1-slides',
              title: 'Gas Laws Study Guide',
              url: '/content/chemistry/module5/IQ1.1/slides.pdf',
              pages: 28,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.1-quick',
              title: 'Quick Check: Gas Laws',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.1-long',
              title: 'HSC Response: Gas Law Applications',
              unlocked: false,
              questionCount: 3,
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
          title: 'Gas Law Calculations',
          description: 'Solve problems using gas laws and understand limitations of ideal gas assumptions',
          unlocked: false,
          prerequisites: ['IQ1.1'],
          content: {
            podcast: {
              id: 'IQ1.2-podcast',
              title: 'Advanced Gas Law Calculations',
              url: '/content/chemistry/module5/IQ1.2/podcast.mp3',
              duration: 16,
              accessed: false
            },
            video: {
              id: 'IQ1.2-video',
              title: 'Complex Gas Law Problems',
              url: '/content/chemistry/module5/IQ1.2/video.mp4',
              duration: 14,
              accessed: false
            },
            slides: {
              id: 'IQ1.2-slides',
              title: 'Gas Law Problem Solving',
              url: '/content/chemistry/module5/IQ1.2/slides.pdf',
              pages: 22,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.2-quick',
              title: 'Quick Check: Gas Calculations',
              unlocked: false,
              questionCount: 6,
              timeLimit: 8,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.2-long',
              title: 'HSC Response: Gas Law Problems',
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
        'IQ1.3': {
          id: 'IQ1.3',
          title: 'Real vs Ideal Gases',
          description: 'Evaluate limitations of ideal gas model and conditions where real gases deviate',
          unlocked: false,
          prerequisites: ['IQ1.2'],
          content: {
            podcast: {
              id: 'IQ1.3-podcast',
              title: 'When Gases Behave Unexpectedly',
              url: '/content/chemistry/module5/IQ1.3/podcast.mp3',
              duration: 14,
              accessed: false
            },
            video: {
              id: 'IQ1.3-video',
              title: 'Real Gas Behavior and Van der Waals',
              url: '/content/chemistry/module5/IQ1.3/video.mp4',
              duration: 12,
              accessed: false
            },
            slides: {
              id: 'IQ1.3-slides',
              title: 'Real vs Ideal Gas Comparison',
              url: '/content/chemistry/module5/IQ1.3/slides.pdf',
              pages: 20,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.3-quick',
              title: 'Quick Check: Real Gas Behavior',
              unlocked: false,
              questionCount: 7,
              timeLimit: 9,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.3-long',
              title: 'HSC Response: Gas Model Limitations',
              unlocked: false,
              questionCount: 2,
              timeLimit: 16,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ1.4': {
          id: 'IQ1.4',
          title: 'Gas Law Experimental Design',
          description: 'Design experiments to investigate gas laws and analyse experimental data',
          unlocked: false,
          prerequisites: ['IQ1.3'],
          content: {
            podcast: {
              id: 'IQ1.4-podcast',
              title: 'Experimental Gas Law Investigations',
              url: '/content/chemistry/module5/IQ1.4/podcast.mp3',
              duration: 20,
              accessed: false
            },
            video: {
              id: 'IQ1.4-video',
              title: 'Gas Law Laboratory Techniques',
              url: '/content/chemistry/module5/IQ1.4/video.mp4',
              duration: 18,
              accessed: false
            },
            slides: {
              id: 'IQ1.4-slides',
              title: 'Gas Law Experiment Design',
              url: '/content/chemistry/module5/IQ1.4/slides.pdf',
              pages: 26,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ1.4-quick',
              title: 'Quick Check: Gas Experiments',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ1.4-long',
              title: 'HSC Response: Experimental Design',
              unlocked: false,
              questionCount: 3,
              timeLimit: 22,
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
      title: 'How can the position of equilibrium be predicted for any reaction?',
      description: 'Understanding chemical equilibrium and factors affecting equilibrium position',
      dotPoints: {
        'IQ2.1': {
          id: 'IQ2.1',
          title: 'Le Chatelier\'s Principle',
          description: 'Investigate the effects of temperature, concentration, volume and pressure on equilibrium',
          unlocked: false,
          prerequisites: ['IQ1.4'],
          content: {
            podcast: {
              id: 'IQ2.1-podcast',
              title: 'Le Chatelier\'s Principle in Action',
              url: '/content/chemistry/module5/IQ2.1/podcast.mp3',
              duration: 22,
              accessed: false
            },
            video: {
              id: 'IQ2.1-video',
              title: 'Equilibrium Shifts and Predictions',
              url: '/content/chemistry/module5/IQ2.1/video.mp4',
              duration: 16,
              accessed: false
            },
            slides: {
              id: 'IQ2.1-slides',
              title: 'Le Chatelier\'s Principle Guide',
              url: '/content/chemistry/module5/IQ2.1/slides.pdf',
              pages: 30,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ2.1-quick',
              title: 'Quick Check: Le Chatelier\'s Principle',
              unlocked: false,
              questionCount: 9,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ2.1-long',
              title: 'HSC Response: Equilibrium Predictions',
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
        'IQ2.2': {
          id: 'IQ2.2',
          title: 'Equilibrium Constants',
          description: 'Calculate and interpret equilibrium constants (Kc, Kp) and their relationship to temperature',
          unlocked: false,
          prerequisites: ['IQ2.1'],
          content: {
            podcast: {
              id: 'IQ2.2-podcast',
              title: 'Equilibrium Constants and Calculations',
              url: '/content/chemistry/module5/IQ2.2/podcast.mp3',
              duration: 18,
              accessed: false
            },
            video: {
              id: 'IQ2.2-video',
              title: 'Kc and Kp Calculations',
              url: '/content/chemistry/module5/IQ2.2/video.mp4',
              duration: 15,
              accessed: false
            },
            slides: {
              id: 'IQ2.2-slides',
              title: 'Equilibrium Constant Calculations',
              url: '/content/chemistry/module5/IQ2.2/slides.pdf',
              pages: 24,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ2.2-quick',
              title: 'Quick Check: Equilibrium Constants',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ2.2-long',
              title: 'HSC Response: K Calculations',
              unlocked: false,
              questionCount: 3,
              timeLimit: 20,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ2.3': {
          id: 'IQ2.3',
          title: 'Industrial Equilibrium Applications',
          description: 'Analyse industrial processes that rely on equilibrium principles (Haber, Contact process)',
          unlocked: false,
          prerequisites: ['IQ2.2'],
          content: {
            podcast: {
              id: 'IQ2.3-podcast',
              title: 'Industrial Chemistry and Equilibrium',
              url: '/content/chemistry/module5/IQ2.3/podcast.mp3',
              duration: 24,
              accessed: false
            },
            video: {
              id: 'IQ2.3-video',
              title: 'Haber Process and Industrial Applications',
              url: '/content/chemistry/module5/IQ2.3/video.mp4',
              duration: 20,
              accessed: false
            },
            slides: {
              id: 'IQ2.3-slides',
              title: 'Industrial Equilibrium Processes',
              url: '/content/chemistry/module5/IQ2.3/slides.pdf',
              pages: 32,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ2.3-quick',
              title: 'Quick Check: Industrial Processes',
              unlocked: false,
              questionCount: 7,
              timeLimit: 9,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ2.3-long',
              title: 'HSC Response: Industrial Applications',
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
    IQ3: {
      id: 'IQ3',
      title: 'How can the rate of a chemical reaction be controlled?',
      description: 'Understanding reaction rates and factors affecting reaction kinetics',
      dotPoints: {
        'IQ3.1': {
          id: 'IQ3.1',
          title: 'Collision Theory',
          description: 'Investigate reaction rates using collision theory and activation energy concepts',
          unlocked: false,
          prerequisites: ['IQ2.3'],
          content: {
            podcast: {
              id: 'IQ3.1-podcast',
              title: 'Collision Theory and Reaction Rates',
              url: '/content/chemistry/module5/IQ3.1/podcast.mp3',
              duration: 19,
              accessed: false
            },
            video: {
              id: 'IQ3.1-video',
              title: 'Activation Energy and Molecular Collisions',
              url: '/content/chemistry/module5/IQ3.1/video.mp4',
              duration: 16,
              accessed: false
            },
            slides: {
              id: 'IQ3.1-slides',
              title: 'Collision Theory Explained',
              url: '/content/chemistry/module5/IQ3.1/slides.pdf',
              pages: 26,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ3.1-quick',
              title: 'Quick Check: Collision Theory',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ3.1-long',
              title: 'HSC Response: Reaction Rate Theory',
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
        'IQ3.2': {
          id: 'IQ3.2',
          title: 'Factors Affecting Reaction Rate',
          description: 'Investigate effects of concentration, temperature, surface area, and catalysts on reaction rates',
          unlocked: false,
          prerequisites: ['IQ3.1'],
          content: {
            podcast: {
              id: 'IQ3.2-podcast',
              title: 'Controlling Chemical Reaction Rates',
              url: '/content/chemistry/module5/IQ3.2/podcast.mp3',
              duration: 21,
              accessed: false
            },
            video: {
              id: 'IQ3.2-video',
              title: 'Rate Factors and Experimental Design',
              url: '/content/chemistry/module5/IQ3.2/video.mp4',
              duration: 18,
              accessed: false
            },
            slides: {
              id: 'IQ3.2-slides',
              title: 'Reaction Rate Factors',
              url: '/content/chemistry/module5/IQ3.2/slides.pdf',
              pages: 28,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ3.2-quick',
              title: 'Quick Check: Rate Factors',
              unlocked: false,
              questionCount: 9,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ3.2-long',
              title: 'HSC Response: Rate Factor Analysis',
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
        'IQ3.3': {
          id: 'IQ3.3',
          title: 'Catalysts and Enzymes',
          description: 'Analyse the role of catalysts and enzymes in biological and industrial processes',
          unlocked: false,
          prerequisites: ['IQ3.2'],
          content: {
            podcast: {
              id: 'IQ3.3-podcast',
              title: 'Catalysts in Chemistry and Biology',
              url: '/content/chemistry/module5/IQ3.3/podcast.mp3',
              duration: 17,
              accessed: false
            },
            video: {
              id: 'IQ3.3-video',
              title: 'Enzyme Kinetics and Industrial Catalysts',
              url: '/content/chemistry/module5/IQ3.3/video.mp4',
              duration: 14,
              accessed: false
            },
            slides: {
              id: 'IQ3.3-slides',
              title: 'Catalysis and Enzyme Function',
              url: '/content/chemistry/module5/IQ3.3/slides.pdf',
              pages: 24,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ3.3-quick',
              title: 'Quick Check: Catalysts and Enzymes',
              unlocked: false,
              questionCount: 7,
              timeLimit: 9,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ3.3-long',
              title: 'HSC Response: Catalytic Processes',
              unlocked: false,
              questionCount: 2,
              timeLimit: 18,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        }
      }
    },
    IQ4: {
      id: 'IQ4',
      title: 'How are solutions acidic or basic?',
      description: 'Understanding acid-base theory, pH calculations, and buffer systems',
      dotPoints: {
        'IQ4.1': {
          id: 'IQ4.1',
          title: 'Acid-Base Theories',
          description: 'Compare Arrhenius, Brønsted-Lowry, and Lewis acid-base theories',
          unlocked: false,
          prerequisites: ['IQ3.3'],
          content: {
            podcast: {
              id: 'IQ4.1-podcast',
              title: 'Evolution of Acid-Base Theory',
              url: '/content/chemistry/module5/IQ4.1/podcast.mp3',
              duration: 20,
              accessed: false
            },
            video: {
              id: 'IQ4.1-video',
              title: 'Comparing Acid-Base Definitions',
              url: '/content/chemistry/module5/IQ4.1/video.mp4',
              duration: 16,
              accessed: false
            },
            slides: {
              id: 'IQ4.1-slides',
              title: 'Acid-Base Theory Comparison',
              url: '/content/chemistry/module5/IQ4.1/slides.pdf',
              pages: 30,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ4.1-quick',
              title: 'Quick Check: Acid-Base Theories',
              unlocked: false,
              questionCount: 8,
              timeLimit: 10,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ4.1-long',
              title: 'HSC Response: Theory Comparison',
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
        'IQ4.2': {
          id: 'IQ4.2',
          title: 'pH and pOH Calculations',
          description: 'Calculate pH, pOH, and concentrations of strong and weak acids and bases',
          unlocked: false,
          prerequisites: ['IQ4.1'],
          content: {
            podcast: {
              id: 'IQ4.2-podcast',
              title: 'pH Calculations and Acid Strength',
              url: '/content/chemistry/module5/IQ4.2/podcast.mp3',
              duration: 22,
              accessed: false
            },
            video: {
              id: 'IQ4.2-video',
              title: 'pH, pOH, and Ka Calculations',
              url: '/content/chemistry/module5/IQ4.2/video.mp4',
              duration: 18,
              accessed: false
            },
            slides: {
              id: 'IQ4.2-slides',
              title: 'pH Calculation Methods',
              url: '/content/chemistry/module5/IQ4.2/slides.pdf',
              pages: 26,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ4.2-quick',
              title: 'Quick Check: pH Calculations',
              unlocked: false,
              questionCount: 10,
              timeLimit: 12,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ4.2-long',
              title: 'HSC Response: Acid-Base Calculations',
              unlocked: false,
              questionCount: 4,
              timeLimit: 30,
              attempts: 0,
              bestScore: null,
              passed: false
            }
          },
          completed: false
        },
        'IQ4.3': {
          id: 'IQ4.3',
          title: 'Buffer Systems',
          description: 'Investigate buffer systems and their applications in biological and industrial contexts',
          unlocked: false,
          prerequisites: ['IQ4.2'],
          content: {
            podcast: {
              id: 'IQ4.3-podcast',
              title: 'Buffer Systems in Life and Industry',
              url: '/content/chemistry/module5/IQ4.3/podcast.mp3',
              duration: 19,
              accessed: false
            },
            video: {
              id: 'IQ4.3-video',
              title: 'How Buffers Maintain pH',
              url: '/content/chemistry/module5/IQ4.3/video.mp4',
              duration: 15,
              accessed: false
            },
            slides: {
              id: 'IQ4.3-slides',
              title: 'Buffer Chemistry and Applications',
              url: '/content/chemistry/module5/IQ4.3/slides.pdf',
              pages: 22,
              accessed: false
            }
          },
          quizzes: {
            quickQuiz: {
              id: 'IQ4.3-quick',
              title: 'Quick Check: Buffer Systems',
              unlocked: false,
              questionCount: 7,
              timeLimit: 9,
              attempts: 0,
              bestScore: null,
              passed: false
            },
            longResponse: {
              id: 'IQ4.3-long',
              title: 'HSC Response: Buffer Applications',
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
      }
    }
  }
};