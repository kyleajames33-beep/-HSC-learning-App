/**
 * Generate Comprehensive HSC Quiz Questions at Scale
 *
 * Creates 10+ questions per dotpoint for complete HSC coverage
 */

const allQuestions = [];

// ============ CHEMISTRY MODULE 5 - COMPREHENSIVE COVERAGE ============

// 5.1.1 - Static and Dynamic Equilibrium (10 questions)
const chem511Questions = [
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'What is the state of a system when the rate of the forward reaction equals the rate of the reverse reaction?',
    options: ['Static equilibrium', 'Dynamic equilibrium', 'No equilibrium', 'Partial equilibrium'],
    correctAnswer: 'Dynamic equilibrium',
    explanation: 'Dynamic equilibrium occurs when forward and reverse reactions continue at equal rates, maintaining constant concentrations.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'dynamic'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'In a closed system at equilibrium, which statement is TRUE?',
    options: ['The forward reaction has stopped', 'The reverse reaction has stopped', 'Both reactions occur at the same rate', 'No reactions are occurring'],
    correctAnswer: 'Both reactions occur at the same rate',
    explanation: 'At equilibrium, both forward and reverse reactions continue but at equal rates, so concentrations remain constant.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'reaction rate', 'closed system'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'Which condition is necessary for a reversible reaction to reach equilibrium?',
    options: ['Open system', 'Closed system', 'Catalyst present', 'High temperature'],
    correctAnswer: 'Closed system',
    explanation: 'A closed system prevents reactants and products from escaping, allowing equilibrium to be established.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['closed system', 'equilibrium', 'reversible'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'What symbol is used to represent a reversible reaction?',
    options: ['→', '⇌', '←', '↔'],
    correctAnswer: '⇌',
    explanation: 'The double arrow ⇌ indicates a reversible reaction that can reach equilibrium.',
    difficulty: 'easy',
    time_limit: 45,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['reversible', 'symbol'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'At equilibrium, the concentrations of reactants and products are:',
    options: ['Always equal', 'Constant', 'Zero', 'Changing'],
    correctAnswer: 'Constant',
    explanation: 'At equilibrium, concentrations remain constant (not necessarily equal) because formation and consumption rates are balanced.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'concentration', 'constant'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'Which observation indicates a system has reached equilibrium?',
    options: ['Reaction has stopped', 'Color stops changing', 'Temperature increases', 'Pressure decreases'],
    correctAnswer: 'Color stops changing',
    explanation: 'When macroscopic properties (like color) stop changing, it indicates concentrations are constant - a sign of equilibrium.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'observation', 'color'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'Static equilibrium differs from dynamic equilibrium because:',
    options: ['Reactions have stopped in static equilibrium', 'Static equilibrium only occurs in closed systems', 'Dynamic equilibrium only occurs at high temperatures', 'There is no difference'],
    correctAnswer: 'Reactions have stopped in static equilibrium',
    explanation: 'Static equilibrium involves no ongoing reactions, while dynamic equilibrium has continuous forward and reverse reactions at equal rates.',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-1',
    keywords: ['static', 'dynamic', 'equilibrium', 'comparison'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'For the reaction N₂O₄(g) ⇌ 2NO₂(g), equilibrium is reached when:',
    options: ['All N₂O₄ is converted to NO₂', 'The rate of N₂O₄ decomposition equals the rate of NO₂ combination', 'NO₂ concentration is double N₂O₄ concentration', 'Temperature is constant'],
    correctAnswer: 'The rate of N₂O₄ decomposition equals the rate of NO₂ combination',
    explanation: 'Equilibrium is achieved when the forward reaction rate (N₂O₄ → NO₂) equals the reverse reaction rate (NO₂ → N₂O₄).',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'rate', 'N2O4', 'NO2'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'Why can equilibrium only be achieved in a closed system?',
    options: ['Reactions stop in open systems', 'Products escape in open systems', 'Temperature cannot be controlled in open systems', 'Catalysts only work in closed systems'],
    correctAnswer: 'Products escape in open systems',
    explanation: 'In open systems, products or reactants can escape, preventing the establishment of equal forward and reverse reaction rates.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['closed system', 'equilibrium', 'escape'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.1',
    tabName: 'Chem M5 5.1.1',
    question: 'Which graph shows a system at equilibrium?',
    options: ['Concentration vs time with both lines horizontal', 'Concentration vs time with lines crossing', 'Concentration vs time with decreasing trends', 'Rate vs time with increasing values'],
    correctAnswer: 'Concentration vs time with both lines horizontal',
    explanation: 'At equilibrium, concentrations remain constant over time, shown as horizontal lines on a concentration-time graph.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'graph', 'concentration'],
    status: 'approved'
  }
];

allQuestions.push(...chem511Questions);

// 5.1.2 - Le Chatelier's Principle (12 questions)
const chem512Questions = [
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'According to Le Chatelier\'s principle, if the concentration of a reactant is increased, the equilibrium will shift to:',
    options: ['Favor the reactants', 'Favor the products', 'Remain unchanged', 'Stop completely'],
    correctAnswer: 'Favor the products',
    explanation: 'The system shifts to oppose the change, consuming the added reactant by producing more products.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['Le Chatelier', 'concentration', 'equilibrium shift'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'For an exothermic reaction at equilibrium, increasing temperature will:',
    options: ['Shift equilibrium to the right', 'Shift equilibrium to the left', 'Not affect equilibrium', 'Stop the reaction'],
    correctAnswer: 'Shift equilibrium to the left',
    explanation: 'Increasing temperature favors the endothermic direction (reverse for an exothermic reaction), shifting left.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['temperature', 'exothermic', 'Le Chatelier'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing pressure will:',
    options: ['Shift equilibrium to the left', 'Shift equilibrium to the right', 'Not affect equilibrium', 'Stop the reaction'],
    correctAnswer: 'Shift equilibrium to the right',
    explanation: 'Increasing pressure favors the side with fewer gas molecules (4 moles left → 2 moles right).',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-2',
    keywords: ['pressure', 'Le Chatelier', 'Haber process'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'A catalyst added to a system at equilibrium will:',
    options: ['Shift equilibrium to the right', 'Shift equilibrium to the left', 'Not change the equilibrium position', 'Increase product concentration'],
    correctAnswer: 'Not change the equilibrium position',
    explanation: 'Catalysts speed up both forward and reverse reactions equally, so equilibrium position remains unchanged but is reached faster.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['catalyst', 'equilibrium', 'reaction rate'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'If a product is removed from an equilibrium system, the system will:',
    options: ['Shift to produce more products', 'Shift to produce more reactants', 'Not change', 'Stop reacting'],
    correctAnswer: 'Shift to produce more products',
    explanation: 'Le Chatelier\'s principle: removing products causes the system to shift right to replace them.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['Le Chatelier', 'removal', 'products'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'For the endothermic reaction: N₂O₄(g) ⇌ 2NO₂(g), decreasing temperature will:',
    options: ['Favor N₂O₄ formation', 'Favor NO₂ formation', 'Not affect the equilibrium', 'Increase the reaction rate'],
    correctAnswer: 'Favor N₂O₄ formation',
    explanation: 'Decreasing temperature favors the exothermic direction (reverse for endothermic), shifting left to form N₂O₄.',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-2',
    keywords: ['temperature', 'endothermic', 'N2O4'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'Pressure changes only affect equilibrium systems involving:',
    options: ['Gases', 'Liquids', 'Solids', 'All states'],
    correctAnswer: 'Gases',
    explanation: 'Pressure changes significantly affect gases, but have minimal effect on liquids and solids.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['pressure', 'gases', 'equilibrium'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), increasing volume will:',
    options: ['Shift left', 'Shift right', 'Not affect equilibrium', 'Stop the reaction'],
    correctAnswer: 'Shift left',
    explanation: 'Increasing volume decreases pressure, favoring the side with more gas molecules (3 moles left vs 2 right).',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-2',
    keywords: ['volume', 'pressure', 'Le Chatelier'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'Adding an inert gas at constant volume to an equilibrium system will:',
    options: ['Shift equilibrium right', 'Shift equilibrium left', 'Not affect the equilibrium position', 'Increase reaction rate'],
    correctAnswer: 'Not affect the equilibrium position',
    explanation: 'Adding inert gas at constant volume doesn\'t change partial pressures of reactants/products, so equilibrium is unaffected.',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-2',
    keywords: ['inert gas', 'equilibrium', 'pressure'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'Le Chatelier\'s principle is best stated as:',
    options: ['Systems at equilibrium remain unchanged', 'Systems oppose changes to restore equilibrium', 'Equilibrium favors products', 'Temperature always shifts equilibrium right'],
    correctAnswer: 'Systems oppose changes to restore equilibrium',
    explanation: 'Le Chatelier\'s principle states that systems respond to stress by shifting to counteract the change and restore equilibrium.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['Le Chatelier', 'principle', 'definition'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'For H₂(g) + I₂(g) ⇌ 2HI(g), pressure changes will:',
    options: ['Shift equilibrium right', 'Shift equilibrium left', 'Not affect equilibrium', 'Stop the reaction'],
    correctAnswer: 'Not affect equilibrium',
    explanation: 'Equal moles of gas on both sides (2 = 2) means pressure changes don\'t shift the equilibrium position.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['pressure', 'moles', 'equilibrium'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.2',
    tabName: 'Chem M5 5.1.2',
    question: 'In industrial processes, high pressure is used in the Haber process because:',
    options: ['It increases yield of NH₃', 'It increases reaction rate only', 'It decreases cost', 'It prevents side reactions'],
    correctAnswer: 'It increases yield of NH₃',
    explanation: 'High pressure shifts equilibrium toward fewer gas molecules (NH₃), increasing yield. It also increases reaction rate.',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-2',
    keywords: ['Haber process', 'pressure', 'yield'],
    status: 'approved'
  }
];

allQuestions.push(...chem512Questions);

console.log(`Generated ${allQuestions.length} questions so far...`);

// Save to file
const fs = require('fs');
const outputPath = 'scripts/comprehensive-questions-batch1.json';
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));

console.log(`✅ Generated ${allQuestions.length} comprehensive questions (Batch 1)`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📊 Coverage:`);
console.log(`   Chemistry 5.1.1: 10 questions`);
console.log(`   Chemistry 5.1.2: 12 questions`);
console.log(`\n🔄 Run this script multiple times or extend it for more dotpoints!`);
