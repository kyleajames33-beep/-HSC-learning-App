/**
 * Biology Module 5 Final Batch - Evolution, Ecology, Ethics
 * Completing all remaining dotpoints to 200+ total
 */

const fs = require('fs');
const allQuestions = [];

const createQ = (subject, moduleId, dotPointId, tabName, question, options, correctAnswer, explanation, difficulty, time_limit, points, syllabus_outcome, keywords) => ({
  subject, moduleId, dotPointId, tabName, question, options, correctAnswer, explanation,
  difficulty, time_limit: time_limit || 60, points: points || 1, syllabus_outcome, keywords, status: 'approved'
});

// ============ IQ3.3 - Ethical Issues (9 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'A major ethical concern with GMOs is:',
    ['They grow faster', 'Potential ecological impacts', 'They cost less', 'They taste better'],
    'Potential ecological impacts',
    'Unknown long-term effects on ecosystems and biodiversity are key ethical concerns.',
    'medium', 75, 1, 'BIO5-5', ['GMO', 'ethics', 'ecology']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Gene patenting raises ethical issues about:',
    ['Scientific accuracy', 'Ownership of genetic information', 'Cost of research', 'Laboratory safety'],
    'Ownership of genetic information',
    'Patenting genes raises questions about who owns genetic information and access to treatments.',
    'hard', 90, 2, 'BIO5-5', ['patent', 'ownership', 'ethics']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Designer babies raise concerns about:',
    ['Medical costs', 'Eugenics and inequality', 'Laboratory equipment', 'Research funding'],
    'Eugenics and inequality',
    'Selecting traits could lead to discrimination and social inequality.',
    'hard', 90, 2, 'BIO5-5', ['designer babies', 'eugenics', 'inequality']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Informed consent in genetic testing means:',
    ['Testing is free', 'Patients understand risks and benefits', 'Results are guaranteed', 'Testing is mandatory'],
    'Patients understand risks and benefits',
    'Informed consent requires full understanding before undergoing genetic tests.',
    'medium', 75, 1, 'BIO5-5', ['informed consent', 'ethics', 'testing']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Genetic discrimination could occur in:',
    ['Employment and insurance', 'Education only', 'Sports only', 'Art'],
    'Employment and insurance',
    'Genetic information could be used to discriminate in hiring or insurance coverage.',
    'medium', 60, 1, 'BIO5-5', ['discrimination', 'employment', 'insurance']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Animal cloning raises concerns about:',
    ['Cost', 'Animal welfare and suffering', 'Laboratory space', 'Scientific accuracy'],
    'Animal welfare and suffering',
    'Cloning often results in health problems and suffering in cloned animals.',
    'medium', 75, 1, 'BIO5-5', ['cloning', 'animal welfare', 'ethics']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Terminator seeds are controversial because they:',
    ['Grow faster', 'Cannot reproduce', 'Resist all pests', 'Taste better'],
    'Cannot reproduce',
    'Terminator seeds force farmers to buy new seeds annually, raising economic/ethical issues.',
    'hard', 90, 2, 'BIO5-5', ['terminator seeds', 'GMO', 'farmers']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'The precautionary principle in biotechnology suggests:',
    ['Rushing new technologies', 'Proceeding cautiously until safety is proven', 'Banning all technology', 'Ignoring risks'],
    'Proceeding cautiously until safety is proven',
    'The precautionary principle advocates careful assessment before widespread adoption.',
    'medium', 75, 1, 'BIO5-5', ['precautionary principle', 'safety', 'ethics']),

  createQ('biology', '5', 'IQ3.3', 'Bio M5 IQ3.3',
    'Gene therapy ethics focus on:',
    ['Cost only', 'Somatic vs germline modifications', 'Laboratory procedures', 'Research speed'],
    'Somatic vs germline modifications',
    'Germline changes are inherited, raising different ethical concerns than somatic therapy.',
    'hard', 90, 2, 'BIO5-5', ['gene therapy', 'germline', 'somatic'])
);

