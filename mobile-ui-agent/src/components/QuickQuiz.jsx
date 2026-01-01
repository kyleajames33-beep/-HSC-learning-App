import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionService from '../services/questionService';
import QuestionRenderer from './QuestionRenderer';
import { useGamificationContext } from '../context/GamificationContext';

// Import all quiz question files statically
import iq11Questions from '../data/quiz-questions/iq1-1.json';
import iq12Questions from '../data/quiz-questions/iq1-2.json';
import iq13Questions from '../data/quiz-questions/iq1-3.json';
import iq21Questions from '../data/quiz-questions/iq2-1.json';
import iq22Questions from '../data/quiz-questions/iq2-2.json';
import iq31Questions from '../data/quiz-questions/iq3-1.json';
import iq32Questions from '../data/quiz-questions/iq3-2.json';
import iq33Questions from '../data/quiz-questions/iq3-3.json';
import iq41Questions from '../data/quiz-questions/iq4-1.json';
import iq42Questions from '../data/quiz-questions/iq4-2.json';
import iq43Questions from '../data/quiz-questions/iq4-3.json';
import iq51Questions from '../data/quiz-questions/iq5-1.json';
import iq52Questions from '../data/quiz-questions/iq5-2.json';

const QUIZ_QUESTIONS_MAP = {
  'iq1-1': iq11Questions,
  'iq1-2': iq12Questions,
  'iq1-3': iq13Questions,
  'iq2-1': iq21Questions,
  'iq2-2': iq22Questions,
  'iq3-1': iq31Questions,
  'iq3-2': iq32Questions,
  'iq3-3': iq33Questions,
  'iq4-1': iq41Questions,
  'iq4-2': iq42Questions,
  'iq4-3': iq43Questions,
  'iq5-1': iq51Questions,
  'iq5-2': iq52Questions,
};

