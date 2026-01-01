import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CollaborativeQuizBattle = ({ 
  battleId, 
  userId, 
  onComplete, 
  battleMode = 'team_vs_team', // 'team_vs_team', 'free_for_all', 'relay'
  className = '' 
}) => {
  const [battleState, setBattleState] = useState('waiting'); // 'waiting', 'active', 'completed'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState({ team1: [], team2: [] });
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [myAnswer, setMyAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [battleResults, setBattleResults] = useState(null);
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [reactions, setReactions] = useState({});
  const [powerUps, setPowerUps] = useState({});
  const websocketRef = useRef(null);

  // Sample battle configuration
  const [battleConfig] = useState({
    id: battleId,
    name: "Biology Module 7 Battle",
    subject: 'biology',
    dotPoints: ['BIO11-7.1', 'BIO11-7.2'],
    totalQuestions: 10,
    timePerQuestion: 30,
    powerUpsEnabled: true,
    chatEnabled: true,
    mode: battleMode
  });

  // Sample participants data
  useEffect(() => {
    // Mock participants - in real app, this would come from WebSocket
    setParticipants([
      { 
        userId: 'user1', 
        username: 'Sarah_Bio', 
        avatar: '🧬', 
        team: 'team1',
        score: 120,
        streak: 3,
        powerUps: ['hint', 'freeze_time']
      },
      { 
        userId: 'user2', 
        username: 'Mike_Science', 
        avatar: '🔬', 
        team: 'team1',
        score: 95,
        streak: 2,
        powerUps: ['double_points']
      },
      { 
        userId: 'user3', 
        username: 'Emma_Studies', 
        avatar: '📚', 
        team: 'team2',
        score: 110,
        streak: 4,
        powerUps: ['hint', 'skip_question']
      },
      { 
        userId: userId, 
        username: 'You', 
        avatar: '🎯', 
        team: 'team2',
        score: 85,
        streak: 1,
        powerUps: ['hint', 'freeze_time', 'double_points']
      }
    ]);

    // Group into teams
    setTeams({
      team1: [
        { userId: 'user1', username: 'Sarah_Bio', avatar: '🧬', score: 120, streak: 3 },
        { userId: 'user2', username: 'Mike_Science', avatar: '🔬', score: 95, streak: 2 }
      ],
      team2: [
        { userId: 'user3', username: 'Emma_Studies', avatar: '📚', score: 110, streak: 4 },
        { userId: userId, username: 'You', avatar: '🎯', score: 85, streak: 1 }
      ]
    });

    // Start battle simulation
    setTimeout(() => {
      setBattleState('active');
      loadNextQuestion();
    }, 2000);
  }, []);

  // WebSocket connection simulation
  useEffect(() => {
    // In real app, establish WebSocket connection
    // websocketRef.current = new WebSocket(`ws://localhost:3001/battle/${battleId}`);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (battleState === 'active') {
        // Simulate other players answering
        updateParticipantProgress();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [battleState]);

  // Question timer
  useEffect(() => {
    if (battleState === 'active' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && battleState === 'active') {
      handleTimeUp();
    }
  }, [timeRemaining, battleState]);

  const loadNextQuestion = () => {
    // Mock question data
    const questions = [
      {
        id: 'q1',
        text: 'Which type of pathogen is responsible for causing malaria?',
        options: ['Bacteria', 'Virus', 'Protozoa', 'Fungi'],
        correctAnswer: 2,
        difficulty: 'medium',
        dotPoint: 'BIO11-7.1',
        powerUpEffects: {
          hint: 'This pathogen is a single-celled eukaryote transmitted by mosquitoes',
          eliminate: [0, 1] // Eliminate bacteria and virus options
        }
      },
      {
        id: 'q2',
        text: 'What is the primary function of T-helper cells in the immune response?',
        options: [
          'Direct killing of infected cells',
          'Producing antibodies',
          'Coordinating immune responses',
          'Engulfing pathogens'
        ],
        correctAnswer: 2,
        difficulty: 'hard',
        dotPoint: 'BIO11-7.2'
      }
    ];

    const question = questions[questionIndex % questions.length];
    setCurrentQuestion(question);
    setTimeRemaining(battleConfig.timePerQuestion);
    setMyAnswer(null);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (myAnswer !== null || battleState !== 'active') return;
    
    setMyAnswer(answerIndex);
    
    // Calculate points based on speed and correctness
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const speedBonus = Math.floor((timeRemaining / battleConfig.timePerQuestion) * 50);
    const points = isCorrect ? 100 + speedBonus : 0;
    
    // Apply power-up effects
    const finalPoints = applyPowerUpEffects(points, isCorrect);
    
    // Update score
    updateScore(finalPoints, isCorrect);
    
    // Show result and move to next question
    setTimeout(() => {
      if (questionIndex < battleConfig.totalQuestions - 1) {
        setQuestionIndex(prev => prev + 1);
        loadNextQuestion();
      } else {
        endBattle();
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (myAnswer === null) {
      setMyAnswer(-1); // Mark as no answer
      setTimeout(() => {
        if (questionIndex < battleConfig.totalQuestions - 1) {
          setQuestionIndex(prev => prev + 1);
          loadNextQuestion();
        } else {
          endBattle();
        }
      }, 1000);
    }
  };

  const applyPowerUpEffects = (basePoints, isCorrect) => {
    // Mock power-up application
    return basePoints;
  };

  const updateScore = (points, isCorrect) => {
    const myTeam = teams.team1.some(p => p.userId === userId) ? 'team1' : 'team2';
    
    setScores(prev => ({
      ...prev,
      [myTeam]: prev[myTeam] + points
    }));

    // Update my participant data
    setParticipants(prev => prev.map(p => 
      p.userId === userId 
        ? { 
            ...p, 
            score: p.score + points,
            streak: isCorrect ? p.streak + 1 : 0
          }
        : p
    ));
  };

  const updateParticipantProgress = () => {
    // Simulate other participants answering
    setParticipants(prev => prev.map(p => {
      if (p.userId !== userId && Math.random() > 0.7) {
        return {
          ...p,
          score: p.score + Math.floor(Math.random() * 120),
          streak: Math.random() > 0.3 ? p.streak + 1 : 0
        };
      }
      return p;
    }));
  };

  const endBattle = () => {
    setBattleState('completed');
    
    // Calculate final results
    const winner = scores.team1 > scores.team2 ? 'team1' : 'team2';
    const myTeam = teams.team1.some(p => p.userId === userId) ? 'team1' : 'team2';
    
    setBattleResults({
      winner,
      myTeam,
      won: winner === myTeam,
      finalScores: scores,
      mvp: participants.reduce((prev, current) => 
        prev.score > current.score ? prev : current
      )
    });

    // Call completion callback
    setTimeout(() => {
      onComplete({
        battleId,
        result: winner === myTeam ? 'win' : 'loss',
        finalScore: scores[myTeam],
        personalScore: participants.find(p => p.userId === userId)?.score || 0,
        questionsAnswered: questionIndex + 1
      });
    }, 5000);
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      userId,
      username: 'You',
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };
    
    setChat(prev => [...prev, message]);
    setNewMessage('');
  };

  const sendReaction = (type) => {
    const reaction = {
      id: Date.now(),
      userId,
      type,
      timestamp: new Date()
    };
    
    setReactions(prev => ({
      ...prev,
      [currentQuestion?.id]: [...(prev[currentQuestion?.id] || []), reaction]
    }));
  };

  const activatePowerUp = (powerUpType) => {
    // Implement power-up logic
    console.log('Using power-up:', powerUpType);
  };

  if (battleState === 'waiting') {
    return (
      <div className={`bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 text-center ${className}`}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          ⚔️
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Battle Starting Soon!</h2>
        <p className="text-gray-600 mb-4">{battleConfig.name}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <h3 className="font-semibold text-blue-800">Team Alpha</h3>
            <div className="space-y-1 mt-2">
              {teams.team1.map(member => (
                <div key={member.userId} className="flex items-center space-x-2">
                  <span>{member.avatar}</span>
                  <span className="text-sm">{member.username}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <h3 className="font-semibold text-purple-800">Team Beta</h3>
            <div className="space-y-1 mt-2">
              {teams.team2.map(member => (
                <div key={member.userId} className="flex items-center space-x-2">
                  <span>{member.avatar}</span>
                  <span className="text-sm">{member.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (battleState === 'completed') {
    return (
      <div className={`bg-white rounded-lg p-6 text-center ${className}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          {battleResults.won ? '🏆' : '🥈'}
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">
          {battleResults.won ? 'Victory!' : 'Good Fight!'}
        </h2>
        <p className="text-gray-600 mb-4">
          {battleResults.won ? 'Your team won the battle!' : 'Better luck next time!'}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Team Alpha</h3>
            <div className="text-2xl font-bold text-blue-600">{battleResults.finalScores.team1}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Team Beta</h3>
            <div className="text-2xl font-bold text-purple-600">{battleResults.finalScores.team2}</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-yellow-800 mb-2">🌟 MVP</h4>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">{battleResults.mvp.avatar}</span>
            <span className="font-medium">{battleResults.mvp.username}</span>
            <span className="text-sm text-gray-600">({battleResults.mvp.score} points)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Battle Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{battleConfig.name}</h2>
            <p className="text-sm opacity-90">
              Question {questionIndex + 1} of {battleConfig.totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{timeRemaining}s</div>
            <div className="text-sm opacity-90">Time remaining</div>
          </div>
        </div>
      </div>

      {/* Team Scores */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50">
        <div className="bg-blue-100 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-blue-800">Team Alpha</h3>
            <div className="text-lg font-bold text-blue-600">{scores.team1}</div>
          </div>
          <div className="flex space-x-1 mt-2">
            {teams.team1.map(member => (
              <div key={member.userId} className="text-center">
                <div className="text-lg">{member.avatar}</div>
                <div className="text-xs text-blue-700">{member.score}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-purple-100 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-purple-800">Team Beta</h3>
            <div className="text-lg font-bold text-purple-600">{scores.team2}</div>
          </div>
          <div className="flex space-x-1 mt-2">
            {teams.team2.map(member => (
              <div key={member.userId} className="text-center">
                <div className="text-lg">{member.avatar}</div>
                <div className="text-xs text-purple-700">{member.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {currentQuestion.text}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">{currentQuestion.difficulty}</span>
              <span className="bg-blue-100 px-2 py-1 rounded">{currentQuestion.dotPoint}</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={myAnswer !== null}
                whileHover={{ scale: myAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  myAnswer === null
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    : myAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-red-500 bg-red-100 text-red-800'
                      : index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {myAnswer === index && (
                    <span className="text-lg">
                      {index === currentQuestion.correctAnswer ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Power-ups */}
          {battleConfig.powerUpsEnabled && (
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => activatePowerUp('hint')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                💡 Hint
              </button>
              <button
                onClick={() => activatePowerUp('freeze_time')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                ❄️ Freeze
              </button>
              <button
                onClick={() => activatePowerUp('double_points')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
              >
                ⭐ 2x Points
              </button>
            </div>
          )}

          {/* Reactions */}
          <div className="flex space-x-2">
            {['😊', '🤔', '💪', '🔥'].map(emoji => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat (if enabled) */}
      {battleConfig.chatEnabled && (
        <div className="border-t p-4">
          <div className="h-24 overflow-y-auto bg-gray-50 rounded p-2 mb-2">
            {chat.map(message => (
              <div key={message.id} className="text-sm mb-1">
                <span className="font-medium">{message.username}:</span>
                <span className="ml-1">{message.message}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1 border rounded"
            />
            <button
              onClick={sendChatMessage}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeQuizBattle;
