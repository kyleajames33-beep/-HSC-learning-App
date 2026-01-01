/**
 * Generate Complete HSC Quiz Questions
 *
 * Comprehensive set of questions for all Chemistry and Biology Module 5 dotpoints
 */

const allQuestions = [];

// ============ CHEMISTRY MODULE 5 ============

// 5.1.1 - Static and Dynamic Equilibrium (more questions)
allQuestions.push(
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
  }
);

// 5.1.2 - Le Chatelier's Principle (more questions)
allQuestions.push(
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
  }
);

// 5.1.3 - Equilibrium Expressions
allQuestions.push(
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.3',
    tabName: 'Chem M5 5.1.3',
    question: 'For the reaction 2A + B ⇌ C, what is the correct equilibrium expression?',
    options: ['K = [C]/[A][B]', 'K = [C]/[A]²[B]', 'K = [A]²[B]/[C]', 'K = [A][B]/[C]'],
    correctAnswer: 'K = [C]/[A]²[B]',
    explanation: 'The equilibrium constant K = [products]/[reactants] with coefficients as powers: K = [C]/[A]²[B]',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-2',
    keywords: ['equilibrium constant', 'expression', 'calculation'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.3',
    tabName: 'Chem M5 5.1.3',
    question: 'If K >> 1 for a reaction at equilibrium, what does this indicate?',
    options: ['Reactants are favored', 'Products are favored', 'Equal amounts of reactants and products', 'No reaction occurs'],
    correctAnswer: 'Products are favored',
    explanation: 'A large K value means the numerator (products) is much larger than denominator (reactants).',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['equilibrium constant', 'K value', 'products'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.1.3',
    tabName: 'Chem M5 5.1.3',
    question: 'Pure solids and liquids are _____ in equilibrium expressions.',
    options: ['Included with coefficient 1', 'Included with their concentration', 'Omitted', 'Doubled'],
    correctAnswer: 'Omitted',
    explanation: 'Pure solids and liquids have constant concentrations and are omitted from equilibrium expressions.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-2',
    keywords: ['equilibrium expression', 'solids', 'liquids'],
    status: 'approved'
  }
);

// 5.2.1 - Brønsted-Lowry Theory (more questions)
allQuestions.push(
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.1',
    tabName: 'Chem M5 5.2.1',
    question: 'In the reaction NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, which species acts as the Brønsted-Lowry base?',
    options: ['NH₃', 'H₂O', 'NH₄⁺', 'OH⁻'],
    correctAnswer: 'NH₃',
    explanation: 'NH₃ accepts a proton from H₂O to form NH₄⁺, making it the base (proton acceptor).',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-3',
    keywords: ['Brønsted-Lowry', 'base', 'proton acceptor'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.1',
    tabName: 'Chem M5 5.2.1',
    question: 'What is the conjugate acid of H₂O?',
    options: ['OH⁻', 'H₃O⁺', 'H⁺', 'O²⁻'],
    correctAnswer: 'H₃O⁺',
    explanation: 'When H₂O accepts a proton, it forms H₃O⁺ (hydronium ion), which is its conjugate acid.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-3',
    keywords: ['conjugate acid', 'water', 'hydronium'],
    status: 'approved'
  }
);

// 5.2.2 - pH and Calculations (more questions)
allQuestions.push(
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.2',
    tabName: 'Chem M5 5.2.2',
    question: 'A solution has pH = 10. What is the pOH?',
    options: ['4', '10', '7', '14'],
    correctAnswer: '4',
    explanation: 'pH + pOH = 14 at 25°C, so pOH = 14 - 10 = 4',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-4',
    keywords: ['pH', 'pOH', 'calculation'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.2',
    tabName: 'Chem M5 5.2.2',
    question: 'Which solution has the highest concentration of H⁺ ions?',
    options: ['pH = 2', 'pH = 5', 'pH = 7', 'pH = 11'],
    correctAnswer: 'pH = 2',
    explanation: 'Lower pH means higher [H⁺]. pH 2 has [H⁺] = 10⁻² M, the highest concentration listed.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-4',
    keywords: ['pH', 'concentration', 'hydrogen ion'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.2.2',
    tabName: 'Chem M5 5.2.2',
    question: 'If [OH⁻] = 1 × 10⁻⁴ M, what is the pH at 25°C?',
    options: ['4', '10', '14', '7'],
    correctAnswer: '10',
    explanation: 'pOH = -log(10⁻⁴) = 4, then pH = 14 - 4 = 10',
    difficulty: 'hard',
    time_limit: 90,
    points: 2,
    syllabus_outcome: 'CH5-4',
    keywords: ['pH', 'pOH', 'hydroxide', 'calculation'],
    status: 'approved'
  }
);

// 5.3.1 - Buffer Solutions
allQuestions.push(
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.3.1',
    tabName: 'Chem M5 5.3.1',
    question: 'A buffer solution resists changes in:',
    options: ['Temperature', 'pH', 'Pressure', 'Volume'],
    correctAnswer: 'pH',
    explanation: 'Buffer solutions maintain relatively constant pH when small amounts of acid or base are added.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'CH5-5',
    keywords: ['buffer', 'pH', 'resistance'],
    status: 'approved'
  },
  {
    subject: 'chemistry',
    moduleId: '5',
    dotPointId: '5.3.1',
    tabName: 'Chem M5 5.3.1',
    question: 'Which combination would form an effective buffer?',
    options: ['HCl + NaCl', 'CH₃COOH + CH₃COONa', 'NaOH + NaCl', 'HCl + NaOH'],
    correctAnswer: 'CH₃COOH + CH₃COONa',
    explanation: 'A buffer requires a weak acid and its conjugate base (or weak base and its conjugate acid).',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'CH5-5',
    keywords: ['buffer', 'weak acid', 'conjugate base'],
    status: 'approved'
  }
);

// ============ BIOLOGY MODULE 5 ============

// IQ1.1 - Reproduction (more questions)
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.1',
    tabName: 'Bio M5 IQ1.1',
    question: 'What is the main difference between mitosis and meiosis?',
    options: ['Mitosis produces 2 identical cells, meiosis produces 4 different cells', 'Mitosis occurs in gametes, meiosis in somatic cells', 'Mitosis has 2 divisions, meiosis has 1', 'Mitosis produces haploid cells'],
    correctAnswer: 'Mitosis produces 2 identical cells, meiosis produces 4 different cells',
    explanation: 'Mitosis produces 2 diploid identical daughter cells, while meiosis produces 4 haploid genetically different gametes.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-1',
    keywords: ['mitosis', 'meiosis', 'cell division', 'comparison'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.1',
    tabName: 'Bio M5 IQ1.1',
    question: 'During which phase of meiosis does crossing over occur?',
    options: ['Prophase I', 'Metaphase I', 'Prophase II', 'Metaphase II'],
    correctAnswer: 'Prophase I',
    explanation: 'Crossing over (genetic recombination) occurs during Prophase I when homologous chromosomes pair up.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-1',
    keywords: ['crossing over', 'meiosis', 'prophase I', 'recombination'],
    status: 'approved'
  }
);

