/**
 * Google Sheets Authentication Setup Script
 *
 * Verifies that Google Sheets API credentials are configured correctly.
 * Run this before attempting to sync questions.
 *
 * Usage:
 *   GOOGLE_SHEET_ID=your_sheet_id node scripts/setup-sheets-auth.js
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(__dirname, '../credentials.json');
const SHEET_NAME = 'Sheet1';

// Expected columns in sheet
const EXPECTED_COLUMNS = [
  'id', 'id', 'subject', 'moduleId', 'dotPointId', 'text',
  'option_a', 'option_b', 'option_c', 'option_d',
  'answer', 'explanation', 'difficulty', 'time_limit', 'points',
  'syllabus_outcome', 'keywords', 'status'
];

/**
 * Check if credentials file exists
 */
async function checkCredentialsFile() {
  try {
    await fs.access(CREDENTIALS_PATH);
    console.log('✅ credentials.json found at:', CREDENTIALS_PATH);
    return true;
  } catch (error) {
    console.error('❌ credentials.json not found at:', CREDENTIALS_PATH);
    console.log('\n📝 Setup Instructions:');
    console.log('1. Go to Google Cloud Console: https://console.cloud.google.com');
    console.log('2. Select your project (hsc-learn-470407)');
    console.log('3. Go to IAM & Admin > Service Accounts');
    console.log('4. Find: hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com');
    console.log('5. Click Actions (⋮) > Manage Keys');
    console.log('6. Click "Add Key" > "Create new key" > "JSON"');
    console.log('7. Download the JSON file');
    console.log('8. Save it as: mobile-ui-agent/credentials.json');
    return false;
  }
}

/**
 * Verify credentials file is valid JSON
 */
async function verifyCredentialsFormat() {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(content);

    if (!credentials.client_email) {
      console.error('❌ credentials.json missing client_email field');
      return false;
    }

    console.log('✅ Service account email:', credentials.client_email);

    if (credentials.client_email !== 'hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com') {
      console.warn('⚠️  Warning: Service account email doesn\'t match expected value');
      console.warn('   Expected: hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com');
      console.warn('   Found:', credentials.client_email);
    }

    return true;
  } catch (error) {
    console.error('❌ credentials.json is not valid JSON:', error.message);
    return false;
  }
}

/**
 * Test authentication with Google Sheets API
 */
async function testAuthentication() {
  try {
    const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(credentialsContent);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    await auth.getClient();
    console.log('✅ Authenticated successfully with Google Sheets API');
    return true;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('- Verify credentials.json is from Google Cloud Console');
    console.log('- Check that Google Sheets API is enabled in your project');
    console.log('- Ensure service account has necessary permissions');
    return false;
  }
}

/**
 * Test access to the specified sheet
 */
