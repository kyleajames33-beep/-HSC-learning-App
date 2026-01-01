import React from 'react';
import GenericPathway from './GenericPathway';
import QuickQuiz from './QuickQuiz';
import { useModule6Progress } from '../hooks/useModule6Progress';
import { BIOLOGY_MODULE_6_PATHWAY } from '../data/biologyModule6Pathway';

const Module6Pathway = ({ onBack }) => {
  const pathwayConfig = {
    subject: 'biology',
    moduleId: 'module-6',
    moduleName: 'Module 6 - Genetic Change',
    pathwayData: BIOLOGY_MODULE_6_PATHWAY,
    
    // Biology-specific theming (slightly different shade for Module 6)
    colors: {
      primary: '#0D9488',      // Teal for biology module 6
      secondary: '#14B8A6',    // Light teal
      accent: '#CCFBF1',       // Very light teal
      background: '#F3F4F6',   // Light gray
      text: '#1F2937',         // Dark gray
      success: '#10B981',      // Green
      warning: '#F59E0B'       // Amber
    },
    
    // Biology Module 6 specific branding
    branding: {
    icon: 'Genetics',
    description: 'Explore genetic change, mutations, and biotechnology',
    features: [
      'Genetic mutations and their impacts',
      'Biotechnology applications',
      'Evolutionary change case studies'
    ]
  },
    
    // Service configuration for biology agent
    serviceConfig: {
      agentBaseUrl: 'http://localhost:3014', // Biology agent port (same as module 5)
      subject: 'biology',
      enableServiceIntegration: true,
      fallbackMode: 'graceful' // Use fallback data if service unavailable
    }
  };

  return (
    <GenericPathway 
      subject={pathwayConfig.subject}
      moduleId={pathwayConfig.moduleId}
      pathwayData={pathwayConfig.pathwayData}
      progressHook={useModule6Progress}
      QuickQuizComponent={QuickQuiz}
      onBack={onBack}
      colorScheme={pathwayConfig.colors}
    />
  );
};

export default Module6Pathway;
