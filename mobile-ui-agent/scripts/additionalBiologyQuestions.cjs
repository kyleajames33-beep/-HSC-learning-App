/**
 * Additional Biology Module 5 quiz questions.
 *
 * These questions supplement the existing Google Sheets bank so that
 * each dotpoint can reach 20 multiple-choice items after merging.
 *
 * Usage:
 *   node additionalBiologyQuestions.cjs [output.json]
 */

const fs = require('fs');
const path = require('path');

const DOTPOINT_TABS = {
  'IQ1.1': 'Bio M5 IQ1.1',
  'IQ1.2': 'Bio M5 IQ1.2',
  'IQ1.3': 'Bio M5 IQ1.3',
  'IQ2.1': 'Bio M5 IQ2.1',
  'IQ2.2': 'Bio M5 IQ2.2',
  'IQ3.1': 'Bio M5 IQ3.1',
  'IQ3.2': 'Bio M5 IQ3.2',
  'IQ3.3': 'Bio M5 IQ3.3',
  'IQ4.1': 'Bio M5 IQ4.1',
  'IQ4.2': 'Bio M5 IQ4.2',
  'IQ4.3': 'Bio M5 IQ4.3',
  'IQ5.1': 'Bio M5 IQ5.1',
  'IQ5.2': 'Bio M5 IQ5.2',
};

const createQuestion = (
  dotPointId,
  {
    question,
    options,
    answer,
    explanation,
    difficulty = 'medium',
    time_limit = 75,
    points = 1,
    syllabus = 'BIO5-5',
    keywords = [],
  },
) => ({
  subject: 'biology',
  moduleId: '5',
  dotPointId,
  tabName: DOTPOINT_TABS[dotPointId],
  question,
  options,
  correctAnswer: answer,
  explanation,
  difficulty,
  time_limit,
  points,
  syllabus_outcome: syllabus,
  keywords,
  status: 'approved',
});