// ============ IQ4.1 - Natural Selection (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Natural selection acts on:',
    ['Genes', 'Phenotypes', 'Chromosomes', 'DNA'],
    'Phenotypes',
    'Selection acts on observable traits (phenotypes), which then affects gene frequencies.',
    'medium', 75, 1, 'BIO5-6', ['natural selection', 'phenotype', 'traits']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Which is an example of directional selection?',
    ['Average height is favored', 'Antibiotic resistance in bacteria', 'Both extremes favored', 'No change occurs'],
    'Antibiotic resistance in bacteria',
    'Directional selection shifts population toward one extreme (resistant bacteria survive).',
    'hard', 90, 2, 'BIO5-6', ['directional selection', 'antibiotic resistance', 'evolution']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Fitness in evolutionary terms means:',
    ['Physical strength', 'Reproductive success', 'Intelligence', 'Lifespan'],
    'Reproductive success',
    'Fitness = number of offspring that survive to reproduce, not physical ability.',
    'medium', 60, 1, 'BIO5-6', ['fitness', 'reproductive success', 'evolution']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Stabilizing selection favors:',
    ['Extreme phenotypes', 'Average phenotypes', 'New mutations', 'Rare traits'],
    'Average phenotypes',
    'Stabilizing selection reduces variation by favoring intermediate traits (e.g., birth weight).',
    'medium', 75, 1, 'BIO5-6', ['stabilizing selection', 'average', 'variation']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Disruptive selection results in:',
    ['No variation', 'Average phenotypes favored', 'Both extremes favored', 'One extreme favored'],
    'Both extremes favored',
    'Disruptive selection favors both extremes, increasing variation (e.g., beak sizes).',
    'hard', 90, 2, 'BIO5-6', ['disruptive selection', 'extremes', 'variation']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Peppered moth evolution is an example of:',
    ['Artificial selection', 'Natural selection', 'Genetic drift', 'Gene flow'],
    'Natural selection',
    'Dark moths became common during industrial revolution due to selection by predators.',
    'medium', 60, 1, 'BIO5-6', ['peppered moth', 'natural selection', 'industrial melanism']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Vestigial structures are evidence of:',
    ['Current adaptation', 'Evolution from ancestors', 'Intelligent design', 'Recent mutations'],
    'Evolution from ancestors',
    'Vestigial structures (e.g., human appendix) are remnants from evolutionary ancestors.',
    'medium', 75, 1, 'BIO5-6', ['vestigial', 'evolution', 'ancestors']),

  createQ('biology', '5', 'IQ4.1', 'Bio M5 IQ4.1',
    'Sexual selection is a type of natural selection based on:',
    ['Survival ability', 'Mating success', 'Intelligence', 'Size'],
    'Mating success',
    'Sexual selection favors traits that increase mating opportunities, not necessarily survival.',
    'medium', 75, 1, 'BIO5-6', ['sexual selection', 'mating', 'evolution'])
);