// IQ1.2 - DNA and Polypeptide Synthesis (more questions)
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.2',
    tabName: 'Bio M5 IQ1.2',
    question: 'What is the role of mRNA in protein synthesis?',
    options: ['Carries genetic code from DNA to ribosome', 'Brings amino acids to ribosome', 'Forms the ribosome structure', 'Stores genetic information'],
    correctAnswer: 'Carries genetic code from DNA to ribosome',
    explanation: 'Messenger RNA (mRNA) carries the genetic code from the nucleus to the ribosome for translation.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['mRNA', 'protein synthesis', 'transcription'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.2',
    tabName: 'Bio M5 IQ1.2',
    question: 'How many nucleotides make up one codon?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    explanation: 'A codon consists of 3 nucleotides and codes for one amino acid.',
    difficulty: 'easy',
    time_limit: 45,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['codon', 'nucleotides', 'genetic code'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.2',
    tabName: 'Bio M5 IQ1.2',
    question: 'Which process occurs in the nucleus?',
    options: ['Translation', 'Transcription', 'tRNA activation', 'Polypeptide folding'],
    correctAnswer: 'Transcription',
    explanation: 'Transcription (DNA → mRNA) occurs in the nucleus. Translation (mRNA → protein) occurs at ribosomes in the cytoplasm.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['transcription', 'nucleus', 'mRNA'],
    status: 'approved'
  }
);

