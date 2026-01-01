/**
 * Generate Full HSC Question Bank at Scale
 * 200+ questions covering all Chemistry and Biology Module 5 dotpoints
 */

const fs = require('fs');

const allQuestions = [];

// ============ CHEMISTRY MODULE 5 (80+ questions) ============

// Helper to create questions
const createQuestion = (subject, moduleId, dotPointId, tabName, question, options, correctAnswer, explanation, difficulty, time_limit, points, syllabus_outcome, keywords) => ({
  subject,
  moduleId,
  dotPointId,
  tabName,
  question,
  options,
  correctAnswer,
  explanation,
  difficulty,
  time_limit: time_limit || 60,
  points: points || 1,
  syllabus_outcome,
  keywords,
  status: 'approved'
});

// 5.1.1 - Equilibrium (10 questions already done, adding 5 more = 15 total)
allQuestions.push(
  createQuestion('chemistry', '5', '5.1.1', 'Chem M5 5.1.1',
    'Which type of equilibrium involves ongoing chemical reactions?',
    ['Static equilibrium', 'Dynamic equilibrium', 'Thermal equilibrium', 'Mechanical equilibrium'],
    'Dynamic equilibrium',
    'Dynamic equilibrium involves continuous forward and reverse reactions at equal rates.',
    'easy', 60, 1, 'CH5-1', ['dynamic', 'equilibrium', 'reactions']),

  createQuestion('chemistry', '5', '5.1.1', 'Chem M5 5.1.1',
    'At equilibrium, which of the following is TRUE about reaction rates?',
    ['Forward rate > Reverse rate', 'Reverse rate > Forward rate', 'Forward rate = Reverse rate', 'Both rates are zero'],
    'Forward rate = Reverse rate',
    'At equilibrium, the rates of forward and reverse reactions are equal, not zero.',
    'medium', 60, 1, 'CH5-1', ['rates', 'equilibrium', 'equal']),

  createQuestion('chemistry', '5', '5.1.1', 'Chem M5 5.1.1',
    'In an equilibrium mixture, the macroscopic properties:',
    ['Change continuously', 'Remain constant', 'Increase over time', 'Decrease over time'],
    'Remain constant',
    'Macroscopic properties (color, pressure, concentration) stay constant at equilibrium.',
    'easy', 60, 1, 'CH5-1', ['macroscopic', 'constant', 'properties']),

  createQuestion('chemistry', '5', '5.1.1', 'Chem M5 5.1.1',
    'For the reaction A ⇌ B, if [A] = 2M and [B] = 2M at equilibrium, this means:',
    ['Reaction has stopped', 'Forward and reverse rates are equal', 'More A is being formed', 'The reaction favors products'],
    'Forward and reverse rates are equal',
    'Equal concentrations don\'t mean the reaction stopped - it means rates are balanced.',
    'hard', 90, 2, 'CH5-1', ['concentration', 'equilibrium', 'rates']),

  createQuestion('chemistry', '5', '5.1.1', 'Chem M5 5.1.1',
    'Equilibrium can be approached from:',
    ['Reactants side only', 'Products side only', 'Either reactants or products side', 'Neither side'],
    'Either reactants or products side',
    'Equilibrium can be reached starting from pure reactants, pure products, or a mixture of both.',
    'medium', 75, 1, 'CH5-1', ['approach', 'equilibrium', 'direction'])
);

