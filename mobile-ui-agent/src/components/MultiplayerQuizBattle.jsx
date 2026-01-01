import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MultiplayerQuizBattle.css';

const MultiplayerQuizBattle = ({ onExit, currentUser }) => {
  const [gameState, setGameState] = useState('lobby'); // lobby, waiting, battle, results
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userAnswer, setUserAnswer] = useState(null);
  const [playerScores, setPlayerScores] = useState({});
  const [battleResults, setBattleResults] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [gameId, setGameId] = useState(null);
  const [battleHistory, setBattleHistory] = useState([]);
  const timerRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const battleTypes = {
    speed: {
      name: 'Speed Battle',
      icon: '',
      description: 'Fast-paced questions with 10 seconds each',
      timePerQuestion: 10,
      questionsCount: 15
    },
    endurance: {
      name: 'Endurance Challenge',
      icon: '',
      description: '30 questions with 20 seconds each',
      timePerQuestion: 20,
      questionsCount: 30
    },
    precision: {
      name: 'Precision Mode',
      icon: '',
      description: 'Harder questions with 30 seconds each',
      timePerQuestion: 30,
      questionsCount: 12
    }
  };

  const [selectedBattleType, setSelectedBattleType] = useState('speed');

  useEffect(() => {
    // Simulate connection and player matching
    simulateMultiplayerConnection();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const simulateMultiplayerConnection = () => {
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('connected');
      setGameId(generateGameId());
      
      // Add current user to players
      const mockPlayers = [
        {
          id: currentUser?.id || 'user1',
          name: currentUser?.name || 'You',
          avatar: currentUser?.avatar || '',
          school: currentUser?.school || 'Your School',
          rating: 1250,
          isCurrentUser: true,
          status: 'ready'
        },
        // Add mock opponents
        ...generateMockOpponents()
      ];
      
      setPlayers(mockPlayers);
      initializePlayerScores(mockPlayers);
    }, 2000);
  };

  const generateGameId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateMockOpponents = () => {
    const opponents = [
      { name: 'Sarah Kim', avatar: '', school: 'Sydney Grammar', rating: 1180 },
      { name: 'Alex Chen', avatar: '', school: 'North Sydney Boys', rating: 1320 },
      { name: 'Maya Patel', avatar: '', school: 'James Ruse', rating: 1290 }
    ];
    
    const opponentCount = Math.floor(Math.random() * 3) + 2; // 2-4 opponents
    return opponents.slice(0, opponentCount).map((opponent, index) => ({
      id: `opponent_${index}`,
      ...opponent,
      isCurrentUser: false,
      status: Math.random() > 0.3 ? 'ready' : 'waiting'
    }));
  };

  const initializePlayerScores = (playerList) => {
    const scores = {};
    playerList.forEach(player => {
      scores[player.id] = {
        score: 0,
        correctAnswers: 0,
        streak: 0,
        averageTime: 0,
        totalTime: 0
      };
    });
    setPlayerScores(scores);
  };

  const startBattle = () => {
    if (players.filter(p => p.status === 'ready').length < 2) return;
    
    setGameState('battle');
    setQuestionIndex(0);
    loadNextQuestion();
  };

  const loadNextQuestion = () => {
    const questions = generateBattleQuestions();
    if (questionIndex >= questions.length) {
      endBattle();
      return;
    }

    setCurrentQuestion(questions[questionIndex]);
    setTimeLeft(battleTypes[selectedBattleType].timePerQuestion);
    setUserAnswer(null);

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateBattleQuestions = () => {
    const questionPool = [
      {
        id: 1,
        question: "What is the primary function of mitochondria?",
        options: ["Protein synthesis", "Cellular respiration", "DNA replication", "Photosynthesis"],
        correct: 1,
        difficulty: "medium",
        topic: "Cell Biology"
      },
      {
        id: 2,
        question: "Which process produces the most ATP?",
        options: ["Glycolysis", "Krebs cycle", "Electron transport chain", "Fermentation"],
        correct: 2,
        difficulty: "hard",
        topic: "Cellular Respiration"
      },
      {
        id: 3,
        question: "What type of bond holds the two strands of DNA together?",
        options: ["Ionic bonds", "Covalent bonds", "Hydrogen bonds", "Van der Waals forces"],
        correct: 2,
        difficulty: "medium",
        topic: "DNA Structure"
      },
      {
        id: 4,
        question: "In which phase of mitosis do chromosomes line up at the equator?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correct: 1,
        difficulty: "easy",
        topic: "Cell Division"
      },
      {
        id: 5,
        question: "What is the complementary DNA strand to 5'-ATCG-3'?",
        options: ["5'-TAGC-3'", "3'-TAGC-5'", "5'-CGAT-3'", "3'-CGAT-5'"],
        correct: 1,
        difficulty: "hard",
        topic: "DNA Structure"
      }
    ];

    return questionPool.sort(() => Math.random() - 0.5).slice(0, battleTypes[selectedBattleType].questionsCount);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (userAnswer !== null) return;
    
    setUserAnswer(answerIndex);
    clearInterval(timerRef.current);
    
    const isCorrect = answerIndex === currentQuestion.correct;
    const responseTime = battleTypes[selectedBattleType].timePerQuestion - timeLeft;
    
    // Update player scores
    updatePlayerScore(isCorrect, responseTime);
    
    // Simulate other players answering
    simulateOpponentAnswers();
    
    setTimeout(() => {
      setQuestionIndex(prev => prev + 1);
      loadNextQuestion();
    }, 2000);
  };

  const handleTimeUp = () => {
    if (userAnswer !== null) return;
    
    clearInterval(timerRef.current);
    setUserAnswer(-1); // Indicates no answer
    updatePlayerScore(false, battleTypes[selectedBattleType].timePerQuestion);
    
    simulateOpponentAnswers();
    
    setTimeout(() => {
      setQuestionIndex(prev => prev + 1);
      loadNextQuestion();
    }, 2000);
  };

  const updatePlayerScore = (isCorrect, responseTime) => {
    const currentUserId = players.find(p => p.isCurrentUser)?.id;
    if (!currentUserId) return;

    setPlayerScores(prev => {
      const userScore = prev[currentUserId];
      let points = 0;
      
      if (isCorrect) {
        // Base points + speed bonus
        points = 100;
        const speedBonus = Math.max(0, (battleTypes[selectedBattleType].timePerQuestion - responseTime) * 5);
        points += speedBonus;
        
        // Streak bonus
        const streakBonus = userScore.streak * 10;
        points += streakBonus;
      }

      return {
        ...prev,
        [currentUserId]: {
          ...userScore,
          score: userScore.score + points,
          correctAnswers: userScore.correctAnswers + (isCorrect ? 1 : 0),
          streak: isCorrect ? userScore.streak + 1 : 0,
          totalTime: userScore.totalTime + responseTime,
          averageTime: (userScore.totalTime + responseTime) / (questionIndex + 1)
        }
      };
    });
  };

  const simulateOpponentAnswers = () => {
    players.filter(p => !p.isCurrentUser).forEach(player => {
      const accuracy = 0.6 + (player.rating - 1000) / 1000 * 0.3; // Rating affects accuracy
      const isCorrect = Math.random() < accuracy;
      const responseTime = Math.random() * battleTypes[selectedBattleType].timePerQuestion * 0.8 + 2;
      
      setPlayerScores(prev => {
        const playerScore = prev[player.id];
        let points = 0;
        
        if (isCorrect) {
          points = 100;
          const speedBonus = Math.max(0, (battleTypes[selectedBattleType].timePerQuestion - responseTime) * 5);
          points += speedBonus;
          const streakBonus = playerScore.streak * 10;
          points += streakBonus;
        }

        return {
          ...prev,
          [player.id]: {
            ...playerScore,
            score: playerScore.score + points,
            correctAnswers: playerScore.correctAnswers + (isCorrect ? 1 : 0),
            streak: isCorrect ? playerScore.streak + 1 : 0,
            totalTime: playerScore.totalTime + responseTime,
            averageTime: (playerScore.totalTime + responseTime) / (questionIndex + 1)
          }
        };
      });
    });
  };

  const endBattle = () => {
    setGameState('results');
    
    // Calculate final results
    const results = Object.entries(playerScores).map(([playerId, score]) => {
      const player = players.find(p => p.id === playerId);
      return {
        ...player,
        ...score,
        accuracy: Math.round((score.correctAnswers / questionIndex) * 100),
        rank: 0 // Will be set after sorting
      };
    }).sort((a, b) => b.score - a.score).map((player, index) => ({
      ...player,
      rank: index + 1
    }));

    setBattleResults(results);
    
    // Add to battle history
    const currentUserResult = results.find(r => r.isCurrentUser);
    setBattleHistory(prev => [...prev, {
      id: Date.now(),
      date: new Date(),
      battleType: selectedBattleType,
      rank: currentUserResult.rank,
      score: currentUserResult.score,
      players: results.length
    }]);
  };

  const getAnswerClass = (optionIndex) => {
    if (userAnswer === null) return 'option';
    
    const isSelected = userAnswer === optionIndex;
    const isCorrect = optionIndex === currentQuestion.correct;
    
    if (isSelected && isCorrect) return 'option selected correct';
    if (isSelected && !isCorrect) return 'option selected incorrect';
    if (isCorrect) return 'option correct';
    return 'option';
  };

  const getRankIcon = (rank) => {
    const icons = { 1: '', 2: '', 3: '' };
    return icons[rank] || `#${rank}`;
  };

  const getRankColor = (rank) => {
    const colors = { 1: '#fbbf24', 2: '#94a3b8', 3: '#cd7c0f' };
    return colors[rank] || '#6b7280';
  };

  if (gameState === 'lobby') {
    return (
      <div className="multiplayer-battle-container">
        <div className="battle-lobby">
          <header className="lobby-header">
            <button onClick={onExit} className="exit-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1> Multiplayer Quiz Battle</h1>
            <div className="connection-status">
              <div className={`status-indicator ${connectionStatus}`}></div>
              <span>{connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}</span>
            </div>
          </header>

          <div className="battle-setup">
            <div className="battle-types">
              <h2>Choose Battle Type</h2>
              <div className="battle-type-grid">
                {Object.entries(battleTypes).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedBattleType(key)}
                    className={`battle-type-card ${selectedBattleType === key ? 'selected' : ''}`}
                  >
                    <div className="type-icon">{type.icon}</div>
                    <h3>{type.name}</h3>
                    <p>{type.description}</p>
                    <div className="type-stats">
                      <span>{type.questionsCount} questions</span>
                      <span>{type.timePerQuestion}s each</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {connectionStatus === 'connected' && (
              <div className="game-lobby">
                <div className="lobby-info">
                  <h3>Game ID: {gameId}</h3>
                  <p>Share this ID with friends to join your battle!</p>
                </div>

                <div className="players-waiting">
                  <h3>Players ({players.length}/8)</h3>
                  <div className="players-grid">
                    {players.map(player => (
                      <div key={player.id} className={`player-card ${player.status}`}>
                        <div className="player-avatar">{player.avatar}</div>
                        <div className="player-info">
                          <span className="player-name">
                            {player.name} {player.isCurrentUser && '(You)'}
                          </span>
                          <span className="player-school">{player.school}</span>
                          <span className="player-rating"> {player.rating}</span>
                        </div>
                        <div className={`player-status ${player.status}`}>
                          {player.status === 'ready' ? '' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startBattle}
                  disabled={players.filter(p => p.status === 'ready').length < 2}
                  className="start-battle-button"
                >
                  {players.filter(p => p.status === 'ready').length < 2 
                    ? 'Waiting for more players...' 
                    : 'Start Battle!'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'battle') {
    return (
      <div className="multiplayer-battle-container">
        <div className="battle-arena">
          <header className="battle-header">
            <div className="battle-info">
              <span className="question-progress">{questionIndex + 1}/{battleTypes[selectedBattleType].questionsCount}</span>
              <span className="battle-type">{battleTypes[selectedBattleType].name}</span>
            </div>
            <div className="battle-timer">
              <div className="timer-circle">
                <div 
                  className="timer-fill"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 20}`,
                    strokeDashoffset: `${2 * Math.PI * 20 * (1 - timeLeft / battleTypes[selectedBattleType].timePerQuestion)}`
                  }}
                ></div>
                <span className="timer-text">{timeLeft}</span>
              </div>
            </div>
          </header>

          <div className="battle-content">
            <div className="question-section">
              <div className="question-header">
                <span className="question-topic">{currentQuestion?.topic}</span>
                <span className="question-difficulty">{currentQuestion?.difficulty}</span>
              </div>
              <h2 className="question-text">{currentQuestion?.question}</h2>
              
              <div className="options-grid">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={getAnswerClass(index)}
                    disabled={userAnswer !== null}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="players-sidebar">
              <h3>Live Scores</h3>
              <div className="live-scoreboard">
                {players
                  .sort((a, b) => (playerScores[b.id]?.score || 0) - (playerScores[a.id]?.score || 0))
                  .map((player, index) => (
                    <div key={player.id} className={`score-row ${player.isCurrentUser ? 'current-user' : ''}`}>
                      <div className="player-rank">{index + 1}</div>
                      <div className="player-info">
                        <span className="player-avatar">{player.avatar}</span>
                        <span className="player-name">{player.name}</span>
                      </div>
                      <div className="player-score">{playerScores[player.id]?.score || 0}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="multiplayer-battle-container">
        <div className="battle-results">
          <header className="results-header">
            <h1> Battle Results</h1>
            <p>{battleTypes[selectedBattleType].name} - {questionIndex} Questions</p>
          </header>

          <div className="results-content">
            <div className="podium">
              {battleResults?.slice(0, 3).map((player, index) => (
                <div key={player.id} className={`podium-place place-${index + 1} ${player.isCurrentUser ? 'current-user' : ''}`}>
                  <div className="podium-rank">{getRankIcon(index + 1)}</div>
                  <div className="podium-avatar">{player.avatar}</div>
                  <div className="podium-name">{player.name}</div>
                  <div className="podium-score">{player.score} pts</div>
                  <div className="podium-accuracy">{player.accuracy}% accuracy</div>
                </div>
              ))}
            </div>

            <div className="full-results">
              <h3>Final Rankings</h3>
              <div className="results-table">
                {battleResults?.map(player => (
                  <div key={player.id} className={`result-row ${player.isCurrentUser ? 'current-user' : ''}`}>
                    <div className="result-rank" style={{ color: getRankColor(player.rank) }}>
                      {getRankIcon(player.rank)}
                    </div>
                    <div className="result-player">
                      <span className="player-avatar">{player.avatar}</span>
                      <div className="player-details">
                        <span className="player-name">{player.name}</span>
                        <span className="player-school">{player.school}</span>
                      </div>
                    </div>
                    <div className="result-stats">
                      <div className="stat">
                        <span className="stat-value">{player.score}</span>
                        <span className="stat-label">Score</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{player.correctAnswers}/{questionIndex}</span>
                        <span className="stat-label">Correct</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{player.accuracy}%</span>
                        <span className="stat-label">Accuracy</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{Math.round(player.averageTime)}s</span>
                        <span className="stat-label">Avg Time</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="results-actions">
            <button onClick={() => setGameState('lobby')} className="play-again-button">
               Play Again
            </button>
            <button onClick={onExit} className="exit-button">
               Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MultiplayerQuizBattle;
