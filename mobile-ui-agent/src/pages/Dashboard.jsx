import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import ProgressRing from '../components/ProgressRing';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import PullToRefresh from '../components/PullToRefresh';
import GamingNavigation from '../components/GamingNavigation';
import CharacterProgression from '../components/CharacterProgression';
import StudentAnalytics from '../components/StudentAnalytics';
import ModernAnalyticsDashboard from '../components/ModernAnalyticsDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import AchievementSystem from '../components/AchievementSystem';
import LeaderboardSystem from '../components/LeaderboardSystem';
import MultiplayerQuizBattle from '../components/MultiplayerQuizBattle';
import BossBattleInterface from '../components/BossBattleInterface';
import MiniGameInterface from '../components/MiniGameInterface';
import XPDisplay from '../components/XPDisplay';
import StreakDisplay from '../components/StreakDisplay';
import { useGamificationContext } from '../context/GamificationContext';

// Import quiz components directly to avoid dynamic import issues - CACHE BREAKER v2
import PathwayQuizSetup from './PathwayQuizSetup.jsx';
import Quiz from './Quiz.jsx';
import QuizResults from './QuizResults.jsx';
import QuizSetup from './QuizSetup.jsx';
import Module5Pathway from '../components/Module5Pathway.jsx';
import Module6Pathway from '../components/Module6Pathway.jsx';
import Module5AdminDashboard from '../components/Module5AdminDashboard.jsx';
import LoadingState from '../components/feedback/LoadingState';
import ErrorState from '../components/feedback/ErrorState';
import BiologyHub from '../components/BiologyHub.jsx';
import ChemistryHub from '../components/ChemistryHub.jsx';
import ChemistryModulePathway from '../components/ChemistryModulePathway.jsx';
import ChemistryModule5Pathway from '../components/ChemistryModule5Pathway.jsx';
import NavigationContainer from '../components/NavigationContainer.jsx';
import ProgressDashboard from '../components/ProgressDashboard.jsx';
import QuizMode from '../components/QuizMode.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import OfflineNotice from '../components/feedback/OfflineNotice';

// Quiz loading component
const QuizLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-blue-200 rounded w-32 mx-auto mb-2"></div>
        <div className="h-3 bg-blue-100 rounded w-24 mx-auto"></div>
      </div>
      <p className="text-blue-600 font-medium mt-4">Preparing your quiz...</p>
    </div>
  </div>
);

