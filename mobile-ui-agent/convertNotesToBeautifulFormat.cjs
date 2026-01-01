const fs = require('fs');
const path = require('path');

// Files to process
const files = [
  'src/data/biology/module5/learnSections.json',
  'src/data/biology/module6/learnSections.json',
  'src/data/biology/module7/learnSections.json',
  'src/data/biology/module8/learnSections.json',
  'src/data/chemistry/module5/learnSections.json',
  'src/data/chemistry/module6/learnSections.json',
  'src/data/chemistry/module7/learnSections.json',
  'src/data/chemistry/module8/learnSections.json'
];

function convertMnemonicsToArray(mnemonicString) {
  if (!mnemonicString) return [];

  // Extract the mnemonic phrase and explanation
  // Format: "Remember ABL: Arrhenius (Aqueous), Brønsted-Lowry (proton), Lewis (Lone pair)."
  // or "Use HYPE: Hybridisation, rYngs (rings), Pi bonds, Examples."

  const match = mnemonicString.match(/(?:Remember|Use)\s+([A-Z]+):\s*(.+)/);
  if (match) {
    return [{
      phrase: match[1].trim(),
      explanation: match[2].trim().replace(/\.$/, '')
    }];
  }

  // Fallback: create a generic mnemonic
  return [{
    phrase: mnemonicString.substring(0, 50),
    explanation: mnemonicString
  }];
}

function generateCommonMistakes(keyPoints, summary) {
  // Generate common mistakes based on the content
  // This is a heuristic approach - creating realistic mistakes
  const mistakes = [];

  // Common chemistry mistakes based on topic indicators
  if (summary.includes('Arrhenius') || summary.includes('Brønsted-Lowry') || summary.includes('Lewis')) {
    mistakes.push({
      mistake: "Confusing which acid-base theory applies to a given reaction",
      why: "Students often default to Arrhenius without checking if the reaction occurs in water",
      correct: "Identify the medium first: aqueous = Arrhenius possible, gas/non-aqueous = Brønsted-Lowry, electron transfer = Lewis"
    });
    mistakes.push({
      mistake: "Forgetting that Lewis theory is the most general",
      why: "All Brønsted-Lowry acids are Lewis acids, but not vice versa",
      correct: "Lewis theory encompasses all acid-base reactions including those without proton transfer"
    });
  } else if (summary.includes('hydrocarbon') || summary.includes('alkane') || summary.includes('alkene')) {
    mistakes.push({
      mistake: "Confusing structural formulas with molecular formulas",
      why: "Different structures can have the same molecular formula (isomers)",
      correct: "Always draw structural formulas to show connectivity and avoid ambiguity"
    });
    mistakes.push({
      mistake: "Incorrectly numbering the carbon chain",
      why: "Students don't always choose the longest chain or minimize substituent numbers",
      correct: "Find the longest continuous carbon chain and number to give lowest locants to substituents"
    });
  } else if (summary.includes('combustion')) {
    mistakes.push({
      mistake: "Not balancing combustion equations correctly",
      why: "Students forget to balance oxygen last and water coefficients",
      correct: "Balance C first, then H, then O. Use fractions if needed, then multiply to get whole numbers"
    });
    mistakes.push({
      mistake: "Assuming all combustion is complete",
      why: "Incomplete combustion producing CO and C is common when oxygen is limited",
      correct: "Check oxygen availability: limited O2 = incomplete combustion with CO/C products"
    });
  } else if (summary.includes('nomenclature') || summary.includes('IUPAC')) {
    mistakes.push({
      mistake: "Applying alphabetical order to prefixes like di-, tri-",
      why: "Multiplicative prefixes should be ignored when alphabetizing",
      correct: "Alphabetize based on substituent name only: dimethyl comes under 'm' not 'd'"
    });
    mistakes.push({
      mistake: "Forgetting to include stereochemical descriptors",
      why: "E/Z or R/S notation is required for complete IUPAC names when stereoisomers exist",
      correct: "Always check for chirality or restricted rotation and add appropriate descriptors"
    });
  } else {
    // Generic chemistry mistakes
    mistakes.push({
      mistake: "Not showing all working in calculations",
      why: "Markers award method marks even if final answer is incorrect",
      correct: "Write out formula, substitute values, show units, and calculate step-by-step"
    });
    mistakes.push({
      mistake: "Confusing similar-sounding terms or concepts",
      why: "Chemistry has many related but distinct concepts",
      correct: "Create clear definitions and examples for each term to distinguish them"
    });
  }

  return mistakes.slice(0, 3); // Return max 3 mistakes
}

