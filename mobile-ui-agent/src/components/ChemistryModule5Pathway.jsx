import React from 'react';
import GenericPathway from './GenericPathway';
import { CHEMISTRY_MODULE_5_PATHWAY } from '../data/chemistryModule5Pathway';

const ChemistryModule5Pathway = ({ onBack }) => {
  const pathwayConfig = {
    subject: 'chemistry',
    moduleId: 'module-5',
    moduleName: 'Module 5 - Equilibrium and Acid Reactions',
    pathwayData: CHEMISTRY_MODULE_5_PATHWAY,
    
    // Chemistry-specific theming
    colors: {
      primary: '#8B5CF6',      // Purple for chemistry
      secondary: '#A78BFA',    // Light purple
      accent: '#DDD6FE',       // Very light purple
      background: '#F3F4F6',   // Light gray
      text: '#1F2937',         // Dark gray
      success: '#10B981',      // Green
      warning: '#F59E0B'       // Amber
    },
    
    // Chemistry-specific branding
    branding: {
      emoji: '⚗️',
      icon: 'BeakerIcon',
      description: 'Master equilibrium, acid-base chemistry, and chemical reactions',
      features: [
        'Chemical equation balancing',
        'pH and concentration calculations', 
        'Equilibrium constant analysis',
        'Le Chatelier\'s principle applications'
      ]
    },
    
    // Service configuration for chemistry agent
    serviceConfig: {
      agentBaseUrl: 'http://localhost:3011', // Chemistry agent port
      subject: 'chemistry',
      enableServiceIntegration: true,
      fallbackMode: 'graceful' // Use fallback data if service unavailable
    }
  };

  return (
    <GenericPathway 
      config={pathwayConfig}
      onBack={onBack}
    />
  );
};

export default ChemistryModule5Pathway;