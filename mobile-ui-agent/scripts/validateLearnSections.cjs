#!/usr/bin/env node
/**
 * Validate Learn tab JSON exports against expected schema rules.
 *
 * Usage:
 *   node scripts/validateLearnSections.cjs [relative/path/to/json]
 *
 * If no path is provided the script checks:
 *   ./src/data/biologyModule5LearnSections.json
 */

const fs = require('fs/promises');
const path = require('path');

const DEFAULT_DATA_FILE = path.join(__dirname, '../src/data/biologyModule5LearnSections.json');

const TYPE_REQUIREMENTS = {
  video: (section, dotPointId, errors) => {
    if (!section.content || !section.content.url) {
      errors.push(`${dotPointId}/${section.sectionId}: video section is missing content.url`);
    }
  },
  'interactive-cards': (section, dotPointId, errors) => {
    if (!section.content || !Array.isArray(section.content.cards) || section.content.cards.length === 0) {
      errors.push(`${dotPointId}/${section.sectionId}: interactive-cards section needs at least one card`);
    }
  },
  flashcards: (section, dotPointId, errors) => {
    if (!section.content || !Array.isArray(section.content.terms) || section.content.terms.length === 0) {
      errors.push(`${dotPointId}/${section.sectionId}: flashcards section needs at least one term`);
    }
  },
  practice: (section, dotPointId, errors) => {
    if (!section.content || !Array.isArray(section.content.questions) || section.content.questions.length === 0) {
      errors.push(`${dotPointId}/${section.sectionId}: practice section needs at least one question`);
    }
  }
};

const toNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const highlight = {
  info: (msg) => console.log(`\n[info] ${msg}`),
  warn: (msg) => console.warn(`[warn] ${msg}`),
  error: (msg) => console.error(`[error] ${msg}`)
};

async function loadJson(targetPath) {
  try {
    const jsonRaw = await fs.readFile(targetPath, 'utf8');
    return JSON.parse(jsonRaw);
  } catch (error) {
    highlight.error(`Failed to read or parse "${targetPath}": ${error.message}`);
    process.exitCode = 1;
    return null;
  }
}

function validateDotPoint(dotPointId, sections, results) {
  if (!Array.isArray(sections)) {
    results.errors.push(`${dotPointId}: expected an array of sections but found ${typeof sections}`);
    return;
  }

  if (sections.length === 0) {
    results.errors.push(`${dotPointId}: has no sections`);
    return;
  }

  const seenSectionIds = new Set();
  let expectedOrder = 1;

  sections.forEach((section, index) => {
    const location = `${dotPointId} section ${index + 1}`;

    if (!section || typeof section !== 'object') {
      results.errors.push(`${location}: section is not an object`);
      return;
    }

    const { sectionId, type, title, order, xp } = section;

    if (!sectionId || typeof sectionId !== 'string') {
      results.errors.push(`${location}: missing sectionId`);
    } else if (seenSectionIds.has(sectionId)) {
      results.warnings.push(`${dotPointId}/${sectionId}: duplicate sectionId`);
    } else {
      seenSectionIds.add(sectionId);
    }

    if (!type || typeof type !== 'string') {
      results.errors.push(`${dotPointId}/${sectionId || '(unknown)'}: missing type`);
    }

    if (!title || typeof title !== 'string') {
      results.errors.push(`${dotPointId}/${sectionId || '(unknown)'}: missing title`);
    }

    const numericOrder = toNumber(order);
    if (numericOrder === null) {
      results.errors.push(`${dotPointId}/${sectionId || '(unknown)'}: order must be a number`);
    } else {
      if (numericOrder !== expectedOrder) {
        results.warnings.push(`${dotPointId}/${sectionId || '(unknown)'}: expected order ${expectedOrder} but found ${numericOrder}`);
      }
      expectedOrder += 1;
    }

    const numericXP = toNumber(xp);
    if (numericXP === null) {
      results.warnings.push(`${dotPointId}/${sectionId || '(unknown)'}: xp is missing or not a number (defaults to 0 in code)`);
    } else if (numericXP < 0 || numericXP > 100) {
      results.warnings.push(`${dotPointId}/${sectionId || '(unknown)'}: xp value ${numericXP} is outside the expected 0-100 range`);
    }

    const validator = TYPE_REQUIREMENTS[type];
    if (validator) {
      validator(section, dotPointId, results.errors);
    }
  });
}

function runValidation(data) {
  const results = {
    errors: [],
    warnings: [],
    totalDotPoints: 0,
    totalSections: 0
  };

  Object.entries(data).forEach(([dotPointId, sections]) => {
    results.totalDotPoints += 1;
    if (Array.isArray(sections)) {
      results.totalSections += sections.length;
    }
    validateDotPoint(dotPointId, sections, results);
  });

  return results;
}

async function main() {
  const targetPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_DATA_FILE;

  highlight.info(`Validating learn sections from ${targetPath}`);
  const data = await loadJson(targetPath);

  if (!data) {
    return;
  }

  const { errors, warnings, totalDotPoints, totalSections } = runValidation(data);

  highlight.info(`Dotpoints checked: ${totalDotPoints}`);
  highlight.info(`Sections checked: ${totalSections}`);

  if (warnings.length > 0) {
    highlight.warn('\nWarnings:');
    warnings.forEach((warning) => highlight.warn(`  - ${warning}`));
  }

  if (errors.length > 0) {
    highlight.error('\nErrors:');
    errors.forEach((error) => highlight.error(`  - ${error}`));
    highlight.error('\nValidation failed.');
    process.exitCode = 1;
  } else {
    highlight.info('\nValidation passed with no blocking issues.');
  }
}

main();
