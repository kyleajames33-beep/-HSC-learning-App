/**
 * Question Validation Script
 *
 * Validates quiz question data without syncing to agents.
 * Useful for checking questions before running sync.
 *
 * Usage:
 *   GOOGLE_SHEET_ID=your_sheet_id node scripts/validateQuestions.js
 *
 * Or validate a local JSON file:
 *   node scripts/validateQuestions.js path/to/questions.json
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(__dirname, '../credentials.json');
const SHEET_NAME = 'Sheet1';

// Column indices (matches syncQuestionsFromSheets.js)
const COLS = {
  ID: 0,
  SUBJECT: 2,
  MODULE_ID: 3,
  DOTPOINT_ID: 4,
  TEXT: 5,
  OPTION_A: 6,
  OPTION_B: 7,
  OPTION_C: 8,
  OPTION_D: 9,
  ANSWER: 10,
  EXPLANATION: 11,
  DIFFICULTY: 12,
  TIME_LIMIT: 13,
  POINTS: 14,
  SYLLABUS: 15,
  KEYWORDS: 16,
  STATUS: 17
};

/**
 * Authenticate with Google Sheets API
 */
async function authenticate() {
  const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(credentialsContent);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return await auth.getClient();
}

/**
 * Fetch data from Google Sheets
 */
