const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * Script to add battle questions (Mini Boss and Boss Battle) to Google Sheets
 *
 * Usage: node addBattleQuestions.cjs <csv-file-path>
 * Example: node addBattleQuestions.cjs ../Bio_M5_IQ1_MiniBoss.csv
 */

async function addBattleQuestions() {
  // Get CSV file path from command line argument
  const csvFilePath = process.argv[2];

  if (!csvFilePath) {
    console.error('❌ Error: Please provide a CSV file path');
    console.log('Usage: node addBattleQuestions.cjs <csv-file-path>');
    console.log('Example: node addBattleQuestions.cjs ../Bio_M5_IQ1_MiniBoss.csv');
    process.exit(1);
  }

  const fullPath = path.resolve(csvFilePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: File not found: ${fullPath}`);
    process.exit(1);
  }

  console.log(`\n📂 Reading file: ${path.basename(fullPath)}`);

  // Read credentials
  const creds = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SHEET_ID = '1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A';

  // Read and parse CSV file
  const csv = fs.readFileSync(fullPath, 'utf8');
  const lines = csv.split('\n').filter(r => r.trim());

  console.log(`📊 Found ${lines.length - 1} questions (+ 1 header row)`);

  // Parse CSV with proper handling of quoted fields
  const rows = lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += line[i];
      }
    }
    result.push(current);
    return result;
  });

  // Extract metadata from first data row
  const firstDataRow = rows[1]; // Skip header
  const subject = firstDataRow[0]; // biology or chemistry
  const moduleNum = firstDataRow[1]; // 5, 6, etc
  const dotpoint = firstDataRow[2]; // IQ1, IQ2, or MODULE for boss battles
  const questionType = firstDataRow[11]; // mini-boss or boss-battle
  const difficulty = firstDataRow[10]; // hard or very-hard

  // Determine tab name based on question type
  let tabName;
  if (questionType === 'mini-boss') {
    // Mini Boss: "Mini Boss - Bio M5 IQ1"
    const subjectShort = subject === 'biology' ? 'Bio' : 'Chem';
    tabName = `Mini Boss - ${subjectShort} M${moduleNum} ${dotpoint}`;
  } else if (questionType === 'boss-battle') {
    // Boss Battle: "Boss Battle - Bio M5"
    const subjectShort = subject === 'biology' ? 'Bio' : 'Chem';
    tabName = `Boss Battle - ${subjectShort} M${moduleNum}`;
  } else {
    console.error(`❌ Error: Unknown question type: ${questionType}`);
    process.exit(1);
  }

  console.log(`\n📋 Tab name: ${tabName}`);
  console.log(`📊 Metadata:`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Module: ${moduleNum}`);
  console.log(`   Dotpoint/IQ: ${dotpoint}`);
  console.log(`   Type: ${questionType}`);
  console.log(`   Difficulty: ${difficulty}`);

  try {
    // Check if tab already exists
    const response = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const existingTab = response.data.sheets.find(s => s.properties.title === tabName);

    if (existingTab) {
      console.log(`⚠️  Tab "${tabName}" already exists. Overwriting...`);
      // Delete existing tab
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: {
          requests: [{
            deleteSheet: {
              sheetId: existingTab.properties.sheetId
            }
          }]
        }
      });
      console.log(`   Deleted old tab`);
    }

    // Create new tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: tabName,
              gridProperties: {
                frozenRowCount: 1 // Freeze header row
              }
            }
          }
        }]
      }
    });
    console.log(`✅ Created new tab: ${tabName}`);

    // Add data to tab
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      resource: { values: rows }
    });

    console.log(`✅ Added ${rows.length - 1} questions to ${tabName}`);

    // Validate questions
    console.log(`\n🔍 Validating questions...`);
    let validCount = 0;
    let issues = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const questionNum = i;

      // Check required fields
      if (!row[3] || row[3].trim() === '') {
        issues.push(`   Row ${questionNum}: Missing question text`);
      }
      if (!row[8] || row[8].trim() === '') {
        issues.push(`   Row ${questionNum}: Missing correct answer`);
      }
      if (!row[9] || row[9].trim().length < 20) {
        issues.push(`   Row ${questionNum}: Explanation too short (< 20 chars)`);
      }

      // Check correct answer matches one of the options
      const correctAnswer = row[8];
      const options = [row[4], row[5], row[6], row[7]];
      if (!options.includes(correctAnswer)) {
        issues.push(`   Row ${questionNum}: Correct answer not found in options`);
      }

      if (issues.length === 0 || issues.length < i) {
        validCount++;
      }
    }

    if (issues.length > 0) {
      console.log(`⚠️  Found ${issues.length} validation issues:`);
      issues.forEach(issue => console.log(issue));
    } else {
      console.log(`✅ All ${validCount} questions validated successfully!`);
    }

    console.log(`\n🎉 Upload complete!`);
    console.log(`\n📊 Summary:`);
    console.log(`   Tab: ${tabName}`);
    console.log(`   Questions: ${rows.length - 1}`);
    console.log(`   Type: ${questionType}`);
    console.log(`   Difficulty: ${difficulty}`);
    console.log(`\n✅ Ready to sync with: npm run sync:questions`);

  } catch (error) {
    console.error(`❌ Error uploading to Google Sheets:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

addBattleQuestions().catch(console.error);
