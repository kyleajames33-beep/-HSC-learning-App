/**
 * Upload Questions to Google Sheets
 *
 * Writes quiz questions to Google Sheets with proper formatting.
 * Creates new tabs for each dotpoint and populates them with questions.
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(__dirname, '../credentials.json');

// Column headers
const HEADERS = [
  '', // Blank first column
  'subject',
  'moduleId',
  'dotPointId',
  'text',
  'option_a',
  'option_b',
  'option_c',
  'option_d',
  'answer',
  'explanation',
  'difficulty',
  'time_limit',
  'points',
  'syllabus_outcome',
  'keywords',
  'status'
];

/**
 * Authenticate with Google Sheets API
 */
async function authenticate() {
  try {
    const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(credentialsContent);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return await auth.getClient();
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    throw error;
  }
}

/**
 * Create a new sheet tab if it doesn't exist
 */
async function createSheetTab(sheets, sheetId, tabName) {
  try {
    // Get existing sheets
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const existingSheet = response.data.sheets.find(
      sheet => sheet.properties.title === tabName
    );

    if (existingSheet) {
      console.log(`  ✅ Tab "${tabName}" already exists`);
      return existingSheet.properties.sheetId;
    }

    // Create new sheet
    const addSheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: tabName,
            }
          }
        }]
      }
    });

    const newSheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
    console.log(`  ✅ Created new tab "${tabName}"`);
    return newSheetId;
  } catch (error) {
    console.error(`❌ Failed to create tab "${tabName}":`, error.message);
    throw error;
  }
}

/**
 * Write questions to a sheet tab
 */
async function writeQuestionsToTab(sheets, sheetId, tabName, questions) {
  try {
    // Prepare data rows
    const rows = [HEADERS]; // Start with headers

    for (const q of questions) {
      rows.push([
        '', // Blank first column
        q.subject,
        q.moduleId,
        q.dotPointId,
        q.question,
        q.options[0] || '',
        q.options[1] || '',
        q.options[2] || '',
        q.options[3] || '',
        q.correctAnswer,
        q.explanation,
        q.difficulty,
        q.time_limit,
        q.points,
        q.syllabus_outcome,
        q.keywords.join(', '),
        q.status
      ]);
    }

    // Write to sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      resource: {
        values: rows,
      },
    });

    console.log(`  ✅ Wrote ${questions.length} questions to "${tabName}"`);
  } catch (error) {
    console.error(`❌ Failed to write to tab "${tabName}":`, error.message);
    throw error;
  }
}

/**
 * Main upload function
 */
async function uploadQuestions(questionsData) {
  console.log('🔄 Starting upload to Google Sheets...\n');

  // Authenticate
  console.log('1️⃣  Authenticating...');
  const auth = await authenticate();
  const sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Authenticated\n');

  // Group questions by tab
  const questionsByTab = {};
  for (const q of questionsData) {
    const tabName = q.tabName || `${q.subject} M${q.moduleId} ${q.dotPointId}`;
    if (!questionsByTab[tabName]) {
      questionsByTab[tabName] = [];
    }
    questionsByTab[tabName].push(q);
  }

  // Process each tab
  console.log('2️⃣  Creating tabs and uploading questions...\n');
  for (const [tabName, questions] of Object.entries(questionsByTab)) {
    console.log(`📝 Processing "${tabName}"...`);
    await createSheetTab(sheets, SHEET_ID, tabName);
    await writeQuestionsToTab(sheets, SHEET_ID, tabName, questions);
    console.log('');
  }

  console.log('🎉 Upload completed successfully!');
  console.log(`📊 Summary: ${questionsData.length} questions across ${Object.keys(questionsByTab).length} tabs`);
}

module.exports = { uploadQuestions };

// CLI usage
if (require.main === module) {
  const questionsFile = process.argv[2];

  if (!questionsFile) {
    console.error('Usage: node uploadQuestionsToSheets.cjs <questions.json>');
    process.exit(1);
  }

  fs.readFile(questionsFile, 'utf8')
    .then(content => JSON.parse(content))
    .then(uploadQuestions)
    .catch(error => {
      console.error('❌ Upload failed:', error);
      process.exit(1);
    });
}
