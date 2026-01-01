import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveTutoringSession = ({ sessionId, userId, role = 'tutee', onEndSession }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [conceptNotes, setConceptNotes] = useState([]);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [currentConcept, setCurrentConcept] = useState('');
  const [conceptExplanation, setConceptExplanation] = useState('');
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchSession();
    startTimer();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      // Mock session data
      const mockSession = {
        sessionId,
        tutor: {
          userId: 'tutor_1',
          displayName: 'Sarah Chen',
          expertise: ['BIO11-5.1', 'BIO11-5.2', 'BIO11-6.1'],
          rating: 4.8
        },
        tutee: {
          userId: 'student_1',
          displayName: 'Alex Student',
          currentLevel: 'intermediate'
        },
        subject: 'biology',
        topics: ['Meiosis', 'Inheritance Patterns'],
        dotPoints: ['BIO11-5.1', 'BIO11-5.2'],
        difficulty: 'intermediate',
        duration: 60,
        status: 'active',
        sessionNotes: {
          objectives: [
            'Understand the process of meiosis',
            'Learn inheritance patterns',
            'Practice genetic crosses'
          ],
          conceptsExplained: [],
          questionsAsked: []
        }
      };
      
      setSession(mockSession);
      setSessionStarted(true);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      userId,
      username: role === 'tutor' ? session.tutor.displayName : session.tutee.displayName,
      message: newMessage,
      timestamp: new Date(),
      type: 'chat'
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const addConceptExplanation = async () => {
    if (!currentConcept || !conceptExplanation) return;
    
    try {
      const conceptData = {
        dotPoint: currentConcept,
        explanation: conceptExplanation,
        example: '',
        understood: true,
        userId
      };

      // Add to local state
      const newConcept = {
        id: Date.now(),
        ...conceptData,
        timestamp: new Date()
      };
      
      setConceptNotes(prev => [...prev, newConcept]);
      
      // Add system message
      const systemMessage = {
        id: Date.now() + 1,
        userId: 'system',
        username: 'System',
        message: `📝 ${role === 'tutor' ? 'Tutor' : 'Student'} added explanation for ${currentConcept}`,
        timestamp: new Date(),
        type: 'system'
      };
      
      setChatMessages(prev => [...prev, systemMessage]);
      
      setCurrentConcept('');
      setConceptExplanation('');
      
    } catch (error) {
      console.error('Error adding concept explanation:', error);
    }
  };

  const startPracticeQuestion = () => {
    const mockQuestion = {
      id: 'question_1',
      dotPoint: 'BIO11-5.1',
      question: 'During meiosis, when does crossing over occur?',
      options: [
        'Prophase I',
        'Metaphase I', 
        'Anaphase I',
        'Telophase I'
      ],
      correctAnswer: 0,
      explanation: 'Crossing over occurs during prophase I when homologous chromosomes pair up and exchange genetic material.'
    };
    
    setActiveQuestion(mockQuestion);
    
    const systemMessage = {
      id: Date.now(),
      userId: 'system',
      username: 'System',
      message: '❓ Practice question started',
      timestamp: new Date(),
      type: 'system'
    };
    
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const answerQuestion = (answerIndex) => {
    if (!activeQuestion) return;
    
    const isCorrect = answerIndex === activeQuestion.correctAnswer;
    
    const resultMessage = {
      id: Date.now(),
      userId: 'system',
      username: 'System',
      message: `${isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${activeQuestion.explanation}`,
      timestamp: new Date(),
      type: 'system'
    };
    
    setChatMessages(prev => [...prev, resultMessage]);
    setActiveQuestion(null);
  };

  const endSession = async () => {
    try {
      const sessionSummary = {
        userId,
        feedback: {
          rating: 5,
          comments: 'Great session!',
          helpfulness: 5
        },
        outcomes: {
          conceptsLearned: conceptNotes.length,
          questionsResolved: 1,
          masteryImprovement: { before: 0.6, after: 0.8 }
        },
        followUpNeeded: false
      };

      // Call parent callback
      if (onEndSession) {
        onEndSession(sessionSummary);
      }
      
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              {role === 'tutor' ? session.tutee.displayName?.charAt(0) : session.tutor.displayName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold">
                {role === 'tutor' ? `Tutoring ${session.tutee.displayName}` : `Session with ${session.tutor.displayName}`}
              </h3>
              <p className="text-sm text-gray-600">{session.subject} • {session.difficulty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>🕐 {formatTime(sessionTimer)}</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              showWhiteboard ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📝 Whiteboard
          </button>
          <button
            onClick={endSession}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Session Tools */}
          <div className="bg-white border-b p-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {role === 'tutor' && (
                  <>
                    <button
                      onClick={startPracticeQuestion}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      📊 Start Quiz
                    </button>
                    <button
                      onClick={() => setShowWhiteboard(true)}
                      className="bg-purple-500 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-600 transition-colors"
                    >
                      ✏️ Draw
                    </button>
                  </>
                )}
                <button className="bg-green-500 text-white px-3 py-1.5 rounded text-sm hover:bg-green-600 transition-colors">
                  📹 Share Screen
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Topics: {session.topics.join(', ')}
              </div>
            </div>
          </div>

          {/* Active Question */}
          <AnimatePresence>
            {activeQuestion && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 border-b p-4"
              >
                <h4 className="font-semibold text-blue-800 mb-3">Practice Question</h4>
                <p className="text-gray-800 mb-3">{activeQuestion.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {activeQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => answerQuestion(index)}
                      className="p-2 text-left bg-white border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Session Objectives */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Session Objectives</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                {session.sessionNotes.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>

            {/* Chat Messages */}
            {chatMessages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.type === 'system' ? 'bg-gray-100 text-gray-700 text-sm' :
                  message.userId === userId ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'
                }`}>
                  {message.type !== 'system' && (
                    <p className="text-xs opacity-75 mb-1">{message.username}</p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button className="flex-1 py-2 px-3 text-sm font-medium bg-blue-50 text-blue-600 border-b-2 border-blue-500">
                📝 Notes
              </button>
              <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                📚 Resources
              </button>
            </div>
          </div>

          {/* Notes Content */}
          <div className="p-4 h-full overflow-y-auto">
            {/* Add Concept Form */}
            {role === 'tutor' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-2">Add Concept Explanation</h5>
                <select
                  value={currentConcept}
                  onChange={(e) => setCurrentConcept(e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select concept...</option>
                  {session.dotPoints.map(dp => (
                    <option key={dp} value={dp}>{dp}</option>
                  ))}
                </select>
                <textarea
                  value={conceptExplanation}
                  onChange={(e) => setConceptExplanation(e.target.value)}
                  placeholder="Explain the concept..."
                  rows={3}
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={addConceptExplanation}
                  disabled={!currentConcept || !conceptExplanation}
                  className="w-full bg-green-500 text-white py-1.5 rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Explanation
                </button>
              </div>
            )}

            {/* Concept Notes */}
            <div>
              <h5 className="font-semibold text-gray-800 mb-3">Concepts Covered</h5>
              <div className="space-y-3">
                {conceptNotes.map(note => (
                  <div key={note.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">{note.dotPoint}</span>
                      <span className="text-xs text-blue-600">
                        {note.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{note.explanation}</p>
                  </div>
                ))}
                
                {conceptNotes.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="text-sm">No concept notes yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Whiteboard Modal */}
      <AnimatePresence>
        {showWhiteboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowWhiteboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-4/5 h-4/5 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Shared Whiteboard</h3>
                <button
                  onClick={() => setShowWhiteboard(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🎨</div>
                  <p>Whiteboard functionality would be implemented here</p>
                  <p className="text-sm">Real-time collaborative drawing canvas</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTutoringSession;