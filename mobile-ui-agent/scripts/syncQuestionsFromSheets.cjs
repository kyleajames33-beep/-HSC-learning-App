/**
 * Google Sheets Question Sync Script
 *
 * Syncs quiz questions from Google Sheets to biology-agent and chemistry-agent.
 * Supports both Chemistry and Biology questions in the same sheet.
 *
 * Usage:
 *   GOOGLE_SHEET_ID=your_sheet_id node scripts/syncQuestionsFromSheets.js
 *
 * Options:
 *   --dry-run  Preview changes without writing files
 *
 * Sheet Structure (18 columns):
 *   A: id, B: id (duplicate), C: subject, D: moduleId, E: dotPointId,
 *   F: text, G-J: option_a through option_d, K: answer, L: explanation,
 *   M: difficulty, N: time_limit, O: points, P: syllabus_outcome,
 *   Q: keywords, R: status
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(__dirname, '../credentials.json');
const SHEET_NAME = 'Sheet1'; // Default sheet name
const DRY_RUN = process.argv.includes('--dry-run');

// Column indices (0-based) - ACTUAL sheet layout (first column is blank)
const COLS = {
  ID: 1,              // B: subject is used as id temporarily
  SUBJECT: 1,         // B: subject
  MODULE_ID: 2,       // C: moduleId
  DOTPOINT_ID: 3,     // D: dotPointId
  TEXT: 4,            // E: text (question)
  OPTION_A: 5,        // F: option_a
  OPTION_B: 6,        // G: option_b
  OPTION_C: 7,        // H: option_c
  OPTION_D: 8,        // I: option_d
  ANSWER: 9,          // J: answer
  EXPLANATION: 10,    // K: explanation
  DIFFICULTY: 11,     // L: difficulty
  TIME_LIMIT: 12,     // M: time_limit
  POINTS: 13,         // N: points
  SYLLABUS: 14,       // O: syllabus_outcome
  KEYWORDS: 15,       // P: keywords
  STATUS: 16          // Q: status
};

/**
 * Authenticate with Google Sheets API
 */
async function authenticate() {
  try {
    const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(credentialsContent);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return await auth.getClient();
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('\n📝 Setup Instructions:');
    console.log('1. Place credentials.json in mobile-ui-agent/credentials.json');
    console.log('2. Set GOOGLE_SHEET_ID environment variable');
    console.log('3. Share your sheet with the service account email');
    throw error;
  }
}

/**
 * Fetch all sheet tabs
 */
async function getAllSheetTabs(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    return response.data.sheets.map(sheet => sheet.properties.title);
  } catch (error) {
    console.error('❌ Failed to get sheet tabs:', error.message);
    throw error;
  }
}

/**
 * Fetch data from Google Sheets (all tabs)
 */
async function fetchSheetData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Get all tabs
    const tabNames = await getAllSheetTabs(auth);
    console.log(`   Found ${tabNames.length} tabs: ${tabNames.join(', ')}\n`);

    let allRows = [];

    // Fetch data from each tab
    for (const tabName of tabNames) {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: `${tabName}!A2:R1000`, // Skip header row
        });

        const rows = response.data.values || [];
        if (rows.length > 0) {
          console.log(`   ✅ ${tabName}: ${rows.length} rows`);
          allRows = allRows.concat(rows);
        } else {
          console.log(`   ⚠️  ${tabName}: empty`);
        }
      } catch (error) {
        console.log(`   ⚠️  ${tabName}: ${error.message}`);
      }
    }

    console.log('');
    return allRows;
  } catch (error) {
    console.error('❌ Failed to fetch sheet data:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('- Check if GOOGLE_SHEET_ID is correct');
    console.log('- Ensure service account has access to the sheet');
    throw error;
  }
}

/**
 * Parse a row from the sheet into a question object
 */
