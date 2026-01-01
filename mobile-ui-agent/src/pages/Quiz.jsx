import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../utils/quizAPI';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import OfflineNotice from '../components/feedback/OfflineNotice';
import LoadingState from '../components/feedback/LoadingState';
import ErrorState from '../components/feedback/ErrorState';
import EmptyState from '../components/feedback/EmptyState';
import { useProgressTracking } from '../hooks/useProgressTracking';

const Quiz = ({ quizConfig, onQuizComplete, onExit }) => {
  const { completeQuiz } = useProgressTracking();
  const { isOnline } = useOnlineStatus();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quizConfig.timer ? 120 : null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStartTime] = useState(Date.now());
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (quizConfig.topic?.id) {
        // Pathway-based quiz: get questions for specific topic
        response = await quizAPI.getTopicQuestions(
          quizConfig.subject.id,
          quizConfig.topic.id,
          quizConfig.length
        );
      } else if (quizConfig.module?.id) {
        // Legacy module-based quiz
        const api = quizAPI[quizConfig.subject.id];
        response = await api.getQuestions(
          quizConfig.module.id,
          quizConfig.difficulty.id,
          quizConfig.length
        );
      } else {
        throw new Error('Invalid quiz configuration');
      }

      if (response.success && response.questions) {
        // Shuffle the answer options for each multiple choice question
        const questionsWithShuffledOptions = response.questions.map(question => {
          if (question.options && Array.isArray(question.options)) {
            // Create mapping of original indices to shuffled indices
            const originalOptions = [...question.options];
            const shuffledOptions = shuffleArray(originalOptions);
            
            // Find new index of correct answer
            const originalCorrectAnswer = question.correctAnswer;
            const correctAnswerText = originalOptions[originalCorrectAnswer];
            const newCorrectIndex = shuffledOptions.findIndex(option => option === correctAnswerText);
            
            return {
              ...question,
              options: shuffledOptions,
              correctAnswer: newCorrectIndex
            };
          }
          return question;
        });
        
        setQuestions(questionsWithShuffledOptions);
      } else {
        throw new Error(response.error || 'Failed to load questions');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Timer logic
  useEffect(() => {
    if (!quizConfig.timer || timeRemaining === null || isAnswerLocked) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswerLocked, quizConfig.timer]);

  const handleTimeUp = useCallback(() => {
    if (!isAnswerLocked) {
      setIsAnswerLocked(true);
      setShowExplanation(true);
    }
  }, [isAnswerLocked]);

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswerLocked) return;

    setSelectedAnswer(answerIndex);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selected: answerIndex,
        correct: answerIndex === currentQuestion.correctAnswer,
        timeSpent: quizConfig.timer ? (120 - timeRemaining) : null
      }
    }));
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    setIsAnswerLocked(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerLocked(false);
      setShowExplanation(false);
      setTimeRemaining(quizConfig.timer ? 120 : null);
    } else {
      // Quiz complete - calculate results and update progress
      const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
      
      // Update progress tracking for pathway system
      if (quizConfig.topic?.id) {
        completeQuiz(quizConfig.subject.id, quizConfig.topic.id, score, totalQuestions);
      }
      
      onQuizComplete({
        answers,
        totalQuestions,
        correctAnswers,
        score,
        timeSpent,
        config: quizConfig
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <LoadingState
        title="Generating your quiz"
        message="Hang tight while we load your questions."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="We couldn't load the quiz"
        message={error || 'Please try again or choose a different topic.'}
        actionLabel="Try again"
        onRetry={loadQuestions}
        details={error}
      />
    );
  }

  if (!questions.length) {
    return (
      <EmptyState
        title="No questions available"
        message="We couldn't find questions for this quiz yet. Pick another topic or adjust your settings."
        actionLabel={onExit ? 'Back to setup' : undefined}
        onAction={onExit}
        showBackground
      />
    );
  }
  const getAnswerButtonStyle = (answerIndex) => {
    const isSelected = selectedAnswer === answerIndex;
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const isWrong = isSelected && !isCorrect && isAnswerLocked;

    if (!isAnswerLocked) {
      return isSelected
        ? 'border-blue-500 bg-blue-50 text-blue-700 cursor-pointer'
        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25 cursor-pointer';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-50 text-green-700';
    }

    if (isWrong) {
      return 'border-red-500 bg-red-50 text-red-700';
    }

    return 'border-gray-200 bg-gray-50 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50 sticky top-0 z-10">
        <div className="px-4 py-3">
          {/* Top row: Back button and timer */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onExit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {quizConfig.timer && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeRemaining <= 30
                  ? 'bg-red-100 text-red-700'
                  : timeRemaining <= 60
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                 {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Question Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="flex items-start space-x-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswerLocked}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${getAnswerButtonStyle(index)}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      selectedAnswer === index
                        ? 'border-current bg-current text-white'
                        : 'border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 font-medium">{option}</span>

                    {/* Correct/Wrong indicators */}
                    {isAnswerLocked && (
                      <div>
                        {index === currentQuestion.correctAnswer && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Explanation</h3>
                      <p className="text-blue-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Buttons */}
      <div className="px-4 pb-6 max-w-md mx-auto w-full sticky bottom-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
          {!isAnswerLocked ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          ) : (
            <div className="space-y-3">
              {/* Score display */}
              <div className="text-center">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <div className="text-green-600 font-semibold">
                     Correct! +10 XP
                  </div>
                ) : (
                  <div className="text-red-600 font-semibold">
                     Incorrect. Keep trying!
                  </div>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all"
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;





