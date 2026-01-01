import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChemistryModule5.css';

const ChemistryModule5 = ({ onBack }) => {
  const [selectedDotPoint, setSelectedDotPoint] = useState('CQ5.1');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const dotPoints = {
    'CQ5.1': {
      name: 'Static and Dynamic Equilibrium',
      description: 'Understanding equilibrium states and Le Chatelier\'s principle',
      questions: [
        {
          id: 'CQ5.1-Q001',
          question: 'Which factors can affect the position of chemical equilibrium?',
          type: 'multiple-select',
          options: ['Temperature', 'Pressure', 'Concentration', 'Catalyst', 'Color of reactants'],
          correctAnswers: ['Temperature', 'Pressure', 'Concentration'],
          explanation: 'Le Chatelier\'s principle states that temperature, pressure, and concentration changes affect equilibrium position. Catalysts affect the rate but not the position.'
        },
        {
          id: 'CQ5.1-Q002',
          question: 'Arrange the steps showing how equilibrium responds to increased temperature in an endothermic reaction:',
          type: 'drag-sequence',
          items: [
            'Temperature increase applied',
            'System absorbs heat',
            'Forward reaction favored',
            'More products formed',
            'New equilibrium established'
          ],
          correctOrder: [0, 1, 2, 3, 4],
          explanation: 'For endothermic reactions, increasing temperature shifts equilibrium toward products to absorb the added heat.'
        },
        {
          id: 'CQ5.1-Q003',
          question: 'Identify the equilibrium arrow in this reaction diagram:',
          type: 'image-hotspot',
          imageUrl: '/images/equilibrium-reaction.png',
          hotspots: [
            { x: 45, y: 30, correct: true, label: 'Equilibrium arrows' },
            { x: 25, y: 50, correct: false, label: 'Reactant A' },
            { x: 75, y: 50, correct: false, label: 'Product B' }
          ],
          explanation: 'The double arrow () indicates that the reaction can proceed in both forward and reverse directions at equilibrium.'
        },
        {
          id: 'CQ5.1-Q004',
          question: 'Categorize these factors by their effect on equilibrium:',
          type: 'category-sort',
          categories: ['Shifts Equilibrium', 'Affects Rate Only', 'No Effect'],
          items: [
            { text: 'Adding catalyst', category: 'Affects Rate Only' },
            { text: 'Increasing temperature', category: 'Shifts Equilibrium' },
            { text: 'Changing pressure', category: 'Shifts Equilibrium' },
            { text: 'Adding inert gas', category: 'No Effect' },
            { text: 'Increasing concentration', category: 'Shifts Equilibrium' }
          ],
          explanation: 'Only temperature, pressure, and concentration changes shift equilibrium position. Catalysts speed up both forward and reverse reactions equally.'
        },
        {
          id: 'CQ5.1-Q005',
          question: 'Arrange these events in the correct sequence for Le Chatelier\'s principle:',
          type: 'timeline-builder',
          events: [
            { id: 1, text: 'System at equilibrium', time: 0 },
            { id: 2, text: 'Stress applied to system', time: 1 },
            { id: 3, text: 'System responds to counteract stress', time: 2 },
            { id: 4, text: 'New equilibrium position established', time: 3 }
          ],
          explanation: 'Le Chatelier\'s principle describes how systems respond to changes by counteracting the applied stress.'
        }
      ]
    },
    'CQ5.2': {
      name: 'Factors Affecting Equilibrium',
      description: 'Temperature, pressure, and concentration effects on equilibrium position',
      questions: [
        {
          id: 'CQ5.2-Q001',
          question: 'For the reaction N(g) + 3H(g)  2NH(g) + heat, what happens when pressure increases?',
          type: 'multiple-choice',
          options: [
            'Equilibrium shifts left (toward reactants)',
            'Equilibrium shifts right (toward products)',
            'No change in equilibrium position',
            'Reaction stops completely'
          ],
          correctAnswer: 1,
          explanation: 'Increasing pressure shifts equilibrium toward the side with fewer gas molecules. Reactants: 4 molecules, Products: 2 molecules.'
        },
        {
          id: 'CQ5.2-Q002',
          question: 'Complete the equilibrium expression flowchart:',
          type: 'flowchart-complete',
          flowchart: {
            nodes: [
              { id: 'start', text: 'Balanced equation', x: 50, y: 10 },
              { id: 'products', text: '[Products]', x: 20, y: 40, incomplete: false },
              { id: 'reactants', text: '[?]', x: 80, y: 40, incomplete: true, answer: 'Reactants' },
              { id: 'keq', text: 'K = ?/?', x: 50, y: 70, incomplete: true, answer: '[Products]/[Reactants]' }
            ],
            connections: [
              { from: 'start', to: 'products' },
              { from: 'start', to: 'reactants' },
              { from: 'products', to: 'keq' },
              { from: 'reactants', to: 'keq' }
            ]
          },
          explanation: 'The equilibrium constant K equals [Products]/[Reactants], each raised to their stoichiometric coefficients.'
        }
      ]
    },
    'CQ5.3': {
      name: 'Equilibrium Expressions and Constants',
      description: 'Writing equilibrium expressions and calculating equilibrium constants',
      questions: [
        {
          id: 'CQ5.3-Q001',
          question: 'For the reaction 2SO(g) + O(g)  2SO(g), write the equilibrium expression K =',
          type: 'graph-construct',
          graphType: 'expression-builder',
          components: [
            { type: 'concentration', symbol: '[SO]', power: 2 },
            { type: 'concentration', symbol: '[SO]', power: 2 },
            { type: 'concentration', symbol: '[O]', power: 1 },
            { type: 'operator', symbol: '/' },
            { type: 'operator', symbol: '' }
          ],
          correctExpression: '[SO]/([SO]  [O])',
          explanation: 'Products go on top, reactants on bottom, each raised to their stoichiometric coefficients.'
        },
        {
          id: 'CQ5.3-Q002',
          question: 'Adjust the K value slider to match the equilibrium position shown:',
          type: 'slider-scale',
          scale: { min: 0.001, max: 1000, unit: '', logarithmic: true },
          correctValue: 100,
          tolerance: 50,
          context: 'Equilibrium heavily favors products',
          explanation: 'When K >> 1, equilibrium lies far to the right, favoring product formation.'
        }
      ]
    },
    'CQ5.4': {
      name: 'Acids and Bases Theory',
      description: 'Arrhenius, Brnsted-Lowry, and Lewis acid-base theories',
      questions: [
        {
          id: 'CQ5.4-Q001',
          question: 'Categorize these substances according to acid-base theories:',
          type: 'venn-diagram',
          sets: ['Arrhenius Acids', 'Brnsted-Lowry Acids', 'Lewis Acids'],
          items: [
            { text: 'HCl', sets: ['Arrhenius Acids', 'Brnsted-Lowry Acids'] },
            { text: 'NH', sets: [] }, // Base, not acid
            { text: 'BF', sets: ['Lewis Acids'] },
            { text: 'HSO', sets: ['Arrhenius Acids', 'Brnsted-Lowry Acids'] },
            { text: 'AlCl', sets: ['Lewis Acids'] }
          ],
          explanation: 'Arrhenius acids produce H in water, Brnsted-Lowry acids donate protons, Lewis acids accept electron pairs.'
        }
      ]
    },
    'CQ5.5': {
      name: 'pH and pOH Calculations',
      description: 'Calculating pH, pOH, and hydrogen ion concentrations',
      questions: [
        {
          id: 'CQ5.5-Q001',
          question: 'Examine this pH indicator solution under the virtual microscope:',
          type: 'virtual-microscope',
          specimen: 'pH indicator solution',
          magnifications: [40, 100, 400],
          observations: [
            {
              magnification: 40,
              image: '/images/ph-indicator-40x.png',
              description: 'Red coloration throughout solution'
            },
            {
              magnification: 100,
              image: '/images/ph-indicator-100x.png',
              description: 'Individual indicator molecules visible'
            },
            {
              magnification: 400,
              image: '/images/ph-indicator-400x.png',
              description: 'Molecular structure showing protonated form'
            }
          ],
          questions: [
            {
              question: 'What can you conclude about this solution?',
              options: ['pH > 7 (basic)', 'pH < 7 (acidic)', 'pH = 7 (neutral)'],
              correct: 1
            }
          ],
          explanation: 'Red color indicates the protonated (acidic) form of the indicator is predominant.'
        }
      ]
    }
  };

  const getCurrentQuestions = () => {
    return dotPoints[selectedDotPoint]?.questions || [];
  };

  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    const questions = getCurrentQuestions();
    let correct = 0;
    
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (userAnswer !== undefined) {
        if (q.type === 'multiple-choice' && userAnswer === q.correctAnswer) {
          correct++;
        } else if (q.type === 'multiple-select' && 
          Array.isArray(userAnswer) && 
          userAnswer.length === q.correctAnswers.length &&
          userAnswer.every(ans => q.correctAnswers.includes(ans))) {
          correct++;
        }
        // Add other question type scoring logic here
      }
    });
    
    return Math.round((correct / questions.length) * 100);
  };

  const renderQuestion = (question) => {
    const userAnswer = userAnswers[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="question-content">
            <h3 className="question-text">{question.question}</h3>
            <div className="options-list">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, index)}
                  className={`option-button ${userAnswer === index ? 'selected' : ''}`}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'multiple-select':
        return (
          <div className="question-content">
            <h3 className="question-text">{question.question}</h3>
            <p className="instruction">Select all correct answers:</p>
            <div className="options-list">
              {question.options.map((option, index) => {
                const isSelected = userAnswer?.includes(option);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const current = userAnswer || [];
                      const updated = isSelected 
                        ? current.filter(a => a !== option)
                        : [...current, option];
                      handleAnswer(question.id, updated);
                    }}
                    className={`option-button multi-select ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="option-checkbox">
                      {isSelected ? '' : ''}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'drag-sequence':
        return (
          <div className="question-content">
            <h3 className="question-text">{question.question}</h3>
            <p className="instruction">Drag items to arrange them in the correct sequence:</p>
            <div className="sequence-container">
              {question.items.map((item, index) => (
                <div
                  key={index}
                  className="sequence-item"
                  draggable
                >
                  <span className="sequence-number">{index + 1}</span>
                  <span className="sequence-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="question-content">
            <h3 className="question-text">{question.question}</h3>
            <div className="placeholder-content">
              <div className="placeholder-icon"></div>
              <p>This question type ({question.type}) is under development</p>
              <p className="placeholder-hint">Coming soon with interactive features!</p>
            </div>
          </div>
        );
    }
  };

  const questions = getCurrentQuestions();
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="chemistry-module5">
      <div className="module-container">
        <header className="module-header">
          <button onClick={onBack} className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="header-content">
            <h1> Chemistry Module 5</h1>
            <p>Equilibrium & Acid Reactions</p>
          </div>

          <div className="module-stats">
            <div className="stat">
              <span className="stat-value">{Math.floor(timeSpent / 60000)}:{Math.floor((timeSpent % 60000) / 1000).toString().padStart(2, '0')}</span>
              <span className="stat-label">Time</span>
            </div>
            <div className="stat">
              <span className="stat-value">{currentQuestion + 1}/{questions.length}</span>
              <span className="stat-label">Progress</span>
            </div>
          </div>
        </header>

        <div className="module-content">
          <aside className="dot-points-sidebar">
            <h3>Learning Objectives</h3>
            <div className="dot-points-list">
              {Object.entries(dotPoints).map(([key, dotPoint]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedDotPoint(key);
                    setCurrentQuestion(0);
                  }}
                  className={`dot-point-item ${selectedDotPoint === key ? 'active' : ''}`}
                >
                  <div className="dot-point-header">
                    <span className="dot-point-code">{key}</span>
                    <div className="dot-point-indicator">
                      {Object.keys(userAnswers).some(id => id.startsWith(key)) ? '' : ''}
                    </div>
                  </div>
                  <div className="dot-point-content">
                    <h4>{dotPoint.name}</h4>
                    <p>{dotPoint.description}</p>
                    <div className="question-count">
                      {dotPoint.questions.length} questions
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="question-area">
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>

            {currentQ && (
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="question-card"
              >
                <div className="question-header">
                  <div className="question-type-badge">
                    {currentQ.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="question-difficulty">
                    {selectedDotPoint}
                  </div>
                </div>

                {renderQuestion(currentQ)}

                <div className="question-actions">
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="nav-button prev"
                  >
                     Previous
                  </button>
                  
                  {userAnswers[currentQ.id] && currentQ.explanation && (
                    <div className="explanation-section">
                      <h4>Explanation:</h4>
                      <p>{currentQ.explanation}</p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                      } else {
                        setShowResults(true);
                      }
                    }}
                    disabled={!userAnswers[currentQ.id]}
                    className="nav-button next"
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Next '}
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>

        {showResults && (
          <div className="results-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="results-modal"
            >
              <h2> Quiz Complete!</h2>
              <div className="results-content">
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-value">{calculateScore()}%</span>
                  </div>
                  <p>Your score for {dotPoints[selectedDotPoint].name}</p>
                </div>
                
                <div className="results-actions">
                  <button 
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setUserAnswers({});
                    }}
                    className="retry-button"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => {
                      const dotPointKeys = Object.keys(dotPoints);
                      const currentIndex = dotPointKeys.indexOf(selectedDotPoint);
                      if (currentIndex < dotPointKeys.length - 1) {
                        setSelectedDotPoint(dotPointKeys[currentIndex + 1]);
                        setCurrentQuestion(0);
                        setUserAnswers({});
                        setShowResults(false);
                      }
                    }}
                    className="next-topic-button"
                  >
                    Next Topic
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemistryModule5;
