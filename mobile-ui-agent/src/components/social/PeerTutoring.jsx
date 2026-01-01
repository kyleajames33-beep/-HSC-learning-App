import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PeerTutoring = ({ userId, subject = 'biology', className = '' }) => {
  const [activeTab, setActiveTab] = useState('find-tutor');
  const [availableTutors, setAvailableTutors] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [sessionRequest, setSessionRequest] = useState({
    topics: [],
    dotPoints: [],
    difficulty: 'intermediate',
    preferredTime: '',
    duration: 60,
    objectives: []
  });

  useEffect(() => {
    if (activeTab === 'find-tutor') {
      fetchAvailableTutors();
    } else if (activeTab === 'my-sessions') {
      fetchUserSessions();
    }
  }, [activeTab, userId, subject]);

  const fetchAvailableTutors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/peer-tutoring/tutors/search?subject=${subject}&difficulty=${sessionRequest.difficulty}&maxResults=10`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableTutors(data.tutors);
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setAvailableTutors(generateMockTutors());
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/peer-tutoring/sessions/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setUserSessions(generateMockSessions());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTutors = () => [
    {
      userId: 'tutor_1',
      displayName: 'Sarah Chen',
      expertise: [{ subject: 'biology', dotPoints: ['BIO11-5.1', 'BIO11-5.2'], proficiencyLevel: 0.95 }],
      stats: { averageRating: 4.8, totalSessions: 124, successRate: 0.96 },
      availability: { timezone: 'Australia/Sydney' },
      verification: { isVerified: true, badges: ['expert', 'patient'] },
      matchScore: 0.92
    },
    {
      userId: 'tutor_2',
      displayName: 'Alex Kumar',
      expertise: [{ subject: 'biology', dotPoints: ['BIO11-6.1', 'BIO11-7.1'], proficiencyLevel: 0.88 }],
      stats: { averageRating: 4.6, totalSessions: 87, successRate: 0.91 },
      availability: { timezone: 'Australia/Sydney' },
      verification: { isVerified: true, badges: ['helpful'] },
      matchScore: 0.85
    },
    {
      userId: 'tutor_3',
      displayName: 'Emma Watson',
      expertise: [{ subject: 'biology', dotPoints: ['BIO11-8.1', 'BIO11-8.2'], proficiencyLevel: 0.91 }],
      stats: { averageRating: 4.9, totalSessions: 156, successRate: 0.94 },
      availability: { timezone: 'Australia/Sydney' },
      verification: { isVerified: true, badges: ['top_rated', 'expert'] },
      matchScore: 0.89
    }
  ];

  const generateMockSessions = () => [
    {
      sessionId: 'session_1',
      tutor: { displayName: 'Sarah Chen', userId: 'tutor_1' },
      tutee: { displayName: 'You', userId: userId },
      subject: 'biology',
      topics: ['Meiosis', 'Inheritance'],
      difficulty: 'intermediate',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: 60,
      status: 'scheduled'
    },
    {
      sessionId: 'session_2',
      tutor: { displayName: 'Alex Kumar', userId: 'tutor_2' },
      tutee: { displayName: 'You', userId: userId },
      subject: 'biology',
      topics: ['Genetic Mutations'],
      difficulty: 'advanced',
      scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duration: 45,
      status: 'completed',
      feedback: {
        tuteeFeedback: { rating: 5, helpfulness: 5, clarity: 5 }
      }
    }
  ];

  const requestTutoringSession = async (tutorId) => {
    try {
      setLoading(true);
      
      const sessionData = {
        tutorId,
        tuteeId: userId,
        subject,
        topics: sessionRequest.topics,
        dotPoints: sessionRequest.dotPoints,
        difficulty: sessionRequest.difficulty,
        scheduledTime: sessionRequest.preferredTime,
        duration: sessionRequest.duration,
        objectives: sessionRequest.objectives
      };

      const response = await fetch('/api/peer-tutoring/sessions/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Tutoring session requested successfully!');
        setSelectedTutor(null);
        setActiveTab('my-sessions');
        fetchUserSessions();
      } else {
        alert(data.message || 'Failed to request session');
      }
    } catch (error) {
      console.error('Error requesting session:', error);
      alert('Error requesting tutoring session');
    } finally {
      setLoading(false);
    }
  };

  const renderTutorCard = (tutor) => (
    <motion.div
      key={tutor.userId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {tutor.displayName?.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{tutor.displayName}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.floor(tutor.stats.averageRating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ⭐
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {tutor.stats.averageRating.toFixed(1)} ({tutor.stats.totalSessions} sessions)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-blue-600">
            {Math.round(tutor.matchScore * 100)}% match
          </div>
          {tutor.verification?.isVerified && (
            <div className="flex items-center text-green-600 text-xs mt-1">
              <span className="mr-1">✓</span>
              Verified
            </div>
          )}
        </div>
      </div>

      {/* Expertise Tags */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-2">Expertise:</p>
        <div className="flex flex-wrap gap-1">
          {tutor.expertise[0]?.dotPoints?.slice(0, 3).map((dotPoint, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {dotPoint}
            </span>
          ))}
          {tutor.expertise[0]?.dotPoints?.length > 3 && (
            <span className="text-xs text-gray-500">+{tutor.expertise[0].dotPoints.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Badges */}
      {tutor.verification?.badges && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tutor.verification.badges.map((badge, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-full ${
              badge === 'expert' ? 'bg-purple-100 text-purple-800' :
              badge === 'top_rated' ? 'bg-yellow-100 text-yellow-800' :
              badge === 'helpful' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {badge.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
        <div>Success Rate: {Math.round(tutor.stats.successRate * 100)}%</div>
        <div>Response Time: Fast</div>
      </div>

      <button
        onClick={() => setSelectedTutor(tutor)}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Request Session
      </button>
    </motion.div>
  );

  const renderSessionCard = (session) => (
    <motion.div
      key={session.sessionId}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg p-4 border border-gray-200 mb-3"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">
            {session.tutor.userId === userId ? `Tutoring ${session.tutee.displayName}` : `Session with ${session.tutor.displayName}`}
          </h4>
          <p className="text-sm text-gray-600">{session.subject} • {session.difficulty}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          session.status === 'active' ? 'bg-green-100 text-green-800' :
          session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {session.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <p>📅 {new Date(session.scheduledTime).toLocaleString()}</p>
        <p>⏱️ {session.duration} minutes</p>
        {session.topics && session.topics.length > 0 && (
          <p>📝 Topics: {session.topics.join(', ')}</p>
        )}
      </div>

      {session.status === 'completed' && session.feedback?.tuteeFeedback && (
        <div className="bg-gray-50 p-2 rounded text-sm">
          <p className="text-gray-600">Your Rating:</p>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`${i < session.feedback.tuteeFeedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-gray-600">Helpfulness: {session.feedback.tuteeFeedback.helpfulness}/5</span>
          </div>
        </div>
      )}

      {session.status === 'scheduled' && (
        <div className="flex space-x-2">
          <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors">
            Join Session
          </button>
          <button className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors">
            Reschedule
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderSessionRequestModal = () => (
    <AnimatePresence>
      {selectedTutor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTutor(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request Session with {selectedTutor.displayName}</h3>
              <button
                onClick={() => setSelectedTutor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topics to Cover
                </label>
                <input
                  type="text"
                  placeholder="e.g., Meiosis, Inheritance patterns"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSessionRequest({
                    ...sessionRequest,
                    topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={sessionRequest.difficulty}
                  onChange={(e) => setSessionRequest({...sessionRequest, difficulty: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSessionRequest({...sessionRequest, preferredTime: e.target.value})}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={sessionRequest.duration}
                  onChange={(e) => setSessionRequest({...sessionRequest, duration: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Objectives
                </label>
                <textarea
                  placeholder="What specific goals do you want to achieve in this session?"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setSessionRequest({
                    ...sessionRequest,
                    objectives: e.target.value.split('\n').filter(Boolean)
                  })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => requestTutoringSession(selectedTutor.userId)}
                  disabled={loading || !sessionRequest.preferredTime}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Requesting...' : 'Request Session'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Peer Tutoring</h2>
            <p className="text-gray-600">Get help from expert students or become a tutor yourself</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Become a Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          {[
            { id: 'find-tutor', label: 'Find a Tutor', icon: '🔍' },
            { id: 'my-sessions', label: 'My Sessions', icon: '📅' },
            { id: 'become-tutor', label: 'Tutor Dashboard', icon: '👨‍🏫' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'find-tutor' && (
          <motion.div
            key="find-tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="h-20 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTutors.map(renderTutorCard)}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'my-sessions' && (
          <motion.div
            key="my-sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {userSessions.length > 0 ? (
                  userSessions.map(renderSessionCard)
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No sessions yet</h3>
                    <p className="text-gray-600 mb-4">Book your first tutoring session to get started!</p>
                    <button
                      onClick={() => setActiveTab('find-tutor')}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Find a Tutor
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'become-tutor' && (
          <motion.div
            key="become-tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Become a Tutor</h3>
            <p className="text-gray-600 mb-6">Share your knowledge and help fellow students while earning recognition</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-semibold">Share Knowledge</h4>
                <p className="text-sm text-gray-600">Help students understand difficult concepts</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <h4 className="font-semibold">Build Reputation</h4>
                <p className="text-sm text-gray-600">Earn ratings and badges for your expertise</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold">Flexible Schedule</h4>
                <p className="text-sm text-gray-600">Set your own availability and preferences</p>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Apply to Become a Tutor
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Request Modal */}
      {renderSessionRequestModal()}
    </div>
  );
};

export default PeerTutoring;