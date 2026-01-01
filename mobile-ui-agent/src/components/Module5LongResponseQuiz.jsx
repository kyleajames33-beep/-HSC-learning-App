import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Module5LongResponseQuiz = ({ 
  dotPointId, 
  onQuizComplete, 
  onExit,
  pathwayData 
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [draggedSentence, setDraggedSentence] = useState(null);
  const [dropZones, setDropZones] = useState({});

  // Load questions based on dot point
  useEffect(() => {
    loadQuestions();
  }, [dotPointId]);

  const loadQuestions = async () => {
    setLoading(true);
    
    const dotPoint = findDotPointData(dotPointId);
    if (!dotPoint) {
      console.error('Dot point not found:', dotPointId);
      setLoading(false);
      return;
    }

    const questionCount = dotPoint.quizzes.longResponse.questionCount;
    const timeLimit = dotPoint.quizzes.longResponse.timeLimit;

    // Generate HSC-style long response questions
    const generatedQuestions = generateLongResponseQuestions(dotPointId, questionCount);
    
    setQuestions(generatedQuestions);
    setTimeRemaining(timeLimit * 60); // Convert to seconds
    
    // Initialize drop zones for all questions
    const initialDropZones = {};
    generatedQuestions.forEach(q => {
      initialDropZones[q.id] = Array(q.expectedSentences).fill(null);
    });
    setDropZones(initialDropZones);
    
    setLoading(false);
  };

  const findDotPointData = (dotPointId) => {
    for (const iq of Object.values(pathwayData.inquiryQuestions)) {
      for (const dotPoint of Object.values(iq.dotPoints)) {
        if (dotPoint.id === dotPointId) {
          return dotPoint;
        }
      }
    }
    return null;
  };

  // Generate HSC-style long response questions with sentence pools
  const generateLongResponseQuestions = (dotPointId, count) => {
    const questionBank = getLongResponseQuestionBank(dotPointId);
    return questionBank.slice(0, count);
  };

  // HSC-style long response question bank with drag-drop sentence construction
  const getLongResponseQuestionBank = (dotPointId) => {
    const banks = {
      'IQ1.1': [
        {
          id: 'IQ1.1-lr1',
          question: 'Explain how reproductive strategies ensure the continuity of species, using specific examples.',
          marks: 6,
          expectedSentences: 4,
          sentencePool: [
            // CORRECT sentences (ensure answer is achievable)
            'Sexual reproduction increases genetic diversity through genetic recombination, which helps populations adapt to environmental changes.',
            'Asexual reproduction allows rapid population growth in stable environments, maximizing reproductive output.',
            'Many organisms use both strategies depending on environmental conditions, such as aphids reproducing asexually in summer and sexually in autumn.',
            'High reproductive rates compensate for high mortality in offspring, ensuring some individuals survive to reproduce.',
            
            // PARTIALLY CORRECT sentences
            'Sexual reproduction produces more offspring than asexual reproduction in most cases.',
            'Genetic diversity is important for species survival but not directly related to reproductive strategies.',
            'Environmental factors influence reproduction but don\'t affect species continuity.',
            
            // INCORRECT sentences
            'Asexual reproduction always produces stronger offspring than sexual reproduction.',
            'Species continuity depends mainly on individual survival rather than reproductive success.',
            'All organisms must reproduce sexually to ensure genetic diversity.',
            
            // MISLEADING sentences
            'Reproductive strategies have no significant impact on species survival rates.',
            'Only large organisms need effective reproductive strategies for species continuity.',
            
            // CONFUSING sentences
            'The relationship between reproductive strategies and species continuity is primarily theoretical.',
            'Most reproductive strategies are equally effective in all environments.'
          ],
          rubric: {
            6: 'Explains both sexual and asexual strategies with specific examples and clear links to species continuity',
            4: 'Explains one strategy well or both strategies with minor gaps',
            2: 'Basic explanation with limited examples or connections',
            0: 'Incorrect or irrelevant response'
          },
          keyConceptsRequired: ['genetic diversity', 'environmental adaptation', 'reproductive efficiency', 'examples']
        },
        {
          id: 'IQ1.1-lr2',
          question: 'Analyse the advantages and disadvantages of asexual reproduction in ensuring species survival.',
          marks: 5,
          expectedSentences: 3,
          sentencePool: [
            // CORRECT sentences
            'Asexual reproduction enables rapid population expansion when environmental conditions are favorable.',
            'The lack of genetic diversity in asexual reproduction makes populations vulnerable to environmental changes.',
            'Energy efficiency in asexual reproduction allows organisms to invest more resources in offspring production rather than mate finding.',
            
            // PARTIALLY CORRECT
            'Asexual reproduction is faster than sexual reproduction in most organisms.',
            'Genetic uniformity can be both beneficial and harmful depending on circumstances.',
            
            // INCORRECT
            'Asexual reproduction always ensures better species survival than sexual reproduction.',
            'Environmental changes have minimal impact on asexually reproducing populations.',
            
            // MISLEADING
            'All organisms that reproduce asexually are less evolved than those that reproduce sexually.',
            'Asexual reproduction requires no energy investment compared to sexual reproduction.'
          ],
          rubric: {
            5: 'Comprehensive analysis of both advantages and disadvantages with clear reasoning',
            3: 'Good analysis of advantages OR disadvantages with some reasoning',
            1: 'Basic understanding with limited analysis',
            0: 'Incorrect or no relevant content'
          }
        }
      ],
      'IQ2.1': [
        {
          id: 'IQ2.1-lr1',
          question: 'Describe how cell cycle checkpoints control cell division and explain their importance in development.',
          marks: 7,
          expectedSentences: 5,
          sentencePool: [
            // CORRECT sentences
            'The G1/S checkpoint ensures DNA is undamaged before replication begins during S phase.',
            'The G2/M checkpoint verifies DNA replication is complete before mitosis can proceed.',
            'The spindle checkpoint prevents chromosome separation until all chromosomes are properly attached to spindle fibers.',
            'These checkpoints prevent the division of cells with damaged DNA, which could lead to cancer.',
            'Proper checkpoint function is essential for controlled cell division during development and growth.',
            
            // PARTIALLY CORRECT
            'Cell cycle checkpoints slow down cell division in most cases.',
            'DNA damage can sometimes be repaired during the cell cycle.',
            
            // INCORRECT
            'Checkpoints accelerate cell division to promote rapid growth.',
            'All cells must pass through checkpoints at the same speed.',
            
            // MISLEADING
            'Cell cycle checkpoints are optional for most cell types.',
            'Cancer cells have better checkpoint control than normal cells.'
          ]
        }
      ],
      'IQ3.1': [
        {
          id: 'IQ3.1-lr1',
          question: 'Explain the process of gene expression from DNA to protein, including the role of regulatory mechanisms.',
          marks: 8,
          expectedSentences: 6,
          sentencePool: [
            // CORRECT sentences
            'Gene expression begins with transcription, where RNA polymerase reads the DNA template strand to produce mRNA.',
            'The mRNA undergoes processing including 5\' capping, 3\' polyadenylation, and splicing to remove introns.',
            'Translation occurs at ribosomes where mRNA codons are matched with tRNA anticodons to assemble amino acids into proteins.',
            'Transcription factors regulate gene expression by binding to promoter regions and enhancing or inhibiting RNA polymerase activity.',
            'Post-translational modifications such as phosphorylation can alter protein function and activity.',
            'Environmental signals can trigger changes in gene expression through various regulatory pathways.',
            
            // PARTIALLY CORRECT
            'DNA directly produces proteins through a simple copying process.',
            'Gene regulation occurs only during transcription.',
            
            // INCORRECT
            'All genes are expressed equally in all cell types.',
            'Proteins are made directly from DNA without intermediate steps.',
            
            // CONFUSING
            'Gene expression is the same in all organisms regardless of complexity.',
            'Regulatory mechanisms prevent gene expression rather than control it.'
          ]
        }
      ]
      // Add more question banks for other dot points...
    };

    return banks[dotPointId] || [];
  };

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const handleTimeUp = () => {
    if (!showResults) {
      finishQuiz();
    }
  };

  // Drag and drop handlers
  const handleDragStart = (sentence, index) => {
    setDraggedSentence({ sentence, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, questionId, dropIndex) => {
    e.preventDefault();
    
    if (!draggedSentence) return;

    const newDropZones = { ...dropZones };
    
    // Remove sentence from previous position if it was already placed
    Object.keys(newDropZones).forEach(qId => {
      newDropZones[qId] = newDropZones[qId].map(item => 
        item === draggedSentence.sentence ? null : item
      );
    });

    // Place sentence in new position
    newDropZones[questionId][dropIndex] = draggedSentence.sentence;
    
    setDropZones(newDropZones);
    setDraggedSentence(null);
  };

  const removeSentenceFromDropZone = (questionId, dropIndex) => {
    const newDropZones = { ...dropZones };
    newDropZones[questionId][dropIndex] = null;
    setDropZones(newDropZones);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
    const results = calculateResults();
    
    setShowResults(true);
    
    // Call completion callback after showing results
    setTimeout(() => {
      onQuizComplete({
        dotPointId,
        quizType: 'longResponse',
        score: results.percentage,
        totalQuestions: questions.length,
        totalMarks: results.totalMarks,
        achievedMarks: results.achievedMarks,
        timeSpent,
        passed: results.percentage >= 65
      });
    }, 3000);
  };

  const calculateResults = () => {
    let totalMarks = 0;
    let achievedMarks = 0;

    questions.forEach(question => {
      totalMarks += question.marks;
      const questionDropZone = dropZones[question.id];
      
      if (!questionDropZone) return;

      // Score based on correct sentence selection and key concept coverage
      let questionScore = 0;
      const maxScore = question.marks;
      
      // Check for key concepts in selected sentences
      const selectedSentences = questionDropZone.filter(s => s !== null);
      const keyConceptsCovered = question.keyConceptsRequired?.filter(concept => 
        selectedSentences.some(sentence => 
          sentence.toLowerCase().includes(concept.toLowerCase())
        )
      ) || [];
      
      // Score calculation based on:
      // 1. Key concepts covered (70% of marks)
      // 2. Sentence quality and relevance (30% of marks)
      const conceptScore = (keyConceptsCovered.length / (question.keyConceptsRequired?.length || 1)) * maxScore * 0.7;
      
      // Bonus for selecting high-quality sentences (first 4-6 in pool are typically correct)
      const qualitySentences = selectedSentences.filter(sentence => {
        const sentenceIndex = question.sentencePool.indexOf(sentence);
        return sentenceIndex < question.expectedSentences + 2; // Allow some flexibility
      });
      const qualityScore = (qualitySentences.length / selectedSentences.length || 0) * maxScore * 0.3;
      
      questionScore = Math.min(maxScore, conceptScore + qualityScore);
      achievedMarks += questionScore;
    });

    return {
      totalMarks,
      achievedMarks: Math.round(achievedMarks),
      percentage: Math.round((achievedMarks / totalMarks) * 100)
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isQuestionComplete = (questionId) => {
    const questionDropZone = dropZones[questionId];
    return questionDropZone && questionDropZone.filter(s => s !== null).length >= 3;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading Long Response Quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const passed = results.percentage >= 65;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <span className="text-3xl">
              {passed ? '' : ''}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
            {passed ? 'Excellent Response!' : 'Good Effort!'}
          </h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-lg">
              Score: <span className="font-bold">{results.percentage}%</span>
            </p>
            <p className="text-gray-600">
              {results.achievedMarks} out of {results.totalMarks} marks
            </p>
            <p className="text-sm text-gray-500">
              {passed ? 'Minimum 65% required - PASSED ' : 'Minimum 65% required - You can retry immediately!'}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>HSC Tip:</strong> Focus on using key scientific terms and connecting concepts in your responses.
            </p>
          </div>

          <p className="text-center text-gray-600">
            Returning to pathway...
          </p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onExit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h1 className="font-bold text-lg">Long Response</h1>
              <p className="text-sm text-gray-600">HSC-Style Questions</p>
            </div>

            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRemaining <= 300 ? 'bg-red-100 text-red-700' :
              timeRemaining <= 600 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
               {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-4 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Question Panel */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-2">
                      {currentQuestion.question}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {currentQuestion.marks} marks
                      </span>
                      <span>
                        Select {currentQuestion.expectedSentences}+ sentences
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentence Pool */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <h3 className="font-semibold text-gray-900 mb-4">
                   Sentence Pool (Drag to construct your answer)
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentQuestion.sentencePool.map((sentence, index) => {
                    const isUsed = Object.values(dropZones).some(zones => 
                      zones && zones.includes(sentence)
                    );
                    
                    return (
                      <div
                        key={index}
                        draggable={!isUsed}
                        onDragStart={() => handleDragStart(sentence, index)}
                        className={`p-3 rounded-lg border-2 cursor-move transition-all text-sm ${
                          isUsed 
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                        }`}
                      >
                        {sentence}
                        {isUsed && <span className="text-xs text-gray-500 ml-2">(Used)</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Response Construction Panel */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                   Your Response
                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                    isQuestionComplete(currentQuestion.id) 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {dropZones[currentQuestion.id]?.filter(s => s !== null).length || 0} sentences
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {Array(currentQuestion.expectedSentences).fill(null).map((_, dropIndex) => (
                    <div
                      key={dropIndex}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, currentQuestion.id, dropIndex)}
                      className="min-h-16 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all"
                    >
                      {dropZones[currentQuestion.id]?.[dropIndex] ? (
                        <div className="flex items-start space-x-2">
                          <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                            {dropIndex + 1}
                          </span>
                          <p className="flex-1 text-sm text-gray-900">
                            {dropZones[currentQuestion.id][dropIndex]}
                          </p>
                          <button
                            onClick={() => removeSentenceFromDropZone(currentQuestion.id, dropIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 text-sm">
                          Drop sentence {dropIndex + 1} here
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2"> HSC Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li> Use scientific terminology accurately</li>
                  <li> Connect concepts with clear explanations</li>
                  <li> Include specific examples where relevant</li>
                  <li> Ensure logical flow between sentences</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 max-w-6xl mx-auto w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isQuestionComplete(currentQuestion.id) ? (
                <span className="text-green-600 font-medium"> Minimum sentences selected</span>
              ) : (
                <span className="text-yellow-600">Select at least {currentQuestion.expectedSentences} sentences</span>
              )}
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={!isQuestionComplete(currentQuestion.id)}
              className={`py-3 px-6 rounded-lg font-bold transition-all ${
                isQuestionComplete(currentQuestion.id)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module5LongResponseQuiz;