const QuickQuiz = ({ 
  subject = 'biology',
  dotPointId, 
  onQuizComplete, 
  onExit
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [shuffledOptions, setShuffledOptions] = useState({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [difficultyMode, setDifficultyMode] = useState('normal'); // normal | rapid | recovery
  const [feedbackBanner, setFeedbackBanner] = useState(null);
  const [quizSummary, setQuizSummary] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Get gamification functions from context
  const { 
    refetch: refetchGamificationData 
  } = useGamificationContext();

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load fallback questions from static imports
  const loadFallbackQuestions = (dotPointId) => {
    // Sanitize dotPointId to be a valid filename
    const fileName = dotPointId.toLowerCase().replace(/\./g, '-');
    console.log(`[FALLBACK] dotPointId: "${dotPointId}" → fileName: "${fileName}"`);
    console.log(`[FALLBACK] QUIZ_QUESTIONS_MAP keys:`, Object.keys(QUIZ_QUESTIONS_MAP));
    console.log(`[FALLBACK] Looking for key: "${fileName}"`);

    const questions = QUIZ_QUESTIONS_MAP[fileName];
    console.log(`[FALLBACK] Found questions:`, questions);

    if (questions && questions.length > 0) {
      console.log(`✅ Successfully loaded ${questions.length} questions for ${dotPointId}`);
      return questions;
    }

    console.error(`❌ No quiz questions found for "${dotPointId}" (tried: "${fileName}")`);
    console.log(`Available keys in map:`, Object.keys(QUIZ_QUESTIONS_MAP));
    return [];
  };

  // Load questions based on dot point
  useEffect(() => {
    loadQuestions();
  }, [dotPointId]);

  const loadQuestions = async () => {
    console.log(`=== LOADING QUIZ for dotPointId: ${dotPointId} ===`);
    setLoading(true);
    let loadedQuestions = [];

    try {
      // First try to fetch from biology agent
      console.log('Trying to fetch from questionService...');
      const fetchedQuestions = await questionService.fetchQuestions(
        'biology',
        'module-5',
        dotPointId,
        'quick'
      );

      console.log('Fetched questions:', fetchedQuestions);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        loadedQuestions = fetchedQuestions.map(q => ({
          ...q,
          type: q.type || 'multiple-choice',
          options: q.options || []
        }));
        console.log(`✓ Loaded ${loadedQuestions.length} biology questions for ${dotPointId} from service`);
      } else {
        console.log('No questions from service, will try fallback');
      }
    } catch (error) {
      console.warn('Failed to load from biology agent, using fallback questions:', error);
    }

    console.log(`loadedQuestions.length after service: ${loadedQuestions.length}`);

    if (loadedQuestions.length === 0) {
      // Fallback to loading from local JSON files
      console.log('Calling loadFallbackQuestions...');
      const fallbackQuestions = loadFallbackQuestions(dotPointId);
      console.log(`Got ${fallbackQuestions.length} fallback questions`);
      if (fallbackQuestions.length > 0) {
        loadedQuestions = fallbackQuestions;
        console.log(`✓ Using ${fallbackQuestions.length} fallback questions`);
      }
    }

    console.log(`loadedQuestions.length after fallback: ${loadedQuestions.length}`);

    if (loadedQuestions.length === 0) {
       // Final fallback if even JSON fails
      console.error(`❌ No questions found for ${dotPointId} in service or local files - using placeholder`);
      loadedQuestions = [
        {
          id: `${dotPointId}-fallback-1`,
          type: 'multiple-choice',
          question: `What is a key concept related to ${dotPointId} in ${subject}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          explanation: `This is a placeholder question. Content for ${dotPointId} is not yet available.`
        }
      ];
    }

    console.log(`=== FINAL: Setting ${loadedQuestions.length} questions ===`);
    setQuestions(loadedQuestions);
    setSelectedAnswers({});
    setStreak(0);
    setBestStreak(0);
    setTotalXp(0);
    setDifficultyMode('normal');
    setFeedbackBanner(null);
    setQuestionStartTime(Date.now());
    setQuizSummary(null);
    
    // Generate shuffled options for dropdown questions
    const shuffledOpts = {};
    loadedQuestions.forEach((q) => {
      if (q.type === 'match-definitions' && q.pairs) {
        // Shuffle the definition options for each term
        shuffledOpts[q.id] = shuffleArray(q.pairs.map(p => p.definition));
      } else if (q.type === 'sequence-flowchart' && q.flowchartSteps) {
        // Shuffle options for flowchart steps
        q.flowchartSteps.forEach(step => {
          if (step.options) {
            shuffledOpts[`${q.id}_${step.id}`] = shuffleArray(step.options);
          }
        });
      }
    });
    setShuffledOptions(shuffledOpts);
    
    // Set timer based on number of questions (e.g., 90 seconds per question)
    const timeLimit = loadedQuestions.length * 90;
    setTimeRemaining(timeLimit > 0 ? timeLimit : 60); // Minimum 60 seconds
    setLoading(false);
  };


  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const handleTimeUp = () => {
    if (!showResults) {
      const evaluation = evaluateCurrentQuestion();
      finishQuiz(evaluation);
    }
  };

  useEffect(() => {
    if (!feedbackBanner) return;
    const timer = setTimeout(() => setFeedbackBanner(null), 3500);
    return () => clearTimeout(timer);
  }, [feedbackBanner]);

  const handleAnswerSelect = (questionId, answer) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const evaluateCurrentQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) {
      return null;
    }

    const answer = selectedAnswers[question.id];
    const scoringFunc = scoringStrategies[question.type];
    const isCorrect = scoringFunc ? scoringFunc(question, answer) : false;

    const now = Date.now();
    const timeTaken = Math.max(1, Math.round((now - questionStartTime) / 1000));
    const nextStreak = isCorrect ? streak + 1 : 0;

    const baseXp = isCorrect ? 20 : 5;
    const speedBonus = isCorrect ? Math.max(0, 12 - Math.floor(timeTaken / 2)) * 2 : 0;
    const streakBonus = isCorrect ? Math.min(nextStreak * 4, 20) : 0;

    let nextMode = difficultyMode;
    let difficultyMessage;

    if (isCorrect && timeTaken <= 12 && nextStreak >= 3 && difficultyMode !== 'rapid') {
      nextMode = 'rapid';
      difficultyMessage = 'Rapid fire mode! Time pressure increased.';
    } else if (!isCorrect && difficultyMode === 'rapid') {
      nextMode = 'normal';
      difficultyMessage = 'Difficulty normalised while you regroup.';
    } else if (!isCorrect && streak === 0 && difficultyMode === 'normal') {
      nextMode = 'recovery';
      difficultyMessage = 'Recovery boost! Earn extra XP on the next win.';
    } else if (isCorrect && difficultyMode === 'recovery' && nextStreak >= 2) {
      nextMode = 'normal';
      difficultyMessage = 'Back to normal difficulty.';
    }

    let difficultyMultiplier = 1;
    if (nextMode === 'rapid') difficultyMultiplier = 1.2;
    if (nextMode === 'recovery') difficultyMultiplier = 1.1;

    const earnedXp = Math.max(1, Math.round((baseXp + speedBonus + streakBonus) * difficultyMultiplier));

    if (isCorrect) {
      setStreak(nextStreak);
      setBestStreak(prev => Math.max(prev, nextStreak));
    } else {
      setStreak(0);
    }

    if (nextMode !== difficultyMode) {
      setDifficultyMode(nextMode);
    }

    setTotalXp(prev => prev + earnedXp);
    setFeedbackBanner({
      isCorrect,
      earnedXp,
      speedBonus,
      streakBonus,
      timeTaken,
      streak: isCorrect ? nextStreak : 0,
      difficultyMessage
    });

    setQuestionStartTime(now);
    return { isCorrect, earnedXp, timeTaken, nextMode, streakAfter: isCorrect ? nextStreak : 0 };
  };

  const handleNextQuestion = () => {
    const evaluation = evaluateCurrentQuestion();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz(evaluation);
    }
  };

  const finishQuiz = async (latestEvaluation = null) => {
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
    const results = calculateResults();
    const estimatedXp = totalXp + (latestEvaluation?.earnedXp ?? 0);
    const finalBestStreak = Math.max(bestStreak, latestEvaluation?.streakAfter ?? streak);
    let finalResults = {
      ...results,
      dotPointId,
      quizType: 'quickQuiz',
      totalQuestions: questions.length,
      correctAnswers: results.correct,
      timeSpent,
      passed: results.percentage >= 65,
      gamification: {
        xpEarned: 0,
        leveledUp: false,
        newAchievements: [],
        currentLevel: 1,
        currentXP: 0,
        streakUpdated: 0
      },
      localSummary: {
        estimatedXp,
        bestStreak: finalBestStreak,
        difficultyMode
      }
    };
    
    try {
      // Get user ID from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser?.id || storedUser?._id;

      if (!userId) {
        console.warn('No user ID found, skipping gamification update');
        throw new Error('User ID not found');
      }

      // Update achievement progress with quiz completion event
      const progressResponse = await fetch('/api/achievements/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser?.token || localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          eventType: 'quiz_completed',
          eventValue: results.correct,
          eventMetadata: {
            totalQuestions: questions.length,
            score: results.correct,
            percentage: results.percentage,
            timeSpent,
            subject,
            dotPointId,
            estimatedXp
          }
        })
      });

      const progressData = await progressResponse.json();

      // Update streak with study activity
      const streakResponse = await fetch('/api/achievements/streak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser?.token || localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          activityDate: new Date().toISOString(),
          activityType: 'quiz',
          timeMinutes: Math.round(timeSpent / 60),
          points: results.correct * 10,
          xp: estimatedXp
        })
      });

      const streakData = await streakResponse.json();

      // Prepare final results with gamification data from real API
      const newAchievements = progressData.success ?
        (progressData.data?.newlyCompletedAchievements || []) : [];
      const totalXpAwarded = progressData.success ?
        (progressData.data?.totalXpGained || estimatedXp) : estimatedXp;

      finalResults = {
        ...finalResults,
        gamification: {
          xpEarned: totalXpAwarded,
          leveledUp: newAchievements.length > 0, // Simplified - could check level progression
          newAchievements: newAchievements.map(ach => ({
            name: ach.achievement_name || ach.name,
            title: ach.achievement_title || ach.title,
            description: ach.achievement_description || ach.description
          })),
          currentLevel: Math.floor(totalXpAwarded / 1000) + 1, // Simplified level calculation
          currentXP: totalXpAwarded,
          streakUpdated: streakData.success ?
            (streakData.data?.currentStreak || 0) : 0
        }
      };

      console.log('Quiz completed with gamification data:', finalResults);

      // Refresh user stats
      await refetchGamificationData();

    } catch (error) {
      console.error('Error updating progress:', error);
    }

    setQuizSummary({
      estimatedXp,
      bestStreak: finalBestStreak,
      xpAwarded: finalResults.gamification.xpEarned,
      difficultyMode
    });
    setFeedbackBanner(null);
    setShowResults(true);
    
    // Call completion callback after a brief delay to show results
    setTimeout(() => {
      onQuizComplete(finalResults);
    }, 2000);
  };

  const scoringStrategies = {
    'multiple-choice': (q, ans) => ans === q.correctAnswer,
    'true-false': (q, ans) => ans === q.correctAnswer,
    'match-definitions': (q, ans) => {
      return q.pairs.every((pair, index) => ans && ans[index] === pair.definition);
    },
    'multiple-select': (q, ans) => {
      const selectedSet = new Set(ans || []);
      const correctSet = new Set(q.correctAnswers);
      return selectedSet.size === correctSet.size && [...selectedSet].every(answer => correctSet.has(answer));
    },
    'drag-sequence': (q, ans) => {
      const answerIds = ans?.map(item => item.id) || [];
      return JSON.stringify(answerIds) === JSON.stringify(q.correctOrder);
    },
    'image-hotspot': (q, ans) => {
      const selectedSet = new Set(ans || []);
      const correctSet = new Set(q.correctSpots);
      return selectedSet.size === correctSet.size && [...selectedSet].every(spot => correctSet.has(spot));
    },
    'category-sort': (q, ans) => {
      if (!q.correctMapping || !ans) return false;
      return Object.keys(q.correctMapping).every(itemId => {
        const correctCategory = q.correctMapping[itemId];
        // This logic needs to be adapted based on how `selectedAnswer` is structured for this type.
        // Assuming `ans` is an object like { categoryId: [item objects] }
        // A simpler `ans` structure like { itemId: categoryId } would be easier.
        // For now, this is a placeholder for the complex logic.
        return ans[itemId] === correctCategory; // This assumes a simplified answer structure
      });
    },
    'timeline-builder': (q, ans) => {
      const answerIds = ans?.map(event => event.id) || [];
      return JSON.stringify(answerIds) === JSON.stringify(q.correctOrder);
    },
    'flowchart-complete': (q, ans) => {
      if (!q.blanks || !ans) return false;
      return q.blanks.every(blank => ans[blank.id] === blank.correct);
    },
    'graph-construct': (q, ans) => {
      // This is complex and depends on the exact answer format. Placeholder.
      if (q.graphType === 'plot') {
        const pointsCorrect = q.correctPoints && ans && ans.length === q.correctPoints.length &&
          ans.every(point => 
            q.correctPoints.some(correct => 
              Math.abs(point.x - correct.x) < 10 && Math.abs(point.y - correct.y) < 10
            )
          );
        return pointsCorrect;
      }
      return ans === q.correctGraph;
    },
    'slider-scale': (q, ans) => {
      if (!q.correctRanges || !ans) return false;
      return Object.keys(q.correctRanges).every(variableId => {
        const userValue = ans[variableId];
        const range = q.correctRanges[variableId];
        return userValue >= range.min && userValue <= range.max;
      });
    },
    'venn-diagram': (q, ans) => {
      if (!q.correctPlacements || !ans) return false;
      // This logic is complex and depends on answer structure.
      // Assuming ans is { itemId: ['circleId1', 'circleId2'] }
      return Object.keys(q.correctPlacements).every(itemId =>
        JSON.stringify((ans[itemId] || []).sort()) === JSON.stringify(q.correctPlacements[itemId].sort())
      );
    },
    'virtual-microscope': (q, ans) => {
      // Assuming answer is an array of identified structure IDs
      const requiredStructures = new Set(q.requiredStructures || []);
      const identifiedIds = new Set(ans || []);
      return requiredStructures.size === identifiedIds.size && [...requiredStructures].every(id => identifiedIds.has(id));
    },
    'fill-blanks': (q, ans) => {
      if (!q.blanks || !ans) return false;
      return q.blanks.every((blank, index) => 
        ans[index] && ans[index].toLowerCase().trim() === blank.toLowerCase()
      );
    },
    'cloze-passage': (q, ans) => {
      if (!q.correctAnswers || !ans) return false;
      return Object.keys(q.correctAnswers).every(key => ans[key] === q.correctAnswers[key]);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach(question => {
      const selectedAnswer = selectedAnswers[question.id];
      const scoringFunc = scoringStrategies[question.type];
      if (scoringFunc && scoringFunc(question, selectedAnswer)) {
        correct++;
      }
    });

    return {
      correct,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading Quick Quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const passed = results.percentage >= 65;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <span className="text-3xl">
              {passed ? '' : ''}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
            {passed ? 'Well Done!' : 'Keep Trying!'}
          </h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-lg">
              Score: <span className="font-bold">{results.percentage}%</span>
            </p>
            <p className="text-gray-600">
              {results.correct} out of {results.total} questions correct
            </p>
            <p className="text-sm text-gray-500">
              {passed ? 'Minimum 65% required - PASSED ' : 'Minimum 65% required - You can retry immediately!'}
            </p>
          </div>

          {quizSummary && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-blue-600 mb-2">Performance Bonuses</p>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                <span>Total XP Earned</span>
                <span className="font-semibold text-blue-700">
                  {quizSummary.xpAwarded ?? quizSummary.estimatedXp} XP
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                <span>Best Correct-Streak</span>
                <span className="font-semibold">{quizSummary.bestStreak}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Difficulty trajectory</span>
                <span className="uppercase tracking-wide">{quizSummary.difficultyMode}</span>
              </div>
            </div>
          )}

          <p className="text-center text-gray-600">
            Returning to pathway in a moment...
          </p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onExit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h1 className="font-bold text-lg">Quick Quiz</h1>
              <p className="text-sm text-gray-600">{dotPointId}</p>
            </div>

            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRemaining <= 60 ? 'bg-red-100 text-red-700' :
              timeRemaining <= 180 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
               {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm font-semibold text-gray-600">
            <motion.div
              key={`xp-${totalXp}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center rounded-lg bg-white/60 py-2 px-3"
            >
              <span className="text-blue-600">XP</span>
              <span className="ml-2 text-gray-900">{totalXp}</span>
            </motion.div>
            <motion.div
              key={`streak-${streak}-${bestStreak}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center rounded-lg bg-white/60 py-2 px-3"
            >
              <span className="text-purple-600">Streak</span>
              <span className="ml-2 text-gray-900">
                {streak} <span className="text-xs text-gray-500">(best {Math.max(bestStreak, streak)})</span>
              </span>
            </motion.div>
            <motion.div
              key={`mode-${difficultyMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center rounded-lg bg-white/60 py-2 px-3 uppercase tracking-wide"
            >
              {difficultyMode === 'rapid' && 'Rapid Fire'}
              {difficultyMode === 'recovery' && 'Recovery Boost'}
              {difficultyMode === 'normal' && 'Balanced Pace'}
            </motion.div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
  <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {feedbackBanner && (
            <motion.div
              key={`feedback-${currentQuestionIndex}-${feedbackBanner.isCorrect}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`mb-4 rounded-xl border p-4 shadow-sm ${feedbackBanner.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {feedbackBanner.isCorrect ? 'Correct!' : 'Keep going!'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {feedbackBanner.isCorrect ? `+${feedbackBanner.earnedXp} XP earned` : 'Review the concept and try again.'}
                  </p>
                  {typeof feedbackBanner.difficultyMessage === 'string' && (
                    <p className="text-xs text-indigo-500 mt-1">
                      {feedbackBanner.difficultyMessage}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{feedbackBanner.timeTaken}s</p>
                  {feedbackBanner.streak > 0 && (
                    <p className="text-green-600 font-semibold">
                      Streak {feedbackBanner.streak}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.type && (
                    <p className="text-sm text-gray-500 mt-1">
                      Type: {currentQuestion.type.replace('-', ' ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <QuestionRenderer 
                question={currentQuestion}
                selectedAnswers={selectedAnswers}
                handleAnswerSelect={handleAnswerSelect}
                shuffledOptions={shuffledOptions}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 max-w-2xl mx-auto w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
              selectedAnswers[currentQuestion.id]
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickQuiz;

