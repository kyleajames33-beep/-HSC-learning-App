import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChemistryModule5LongResponse = ({ 
  dotPointId, 
  onQuizComplete, 
  onBackToPathway 
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [dotPointId]);

  const loadQuestions = async () => {
    setLoading(true);
    
    // Chemistry long response questions
    const longResponseQuestions = {
      'IQ1.1': [
        {
          id: 'IQ1.1-LR001',
          question: 'A sample of gas occupies 2.5 L at 25°C and 1.2 atm. Calculate the volume of this gas sample at STP. Show all working and explain the gas law principles involved.',
          marks: 6,
          rubric: [
            'Identifies the appropriate gas law (Combined Gas Law)',
            'Converts temperature to Kelvin correctly',
            'Sets up equation with correct values',
            'Calculates final volume correctly',
            'Shows appropriate significant figures',
            'Explains the relationship between P, V, T'
          ]
        },
        {
          id: 'IQ1.1-LR002',
          question: 'Explain why real gases deviate from ideal gas behavior. Discuss the two main factors that cause this deviation and provide examples of when these deviations become most significant.',
          marks: 8,
          rubric: [
            'Explains intermolecular forces factor',
            'Explains molecular volume factor',
            'Provides specific conditions for deviations',
            'Uses examples of real gases',
            'Discusses high pressure effects',
            'Discusses low temperature effects',
            'Compares to ideal gas assumptions',
            'Uses appropriate scientific terminology'
          ]
        }
      ],
      'IQ1.2': [
        {
          id: 'IQ1.2-LR001',
          question: 'A reaction vessel contains 0.25 mol of nitrogen gas at 2.5 atm and 350 K. If the temperature is increased to 450 K and the pressure decreased to 1.8 atm, calculate the final volume. Show all calculations.',
          marks: 6,
          rubric: [
            'Uses ideal gas law correctly',
            'Calculates initial volume',
            'Applies combined gas law',
            'Shows step-by-step working',
            'Includes correct units',
            'Arrives at correct final answer'
          ]
        }
      ],
      'IQ2.1': [
        {
          id: 'IQ2.1-LR001',
          question: 'For the equilibrium: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92 kJ. Predict and explain the effect of: (a) increasing temperature, (b) increasing pressure, (c) adding a catalyst, (d) removing NH₃ from the system.',
          marks: 10,
          rubric: [
            'Identifies reaction as exothermic',
            'Correctly predicts temperature effect',
            'Explains Le Chatelier\'s principle for temperature',
            'Correctly predicts pressure effect',
            'Explains pressure effect using moles of gas',
            'Correctly states catalyst has no effect on position',
            'Explains catalyst speeds up rate to equilibrium',
            'Correctly predicts effect of removing NH₃',
            'Explains shift to replace removed product',
            'Uses appropriate chemical terminology'
          ]
        },
        {
          id: 'IQ2.1-LR002',
          question: 'Explain Le Chatelier\'s Principle and discuss how it applies to industrial processes such as the Haber Process. Include the compromises that must be made in industrial conditions.',
          marks: 8,
          rubric: [
            'States Le Chatelier\'s principle clearly',
            'Applies to Haber Process specifically',
            'Discusses temperature compromise',
            'Discusses pressure considerations',
            'Mentions catalyst role',
            'Explains industrial vs optimal conditions',
            'Discusses economic factors',
            'Uses specific examples'
          ]
        }
      ],
      'IQ3.1': [
        {
          id: 'IQ3.1-LR001',
          question: 'Explain collision theory and discuss how each of the following factors affects reaction rate: temperature, concentration, surface area, and catalysts. Include molecular-level explanations for each factor.',
          marks: 12,
          rubric: [
            'States collision theory principles',
            'Explains activation energy concept',
            'Discusses temperature effect on kinetic energy',
            'Explains frequency and energy of collisions',
            'Discusses concentration effect',
            'Explains surface area effect',
            'Explains how catalysts work',
            'Discusses alternative reaction pathways',
            'Uses Maxwell-Boltzmann distribution concepts',
            'Provides molecular-level explanations',
            'Uses appropriate scientific language',
            'Includes relevant examples'
          ]
        }
      ],
      'IQ4.1': [
        {
          id: 'IQ4.1-LR001',
          question: 'Compare and contrast the Arrhenius, Brønsted-Lowry, and Lewis theories of acids and bases. Provide examples that can be explained by each theory and discuss the limitations of each approach.',
          marks: 10,
          rubric: [
            'States Arrhenius definition correctly',
            'States Brønsted-Lowry definition correctly',
            'States Lewis definition correctly',
            'Provides appropriate examples for each',
            'Discusses limitations of Arrhenius theory',
            'Explains advantages of Brønsted-Lowry',
            'Explains advantages of Lewis theory',
            'Compares theories effectively',
            'Uses chemical equations where appropriate',
            'Demonstrates understanding of evolution of theories'
          ]
        },
        {
          id: 'IQ4.1-LR002',
          question: 'Calculate the pH of a 0.025 M solution of HCl and a 0.15 M solution of NaOH. Then explain what happens when 50 mL of each solution are mixed together. Show all calculations.',
          marks: 8,
          rubric: [
            'Correctly identifies HCl as strong acid',
            'Calculates pH of HCl correctly',
            'Correctly identifies NaOH as strong base',
            'Calculates pH of NaOH correctly',
            'Determines limiting reagent in neutralization',
            'Calculates moles of excess reagent',
            'Calculates final pH correctly',
            'Shows clear working throughout'
          ]
        }
      ]
    };

    const questionsForDotPoint = longResponseQuestions[dotPointId] || [];
    
    if (questionsForDotPoint.length > 0) {
      setQuestions(questionsForDotPoint);
      // Set timer based on total marks (3 minutes per mark)
      const totalMarks = questionsForDotPoint.reduce((sum, q) => sum + q.marks, 0);
      const timeLimit = totalMarks * 180; // 3 minutes per mark
      setTimeRemaining(timeLimit);
      
      console.log(`🧪 Loaded ${questionsForDotPoint.length} chemistry long response questions for ${dotPointId}`);
    } else {
      console.warn(`No chemistry long response questions found for ${dotPointId}`);
      setQuestions([]);
    }
    
    setLoading(false);
  };

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, showResults]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    // Simple scoring based on answer length and keywords
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    let earnedMarks = 0;

    questions.forEach(question => {
      const answer = answers[question.id] || '';
      // Basic scoring: give partial credit based on answer length and key terms
      if (answer.length > 50) {
        earnedMarks += Math.min(question.marks, Math.ceil(question.marks * 0.7)); // Up to 70% for detailed answers
      } else if (answer.length > 20) {
        earnedMarks += Math.min(question.marks, Math.ceil(question.marks * 0.4)); // Up to 40% for basic answers
      }
    });

    const score = Math.round((earnedMarks / totalMarks) * 100);
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);

    console.log(`🧪 Chemistry Long Response Results: ${earnedMarks}/${totalMarks} marks (${score}%)`);

    setShowResults(true);
    
    // Call completion handler after a short delay
    setTimeout(() => {
      onQuizComplete({
        dotPointId,
        quizType: 'longResponse',
        score,
        totalMarks,
        earnedMarks,
        timeSpent,
        answers
      });
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading Chemistry Long Response...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h2 className="text-2xl font-bold mb-2">Long Response Not Available</h2>
          <p className="text-gray-600 mb-4">No long response questions available for {dotPointId}</p>
          <button
            onClick={onBackToPathway}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Pathway
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    let earnedMarks = 0;

    questions.forEach(question => {
      const answer = answers[question.id] || '';
      if (answer.length > 50) {
        earnedMarks += Math.min(question.marks, Math.ceil(question.marks * 0.7));
      } else if (answer.length > 20) {
        earnedMarks += Math.min(question.marks, Math.ceil(question.marks * 0.4));
      }
    });

    const score = Math.round((earnedMarks / totalMarks) * 100);
    const passed = score >= 65;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 text-center"
        >
          <div className={`text-6xl mb-4 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
            {passed ? 'Assessment Complete!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600 mb-6">
            You earned {earnedMarks} out of {totalMarks} marks
          </p>
          
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {score}%
            </div>
            <div className="text-sm text-gray-500">
              {passed ? 'Excellent work!' : 'You need 65% to pass'}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Returning to pathway...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToPathway}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chemistry Long Response</h1>
              <p className="text-sm text-gray-600">{dotPointId} • {questions.reduce((sum, q) => sum + q.marks, 0)} marks total</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRemaining > 300 ? 'bg-green-100 text-green-700' :
              timeRemaining > 120 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              ⏰ {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="px-4 py-8 max-w-4xl mx-auto space-y-8">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex-1">
                Question {index + 1}
              </h3>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {question.marks} marks
              </span>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              {question.question}
            </p>

            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-vertical"
            />

            <div className="mt-2 text-sm text-gray-500">
              {(answers[question.id] || '').length} characters
            </div>
          </motion.div>
        ))}

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmitQuiz}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium text-lg hover:shadow-lg transition-all"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChemistryModule5LongResponse;