// IQ1.3 - Mutations
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.3',
    tabName: 'Bio M5 IQ1.3',
    question: 'A point mutation that results in a premature stop codon is called:',
    options: ['Silent mutation', 'Missense mutation', 'Nonsense mutation', 'Frameshift mutation'],
    correctAnswer: 'Nonsense mutation',
    explanation: 'A nonsense mutation changes a codon to a stop codon, terminating translation early.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['mutation', 'nonsense', 'stop codon'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ1.3',
    tabName: 'Bio M5 IQ1.3',
    question: 'Which type of mutation involves insertion or deletion of nucleotides?',
    options: ['Point mutation', 'Frameshift mutation', 'Silent mutation', 'Missense mutation'],
    correctAnswer: 'Frameshift mutation',
    explanation: 'Frameshift mutations are caused by insertions or deletions that shift the reading frame.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-2',
    keywords: ['frameshift', 'insertion', 'deletion', 'mutation'],
    status: 'approved'
  }
);

// IQ2.1 - Inheritance Patterns (more questions)
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ2.1',
    tabName: 'Bio M5 IQ2.1',
    question: 'If both parents are heterozygous for a trait (Aa), what percentage of offspring will be homozygous dominant?',
    options: ['0%', '25%', '50%', '75%'],
    correctAnswer: '25%',
    explanation: 'Punnett square: AA (25%), Aa (50%), aa (25%). Only 25% are homozygous dominant (AA).',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-3',
    keywords: ['Punnett square', 'heterozygous', 'genotype ratio'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ2.1',
    tabName: 'Bio M5 IQ2.1',
    question: 'An organism with two identical alleles for a trait is:',
    options: ['Heterozygous', 'Homozygous', 'Codominant', 'Recessive'],
    correctAnswer: 'Homozygous',
    explanation: 'Homozygous means having two identical alleles (AA or aa), heterozygous means different alleles (Aa).',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-3',
    keywords: ['homozygous', 'alleles', 'genotype'],
    status: 'approved'
  }
);

// IQ2.2 - Sex Linkage
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ2.2',
    tabName: 'Bio M5 IQ2.2',
    question: 'Why are X-linked recessive disorders more common in males?',
    options: ['Males have two X chromosomes', 'Males only need one recessive allele', 'Males have stronger genes', 'Y chromosome carries the disorder'],
    correctAnswer: 'Males only need one recessive allele',
    explanation: 'Males (XY) only have one X chromosome, so one recessive allele causes the disorder. Females (XX) need two.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-3',
    keywords: ['X-linked', 'sex linkage', 'recessive', 'males'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ2.2',
    tabName: 'Bio M5 IQ2.2',
    question: 'Which genotype represents a carrier female for an X-linked recessive trait (where Xᴴ = dominant, Xʰ = recessive)?',
    options: ['XᴴXᴴ', 'XᴴXʰ', 'XʰXʰ', 'XᴴY'],
    correctAnswer: 'XᴴXʰ',
    explanation: 'A carrier female is heterozygous (XᴴXʰ) - has one normal and one recessive allele but shows normal phenotype.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-3',
    keywords: ['carrier', 'X-linked', 'heterozygous', 'genotype'],
    status: 'approved'
  }
);

// IQ3.1 - Biotechnology (more questions)
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ3.1',
    tabName: 'Bio M5 IQ3.1',
    question: 'What is the role of DNA ligase in genetic engineering?',
    options: ['Cuts DNA', 'Copies DNA', 'Joins DNA fragments', 'Unwinds DNA'],
    correctAnswer: 'Joins DNA fragments',
    explanation: 'DNA ligase seals the gaps between DNA fragments, joining them into a continuous strand.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-4',
    keywords: ['DNA ligase', 'genetic engineering', 'recombinant DNA'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ3.1',
    tabName: 'Bio M5 IQ3.1',
    question: 'PCR (Polymerase Chain Reaction) is used to:',
    options: ['Cut DNA', 'Amplify DNA', 'Sequence DNA', 'Destroy DNA'],
    correctAnswer: 'Amplify DNA',
    explanation: 'PCR makes millions of copies of a specific DNA segment, amplifying it for analysis or use.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-4',
    keywords: ['PCR', 'amplification', 'DNA'],
    status: 'approved'
  }
);

