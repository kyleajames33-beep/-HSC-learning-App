import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Clock, Target } from 'lucide-react';

const ChemistryModulePathway = ({ moduleId, onBack }) => {
  // Module data mapping
  const moduleData = {
    module5: {
      title: 'Module 5: Equilibrium and Acid Reactions',
      description: 'Study chemical equilibrium, reaction rates, and acid-base theory',
      inquiryQuestions: 4,
      dotPoints: 13,
      color: 'from-purple-500 to-indigo-600'
    },
    module6: {
      title: 'Module 6: Acid/Base Reactions', 
      description: 'Study acid-base theory, pH calculations, and buffer systems',
      inquiryQuestions: 2,
      dotPoints: 9,
      color: 'from-orange-500 to-red-600'
    },
    module7: {
      title: 'Module 7: Organic Chemistry',
      description: 'Explore hydrocarbon chemistry, functional groups, and organic reactions',
      inquiryQuestions: 6,
      dotPoints: 24,
      color: 'from-green-500 to-teal-600'
    },
    module8: {
      title: 'Module 8: Applying Chemical Ideas',
      description: 'Examine chemical analysis, monitoring, and real-world applications',
      inquiryQuestions: 3,
      dotPoints: 15,
      color: 'from-gray-400 to-gray-500'
    }
  };

  const module = moduleData[moduleId] || moduleData.module5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Chemistry Hub</span>
            </motion.button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{module.title}</h1>
              <p className="text-sm text-gray-600">{module.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 text-center"
        >
          <div className={`w-20 h-20 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg`}>
            🧪
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {module.title}
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {module.description}
          </p>

          {/* Module Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/50 rounded-xl p-4">
              <BookOpen className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{module.inquiryQuestions}</div>
              <div className="text-sm text-gray-600">Inquiry Questions</div>
            </div>
            
            <div className="bg-white/50 rounded-xl p-4">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{module.dotPoints}</div>
              <div className="text-sm text-gray-600">Dot Points</div>
            </div>
            
            <div className="bg-white/50 rounded-xl p-4">
              <Play className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">Interactive</div>
              <div className="text-sm text-gray-600">Learning</div>
            </div>
            
            <div className="bg-white/50 rounded-xl p-4">
              <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">HSC</div>
              <div className="text-sm text-gray-600">Aligned</div>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg">
            <Clock className="w-5 h-5 mr-2" />
            Coming Soon
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Chemistry pathways are currently in development. Check back soon for interactive learning content!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChemistryModulePathway;