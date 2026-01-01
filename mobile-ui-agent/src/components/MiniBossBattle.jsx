import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';

const MiniBossBattle = ({
  miniBoss, // Mini boss configuration from miniBossConfig.json
  questions, // Array of 10 hard questions for this IQ
  onBattleComplete, // Callback with results
  onEscape
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentHealth, setStudentHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(100);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isBossTurn, setIsBossTurn] = useState(false);
  const [gameState, setGameState] = useState('battle'); // 'battle', 'victory', 'defeat'
  const [comboCount, setComboCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(miniBoss.timeLimit);
  const [battleLog, setBattleLog] = useState([]);
  const [showDamageText, setShowDamageText] = useState(null);
  const [studentAnimation, setStudentAnimation] = useState('idle');
  const [bossAnimation, setBossAnimation] = useState('idle');
  const [results, setResults] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalQuestions: questions.length,
    timeSpent: 0
  });

  const currentQuestion = questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'battle' || isBossTurn) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - student loses
          handleDefeat('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isBossTurn]);

  // Check win/loss conditions
  useEffect(() => {
    if (studentHealth <= 0) {
      handleDefeat('health');
    } else if (bossHealth <= 0) {
      handleVictory();
    } else if (currentQuestionIndex >= questions.length && gameState === 'battle') {
      // All questions answered - determine winner by health
      if (studentHealth > bossHealth) {
        handleVictory();
      } else {
        handleDefeat('score');
      }
    }
  }, [studentHealth, bossHealth, currentQuestionIndex]);

  const handleVictory = () => {
    setGameState('victory');
    setStudentAnimation('victory');
    setBossAnimation('defeated');

    const finalResults = {
      ...results,
      timeSpent: miniBoss.timeLimit - timeLeft,
      victory: true,
      finalHealth: studentHealth,
      comboMax: comboCount,
      xpEarned: miniBoss.rewards.xp + (comboCount * 10),
      badgeEarned: miniBoss.rewards.badge
    };

    setResults(finalResults);
  };

  const handleDefeat = (reason) => {
    setGameState('defeat');
    setStudentAnimation('defeated');
    setBossAnimation('victory');

    const finalResults = {
      ...results,
      timeSpent: miniBoss.timeLimit - timeLeft,
      victory: false,
      defeatReason: reason,
      finalHealth: studentHealth
    };

    setResults(finalResults);
  };

  const handleAnswerSelect = async (answerIndex) => {
    if (isAnswering || isBossTurn || gameState !== 'battle') return;

    setSelectedAnswer(answerIndex);
    setIsAnswering(true);
    setStudentAnimation('attack');

    const isCorrect = currentQuestion.options[answerIndex]?.text === currentQuestion.correctAnswer;

    // Wait for attack animation
    setTimeout(() => {
      if (isCorrect) {
        // Student correct - damage boss
        const damage = miniBoss.healthPerQuestion + (comboCount >= 2 ? 2 : 0);
        setBossHealth((prev) => Math.max(0, prev - damage));
        setBossAnimation('hurt');
        setShowDamageText({ type: 'damage', value: damage, target: 'boss' });
        setComboCount((prev) => prev + 1);

        setResults((prev) => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1
        }));

        addToBattleLog(`You answered correctly! Boss takes ${damage} damage!`, 'success');
      } else {
        // Student incorrect - take damage
        const damage = miniBoss.healthPerQuestion;
        setStudentHealth((prev) => Math.max(0, prev - damage));
        setStudentAnimation('hurt');
        setShowDamageText({ type: 'damage', value: damage, target: 'student' });
        setComboCount(0);

        setResults((prev) => ({
          ...prev,
          incorrectAnswers: prev.incorrectAnswers + 1
        }));

        addToBattleLog(`Wrong answer! You take ${damage} damage!`, 'error');
      }

      setTimeout(() => {
        setShowDamageText(null);
        setStudentAnimation('idle');
        setBossAnimation('idle');
        setSelectedAnswer(null);
        setIsAnswering(false);

        // Move to next question or boss turn
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          // Boss turn next
          setTimeout(() => bossTurn(), 1000);
        } else {
          // Battle over - check results
          setGameState('calculating');
        }
      }, 1000);
    }, 800);
  };

  const bossTurn = () => {
    setIsBossTurn(true);
    setBossAnimation('thinking');
    addToBattleLog(`${miniBoss.name} is answering...`, 'info');

    // Simulate boss "thinking" time
    setTimeout(() => {
      const bossCorrect = Math.random() < miniBoss.bossAccuracy;
      setBossAnimation('attack');

      setTimeout(() => {
        if (bossCorrect) {
          // Boss correct - damage student
          const damage = miniBoss.healthPerQuestion;
          setStudentHealth((prev) => Math.max(0, prev - damage));
          setStudentAnimation('hurt');
          setShowDamageText({ type: 'damage', value: damage, target: 'student' });
          addToBattleLog(`${miniBoss.name} answered correctly! You take ${damage} damage!`, 'warning');
        } else {
          // Boss incorrect - take damage
          const damage = miniBoss.healthPerQuestion;
          setBossHealth((prev) => Math.max(0, prev - damage));
          setBossAnimation('hurt');
          setShowDamageText({ type: 'damage', value: damage, target: 'boss' });
          addToBattleLog(`${miniBoss.name} got it wrong! Boss takes ${damage} damage!`, 'success');
        }

        setTimeout(() => {
          setShowDamageText(null);
          setStudentAnimation('idle');
          setBossAnimation('idle');
          setIsBossTurn(false);
        }, 1000);
      }, 1000);
    }, 2000 + Math.random() * 2000); // 2-4 seconds "thinking"
  };

  const addToBattleLog = (message, type) => {
    setBattleLog((prev) => [
      ...prev.slice(-4), // Keep last 4 messages
      { message, type, timestamp: Date.now() }
    ]);
  };

  const getHealthColor = (percentage) => {
    if (percentage > 60) return '#10b981'; // Green
    if (percentage > 30) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getComboText = () => {
    if (comboCount >= 5) return 'LEGENDARY!';
    if (comboCount >= 3) return 'COMBO!';
    if (comboCount >= 2) return 'STREAK!';
    return '';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header UI */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onEscape}
            className="p-2 bg-black/30 backdrop-blur-sm rounded-lg hover:bg-black/50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Timer */}
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-bold text-lg ${timeLeft <= 60 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Question Counter & Combo */}
          <div className="flex items-center space-x-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-xs text-gray-300">Question</div>
              <div className="font-bold">{currentQuestionIndex + 1}/{questions.length}</div>
            </div>
            {comboCount > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-yellow-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-500"
              >
                <div className="text-xs text-yellow-300">Combo</div>
                <div className="font-bold text-yellow-400">{comboCount}x</div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mini Boss Info */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{miniBoss.sprite}</span>
              <div>
                <h2 className="font-bold text-lg">{miniBoss.name}</h2>
                <p className="text-xs text-gray-300">{miniBoss.description}</p>
              </div>
            </div>
            {isBossTurn && (
              <div className="bg-purple-500/30 px-3 py-1 rounded-lg text-sm font-medium animate-pulse">
                Boss Turn...
              </div>
            )}
          </div>
        </div>

        {/* Health Bars */}
        <div className="space-y-3 mb-4">
          {/* Boss Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-red-300">{miniBoss.name}</span>
              <span className="text-sm font-medium">{bossHealth}%</span>
            </div>
            <ProgressBar
              progress={bossHealth}
              height={14}
              color={getHealthColor(bossHealth)}
              backgroundColor="rgba(0,0,0,0.3)"
              className="border-2 border-red-400/50"
            />
          </div>

          {/* Student Health */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-300">You</span>
              <span className="text-sm font-medium">{studentHealth}%</span>
            </div>
            <ProgressBar
              progress={studentHealth}
              height={14}
              color={getHealthColor(studentHealth)}
              backgroundColor="rgba(0,0,0,0.3)"
              className="border-2 border-blue-400/50"
            />
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative z-10 px-4 pb-8">
        {/* Damage Text Overlay */}
        <AnimatePresence>
          {showDamageText && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -50, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.5 }}
              className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 text-5xl font-bold z-50 ${
                showDamageText.type === 'damage' ? 'text-red-400' : 'text-green-400'
              }`}
            >
              -{showDamageText.value}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Combo Text */}
        <AnimatePresence>
          {comboCount > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-yellow-400 z-50"
            >
              {getComboText()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        {currentQuestion && gameState === 'battle' && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold mb-6 text-center">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswering || isBossTurn}
                  whileHover={{ scale: isAnswering || isBossTurn ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswering || isBossTurn ? 1 : 0.98 }}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'bg-blue-500 text-white border-2 border-blue-300'
                      : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
                  } ${isAnswering || isBossTurn ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option?.text || option}</span>
                  </div>
                </motion.button>
              )) || []}
            </div>
          </motion.div>
        )}

        {/* Battle Log */}
        <div className="mt-4 space-y-2">
          {battleLog.map((log, index) => (
            <motion.div
              key={log.timestamp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm ${
                log.type === 'success' ? 'text-green-300 border-l-4 border-green-500' :
                log.type === 'error' ? 'text-red-300 border-l-4 border-red-500' :
                log.type === 'warning' ? 'text-yellow-300 border-l-4 border-yellow-500' :
                'text-gray-300 border-l-4 border-gray-500'
              }`}
            >
              {log.message}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Victory/Defeat Overlay */}
      <AnimatePresence>
        {gameState !== 'battle' && gameState !== 'calculating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`text-center p-8 rounded-3xl max-w-md mx-4 ${
                gameState === 'victory'
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                  : 'bg-gradient-to-br from-gray-600 to-gray-800'
              }`}
            >
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  scale: gameState === 'victory' ? [1, 1.2, 1] : [1, 0.9, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {gameState === 'victory' ? '🏆' : '💀'}
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-4">
                {gameState === 'victory' ? 'VICTORY!' : 'DEFEAT!'}
              </h2>

              <p className="text-white/90 text-lg mb-6">
                {gameState === 'victory'
                  ? `You defeated ${miniBoss.name}! Excellent work!`
                  : `${miniBoss.name} was too strong. Review and try again!`
                }
              </p>

              {gameState === 'victory' && (
                <div className="space-y-2 mb-6 text-white/90">
                  <div>XP Gained: +{results.xpEarned}</div>
                  <div>Combo Bonus: +{comboCount * 10} XP</div>
                  <div>Badge Earned: {miniBoss.rewards.badge}</div>
                  <div className="text-sm mt-4">
                    Score: {results.correctAnswers}/{results.totalQuestions} correct
                  </div>
                </div>
              )}

              {gameState === 'defeat' && (
                <div className="space-y-2 mb-6 text-white/90 text-sm">
                  <div>Score: {results.correctAnswers}/{results.totalQuestions} correct</div>
                  <div>Review the topics and try again in 5 minutes</div>
                </div>
              )}

              <button
                onClick={() => onBattleComplete(results)}
                className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniBossBattle;