// IQ3.2 - Genetic Technologies
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ3.2',
    tabName: 'Bio M5 IQ3.2',
    question: 'CRISPR-Cas9 is primarily used for:',
    options: ['DNA sequencing', 'Gene editing', 'Protein synthesis', 'Cell division'],
    correctAnswer: 'Gene editing',
    explanation: 'CRISPR-Cas9 is a gene editing tool that allows precise modifications to DNA sequences.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-4',
    keywords: ['CRISPR', 'gene editing', 'genetic technology'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ3.2',
    tabName: 'Bio M5 IQ3.2',
    question: 'Gel electrophoresis separates DNA fragments based on:',
    options: ['Size', 'Color', 'Temperature', 'pH'],
    correctAnswer: 'Size',
    explanation: 'Gel electrophoresis separates DNA by size - smaller fragments move faster through the gel.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-4',
    keywords: ['gel electrophoresis', 'DNA', 'separation'],
    status: 'approved'
  }
);

// IQ3.3 - Ethical Issues
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ3.3',
    tabName: 'Bio M5 IQ3.3',
    question: 'Which is a valid ethical concern regarding genetic modification?',
    options: ['DNA is too complex to study', 'Potential for unintended ecological consequences', 'Genes cannot be transferred between species', 'All genetic modification is harmful'],
    correctAnswer: 'Potential for unintended ecological consequences',
    explanation: 'Ethical concerns include unknown long-term effects on ecosystems, biodiversity, and food chains.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-5',
    keywords: ['ethics', 'genetic modification', 'ecology'],
    status: 'approved'
  }
);

// IQ4.1 - Natural Selection
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ4.1',
    tabName: 'Bio M5 IQ4.1',
    question: 'Which is NOT a requirement for natural selection to occur?',
    options: ['Variation in traits', 'Heritability of traits', 'Environmental pressure', 'Intentional breeding'],
    correctAnswer: 'Intentional breeding',
    explanation: 'Natural selection requires variation, heritability, and differential survival/reproduction. Intentional breeding is artificial selection.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-6',
    keywords: ['natural selection', 'evolution', 'requirements'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ4.1',
    tabName: 'Bio M5 IQ4.1',
    question: 'Survival of the fittest means:',
    options: ['The strongest organisms survive', 'The most well-adapted organisms reproduce more', 'Only healthy organisms survive', 'Large organisms outcompete small ones'],
    correctAnswer: 'The most well-adapted organisms reproduce more',
    explanation: 'Fitness refers to reproductive success, not physical strength - better-adapted organisms leave more offspring.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-6',
    keywords: ['fitness', 'adaptation', 'natural selection'],
    status: 'approved'
  }
);

// IQ4.2 - Evolution Evidence
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ4.2',
    tabName: 'Bio M5 IQ4.2',
    question: 'Homologous structures in different species suggest:',
    options: ['Convergent evolution', 'Common ancestry', 'Different environmental pressures', 'Unrelated species'],
    correctAnswer: 'Common ancestry',
    explanation: 'Homologous structures (similar anatomy, different functions) indicate descent from a common ancestor.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-6',
    keywords: ['homologous structures', 'evolution', 'common ancestry'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ4.2',
    tabName: 'Bio M5 IQ4.2',
    question: 'Which type of evidence for evolution compares embryonic development?',
    options: ['Fossil record', 'Comparative anatomy', 'Embryology', 'Biogeography'],
    correctAnswer: 'Embryology',
    explanation: 'Embryological evidence shows similarities in early development stages across related species.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-6',
    keywords: ['embryology', 'evolution', 'evidence'],
    status: 'approved'
  }
);

