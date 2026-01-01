const fs = require('fs');

// Read file with BOM
const content = fs.readFileSync('src/data/biology/module5/learnSections.json', 'utf8');

// Remove BOM if present
const cleaned = content.replace(/^\uFEFF/, '');

// Write back
fs.writeFileSync('src/data/biology/module5/learnSections.json', cleaned, 'utf8');

console.log('BOM removed from biology/module5/learnSections.json');

// Validate it's now valid JSON
try {
  const data = JSON.parse(cleaned);
  console.log('✓ Valid JSON -', Object.keys(data).length, 'dotpoints');
} catch (e) {
  console.log('✗ Error:', e.message);
}
