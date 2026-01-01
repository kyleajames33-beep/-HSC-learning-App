import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';

const ChemistryModule6 = ({ onBack }) => {
  const [currentDotPoint, setCurrentDotPoint] = useState(0);
  const [completedDotPoints, setCompletedDotPoints] = useState(new Set());
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userProgress, setUserProgress] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const dotPoints = [
    {
      id: 'CQ6.1',
      title: 'Brnsted-Lowry Theory',
      description: 'Analyze acid-base reactions using Brnsted-Lowry theory and identify conjugate pairs',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'According to Brnsted-Lowry theory, an acid is defined as:',
          options: [
            'A substance that increases H concentration in water',
            'A proton (H) donor',
            'A substance with pH less than 7',
            'An electron pair acceptor'
          ],
          correct: 1,
          explanation: 'In Brnsted-Lowry theory, an acid is specifically defined as a proton (H) donor, regardless of the solvent.'
        },
        {
          id: 'q2',
          type: 'conjugate-pairs',
          question: 'Identify the conjugate acid-base pairs in this reaction:\nNH + HO  NH + OH',
          pairs: [
            { acid: 'HO', base: 'OH', correct: true },
            { acid: 'NH', base: 'NH', correct: true },
            { acid: 'NH', base: 'OH', correct: false },
            { acid: 'HO', base: 'NH', correct: false }
          ],
          explanation: 'NH/NH and HO/OH are the conjugate pairs. NH acts as a base (accepts H), HO acts as an acid (donates H).'
        }
      ]
    },
    {
      id: 'CQ6.2',
      title: 'Conjugate Acid-Base Pairs',
      description: 'Predict the behavior of conjugate acid-base pairs and their relative strengths',
      questions: [
        {
          id: 'q3',
          type: 'strength-comparison',
          question: 'Arrange these acids in order of increasing strength:\nHF, HCl, HBr, HI',
          items: ['HF', 'HCl', 'HBr', 'HI'],
          correctOrder: [0, 1, 2, 3],
          explanation: 'Acid strength increases down Group 17: HF < HCl < HBr < HI due to decreasing bond strength and increasing atomic size.'
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'Which statement about conjugate pairs is correct?',
          options: [
            'A strong acid has a strong conjugate base',
            'A strong acid has a weak conjugate base',
            'Conjugate pairs have equal strengths',
            'Only strong acids have conjugate bases'
          ],
          correct: 1,
          explanation: 'The stronger the acid, the weaker its conjugate base. This is because a strong acid readily donates its proton.'
        }
      ]
    },
    {
      id: 'CQ6.3',
      title: 'Oxidation and Reduction',
      description: 'Identify oxidation and reduction processes in chemical reactions',
      questions: [
        {
          id: 'q5',
          type: 'redox-identification',
          question: 'In the reaction: Zn + Cu  Zn + Cu\nIdentify what happens to each species:',
          species: [
            { formula: 'Zn', process: 'oxidation', correct: true },
            { formula: 'Cu', process: 'reduction', correct: true },
            { formula: 'Zn', process: 'product of oxidation', correct: true },
            { formula: 'Cu', process: 'product of reduction', correct: true }
          ],
          explanation: 'Zn loses electrons (oxidized), Cu gains electrons (reduced). Remember: OIL RIG - Oxidation Involves Loss, Reduction Involves Gain.'
        },
        {
          id: 'q6',
          type: 'multiple-choice',
          question: 'Which process involves an increase in oxidation number?',
          options: [
            'Reduction',
            'Oxidation',
            'Neutralization',
            'Precipitation'
          ],
          correct: 1,
          explanation: 'Oxidation involves loss of electrons, which results in an increase in oxidation number.'
        }
      ]
    },
    {
      id: 'CQ6.4',
      title: 'Oxidation Numbers',
      description: 'Calculate oxidation numbers and use them to balance redox equations',
      questions: [
        {
          id: 'q7',
          type: 'oxidation-number',
          question: 'What is the oxidation number of sulfur in SO?',
          compound: 'SO',
          element: 'S',
          options: ['+4', '+6', '-2', '0'],
          correct: 1,
          explanation: 'In SO: 4 oxygens  (-2) = -8, overall charge = -2, so S = +6 to balance: +6 + (-8) = -2'
        },
        {
          id: 'q8',
          type: 'multiple-choice',
          question: 'In which compound does chlorine have the highest oxidation number?',
          options: [
            'HCl',
            'ClO',
            'NaCl',
            'Cl'
          ],
          correct: 1,
          explanation: 'In ClO, chlorine has oxidation number +7, which is its highest possible oxidation state.'
        }
      ]
    },
    {
      id: 'CQ6.5',
      title: 'Redox Equations',
      description: 'Balance redox equations using half-reaction method',
      questions: [
        {
          id: 'q9',
          type: 'equation-balancing',
          question: 'Balance this redox equation in acidic solution:\nMnO + Fe  Mn + Fe',
          steps: [
            'Separate into half-reactions',
            'Balance atoms other than H and O',
            'Balance O by adding HO',
            'Balance H by adding H',
            'Balance charge by adding e',
            'Equalize electrons and combine'
          ],
          balanced: 'MnO + 5Fe + 8H  Mn + 5Fe + 4HO',
          explanation: 'MnO gains 5e, each Fe loses 1e, so need 5 Fe to balance electrons.'
        },
        {
          id: 'q10',
          type: 'multiple-choice',
          question: 'In the balanced equation above, how many electrons are transferred?',
          options: ['1', '3', '5', '8'],
          correct: 2,
          explanation: '5 electrons are transferred from 5 Fe ions to 1 MnO ion.'
        }
      ]
    }
  ];

  const loadProgress = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('chemistryProgress') || '{}');
      setUserProgress(progress.module6 || {});
      
      const completed = new Set();
      Object.keys(progress.module6 || {}).forEach(dotPointId => {
        if (progress.module6[dotPointId]?.completed) {
          completed.add(dotPointId);
        }
      });
      setCompletedDotPoints(completed);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = (dotPointId, questionId, correct) => {
    try {
      const allProgress = JSON.parse(localStorage.getItem('chemistryProgress') || '{}');
      if (!allProgress.module6) allProgress.module6 = {};
      if (!allProgress.module6[dotPointId]) allProgress.module6[dotPointId] = {};
      
      allProgress.module6[dotPointId][questionId] = {
        completed: true,
        correct,
        timestamp: Date.now()
      };

      const dotPoint = dotPoints.find(dp => dp.id === dotPointId);
      const allQuestionsAnswered = dotPoint.questions.every(q => 
        allProgress.module6[dotPointId][q.id]?.completed
      );

      if (allQuestionsAnswered) {
        allProgress.module6[dotPointId].completed = true;
        setCompletedDotPoints(prev => new Set([...prev, dotPointId]));
      }

      localStorage.setItem('chemistryProgress', JSON.stringify(allProgress));
      setUserProgress(allProgress.module6);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = dotPoints[currentDotPoint].questions[currentQuestionIndex];
    const isCorrect = checkAnswer(currentQuestion, selectedAnswer);
    
    saveProgress(dotPoints[currentDotPoint].id, currentQuestion.id, isCorrect);
    setShowResults(true);
  };

  const checkAnswer = (question, answer) => {
    switch (question.type) {
      case 'multiple-choice':
        return parseInt(answer) === question.correct;
      case 'conjugate-pairs':
        return answer.every((pair, index) => pair === question.pairs[index].correct);
      case 'strength-comparison':
        return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
      case 'redox-identification':
        return answer.every((item, index) => item === question.species[index].correct);
      case 'oxidation-number':
        return parseInt(answer) === question.correct;
      case 'equation-balancing':
        return answer === question.balanced;
      default:
        return false;
    }
  };

  const nextQuestion = () => {
    const currentDotPointObj = dotPoints[currentDotPoint];
    if (currentQuestionIndex < currentDotPointObj.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentDotPoint < dotPoints.length - 1) {
      setCurrentDotPoint(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
    setSelectedAnswer('');
    setShowResults(false);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="question-content">
            <div className="question-text">{question.question}</div>
            <div className="options-grid">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`option-button ${selectedAnswer === index.toString() ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index.toString())}
                  disabled={showResults}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'conjugate-pairs':
        return (
          <div className="question-content">
            <div className="question-text" style={{ whiteSpace: 'pre-line' }}>{question.question}</div>
            <div className="pairs-grid">
              {question.pairs.map((pair, index) => (
                <div key={index} className="pair-option">
                  <input
                    type="checkbox"
                    id={`pair-${index}`}
                    checked={selectedAnswer[index] || false}
                    onChange={(e) => {
                      const newAnswer = [...(selectedAnswer || [])];
                      newAnswer[index] = e.target.checked;
                      setSelectedAnswer(newAnswer);
                    }}
                    disabled={showResults}
                  />
                  <label htmlFor={`pair-${index}`}>
                    {pair.acid} / {pair.base}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'strength-comparison':
        return (
          <div className="question-content">
            <div className="question-text">{question.question}</div>
            <div className="sorting-container">
              <div className="items-to-sort">
                {question.items.map((item, index) => (
                  <div
                    key={index}
                    className="sortable-item"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      const newOrder = [...(selectedAnswer || question.items.map((_, i) => i))];
                      const temp = newOrder[draggedIndex];
                      newOrder[draggedIndex] = newOrder[index];
                      newOrder[index] = temp;
                      setSelectedAnswer(newOrder);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'redox-identification':
        return (
          <div className="question-content">
            <div className="question-text" style={{ whiteSpace: 'pre-line' }}>{question.question}</div>
            <div className="redox-grid">
              {question.species.map((species, index) => (
                <div key={index} className="species-analysis">
                  <div className="species-formula">{species.formula}</div>
                  <select
                    value={selectedAnswer[index] || ''}
                    onChange={(e) => {
                      const newAnswer = [...(selectedAnswer || [])];
                      newAnswer[index] = e.target.value === 'true';
                      setSelectedAnswer(newAnswer);
                    }}
                    disabled={showResults}
                  >
                    <option value="">Select process</option>
                    <option value="true">Correct: {species.process}</option>
                    <option value="false">Incorrect process</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      case 'oxidation-number':
        return (
          <div className="question-content">
            <div className="question-text">{question.question}</div>
            <div className="oxidation-calculation">
              <div className="compound-display">{question.compound}</div>
              <div className="options-grid">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`option-button ${selectedAnswer === index.toString() ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index.toString())}
                    disabled={showResults}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'equation-balancing':
        return (
          <div className="question-content">
            <div className="question-text" style={{ whiteSpace: 'pre-line' }}>{question.question}</div>
            <div className="balancing-steps">
              {question.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </div>
              ))}
            </div>
            <div className="balanced-equation">
              <input
                type="text"
                placeholder="Enter balanced equation"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResults}
                className="equation-input"
              />
            </div>
          </div>
        );

      default:
        return <div>Question type not supported</div>;
    }
  };

  const overallProgress = (completedDotPoints.size / dotPoints.length) * 100;
  const currentQuestion = dotPoints[currentDotPoint].questions[currentQuestionIndex];

  return (
    <div className="chemistry-module">
      <div className="module-container">
        <header className="module-header">
          <button onClick={onBack} className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="header-content">
            <h1> Chemistry Module 6</h1>
            <h2>Acid/Base & Redox Reactions</h2>
            <p>Master acid-base theory, redox processes, and electrochemistry</p>
          </div>
        </header>

        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-label">Module Progress</span>
            <span className="progress-percentage">{Math.round(overallProgress)}%</span>
          </div>
          <ProgressBar progress={overallProgress} color="#f59e0b" height={8} />
        </div>

        <div className="dot-points-nav">
          {dotPoints.map((dotPoint, index) => (
            <div
              key={dotPoint.id}
              className={`dot-point-tab ${
                index === currentDotPoint ? 'active' : ''
              } ${completedDotPoints.has(dotPoint.id) ? 'completed' : ''}`}
              onClick={() => {
                setCurrentDotPoint(index);
                setCurrentQuestionIndex(0);
                setSelectedAnswer('');
                setShowResults(false);
              }}
            >
              <div className="dot-point-id">{dotPoint.id}</div>
              <div className="dot-point-title">{dotPoint.title}</div>
              {completedDotPoints.has(dotPoint.id) && (
                <div className="completed-icon"></div>
              )}
            </div>
          ))}
        </div>

        <div className="content-area">
          <div className="dot-point-info">
            <h3>{dotPoints[currentDotPoint].title}</h3>
            <p>{dotPoints[currentDotPoint].description}</p>
          </div>

          <div className="question-section">
            <div className="question-header">
              <span className="question-number">
                Question {currentQuestionIndex + 1} of {dotPoints[currentDotPoint].questions.length}
              </span>
              <span className="question-type">{currentQuestion.type.replace('-', ' ').toUpperCase()}</span>
            </div>

            {renderQuestion(currentQuestion)}

            <div className="question-actions">
              {!showResults ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="submit-button"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer && selectedAnswer !== 0}
                >
                  Submit Answer
                </motion.button>
              ) : (
                <div className="results-section">
                  <div className={`result-indicator ${checkAnswer(currentQuestion, selectedAnswer) ? 'correct' : 'incorrect'}`}>
                    {checkAnswer(currentQuestion, selectedAnswer) ? ' Correct!' : ' Incorrect'}
                  </div>
                  <div className="explanation">
                    <strong>Explanation:</strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="next-button"
                    onClick={nextQuestion}
                  >
                    {currentQuestionIndex < dotPoints[currentDotPoint].questions.length - 1
                      ? 'Next Question'
                      : currentDotPoint < dotPoints.length - 1
                      ? 'Next Dot Point'
                      : 'Complete Module'}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryModule6;
