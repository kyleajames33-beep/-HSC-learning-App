/**
 * Google Sheets Sync Script for Biology Learn Sections
 *
 * This script syncs learn page content from Google Sheets to JSON files.
 * Content team can edit in Sheets, then run this script to update the app.
 *
 * Sheet Structure: "Module5_LearnSections"
 * Columns: dotpoint_id | section_id | section_type | title | order | xp | content | metadata
 *
 * Usage:
 *   node scripts/syncLearnSectionsFromSheets.js
 *
 * Prerequisites:
 *   1. Install googleapis: npm install googleapis
 *   2. Set up Google Cloud Project with Sheets API enabled
 *   3. Create service account and download credentials.json
 *   4. Share your Google Sheet with the service account email
 *   5. Set environment variable: GOOGLE_SHEET_ID=your_sheet_id
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID || 'YOUR_SHEET_ID_HERE';
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || './credentials.json';
const OUTPUT_PATH = path.join(__dirname, '../src/data/biologyModule5LearnSections.json');
const SHEET_NAME = 'Module5_LearnSections';

// Column indices (0-based)
const COLS = {
  DOTPOINT_ID: 0,
  SECTION_ID: 1,
  SECTION_TYPE: 2,
  TITLE: 3,
  ORDER: 4,
  XP: 5,
  CONTENT: 6,
  METADATA: 7
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
    console.log('1. Create a Google Cloud Project');
    console.log('2. Enable Google Sheets API');
    console.log('3. Create a service account');
    console.log('4. Download credentials.json');
    console.log('5. Set GOOGLE_SHEET_ID environment variable');
    throw error;
  }
}

/**
 * Fetch data from Google Sheets
 */
