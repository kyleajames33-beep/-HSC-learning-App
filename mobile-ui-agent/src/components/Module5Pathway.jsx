import React from 'react';
import GenericPathway from './GenericPathway';
import QuickQuiz from './QuickQuiz';
import { useModule5Progress } from '../hooks/useModule5Progress';
import { BIOLOGY_MODULE_5_PATHWAY } from '../data/biologyModule5Pathway';

const Module5Pathway = ({ onBack }) => {
  const pathwayConfig = {
    subject: 'biology',
    moduleId: 'module-5',
    moduleName: 'Module 5 - Heredity',
    pathwayData: BIOLOGY_MODULE_5_PATHWAY,
    
    // Biology-specific theming
    colors: {
      primary: '#059669',      // Green for biology
      secondary: '#34D399',    // Light green
      accent: '#D1FAE5',       // Very light green
      background: '#F3F4F6',   // Light gray
      text: '#1F2937',         // Dark gray
      success: '#10B981',      // Green
      warning: '#F59E0B'       // Amber
    },
    
    // Biology-specific branding
    branding: {
    icon: 'DNA',
    description: 'Explore genetics, inheritance patterns, and molecular biology',
    features: [
      'Genetic inheritance patterns',
      'Chromosome behavior and meiosis',
      'Pedigree analysis',
      'DNA structure and replication'
    ]
  },
    
    // Service configuration for biology agent
    serviceConfig: {
      agentBaseUrl: 'http://localhost:3014', // Biology agent port
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
      progressHook={useModule5Progress}
      QuickQuizComponent={QuickQuiz}
      onBack={onBack}
      colorScheme={pathwayConfig.colors}
    />
  );
};

export default Module5Pathway;

