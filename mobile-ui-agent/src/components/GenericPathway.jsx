import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionService from '../services/questionService';
import contentService from '../services/contentService';
import progressSyncService from '../services/progressSyncService';
import DotPointDetail from './DotPointDetail';
import DotPointDetailTabs from './DotPointDetailTabs';
import ErrorBoundary from './ErrorBoundary';
import RoadmapPathway from './RoadmapPathway';
import MiniBossBattle from './MiniBossBattle';
import BossBattleInterface from './BossBattleInterface';
import useBattleProgress from '../hooks/useBattleProgress';

const GenericPathway = ({ 
  subject,           // 'biology' | 'chemistry'
  moduleId,          // 'module-5' | 'module-6' etc.
  pathwayData,       // Module pathway data structure
  progressHook,      // Custom progress hook for the module
  QuickQuizComponent,// Subject-specific quick quiz component
  LongResponseComponent, // Subject-specific long response component
  onBack,
  colorScheme = { // Default color scheme, can be overridden
    primary: 'purple',
    secondary: 'indigo',
    accent: 'blue'
  }
}) => {
  const {
    pathwayProgress,
    loading,
    trackContentAccess,
    submitQuizAttempt,
    isContentAccessible,
    hasAccessedAllContent,
    isQuizAccessible,
    getDotPointStatus,
    getPathwayStats
  } = progressHook();

  // Battle progress hook - extract module number from moduleId (e.g., 'module-5' -> '5')
  const moduleNumber = moduleId.replace('module-', '');
  const {
    battleProgress,
    loading: battleLoading,
    defeatMiniBoss,
    defeatBoss,
    getMiniBossConfig,
    getBossConfig
  } = useBattleProgress(subject, moduleNumber);

  const [currentView, setCurrentView] = useState('pathway');
  const [selectedDotPoint, setSelectedDotPoint] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [pathwayStats, setPathwayStats] = useState(null);
  const [battleQuestions, setBattleQuestions] = useState([]);
  const [selectedBattle, setSelectedBattle] = useState(null);

  // View mode: 'grid' or 'roadmap'
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem(`${subject}-${moduleId}-viewMode`);
    return saved || 'roadmap'; // Default to roadmap view
  });

  // Subject-specific configuration
  const subjectConfig = {
    biology: {
      icon: 'BIO',
      title: 'Biology',
      gradient: 'from-green-500 to-blue-500'
    },
    chemistry: {
      icon: 'CHEM',
      title: 'Chemistry', 
      gradient: 'from-purple-500 to-indigo-500'
    }
  };

  const config = subjectConfig[subject.toLowerCase()] || subjectConfig.biology;

  useEffect(() => {
    if (pathwayProgress) {
      setPathwayStats(getPathwayStats());
    }
  }, [pathwayProgress, getPathwayStats]);

  // Persist view mode preference
  useEffect(() => {
    localStorage.setItem(`${subject}-${moduleId}-viewMode`, viewMode);
  }, [viewMode, subject, moduleId]);

  // Toggle view mode
  const handleViewModeToggle = () => {
    setViewMode(prev => prev === 'grid' ? 'roadmap' : 'grid');
  };

  // Handle navigation from roadmap
  const handleRoadmapNavigate = async (viewType, nodeId) => {
    if (viewType === 'dotpoint-detail') {
      setSelectedDotPoint(nodeId);
      setCurrentView('dotpoint-detail');
    } else if (viewType === 'mini-boss') {
      // Load Mini Boss battle
      const miniBoss = getMiniBossConfig(nodeId);
      if (miniBoss) {
        setSelectedBattle(miniBoss);

        try {
          // Fetch Mini Boss questions from Google Sheets
          const questions = await questionService.getMiniBossQuestions(
            subject,
            moduleId,
            miniBoss.iqId
          );
          setBattleQuestions(questions);
          setCurrentView('mini-boss');
        } catch (error) {
          console.error('Failed to load Mini Boss questions:', error);
          alert('Failed to load battle questions. Please try again.');
          setSelectedBattle(null);
        }
      }
    } else if (viewType === 'boss-battle') {
      // Load Boss Battle
      const boss = getBossConfig(nodeId);
      if (boss) {
        setSelectedBattle(boss);

        try {
          // Fetch Boss Battle questions from Google Sheets
          const questions = await questionService.getBossBattleQuestions(
            subject,
            moduleId
          );
          setBattleQuestions(questions);
          setCurrentView('boss-battle');
        } catch (error) {
          console.error('Failed to load Boss Battle questions:', error);
          alert('Failed to load battle questions. Please try again.');
          setSelectedBattle(null);
        }
      }
    }
  };

  const handleContentAccess = async (dotPointId, contentType, contentId) => {
    // Track locally first
    const result = trackContentAccess(dotPointId, contentType, contentId);
    
    // Sync to backend services
    try {
      await contentService.trackContentAccess(
        subject, 
        moduleId, 
        dotPointId, 
        contentType, 
        contentId
      );
      
      await progressSyncService.syncContentAccess(
        subject, 
        moduleId, 
        dotPointId, 
        contentType, 
        contentId
      );
    } catch (error) {
      console.warn('Content access sync failed:', error);
    }
    
    if (result?.allContentAccessed) {
      setTimeout(() => {
        alert(`${config.icon} All content accessed for ${dotPointId}! Quizzes are now unlocked.`);
      }, 1000);
    }
    
    setCurrentView('pathway');
  };

  const handleQuizComplete = async (results) => {
    // Submit locally first
    const submissionResult = submitQuizAttempt(
      results.dotPointId,
      results.quizType,
      results.score,
      results.totalQuestions || results.totalMarks,
      results.timeSpent
    );

    // Sync to backend services
    try {
      await progressSyncService.syncQuizResults(
        subject,
        moduleId,
        results.dotPointId,
        results
      );
    } catch (error) {
      console.warn('Quiz results sync failed:', error);
    }


    // Return to pathway view
    setTimeout(() => {
      setCurrentView('pathway');
      setSelectedDotPoint(null);
    }, 100);
  };

  // Handle Mini Boss battle completion
  const handleMiniBossComplete = async (battleResults) => {
    if (battleResults.victory && selectedBattle) {
      // Mark Mini Boss as defeated
      const result = defeatMiniBoss(selectedBattle.id, {
        xpEarned: selectedBattle.rewards.xp,
        badge: selectedBattle.rewards.badge
      });

      // Show congratulations
      alert(`🎉 Victory! You defeated ${selectedBattle.name}!\n\n+${result.xpEarned} XP\nBadge Earned: ${result.badge}`);
    }

    // Return to pathway
    setTimeout(() => {
      setCurrentView('pathway');
      setSelectedBattle(null);
      setBattleQuestions([]);
    }, 100);
  };

  // Handle Boss Battle completion
  const handleBossComplete = async (battleResults) => {
    if (battleResults.victory && selectedBattle) {
      // Mark Boss as defeated
      const result = defeatBoss(selectedBattle.id, {
        xpEarned: selectedBattle.rewards.xp,
        badge: selectedBattle.rewards.badge
      });

      // Show epic congratulations
      alert(`🏆 LEGENDARY VICTORY! You defeated ${selectedBattle.name}!\n\n+${result.xpEarned} XP\nBadge Earned: ${result.badge}\n\nModule Complete!`);
    }

    // Return to pathway
    setTimeout(() => {
      setCurrentView('pathway');
      setSelectedBattle(null);
      setBattleQuestions([]);
    }, 100);
  };

  const getDotPointData = (dotPointId) => {
    for (const iq of Object.values(pathwayData.inquiryQuestions)) {
      for (const dotPoint of Object.values(iq.dotPoints)) {
        if (dotPoint.id === dotPointId) {
          return dotPoint;
        }
      }
    }
    return null;
  };

  const renderContentButton = (dotPointId, contentType, content) => {
    const isAccessible = isContentAccessible(dotPointId);
    const isAccessed = pathwayProgress?.contentAccess?.[dotPointId]?.[contentType] || false;

    const contentIcons = {
      podcast: 'Audio',
      video: 'Video',
      slides: 'Slides'
    };

    const contentTypeNames = {
      podcast: 'Podcast',
      video: 'Video',
      slides: 'Slides'
    };

    return (
      <button
        key={contentType}
        onClick={() => isAccessible ? handleContentAccess(dotPointId, contentType, content.id) : null}
        disabled={!isAccessible}
        className={`p-3 rounded-lg text-left transition-all ${
          !isAccessible 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isAccessed 
            ? 'bg-green-50 border-2 border-green-200 text-green-700'
            : `bg-${colorScheme.accent}-50 border-2 border-${colorScheme.accent}-200 text-${colorScheme.accent}-700 hover:bg-${colorScheme.accent}-100`
        }`}
      >
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg">{contentIcons[contentType]}</span>
          <span className="font-medium">{contentTypeNames[contentType]}</span>
                        {isAccessed && <span className="text-xs">Done</span>}
        </div>
        <p className="text-xs text-gray-600">{content.title}</p>
        {contentType === 'podcast' && <p className="text-xs text-gray-500">{content.duration} min</p>}
        {contentType === 'video' && <p className="text-xs text-gray-500">{content.duration} min</p>}
        {contentType === 'slides' && <p className="text-xs text-gray-500">{content.pages} pages</p>}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${colorScheme.primary}-500 border-t-transparent rounded-full animate-spin mb-4`}></div>
          <p className="text-gray-600">Loading {config.title} {pathwayData.name}...</p>
        </div>
      </div>
    );
  }

  // Analytics view placeholder
  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-semibold text-slate-800">Learning Pathway</div>
          <h2 className="text-2xl font-bold mb-2">Analytics Coming Soon</h2>
          <p className="text-gray-600 mb-4">{config.title} analytics dashboard is in development.</p>
          <button
            onClick={() => setCurrentView('pathway')}
            className={`px-6 py-3 bg-${colorScheme.primary}-500 text-white rounded-lg hover:bg-${colorScheme.primary}-600 transition-colors`}
          >
            Back to Pathway
          </button>
        </div>
      </div>
    );
  }

  // Dot Point Detail view - using new tabbed interface
  if (currentView === 'dotpoint-detail' && selectedDotPoint) {
    const dotPointData = getDotPointData(selectedDotPoint);

    return (
      <ErrorBoundary
        title="Dotpoint Content Error"
        message="We couldn't load this dotpoint. Your progress is saved."
        onReset={() => {
          setSelectedDotPoint(null);
          setCurrentView('pathway');
        }}
        onGoHome={() => setCurrentView('pathway')}
      >
        <DotPointDetailTabs
          dotPointId={selectedDotPoint}
          dotPointData={dotPointData}
          onBack={() => {
            setSelectedDotPoint(null);
            setCurrentView('pathway');
          }}
          pathwayData={pathwayData}
          progressHook={progressHook}
        />
      </ErrorBoundary>
    );
  }

  // Quiz views
  if (currentView === 'quick-quiz' && selectedDotPoint && QuickQuizComponent) {
    return (
      <QuickQuizComponent
        dotPointId={selectedDotPoint}
        onQuizComplete={handleQuizComplete}
        onExit={() => setCurrentView('pathway')}
        pathwayData={pathwayData}
      />
    );
  }

  if (currentView === 'long-response' && selectedDotPoint && LongResponseComponent) {
    return (
      <LongResponseComponent
        dotPointId={selectedDotPoint}
        onQuizComplete={handleQuizComplete}
        onBackToPathway={() => setCurrentView('pathway')}
      />
    );
  }

  // Mini Boss Battle view
  if (currentView === 'mini-boss' && selectedBattle) {
    return (
      <MiniBossBattle
        miniBoss={selectedBattle}
        questions={battleQuestions}
        onBattleComplete={handleMiniBossComplete}
        onEscape={() => {
          setCurrentView('pathway');
          setSelectedBattle(null);
          setBattleQuestions([]);
        }}
      />
    );
  }

  // Boss Battle view
  if (currentView === 'boss-battle' && selectedBattle) {
    return (
      <BossBattleInterface
        bossConfig={selectedBattle}
        questions={battleQuestions}
        onBattleComplete={handleBossComplete}
        onEscape={() => {
          setCurrentView('pathway');
          setSelectedBattle(null);
          setBattleQuestions([]);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header - Only show in grid view */}
      {viewMode === 'grid' && (
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50">
          <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors mr-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center text-white text-lg`}>
                {config.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pathwayData.name}</h1>
                <p className="text-sm text-gray-600">Sequential Learning Pathway</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <button
              onClick={handleViewModeToggle}
              className={`p-2 text-${colorScheme.primary}-600 hover:text-${colorScheme.primary}-900 hover:bg-${colorScheme.primary}-100 rounded-full transition-colors`}
              title={viewMode === 'grid' ? 'Switch to Roadmap View' : 'Switch to Grid View'}
            >
              {viewMode === 'grid' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>

            {/* Analytics Button */}
            <button
              onClick={() => setCurrentView('analytics')}
              className={`p-2 text-${colorScheme.primary}-600 hover:text-${colorScheme.primary}-900 hover:bg-${colorScheme.primary}-100 rounded-full transition-colors`}
              title="View Analytics"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
          </div>
        </div>
      )}

      {/* Roadmap View */}
      {viewMode === 'roadmap' ? (
        <RoadmapPathway
          subject={subject}
          moduleId={moduleNumber}
          pathwayData={pathwayData}
          progressHook={progressHook}
          onNavigate={handleRoadmapNavigate}
          onBack={onBack}
          onViewToggle={handleViewModeToggle}
        />
      ) : (
        /* Grid View */
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Overall Progress */}
          {pathwayStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 mb-6"
            >
              <h2 className="font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold text-${colorScheme.primary}-600`}>{pathwayStats.overallProgress}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-${colorScheme.secondary}-600`}>{pathwayStats.unlockedDotPoints}/{pathwayData.totalDotPoints}</div>
                  <div className="text-sm text-gray-600">Dot Points Unlocked</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-${colorScheme.accent}-600`}>{pathwayStats.completedDotPoints}/{pathwayData.totalDotPoints}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div
                  className={`bg-gradient-to-r ${config.gradient} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${pathwayStats.overallProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Dot Points Grid */}
          <div className="space-y-8">
          {Object.entries(pathwayData.inquiryQuestions).map(([iqId, iq], iqIndex) => (
            <motion.div
              key={iqId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: iqIndex * 0.1 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">{iq.title}</h3>
              <p className="text-gray-600 text-sm mb-6">{iq.description}</p>

              {/* Dot Point Tiles */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(iq.dotPoints).map(([dotPointId, dotPoint], dpIndex) => {
                  const status = getDotPointStatus(dotPointId);
                  const isAccessible = isContentAccessible(dotPointId);

                  return (
                    <motion.div
                      key={dotPointId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: iqIndex * 0.1 + dpIndex * 0.05 }}
                      onClick={() => {
                        if (isAccessible) {
                          setSelectedDotPoint(dotPointId);
                          setCurrentView('dotpoint-detail');
                        }
                      }}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                        status.status === 'completed'
                          ? 'border-green-300 bg-green-50 hover:bg-green-100'
                          : status.status === 'in_progress'
                          ? `border-${colorScheme.accent}-300 bg-${colorScheme.accent}-50 hover:bg-${colorScheme.accent}-100`
                          : status.status === 'available'
                          ? `border-${colorScheme.primary}-300 bg-${colorScheme.primary}-50 hover:bg-${colorScheme.primary}-100 cursor-pointer transform hover:scale-105`
                          : 'border-gray-300 bg-gray-100 opacity-75'
                      } ${isAccessible ? 'hover:shadow-lg' : ''}`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {status.status === 'completed' ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                            Done
                          </div>
                        ) : status.status === 'in_progress' ? (
                          <div className={`w-8 h-8 bg-${colorScheme.accent}-500 rounded-full flex items-center justify-center text-xs text-white`}>
                            Working
                          </div>
                        ) : !isAccessible ? (
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white">
                            Locked
                          </div>
                        ) : null}
                      </div>

                      {/* Main Content */}
                      <div className="pr-12">
                        <div className="text-3xl mb-3">{status.icon}</div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{dotPoint.title}</h4>
                        <p className="text-gray-600 text-sm mb-4">{dotPoint.description}</p>

                        {/* Progress Indicator */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{status.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                status.status === 'completed' ? 'bg-green-500' :
                                status.status === 'in_progress' ? `bg-${colorScheme.accent}-500` :
                                status.status === 'available' ? `bg-${colorScheme.primary}-500` : 'bg-gray-400'
                              }`}
                              style={{ width: `${status.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Hint */}
                        <div className="text-center">
                          {status.status === 'completed' ? (
                            <span className="text-green-600 text-sm font-medium">Complete</span>
                          ) : isAccessible ? (
                            <span className={`text-${colorScheme.primary}-600 text-sm font-medium`}>Click to Start {config.icon}</span>
                          ) : (
                            <span className="text-gray-500 text-sm">Locked</span>
                          )}
                        </div>
                      </div>

                      {/* Prerequisites hint for locked items */}
                      {!isAccessible && dotPoint.prerequisites.length > 0 && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs text-gray-500 text-center">
                            Complete: {dotPoint.prerequisites[dotPoint.prerequisites.length - 1]}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

          {/* Success State */}
          {pathwayStats?.overallProgress === 100 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`bg-gradient-to-r ${config.gradient} text-white rounded-2xl p-8 text-center mt-6`}
            >
              <h2 className="text-2xl font-bold mb-2">Pathway Complete</h2>
              <p className="text-white/90">
                You have completed every section for {pathwayData.name}. Great work!
              </p>
            </motion.div>
          )}

          <div className="h-8" />
        </div>
      )}
    </div>
  );
};

export default GenericPathway;