// 5.1.2 - Le Chatelier's Principle (12 done, adding 8 more = 20 total)
allQuestions.push(
  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'For CaCO₃(s) ⇌ CaO(s) + CO₂(g) (endothermic), increasing temperature will:',
    ['Shift left', 'Shift right', 'Not affect equilibrium', 'Stop the reaction'],
    'Shift right',
    'Increasing temperature favors endothermic reactions, shifting right to produce more products.',
    'medium', 75, 1, 'CH5-2', ['temperature', 'endothermic', 'CaCO3']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'Which change will NOT shift an equilibrium position?',
    ['Adding a catalyst', 'Changing temperature', 'Changing concentration', 'Changing pressure'],
    'Adding a catalyst',
    'Catalysts speed up both reactions equally without changing the equilibrium position.',
    'easy', 60, 1, 'CH5-2', ['catalyst', 'equilibrium', 'shift']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'For 2NO₂(g) ⇌ N₂O₄(g) + heat, which stress will increase NO₂ concentration?',
    ['Increasing temperature', 'Decreasing temperature', 'Adding N₂O₄', 'Adding a catalyst'],
    'Increasing temperature',
    'Increasing temperature shifts the endothermic direction (reverse), producing more NO₂.',
    'hard', 90, 2, 'CH5-2', ['temperature', 'NO2', 'exothermic']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'Removing a reactant from an equilibrium system will:',
    ['Shift to produce more reactants', 'Shift to produce more products', 'Not change the system', 'Stop all reactions'],
    'Shift to produce more reactants',
    'Removing reactants causes the system to shift left to replace what was removed.',
    'medium', 60, 1, 'CH5-2', ['removal', 'reactant', 'Le Chatelier']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'For PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), decreasing container volume will:',
    ['Shift left', 'Shift right', 'Not affect equilibrium', 'Increase temperature'],
    'Shift left',
    'Decreasing volume increases pressure, favoring the side with fewer moles (1 vs 2).',
    'hard', 90, 2, 'CH5-2', ['volume', 'pressure', 'PCl5']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'In the Haber process, why is excess nitrogen used?',
    ['To shift equilibrium right', 'To increase temperature', 'To act as a catalyst', 'To decrease pressure'],
    'To shift equilibrium right',
    'Excess N₂ shifts equilibrium to produce more NH₃ (Le Chatelier\'s principle).',
    'medium', 75, 1, 'CH5-2', ['Haber', 'nitrogen', 'excess']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'For an exothermic reaction at equilibrium, decreasing temperature will:',
    ['Favor products', 'Favor reactants', 'Not affect equilibrium', 'Stop the reaction'],
    'Favor products',
    'Decreasing temperature favors exothermic direction (forward), producing more products.',
    'medium', 60, 1, 'CH5-2', ['temperature', 'exothermic', 'products']),

  createQuestion('chemistry', '5', '5.1.2', 'Chem M5 5.1.2',
    'Which industrial process uses Le Chatelier\'s principle to maximize yield?',
    ['Haber process', 'Electrolysis', 'Fractional distillation', 'Chromatography'],
    'Haber process',
    'The Haber process uses high pressure and optimized temperature to maximize NH₃ yield via Le Chatelier.',
    'easy', 60, 1, 'CH5-2', ['Haber', 'industrial', 'yield'])
);