// ============ IQ4.2 - Evidence for Evolution (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'The fossil record provides evidence through:',
    ['Living organisms', 'Preserved remains showing change over time', 'DNA only', 'Behavior'],
    'Preserved remains showing change over time',
    'Fossils show transitional forms and evolutionary changes across geological time.',
    'easy', 60, 1, 'BIO5-6', ['fossil record', 'evolution', 'evidence']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'Analogous structures suggest:',
    ['Common ancestry', 'Convergent evolution', 'Same genes', 'No evolution'],
    'Convergent evolution',
    'Analogous structures (e.g., bird/insect wings) evolved independently for similar functions.',
    'hard', 90, 2, 'BIO5-6', ['analogous', 'convergent evolution', 'similar function']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'Molecular biology evidence compares:',
    ['Fossils', 'DNA and protein sequences', 'Behavior', 'Habitats'],
    'DNA and protein sequences',
    'Similar DNA/protein sequences indicate recent common ancestry.',
    'easy', 60, 1, 'BIO5-6', ['molecular', 'DNA', 'evolution']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'Biogeography studies:',
    ['Cell structure', 'Geographic distribution of species', 'DNA only', 'Behavior'],
    'Geographic distribution of species',
    'Species distribution patterns provide evidence of evolution and continental drift.',
    'medium', 60, 1, 'BIO5-6', ['biogeography', 'distribution', 'evolution']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'The vertebrate limb bone pattern (humerus, radius, ulna) shows:',
    ['Convergent evolution', 'Homology', 'Analogy', 'No relationship'],
    'Homology',
    'Same bone structure in different vertebrates indicates common ancestry (homologous).',
    'medium', 75, 1, 'BIO5-6', ['homology', 'limbs', 'common ancestry']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'Comparative embryology shows:',
    ['Adult structures only', 'Similar early development in related species', 'No patterns', 'DNA sequences'],
    'Similar early development in related species',
    'Embryos of related species show similar stages, indicating common ancestry.',
    'medium', 75, 1, 'BIO5-6', ['embryology', 'development', 'evolution']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'Transitional fossils like Archaeopteryx show:',
    ['No evolution', 'Features of both reptiles and birds', 'Only bird features', 'Only reptile features'],
    'Features of both reptiles and birds',
    'Transitional fossils bridge gaps between major groups, showing evolutionary links.',
    'hard', 90, 2, 'BIO5-6', ['transitional fossil', 'Archaeopteryx', 'evolution']),

  createQ('biology', '5', 'IQ4.2', 'Bio M5 IQ4.2',
    'Cytochrome c protein similarity indicates:',
    ['Habitat preference', 'Evolutionary relationships', 'Diet', 'Size'],
    'Evolutionary relationships',
    'More similar cytochrome c sequences = more recent common ancestor.',
    'medium', 75, 1, 'BIO5-6', ['cytochrome c', 'molecular', 'relationships'])
);

// ============ IQ4.3 - Speciation (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Reproductive isolation leads to:',
    ['Extinction', 'Speciation', 'Increased variation within species', 'No change'],
    'Speciation',
    'When populations can\'t interbreed, they diverge and form new species.',
    'medium', 60, 1, 'BIO5-7', ['reproductive isolation', 'speciation', 'evolution']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Sympatric speciation occurs:',
    ['With geographic separation', 'Without geographic separation', 'Only in plants', 'Only in animals'],
    'Without geographic separation',
    'Sympatric speciation happens in the same location (e.g., polyploidy in plants).',
    'hard', 90, 2, 'BIO5-7', ['sympatric', 'same location', 'speciation']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Prezygotic barriers prevent:',
    ['Embryo development', 'Fertilization', 'Adult survival', 'Feeding'],
    'Fertilization',
    'Prezygotic barriers (behavioral, temporal, mechanical) prevent mating/fertilization.',
    'medium', 75, 1, 'BIO5-7', ['prezygotic', 'fertilization', 'barriers']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Postzygotic barriers result in:',
    ['Preventing mating', 'Hybrid inviability or sterility', 'No effect', 'Increased fitness'],
    'Hybrid inviability or sterility',
    'Postzygotic barriers cause hybrid offspring to die or be sterile (e.g., mules).',
    'medium', 75, 1, 'BIO5-7', ['postzygotic', 'hybrid', 'sterility']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Polyploidy is common in:',
    ['Animals', 'Plants', 'Bacteria', 'Viruses'],
    'Plants',
    'Polyploidy (extra chromosome sets) is a rapid speciation mechanism in plants.',
    'medium', 60, 1, 'BIO5-7', ['polyploidy', 'plants', 'chromosomes']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Darwin\'s finches evolved through:',
    ['Artificial selection', 'Adaptive radiation', 'Genetic drift', 'Gene flow'],
    'Adaptive radiation',
    'Finches rapidly diversified to fill different ecological niches on Galápagos Islands.',
    'hard', 90, 2, 'BIO5-7', ['adaptive radiation', 'Darwin\'s finches', 'speciation']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Temporal isolation occurs when:',
    ['Species live in different areas', 'Species breed at different times', 'Offspring are sterile', 'Species look different'],
    'Species breed at different times',
    'Temporal isolation prevents mating due to different breeding seasons/times.',
    'medium', 60, 1, 'BIO5-7', ['temporal isolation', 'breeding time', 'prezygotic']),

  createQ('biology', '5', 'IQ4.3', 'Bio M5 IQ4.3',
    'Ring species demonstrate:',
    ['No evolution', 'Gradual speciation around a barrier', 'Rapid speciation', 'Extinction'],
    'Gradual speciation around a barrier',
    'Ring species show populations that can interbreed with neighbors but not at the ends.',
    'hard', 90, 2, 'BIO5-7', ['ring species', 'gradual', 'speciation'])
);