function parseRow(row, rowIndex) {
  // Skip if not enough columns
  if (row.length < 12) {
    console.warn(`⚠️  Row ${rowIndex + 2} skipped: insufficient columns (${row.length}/12 minimum)`);
    return null;
  }

  // Skip if status is not "approved"
  const status = row[COLS.STATUS] || '';
  if (status.toLowerCase() !== 'approved') {
    return null; // Silently skip non-approved questions
  }

  // Build options array from columns G-J
  const options = [
    row[COLS.OPTION_A],
    row[COLS.OPTION_B],
    row[COLS.OPTION_C],
    row[COLS.OPTION_D]
  ].filter(opt => opt && opt.trim() !== ''); // Remove empty options

  // Parse keywords (comma-separated string → array)
  const keywords = row[COLS.KEYWORDS]
    ? row[COLS.KEYWORDS].split(',').map(k => k.trim()).filter(k => k)
    : [];

  // Parse time limit and points as integers
  const timeLimit = row[COLS.TIME_LIMIT] ? parseInt(row[COLS.TIME_LIMIT]) : 60;
  const points = row[COLS.POINTS] ? parseInt(row[COLS.POINTS]) : 1;

  // Generate ID from subject, module, dotpoint
  const subject = (row[COLS.SUBJECT] || '').trim();
  const moduleId = (row[COLS.MODULE_ID] || '').trim();
  const dotPointId = (row[COLS.DOTPOINT_ID] || '').trim();
  const generatedId = `${subject.toLowerCase().substring(0,4)}_m${moduleId}_${dotPointId.replace(/\./g, '-')}_${rowIndex + 2}`;

  const question = {
    id: generatedId,
    question: row[COLS.TEXT] || '',
    type: 'multiple-choice', // All questions are MCQ for now
    options: options,
    correctAnswer: row[COLS.ANSWER] || '',
    explanation: row[COLS.EXPLANATION] || '',
    difficulty: (row[COLS.DIFFICULTY] || 'medium').toLowerCase(),
    time_limit: isNaN(timeLimit) ? 60 : timeLimit,
    points: isNaN(points) ? 1 : points,
    syllabus_outcome: row[COLS.SYLLABUS] || '',
    keywords: keywords,

    // Metadata for grouping (will be removed before writing)
    _subject: subject,
    _moduleId: moduleId,
    _dotPointId: dotPointId,
    _rowIndex: rowIndex + 2 // For error reporting (1-indexed + header row)
  };

  return question;
}

/**
 * Group questions by subject/module/dotpoint
 */
function groupQuestions(questions) {
  const grouped = {};

  for (const q of questions) {
    const subject = q._subject.toLowerCase();
    const moduleId = q._moduleId;
    const dotPointId = q._dotPointId;
    const key = `${subject}:module${moduleId}:${dotPointId}`;

    if (!grouped[key]) {
      grouped[key] = {
        subject,
        moduleId,
        dotPointId,
        questions: []
      };
    }

    // Remove metadata fields before adding to output
    const { _subject, _moduleId, _dotPointId, _rowIndex, ...questionOnly } = q;
    grouped[key].questions.push(questionOnly);
  }

  return grouped;
}

/**
 * Validate questions for errors
 */
function validateQuestions(questions) {
  const errors = [];
  const warnings = [];

  for (const q of questions) {
    const row = q._rowIndex;

    // Critical errors
    if (!q.id || q.id.trim() === '') {
      errors.push(`Row ${row}: Missing question ID (column A)`);
    }

    if (!q.question || q.question.trim() === '') {
      errors.push(`Row ${row}: Missing question text (column F)`);
    }

    if (!q.correctAnswer || q.correctAnswer.trim() === '') {
      errors.push(`Row ${row} (${q.id}): Missing correct answer (column K)`);
    }

    if (!q.explanation || q.explanation.trim() === '') {
      errors.push(`Row ${row} (${q.id}): Missing explanation (column L)`);
    }

    if (q.options.length === 0) {
      errors.push(`Row ${row} (${q.id}): No options provided (columns G-J)`);
    }

    // Check if answer exists in options
    if (q.correctAnswer && q.options.length > 0) {
      const exactMatch = q.options.includes(q.correctAnswer);

      if (!exactMatch) {
        // Check for case-insensitive match
        const caseInsensitiveMatch = q.options.find(
          opt => opt.toLowerCase() === q.correctAnswer.toLowerCase()
        );

        if (caseInsensitiveMatch) {
          // Auto-correct the answer to match the option's case
          warnings.push(
            `Row ${row} (${q.id}): Auto-corrected answer case\n` +
            `   Was: "${q.correctAnswer}"\n` +
            `   Now: "${caseInsensitiveMatch}"`
          );
          q.correctAnswer = caseInsensitiveMatch;
        } else {
          errors.push(
            `Row ${row} (${q.id}): Correct answer not found in options\n` +
            `   Answer: "${q.correctAnswer}"\n` +
            `   Options: ${q.options.map(o => `"${o}"`).join(', ')}`
          );
        }
      }
    }

    // Subject validation
    const validSubjects = ['chemistry', 'biology'];
    if (!q._subject || !validSubjects.includes(q._subject.toLowerCase())) {
      errors.push(`Row ${row} (${q.id}): Invalid subject "${q._subject}" (must be Chemistry or Biology)`);
    }

    // Warnings
    if (q.explanation && q.explanation.length < 20) {
      warnings.push(`Row ${row} (${q.id}): Explanation is short (${q.explanation.length} chars, recommend >20)`);
    }

    if (q.question && q.question.length < 10) {
      warnings.push(`Row ${row} (${q.id}): Question text is short (${q.question.length} chars, recommend >10)`);
    }

    if (!q.syllabus_outcome || q.syllabus_outcome.trim() === '') {
      warnings.push(`Row ${row} (${q.id}): Missing syllabus_outcome (column P)`);
    }

    if (q.time_limit < 20 || q.time_limit > 300) {
      warnings.push(`Row ${row} (${q.id}): Unusual time limit (${q.time_limit}s, recommend 20-300s)`);
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(q.difficulty)) {
      warnings.push(`Row ${row} (${q.id}): Invalid difficulty "${q.difficulty}" (will default to "medium")`);
    }
  }

  return { errors, warnings };
}