const DashboardFixed = ({
  PathwayQuizSetupComponent = PathwayQuizSetup,
  QuizSetupComponent = QuizSetup,
  QuizComponent = Quiz,
  QuizResultsComponent = QuizResults,
}) => {
  console.log(' DashboardFixed component loaded - cache should be cleared now!');
  const { user, logout } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, subject, quiz-setup, quiz, quiz-results, quiz-mode, analytics, progress, character, boss-battles, mini-games, module5-pathway, module6-pathway, chemistry-module5-pathway, chemistry-module5, chemistry-module6, chemistry-module7, chemistry-module8, module5-admin, teacher, achievements, leaderboard, multiplayer
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [studentGoals, setStudentGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Use custom hook for user data
  const {
    userData,
    achievements,
    subjects,
    loading,
    error,
    refreshData,
  } = useUserData();

  // Use gamification context
  const {
    currentXP,
    currentLevel,
    xpToNextLevel,
    currentStreak,
    longestStreak,
    userProgress,
    streak
  } = useGamificationContext();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = user?.name?.split(' ')[0] || 'Student';

    if (hour < 12) return `Good morning, ${name}! Let's make today count.`;
    if (hour < 17) return `Good afternoon, ${name}! Keep the momentum going.`;
    return `Good evening, ${name}! You're finishing strong.`;
  };

  const getMotivationMessage = () => {
    const messages = [
      "You're crushing it! Keep the momentum going!",
      'Every question brings you closer to your HSC goals.',
      'Your future self will thank you for studying today.',
      'Small progress each day leads to big results.',
      "You've got this! One topic at a time!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Loading state
  if (loading) {
    return (
      <LoadingState
        title="Loading your progress"
        message="Hang tight while we personalize your dashboard experience."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your dashboard"
        message="Please check your connection and try again."
        actionLabel="Reload"
        onRetry={refreshData}
        details={error?.message}
      />
    );
  }
  // Quiz flow handlers
  const handleStartQuiz = (config) => {
    setQuizConfig(config);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentView('quiz-results');
  };

  const handleRetakeQuiz = () => {
    setCurrentView('quiz-setup');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSubject(null);
    setQuizConfig(null);
    setQuizResults(null);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    if (subject?.id === 'biology') {
      setCurrentView('biology-hub'); // Route to BiologyHub for rich Module 5 content
    } else if (subject?.id === 'chemistry') {
      setCurrentView('chemistry-hub'); // Route to ChemistryHub for consistent formatting
    } else {
      setCurrentView('subject');
    }
  };

  const getModuleDescription = (moduleId, subjectId) => {
    const descriptions = {
      biology: {
        5: 'DNA, genes, inheritance patterns, and genetic variation',
        6: 'Mutations, biotechnology, genetic engineering',
        7: 'Pathogens, immune system, and disease prevention',
        8: 'Cancer, genetic disorders, and lifestyle diseases'
      },
      chemistry: {
        5: 'Chemical equilibrium, acids, bases, and buffer systems',
        6: 'Advanced acid-base chemistry and analytical techniques',
        7: 'Carbon compounds, functional groups, and reactions',
        8: 'Industrial chemistry, materials, and environmental applications'
      }
    };
    return descriptions[subjectId]?.[moduleId] || 'HSC Module content';
  };

  const handleQuizSetup = () => {
    if (selectedSubject) {
      setQuizConfig({
        subject: selectedSubject,
        module: null, // Will be selected in quiz setup
        difficulty: null,
        length: 10,
        timer: true
      });
    }
    setCurrentView('quiz-setup');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleGoalCreate = (goal) => {
    setStudentGoals([...studentGoals, goal]);
  };

  const handleGoalUpdate = (goalId, updates) => {
    setStudentGoals(studentGoals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  // Student data (fallback when API unavailable)
  const studentData = {
    averageScore: 78,
    biologyScore: 82,
    chemistryScore: 74,
    learningVelocity: 85,
    scoreHistory: [65, 70, 75, 78, 80, 78],
    confidenceBySubject: [
      { name: 'Biology Module 5', confidence: 85 },
      { name: 'Biology Module 6', confidence: 72 },
      { name: 'Chemistry Module 5', confidence: 68 },
      { name: 'Chemistry Module 6', confidence: 79 }
    ]
  };

  const studyPatterns = {
    timePreference: 'morning',
    optimalSessionLength: 25,
    averageBreak: 7,
    currentStreak: userData?.streak || 0,
    optimalTimeBoost: 15,
    weeklyPattern: [
      { studied: true }, { studied: true }, { studied: false },
      { studied: true }, { studied: true }, { studied: false }, { studied: true }
    ]
  };

  const insights = {
    weakAreas: [
      { topic: 'Organic Chemistry', score: 65 },
      { topic: 'Cell Division', score: 58 }
    ],
    recentAchievements: [
      { id: 1, icon: '', name: 'Week Streak', description: 'Studied 7 days in a row!' },
      { id: 2, icon: '', name: 'Perfect Score', description: 'Got 100% on Biology quiz!' }
    ]
  };

  const characterData = {
    level: userData?.level || 5,
    xp: userData?.xp || 1250,
    xpToNext: 1500,
    biologyLevel: 6,
    chemistryLevel: 4,
    biologyXP: 1800,
    chemistryXP: 1200,
    achievements: achievements || []
  };

  // Render different views based on current state  
  if (currentView === 'quiz-setup') {
    const QuizSetupView = PathwayQuizSetupComponent || QuizSetupComponent;
    console.log(' Rendering quiz setup view with error boundary protection');
    return (
      <div key="quiz-setup-wrapper">
        <QuizSetupView
          subject={selectedSubject}
          onBack={() => setCurrentView('subject')}
          onStartQuiz={handleStartQuiz}
        />
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <QuizComponent
        quizConfig={quizConfig}
        onQuizComplete={handleQuizComplete}
        onExit={() => setCurrentView('subject')}
      />
    );
  }

  if (currentView === 'quiz-results') {
    return (
      <QuizResultsComponent
        quizData={quizResults}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToDashboard={handleBackToDashboard}
        onReviewAnswers={() => console.log('Review answers')}
      />
    );
  }

  if (currentView === 'biology-hub') {
    return (
      <BiologyHub
        onBack={() => setCurrentView('dashboard')}
        onModuleSelect={(moduleType) => {
          if (moduleType === 'module5') {
            setCurrentView('module5-pathway');
          } else if (moduleType === 'module6') {
            setCurrentView('module6-pathway');
          }
        }}
      />
    );
  }

  if (currentView === 'chemistry-hub') {
    return (
      <ChemistryHub
        onBack={() => setCurrentView('dashboard')}
        onModuleSelect={(moduleType) => {
          if (moduleType === 'module5') {
            setCurrentView('chemistry-module5-pathway');
          } else if (moduleType === 'module6') {
            setCurrentView('chemistry-module6');
          } else if (moduleType === 'module7') {
            setCurrentView('chemistry-module7');
          } else if (moduleType === 'module8') {
            setCurrentView('chemistry-module8');
          }
        }}
      />
    );
  }

  if (currentView === 'module5-pathway') {
    return (
      <Module5Pathway
        onBack={() => setCurrentView('biology-hub')}
      />
    );
  }

  if (currentView === 'module6-pathway') {
    return (
      <Module6Pathway
        onBack={() => setCurrentView('biology-hub')}
      />
    );
  }

  // Chemistry Module Pathways
  if (currentView === 'chemistry-module5-pathway') {
    return (
      <ChemistryModule5Pathway
        onBack={() => setCurrentView('chemistry-hub')}
      />
    );
  }

  if (currentView === 'chemistry-module5') {
    return (
      <ChemistryModulePathway
        moduleId="module5"
        onBack={() => setCurrentView('chemistry-hub')}
      />
    );
  }

  if (currentView === 'chemistry-module6') {
    return (
      <ChemistryModulePathway
        moduleId="module6"
        onBack={() => setCurrentView('chemistry-hub')}
      />
    );
  }

  if (currentView === 'chemistry-module7') {
    return (
      <ChemistryModulePathway
        moduleId="module7"
        onBack={() => setCurrentView('chemistry-hub')}
      />
    );
  }

  if (currentView === 'chemistry-module8') {
    return (
      <ChemistryModulePathway
        moduleId="module8"
        onBack={() => setCurrentView('chemistry-hub')}
      />
    );
  }

  if (currentView === 'module5-admin') {
    return (
      <Module5AdminDashboard
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'subject') {
    return (
      <SubjectView
        subject={selectedSubject}
        onBack={() => setCurrentView('dashboard')}
        onStartQuiz={handleQuizSetup}
        onModuleSelect={(module) => {
          // Map to QuizSetup expected format
          const quizSetupModule = {
            id: module.id,
            name: `Module ${module.id}`,
            title: module.name.replace(`Module ${module.id}: `, ''),
            description: getModuleDescription(module.id, selectedSubject.id),
            difficulty: 'Medium'
          };
          
          setQuizConfig({
            subject: selectedSubject,
            module: quizSetupModule,
            difficulty: { id: 'medium', name: 'Medium' },
            length: 10,
            timer: true
          });
          setCurrentView('quiz-setup');
        }}
      />
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen">
        <ModernAnalyticsDashboard onBack={() => setCurrentView('dashboard')} />
      </div>
    );
  }

  if (currentView === 'character') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
        <GamingNavigation
          currentView={currentView}
          onNavigate={handleNavigate}
          userLevel={userData?.level || 1}
          userXP={userData?.xp || 0}
          userXPToNext={userData?.xpToNext || 100}
          notifications={notifications}
          dailyStreak={userData?.streak || 0}
        />
        <div className="p-4">
          <CharacterProgression
            character={characterData}
            level={characterData.level}
            xp={characterData.xp}
            xpToNext={characterData.xpToNext}
            biologyLevel={characterData.biologyLevel}
            chemistryLevel={characterData.chemistryLevel}
            biologyXP={characterData.biologyXP}
            chemistryXP={characterData.chemistryXP}
            achievements={characterData.achievements}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'boss-battles') {
    return (
      <BossBattleInterface
        boss={{ name: 'Module 5 Biology Boss', maxHealth: 100 }}
        studentHealth={85}
        bossHealth={60}
        question={{
          text: 'Which organelle is responsible for cellular respiration?',
          answers: [
            { text: 'Nucleus', correct: false },
            { text: 'Mitochondria', correct: true },
            { text: 'Ribosome', correct: false },
            { text: 'Endoplasmic Reticulum', correct: false }
          ]
        }}
        onAnswerSelect={(index) => console.log('Answer selected:', index)}
        onEscape={() => setCurrentView('dashboard')}
        gameState="battle"
        comboCount={2}
        timeLeft={25}
      />
    );
  }

  if (currentView === 'mini-games') {
    return (
      <MiniGameInterface
        gameType="speed-quiz"
        gameData={{
          questions: [
            {
              text: 'What is the powerhouse of the cell?',
              answers: [
                { text: 'Nucleus', correct: false },
                { text: 'Mitochondria', correct: true },
                { text: 'Ribosome', correct: false },
                { text: 'Vacuole', correct: false }
              ]
            }
          ]
        }}
        onGameComplete={(results) => {
          console.log('Game completed:', results);
          setCurrentView('dashboard');
        }}
        onGameExit={() => setCurrentView('dashboard')}
        timeLimit={60}
      />
    );
  }

  if (currentView === 'teacher') {
    return (
      <TeacherDashboard
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'achievements') {
    return (
      <AchievementSystem
        onClose={() => setCurrentView('dashboard')}
        userProgress={userData}
      />
    );
  }

  if (currentView === 'leaderboard') {
    return (
      <LeaderboardSystem
        onClose={() => setCurrentView('dashboard')}
        currentUser={user}
      />
    );
  }

  if (currentView === 'multiplayer') {
    return (
      <MultiplayerQuizBattle
        onExit={() => setCurrentView('dashboard')}
        currentUser={user}
      />
    );
  }

  if (currentView === 'enhanced-learn') {
    return <NavigationContainer />;
  }

  if (currentView === 'progress') {
    return <ProgressDashboard onClose={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'quiz-mode') {
    return <QuizMode onClose={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
      {/* Gaming Navigation */}
      <GamingNavigation
        currentView={currentView}
        onNavigate={handleNavigate}
        userLevel={userData?.level || 1}
        userXP={userData?.xp || 0}
        userXPToNext={userData?.xpToNext || 100}
        notifications={notifications}
        dailyStreak={userData?.streak || 0}
      />

      <PullToRefresh onRefresh={refreshData}>
        <div className="px-4 py-6 max-w-md mx-auto space-y-6">
          {!isOnline && (
            <OfflineNotice message="You&#39;re offline. Recently viewed content is still available." />
          )}
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}
          </h1>
          <p className="text-gray-600 text-sm">
            {getMotivationMessage()}
          </p>
        </motion.div>

        {/* Daily Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="gaming-card p-6 text-center"
        >
          <ProgressRing
            progress={((userData?.dailyCompleted || 0) / (userData?.dailyGoal || 5)) * 100}
            size={100}
            color="#10b981"
          >
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{userData?.dailyCompleted || 0}</div>
              <div className="text-xs text-gray-600">of {userData?.dailyGoal || 5}</div>
            </div>
          </ProgressRing>
          <h3 className="font-semibold text-gray-900 mt-3">Daily Goal</h3>
          <p className="text-sm text-gray-600">Questions completed today</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            }
            title="Study Streak"
            value={`${userData?.streak || 0} days`}
            subtitle="Keep it going! "
            color="warning"
            delay={0.2}
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95z"/>
                <path d="M12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
              </svg>
            }
            title="Average Score"
            value={`${userData?.averageScore || 0}%`}
            subtitle="Excellent work! "
            color="success"
            delay={0.3}
          />
        </div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gaming-card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Level Progress</h3>
            <span className="text-sm text-gray-600">Level {(userData?.level || 1) + 1}</span>
          </div>
          <ProgressBar
            progress={((userData?.xp || 0) / (userData?.xpToNext || 100)) * 100}
            color="#8b5cf6"
            label={`${userData?.xp || 0} / ${userData?.xpToNext || 100} XP`}
            showPercentage={false}
          />
        </motion.div>

        {/* Subject Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Choose Your Subject</h2>
          {(subjects || []).map((subject, index) => (
            <motion.button
              key={subject?.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubjectSelect(subject)}
              className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${subject?.color || 'from-gray-400 to-gray-500'} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {subject?.icon || ''}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 text-lg">{String(subject?.name) || 'Subject'}</h3>
                  <p className="text-gray-600 text-sm mb-2">Last studied {String(subject?.lastStudied) || 'Never'}</p>
                  <ProgressBar
                    progress={Number(subject?.progress) || 0}
                    height={6}
                    color={subject?.id === 'biology' ? '#10b981' : '#8b5cf6'}
                    showPercentage={false}
                  />
                  <p className="text-xs text-gray-500 mt-1">{Math.round(Number(subject?.progress) || 0)}% complete</p>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          {/* Enhanced Learn Mode - NEW! */}
          <button
            onClick={() => setCurrentView('enhanced-learn')}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-5 px-6 rounded-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🚀</span>
              <div className="text-left">
                <div className="text-lg">Enhanced Learn Mode</div>
                <div className="text-xs opacity-90">All Biology & Chemistry Modules</div>
              </div>
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                NEW!
              </span>
            </div>
          </button>

          {/* Quiz Mode Button - Standalone */}
          <button
            onClick={() => setCurrentView('quiz-mode')}
            className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-5 px-6 rounded-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <div className="text-lg">Quiz Mode</div>
                <div className="text-xs opacity-90">Mix topics, timed practice</div>
              </div>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentView('achievements')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-1"></div>
              <div className="text-sm">Achievements</div>
            </button>
            <button 
              onClick={() => setCurrentView('leaderboard')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 px-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-1"></div>
              <div className="text-sm">Leaderboard</div>
            </button>
            <button 
              onClick={() => setCurrentView('multiplayer')}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-4 px-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-1"></div>
              <div className="text-sm">Battle Quiz</div>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-4 px-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm">Analytics</div>
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-4 px-4 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-1">📈</div>
              <div className="text-sm">Progress</div>
            </button>
          </div>

          {/* Admin Access (hidden for most users) */}
          <div className="mt-3 space-y-3">
            <button
              onClick={() => setCurrentView('module5-admin')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all text-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg"></span>
                <span>Module 5 Admin Dashboard</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  ADMIN
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setCurrentView('teacher')}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all text-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg"></span>
                <span>Teacher Dashboard</span>
                <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">
                  TEACHER
                </span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Recent Achievements</h3>
          <div className="flex space-x-3 overflow-x-auto">
            {(achievements || []).map((achievement, index) => (
              <div
                key={achievement.id}
                className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-xs font-medium border-2 ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 text-white'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                <div className="text-lg">{achievement.icon}</div>
                <div className="text-xs mt-1 text-center leading-tight">{achievement.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom spacing for mobile */}
        <div className="h-8" />
        </div>
      </PullToRefresh>
    </div>
  );
};

// Subject Detail View Component
const SubjectView = ({ subject, onBack, onStartQuiz, onModuleSelect }) => {
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
            <h1 className="text-xl font-bold text-gray-900">{String(subject.name || 'Subject')}</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 text-center"
        >
          <ProgressRing
            progress={Number(subject.progress) || 0}
            size={120}
            color={subject.id === 'biology' ? '#10b981' : '#8b5cf6'}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{Math.round(Number(subject.progress) || 0)}%</div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </ProgressRing>
          <h3 className="font-bold text-gray-900 mt-4 text-lg">{String(subject.name || 'Subject')} Progress</h3>
          <p className="text-sm text-gray-600">Next: {String(subject.nextTopic?.name) || 'No more topics'}</p>
        </motion.div>

        {/* Modules */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">HSC Modules</h2>
          {(subject.modules || []).map((module, index) => (
            <motion.div
              key={module.id || module.name || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onModuleSelect && onModuleSelect(module)}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 cursor-pointer hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{String(module.name || 'Module')}</h3>
                <span className="text-sm text-gray-600">
                  {Number(module.topicsCount) || 0} topics
                </span>
              </div>
              <ProgressBar
                progress={Number(module.progress) || 0}
                color={subject.id === 'biology' ? '#10b981' : '#8b5cf6'}
                height={8}
              />
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onStartQuiz}
            className={`w-full bg-gradient-to-r ${subject.color} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Take {String(subject.name || 'Subject')} Quiz</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => alert('Study Notes feature coming soon!')}
            className="w-full bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl hover:bg-white/90 transition-all"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Study Notes</span>
            </div>
          </motion.button>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default DashboardFixed;