// ============ IQ5.1 - Ecosystems (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'Decomposers recycle:',
    ['Water only', 'Nutrients from dead organisms', 'Energy', 'Sunlight'],
    'Nutrients from dead organisms',
    'Decomposers (bacteria, fungi) break down dead matter, releasing nutrients for reuse.',
    'easy', 60, 1, 'BIO5-8', ['decomposers', 'nutrients', 'recycling']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'Trophic levels represent:',
    ['Geographic areas', 'Feeding positions in food chains', 'Species count', 'Temperature zones'],
    'Feeding positions in food chains',
    'Trophic levels show energy transfer: producers → herbivores → carnivores.',
    'easy', 60, 1, 'BIO5-8', ['trophic levels', 'food chain', 'energy']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'A food web is more realistic than a food chain because it shows:',
    ['One pathway', 'Multiple interconnected pathways', 'Only plants', 'Only animals'],
    'Multiple interconnected pathways',
    'Food webs show complex feeding relationships, not just linear chains.',
    'medium', 75, 1, 'BIO5-8', ['food web', 'complex', 'relationships']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'Biomass pyramids show:',
    ['Energy flow', 'Total mass at each trophic level', 'Species count', 'Water availability'],
    'Total mass at each trophic level',
    'Biomass pyramids display the dry mass of organisms at each trophic level.',
    'medium', 60, 1, 'BIO5-8', ['biomass', 'pyramid', 'trophic']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'The carbon cycle involves:',
    ['Only animals', 'Photosynthesis, respiration, and decomposition', 'Only plants', 'Water only'],
    'Photosynthesis, respiration, and decomposition',
    'Carbon cycles through atmosphere, organisms, and soil via these processes.',
    'medium', 75, 1, 'BIO5-8', ['carbon cycle', 'photosynthesis', 'respiration']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'Nitrogen fixation is performed by:',
    ['All plants', 'Certain bacteria', 'Animals', 'Fungi'],
    'Certain bacteria',
    'Nitrogen-fixing bacteria convert atmospheric N₂ into usable forms (ammonia).',
    'medium', 60, 1, 'BIO5-8', ['nitrogen fixation', 'bacteria', 'nitrogen cycle']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'Why is energy flow one-way in ecosystems?',
    ['Energy is recycled', 'Energy is lost as heat', 'Energy increases', 'Energy is stored'],
    'Energy is lost as heat',
    'Each trophic level loses ~90% of energy as heat, preventing recycling.',
    'hard', 90, 2, 'BIO5-8', ['energy flow', 'heat loss', 'one-way']),

  createQ('biology', '5', 'IQ5.1', 'Bio M5 IQ5.1',
    'Keystone species:',
    ['Are the most numerous', 'Have disproportionate impact on ecosystem', 'Are always predators', 'Are extinct'],
    'Have disproportionate impact on ecosystem',
    'Keystone species (e.g., sea otters) affect ecosystem structure far beyond their numbers.',
    'hard', 90, 2, 'BIO5-8', ['keystone species', 'ecosystem', 'impact'])
);

// ============ IQ5.2 - Population Dynamics (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'Exponential growth occurs when:',
    ['Resources are limited', 'Resources are unlimited', 'Population is at carrying capacity', 'Death rate exceeds birth rate'],
    'Resources are unlimited',
    'Exponential growth (J-curve) occurs with unlimited resources and no limiting factors.',
    'medium', 75, 1, 'BIO5-8', ['exponential growth', 'J-curve', 'unlimited']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'Logistic growth produces a:',
    ['J-curve', 'S-curve', 'Linear graph', 'No curve'],
    'S-curve',
    'Logistic growth (S-curve) shows slowing growth as carrying capacity is reached.',
    'easy', 60, 1, 'BIO5-8', ['logistic growth', 'S-curve', 'carrying capacity']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'Density-independent factors include:',
    ['Competition', 'Disease', 'Natural disasters', 'Predation'],
    'Natural disasters',
    'Density-independent factors (floods, fires) affect populations regardless of density.',
    'medium', 75, 1, 'BIO5-8', ['density-independent', 'natural disasters', 'population']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'r-selected species typically:',
    ['Produce many offspring with little care', 'Produce few offspring with much care', 'Are large', 'Live long'],
    'Produce many offspring with little care',
    'r-strategists (e.g., insects, fish) reproduce quickly with high offspring numbers.',
    'hard', 90, 2, 'BIO5-8', ['r-selected', 'many offspring', 'strategy']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'K-selected species are characterized by:',
    ['Rapid reproduction', 'Slow development, few offspring', 'Short lifespan', 'No parental care'],
    'Slow development, few offspring',
    'K-strategists (e.g., elephants, humans) invest heavily in few offspring.',
    'hard', 90, 2, 'BIO5-8', ['K-selected', 'few offspring', 'parental care']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'Intraspecific competition occurs between:',
    ['Different species', 'Same species members', 'Predator and prey', 'Plants and animals'],
    'Same species members',
    'Intraspecific = within species competition (e.g., lions competing for territory).',
    'medium', 60, 1, 'BIO5-8', ['intraspecific', 'competition', 'same species']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'Population overshoot results in:',
    ['Stable population', 'Population exceeds carrying capacity then crashes', 'Extinction immediately', 'No change'],
    'Population exceeds carrying capacity then crashes',
    'Overshoot occurs when population temporarily exceeds K, depleting resources.',
    'hard', 90, 2, 'BIO5-8', ['overshoot', 'crash', 'carrying capacity']),

  createQ('biology', '5', 'IQ5.2', 'Bio M5 IQ5.2',
    'Survivorship curves show:',
    ['Birth rates', 'Death rates at different ages', 'Population size', 'Immigration'],
    'Death rates at different ages',
    'Survivorship curves plot survival vs age (Type I, II, III patterns).',
    'medium', 75, 1, 'BIO5-8', ['survivorship curve', 'death rate', 'age'])
);

console.log(`Generated ${allQuestions.length} questions...`);

// Save
fs.writeFileSync('scripts/biology-final-batch.json', JSON.stringify(allQuestions, null, 2));
console.log(`\n✅ Generated ${allQuestions.length} Biology questions (Final Batch)`);
console.log(`📁 Saved to: scripts/biology-final-batch.json`);
console.log(`\n📊 Coverage:`);
console.log(`   IQ3.3 (Ethics): +9 questions`);
console.log(`   IQ4.1 (Natural Selection): +8 questions`);
console.log(`   IQ4.2 (Evidence for Evolution): +8 questions`);
console.log(`   IQ4.3 (Speciation): +8 questions`);
console.log(`   IQ5.1 (Ecosystems): +8 questions`);
console.log(`   IQ5.2 (Population Dynamics): +8 questions`);
console.log(`\n🚀 Total new: ${allQuestions.length} questions`);
console.log(`📊 GRAND TOTAL after all uploads: ${107 + 32 + allQuestions.length} questions!`);