// 5.1.3 - Equilibrium Constants (3 done, adding 12 more = 15 total)
allQuestions.push(
  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'For aA + bB ⇌ cC + dD, the equilibrium constant expression is:',
    ['K = [C][D]/[A][B]', 'K = [C]^c[D]^d/[A]^a[B]^b', 'K = [A]^a[B]^b/[C]^c[D]^d', 'K = [C][D]'],
    'K = [C]^c[D]^d/[A]^a[B]^b',
    'K = products/reactants with stoichiometric coefficients as powers.',
    'hard', 90, 2, 'CH5-2', ['K', 'expression', 'equilibrium constant']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'If K < 1 for a reaction, this means:',
    ['Products favored', 'Reactants favored', 'Equal amounts', 'No reaction occurs'],
    'Reactants favored',
    'K < 1 means denominator (reactants) is larger, so reactants are favored at equilibrium.',
    'medium', 60, 1, 'CH5-2', ['K value', 'reactants', 'interpretation']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'The units of K depend on:',
    ['Temperature only', 'Pressure only', 'The balanced equation', 'K is always unitless'],
    'The balanced equation',
    'K units depend on the stoichiometry - different for each reaction.',
    'hard', 75, 2, 'CH5-2', ['units', 'K', 'stoichiometry']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'For H₂(g) + I₂(g) ⇌ 2HI(g), if K = 50, which is TRUE?',
    ['Mostly H₂ and I₂ at equilibrium', 'Mostly HI at equilibrium', 'Equal amounts', 'Reaction doesn\'t occur'],
    'Mostly HI at equilibrium',
    'K >> 1 means products (HI) are favored at equilibrium.',
    'medium', 75, 1, 'CH5-2', ['K value', 'HI', 'products']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'Temperature change affects K by:',
    ['Changing its value', 'Not affecting it', 'Only increasing it', 'Only decreasing it'],
    'Changing its value',
    'Temperature is the only factor that changes K - pressure and concentration don\'t.',
    'medium', 60, 1, 'CH5-2', ['temperature', 'K', 'change']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'Kp is used for equilibria involving:',
    ['Only gases', 'Only aqueous solutions', 'Only solids', 'All states'],
    'Only gases',
    'Kp uses partial pressures and is only applicable to gas-phase equilibria.',
    'easy', 60, 1, 'CH5-2', ['Kp', 'gases', 'pressure']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), if all concentrations are 1M, and K = 4, the reaction will:',
    ['Shift right', 'Shift left', 'Be at equilibrium', 'Not proceed'],
    'Shift right',
    'Q = [NH₃]²/[N₂][H₂]³ = 1/1 = 1. Since Q < K, reaction shifts right.',
    'hard', 120, 2, 'CH5-2', ['Q', 'K', 'direction']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'The reaction quotient Q is used to:',
    ['Determine if system is at equilibrium', 'Calculate temperature', 'Measure pressure', 'Find concentration'],
    'Determine if system is at equilibrium',
    'Comparing Q to K tells us if the system is at equilibrium or which direction it will shift.',
    'medium', 75, 1, 'CH5-2', ['Q', 'quotient', 'equilibrium']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'If Q > K, the reaction will:',
    ['Shift right', 'Shift left', 'Be at equilibrium', 'Stop'],
    'Shift left',
    'Q > K means too many products, so reaction shifts left to form more reactants.',
    'medium', 60, 1, 'CH5-2', ['Q', 'K', 'shift left']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'For CaCO₃(s) ⇌ CaO(s) + CO₂(g), the K expression is:',
    ['K = [CaO][CO₂]/[CaCO₃]', 'K = [CO₂]', 'K = [CaO]/[CaCO₃]', 'K = 1'],
    'K = [CO₂]',
    'Solids are omitted from K expressions, leaving only [CO₂].',
    'hard', 90, 2, 'CH5-2', ['K', 'solids', 'CaCO3']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'A large K value (K >> 1) indicates:',
    ['Reaction goes to completion', 'Reaction barely proceeds', 'Equal concentrations', 'No products form'],
    'Reaction goes to completion',
    'Large K means products dominate at equilibrium - reaction essentially goes to completion.',
    'easy', 60, 1, 'CH5-2', ['K', 'large', 'completion']),

  createQuestion('chemistry', '5', '5.1.3', 'Chem M5 5.1.3',
    'Kc uses concentrations in:',
    ['mol/L', 'g/L', 'kPa', 'atm'],
    'mol/L',
    'Kc is based on molar concentrations (mol/L or M).',
    'easy', 45, 1, 'CH5-2', ['Kc', 'concentration', 'molarity'])
);

console.log(`Generated ${allQuestions.length} Chemistry questions so far...`);