const DATA = {
  'IQ1.1': [
    {
      question: 'The chiasmata seen in meiosis represent:',
      options: [
        'Centromeres attaching spindle fibres',
        'Pairing of sister chromatids',
        'Sites of crossing over between homologous chromosomes',
        'Regions of DNA replication',
      ],
      answer: 'Sites of crossing over between homologous chromosomes',
      explanation:
        'Chiasmata are visible points where non-sister chromatids exchange segments during crossing over.',
      difficulty: 'hard',
      time_limit: 90,
      syllabus: 'BIO5-1',
      keywords: ['chiasmata', 'crossing over', 'meiosis'],
    },
    {
      question: 'Which reproductive strategy is most advantageous in rapidly changing environments?',
      options: [
        'Binary fission',
        'Fragmentation',
        'Sexual reproduction',
        'Parthenogenesis',
      ],
      answer: 'Sexual reproduction',
      explanation:
        'Sexual reproduction creates new allele combinations, improving resilience to environmental change.',
      syllabus: 'BIO5-1',
      keywords: ['sexual reproduction', 'variation', 'adaptation'],
    },
    {
      question: 'Gametes differ from somatic cells because they:',
      options: [
        'Are always larger',
        'Contain half the chromosome number',
        'Carry only dominant alleles',
        'Contain more mitochondria',
      ],
      answer: 'Contain half the chromosome number',
      explanation:
        'Gametes are haploid (n), so fertilisation restores the diploid chromosome number.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-1',
      keywords: ['gametes', 'haploid', 'chromosome number'],
    },
    {
      question: 'External fertilisation occurs when:',
      options: [
        'Gametes fuse outside the body in the environment',
        'Eggs and sperm meet inside the female reproductive tract',
        'Organisms reproduce asexually',
        'Embryos implant into the uterus',
      ],
      answer: 'Gametes fuse outside the body in the environment',
      explanation:
        'External fertilisation, common in aquatic species, involves releasing gametes into water.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-1',
      keywords: ['external fertilisation', 'aquatic', 'reproduction'],
    },
    {
      question: 'Spore formation in ferns is an example of:',
      options: [
        'Sexual reproduction',
        'Asexual reproduction',
        'Internal fertilisation',
        'Concerted evolution',
      ],
      answer: 'Asexual reproduction',
      explanation:
        'Spores are produced without gamete fusion, generating genetically identical offspring.',
      syllabus: 'BIO5-1',
      keywords: ['spores', 'asexual reproduction', 'plants'],
    },
    {
      question: 'Independent assortment contributes to variation because:',
      options: [
        'Homologous pairs align randomly at metaphase I',
        'Chromosomes duplicate twice',
        'Mutations always occur',
        'Gametes are genetically identical',
      ],
      answer: 'Homologous pairs align randomly at metaphase I',
      explanation:
        'Independent assortment shuffles maternal and paternal chromosomes into unique gametes.',
      syllabus: 'BIO5-1',
      keywords: ['independent assortment', 'metaphase I', 'variation'],
    },
    {
      question: 'Fertilisation restores the diploid number by:',
      options: [
        'Duplicating each chromosome',
        'Fusing two haploid gametes',
        'Removing extra DNA',
        'Triggering mitosis',
      ],
      answer: 'Fusing two haploid gametes',
      explanation:
        'Meiosis halves the chromosome number; fertilisation combines haploid gametes to recreate diploidy.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-1',
      keywords: ['fertilisation', 'diploid', 'haploid'],
    },
    {
      question: 'Yeast primarily reproduce by:',
      options: ['Budding', 'Parthenogenesis', 'Fragmentation', 'Binary fission in water'],
      answer: 'Budding',
      explanation:
        'Yeast undergo asexual budding, forming a daughter cell on the parent that eventually detaches.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-1',
      keywords: ['yeast', 'budding', 'asexual'],
    },
    {
      question: 'During which meiotic stage do homologous chromosomes separate?',
      options: ['Anaphase I', 'Prophase I', 'Anaphase II', 'Telophase II'],
      answer: 'Anaphase I',
      explanation:
        'Homologues separate in Anaphase I; sister chromatids separate in Anaphase II.',
      syllabus: 'BIO5-1',
      keywords: ['anaphase I', 'homologous chromosomes', 'meiosis'],
    },
    {
      question: 'Parthenogenesis is:',
      options: [
        'Development of an embryo from an unfertilised egg',
        'Fusion of two eggs',
        'Fragmentation of a parent organism',
        'Mitotic division of a zygote',
      ],
      answer: 'Development of an embryo from an unfertilised egg',
      explanation:
        'Parthenogenesis is an asexual process producing offspring without fertilisation.',
      syllabus: 'BIO5-1',
      keywords: ['parthenogenesis', 'asexual reproduction', 'egg'],
    },
  ],
  'IQ1.2': [
    {
      question: 'RNA polymerase functions during transcription to:',
      options: [
        'Join amino acids together',
        'Synthesise RNA complementary to the DNA template',
        'Proofread replicated DNA',
        'Transport amino acids to the ribosome',
      ],
      answer: 'Synthesise RNA complementary to the DNA template',
      explanation:
        'RNA polymerase reads the DNA template strand and builds the pre-mRNA molecule.',
      syllabus: 'BIO5-2',
      keywords: ['transcription', 'RNA polymerase', 'mRNA'],
    },
    {
      question: 'An anticodon of CUA on tRNA pairs with which mRNA codon?',
      options: ['GAU', 'GAT', 'CUA', 'CAU'],
      answer: 'GAU',
      explanation:
        'Codon–anticodon pairing follows complementary base rules (C with G, U with A).',
      difficulty: 'medium',
      syllabus: 'BIO5-2',
      keywords: ['anticodon', 'tRNA', 'base pairing'],
    },
    {
      question: 'During translation, initiation begins when:',
      options: [
        'The ribosome binds to the mRNA start codon',
        'Amino acids are linked into a chain',
        'The polypeptide is released',
        'DNA unwinds and exposes bases',
      ],
      answer: 'The ribosome binds to the mRNA start codon',
      explanation:
        'Initiation occurs when the small ribosomal subunit attaches to mRNA at the start codon.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-2',
      keywords: ['translation', 'initiation', 'ribosome'],
    },
    {
      question: 'Which option describes the primary structure of a protein?',
      options: [
        'Interactions between R groups forming 3D shape',
        'Sequence of amino acids in the polypeptide chain',
        'Hydrogen bonding forming alpha-helices',
        'Association of multiple subunits',
      ],
      answer: 'Sequence of amino acids in the polypeptide chain',
      explanation:
        'Primary structure refers to the linear order of amino acids encoded by DNA.',
      syllabus: 'BIO5-2',
      keywords: ['protein structure', 'primary', 'amino acids'],
    },
    {
      question: 'Introns are best described as:',
      options: [
        'Coding sequences translated into protein',
        'Non-coding sequences removed from pre-mRNA',
        'RNA primers used in replication',
        'Ribosomal RNA components',
      ],
      answer: 'Non-coding sequences removed from pre-mRNA',
      explanation:
        'Introns are excised during RNA processing to create mature mRNA containing only exons.',
      syllabus: 'BIO5-2',
      keywords: ['introns', 'RNA splicing', 'gene expression'],
    },
    {
      question: 'Which enzyme joins Okazaki fragments on the lagging strand?',
      options: ['Helicase', 'DNA ligase', 'DNA polymerase III', 'Primase'],
      answer: 'DNA ligase',
      explanation:
        'DNA ligase seals the sugar-phosphate backbone between Okazaki fragments.',
      syllabus: 'BIO5-2',
      keywords: ['DNA ligase', 'Okazaki fragments', 'replication'],
    },
    {
      question: 'A substitution in the third base of a codon may be silent because:',
      options: [
        'The genetic code is degenerate',
        'Proofreading always fixes it',
        'It forms a stop codon automatically',
        'Introns absorb the change',
      ],
      answer: 'The genetic code is degenerate',
      explanation:
        'Multiple codons can encode the same amino acid, so some substitutions do not alter the protein.',
      difficulty: 'hard',
      time_limit: 90,
      syllabus: 'BIO5-2',
      keywords: ['silent mutation', 'degeneracy', 'codon'],
    },
    {
      question: 'Helicase is responsible for:',
      options: [
        'Synthesising RNA primers',
        'Unwinding the DNA double helix ahead of the replication fork',
        'Joining nucleotides during replication',
        'Sealing Okazaki fragments',
      ],
      answer: 'Unwinding the DNA double helix ahead of the replication fork',
      explanation:
        'Helicase separates complementary DNA strands to allow replication enzymes to access the template.',
      syllabus: 'BIO5-2',
      keywords: ['helicase', 'replication fork', 'DNA unwinding'],
    },
    {
      question: 'Translation elongation continues until the ribosome reaches:',
      options: ['A start codon', 'A stop codon', 'The origin of replication', 'An intron'],
      answer: 'A stop codon',
      explanation:
        'Release factors bind at the stop codon, causing the ribosome to disengage and release the polypeptide.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-2',
      keywords: ['translation', 'stop codon', 'elongation'],
    },
    {
      question: 'Alternative splicing allows a single gene to produce:',
      options: [
        'Only one protein product',
        'Multiple protein isoforms from different exon combinations',
        'Proteins without exons',
        'DNA copies without transcription',
      ],
      answer: 'Multiple protein isoforms from different exon combinations',
      explanation:
        'Exons can be combined in different arrangements, creating diverse proteins from one gene.',
      difficulty: 'hard',
      time_limit: 90,
      syllabus: 'BIO5-2',
      keywords: ['alternative splicing', 'gene expression', 'isoforms'],
    },
  ],
  'IQ1.3': [
    {
      question: 'A nonsense mutation results in:',
      options: [
        'An amino acid substitution',
        'A premature stop codon',
        'A frameshift',
        'Duplication of a gene',
      ],
      answer: 'A premature stop codon',
      explanation:
        'Nonsense mutations convert an amino acid codon into a stop codon, truncating the protein.',
      difficulty: 'hard',
      time_limit: 90,
      syllabus: 'BIO5-2',
      keywords: ['nonsense mutation', 'stop codon', 'protein'],
    },
    {
      question: 'Which of the following is a mutagen?',
      options: ['UV radiation', 'Water', 'Glucose', 'Oxygen'],
      answer: 'UV radiation',
      explanation:
        'UV light induces thymine dimers, increasing the chance of replication errors.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-2',
      keywords: ['mutagen', 'UV', 'DNA damage'],
    },
    {
      question: 'Somatic mutations differ from germline mutations because they:',
      options: [
        'Occur in gametes',
        'Are inherited by offspring',
        'Occur in body cells and are not passed on',
        'Always cause disease',
      ],
      answer: 'Occur in body cells and are not passed on',
      explanation:
        'Somatic mutations affect only the individual, whereas germline mutations can be inherited.',
      syllabus: 'BIO5-2',
      keywords: ['somatic mutation', 'germline', 'inheritance'],
    },
    {
      question: 'Down syndrome is caused by:',
      options: [
        'Monosomy 21',
        'Trisomy 21 due to non-disjunction',
        'Point mutation in beta-globin',
        'Deletion of chromosome 21',
      ],
      answer: 'Trisomy 21 due to non-disjunction',
      explanation:
        'Failure of chromosome 21 to separate during meiosis leads to gametes with an extra chromosome.',
      syllabus: 'BIO5-2',
      keywords: ['trisomy 21', 'non-disjunction', 'chromosome'],
    },
    {
      question: 'Frameshift mutations typically arise from:',
      options: [
        'Substitution of a single base',
        'Insertion or deletion not in multiples of three bases',
        'Duplication of the genome',
        'Crossing over during meiosis',
      ],
      answer: 'Insertion or deletion not in multiples of three bases',
      explanation:
        'Adding or removing bases shifts the reading frame, altering downstream codons.',
      difficulty: 'hard',
      syllabus: 'BIO5-2',
      keywords: ['frameshift', 'insertion', 'deletion'],
    },
    {
      question: 'Sickle cell disease is caused by:',
      options: [
        'A deletion of a chromosome',
        'A missense mutation in the beta-globin gene',
        'A nonsense mutation in insulin',
        'Triploidy',
      ],
      answer: 'A missense mutation in the beta-globin gene',
      explanation:
        'A single base substitution changes glutamic acid to valine in haemoglobin, causing sickling.',
      syllabus: 'BIO5-2',
      keywords: ['sickle cell', 'missense', 'point mutation'],
    },
    {
      question: 'Mismatch repair corrects:',
      options: [
        'Double-strand breaks',
        'Replication errors that escape polymerase proofreading',
        'Chromosome non-disjunction',
        'UV-induced thymine dimers',
      ],
      answer: 'Replication errors that escape polymerase proofreading',
      explanation:
        'Mismatch repair enzymes detect and replace incorrectly paired bases shortly after replication.',
      difficulty: 'hard',
      syllabus: 'BIO5-2',
      keywords: ['mismatch repair', 'DNA replication', 'mutation'],
    },
    {
      question: 'Which technology can detect chromosomal abnormalities in prenatal screening?',
      options: ['Karyotyping', 'ELISA', 'PCR', 'Mass spectrometry'],
      answer: 'Karyotyping',
      explanation:
        'Karyotypes display whole chromosomes, revealing aneuploidies such as trisomies or monosomies.',
      syllabus: 'BIO5-2',
      keywords: ['karyotype', 'chromosome', 'prenatal'],
    },
    {
      question: 'CRISPR-Cas9 gene knockouts allow scientists to:',
      options: [
        'Clone organisms',
        'Disable specific genes to study their function',
        'Increase mutation rates randomly',
        'Prevent transcription entirely',
      ],
      answer: 'Disable specific genes to study their function',
      explanation:
        'Targeted gene disruption reveals the phenotype associated with loss of function.',
      syllabus: 'BIO5-2',
      keywords: ['CRISPR', 'gene knockout', 'functional genomics'],
    },
    {
      question: 'Silent mutations:',
      options: [
        'Always change the amino acid sequence',
        'Do not alter the encoded amino acid',
        'Delete large sections of DNA',
        'Create new start codons',
      ],
      answer: 'Do not alter the encoded amino acid',
      explanation:
        'Silent mutations change a codon to another that encodes the same amino acid.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-2',
      keywords: ['silent mutation', 'codon', 'redundancy'],
    },
  ],
  'IQ2.1': [
    {
      question: 'A cross between AA and aa parents produces offspring that are:',
      options: ['All AA', 'All Aa', 'Half AA and half aa', 'All aa'],
      answer: 'All Aa',
      explanation:
        'Crossing a homozygous dominant and homozygous recessive parent yields heterozygous offspring.',
      syllabus: 'BIO5-3',
      keywords: ['inheritance', 'heterozygous', 'Punnett'],
    },
    {
      question: 'Epistasis occurs when:',
      options: [
        'Genes assort independently',
        'One gene masks or modifies the expression of another gene',
        'Two alleles blend evenly',
        'A mutation alters the reading frame',
      ],
      answer: 'One gene masks or modifies the expression of another gene',
      explanation:
        'Epistatic interactions alter phenotypic ratios because one gene influences another gene’s expression.',
      difficulty: 'hard',
      syllabus: 'BIO5-3',
      keywords: ['epistasis', 'gene interaction', 'phenotype'],
    },
    {
      question: 'Polygenic inheritance typically produces:',
      options: [
        'Discrete phenotypic classes',
        'Continuous variation with a bell-shaped distribution',
        'No phenotypic variation',
        'Only recessive phenotypes',
      ],
      answer: 'Continuous variation with a bell-shaped distribution',
      explanation:
        'Many genes contribute small effects, producing continuous traits like height or skin colour.',
      syllabus: 'BIO5-3',
      keywords: ['polygenic', 'continuous variation', 'traits'],
    },
    {
      question: 'A pedigree showing the trait in every generation suggests:',
      options: [
        'Autosomal dominant inheritance',
        'Autosomal recessive inheritance',
        'X-linked recessive inheritance',
        'Environmental influence only',
      ],
      answer: 'Autosomal dominant inheritance',
      explanation:
        'Dominant traits often appear in each generation because only one allele is required for expression.',
      syllabus: 'BIO5-3',
      keywords: ['pedigree', 'dominant', 'inheritance'],
    },
    {
      question: 'Two heterozygous parents (Aa) for a recessive disorder have a child. Probability the child is affected:',
      options: ['0%', '25%', '50%', '75%'],
      answer: '25%',
      explanation:
        'Aa × Aa produces aa in one out of four outcomes, giving a 25% chance of an affected child.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-3',
      keywords: ['probability', 'recessive', 'Punnett'],
    },
    {
      question: 'A 9:3:4 phenotypic ratio in a dihybrid cross is evidence of:',
      options: [
        'Incomplete dominance',
        'Recessive epistasis',
        'Sex-linked inheritance',
        'Multiple alleles',
      ],
      answer: 'Recessive epistasis',
      explanation:
        'A recessive epistatic gene masks another locus, altering the 9:3:3:1 ratio to 9:3:4.',
      difficulty: 'hard',
      syllabus: 'BIO5-3',
      keywords: ['epistasis', 'dihybrid', 'ratios'],
    },
    {
      question: 'Which cross yields a 1:1 phenotypic ratio?',
      options: ['AA × aa', 'Aa × aa', 'Aa × Aa', 'AA × Aa'],
      answer: 'Aa × aa',
      explanation:
        'Crossing a heterozygote with a homozygous recessive individual produces half dominant and half recessive phenotypes.',
      syllabus: 'BIO5-3',
      keywords: ['test cross', 'phenotype', 'inheritance'],
    },
    {
      question: 'Linkage between genes reduces independent assortment because the genes are:',
      options: [
        'On different chromosomes',
        'Close together on the same chromosome',
        'All recessive',
        'Expressed only in males',
      ],
      answer: 'Close together on the same chromosome',
      explanation:
        'Linked genes tend to be inherited together unless crossing over separates them.',
      syllabus: 'BIO5-3',
      keywords: ['linkage', 'chromosome', 'inheritance'],
    },
    {
      question: 'Environmental effects on phenotype are evident when:',
      options: [
        'Genotype changes in response to environment',
        'External factors alter gene expression (e.g., temperature-dependent coat colour)',
        'Genes mutate under stress',
        'Only the environment determines phenotype',
      ],
      answer:
        'External factors alter gene expression (e.g., temperature-dependent coat colour)',
      explanation:
        'Phenotype is influenced by genotype and environment; some alleles are temperature sensitive.',
      syllabus: 'BIO5-3',
      keywords: ['environment', 'phenotype', 'gene expression'],
    },
    {
      question: 'A lethal allele that kills homozygotes but not heterozygotes appears in pedigrees as:',
      options: [
        'Present but never seen in homozygous dominant individuals',
        'Absent from all generations',
        'Only affecting females',
        'Always expressed in offspring',
      ],
      answer: 'Present but never seen in homozygous dominant individuals',
      explanation:
        'Homozygous lethal combinations do not survive, so only heterozygotes and unaffected individuals appear.',
      difficulty: 'hard',
      syllabus: 'BIO5-3',
      keywords: ['lethal allele', 'pedigree', 'inheritance'],
    },
  ],
  'IQ2.2': [
    {
      question: 'Males are often more affected by X-linked recessive disorders because they:',
      options: [
        'Have two copies of the X chromosome',
        'Possess only one X chromosome',
        'Lack X chromosomes entirely',
        'Always express dominant traits',
      ],
      answer: 'Possess only one X chromosome',
      explanation:
        'Males are hemizygous for X-linked genes, so recessive alleles are expressed without a second copy to mask them.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-3',
      keywords: ['X-linked recessive', 'males', 'inheritance'],
    },
    {
      question: 'For a female to express an X-linked recessive trait she must:',
      options: [
        'Be heterozygous',
        'Be homozygous recessive',
        'Have no X chromosomes',
        'Inherit the allele from her father only',
      ],
      answer: 'Be homozygous recessive',
      explanation:
        'Females require two recessive alleles (one on each X chromosome) to express an X-linked recessive trait.',
      syllabus: 'BIO5-3',
      keywords: ['female expression', 'X-linked', 'recessive'],
    },
    {
      question: 'X-inactivation in female mammals ensures:',
      options: [
        'Both X chromosomes remain active',
        'Dosage compensation with males',
        'Genes are silenced on the Y chromosome',
        'Mutations cannot occur',
      ],
      answer: 'Dosage compensation with males',
      explanation:
        'One X chromosome condenses into a Barr body to balance gene dosage between XX females and XY males.',
      difficulty: 'hard',
      syllabus: 'BIO5-3',
      keywords: ['X-inactivation', 'Barr body', 'dosage compensation'],
    },
    {
      question: 'A pedigree showing affected fathers with all daughters affected but no sons affected suggests:',
      options: [
        'Autosomal recessive inheritance',
        'X-linked dominant inheritance',
        'X-linked recessive inheritance',
        'Y-linked inheritance',
      ],
      answer: 'X-linked dominant inheritance',
      explanation:
        'Fathers pass their only X chromosome to daughters, so all daughters inherit an X-linked dominant allele.',
      difficulty: 'hard',
      syllabus: 'BIO5-3',
      keywords: ['X-linked dominant', 'pedigree', 'inheritance'],
    },
    {
      question: 'A carrier mother for Duchenne muscular dystrophy has a son. Probability he is affected:',
      options: ['0%', '25%', '50%', '100%'],
      answer: '50%',
      explanation:
        'Carrier mothers have a 50% chance of passing the affected allele to each son, who then expresses the trait.',
      syllabus: 'BIO5-3',
      keywords: ['Duchenne', 'probability', 'X-linked'],
    },
    {
      question: 'Y-linked traits are passed from:',
      options: ['Mother to son', 'Father to all sons', 'Father to daughters', 'Mother to daughters'],
      answer: 'Father to all sons',
      explanation:
        'Only males inherit the Y chromosome, so Y-linked traits pass from father to son.',
      syllabus: 'BIO5-3',
      keywords: ['Y-linked', 'inheritance', 'male lineage'],
    },
    {
      question: 'Sex-influenced traits differ from sex-linked traits because they:',
      options: [
        'Are located on autosomes but expressed differently under male and female hormones',
        'Are only on the Y chromosome',
        'Skip every generation',
        'Do not involve genes',
      ],
      answer: 'Are located on autosomes but expressed differently under male and female hormones',
      explanation:
        'Sex-influenced traits are autosomal; expression is affected by hormonal environments in males versus females.',
      syllabus: 'BIO5-3',
      keywords: ['sex-influenced', 'hormones', 'expression'],
    },
    {
      question: 'Colour blindness in females is rare because:',
      options: [
        'It is not genetic',
        'Females usually have a second normal X allele',
        'Females lack X chromosomes',
        'It is lethal in females',
      ],
      answer: 'Females usually have a second normal X allele',
      explanation:
        'Females must inherit two recessive alleles to be affected, which requires both parents to pass on the allele.',
      syllabus: 'BIO5-3',
      keywords: ['colour blindness', 'X-linked', 'female'],
    },
    {
      question: 'A man with haemophilia (XʰY) marries a carrier woman (XᴴXʰ). Percentage of daughters affected:',
      options: ['0%', '25%', '50%', '100%'],
      answer: '50%',
      explanation:
        'Half the daughters inherit the affected allele from both parents (XʰXʰ) and express haemophilia.',
      difficulty: 'hard',
      syllabus: 'BIO5-3',
      keywords: ['haemophilia', 'X-linked recessive', 'Punnett'],
    },
    {
      question: 'In X-linked recessive inheritance, affected sons usually inherit the allele from:',
      options: [
        'Their fathers',
        'Their mothers',
        'Either parent equally',
        'Their grandparents',
      ],
      answer: 'Their mothers',
      explanation:
        'Sons receive their X chromosome from their mother and Y from their father, so X-linked recessive alleles come from the mother.',
      syllabus: 'BIO5-3',
      keywords: ['X-linked recessive', 'inheritance pattern', 'pedigree'],
    },
  ],
  'IQ3.1': [
    {
      question: 'The purpose of a DNA ladder in gel electrophoresis is to:',
      options: [
        'Act as a loading dye',
        'Provide fragment size references',
        'Cut DNA at specific sites',
        'Stain the gel after electrophoresis',
      ],
      answer: 'Provide fragment size references',
      explanation:
        'DNA ladders contain fragments of known lengths used to estimate sample fragment sizes.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-4',
      keywords: ['gel electrophoresis', 'DNA ladder', 'size marker'],
    },
    {
      question: 'Reverse transcriptase synthesises:',
      options: [
        'mRNA from DNA',
        'cDNA from mRNA',
        'Proteins from amino acids',
        'DNA primers',
      ],
      answer: 'cDNA from mRNA',
      explanation:
        'Reverse transcriptase converts messenger RNA into complementary DNA for cloning or analysis.',
      syllabus: 'BIO5-4',
      keywords: ['reverse transcriptase', 'cDNA', 'biotechnology'],
    },
    {
      question: 'SDS-PAGE separates proteins primarily based on their:',
      options: ['Charge only', 'Size (molecular weight)', 'Base composition', 'Hydrophobicity'],
      answer: 'Size (molecular weight)',
      explanation:
        'SDS denatures proteins and imparts negative charge, so separation occurs according to size.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['SDS-PAGE', 'protein separation', 'biotech'],
    },
    {
      question: 'DNA ligase is used in molecular cloning to:',
      options: [
        'Amplify DNA sequences',
        'Seal phosphodiester bonds between DNA fragments',
        'Cut DNA at palindromic sequences',
        'Translate mRNA into protein',
      ],
      answer: 'Seal phosphodiester bonds between DNA fragments',
      explanation:
        'DNA ligase joins DNA fragments, enabling assembly of recombinant plasmids.',
      syllabus: 'BIO5-4',
      keywords: ['DNA ligase', 'cloning', 'recombinant DNA'],
    },
    {
      question: 'During PCR, denaturation typically occurs at:',
      options: ['37 °C', '55 °C', '72 °C', '95 °C'],
      answer: '95 °C',
      explanation:
        'High temperature denatures double-stranded DNA so primers can anneal in the next step.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-4',
      keywords: ['PCR', 'denaturation', 'temperature'],
    },
    {
      question: 'Blue-white screening allows identification of colonies that:',
      options: [
        'Contain plasmids without inserts',
        'Carry recombinant plasmids disrupting the lacZ gene',
        'Do not contain any plasmid',
        'Express high levels of beta-galactosidase',
      ],
      answer: 'Carry recombinant plasmids disrupting the lacZ gene',
      explanation:
        'Insertion of foreign DNA disrupts lacZ, producing white colonies on X-gal plates.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['blue-white screening', 'lacZ', 'cloning'],
    },
    {
      question: 'Competent bacterial cells are able to:',
      options: [
        'Undergo meiosis',
        'Take up foreign DNA during transformation',
        'Produce antibodies',
        'Degrade plasmids',
      ],
      answer: 'Take up foreign DNA during transformation',
      explanation:
        'Competency refers to the physiological state allowing uptake of exogenous DNA molecules.',
      syllabus: 'BIO5-4',
      keywords: ['competent cells', 'transformation', 'plasmid'],
    },
    {
      question: 'Southern blotting detects:',
      options: [
        'Specific DNA sequences',
        'Levels of mRNA expression',
        'Protein abundance',
        'Carbohydrate composition',
      ],
      answer: 'Specific DNA sequences',
      explanation:
        'Southern blot transfers DNA to a membrane and uses labelled probes to identify target sequences.',
      syllabus: 'BIO5-4',
      keywords: ['Southern blot', 'DNA probe', 'biotechnology'],
    },
    {
      question: 'Sanger sequencing relies on:',
      options: [
        'RNA primers only',
        'Chain-terminating dideoxynucleotides',
        'CRISPR-Cas9',
        'Reverse transcription',
      ],
      answer: 'Chain-terminating dideoxynucleotides',
      explanation:
        'Incorporation of dideoxynucleotides terminates DNA synthesis, allowing sequence determination.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['Sanger sequencing', 'dideoxy', 'DNA'],
    },
    {
      question: 'Antibiotic selection after transformation ensures:',
      options: [
        'All bacteria survive',
        'Only bacteria containing plasmids with resistance genes grow',
        'No plasmids remain in the culture',
        'All plasmids integrate into the chromosome',
      ],
      answer: 'Only bacteria containing plasmids with resistance genes grow',
      explanation:
        'Plasmids carry antibiotic resistance markers so transformed cells survive on antibiotic plates.',
      syllabus: 'BIO5-4',
      keywords: ['antibiotic selection', 'plasmid', 'transformation'],
    },
  ],
  'IQ3.2': [
    {
      question: 'RNA interference (RNAi) silences gene expression by:',
      options: [
        'Promoting transcription of target genes',
        'Using double-stranded RNA to trigger degradation of complementary mRNA',
        'Deleting entire chromosomes',
        'Blocking translation initiation permanently',
      ],
      answer: 'Using double-stranded RNA to trigger degradation of complementary mRNA',
      explanation:
        'siRNA guides the RISC complex to complementary mRNA molecules, leading to their degradation.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['RNA interference', 'siRNA', 'gene silencing'],
    },
    {
      question: 'The goal of somatic gene therapy is to:',
      options: [
        'Alter genes in gametes',
        'Correct faulty genes in body cells',
        'Create designer embryos',
        'Induce random mutations',
      ],
      answer: 'Correct faulty genes in body cells',
      explanation:
        'Somatic gene therapy delivers functional genes to specific tissues to treat genetic disorders.',
      syllabus: 'BIO5-4',
      keywords: ['gene therapy', 'somatic cells', 'treatment'],
    },
    {
      question: 'CRISPR-Cas9 provides high specificity because it:',
      options: [
        'Cuts DNA at random',
        'Uses guide RNA to target complementary sequences',
        'Requires homologous chromosomes',
        'Only works in bacteria',
      ],
      answer: 'Uses guide RNA to target complementary sequences',
      explanation:
        'Guide RNA directs Cas9 to matching DNA sequences, enabling precise genome editing.',
      syllabus: 'BIO5-4',
      keywords: ['CRISPR', 'guide RNA', 'gene editing'],
    },
    {
      question: 'A gene knock-in involves:',
      options: [
        'Deleting a gene entirely',
        'Inserting a gene into a specific genomic locus',
        'Random mutagenesis',
        'Blocking transcription factors',
      ],
      answer: 'Inserting a gene into a specific genomic locus',
      explanation:
        'Knock-ins add a gene at a defined position, often under the control of natural regulatory elements.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['knock-in', 'genetic engineering', 'locus'],
    },
    {
      question: 'Golden Rice was engineered to:',
      options: [
        'Resist herbicides',
        'Produce beta-carotene (vitamin A precursor)',
        'Fix atmospheric nitrogen',
        'Increase protein content dramatically',
      ],
      answer: 'Produce beta-carotene (vitamin A precursor)',
      explanation:
        'Introducing carotenoid biosynthesis genes enables Golden Rice to synthesise beta-carotene.',
      syllabus: 'BIO5-4',
      keywords: ['Golden Rice', 'GMO', 'beta-carotene'],
    },
    {
      question: 'Electroporation introduces DNA by:',
      options: [
        'Injecting DNA with a micropipette',
        'Applying electrical pulses that create temporary membrane pores',
        'Packaging DNA into viral particles',
        'Coating DNA onto gold particles',
      ],
      answer: 'Applying electrical pulses that create temporary membrane pores',
      explanation:
        'Electric pulses open pores in cell membranes, allowing DNA to enter.',
      syllabus: 'BIO5-4',
      keywords: ['electroporation', 'DNA uptake', 'biotech'],
    },
    {
      question: 'Knockout mice are valuable research models because they:',
      options: [
        'Have all genes duplicated',
        'Have specific genes disabled to analyse loss-of-function phenotypes',
        'Produce human antibodies naturally',
        'Reproduce extremely quickly',
      ],
      answer: 'Have specific genes disabled to analyse loss-of-function phenotypes',
      explanation:
        'By removing a gene, researchers can observe the resulting phenotype and infer gene function.',
      syllabus: 'BIO5-4',
      keywords: ['knockout mice', 'gene function', 'model organisms'],
    },
    {
      question: 'Microarray analysis enables scientists to:',
      options: [
        'Sequence entire genomes',
        'Measure expression levels of thousands of genes simultaneously',
        'Visualise protein structure',
        'Identify carbohydrate content',
      ],
      answer: 'Measure expression levels of thousands of genes simultaneously',
      explanation:
        'Microarrays contain many probes that hybridise with labelled cDNA, revealing expression profiles.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['microarray', 'gene expression', 'profiling'],
    },
    {
      question: 'A selectable marker in genetic engineering is used to:',
      options: [
        'Cut DNA into fragments',
        'Identify cells that have taken up recombinant DNA',
        'Silence unwanted genes',
        'Map gene locations on chromosomes',
      ],
      answer: 'Identify cells that have taken up recombinant DNA',
      explanation:
        'Markers such as antibiotic resistance genes allow selection of successfully transformed cells.',
      syllabus: 'BIO5-4',
      keywords: ['selectable marker', 'recombinant DNA', 'selection'],
    },
    {
      question: 'Gene drives bias inheritance so that:',
      options: [
        'Alleles obey standard Mendelian ratios',
        'The edited allele is inherited by most offspring',
        'Alleles are silenced permanently',
        'No mutations can occur',
      ],
      answer: 'The edited allele is inherited by most offspring',
      explanation:
        'Gene drives copy themselves onto the homologous chromosome, increasing the proportion of offspring inheriting the trait.',
      difficulty: 'hard',
      syllabus: 'BIO5-4',
      keywords: ['gene drive', 'inheritance', 'CRISPR'],
    },
  ],
  'IQ3.3': [
    {
      question: 'Which ethical principle emphasises avoiding harm?',
      options: ['Beneficence', 'Autonomy', 'Non-maleficence', 'Justice'],
      answer: 'Non-maleficence',
      explanation:
        'Non-maleficence requires scientists to minimise harm when developing biotechnologies.',
      syllabus: 'BIO5-5',
      keywords: ['ethics', 'non-maleficence', 'biotechnology'],
    },
    {
      question: 'A major ethical concern with germline gene editing is that:',
      options: [
        'It affects only somatic cells',
        'Changes are heritable by future generations',
        'It has no medical benefit',
        'It is limited to bacteria',
      ],
      answer: 'Changes are heritable by future generations',
      explanation:
        'Germline edits are passed to offspring, raising consent and long-term safety concerns.',
      difficulty: 'hard',
      syllabus: 'BIO5-5',
      keywords: ['germline editing', 'inheritance', 'ethics'],
    },
    {
      question: 'Bioprospecting raises ethical issues when:',
      options: [
        'Indigenous knowledge is used without benefit sharing',
        'Only scientists are involved',
        'No commercial product is created',
        'It encourages conservation',
      ],
      answer: 'Indigenous knowledge is used without benefit sharing',
      explanation:
        'Using traditional knowledge without permission or compensation is considered biopiracy.',
      syllabus: 'BIO5-5',
      keywords: ['bioprospecting', 'indigenous knowledge', 'benefit sharing'],
    },
    {
      question: 'Ethics review boards exist to:',
      options: [
        'Maximise profits from research',
        'Ensure research meets safety and ethical standards',
        'Guarantee quick approvals',
        'Prevent public consultation',
      ],
      answer: 'Ensure research meets safety and ethical standards',
      explanation:
        'Ethics committees evaluate risk, consent and welfare before approving biotechnology projects.',
      syllabus: 'BIO5-5',
      keywords: ['ethics committee', 'research approval', 'safety'],
    },
    {
      question: 'Labelling of GMO foods is considered ethical because it:',
      options: [
        'Eliminates allergens',
        'Allows consumers to make informed choices',
        'Increases crop yields',
        'Prevents trade',
      ],
      answer: 'Allows consumers to make informed choices',
      explanation:
        'Labelling respects autonomy by providing information aligned with consumer values.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-5',
      keywords: ['GMO', 'labelling', 'consumer choice'],
    },
    {
      question: 'The precautionary principle in biotechnology suggests:',
      options: [
        'Rushing new technologies to market',
        'Proceeding cautiously until safety is established',
        'Ignoring potential risks',
        'Removing regulation',
      ],
      answer: 'Proceeding cautiously until safety is established',
      explanation:
        'The precautionary principle advocates careful assessment when consequences are uncertain.',
      syllabus: 'BIO5-5',
      keywords: ['precautionary principle', 'risk', 'biotechnology'],
    },
    {
      question: 'An equity concern in biotechnology focuses on:',
      options: [
        'Ensuring only wealthy groups access treatment',
        'Sharing benefits and risks fairly across society',
        'Reducing regulation for industry',
        'Preventing community engagement',
      ],
      answer: 'Sharing benefits and risks fairly across society',
      explanation:
        'Justice requires that new technologies do not disproportionately benefit or harm particular groups.',
      syllabus: 'BIO5-5',
      keywords: ['equity', 'justice', 'access'],
    },
    {
      question: 'Animal welfare legislation aims to ensure that biotechnology research:',
      options: [
        'Uses the cheapest animals available',
        'Minimises suffering and applies humane treatment',
        'Avoids any use of animals',
        'Is commercialised rapidly',
      ],
      answer: 'Minimises suffering and applies humane treatment',
      explanation:
        'Animal ethics frameworks emphasise the 3Rs: replacement, reduction and refinement to minimise harm.',
      syllabus: 'BIO5-5',
      keywords: ['animal ethics', 'welfare', 'research'],
    },
    {
      question: 'Direct-to-consumer genetic testing raises ethical concerns because:',
      options: [
        'Results are always accurate',
        'Consumers may misinterpret risk without counselling',
        'It eliminates medical involvement',
        'Only hospitals can provide results',
      ],
      answer: 'Consumers may misinterpret risk without counselling',
      explanation:
        'Lack of professional guidance can lead to misunderstanding of genetic risk or privacy issues.',
      syllabus: 'BIO5-5',
      keywords: ['genetic testing', 'privacy', 'counselling'],
    },
    {
      question: 'One ethical concern about de-extinction (reviving extinct species) is that it may:',
      options: [
        'Guarantee ecosystem stability',
        'Divert conservation resources away from existing endangered species',
        'Stop climate change',
        'Increase genetic diversity of all species',
      ],
      answer: 'Divert conservation resources away from existing endangered species',
      explanation:
        'Critics argue that focusing on de-extinction could reduce funding for conserving living species.',
      difficulty: 'hard',
      syllabus: 'BIO5-5',
      keywords: ['de-extinction', 'conservation', 'ethics'],
    },
    {
      question: 'Data privacy is a key issue in personal genomic services because:',
      options: [
        'Companies never share data',
        'Genetic information could be accessed by insurers or employers',
        'Results are always discarded immediately',
        'It prevents medical diagnosis',
      ],
      answer: 'Genetic information could be accessed by insurers or employers',
      explanation:
        'Without safeguards, genetic data may be used to discriminate in insurance or employment decisions.',
      difficulty: 'medium',
      syllabus: 'BIO5-5',
      keywords: ['privacy', 'genetic data', 'ethics'],
    },
  ],
  'IQ4.1': [
    {
      question: 'Natural selection acts directly on:',
      options: ['Genes', 'Phenotypes', 'Chromosomes', 'Gametes'],
      answer: 'Phenotypes',
      explanation:
        'Selection favours or eliminates individuals based on observable traits, indirectly changing allele frequencies.',
      syllabus: 'BIO5-6',
      keywords: ['natural selection', 'phenotype', 'traits'],
    },
    {
      question: 'Which scenario shows stabilising selection?',
      options: [
        'Very light and very dark mice both favoured',
        'Intermediate human birth weights experiencing lowest mortality',
        'Only the darkest peppered moths surviving',
        'Birds with extreme beak sizes preferred',
      ],
      answer: 'Intermediate human birth weights experiencing lowest mortality',
      explanation:
        'Stabilising selection favours intermediate phenotypes, reducing extremes.',
      syllabus: 'BIO5-6',
      keywords: ['stabilising selection', 'variation', 'birth weight'],
    },
    {
      question: 'Antibiotic resistance in bacteria is an example of:',
      options: [
        'Directional selection',
        'Disruptive selection',
        'Artificial selection',
        'Genetic drift',
      ],
      answer: 'Directional selection',
      explanation:
        'When antibiotics are used, resistant bacteria survive and reproduce, shifting the population toward resistance.',
      difficulty: 'medium',
      syllabus: 'BIO5-6',
      keywords: ['directional selection', 'antibiotic resistance', 'evolution'],
    },
    {
      question: 'Genetic drift differs from natural selection because it:',
      options: [
        'Requires large populations',
        'Is random change in allele frequency, especially in small populations',
        'Always increases fitness',
        'Eliminates mutations',
      ],
      answer: 'Is random change in allele frequency, especially in small populations',
      explanation:
        'Genetic drift is stochastic and can lead to loss of alleles irrespective of fitness advantages.',
      difficulty: 'hard',
      syllabus: 'BIO5-6',
      keywords: ['genetic drift', 'allele frequency', 'population size'],
    },
    {
      question: 'A population bottleneck can result in:',
      options: [
        'Increased genetic diversity',
        'Loss of rare alleles by chance',
        'Immediate speciation',
        'No change to allele frequencies',
      ],
      answer: 'Loss of rare alleles by chance',
      explanation:
        'Sharp reductions in population size can eliminate rare alleles, reducing genetic diversity.',
      difficulty: 'hard',
      syllabus: 'BIO5-6',
      keywords: ['bottleneck', 'genetic diversity', 'population'],
    },
    {
      question: 'Which example illustrates artificial selection?',
      options: [
        'Development of pesticide-resistant insects',
        'Dog breeds selected for specific traits',
        'Finches evolving different beaks on islands',
        'Random mutation rates in bacteria',
      ],
      answer: 'Dog breeds selected for specific traits',
      explanation:
        'Artificial selection involves humans breeding organisms for desired traits.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-6',
      keywords: ['artificial selection', 'domestication', 'dogs'],
    },
    {
      question: 'Sexual selection favours traits that:',
      options: [
        'Increase survival but decrease reproduction',
        'Increase mating success even if costly for survival',
        'Ensure equal reproduction among individuals',
        'Prevent dimorphism between sexes',
      ],
      answer: 'Increase mating success even if costly for survival',
      explanation:
        'Traits that attract mates or win competition can evolve despite survival costs.',
      syllabus: 'BIO5-6',
      keywords: ['sexual selection', 'mating success', 'dimorphism'],
    },
    {
      question: 'Gene flow can introduce new alleles into a population when:',
      options: [
        'Mutations occur',
        'Individuals migrate between populations and reproduce',
        'Populations are isolated',
        'Selection is stabilising',
      ],
      answer: 'Individuals migrate between populations and reproduce',
      explanation:
        'Migration (gene flow) mixes alleles between populations, increasing diversity.',
      syllabus: 'BIO5-6',
      keywords: ['gene flow', 'migration', 'alleles'],
    },
    {
      question: 'Directional selection shifts a population’s mean phenotype because:',
      options: [
        'Both extremes are favoured',
        'Natural selection removes variation completely',
        'One extreme phenotype has greater fitness',
        'The average phenotype is always favoured',
      ],
      answer: 'One extreme phenotype has greater fitness',
      explanation:
        'Directional selection increases the frequency of individuals with advantageous extreme traits.',
      syllabus: 'BIO5-6',
      keywords: ['directional selection', 'fitness', 'mean'],
    },
    {
      question: 'Fitness in evolutionary terms refers to:',
      options: [
        'Physical strength',
        'Number of offspring produced that survive to reproduce',
        'Longevity of an individual',
        'Size of the organism',
      ],
      answer: 'Number of offspring produced that survive to reproduce',
      explanation:
        'Evolutionary fitness is measured by reproductive success, not by strength or lifespan alone.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-6',
      keywords: ['fitness', 'reproduction', 'evolution'],
    },
  ],
  'IQ4.2': [
    {
      question: 'Homologous structures such as vertebrate limbs provide evidence for:',
      options: [
        'Convergent evolution',
        'Common ancestry',
        'Mutations only',
        'No evolutionary relationship',
      ],
      answer: 'Common ancestry',
      explanation:
        'Similar bone patterns in different species suggest they evolved from a shared ancestor.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-6',
      keywords: ['homology', 'common ancestry', 'anatomy'],
    },
    {
      question: 'A transitional fossil is important because it:',
      options: [
        'Shows no similarities to other species',
        'Bridges features between ancestral and derived groups',
        'Contains only soft tissue',
        'Demonstrates convergent evolution',
      ],
      answer: 'Bridges features between ancestral and derived groups',
      explanation:
        'Transitional fossils display intermediate characteristics, supporting gradual evolutionary change.',
      syllabus: 'BIO5-6',
      keywords: ['transitional fossil', 'evolution', 'evidence'],
    },
    {
      question: 'Molecular clocks estimate divergence times by comparing:',
      options: [
        'Behavioural traits',
        'Accumulated mutations in DNA or proteins',
        'Fossil ages only',
        'Geographical data',
      ],
      answer: 'Accumulated mutations in DNA or proteins',
      explanation:
        'Molecular clocks use mutation rates to estimate when lineages diverged.',
      difficulty: 'hard',
      syllabus: 'BIO5-6',
      keywords: ['molecular clock', 'mutations', 'divergence'],
    },
    {
      question: 'Biogeography provides evolutionary evidence through:',
      options: [
        'Study of geographic distribution of species',
        'Changing mutation rates',
        'Random mating patterns',
        'Behavioural experiments',
      ],
      answer: 'Study of geographic distribution of species',
      explanation:
        'Species distribution patterns reflect evolutionary history and continental drift.',
      syllabus: 'BIO5-6',
      keywords: ['biogeography', 'distribution', 'evolution'],
    },
    {
      question: 'Vestigial structures such as pelvic bones in whales indicate:',
      options: [
        'Recent mutation',
        'Evolutionary remnants from ancestors with hind limbs',
        'No change over time',
        'Structural necessity for swimming',
      ],
      answer: 'Evolutionary remnants from ancestors with hind limbs',
      explanation:
        'Vestigial organs are reduced structures that were functional in ancestral species.',
      syllabus: 'BIO5-6',
      keywords: ['vestigial structures', 'whales', 'ancestry'],
    },
    {
      question: 'Embryological similarities among vertebrates suggest:',
      options: [
        'Independent origins',
        'Shared developmental pathways inherited from a common ancestor',
        'Lack of genetic regulation',
        'Convergent evolution only',
      ],
      answer: 'Shared developmental pathways inherited from a common ancestor',
      explanation:
        'Similar embryonic stages indicate conserved genes controlling early development.',
      syllabus: 'BIO5-6',
      keywords: ['embryology', 'development', 'common ancestor'],
    },
    {
      question: 'Radiometric dating determines fossil age by measuring:',
      options: [
        'Length of bones',
        'Decay of radioactive isotopes',
        'Protein composition',
        'Behavioural traits',
      ],
      answer: 'Decay of radioactive isotopes',
      explanation:
        'Radioisotope decay provides absolute ages for rocks and fossils, supporting evolutionary timelines.',
      difficulty: 'hard',
      syllabus: 'BIO5-6',
      keywords: ['radiometric dating', 'isotopes', 'fossil age'],
    },
    {
      question: 'Analogous structures such as wings of birds and insects arise through:',
      options: [
        'Common ancestry',
        'Convergent evolution in similar environments',
        'Genetic drift',
        'Artificial selection',
      ],
      answer: 'Convergent evolution in similar environments',
      explanation:
        'Analogous structures evolve independently to perform similar functions under similar selective pressures.',
      syllabus: 'BIO5-6',
      keywords: ['analogous', 'convergent evolution', 'function'],
    },
    {
      question: 'DNA hybridisation experiments measure relatedness by:',
      options: [
        'Counting chromosomes',
        'Determining the degree of complementary base pairing between species',
        'Observing behaviour',
        'Comparing organ size',
      ],
      answer: 'Determining the degree of complementary base pairing between species',
      explanation:
        'Greater hybridisation (more hydrogen bonds) indicates closer evolutionary relationships.',
      difficulty: 'hard',
      syllabus: 'BIO5-6',
      keywords: ['DNA hybridisation', 'relatedness', 'molecular evidence'],
    },
    {
      question: 'Fossils of tropical plants in Antarctica support the theory of:',
      options: [
        'No continental movement',
        'Continental drift from warmer latitudes',
        'Immediate climate change',
        'Isostatic rebound only',
      ],
      answer: 'Continental drift from warmer latitudes',
      explanation:
        'Plant fossils in unexpected climates indicate continents have moved across climatic zones.',
      syllabus: 'BIO5-6',
      keywords: ['continental drift', 'fossil evidence', 'palaeoclimate'],
    },
  ],
  'IQ4.3': [
    {
      question: 'Allopatric speciation requires:',
      options: [
        'Behavioural isolation only',
        'Geographic isolation preventing gene flow',
        'Polyploidy in the same habitat',
        'Random mating in a large population',
      ],
      answer: 'Geographic isolation preventing gene flow',
      explanation:
        'Separated populations accumulate differences and can form new species when gene flow stops.',
      syllabus: 'BIO5-7',
      keywords: ['allopatric speciation', 'geographic isolation', 'gene flow'],
    },
    {
      question: 'Hybrid sterility is an example of a:',
      options: [
        'Prezygotic barrier',
        'Postzygotic barrier',
        'Temporal isolation',
        'Habitat isolation',
      ],
      answer: 'Postzygotic barrier',
      explanation:
        'Postzygotic barriers occur after fertilisation, resulting in sterile or inviable hybrids (e.g., mules).',
      syllabus: 'BIO5-7',
      keywords: ['postzygotic', 'hybrid sterility', 'reproductive isolation'],
    },
    {
      question: 'Sympatric speciation can occur when:',
      options: [
        'A population is separated by a river',
        'Polyploidy instantly isolates plants in the same habitat',
        'A species migrates to islands',
        'Gene flow increases between populations',
      ],
      answer: 'Polyploidy instantly isolates plants in the same habitat',
      explanation:
        'Polyploid individuals cannot interbreed with diploid ancestors, leading to sympatric speciation.',
      difficulty: 'hard',
      syllabus: 'BIO5-7',
      keywords: ['sympatric speciation', 'polyploidy', 'plants'],
    },
    {
      question: 'Temporal isolation occurs when:',
      options: [
        'Species live in different habitats',
        'Species breed at different times',
        'Gametes cannot fuse',
        'Offspring are sterile',
      ],
      answer: 'Species breed at different times',
      explanation:
        'Temporal isolation prevents mating because reproductive timing does not overlap.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-7',
      keywords: ['temporal isolation', 'prezygotic', 'reproduction'],
    },
    {
      question: 'Mechanical isolation is caused by:',
      options: [
        'Different courtship behaviours',
        'Structural differences in reproductive organs preventing mating',
        'Gametes unable to fuse',
        'Hybrids being inviable',
      ],
      answer: 'Structural differences in reproductive organs preventing mating',
      explanation:
        'Mechanical barriers prevent successful mating even when individuals attempt to breed.',
      syllabus: 'BIO5-7',
      keywords: ['mechanical isolation', 'prezygotic', 'speciation'],
    },
    {
      question: 'Reinforcement in speciation refers to:',
      options: [
        'Hybrids being more fit than parents',
        'Natural selection strengthening prezygotic barriers',
        'Fusion of two species into one',
        'Polyploidy creating new species',
      ],
      answer: 'Natural selection strengthening prezygotic barriers',
      explanation:
        'If hybrids have low fitness, selection favours traits that prevent interbreeding between populations.',
      syllabus: 'BIO5-7',
      keywords: ['reinforcement', 'prezygotic barriers', 'speciation'],
    },
    {
      question: 'The founder effect can contribute to speciation because it:',
      options: [
        'Increases gene flow',
        'Creates small populations with different allele frequencies by chance',
        'Prevents natural selection',
        'Removes mutations',
      ],
      answer: 'Creates small populations with different allele frequencies by chance',
      explanation:
        'Founding populations may differ genetically from the original population, leading to divergence.',
      difficulty: 'hard',
      syllabus: 'BIO5-7',
      keywords: ['founder effect', 'speciation', 'allele frequency'],
    },
    {
      question: 'Hybrid zones are regions where:',
      options: [
        'Species go extinct quickly',
        'Two distinct populations meet and interbreed',
        'No gene flow occurs',
        'Mutations cease',
      ],
      answer: 'Two distinct populations meet and interbreed',
      explanation:
        'Hybrid zones occur where ranges overlap, producing hybrids that may be viable or sterile.',
      syllabus: 'BIO5-7',
      keywords: ['hybrid zone', 'interbreeding', 'speciation'],
    },
    {
      question: 'Adaptive radiation involves:',
      options: [
        'One species evolving into many to fill different ecological niches',
        'Gene flow between populations',
        'Stabilising selection only',
        'Random mating in large populations',
      ],
      answer: 'One species evolving into many to fill different ecological niches',
      explanation:
        'Adaptive radiation occurs when organisms diversify rapidly to exploit different niches (e.g., Darwin’s finches).',
      syllabus: 'BIO5-7',
      keywords: ['adaptive radiation', 'Darwin’s finches', 'speciation'],
    },
    {
      question: 'Behavioural isolation can prevent speciation when:',
      options: [
        'Species use different mating calls or rituals',
        'Gametes cannot fuse',
        'Chromosome numbers differ',
        'Populations share the same courtship behaviours',
      ],
      answer: 'Species use different mating calls or rituals',
      explanation:
        'Differences in courtship behaviours prevent interbreeding even when ranges overlap.',
      syllabus: 'BIO5-7',
      keywords: ['behavioural isolation', 'prezygotic', 'courtship'],
    },
    {
      question: 'Hybrid inviability occurs when:',
      options: [
        'Hybrids fail to survive to reproductive age',
        'Hybrids are fertile and viable',
        'Species breed at different times',
        'Gametes cannot fuse',
      ],
      answer: 'Hybrids fail to survive to reproductive age',
      explanation:
        'Hybrid inviability is a postzygotic barrier where embryos or juveniles die before reproducing.',
      syllabus: 'BIO5-7',
      keywords: ['hybrid inviability', 'postzygotic barrier', 'speciation'],
    },
  ],
  'IQ5.1': [
    {
      question: 'Primary succession begins on surfaces that are:',
      options: [
        'Previously colonised with rich soil',
        'Bare rock or sand with no soil',
        'Dense forests',
        'Agricultural fields',
      ],
      answer: 'Bare rock or sand with no soil',
      explanation:
        'Primary succession starts in lifeless areas where soil must first be formed.',
      syllabus: 'BIO5-8',
      keywords: ['primary succession', 'ecosystem', 'soil formation'],
    },
    {
      question: 'Pioneer species such as lichens are important because they:',
      options: [
        'Increase predation',
        'Stabilise substrate and contribute to soil development',
        'Eliminate decomposers',
        'Increase competition for large trees',
      ],
      answer: 'Stabilise substrate and contribute to soil development',
      explanation:
        'Pioneer species colonise harsh environments, breaking down rock and adding organic matter.',
      difficulty: 'easy',
      time_limit: 60,
      syllabus: 'BIO5-8',
      keywords: ['pioneer species', 'succession', 'ecosystem'],
    },
    {
      question: 'Biomagnification describes:',
      options: [
        'Nutrient cycling',
        'Increase in pollutant concentration at higher trophic levels',
        'Photosynthesis rates',
        'Energy transfer efficiency',
      ],
      answer: 'Increase in pollutant concentration at higher trophic levels',
      explanation:
        'Persistent toxins accumulate and amplify as they move up the food chain.',
      difficulty: 'hard',
      syllabus: 'BIO5-8',
      keywords: ['biomagnification', 'trophic levels', 'pollutants'],
    },
    {
      question: 'A climax community is characterised by:',
      options: [
        'Rapid change after disturbance',
        'Relative stability and equilibrium with the environment',
        'Only pioneer species present',
        'No species interactions',
      ],
      answer: 'Relative stability and equilibrium with the environment',
      explanation:
        'Climax communities are late succession stages where species composition changes slowly.',
      syllabus: 'BIO5-8',
      keywords: ['climax community', 'succession', 'stability'],
    },
    {
      question: 'Respiration returns carbon to the atmosphere by:',
      options: [
        'Fixing carbon dioxide into sugars',
        'Releasing carbon dioxide during metabolism',
        'Converting ammonia to nitrate',
        'Reducing oxygen levels in soil',
      ],
      answer: 'Releasing carbon dioxide during metabolism',
      explanation:
        'Organisms break down organic molecules, returning carbon dioxide to the atmosphere.',
      difficulty: 'easy',
      syllabus: 'BIO5-8',
      keywords: ['carbon cycle', 'respiration', 'ecosystem'],
    },
    {
      question: 'Nitrogen-fixing bacteria convert atmospheric nitrogen into:',
      options: ['Carbon dioxide', 'Ammonia', 'Oxygen', 'Phosphate'],
      answer: 'Ammonia',
      explanation:
        'Nitrogen fixation converts inert N₂ into ammonia, making nitrogen available for assimilation by plants.',
      syllabus: 'BIO5-8',
      keywords: ['nitrogen fixation', 'bacteria', 'nitrogen cycle'],
    },
    {
      question: 'Keystone species are organisms that:',
      options: [
        'Are the most abundant in the ecosystem',
        'Have a disproportionate impact on ecosystem structure',
        'Always occupy the lowest trophic level',
        'Are unrelated to ecosystem stability',
      ],
      answer: 'Have a disproportionate impact on ecosystem structure',
      explanation:
        'Removing a keystone species causes major changes because many other species depend on it.',
      difficulty: 'hard',
      syllabus: 'BIO5-8',
      keywords: ['keystone species', 'ecosystem', 'stability'],
    },
    {
      question: 'The “10% rule” in ecology refers to:',
      options: [
        'Percentage of species that go extinct each decade',
        'Approximate energy transferred from one trophic level to the next',
        'Amount of water available to plants',
        'Proportion of carbon stored in biomass',
      ],
      answer: 'Approximate energy transferred from one trophic level to the next',
      explanation:
        'Only about 10% of energy is passed on; the rest is lost as heat or used in metabolism.',
      syllabus: 'BIO5-8',
      keywords: ['10% rule', 'energy flow', 'trophic level'],
    },
    {
      question: 'Secondary succession differs from primary succession because it:',
      options: [
        'Occurs on bare rock with no soil',
        'Begins after a disturbance where soil remains intact',
        'Cannot involve pioneer species',
        'Does not involve plants',
      ],
      answer: 'Begins after a disturbance where soil remains intact',
      explanation:
        'Secondary succession follows disturbances like fire where soil and seed banks typically remain.',
      syllabus: 'BIO5-8',
      keywords: ['secondary succession', 'disturbance', 'soil'],
    },
    {
      question: 'Decomposers such as earthworms and bacteria are crucial because they:',
      options: [
        'Fix atmospheric nitrogen',
        'Break down organic matter, returning nutrients to the soil',
        'Increase light availability',
        'Reduce biodiversity',
      ],
      answer: 'Break down organic matter, returning nutrients to the soil',
      explanation:
        'Decomposition recycles matter, making nutrients available for producers.',
      syllabus: 'BIO5-8',
      keywords: ['decomposers', 'nutrient cycling', 'soil'],
    },
  ],
  'IQ5.2': [
    {
      question: 'Carrying capacity (K) represents:',
      options: [
        'Number of births per year',
        'Maximum population size an environment can sustain long-term',
        'Average body size of individuals',
        'Rate of immigration',
      ],
      answer: 'Maximum population size an environment can sustain long-term',
      explanation:
        'Carrying capacity is determined by resource availability and environmental conditions.',
      syllabus: 'BIO5-8',
      keywords: ['carrying capacity', 'population', 'resources'],
    },
    {
      question: 'Exponential population growth is represented by:',
      options: ['An S-shaped curve', 'A J-shaped curve', 'A straight line', 'A sinusoidal wave'],
      answer: 'A J-shaped curve',
      explanation:
        'Exponential growth accelerates rapidly when resources are abundant, producing a J-shaped graph.',
      difficulty: 'easy',
      syllabus: 'BIO5-8',
      keywords: ['exponential growth', 'J-curve', 'population'],
    },
    {
      question: 'Density-dependent limiting factors include:',
      options: [
        'Floods and bushfires',
        'Predation and competition',
        'Volcanic eruptions',
        'Earthquakes',
      ],
      answer: 'Predation and competition',
      explanation:
        'Density-dependent factors intensify as population density increases, reducing growth.',
      syllabus: 'BIO5-8',
      keywords: ['density-dependent', 'limiting factors', 'population'],
    },
    {
      question: 'r-selected species typically:',
      options: [
        'Produce many offspring with little parental care',
        'Produce few offspring with high parental investment',
        'Have long lifespans and slow reproduction',
        'Maintain populations near carrying capacity',
      ],
      answer: 'Produce many offspring with little parental care',
      explanation:
        'r-strategists exploit unpredictable environments by reproducing rapidly and abundantly.',
      syllabus: 'BIO5-8',
      keywords: ['r-selected', 'life history', 'population'],
    },
    {
      question: 'K-selected species are characterised by:',
      options: [
        'Rapid reproductive cycles',
        'Few offspring with significant parental investment',
        'Minimal parental care',
        'Short lifespans',
      ],
      answer: 'Few offspring with significant parental investment',
      explanation:
        'K-strategists invest energy in offspring survival, maintaining populations near carrying capacity.',
      syllabus: 'BIO5-8',
      keywords: ['K-selected', 'parental care', 'population'],
    },
    {
      question: 'Immigration is defined as:',
      options: [
        'Movement of individuals out of a population',
        'Movement of individuals into a population',
        'Birth rate minus death rate',
        'Number of predator attacks',
      ],
      answer: 'Movement of individuals into a population',
      explanation:
        'Immigration increases population size by adding individuals from other areas.',
      difficulty: 'easy',
      syllabus: 'BIO5-8',
      keywords: ['immigration', 'population change', 'movement'],
    },
    {
      question: 'Logistic growth differs from exponential growth because it:',
      options: [
        'Never slows down',
        'Slows as population approaches carrying capacity, forming an S-curve',
        'Only occurs with unlimited resources',
        'Occurs only in small populations',
      ],
      answer: 'Slows as population approaches carrying capacity, forming an S-curve',
      explanation:
        'Logistic growth accounts for limiting factors, creating an S-shaped curve over time.',
      syllabus: 'BIO5-8',
      keywords: ['logistic growth', 'S-curve', 'limiting factors'],
    },
    {
      question: 'A population crash can result from:',
      options: [
        'Gradual resource increase',
        'Sudden loss of resources or disease outbreak',
        'Stable environmental conditions',
        'Balanced emigration and immigration',
      ],
      answer: 'Sudden loss of resources or disease outbreak',
      explanation:
        'Rapid declines occur when essential resources vanish or mortality rises quickly.',
      syllabus: 'BIO5-8',
      keywords: ['population crash', 'resources', 'disease'],
    },
    {
      question: 'Population density is calculated as:',
      options: [
        'Number of births per year',
        'Number of individuals per unit area',
        'Total biomass of a population',
        'Growth rate minus death rate',
      ],
      answer: 'Number of individuals per unit area',
      explanation:
        'Population density measures how crowded individuals are within their habitat.',
      difficulty: 'easy',
      syllabus: 'BIO5-8',
      keywords: ['population density', 'measurement', 'ecology'],
    },
    {
      question: 'Type II survivorship curves indicate:',
      options: [
        'High juvenile mortality with few adults surviving',
        'Constant mortality rate across all ages',
        'High survival early in life with steep decline late in life',
        'Equal survival for all species',
      ],
      answer: 'Constant mortality rate across all ages',
      explanation:
        'In Type II curves (e.g., birds), individuals face similar risk of death at any age.',
      syllabus: 'BIO5-8',
      keywords: ['survivorship curve', 'Type II', 'population dynamics'],
    },
    {
      question: 'Density-independent factors differ from density-dependent factors because they:',
      options: [
        'Act regardless of population size (e.g., volcanic eruption)',
        'Increase with population density (e.g., competition)',
        'Only affect predators',
        'Operate only in laboratory populations',
      ],
      answer: 'Act regardless of population size (e.g., volcanic eruption)',
      explanation:
        'Density-independent factors such as natural disasters impact populations regardless of density.',
      syllabus: 'BIO5-8',
      keywords: ['density-independent', 'population dynamics', 'limiting factors'],
    },
  ],
};

module.exports = { DATA, createQuestion, DOTPOINT_TABS };

if (require.main === module) {
  const outputPath =
    process.argv[2] ||
    path.join(__dirname, 'additional-biology-questions.json');

  // When executed directly, export the flattened question list.
  const flattened = Object.entries(DATA).flatMap(([dotPointId, entries]) =>
    entries.map((entry) => createQuestion(dotPointId, entry)),
  );

  fs.writeFileSync(outputPath, JSON.stringify(flattened, null, 2));
  console.log(`Saved ${flattened.length} additional questions to ${outputPath}`);
}