/**
 * Check for duplicate question IDs
 */
function checkDuplicates(questions) {
  const ids = {};
  const duplicates = [];

  for (const q of questions) {
    if (ids[q.id]) {
      duplicates.push(`Duplicate ID "${q.id}" found in rows ${ids[q.id]} and ${q._rowIndex}`);
    } else {
      ids[q.id] = q._rowIndex;
    }
  }

  return duplicates;
}

/**
 * Get output path for a question group
 */
function getOutputPath(subject, moduleId, dotPointId) {
  const agentFolder = subject === 'chemistry' ? 'chemistry-agent' : 'biology-agent';
  const dotPointFolder = dotPointId.replace(/\./g, '-'); // Replace dots with dashes for folder names

  return path.join(
    __dirname,
    `../../${agentFolder}/questions/module${moduleId}/${dotPointId}/quickQuiz.json`
  );
}

/**
 * Get fallback path for biology questions
 */
function getFallbackPath(dotPointId) {
  const fileName = dotPointId.toLowerCase().replace(/\./g, '-') + '.json';
  return path.join(
    __dirname,
    `../src/data/quiz-questions/${fileName}`
  );
}

/**
 * Write question files
 */
async function writeQuestionFiles(grouped) {
  const filesSummary = [];

  for (const [key, data] of Object.entries(grouped)) {
    const { subject, moduleId, dotPointId, questions } = data;

    // Get output path
    const outputPath = getOutputPath(subject, moduleId, dotPointId);

    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would write: ${outputPath} (${questions.length} questions)`);
      filesSummary.push({ subject, moduleId, dotPointId, count: questions.length, path: outputPath });
      continue;
    }

    // Create directories if needed
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Backup existing file
    try {
      await fs.access(outputPath);
      const backupPath = outputPath.replace('.json', `.backup-${Date.now()}.json`);
      await fs.copyFile(outputPath, backupPath);
      console.log(`   📦 Backed up: ${path.basename(backupPath)}`);
    } catch (err) {
      // File doesn't exist, no backup needed
    }

    // Write new file
    const output = { questions };
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`   ✅ ${outputPath} (${questions.length} questions)`);

    filesSummary.push({ subject, moduleId, dotPointId, count: questions.length, path: outputPath });

    // Also create fallback in mobile-ui-agent for biology
    if (subject === 'biology') {
      await writeFallbackFile(dotPointId, questions);
    }
  }

  return filesSummary;
}

/**
 * Write fallback file in mobile-ui-agent (first 5 questions)
 */
async function writeFallbackFile(dotPointId, questions) {
  const fallbackPath = getFallbackPath(dotPointId);

  if (DRY_RUN) {
    console.log(`   [DRY RUN] Would write fallback: ${fallbackPath}`);
    return;
  }

  // Create directory if needed
  await fs.mkdir(path.dirname(fallbackPath), { recursive: true });

  // Take first 5 questions as fallback
  const fallbackQuestions = questions.slice(0, 5).map((q, index) => ({
    ...q,
    id: q.id || `${dotPointId}-fallback-${index + 1}`
  }));

  await fs.writeFile(fallbackPath, JSON.stringify(fallbackQuestions, null, 2));
  console.log(`   ✅ ${fallbackPath} (${fallbackQuestions.length} fallback questions)`);
}

/**
 * Main sync function
 */
async function syncQuestions() {
  console.log('🔄 Starting question sync from Google Sheets...\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be written\n');
  }

  if (!SHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID environment variable not set');
    console.log('Usage: GOOGLE_SHEET_ID=your_sheet_id node scripts/syncQuestionsFromSheets.js');
    process.exit(1);
  }

  try {
    // Step 1: Authenticate
    console.log('1️⃣  Authenticating with Google Sheets API...');
    const auth = await authenticate();
    console.log('✅ Authenticated successfully\n');

    // Step 2: Fetch data
    console.log('2️⃣  Fetching data from Google Sheets...');
    const rows = await fetchSheetData(auth);
    console.log(`✅ Fetched ${rows.length} rows\n`);

    if (rows.length === 0) {
      console.warn('⚠️  No data found in sheet. Check if sheet has content.');
      return;
    }

    // Step 3: Parse rows
    console.log('3️⃣  Parsing questions...');
    const allQuestions = [];
    const skippedCount = { notApproved: 0, insufficient: 0 };

    for (let i = 0; i < rows.length; i++) {
      const question = parseRow(rows[i], i);
      if (question) {
        allQuestions.push(question);
      } else {
        if (rows[i].length < 12) {
          skippedCount.insufficient++;
        } else {
          skippedCount.notApproved++;
        }
      }
    }

    console.log(`✅ Parsed ${allQuestions.length} approved questions`);
    if (skippedCount.notApproved > 0) {
      console.log(`   ⏭️  Skipped ${skippedCount.notApproved} questions (not approved)`);
    }
    if (skippedCount.insufficient > 0) {
      console.log(`   ⏭️  Skipped ${skippedCount.insufficient} rows (insufficient columns)`);
    }
    console.log('');

    if (allQuestions.length === 0) {
      console.warn('⚠️  No approved questions found. Check "status" column (R) in sheet.');
      return;
    }

    // Step 4: Check for duplicates
    console.log('4️⃣  Checking for duplicate IDs...');
    const duplicates = checkDuplicates(allQuestions);
    if (duplicates.length > 0) {
      console.error('❌ Duplicate question IDs found:');
      duplicates.forEach(dup => console.error(`   ${dup}`));
      console.log('\n🛑 Sync aborted. Fix duplicates and try again.\n');
      process.exit(1);
    }
    console.log('✅ No duplicates found\n');

    // Step 5: Validate
    console.log('5️⃣  Validating questions...');
    const { errors, warnings } = validateQuestions(allQuestions);

    if (errors.length > 0) {
      console.error(`❌ ${errors.length} validation errors found:\n`);
      errors.forEach(err => console.error(`   ${err}`));
      console.log('\n🛑 Sync aborted. Fix errors in Google Sheet and try again.\n');
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.warn(`⚠️  ${warnings.length} validation warnings:\n`);
      warnings.forEach(warn => console.warn(`   ${warn}`));
      console.log('');
    } else {
      console.log('✅ All questions valid\n');
    }

    // Step 6: Group questions
    console.log('6️⃣  Grouping questions by subject/module/dotpoint...');
    const grouped = groupQuestions(allQuestions);
    console.log(`✅ Grouped into ${Object.keys(grouped).length} question sets\n`);

    // Step 7: Write files
    console.log('7️⃣  Writing question files...');
    const summary = await writeQuestionFiles(grouped);
    console.log('');

    // Step 8: Summary
    console.log('📊 Sync Summary:');
    console.log('================');

    const bySubject = {};
    for (const item of summary) {
      if (!bySubject[item.subject]) {
        bySubject[item.subject] = [];
      }
      bySubject[item.subject].push(item);
    }

    for (const [subject, items] of Object.entries(bySubject)) {
      const total = items.reduce((sum, item) => sum + item.count, 0);
      console.log(`\n${subject.charAt(0).toUpperCase() + subject.slice(1)}: ${total} questions`);
      items.forEach(item => {
        console.log(`  Module ${item.moduleId} → ${item.dotPointId}: ${item.count} questions`);
      });
    }

    console.log('================');
    console.log(DRY_RUN ? '\n🔍 Dry run completed! No files were written.\n' : '\n🎉 Sync completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncQuestions();
}

module.exports = { syncQuestions };