// IQ4.3 - Speciation
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ4.3',
    tabName: 'Bio M5 IQ4.3',
    question: 'Geographic isolation can lead to speciation through:',
    options: ['Artificial selection', 'Allopatric speciation', 'Sympatric speciation', 'Convergent evolution'],
    correctAnswer: 'Allopatric speciation',
    explanation: 'Allopatric speciation occurs when populations are geographically separated and evolve independently.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-7',
    keywords: ['speciation', 'allopatric', 'geographic isolation'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ4.3',
    tabName: 'Bio M5 IQ4.3',
    question: 'Two populations are considered separate species when they:',
    options: ['Look different', 'Live in different areas', 'Cannot interbreed to produce fertile offspring', 'Have different diets'],
    correctAnswer: 'Cannot interbreed to produce fertile offspring',
    explanation: 'The biological species concept defines species as groups that can interbreed and produce fertile offspring.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-7',
    keywords: ['species', 'reproductive isolation', 'speciation'],
    status: 'approved'
  }
);

// IQ5.1 - Ecosystems
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ5.1',
    tabName: 'Bio M5 IQ5.1',
    question: 'Which organisms are primary producers in most ecosystems?',
    options: ['Herbivores', 'Carnivores', 'Plants and algae', 'Decomposers'],
    correctAnswer: 'Plants and algae',
    explanation: 'Primary producers (plants, algae) make their own food through photosynthesis, forming the base of food chains.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-8',
    keywords: ['producers', 'photosynthesis', 'food chain'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ5.1',
    tabName: 'Bio M5 IQ5.1',
    question: 'Energy transfer between trophic levels is approximately:',
    options: ['100%', '50%', '10%', '1%'],
    correctAnswer: '10%',
    explanation: 'Only about 10% of energy transfers between trophic levels; the rest is lost as heat or used for metabolism.',
    difficulty: 'medium',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-8',
    keywords: ['energy transfer', 'trophic levels', '10% rule'],
    status: 'approved'
  }
);

// IQ5.2 - Population Dynamics
allQuestions.push(
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ5.2',
    tabName: 'Bio M5 IQ5.2',
    question: 'Carrying capacity is:',
    options: ['Maximum population an environment can sustain', 'Rate of population growth', 'Number of births per year', 'Total number of species'],
    correctAnswer: 'Maximum population an environment can sustain',
    explanation: 'Carrying capacity (K) is the maximum population size an environment can support with available resources.',
    difficulty: 'easy',
    time_limit: 60,
    points: 1,
    syllabus_outcome: 'BIO5-8',
    keywords: ['carrying capacity', 'population', 'environment'],
    status: 'approved'
  },
  {
    subject: 'biology',
    moduleId: '5',
    dotPointId: 'IQ5.2',
    tabName: 'Bio M5 IQ5.2',
    question: 'Density-dependent factors affecting populations include:',
    options: ['Natural disasters', 'Climate change', 'Competition for resources', 'Seasonal temperature'],
    correctAnswer: 'Competition for resources',
    explanation: 'Density-dependent factors (competition, predation, disease) intensify as population density increases.',
    difficulty: 'medium',
    time_limit: 75,
    points: 1,
    syllabus_outcome: 'BIO5-8',
    keywords: ['density-dependent', 'population', 'competition'],
    status: 'approved'
  }
);

// Save to file
const fs = require('fs');
const outputPath = 'scripts/more-questions.json';
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));

console.log(`✅ Generated ${allQuestions.length} additional questions`);
console.log(`📁 Saved to: ${outputPath}`);

const chemCount = allQuestions.filter(q => q.subject === 'chemistry').length;
const bioCount = allQuestions.filter(q => q.subject === 'biology').length;

console.log(`\n📊 Breakdown:`);
console.log(`   Chemistry: ${chemCount} questions`);
console.log(`   Biology: ${bioCount} questions`);

// Count by dotpoint
const byDotpoint = {};
allQuestions.forEach(q => {
  const key = `${q.subject} ${q.dotPointId}`;
  byDotpoint[key] = (byDotpoint[key] || 0) + 1;
});

console.log(`\n📋 Coverage:`);
Object.entries(byDotpoint).sort().forEach(([key, count]) => {
  console.log(`   ${key}: ${count} questions`);
});