async function testSheetAccess() {
  try {
    const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(credentialsContent);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Get sheet metadata
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    console.log('✅ Can access sheet:', metadata.data.properties.title);

    // Get sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:R1000`,
    });

    const rows = response.data.values || [];
    console.log(`✅ Found ${rows.length} rows (including header)`);

    if (rows.length > 0) {
      // Check header row
      const headers = rows[0];
      console.log(`✅ Found ${headers.length} columns in header row`);

      // Compare with expected columns
      let mismatchCount = 0;
      for (let i = 0; i < Math.min(headers.length, EXPECTED_COLUMNS.length); i++) {
        const expected = EXPECTED_COLUMNS[i];
        const actual = (headers[i] || '').toLowerCase();

        if (actual !== expected.toLowerCase()) {
          if (mismatchCount === 0) {
            console.log('\n⚠️  Column header mismatches:');
          }
          console.log(`   Column ${String.fromCharCode(65 + i)}: Expected "${expected}", found "${headers[i]}"`);
          mismatchCount++;
        }
      }

      if (mismatchCount === 0) {
        console.log('✅ Column headers match expected format');
      } else {
        console.log(`\n⚠️  ${mismatchCount} column header mismatches found`);
        console.log('   This may cause sync issues. Expected columns:');
        console.log('   ' + EXPECTED_COLUMNS.join(' | '));
      }

      // Show data rows info
      const dataRows = rows.length - 1;
      if (dataRows > 0) {
        console.log(`\n📊 Sheet info:`);
        console.log(`   - Total rows: ${rows.length} (${dataRows} data rows + 1 header)`);
        console.log(`   - Sheet name: ${metadata.data.properties.title}`);
        console.log(`   - Last modified: ${metadata.data.properties.title ? 'Recently' : 'Unknown'}`);

        // Count approved questions
        const approvedCount = rows.slice(1).filter(row => {
          const status = (row[17] || '').toLowerCase();
          return status === 'approved';
        }).length;

        console.log(`   - Approved questions: ${approvedCount}/${dataRows}`);

        if (approvedCount === 0) {
          console.warn('\n⚠️  Warning: No approved questions found!');
          console.warn('   Make sure status column (R) is set to "approved" for questions you want to sync.');
        }
      }
    }

    return true;
  } catch (error) {
    if (error.code === 403) {
      console.error('❌ Access denied to sheet');
      console.log('\n📝 Fix:');
      console.log('1. Open your Google Sheet');
      console.log('2. Click "Share" button');
      console.log('3. Add: hsc-app-sheet-reader@hsc-learn-470407.iam.gserviceaccount.com');
      console.log('4. Set permission to: Viewer');
      console.log('5. Click "Send" or "Done"');
      console.log('6. Try running this script again');
    } else if (error.code === 404) {
      console.error('❌ Sheet not found');
      console.log('\n💡 Check:');
      console.log('- GOOGLE_SHEET_ID is correct:', SHEET_ID);
      console.log('- Sheet URL: https://docs.google.com/spreadsheets/d/' + SHEET_ID);
    } else {
      console.error('❌ Failed to access sheet:', error.message);
    }
    return false;
  }
}

/**
 * Main setup function
 */
async function setup() {
  console.log('🔐 Google Sheets Authentication Setup\n');
  console.log('='.repeat(60));

  // Check SHEET_ID
  if (!SHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID environment variable not set\n');
    console.log('Usage:');
    console.log('  GOOGLE_SHEET_ID=1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A \\');
    console.log('    node scripts/setup-sheets-auth.js');
    console.log('\nYour sheet ID is: 1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A');
    process.exit(1);
  }

  console.log('Sheet ID:', SHEET_ID);
  console.log('Credentials path:', CREDENTIALS_PATH);
  console.log('');

  // Step 1: Check credentials file
  console.log('1️⃣  Checking credentials file...');
  const hasCredentials = await checkCredentialsFile();
  if (!hasCredentials) {
    process.exit(1);
  }
  console.log('');

  // Step 2: Verify credentials format
  console.log('2️⃣  Verifying credentials format...');
  const validFormat = await verifyCredentialsFormat();
  if (!validFormat) {
    process.exit(1);
  }
  console.log('');

  // Step 3: Test authentication
  console.log('3️⃣  Testing Google Sheets API authentication...');
  const canAuth = await testAuthentication();
  if (!canAuth) {
    process.exit(1);
  }
  console.log('');

  // Step 4: Test sheet access
  console.log('4️⃣  Testing access to your sheet...');
  const canAccess = await testSheetAccess();
  if (!canAccess) {
    process.exit(1);
  }

  // Success!
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Setup complete! Everything is configured correctly.\n');
  console.log('Next steps:');
  console.log('  1. Add questions to your Google Sheet');
  console.log('  2. Run: npm run sync:questions:dry-run  (preview changes)');
  console.log('  3. Run: npm run sync:questions          (sync for real)');
  console.log('');
}

// Run if called directly
if (require.main === module) {
  setup().catch(error => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { setup };