function generateQuickReference(keyPoints, summary) {
  const reference = {};

  // Extract key comparisons or definitions from keyPoints
  keyPoints.forEach((point, index) => {
    if (point.includes(':')) {
      // Format like "Arrhenius: acids produce H+ and bases produce OH- in water."
      const parts = point.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim().replace(/\.$/, '');
        reference[key] = value.substring(0, 100); // Limit length
      }
    } else if (point.includes('vs') || point.includes('versus')) {
      reference[`Point ${index + 1}`] = point.substring(0, 80);
    }
  });

  // If we didn't get enough from keyPoints, add some generic ones
  if (Object.keys(reference).length < 3) {
    reference['Key Concept'] = summary.substring(0, 100) + '...';
  }

  return reference;
}

function convertNotesSection(notesSection, isBiology = false) {
  const content = notesSection.content;

  // Already in beautiful format?
  if (Array.isArray(content.mnemonics) &&
      Array.isArray(content.commonMistakes) &&
      typeof content.quickReference === 'object') {
    console.log('Already in beautiful format, skipping...');
    return notesSection;
  }

  const newContent = {
    summary: content.summary || '',
    keyPoints: content.keyPoints || [],
    mnemonics: [],
    examTips: content.examTips || [],
    commonMistakes: [],
    quickReference: {}
  };

  // Convert mnemonics - handle both string and array
  if (typeof content.mnemonics === 'string') {
    newContent.mnemonics = convertMnemonicsToArray(content.mnemonics);
  } else if (Array.isArray(content.mnemonics)) {
    newContent.mnemonics = content.mnemonics;
  }

  // Handle summary array (old Biology format)
  if (Array.isArray(content.summary)) {
    // Convert array to string
    newContent.summary = content.summary[0] || '';
    // Use remaining items as keyPoints if keyPoints is empty
    if (newContent.keyPoints.length === 0) {
      newContent.keyPoints = content.summary.slice(1);
    }
  }

  // Generate commonMistakes
  newContent.commonMistakes = generateCommonMistakes(newContent.keyPoints, newContent.summary);

  // Generate quickReference
  newContent.quickReference = generateQuickReference(newContent.keyPoints, newContent.summary);

  return {
    ...notesSection,
    subjectColor: isBiology ? 'green' : 'blue',
    title: notesSection.title.replace('Summary Notes', 'Study Notes').replace('Summary & Notes', 'Study Notes'),
    content: newContent
  };
}

function processFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);

  const fullPath = path.join(__dirname, filePath);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  // Check if this is a biology file
  const isBiology = filePath.includes('biology');

  let convertedCount = 0;

  // Iterate through all dotpoints
  Object.keys(data).forEach(dotpointId => {
    const sections = data[dotpointId];

    sections.forEach((section, index) => {
      if (section.type === 'notes') {
        console.log(`  Converting notes for ${dotpointId}...`);
        sections[index] = convertNotesSection(section, isBiology);
        convertedCount++;
      }
    });
  });

  // Write back to file
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
  console.log(`  ✓ Converted ${convertedCount} notes sections`);

  return convertedCount;
}

// Main execution
console.log('=================================================');
console.log('Converting Notes to Beautiful Format');
console.log('=================================================');

let totalConverted = 0;

files.forEach(file => {
  try {
    const count = processFile(file);
    totalConverted += count;
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('\n=================================================');
console.log(`Total notes sections converted: ${totalConverted}`);
console.log('=================================================\n');
