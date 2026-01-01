import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionService from '../services/questionService';

const ChemistryModule5QuickQuiz = ({ 
  dotPointId, 
  onQuizComplete, 
  onExit,
  pathwayData 
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  // Load questions based on dot point
  useEffect(() => {
    loadQuestions();
  }, [dotPointId]);

  const loadQuestions = async () => {
    setLoading(true);
    
    try {
      // Fetch questions from chemistry agent via question service
      const fetchedQuestions = await questionService.fetchQuestions(
        'chemistry', 
        'module-5', 
        dotPointId, 
        'quick'
      );
      
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        // Shuffle questions and take up to 8 for the quiz
        const shuffledQuestions = [...fetchedQuestions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(8, shuffledQuestions.length));
        
        setQuestions(selectedQuestions);
        
        // Set timer based on number of questions (1.5 minutes per question)
        const timeLimit = selectedQuestions.length * 90; // 90 seconds per question
        setTimeRemaining(timeLimit);
        
        console.log(`🧪 Loaded ${selectedQuestions.length} chemistry questions for ${dotPointId} from agent`);
      } else {
        console.warn(`No chemistry questions available for ${dotPointId}`);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error loading chemistry questions:', error);
      setQuestions([]);
    }
    
    setLoading(false);
  };

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, showResults]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const totalQuestions = questions.length;
    let correctAnswers = 0;

    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);

    console.log(`🧪 Chemistry Quiz Results: ${correctAnswers}/${totalQuestions} (${score}%)`);

    setShowResults(true);
    
    // Call completion handler after a short delay
    setTimeout(() => {
      onQuizComplete({
        dotPointId,
        quizType: 'quickQuiz',
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
        answers: selectedAnswers
      });
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading Chemistry Quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h2 className="text-2xl font-bold mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-4">No questions available for {dotPointId}</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Pathway
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalQuestions = questions.length;
    const correctAnswers = questions.reduce((count, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? count + 1 : count;
    }, 0);
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 65;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 text-center"
        >
          <div className={`text-6xl mb-4 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
            {passed ? 'Quiz Passed!' : 'Keep Studying!'}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored {correctAnswers} out of {totalQuestions} questions correctly
          </p>
          
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {score}%
            </div>
            <div className="text-sm text-gray-500">
              {passed ? 'Excellent work!' : 'You need 65% to pass'}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Returning to pathway...
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onExit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chemistry Quick Quiz</h1>
              <p className="text-sm text-gray-600">{dotPointId} • Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRemaining > 60 ? 'bg-green-100 text-green-700' :
              timeRemaining > 30 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              ⏰ {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswers[currentQuestion.id] === option
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestionIndex ? 'bg-purple-500' :
                  selectedAnswers[questions[index].id] ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChemistryModule5QuickQuiz;