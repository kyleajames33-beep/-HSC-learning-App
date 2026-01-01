import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationContext } from '../context/GamificationContext';
import Confetti from './Confetti';

/**
 * GuidedEssayBuilder - Progressive disclosure essay writing system for HSC Biology
 *
 * Features:
 * - Step-by-step scaffolding (Topic -> Claim -> Evidence -> Explain -> Link)
 * - Real-time word count and feedback
 * - Hint system for each step
 * - Auto-save to localStorage
 * - 150 XP reward on completion
 * - Mobile-responsive design
 */

const GuidedEssayBuilder = ({
  dotPointId,
  dotPointData,
  essayQuestion,
  onComplete,
  onBack
}) => {
  const { addXP } = useGamificationContext();

  // Essay structure steps (HSC Biology TEEL format)
  const steps = [
    {
      id: 'topic',
      title: 'Topic Sentence',
      icon: 'Topic',
      instruction: 'Write a clear topic sentence that introduces the main idea of your paragraph.',
      hint: 'Start with: "This dotpoint explores..." or "The key concept is..."',
      minWords: 15,
      maxWords: 40,
      placeholder: 'Example: This dotpoint explores the mechanisms of sexual and asexual reproduction in organisms...'
    },
    {
      id: 'claim',
      title: 'Make Your Claim',
      icon: 'Claim',
      instruction: 'State your main argument or point clearly.',
      hint: 'What is the most important thing students need to understand about this concept?',
      minWords: 20,
      maxWords: 50,
      placeholder: 'Example: Sexual reproduction involves the fusion of gametes, while asexual reproduction produces genetically identical offspring...'
    },
    {
      id: 'evidence',
      title: 'Provide Evidence',
      icon: 'Evidence',
      instruction: 'Give specific examples, data, or biological processes that support your claim.',
      hint: 'Use scientific terminology. Include specific examples from your learning.',
      minWords: 40,
      maxWords: 100,
      placeholder: 'Example: In external fertilization, organisms like fish release gametes into water where fusion occurs. This requires large numbers of gametes due to environmental factors...'
    },
    {
      id: 'explain',
      title: 'Explain the Science',
      icon: 'Explain',
      instruction: 'Explain HOW and WHY the evidence supports your claim. Link to biological concepts.',
      hint: 'Connect to broader concepts: genetics, evolution, survival, adaptation.',
      minWords: 40,
      maxWords: 100,
      placeholder: 'Example: This strategy maximizes reproductive success because the aquatic environment facilitates gamete dispersal, though it requires energy investment in producing many gametes to compensate for low fertilization rates...'
    },
    {
      id: 'link',
      title: 'Link to Syllabus',
      icon: 'Link',
      instruction: 'Connect back to the syllabus dotpoint and summarize the significance.',
      hint: 'How does this relate to the inquiry question? Why is it important?',
      minWords: 20,
      maxWords: 50,
      placeholder: 'Example: Understanding these reproductive strategies is essential for comparing how different organisms ensure species survival and genetic diversity...'
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [essayParts, setEssayParts] = useState({
    topic: '',
    claim: '',
    evidence: '',
    explain: '',
    link: ''
  });
  const [showHint, setShowHint] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = steps[currentStepIndex];
  const currentText = essayParts[currentStep.id] || '';
  const wordCount = currentText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isStepValid = wordCount >= currentStep.minWords && wordCount <= currentStep.maxWords;
  const progress = ((currentStepIndex + (isStepValid ? 1 : 0)) / steps.length) * 100;

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(`essay-draft-${dotPointId}`, JSON.stringify({
        essayParts,
        currentStepIndex,
        lastSaved: new Date().toISOString()
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, [essayParts, currentStepIndex, dotPointId]);

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem(`essay-draft-${dotPointId}`);
    if (saved) {
      try {
        const { essayParts: savedParts, currentStepIndex: savedIndex } = JSON.parse(saved);
        setEssayParts(savedParts);
        setCurrentStepIndex(savedIndex);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [dotPointId]);

  // Time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleTextChange = (text) => {
    setEssayParts({
      ...essayParts,
      [currentStep.id]: text
    });
  };

  const handleNext = () => {
    if (isStepValid) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setShowHint({});
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = async () => {
    const fullEssay = steps.map(step => essayParts[step.id]).join('\n\n');
    const totalWords = fullEssay.trim().split(/\s+/).filter(w => w.length > 0).length;

    setIsComplete(true);
    setShowConfetti(true);

    // Award XP
    await addXP(150, `Completed essay for ${dotPointId}`);

    // Save completed essay
    const essayData = {
      essayParts,
      fullEssay,
      totalWords,
      timeSpent,
      completedAt: new Date().toISOString(),
      score: 85 // Mock score for now
    };

    localStorage.setItem(`essay-completed-${dotPointId}`, JSON.stringify(essayData));
    localStorage.setItem(`essay-attempts-${dotPointId}`, JSON.stringify({
      attempts: 1,
      bestScore: 85
    }));

    // Clear draft
    localStorage.removeItem(`essay-draft-${dotPointId}`);

    setTimeout(() => {
      onComplete({
        passed: true,
        score: 85,
        essay: fullEssay,
        timeSpent
      });
    }, 3000);
  };

  const toggleHint = (stepId) => {
    setShowHint({
      ...showHint,
      [stepId]: !showHint[stepId]
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountColor = () => {
    if (wordCount < currentStep.minWords) return 'text-orange-600';
    if (wordCount > currentStep.maxWords) return 'text-red-600';
    return 'text-green-600';
  };

  const getWordCountMessage = () => {
    if (wordCount < currentStep.minWords) {
      return `${currentStep.minWords - wordCount} more words needed`;
    }
    if (wordCount > currentStep.maxWords) {
      return `${wordCount - currentStep.maxWords} words over limit!`;
    }
    return 'Perfect!';
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 md:p-6">
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 md:p-8 max-w-md text-center shadow-lg"
        >
        <div className="mb-4 text-3xl font-semibold">Celebration</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Essay Complete!</h3>
          <p className="text-gray-600 mb-6">
            Excellent work! You&apos;ve constructed a well-structured HSC response.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-2xl font-bold text-orange-600">+150 XP</div>
              <div className="text-sm text-gray-600">Earned</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Essay preview</h4>
            <p className="text-sm text-gray-700 line-clamp-4">
              {Object.values(essayParts).join(' ').substring(0, 200)}...
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Total: {Object.values(essayParts).join(' ').split(/\s+/).filter(w => w.length > 0).length} words
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-white/50 shadow-sm">
        <div className="px-4 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 mx-4">
              <h2 className="font-bold text-gray-900 text-sm md:text-base">Guided Essay Builder</h2>
              <p className="text-xs text-gray-600">{dotPointData.title}</p>
            </div>

            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Time spent: {formatTime(timeSpent)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : index === currentStepIndex
                      ? 'bg-purple-500 text-white ring-4 ring-purple-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStepIndex ? 'Complete' : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                  {currentStep.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{currentStep.title}</h3>
                  <p className="text-sm text-gray-600">Step {currentStepIndex + 1} of {steps.length}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{currentStep.instruction}</p>

              {/* Hint Button */}
              <button
                onClick={() => toggleHint(currentStep.id)}
                className="mb-4 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
              >
                <span>Hint</span>
                <span>{showHint[currentStep.id] ? 'Hide' : 'Show'} Hint</span>
              </button>

              {/* Hint Box */}
              <AnimatePresence>
                {showHint[currentStep.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4"
                  >
                    <p className="text-sm text-blue-900">{currentStep.hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text Area */}
              <textarea
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={currentStep.placeholder}
                className="w-full h-48 md:h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-gray-900"
              />

              {/* Word Count */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm">
                  <span className={`font-bold ${getWordCountColor()}`}>{wordCount}</span>
                  <span className="text-gray-600"> / {currentStep.minWords}-{currentStep.maxWords} words</span>
                </div>
                <span className={`text-sm font-medium ${getWordCountColor()}`}>
                  {getWordCountMessage()}
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              {currentStepIndex > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
          Previous
                </motion.button>
              )}
              <motion.button
                whileHover={isStepValid ? { scale: 1.02 } : {}}
                whileTap={isStepValid ? { scale: 0.98 } : {}}
                onClick={handleNext}
                disabled={!isStepValid}
                className={`flex-1 py-3 font-bold rounded-lg transition-all ${
                  isStepValid
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStepIndex === steps.length - 1 ? 'Submit essay' : 'Next'}
              </motion.button>
            </div>

            {/* Auto-save Indicator */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Auto-saving draft...
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GuidedEssayBuilder;
