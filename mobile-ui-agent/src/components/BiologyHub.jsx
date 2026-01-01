import React from 'react';
import { motion } from 'framer-motion';
import { getIconString } from '../utils/iconMap.jsx';

const BiologyHub = ({ onBack, onModuleSelect }) => {
  const modules = [
    {
      id: 'module5',
      title: 'Module 5: Reproduction',
      subtitle: 'Sequential Learning Pathway',
      description: 'Explore reproduction and species continuity through a structured pathway system',
      icon: getIconString('biology', 'module5'),
      color: 'from-green-500 to-blue-500',
      status: 'new',
      features: ['Sequential Unlocking', 'Dual Quiz System', '65% Pass Rate', 'Progress Tracking']
    },
    {
      id: 'module6',
      title: 'Module 6: Genetic Change',
      subtitle: 'Inquiry-Based Learning',
      description: 'Study mutations, biotechnology, and genetic engineering',
      icon: getIconString('biology', 'module6'),
      color: 'from-purple-500 to-pink-500',
      status: 'new',
      features: ['3 Inquiry Questions', '12 Dot Points', 'Structured Learning', 'HSC Aligned']
    },
    {
      id: 'module7',
      title: 'Module 7: Ecosystems',
      subtitle: 'Coming Soon',
      description: 'Examine ecosystem interactions and environmental factors',
      icon: getIconString('biology', 'module7'),
      color: 'from-gray-400 to-gray-500',
      status: 'coming-soon',
      features: ['Field Studies', 'Data Analysis', 'Research Projects']
    },
    {
      id: 'module8',
      title: 'Module 8: Genetics',
      subtitle: 'Coming Soon',
      description: 'Understand inheritance patterns and genetic variation',
      icon: getIconString('biology', 'module8'),
      color: 'from-gray-400 to-gray-500',
      status: 'coming-soon',
      features: ['Problem Solving', 'Pedigree Analysis', 'Lab Simulations']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg">
              {getIconString('biology', 'genetics')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Biology Hub</h1>
              <p className="text-sm text-gray-600">Choose Your Module</p>
            </div>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 mb-6"
        >
          <h2 className="font-bold text-gray-900 mb-2">Welcome to Biology</h2>
          <p className="text-gray-600 text-sm">
            Select a module to begin your learning journey. Each module offers unique learning experiences 
            tailored to help you master HSC Biology concepts.
          </p>
        </motion.div>

        {/* Module Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 transition-all duration-300 ${
                module.status === 'new' 
                  ? 'hover:shadow-xl cursor-pointer transform hover:scale-105' 
                  : 'opacity-75'
              }`}
              onClick={() => {
                if (module.status === 'new') {
                  onModuleSelect(module.id);
                }
              }}
            >
              {/* Status Badge */}
              {module.status === 'new' && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
              {module.status === 'coming-soon' && (
                <div className="absolute top-4 right-4 bg-gray-300 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                  SOON
                </div>
              )}

              {/* Module Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                {module.icon}
              </div>

              {/* Module Info */}
              <h3 className="font-bold text-gray-900 text-lg mb-1">{module.title}</h3>
              <p className={`text-sm mb-3 ${module.status === 'new' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                {module.subtitle}
              </p>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 text-sm">Key Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {module.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className={`text-xs px-2 py-1 rounded-full ${
                        module.status === 'new' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Hint */}
              {module.status === 'new' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">Ready to Start</span>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 mt-6"
        >
          <h3 className="font-bold text-blue-900 mb-2"> Study Tips</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li> Complete modules in sequence for optimal learning</li>
            <li> Review content materials before attempting quizzes</li>
            <li> Aim for 65% or higher to unlock the next section</li>
            <li> Use the analytics dashboard to track your progress</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default BiologyHub;