async function fetchSheetData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2:H`, // Skip header row
    });

    return response.data.values || [];
  } catch (error) {
    console.error('❌ Failed to fetch sheet data:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('- Check if GOOGLE_SHEET_ID is correct');
    console.log('- Verify sheet name is "Module5_LearnSections"');
    console.log('- Ensure service account has access to the sheet');
    throw error;
  }
}

/**
 * Parse a row from the sheet into a section object
 */
function parseRow(row) {
  try {
    const section = {
      sectionId: row[COLS.SECTION_ID] || '',
      type: row[COLS.SECTION_TYPE] || '',
      title: row[COLS.TITLE] || '',
      order: parseInt(row[COLS.ORDER]) || 0,
      xp: parseInt(row[COLS.XP]) || 0,
      content: {},
      metadata: {}
    };

    // Parse JSON content
    if (row[COLS.CONTENT]) {
      try {
        section.content = JSON.parse(row[COLS.CONTENT]);
      } catch (e) {
        console.warn(`⚠️  Invalid JSON in content for ${section.sectionId}:`, row[COLS.CONTENT]);
        section.content = { raw: row[COLS.CONTENT] };
      }
    }

    // Parse JSON metadata
    if (row[COLS.METADATA]) {
      try {
        section.metadata = JSON.parse(row[COLS.METADATA]);
      } catch (e) {
        console.warn(`⚠️  Invalid JSON in metadata for ${section.sectionId}`);
        section.metadata = {};
      }
    }

    return {
      dotPointId: row[COLS.DOTPOINT_ID],
      section
    };
  } catch (error) {
    console.error('❌ Error parsing row:', error.message, row);
    return null;
  }
}

/**
 * Group sections by dotpoint and sort by order
 */
function groupAndSort(rows) {
  const grouped = {};

  rows.forEach(row => {
    const parsed = parseRow(row);
    if (!parsed) return;

    const { dotPointId, section } = parsed;

    if (!grouped[dotPointId]) {
      grouped[dotPointId] = [];
    }

    grouped[dotPointId].push(section);
  });

  // Sort sections within each dotpoint by order
  Object.keys(grouped).forEach(dotPointId => {
    grouped[dotPointId].sort((a, b) => a.order - b.order);
  });

  return grouped;
}

/**
 * Validate the data structure
 */
function validateData(data) {
  const errors = [];
  const warnings = [];

  Object.entries(data).forEach(([dotPointId, sections]) => {
    if (!sections || sections.length === 0) {
      warnings.push(`⚠️  ${dotPointId} has no sections`);
      return;
    }

    sections.forEach((section, index) => {
      // Check required fields
      if (!section.sectionId) {
        errors.push(`❌ ${dotPointId} section ${index + 1} missing sectionId`);
      }
      if (!section.type) {
        errors.push(`❌ ${dotPointId}/${section.sectionId} missing type`);
      }
      if (!section.title) {
        errors.push(`❌ ${dotPointId}/${section.sectionId} missing title`);
      }

      // Check order sequence
      if (section.order !== index + 1) {
        warnings.push(`⚠️  ${dotPointId}/${section.sectionId} order mismatch: expected ${index + 1}, got ${section.order}`);
      }

      // Check XP values
      if (section.xp < 0 || section.xp > 100) {
        warnings.push(`⚠️  ${dotPointId}/${section.sectionId} unusual XP value: ${section.xp}`);
      }

      // Type-specific validation
      switch (section.type) {
        case 'video':
          if (!section.content.url) {
            warnings.push(`⚠️  ${dotPointId}/${section.sectionId} video missing url`);
          }
          break;
        case 'interactive-cards':
          if (!section.content.cards || section.content.cards.length === 0) {
            warnings.push(`⚠️  ${dotPointId}/${section.sectionId} cards section has no cards`);
          }
          break;
        case 'flashcards':
          if (!section.content.terms || section.content.terms.length === 0) {
            warnings.push(`⚠️  ${dotPointId}/${section.sectionId} flashcards section has no terms`);
          }
          break;
        case 'practice':
          if (!section.content.questions || section.content.questions.length === 0) {
            warnings.push(`⚠️  ${dotPointId}/${section.sectionId} practice section has no questions`);
          }
          break;
      }
    });
  });

  return { errors, warnings };
}

/**
 * Write data to JSON file
 */
async function writeData(data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(OUTPUT_PATH, jsonString, 'utf8');
    console.log(`✅ Data written to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Failed to write file:', error.message);
    throw error;
  }
}

/**
 * Main sync function
 */
async function syncLearnSections() {
  console.log('🔄 Starting Google Sheets sync for Biology Learn Sections...\n');

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

    // Step 3: Process data
    console.log('3️⃣  Processing and grouping sections...');
    const grouped = groupAndSort(rows);
    const dotPointCount = Object.keys(grouped).length;
    const totalSections = Object.values(grouped).reduce((sum, sections) => sum + sections.length, 0);
    console.log(`✅ Processed ${dotPointCount} dotpoints with ${totalSections} total sections\n`);

    // Step 4: Validate
    console.log('4️⃣  Validating data structure...');
    const { errors, warnings } = validateData(grouped);

    if (errors.length > 0) {
      console.error('\n❌ Validation errors found:');
      errors.forEach(err => console.error(err));
      console.log('\n🛑 Sync aborted due to errors. Please fix the sheet and try again.\n');
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.warn('\n⚠️  Validation warnings:');
      warnings.forEach(warn => console.warn(warn));
      console.log('');
    } else {
      console.log('✅ Validation passed\n');
    }

    // Step 5: Write to file
    console.log('5️⃣  Writing to JSON file...');
    await writeData(grouped);

    // Step 6: Summary
    console.log('\n📊 Sync Summary:');
    console.log('================');
    Object.entries(grouped).forEach(([dotPointId, sections]) => {
      const totalXP = sections.reduce((sum, s) => sum + s.xp, 0);
      console.log(`  ${dotPointId}: ${sections.length} sections (${totalXP} XP total)`);
    });
    console.log('================');
    console.log('\n🎉 Sync completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncLearnSections();
}

module.exports = { syncLearnSections };
