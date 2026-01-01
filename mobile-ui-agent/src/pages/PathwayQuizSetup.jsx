import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressTracking } from '../hooks/useProgressTracking';
import LoadingState from '../components/feedback/LoadingState';
import ErrorState from '../components/feedback/ErrorState';
import { getUnlockedTopics, getTopicById } from '../data/learningPathways';

const PathwayQuizSetup = ({ subject, onBack, onStartQuiz }) => {
  const { userProgress, getTopicDetails, isTopicUnlocked } = useProgressTracking();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLength, setSelectedLength] = useState(10);
  const [showTimer, setShowTimer] = useState(true);
  const [unlockedTopics, setUnlockedTopics] = useState([]);
  const [topicsReady, setTopicsReady] = useState(false);

  const subjectProgress = subject ? userProgress?.[subject.id] : null;
  const completedTopics = subjectProgress?.completedTopics || [];

  useEffect(() => {
    if (!subject || !userProgress) {
      return;
    }

    setTopicsReady(false);

    const completed = subjectProgress?.completedTopics || [];
    const topics = getUnlockedTopics(subject.id, completed);
    setUnlockedTopics(topics);

    // Auto-select the next recommended topic
    const nextTopic = topics.find(topic => !completed.includes(topic.id));
    if (nextTopic) {
      setSelectedTopic(nextTopic);
    }

    setTopicsReady(true);
  }, [subject, userProgress, subjectProgress]);


  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStartQuiz = () => {
    if (!selectedTopic) return;

    const quizConfig = {
      subject: subject,
      topic: selectedTopic,
      length: Math.min(selectedLength, selectedTopic.questions), // Don't exceed available questions
      timer: showTimer,
      difficulty: selectedTopic.difficulty
    };

    onStartQuiz(quizConfig);
  };


  const getCompletionStatus = (topic) => {
    const isCompleted = completedTopics.includes(topic.id);
    const isUnlocked = subject ? isTopicUnlocked(subject.id, topic.id) : false;

    if (isCompleted) return { status: 'completed', icon: '', color: 'text-green-600' };
    if (isUnlocked) return { status: 'available', icon: '', color: 'text-blue-600' };
    return { status: 'locked', icon: '', color: 'text-gray-400' };
  };

  if (!subject) {
    return (
      <ErrorState
        title="Select a subject first"
        message="Choose a subject from your dashboard to set up a quiz."
        actionLabel="Back to dashboard"
        onRetry={onBack}
      />
    );
  }

  if (!userProgress) {
    return (
      <LoadingState
        title={subject ? `Preparing ${subject.name} quiz` : 'Loading your progress'}
        message="Gathering your unlocked topics..."
      />
    );
  }

  if (!topicsReady) {
    return (
      <LoadingState
        title={subject ? `Preparing ${subject.name} quiz` : 'Loading your progress'}
        message="Just a moment while we load your learning path."
      />
    );
  }

  if (!unlockedTopics.length) {
    return (
      <ErrorState
        title="No topics unlocked yet"
        message="Work through the previous lessons to unlock quizzes for this subject."
        actionLabel="Back to dashboard"
        onRetry={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${subject.color} rounded-full flex items-center justify-center text-white text-lg`}>
              {subject.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{subject.name} Quiz</h1>
              <p className="text-sm text-gray-600">Choose your learning path</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Learning Path Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
        >
          <h2 className="font-semibold text-gray-900 mb-3">Your Learning Journey</h2>
          <div className="text-sm text-gray-600 mb-2">
            {unlockedTopics.length} topics unlocked  {userProgress[subject.id]?.completedTopics.length || 0} completed
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${subject.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${(userProgress[subject.id]?.completedTopics.length || 0) / 24 * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Topic Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Available Topics</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {unlockedTopics.map((topic, index) => {
              const completion = getCompletionStatus(topic);
              const isSelected = selectedTopic?.id === topic.id;
              
              return (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-200 bg-white/50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={completion.color}>{completion.icon}</span>
                        <span className="font-semibold text-gray-900">Level {topic.level}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900">{topic.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span> {topic.questions} questions</span>
                        <span> {topic.estimatedTime}</span>
                        <span> {topic.xpReward} XP</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {unlockedTopics.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">No Topics Available</h3>
              <p className="text-gray-600">Complete previous topics to unlock new content!</p>
            </div>
          )}
        </motion.div>

        {/* Quiz Configuration */}
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 space-y-4"
          >
            <h3 className="font-semibold text-gray-900">Quiz Settings</h3>
            
            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions: {selectedLength}
              </label>
              <input
                type="range"
                min="5"
                max={Math.min(selectedTopic.questions, 20)}
                value={selectedLength}
                onChange={(e) => setSelectedLength(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>Max: {Math.min(selectedTopic.questions, 20)}</span>
              </div>
            </div>

            {/* Timer Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Timer</label>
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showTimer ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showTimer ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Prerequisites Check */}
            {selectedTopic.prerequisites.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-600">Prerequisites: </span>
                <span className="text-green-600"> All completed</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Start Quiz Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleStartQuiz}
          disabled={!selectedTopic}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all ${
            selectedTopic
              ? `bg-gradient-to-r ${subject.color} hover:shadow-xl transform hover:scale-105`
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedTopic ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start {selectedTopic.name} Quiz</span>
            </div>
          ) : (
            'Select a Topic to Continue'
          )}
        </motion.button>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default PathwayQuizSetup;
