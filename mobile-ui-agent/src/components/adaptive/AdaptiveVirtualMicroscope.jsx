import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdaptiveVirtualMicroscope = ({ 
  specimenId, 
  userId, 
  onComplete, 
  adaptiveSettings = {},
  className = '' 
}) => {
  const [currentMagnification, setCurrentMagnification] = useState('10x');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [showHints, setShowHints] = useState(false);
  const [adaptiveData, setAdaptiveData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [focusPoints, setFocusPoints] = useState([]);
  const [interactionHistory, setInteractionHistory] = useState([]);
  const canvasRef = useRef(null);

  // Sample specimen data with adaptive features
  const [specimenData] = useState({
    id: specimenId,
    name: "Plant Cell Structure",
    description: "Observe the cellular components of a typical plant cell",
    dotPointId: "BIO11-5.1",
    difficulty: adaptiveSettings.difficulty || 'medium',
    magnifications: {
      '10x': {
        image: '/images/specimens/plant-cell-10x.jpg',
        description: 'Low magnification overview of plant tissue',
        visibleStructures: ['cell wall', 'cell membrane', 'large vacuole'],
        focusPoints: [
          { x: 300, y: 200, structure: 'cell wall', info: 'Thick outer boundary of plant cells' },
          { x: 400, y: 300, structure: 'vacuole', info: 'Large fluid-filled sac for storage and support' }
        ]
      },
      '40x': {
        image: '/images/specimens/plant-cell-40x.jpg',
        description: 'Medium magnification showing cellular details',
        visibleStructures: ['nucleus', 'chloroplasts', 'cytoplasm', 'cell wall'],
        focusPoints: [
          { x: 320, y: 240, structure: 'nucleus', info: 'Control center containing genetic material' },
          { x: 280, y: 180, structure: 'chloroplast', info: 'Site of photosynthesis containing chlorophyll' },
          { x: 360, y: 320, structure: 'cytoplasm', info: 'Gel-like substance filling the cell' }
        ]
      },
      '100x': {
        image: '/images/specimens/plant-cell-100x.jpg',
        description: 'High magnification revealing organelle details',
        visibleStructures: ['nucleolus', 'chromatin', 'chloroplast grana', 'mitochondria'],
        focusPoints: [
          { x: 325, y: 245, structure: 'nucleolus', info: 'Dense region within nucleus for ribosome assembly' },
          { x: 340, y: 230, structure: 'chromatin', info: 'DNA and protein complex in nucleus' },
          { x: 285, y: 185, structure: 'grana', info: 'Stacked structures within chloroplasts' }
        ]
      }
    },
    adaptiveQuestions: {
      easy: {
        question: "What is the thick outer boundary visible in this plant cell?",
        options: ["Cell membrane", "Cell wall", "Cytoplasm", "Nucleus"],
        correctAnswer: 1,
        hints: [
          "Look for the outermost layer of the cell",
          "This structure is unique to plant cells",
          "It provides structural support and protection"
        ],
        explanation: "The cell wall is a rigid outer layer unique to plant cells, providing structural support and protection."
      },
      medium: {
        question: "Which organelle is responsible for photosynthesis in this plant cell?",
        options: ["Mitochondria", "Nucleus", "Chloroplasts", "Vacuole"],
        correctAnswer: 2,
        hints: [
          "Look for green-colored organelles",
          "This organelle contains chlorophyll",
          "It's where light energy is converted to chemical energy"
        ],
        explanation: "Chloroplasts contain chlorophyll and are the sites of photosynthesis, converting light energy into chemical energy."
      },
      hard: {
        question: "Identify the relationship between the grana and thylakoids in chloroplast structure.",
        options: [
          "Grana are individual thylakoids",
          "Grana are stacks of thylakoids",
          "Thylakoids surround grana",
          "They are completely separate structures"
        ],
        correctAnswer: 1,
        hints: [
          "Consider the organizational structure within chloroplasts",
          "Think about how membrane systems are arranged",
          "Look at the stacked appearance in the image"
        ],
        explanation: "Grana are stacks of flattened thylakoid membranes where the light-dependent reactions of photosynthesis occur."
      }
    }
  });

  useEffect(() => {
    // Load adaptive learning data for this user and specimen
    fetchAdaptiveData();
    
    // Set up timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update focus points when magnification changes
    const magData = specimenData.magnifications[currentMagnification];
    setFocusPoints(magData.focusPoints || []);
    
    // Track interaction
    setInteractionHistory(prev => [...prev, {
      type: 'magnification_change',
      magnification: currentMagnification,
      timestamp: Date.now()
    }]);

    // Load appropriate question based on adaptive settings
    loadAdaptiveQuestion();
  }, [currentMagnification]);

  const fetchAdaptiveData = async () => {
    try {
      const response = await fetch(`/api/adaptive-learning/profile/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setAdaptiveData(data.profile);
      }
    } catch (error) {
      console.error('Error fetching adaptive data:', error);
    }
  };

  const loadAdaptiveQuestion = () => {
    const difficulty = adaptiveData?.getOptimalDifficulty?.(specimenData.dotPointId) || 
                     adaptiveSettings.difficulty || 
                     'medium';
    
    const question = specimenData.adaptiveQuestions[difficulty];
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowHints(false);
  };

  const handleMagnificationChange = (newMag) => {
    if (newMag !== currentMagnification) {
      setCurrentMagnification(newMag);
    }
  };

  const handleFocusPointClick = (focusPoint) => {
    // Track interaction
    setInteractionHistory(prev => [...prev, {
      type: 'focus_point_click',
      structure: focusPoint.structure,
      timestamp: Date.now()
    }]);

    // Show structure information
    alert(`${focusPoint.structure}: ${focusPoint.info}`);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerIndex);
      
      // Track interaction
      setInteractionHistory(prev => [...prev, {
        type: 'answer_select',
        answer: answerIndex,
        timestamp: Date.now()
      }]);
    }
  };

  const handleSubmit = async () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const responseTime = Date.now() - sessionStartTime;
    
    setIsSubmitted(true);

    // Update adaptive learning system
    try {
      await fetch(`/api/adaptive-learning/performance/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dotPointId: specimenData.dotPointId,
          isCorrect,
          responseTime,
          difficulty: currentQuestion.difficulty || adaptiveSettings.difficulty,
          subject: 'biology',
          activityType: 'virtual_microscope',
          interactions: interactionHistory
        })
      });
    } catch (error) {
      console.error('Error updating adaptive learning:', error);
    }

    // Complete the activity
    setTimeout(() => {
      onComplete({
        specimenId,
        timeSpent,
        isCorrect,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        interactions: interactionHistory,
        magnificationUsed: currentMagnification
      });
    }, 2000);
  };

  const handleHintRequest = () => {
    setShowHints(true);
    
    // Track hint usage
    setInteractionHistory(prev => [...prev, {
      type: 'hint_request',
      timestamp: Date.now()
    }]);
  };

  const magnificationLevels = Object.keys(specimenData.magnifications);
  const currentMagData = specimenData.magnifications[currentMagnification];

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{specimenData.name}</h3>
          <p className="text-sm text-gray-600">{specimenData.description}</p>
          <p className="text-xs text-blue-600">Dot Point: {specimenData.dotPointId}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Difficulty: {adaptiveSettings.difficulty || 'medium'}</div>
        </div>
      </div>

      {/* Magnification Controls */}
      <div className="flex justify-center mb-4 space-x-2">
        {magnificationLevels.map(mag => (
          <button
            key={mag}
            onClick={() => handleMagnificationChange(mag)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentMagnification === mag
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {mag}
          </button>
        ))}
      </div>

      {/* Microscope View */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
        <motion.div
          key={currentMagnification}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {/* Main specimen image */}
          <img
            src={currentMagData.image || '/images/placeholder-specimen.jpg'}
            alt={`${specimenData.name} at ${currentMagnification}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder-specimen.jpg';
            }}
          />
          
          {/* Interactive focus points */}
          {focusPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
              style={{ 
                left: `${(point.x / 500) * 100}%`, 
                top: `${(point.y / 400) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleFocusPointClick(point)}
              title={point.structure}
            />
          ))}
          
          {/* Magnification indicator */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
            {currentMagnification}
          </div>
        </motion.div>
      </div>

      {/* Specimen description */}
      <div className="bg-gray-50 p-3 rounded mb-4">
        <p className="text-sm text-gray-700">{currentMagData.description}</p>
        <div className="mt-2">
          <span className="text-xs font-medium text-gray-600">Visible structures: </span>
          <span className="text-xs text-gray-600">
            {currentMagData.visibleStructures.join(', ')}
          </span>
        </div>
      </div>

      {/* Adaptive Question */}
      {currentQuestion && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">{currentQuestion.question}</h4>
          
          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isSubmitted}
                className={`w-full p-3 text-left rounded-lg transition-all ${
                  selectedAnswer === index
                    ? isSubmitted
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-blue-100 border-blue-500 text-blue-800'
                    : isSubmitted && index === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                } border`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Hints */}
          {showHints && currentQuestion.hints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4"
            >
              <h5 className="font-medium text-yellow-800 mb-2">💡 Hints:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                {currentQuestion.hints.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Explanation */}
          {isSubmitted && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4"
            >
              <h5 className="font-medium text-blue-800 mb-2">📚 Explanation:</h5>
              <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between">
            {!isSubmitted && (
              <button
                onClick={handleHintRequest}
                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
              >
                💡 Need a hint?
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || isSubmitted}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isSubmitted ? 'Completed' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveVirtualMicroscope;