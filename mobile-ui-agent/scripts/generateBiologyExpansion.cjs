/**
 * Biology Module 5 Expansion - 60+ Additional Questions
 * Complete coverage for all remaining dotpoints
 */

const fs = require('fs');
const allQuestions = [];

const createQ = (subject, moduleId, dotPointId, tabName, question, options, correctAnswer, explanation, difficulty, time_limit, points, syllabus_outcome, keywords) => ({
  subject, moduleId, dotPointId, tabName, question, options, correctAnswer, explanation,
  difficulty, time_limit: time_limit || 60, points: points || 1, syllabus_outcome, keywords, status: 'approved'
});

// ============ IQ2.1 - Inheritance Patterns (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'In Mendel\'s monohybrid cross (Aa × Aa), the genotypic ratio is:',
    ['3:1', '1:2:1', '9:3:3:1', '1:1'],
    '1:2:1',
    'Genotypic ratio: 1 AA : 2 Aa : 1 aa. Phenotypic ratio is 3:1.',
    'medium', 75, 1, 'BIO5-3', ['Mendel', 'genotype', 'ratio']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'A test cross is performed to determine:',
    ['Phenotype', 'Whether an organism is heterozygous or homozygous dominant', 'Number of chromosomes', 'Mutation rate'],
    'Whether an organism is heterozygous or homozygous dominant',
    'Test crossing with a homozygous recessive reveals if the dominant phenotype is AA or Aa.',
    'medium', 75, 1, 'BIO5-3', ['test cross', 'genotype', 'dominant']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'Incomplete dominance results in:',
    ['Dominant phenotype only', 'Recessive phenotype only', 'Blended phenotype', 'No phenotype'],
    'Blended phenotype',
    'Incomplete dominance produces an intermediate phenotype (e.g., red × white = pink).',
    'medium', 60, 1, 'BIO5-3', ['incomplete dominance', 'blended', 'intermediate']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'Codominance differs from incomplete dominance because:',
    ['Both alleles are fully expressed', 'One allele dominates', 'Phenotypes blend', 'No expression occurs'],
    'Both alleles are fully expressed',
    'In codominance, both alleles are expressed separately (e.g., AB blood type).',
    'hard', 90, 2, 'BIO5-3', ['codominance', 'both expressed', 'AB blood']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'A dihybrid cross (AaBb × AaBb) produces a phenotypic ratio of:',
    ['3:1', '1:2:1', '9:3:3:1', '1:1:1:1'],
    '9:3:3:1',
    'Dihybrid crosses with independent assortment yield 9:3:3:1 phenotypic ratio.',
    'hard', 90, 2, 'BIO5-3', ['dihybrid', 'ratio', '9:3:3:1']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'What is a carrier?',
    ['Homozygous dominant individual', 'Heterozygous individual with recessive allele', 'Homozygous recessive individual', 'Individual with mutation'],
    'Heterozygous individual with recessive allele',
    'Carriers are heterozygous (Aa) - they carry but don\'t express the recessive trait.',
    'easy', 60, 1, 'BIO5-3', ['carrier', 'heterozygous', 'recessive']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'Mendel\'s Law of Segregation states:',
    ['Alleles separate during gamete formation', 'Genes are linked', 'Traits blend', 'Mutations are random'],
    'Alleles separate during gamete formation',
    'Each gamete receives one allele from each gene pair during meiosis.',
    'medium', 75, 1, 'BIO5-3', ['segregation', 'Mendel', 'law']),

  createQ('biology', '5', 'IQ2.1', 'Bio M5 IQ2.1',
    'Independent assortment applies to genes that are:',
    ['On the same chromosome', 'On different chromosomes', 'Linked', 'Mutated'],
    'On different chromosomes',
    'Genes on different chromosomes assort independently during meiosis.',
    'medium', 60, 1, 'BIO5-3', ['independent assortment', 'chromosomes', 'unlinked'])
);

// ============ IQ2.2 - Sex Linkage (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'X-linked traits are more common in:',
    ['Females', 'Males', 'Both equally', 'Neither'],
    'Males',
    'Males (XY) only need one recessive allele to express X-linked traits.',
    'easy', 60, 1, 'BIO5-3', ['X-linked', 'males', 'hemizygous']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'A color-blind man (XᶜY) and normal vision woman (XX) have a daughter. The daughter\'s genotype is:',
    ['XᶜXᶜ', 'XᶜX', 'XX', 'XᶜY'],
    'XᶜX',
    'Daughter receives Xᶜ from father and X from mother, making her a carrier.',
    'hard', 90, 2, 'BIO5-3', ['X-linked', 'inheritance', 'carrier']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'Hemophilia is an example of:',
    ['Autosomal dominant', 'Autosomal recessive', 'X-linked recessive', 'Y-linked'],
    'X-linked recessive',
    'Hemophilia is carried on the X chromosome and is recessive.',
    'easy', 60, 1, 'BIO5-3', ['hemophilia', 'X-linked', 'recessive']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'For a female to express an X-linked recessive trait, she must be:',
    ['Heterozygous', 'Homozygous recessive', 'Homozygous dominant', 'Hemizygous'],
    'Homozygous recessive',
    'Females need two recessive alleles (XᶜXᶜ) to express X-linked recessive traits.',
    'medium', 75, 1, 'BIO5-3', ['X-linked', 'female', 'homozygous']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'The SRY gene on the Y chromosome determines:',
    ['Eye color', 'Male sex development', 'Height', 'Intelligence'],
    'Male sex development',
    'The SRY gene triggers male sexual development in embryos.',
    'medium', 60, 1, 'BIO5-3', ['SRY', 'Y chromosome', 'male']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'Calico cats are almost always female because:',
    ['Males can\'t have calico coloring', 'Color genes are X-linked', 'Y chromosome blocks color', 'Males are sterile'],
    'Color genes are X-linked',
    'Calico pattern requires two different X chromosomes (X-inactivation in females).',
    'hard', 90, 2, 'BIO5-3', ['calico', 'X-linked', 'X-inactivation']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'A male cannot pass an X-linked trait to his:',
    ['Daughters', 'Sons', 'Mother', 'Sister'],
    'Sons',
    'Males pass their Y chromosome to sons, so X-linked traits go to daughters only.',
    'medium', 60, 1, 'BIO5-3', ['X-linked', 'inheritance', 'sons']),

  createQ('biology', '5', 'IQ2.2', 'Bio M5 IQ2.2',
    'Pedigrees use which symbol for an affected male?',
    ['Empty circle', 'Filled circle', 'Empty square', 'Filled square'],
    'Filled square',
    'Filled square = affected male, empty square = unaffected male.',
    'easy', 60, 1, 'BIO5-3', ['pedigree', 'symbol', 'male'])
);

// ============ IQ3.1 - Biotechnology Techniques (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Restriction enzymes are used to:',
    ['Cut DNA at specific sequences', 'Copy DNA', 'Translate proteins', 'Destroy cells'],
    'Cut DNA at specific sequences',
    'Restriction endonucleases recognize and cut DNA at specific palindromic sequences.',
    'easy', 60, 1, 'BIO5-4', ['restriction enzyme', 'cut', 'DNA']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Sticky ends are:',
    ['Blunt DNA cuts', 'Overhanging single-stranded DNA', 'Protein attachments', 'RNA primers'],
    'Overhanging single-stranded DNA',
    'Sticky ends are single-stranded overhangs that allow DNA fragments to bond.',
    'medium', 75, 1, 'BIO5-4', ['sticky ends', 'overhang', 'restriction']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Plasmids are commonly used as:',
    ['Energy sources', 'Vectors for gene insertion', 'Antibiotics', 'Enzymes'],
    'Vectors for gene insertion',
    'Plasmids are circular DNA molecules used to carry foreign genes into bacteria.',
    'medium', 60, 1, 'BIO5-4', ['plasmid', 'vector', 'gene insertion']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'The purpose of PCR is to:',
    ['Sequence DNA', 'Amplify DNA', 'Cut DNA', 'Translate DNA'],
    'Amplify DNA',
    'Polymerase Chain Reaction makes millions of copies of a specific DNA sequence.',
    'easy', 60, 1, 'BIO5-4', ['PCR', 'amplify', 'copies']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Taq polymerase is used in PCR because it:',
    ['Works at room temperature', 'Is heat-stable', 'Is cheap', 'Cuts DNA'],
    'Is heat-stable',
    'Taq polymerase from thermophilic bacteria withstands high PCR temperatures.',
    'medium', 75, 1, 'BIO5-4', ['Taq polymerase', 'PCR', 'heat-stable']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Gel electrophoresis separates DNA by:',
    ['Size', 'Color', 'Charge only', 'Temperature'],
    'Size',
    'Smaller DNA fragments move faster through the gel toward the positive electrode.',
    'easy', 60, 1, 'BIO5-4', ['gel electrophoresis', 'size', 'separation']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Recombinant DNA contains:',
    ['Only bacterial DNA', 'DNA from two different sources', 'RNA only', 'Proteins'],
    'DNA from two different sources',
    'Recombinant DNA combines DNA from different organisms (e.g., human gene in bacteria).',
    'medium', 60, 1, 'BIO5-4', ['recombinant DNA', 'two sources', 'combined']),

  createQ('biology', '5', 'IQ3.1', 'Bio M5 IQ3.1',
    'Insulin production using bacteria is an example of:',
    ['Cloning', 'Genetic engineering', 'Natural selection', 'Mutation'],
    'Genetic engineering',
    'Human insulin gene inserted into bacteria allows mass production via genetic engineering.',
    'easy', 60, 1, 'BIO5-4', ['insulin', 'bacteria', 'genetic engineering'])
);

// ============ IQ3.2 - Genetic Technologies (8 more = 10 total) ============
allQuestions.push(
  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'CRISPR-Cas9 acts like molecular:',
    ['Glue', 'Scissors', 'Copier', 'Ruler'],
    'Scissors',
    'CRISPR-Cas9 cuts DNA at precise locations for gene editing.',
    'easy', 60, 1, 'BIO5-4', ['CRISPR', 'Cas9', 'scissors']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'DNA sequencing determines:',
    ['Gene function', 'Order of nucleotides', 'Protein shape', 'Cell type'],
    'Order of nucleotides',
    'Sequencing reveals the exact order of A, T, G, C bases in DNA.',
    'easy', 60, 1, 'BIO5-4', ['sequencing', 'nucleotide order', 'DNA']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'Gene therapy aims to:',
    ['Clone organisms', 'Treat genetic diseases', 'Produce proteins', 'Sequence genomes'],
    'Treat genetic diseases',
    'Gene therapy inserts healthy genes to treat or cure genetic disorders.',
    'medium', 75, 1, 'BIO5-4', ['gene therapy', 'treatment', 'disease']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'The Human Genome Project sequenced:',
    ['All human proteins', 'All human DNA', 'Only disease genes', 'RNA only'],
    'All human DNA',
    'The HGP mapped all ~3 billion base pairs in the human genome.',
    'medium', 60, 1, 'BIO5-4', ['Human Genome Project', 'sequencing', 'DNA']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'Transgenic organisms contain:',
    ['Only native genes', 'Genes from another species', 'No DNA', 'Damaged DNA'],
    'Genes from another species',
    'Transgenic organisms have foreign DNA inserted (e.g., GFP gene in mice).',
    'medium', 60, 1, 'BIO5-4', ['transgenic', 'foreign gene', 'species']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'DNA fingerprinting is used for:',
    ['Curing diseases', 'Identifying individuals', 'Cloning', 'Protein synthesis'],
    'Identifying individuals',
    'DNA fingerprinting analyzes unique patterns in DNA for identification.',
    'easy', 60, 1, 'BIO5-4', ['DNA fingerprinting', 'identification', 'forensics']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'Golden rice is genetically modified to produce:',
    ['Vitamin A', 'Insulin', 'Antibiotics', 'Pesticides'],
    'Vitamin A',
    'Golden rice contains beta-carotene (vitamin A precursor) to combat deficiency.',
    'medium', 75, 1, 'BIO5-4', ['golden rice', 'vitamin A', 'GMO']),

  createQ('biology', '5', 'IQ3.2', 'Bio M5 IQ3.2',
    'Bt crops are resistant to:',
    ['Drought', 'Insects', 'Viruses', 'Fungi'],
    'Insects',
    'Bt crops contain Bacillus thuringiensis toxin gene, making them insect-resistant.',
    'medium', 60, 1, 'BIO5-4', ['Bt crops', 'insect resistance', 'GMO'])
);

console.log(`Generated ${allQuestions.length} questions so far...`);

// Save
fs.writeFileSync('scripts/biology-expansion-batch1.json', JSON.stringify(allQuestions, null, 2));
console.log(`\n✅ Generated ${allQuestions.length} Biology questions (Batch 1)`);
console.log(`📁 Saved to: scripts/biology-expansion-batch1.json`);
console.log(`\n📊 Coverage:`);
console.log(`   IQ2.1 (Inheritance): +8 questions`);
console.log(`   IQ2.2 (Sex Linkage): +8 questions`);
console.log(`   IQ3.1 (Biotechnology): +8 questions`);
console.log(`   IQ3.2 (Technologies): +8 questions`);
console.log(`\n🚀 Total: ${allQuestions.length} new questions`);
console.log(`📊 Current total after upload: ${107 + allQuestions.length} questions`);
