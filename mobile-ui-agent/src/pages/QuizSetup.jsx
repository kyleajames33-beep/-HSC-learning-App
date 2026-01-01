import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizSetup = ({ subject, onBack, onStartQuiz }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedLength, setSelectedLength] = useState(10);
  const [showTimer, setShowTimer] = useState(true);

  const modules = {
    biology: [
      {
        id: 5,
        name: 'Module 5',
        title: 'Heredity',
        description: 'DNA, genes, inheritance patterns, and genetic variation',
        topics: ['DNA Structure', 'Protein Synthesis', 'Mutations', 'Inheritance'],
        difficulty: 'Medium',
        emoji: ''
      },
      {
        id: 6,
        name: 'Module 6',
        title: 'Genetic Change',
        description: 'Evolution, natural selection, and biotechnology',
        topics: ['Evolution Theory', 'Natural Selection', 'Biotechnology', 'Genetic Engineering'],
        difficulty: 'Hard',
        emoji: ''
      },
      {
        id: 7,
        name: 'Module 7',
        title: 'Infectious Disease',
        description: 'Pathogens, immune system, and disease prevention',
        topics: ['Pathogens', 'Immune Response', 'Vaccines', 'Antibiotics'],
        difficulty: 'Medium',
        emoji: ''
      },
      {
        id: 8,
        name: 'Module 8',
        title: 'Non-infectious Disease',
        description: 'Cancer, genetic disorders, and lifestyle diseases',
        topics: ['Cancer Biology', 'Genetic Disorders', 'Lifestyle Factors', 'Prevention'],
        difficulty: 'Hard',
        emoji: ''
      }
    ],
    chemistry: [
      {
        id: 5,
        name: 'Module 5',
        title: 'Equilibrium & Acid Reactions',
        description: 'Chemical equilibrium, acids, bases, and buffer systems',
        topics: ['Le Chatelier\'s Principle', 'pH Calculations', 'Buffer Systems', 'Titrations'],
        difficulty: 'Hard',
        emoji: ''
      },
      {
        id: 6,
        name: 'Module 6',
        title: 'Acid/Base Reactions',
        description: 'Advanced acid-base chemistry and analytical techniques',
        topics: ['Strong vs Weak Acids', 'Polyprotic Acids', 'Indicators', 'Volumetric Analysis'],
        difficulty: 'Hard',
        emoji: ''
      },
      {
        id: 7,
        name: 'Module 7',
        title: 'Organic Chemistry',
        description: 'Carbon compounds, functional groups, and reactions',
        topics: ['Hydrocarbons', 'Functional Groups', 'Reaction Mechanisms', 'Polymers'],
        difficulty: 'Medium',
        emoji: ''
      },
      {
        id: 8,
        name: 'Module 8',
        title: 'Applying Chemical Ideas',
        description: 'Industrial chemistry, materials, and environmental applications',
        topics: ['Industrial Processes', 'Materials Science', 'Green Chemistry', 'Nanotechnology'],
        difficulty: 'Hard',
        emoji: ''
      }
    ]
  };

  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      description: 'Basic concepts and definitions',
      color: 'from-green-500 to-emerald-600',
      emoji: '',
      recommendation: 'Perfect for reviewing fundamentals'
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Application and analysis questions',
      color: 'from-yellow-500 to-orange-600',
      emoji: '',
      recommendation: 'Great for building confidence'
    },
    {
      id: 'hard',
      name: 'Hard',
      description: 'Complex problem-solving and synthesis',
      color: 'from-red-500 to-purple-600',
      emoji: '',
      recommendation: 'HSC exam level challenge'
    }
  ];

  const quizLengths = [5, 10, 15, 20];

  const canStartQuiz = selectedModule && selectedDifficulty;

  const handleStartQuiz = () => {
    if (canStartQuiz) {
      onStartQuiz({
        subject: subject.id,
        module: selectedModule,
        difficulty: selectedDifficulty,
        length: selectedLength,
        timer: showTimer
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${subject.color} rounded-full flex items-center justify-center text-white text-lg`}>
              {subject.icon}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{subject.name} Quiz</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Module Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Choose Module</h2>
          <div className="space-y-3">
            {modules[subject.id].map((module, index) => (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedModule(module)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedModule?.id === module.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{module.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{module.name}: {module.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        module.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        module.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Difficulty Selection */}
        <AnimatePresence>
          {selectedModule && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900">Choose Difficulty</h2>
              <div className="grid gap-3">
                {difficulties.map((difficulty, index) => (
                  <motion.button
                    key={difficulty.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedDifficulty?.id === difficulty.id
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${difficulty.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                        {difficulty.emoji}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900">{difficulty.name}</h3>
                        <p className="text-sm text-gray-600">{difficulty.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{difficulty.recommendation}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Quiz Settings */}
        <AnimatePresence>
          {selectedDifficulty && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900">Quiz Settings</h2>

              {/* Quiz Length */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <h3 className="font-semibold text-gray-900 mb-3">Number of Questions</h3>
                <div className="grid grid-cols-4 gap-2">
                  {quizLengths.map((length) => (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`py-3 px-2 rounded-lg border-2 transition-colors font-medium ${
                        selectedLength === length
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Toggle */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Timer</h3>
                    <p className="text-sm text-gray-600">2 minutes per question</p>
                  </div>
                  <button
                    onClick={() => setShowTimer(!showTimer)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showTimer ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      showTimer ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Start Quiz Button */}
        <AnimatePresence>
          {canStartQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky bottom-4"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStartQuiz}
                className={`w-full bg-gradient-to-r ${subject.color} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Start {selectedLength} Question Quiz</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-white/80 mt-1">
                  {selectedModule.name}  {selectedDifficulty.name} Level
                </p>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default QuizSetup;
