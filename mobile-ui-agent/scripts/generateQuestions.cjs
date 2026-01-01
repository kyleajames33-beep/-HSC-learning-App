/**
 * Generate HSC Quiz Questions
 *
 * Creates quiz questions for Chemistry and Biology Module 5
 */

// Chemistry Module 5 Questions (Equilibrium and Acid Reactions)
const chemistryQuestions = [
  // 5.1.1 - Static and Dynamic Equilibrium
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
    question: 'Which of the following is a characteristic of a system at dynamic equilibrium?',
    options: ['Concentrations change over time', 'Both forward and reverse reactions have stopped', 'Concentrations remain constant', 'Only the forward reaction occurs'],
    correctAnswer: 'Concentrations remain constant',
    explanation: 'At dynamic equilibrium, forward and reverse reactions continue but concentrations stay constant because rates are equal.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-1',
    keywords: ['equilibrium', 'concentration'],
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

  // 5.1.2 - Le Chatelier's Principle
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

  // 5.2.1 - Brønsted-Lowry Theory
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.1',
    tabName: 'Chem M5 5.2.1',
    question: 'According to Brønsted-Lowry theory, an acid is a substance that:',
    options: ['Accepts a proton', 'Donates a proton', 'Accepts an electron', 'Donates an electron'],
    correctAnswer: 'Donates a proton',
    explanation: 'Brønsted-Lowry acids are proton (H⁺) donors, while bases are proton acceptors.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-3',
    keywords: ['acid', 'Brønsted-Lowry', 'proton'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.1',
    tabName: 'Chem M5 5.2.1',
    question: 'What is the conjugate base of HCl?',
    options: ['H⁺', 'Cl⁻', 'H₂O', 'OH⁻'],
    correctAnswer: 'Cl⁻',
    explanation: 'When HCl donates a proton, it forms Cl⁻, which is its conjugate base.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-3',
    keywords: ['conjugate base', 'acid', 'HCl'],
    status: 'approved'
  },

  // 5.2.2 - pH and Calculations
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.2',
    tabName: 'Chem M5 5.2.2',
    question: 'A solution with pH = 7 is:',
    options: ['Acidic', 'Basic', 'Neutral', 'Cannot determine'],
    correctAnswer: 'Neutral',
    explanation: 'pH 7 indicates equal concentrations of H⁺ and OH⁻ ions, making the solution neutral.',
    difficulty: 'easy',
    time_limit: 45,
    points: 1,
    syllabus_outcome: 'CH5-4',
    keywords: ['pH', 'neutral'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.2',
    tabName: 'Chem M5 5.2.2',
    question: 'What is the pH of a solution with [H⁺] = 1 × 10⁻³ M?',
    options: ['3', '11', '7', '10'],
    correctAnswer: '3',
    explanation: 'pH = -log[H⁺] = -log(10⁻³) = 3',
    difficulty: 'medium',
    time_limit: 90,
    points: 1,
    syllabus_outcome: 'CH5-4',
    keywords: ['pH', 'calculation', 'concentration'],
    status: 'approved'
  },
];

// Biology Module 5 Questions (Heredity)
const biologyQuestions = [
  // IQ1.1 - Reproduction
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.1',
    tabName: 'Bio M5 IQ1.1',
    question: 'Which type of cell division produces gametes?',
    options: ['Mitosis', 'Meiosis', 'Binary fission', 'Budding'],
    correctAnswer: 'Meiosis',
    explanation: 'Meiosis is the cell division process that produces four haploid gametes from one diploid cell.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-1',
    keywords: ['meiosis', 'gametes', 'cell division'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.1',
    tabName: 'Bio M5 IQ1.1',
    question: 'How many chromosomes do human gametes contain?',
    options: ['23', '46', '92', '12'],
    correctAnswer: '23',
    explanation: 'Human gametes are haploid (n), containing 23 chromosomes, half the diploid number (2n = 46).',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-1',
    keywords: ['chromosomes', 'haploid', 'gametes'],
    status: 'approved'
  },

  // IQ1.2 - DNA and Polypeptide Synthesis
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.2',
    tabName: 'Bio M5 IQ1.2',
    question: 'What is the complementary DNA strand for the sequence 5\'-ATGC-3\'?',
    options: ['5\'-TACG-3\'', '3\'-TACG-5\'', '5\'-GCTA-3\'', '3\'-ATGC-5\''],
    correctAnswer: '3\'-TACG-5\'',
    explanation: 'DNA strands are antiparallel. A pairs with T, G pairs with C. The complement runs 3\' to 5\'.',
    difficulty: 'medium',
    time_limit: 90,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['DNA', 'complementary', 'base pairing'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.2',
    tabName: 'Bio M5 IQ1.2',
    question: 'Which RNA molecule carries amino acids to the ribosome during translation?',
    options: ['mRNA', 'tRNA', 'rRNA', 'DNA'],
    correctAnswer: 'tRNA',
    explanation: 'Transfer RNA (tRNA) molecules carry specific amino acids to the ribosome for polypeptide synthesis.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['tRNA', 'translation', 'protein synthesis'],
    status: 'approved'
  },

  // IQ2.1 - Inheritance Patterns
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ2.1',
    tabName: 'Bio M5 IQ2.1',
    question: 'In Mendel\'s experiments, what is the expected phenotypic ratio for a monohybrid cross (Aa × Aa)?',
    options: ['1:1', '3:1', '9:3:3:1', '1:2:1'],
    correctAnswer: '3:1',
    explanation: 'A monohybrid cross between heterozygotes yields 3 dominant : 1 recessive phenotype.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-3',
    keywords: ['Mendel', 'monohybrid', 'ratio'],
    status: 'approved'
  },

  // IQ3.1 - Biotechnology
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ3.1',
    tabName: 'Bio M5 IQ3.1',
    question: 'Which enzyme is used to cut DNA at specific sequences in genetic engineering?',
    options: ['DNA polymerase', 'RNA polymerase', 'Restriction endonuclease', 'Ligase'],
    correctAnswer: 'Restriction endonuclease',
    explanation: 'Restriction enzymes (endonucleases) recognize and cut DNA at specific base sequences.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-4',
    keywords: ['restriction enzyme', 'genetic engineering', 'DNA'],
    status: 'approved'
  },
];

// Combine all questions
const allQuestions = [...chemistryQuestions, ...biologyQuestions];

// Export or write to file
if (require.main === module) {
  const fs = require('fs');
  const outputPath = process.argv[2] || 'generated-questions.json';
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  console.log(`✅ Generated ${allQuestions.length} questions`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`\n📊 Breakdown:`);
  console.log(`   Chemistry: ${chemistryQuestions.length} questions`);
  console.log(`   Biology: ${biologyQuestions.length} questions`);
} else {
  module.exports = { allQuestions, chemistryQuestions, biologyQuestions };
}
