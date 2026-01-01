import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';

const MiniGameInterface = ({
  gameType, // 'speed-quiz', 'memory-match', 'drag-drop'
  gameData,
  onGameComplete,
  onGameExit,
  timeLimit = 60
}) => {
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, gameState]);

  const handleGameEnd = () => {
    setGameState('finished');
    onGameComplete({
      score,
      streak,
      timeUsed: timeLimit - timeLeft,
      gameType
    });
  };

  const getGameIcon = () => {
    const icons = {
      'speed-quiz': '',
      'memory-match': '',
      'drag-drop': ''
    };
    return icons[gameType] || '';
  };

  const getGameTitle = () => {
    const titles = {
      'speed-quiz': 'Speed Quiz Challenge',
      'memory-match': 'Memory Match',
      'drag-drop': 'Concept Sorting'
    };
    return titles[gameType] || 'Mini Game';
  };

  const handleSpeedQuizAnswer = (answerIndex) => {
    const question = gameData.questions[currentQuestion];
    const isCorrect = question.answers[answerIndex].correct;

    if (isCorrect) {
      setScore(score + 10 + (streak * 2));
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    if (currentQuestion < gameData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleGameEnd();
    }
  };

  const handleMemoryCardClick = (cardIndex) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedPairs.includes(cardIndex)) {
      return;
    }

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = gameData.cards[first];
      const secondCard = gameData.cards[second];

      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          setMatchedPairs([...matchedPairs, first, second]);
          setScore(score + 20);
          setStreak(streak + 1);

          if (matchedPairs.length + 2 === gameData.cards.length) {
            handleGameEnd();
          }
        } else {
          setStreak(0);
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  const renderSpeedQuiz = () => {
    const question = gameData.questions[currentQuestion];

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestion + 1} of {gameData.questions.length}</span>
            <span>Streak: {streak} </span>
          </div>
          <ProgressBar
            progress={((currentQuestion + 1) / gameData.questions.length) * 100}
            color="#3b82f6"
            height={8}
          />
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="gaming-card p-6"
        >
          <h3 className="text-lg font-bold mb-4">{question.text}</h3>

          <div className="space-y-3">
            {question.answers.map((answer, index) => (
              <motion.button
                key={index}
                onClick={() => handleSpeedQuizAnswer(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 text-left rounded-xl bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-800">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{answer.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderMemoryMatch = () => {
    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Matched: {matchedPairs.length / 2} of {gameData.cards.length / 2}</span>
            <span>Streak: {streak} </span>
          </div>
          <ProgressBar
            progress={(matchedPairs.length / gameData.cards.length) * 100}
            color="#10b981"
            height={8}
          />
        </div>

        {/* Memory Cards Grid */}
        <div className="grid grid-cols-4 gap-3">
          {gameData.cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedPairs.includes(index);

            return (
              <motion.button
                key={index}
                onClick={() => handleMemoryCardClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all ${
                  matchedPairs.includes(index)
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : isFlipped
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                animate={{
                  rotateY: isFlipped ? 0 : 180,
                }}
                transition={{ duration: 0.3 }}
              >
                {isFlipped ? card.content : '?'}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDragDrop = () => {
    return (
      <div className="space-y-6">
        {/* Categories */}
        <div className="grid grid-cols-2 gap-4">
          {gameData.categories.map((category, index) => (
            <div key={index} className="gaming-card p-4 min-h-32">
              <h4 className="font-bold text-center mb-3 text-sm">{category.name}</h4>
              <div className="space-y-2">
                {selectedAnswers
                  .filter(answer => answer.categoryId === category.id)
                  .map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className="p-2 bg-blue-100 rounded-lg text-sm text-center"
                    >
                      {answer.text}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Available Items */}
        <div className="gaming-card p-4">
          <h4 className="font-bold mb-3">Drag items to correct categories:</h4>
          <div className="grid grid-cols-2 gap-2">
            {gameData.items
              .filter(item => !selectedAnswers.find(a => a.id === item.id))
              .map((item, index) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Simple click-to-assign for mobile
                    const categoryId = prompt('Select category (1 or 2):');
                    if (categoryId && (categoryId === '1' || categoryId === '2')) {
                      setSelectedAnswers([...selectedAnswers, {
                        ...item,
                        categoryId: parseInt(categoryId)
                      }]);
                    }
                  }}
                  className="p-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium hover:border-blue-300 transition-all"
                >
                  {item.text}
                </motion.button>
              ))}
          </div>
        </div>

        {/* Check Answers Button */}
        {selectedAnswers.length === gameData.items.length && (
          <button
            onClick={handleGameEnd}
            className="w-full gaming-button-success py-3"
          >
            Check Answers
          </button>
        )}
      </div>
    );
  };

  const renderGameContent = () => {
    switch (gameType) {
      case 'speed-quiz':
        return renderSpeedQuiz();
      case 'memory-match':
        return renderMemoryMatch();
      case 'drag-drop':
        return renderDragDrop();
      default:
        return <div>Game type not supported</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getGameIcon()}</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{getGameTitle()}</h1>
              <p className="text-sm text-gray-600">Score: {score}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className={`px-3 py-2 rounded-lg font-bold ${
              timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
               {timeLeft}s
            </div>

            {/* Exit Button */}
            <button
              onClick={onGameExit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="p-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'playing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderGameContent()}
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Complete!</h2>

              <div className="gaming-card p-6 mx-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Final Score:</span>
                    <span className="font-bold text-blue-600">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Best Streak:</span>
                    <span className="font-bold text-orange-600">{streak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time Used:</span>
                    <span className="font-bold text-green-600">{timeLimit - timeLeft}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">XP Earned:</span>
                    <span className="font-bold text-purple-600">+{Math.floor(score / 2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full gaming-button-primary py-3"
                >
                  Play Again
                </button>
                <button
                  onClick={onGameExit}
                  className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MiniGameInterface;
