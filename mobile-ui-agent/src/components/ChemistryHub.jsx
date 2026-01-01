import React from 'react';
import { motion } from 'framer-motion';
import { getIconString } from '../utils/iconMap.jsx';

const ChemistryHub = ({ onBack, onModuleSelect }) => {
  const modules = [
    {
      id: 'module5',
      title: 'Module 5: Equilibrium and Acid Reactions',
      subtitle: 'Systematic Learning Pathway',
      description: 'Study chemical equilibrium, reaction rates, and acid-base theory',
      icon: getIconString('chemistry', 'module5'),
      color: 'from-purple-500 to-indigo-600',
      status: 'new',
      features: ['4 Inquiry Questions', '13 Dot Points', 'Systematic Learning', 'HSC Aligned']
    },
    {
      id: 'module6',
      title: 'Module 6: Acid/Base Reactions',
      subtitle: 'Inquiry-Based Learning',
      description: 'Study acid-base theory, pH calculations, and buffer systems',
      icon: getIconString('chemistry', 'module6'),
      color: 'from-orange-500 to-red-600',
      status: 'new',
      features: ['2 Inquiry Questions', '9 Dot Points', 'pH Calculations', 'Buffer Systems']
    },
    {
      id: 'module7',
      title: 'Module 7: Organic Chemistry',
      subtitle: 'Comprehensive Coverage',
      description: 'Explore hydrocarbon chemistry, functional groups, and organic reactions',
      icon: getIconString('chemistry', 'module7'),
      color: 'from-green-500 to-teal-600',
      status: 'new',
      features: ['6 Inquiry Questions', '24 Dot Points', 'Organic Reactions', 'Polymer Chemistry']
    },
    {
      id: 'module8',
      title: 'Module 8: Applying Chemical Ideas',
      subtitle: 'Coming Soon',
      description: 'Examine chemical analysis, monitoring, and real-world applications',
      icon: getIconString('chemistry', 'module8'),
      color: 'from-gray-400 to-gray-500',
      status: 'coming-soon',
      features: ['Industrial Chemistry', 'Chemical Analysis', 'Environmental Applications']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-purple-50">
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white text-lg">
              {getIconString('chemistry', 'equilibrium')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chemistry Hub</h1>
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
          <h2 className="font-bold text-gray-900 mb-2">Welcome to Chemistry</h2>
          <p className="text-gray-600 text-sm">
            Select a module to begin your learning journey. Each module offers unique learning experiences 
            tailored to help you master HSC Chemistry concepts through inquiry questions and systematic dot points.
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
              <p className={`text-sm mb-3 ${module.status === 'new' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
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
                          ? 'bg-orange-100 text-orange-700' 
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
                    <span className="text-sm font-medium text-orange-600">Ready to Start</span>
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="bg-orange-50/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 mt-6"
        >
          <h3 className="font-bold text-orange-900 mb-2">? Study Tips</h3>
          <ul className="text-orange-800 text-sm space-y-1">
            <li>- Work through inquiry questions systematically for comprehensive understanding</li>
            <li>- Practice calculations and chemical equations regularly</li>
            <li>- Connect theoretical concepts to real-world applications</li>
            <li>- Use the structured dot points to organize your learning</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ChemistryHub;