// Continue with remaining Chemistry dotpoints...
// 5.2.1 - Brønsted-Lowry (2 done, adding 10 more = 12 total)
allQuestions.push(
  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'In the reaction HCl + H₂O → H₃O⁺ + Cl⁻, the Brønsted-Lowry acid is:',
    ['HCl', 'H₂O', 'H₃O⁺', 'Cl⁻'],
    'HCl',
    'HCl donates a proton to H₂O, making it the Brønsted-Lowry acid.',
    'easy', 60, 1, 'CH5-3', ['Brønsted-Lowry', 'acid', 'HCl']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'The conjugate base of H₂SO₄ is:',
    ['HSO₄⁻', 'SO₄²⁻', 'H₂O', 'H₃O⁺'],
    'HSO₄⁻',
    'Removing one H⁺ from H₂SO₄ gives HSO₄⁻, its conjugate base.',
    'medium', 60, 1, 'CH5-3', ['conjugate base', 'H2SO4', 'sulfuric']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'Water can act as:',
    ['Only an acid', 'Only a base', 'Both acid and base', 'Neither acid nor base'],
    'Both acid and base',
    'Water is amphoteric - it can donate or accept protons (act as acid or base).',
    'medium', 60, 1, 'CH5-3', ['water', 'amphoteric', 'both']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'In NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, the conjugate acid-base pairs are:',
    ['NH₃/NH₄⁺ and H₂O/OH⁻', 'NH₃/OH⁻ and H₂O/NH₄⁺', 'NH₃/H₂O and NH₄⁺/OH⁻', 'None present'],
    'NH₃/NH₄⁺ and H₂O/OH⁻',
    'NH₃ (base) → NH₄⁺ (conjugate acid) and H₂O (acid) → OH⁻ (conjugate base).',
    'hard', 90, 2, 'CH5-3', ['conjugate pairs', 'NH3', 'H2O']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'Which is the strongest Brønsted-Lowry acid?',
    ['HCl', 'CH₃COOH', 'NH₄⁺', 'H₂O'],
    'HCl',
    'HCl is a strong acid that completely donates protons in water.',
    'easy', 60, 1, 'CH5-3', ['strong acid', 'HCl', 'strength']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'The conjugate acid of OH⁻ is:',
    ['H₂O', 'H₃O⁺', 'O²⁻', 'H₂O₂'],
    'H₂O',
    'Adding H⁺ to OH⁻ gives H₂O, its conjugate acid.',
    'easy', 60, 1, 'CH5-3', ['conjugate acid', 'OH-', 'water']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'A strong base has a:',
    ['Weak conjugate acid', 'Strong conjugate acid', 'No conjugate acid', 'Neutral conjugate acid'],
    'Weak conjugate acid',
    'Strong bases have weak conjugate acids (and vice versa).',
    'medium', 75, 1, 'CH5-3', ['strong base', 'conjugate', 'weak']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'CH₃COOH is classified as a:',
    ['Strong acid', 'Weak acid', 'Strong base', 'Weak base'],
    'Weak acid',
    'Acetic acid (CH₃COOH) partially ionizes in water, making it a weak acid.',
    'easy', 60, 1, 'CH5-3', ['weak acid', 'acetic', 'CH3COOH']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'In a Brønsted-Lowry acid-base reaction, protons are:',
    ['Created', 'Destroyed', 'Transferred', 'Shared equally'],
    'Transferred',
    'Brønsted-Lowry theory focuses on proton (H⁺) transfer from acid to base.',
    'easy', 60, 1, 'CH5-3', ['proton transfer', 'Brønsted', 'H+']),

  createQuestion('chemistry', '5', '5.2.1', 'Chem M5 5.2.1',
    'HSO₄⁻ can act as:',
    ['Only an acid', 'Only a base', 'Both acid and base', 'Neither'],
    'Both acid and base',
    'HSO₄⁻ is amphiprotic - it can donate H⁺ (to form SO₄²⁻) or accept H⁺ (to form H₂SO₄).',
    'hard', 90, 2, 'CH5-3', ['amphiprotic', 'HSO4-', 'both'])
);

console.log(`Generated ${allQuestions.length} Chemistry questions so far...`);

// Save Chemistry questions
const outputPath = 'scripts/full-question-bank-part1-chemistry.json';
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));

console.log(`\n✅ Generated ${allQuestions.length} Chemistry Module 5 questions (Part 1)`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📊 Coverage so far:`);
console.log(`   5.1.1 Equilibrium: 15 questions`);
console.log(`   5.1.2 Le Chatelier: 20 questions`);
console.log(`   5.1.3 Equilibrium Constants: 15 questions`);
console.log(`   5.2.1 Brønsted-Lowry: 12 questions`);
console.log(`\n🚀 Total: ${allQuestions.length} questions`);
console.log(`\n⏭️  Run part 2 script for remaining Chemistry and all Biology questions!`);