async function fetchSheetData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:R1000`,
  });

  return response.data.values || [];
}

/**
 * Parse row into question object
 */
function parseRow(row, rowIndex) {
  if (row.length < 12) return null;

  const options = [
    row[COLS.OPTION_A],
    row[COLS.OPTION_B],
    row[COLS.OPTION_C],
    row[COLS.OPTION_D]
  ].filter(opt => opt && opt.trim() !== '');

  return {
    id: row[COLS.ID] || `question-${rowIndex + 2}`,
    question: row[COLS.TEXT] || '',
    options: options,
    correctAnswer: row[COLS.ANSWER] || '',
    explanation: row[COLS.EXPLANATION] || '',
    difficulty: (row[COLS.DIFFICULTY] || '').toLowerCase(),
    time_limit: parseInt(row[COLS.TIME_LIMIT]) || 60,
    syllabus_outcome: row[COLS.SYLLABUS] || '',
    status: (row[COLS.STATUS] || '').toLowerCase(),
    subject: (row[COLS.SUBJECT] || '').trim(),
    rowIndex: rowIndex + 2
  };
}

/**
 * Comprehensive validation with detailed feedback
 */
function validateQuestions(questions) {
  const errors = [];
  const warnings = [];
  const info = [];

  // Check for duplicates
  const ids = {};
  for (const q of questions) {
    if (ids[q.id]) {
      errors.push({
        type: 'DUPLICATE_ID',
        severity: 'critical',
        row: q.rowIndex,
        id: q.id,
        message: `Duplicate ID "${q.id}" (also in row ${ids[q.id]})`
      });
    } else {
      ids[q.id] = q.rowIndex;
    }
  }

  // Validate each question
  for (const q of questions) {
    const row = q.rowIndex;

    // === CRITICAL ERRORS ===

    if (!q.id || q.id.trim() === '') {
      errors.push({
        type: 'MISSING_ID',
        severity: 'critical',
        row,
        message: 'Missing question ID (column A)'
      });
    }

    if (!q.question || q.question.trim() === '') {
      errors.push({
        type: 'MISSING_QUESTION',
        severity: 'critical',
        row,
        id: q.id,
        message: 'Missing question text (column F)'
      });
    }

    if (!q.correctAnswer || q.correctAnswer.trim() === '') {
      errors.push({
        type: 'MISSING_ANSWER',
        severity: 'critical',
        row,
        id: q.id,
        message: 'Missing correct answer (column K)'
      });
    }

    if (!q.explanation || q.explanation.trim() === '') {
      errors.push({
        type: 'MISSING_EXPLANATION',
        severity: 'critical',
        row,
        id: q.id,
        message: 'Missing explanation (column L)'
      });
    }

    if (q.options.length === 0) {
      errors.push({
        type: 'NO_OPTIONS',
        severity: 'critical',
        row,
        id: q.id,
        message: 'No options provided (columns G-J all empty)'
      });
    }

    // Answer must match one of the options
    if (q.correctAnswer && q.options.length > 0) {
      const exactMatch = q.options.includes(q.correctAnswer);

      if (!exactMatch) {
        // Try case-insensitive match
        const caseMatch = q.options.find(
          opt => opt.toLowerCase() === q.correctAnswer.toLowerCase()
        );

        if (caseMatch) {
          errors.push({
            type: 'ANSWER_CASE_MISMATCH',
            severity: 'critical',
            row,
            id: q.id,
            message: `Answer case mismatch: "${q.correctAnswer}" should be "${caseMatch}"`
          });
        } else {
          // Try to find closest match (Levenshtein distance)
          const closest = findClosestMatch(q.correctAnswer, q.options);
          errors.push({
            type: 'ANSWER_NOT_IN_OPTIONS',
            severity: 'critical',
            row,
            id: q.id,
            message: `Correct answer "${q.correctAnswer}" not found in options`,
            suggestion: closest ? `Did you mean "${closest}"?` : 'Check spelling and capitalization'
          });
        }
      }
    }

    // Subject validation
    const validSubjects = ['chemistry', 'biology'];
    if (!q.subject || !validSubjects.includes(q.subject.toLowerCase())) {
      errors.push({
        type: 'INVALID_SUBJECT',
        severity: 'critical',
        row,
        id: q.id,
        message: `Invalid subject "${q.subject}" (must be Chemistry or Biology)`
      });
    }

    // === WARNINGS ===

    if (q.explanation && q.explanation.length < 20) {
      warnings.push({
        type: 'SHORT_EXPLANATION',
        severity: 'warning',
        row,
        id: q.id,
        message: `Explanation is short (${q.explanation.length} chars)`,
        suggestion: 'Aim for at least 20 characters for meaningful feedback'
      });
    }

    if (q.question && q.question.length < 10) {
      warnings.push({
        type: 'SHORT_QUESTION',
        severity: 'warning',
        row,
        id: q.id,
        message: `Question text is short (${q.question.length} chars)`,
        suggestion: 'Ensure question is clear and complete'
      });
    }

    if (!q.syllabus_outcome || q.syllabus_outcome.trim() === '') {
      warnings.push({
        type: 'MISSING_SYLLABUS',
        severity: 'warning',
        row,
        id: q.id,
        message: 'Missing syllabus_outcome (column P)',
        suggestion: 'Add HSC syllabus code (e.g., ACSBL075)'
      });
    }

    if (q.time_limit < 20 || q.time_limit > 300) {
      warnings.push({
        type: 'UNUSUAL_TIME_LIMIT',
        severity: 'warning',
        row,
        id: q.id,
        message: `Unusual time limit: ${q.time_limit}s`,
        suggestion: 'Typical range is 45-120 seconds'
      });
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (q.difficulty && !validDifficulties.includes(q.difficulty)) {
      warnings.push({
        type: 'INVALID_DIFFICULTY',
        severity: 'warning',
        row,
        id: q.id,
        message: `Invalid difficulty "${q.difficulty}"`,
        suggestion: 'Use: easy, medium, or hard (will default to medium)'
      });
    }

    if (q.options.length < 4) {
      warnings.push({
        type: 'FEW_OPTIONS',
        severity: 'warning',
        row,
        id: q.id,
        message: `Only ${q.options.length} options provided`,
        suggestion: 'Multiple choice questions typically have 4 options'
      });
    }

    // === INFO ===

    if (q.status !== 'approved') {
      info.push({
        type: 'NOT_APPROVED',
        severity: 'info',
        row,
        id: q.id,
        message: `Status is "${q.status}" (will be skipped in sync)`,
        suggestion: 'Set status to "approved" to include in sync'
      });
    }
  }

  return { errors, warnings, info };
}

/**
 * Find closest matching string using Levenshtein distance
 */
function findClosestMatch(target, options) {
  if (!target || options.length === 0) return null;

  let closest = null;
  let minDistance = Infinity;

  for (const option of options) {
    const distance = levenshteinDistance(target.toLowerCase(), option.toLowerCase());
    if (distance < minDistance) {
      minDistance = distance;
      closest = option;
    }
  }

  // Only return if reasonably close (distance < 30% of string length)
  return minDistance < target.length * 0.3 ? closest : null;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Display validation results
 */
function displayResults(errors, warnings, info, totalQuestions) {
  console.log('\n📊 Validation Results:');
  console.log('='.repeat(60));
  console.log(`Total questions checked: ${totalQuestions}`);
  console.log(`Critical errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Info messages: ${info.length}`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n❌ CRITICAL ERRORS (must fix before sync):');
    console.log('-'.repeat(60));
    errors.forEach((err, idx) => {
      console.log(`\n${idx + 1}. Row ${err.row}${err.id ? ` (${err.id})` : ''}:`);
      console.log(`   ${err.message}`);
      if (err.suggestion) {
        console.log(`   💡 ${err.suggestion}`);
      }
    });
  }

  if (warnings.length > 0) {
    console.log('\n\n⚠️  WARNINGS (recommended to fix):');
    console.log('-'.repeat(60));
    warnings.slice(0, 10).forEach((warn, idx) => {
      console.log(`\n${idx + 1}. Row ${warn.row}${warn.id ? ` (${warn.id})` : ''}:`);
      console.log(`   ${warn.message}`);
      if (warn.suggestion) {
        console.log(`   💡 ${warn.suggestion}`);
      }
    });
    if (warnings.length > 10) {
      console.log(`\n   ... and ${warnings.length - 10} more warnings`);
    }
  }

  if (info.length > 0 && info.length <= 5) {
    console.log('\n\nℹ️  INFO:');
    console.log('-'.repeat(60));
    info.forEach((item, idx) => {
      console.log(`${idx + 1}. Row ${item.row}${item.id ? ` (${item.id})` : ''}: ${item.message}`);
    });
  } else if (info.length > 5) {
    console.log(`\n\nℹ️  INFO: ${info.length} questions not approved (will be skipped in sync)`);
  }

  console.log('\n' + '='.repeat(60));

  if (errors.length === 0) {
    console.log('\n✅ All questions are valid! Ready to sync.');
    return 0;
  } else {
    console.log(`\n🛑 Fix ${errors.length} critical errors before syncing.`);
    return 1;
  }
}

/**
 * Main validation function
 */
async function validate() {
  console.log('🔍 Question Validation Tool\n');

  // Check if validating a local file
  const localFile = process.argv[2];
  if (localFile && !localFile.startsWith('--')) {
    console.log(`Validating local file: ${localFile}\n`);
    try {
      const content = await fs.readFile(localFile, 'utf8');
      const data = JSON.parse(content);
      const questions = Array.isArray(data) ? data : data.questions || [];

      const validated = questions.map((q, i) => ({ ...q, rowIndex: i + 1 }));
      const { errors, warnings, info } = validateQuestions(validated);
      const exitCode = displayResults(errors, warnings, info, questions.length);
      process.exit(exitCode);
    } catch (error) {
      console.error('❌ Failed to read file:', error.message);
      process.exit(1);
    }
  }

  // Validate from Google Sheets
  if (!SHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID environment variable not set');
    console.log('Usage:');
    console.log('  GOOGLE_SHEET_ID=your_sheet_id node scripts/validateQuestions.js');
    console.log('  OR');
    console.log('  node scripts/validateQuestions.js path/to/questions.json');
    process.exit(1);
  }

  try {
    console.log('Connecting to Google Sheets...');
    const auth = await authenticate();
    console.log('✅ Authenticated\n');

    console.log('Fetching questions...');
    const rows = await fetchSheetData(auth);
    console.log(`✅ Fetched ${rows.length} rows\n`);

    console.log('Parsing questions...');
    const questions = rows.map((row, i) => parseRow(row, i)).filter(q => q);
    console.log(`✅ Parsed ${questions.length} questions\n`);

    console.log('Validating...');
    const { errors, warnings, info } = validateQuestions(questions);

    const exitCode = displayResults(errors, warnings, info, questions.length);
    process.exit(exitCode);

  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  validate();
}

module.exports = { validateQuestions, findClosestMatch };
