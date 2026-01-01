import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyPathRecommendations = ({ userId, subject = 'biology', className = '' }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});
  const [timeframe, setTimeframe] = useState('week'); // week, month, exam

  useEffect(() => {
    fetchRecommendations();
  }, [userId, subject, timeframe]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      // Fetch adaptive learning recommendations
      const adaptiveResponse = await fetch(`/api/adaptive-learning/recommendations/${userId}?subject=${subject}&limit=10`);
      const adaptiveData = await adaptiveResponse.json();
      
      // Fetch syllabus data
      const syllabusResponse = await fetch(`/api/syllabus/${subject}`);
      const syllabusData = await syllabusResponse.json();
      
      // Generate personalized study paths
      const paths = generateStudyPaths(adaptiveData, syllabusData, timeframe);
      
      setRecommendations(paths);
      
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPaths = (adaptiveData, syllabusData, timeframe) => {
    // Mock implementation - in production, this would use ML algorithms
    const baseRecommendations = adaptiveData.recommendations || {};
    
    const paths = {
      priority: {
        id: 'priority',
        name: '🎯 Priority Focus',
        description: 'Address your weakest areas first for maximum improvement',
        duration: timeframe === 'week' ? '3-5 days' : timeframe === 'month' ? '1-2 weeks' : '2-3 weeks',
        difficulty: 'adaptive',
        activities: [
          {
            type: 'review',
            dotPointId: 'BIO11-7.1',
            title: 'Pathogen Structure & Function',
            estimatedTime: 25,
            priority: 'high',
            reason: 'Low mastery score (0.3/1.0)',
            prerequisites: [],
            skills: ['identification', 'analysis']
          },
          {
            type: 'practice',
            dotPointId: 'BIO11-7.1',
            title: 'Interactive Pathogen Quiz',
            estimatedTime: 15,
            priority: 'high',
            reason: 'Reinforce weak concepts',
            prerequisites: ['pathogen_review'],
            skills: ['application', 'recall']
          },
          {
            type: 'virtual_lab',
            dotPointId: 'BIO11-7.2',
            title: 'Immune Response Simulation',
            estimatedTime: 30,
            priority: 'medium',
            reason: 'Build on foundation knowledge',
            prerequisites: ['pathogen_quiz'],
            skills: ['analysis', 'evaluation']
          }
        ],
        expectedOutcomes: [
          'Improve pathogen identification accuracy by 40%',
          'Master basic immune response concepts',
          'Build confidence in infection mechanisms'
        ]
      },
      
      spaced: {
        id: 'spaced',
        name: '🔄 Spaced Review',
        description: 'Review previously learned content at optimal intervals',
        duration: '2-3 sessions per week',
        difficulty: 'review',
        activities: [
          {
            type: 'review',
            dotPointId: 'BIO11-5.1',
            title: 'Meiosis Process Review',
            estimatedTime: 15,
            priority: 'medium',
            reason: 'Due for spaced repetition',
            lastReviewed: '5 days ago',
            nextOptimal: 'today',
            skills: ['recall', 'understanding']
          },
          {
            type: 'quiz',
            dotPointId: 'BIO11-5.2',
            title: 'Inheritance Patterns Quick Check',
            estimatedTime: 10,
            priority: 'medium',
            reason: 'Maintain mastery level',
            lastReviewed: '1 week ago',
            nextOptimal: 'tomorrow',
            skills: ['application', 'analysis']
          }
        ],
        expectedOutcomes: [
          'Maintain long-term retention',
          'Prevent knowledge decay',
          'Strengthen neural pathways'
        ]
      },
      
      comprehensive: {
        id: 'comprehensive',
        name: '📚 Complete Module',
        description: 'Systematic coverage of entire biology module',
        duration: timeframe === 'week' ? '1 week' : timeframe === 'month' ? '3 weeks' : '4-5 weeks',
        difficulty: 'progressive',
        activities: [
          {
            type: 'introduction',
            dotPointId: 'BIO11-7.1',
            title: 'Infectious Disease Introduction',
            estimatedTime: 20,
            priority: 'high',
            reason: 'Foundation knowledge',
            skills: ['understanding', 'recall']
          },
          {
            type: 'deep_dive',
            dotPointId: 'BIO11-7.1',
            title: 'Pathogen Types & Characteristics',
            estimatedTime: 35,
            priority: 'high',
            reason: 'Core concept mastery',
            skills: ['analysis', 'evaluation']
          },
          {
            type: 'virtual_microscope',
            dotPointId: 'BIO11-7.1',
            title: 'Pathogen Identification Lab',
            estimatedTime: 25,
            priority: 'high',
            reason: 'Practical application',
            skills: ['observation', 'identification']
          },
          {
            type: 'assessment',
            dotPointId: 'BIO11-7.1',
            title: 'Module 7 Practice Test',
            estimatedTime: 40,
            priority: 'medium',
            reason: 'Knowledge consolidation',
            skills: ['synthesis', 'evaluation']
          }
        ],
        expectedOutcomes: [
          'Complete understanding of infectious disease module',
          'High confidence across all dot points',
          'Ready for assessment'
        ]
      },
      
      exam_prep: {
        id: 'exam_prep',
        name: '📝 Exam Preparation',
        description: 'Focused preparation for upcoming assessments',
        duration: '1-2 weeks before exam',
        difficulty: 'challenging',
        activities: [
          {
            type: 'practice_exam',
            dotPointId: 'multiple',
            title: 'HSC Biology Practice Paper',
            estimatedTime: 180,
            priority: 'high',
            reason: 'Exam simulation',
            skills: ['all_skills', 'time_management']
          },
          {
            type: 'weak_area_drill',
            dotPointId: 'BIO11-7.2',
            title: 'Immune Response Deep Dive',
            estimatedTime: 45,
            priority: 'high',
            reason: 'Address identified weakness',
            skills: ['analysis', 'synthesis']
          },
          {
            type: 'speed_review',
            dotPointId: 'all',
            title: 'Rapid Concept Review',
            estimatedTime: 30,
            priority: 'medium',
            reason: 'Last-minute consolidation',
            skills: ['recall', 'overview']
          }
        ],
        expectedOutcomes: [
          'Exam-ready confidence level',
          'Optimized performance under time pressure',
          'Weakness areas addressed'
        ]
      }
    };

    return paths;
  };

  const selectPath = (pathId) => {
    setSelectedPath(pathId);
  };

  const startActivity = (activity) => {
    // Navigate to the specific activity
    console.log('Starting activity:', activity);
    // In a real app, this would route to the appropriate component
  };

  const getActivityIcon = (type) => {
    const icons = {
      review: '📖',
      practice: '✏️',
      quiz: '❓',
      virtual_lab: '🔬',
      virtual_microscope: '🔍',
      assessment: '📝',
      introduction: '🎯',
      deep_dive: '🏊‍♂️',
      practice_exam: '📋',
      weak_area_drill: '🎪',
      speed_review: '⚡'
    };
    return icons[type] || '📚';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Personalized Study Paths</h3>
          <p className="text-sm text-gray-600">AI-powered recommendations based on your progress</p>
        </div>
        
        {/* Timeframe selector */}
        <div className="flex space-x-2">
          {[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'exam', label: 'Exam Prep' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Study Path Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.values(recommendations || {}).map(path => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedPath === path.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => selectPath(path.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">{path.name}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {path.duration}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{path.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-600 font-medium">
                {path.activities.length} activities
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                path.difficulty === 'adaptive' ? 'bg-purple-100 text-purple-600' :
                path.difficulty === 'review' ? 'bg-green-100 text-green-600' :
                path.difficulty === 'progressive' ? 'bg-blue-100 text-blue-600' :
                'bg-red-100 text-red-600'
              }`}>
                {path.difficulty}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Path View */}
      <AnimatePresence>
        {selectedPath && recommendations[selectedPath] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-6"
          >
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {recommendations[selectedPath].name} - Activity Plan
              </h4>
              
              {/* Expected Outcomes */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <h5 className="font-medium text-green-800 mb-2">🎯 Expected Outcomes:</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  {recommendations[selectedPath].expectedOutcomes.map((outcome, index) => (
                    <li key={index}>• {outcome}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Activity List */}
            <div className="space-y-3">
              {recommendations[selectedPath].activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-gray-800">{activity.title}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{activity.reason}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>⏱️ {activity.estimatedTime}min</span>
                        <span>📍 {activity.dotPointId}</span>
                        {activity.skills && (
                          <span>🎯 {activity.skills.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startActivity(activity)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start
                  </button>
                </motion.div>
              ))}
            </div>
            
            {/* Path Actions */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={() => setSelectedPath(null)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to paths
              </button>
              
              <button
                onClick={() => startActivity(recommendations[selectedPath].activities[0])}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start Study Path
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyPathRecommendations;