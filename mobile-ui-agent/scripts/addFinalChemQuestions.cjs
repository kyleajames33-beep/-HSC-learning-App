const { google } = require('googleapis');
const fs = require('fs');

async function addFinalChemQuestions() {
  const creds = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SHEET_ID = '1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A';

  const files = [
    { file: '../Chem_M5_5.1.2_questions_added.csv', tab: 'Chem M5 5.1.2' },
    { file: '../Chem_M5_5.1.3_questions_added.csv', tab: 'Chem M5 5.1.3' },
    { file: '../Chem_M5_5.2.1_questions_added.csv', tab: 'Chem M5 5.2.1' },
    { file: '../Chem_M5_5.2.2_questions_added.csv', tab: 'Chem M5 5.2.2' },
    { file: '../Chem_M5_5.3.1_questions_added.csv', tab: 'Chem M5 5.3.1' }
  ];

  for (const {file, tab} of files) {
    try {
      // Get existing data first
      const existing = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${tab}!A1:R1000`
      });

      const existingRows = existing.data.values || [];
      const existingCount = existingRows.length - 1; // Subtract header

      // Read new questions
      const csv = fs.readFileSync(file, 'utf8');
      const newRows = csv.split('\n').filter(r => r.trim()).map(row => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          if (row[i] === '"') {
            inQuotes = !inQuotes;
          } else if (row[i] === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += row[i];
          }
        }
        result.push(current);
        return result;
      });

      // Skip header from new rows
      const questionsToAdd = newRows.slice(1);

      // Append to existing
      if (questionsToAdd.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: `${tab}!A${existingRows.length + 1}`,
          valueInputOption: 'RAW',
          resource: { values: questionsToAdd }
        });

        console.log(`✅ Added ${questionsToAdd.length} questions to ${tab} (was ${existingCount}, now ${existingCount + questionsToAdd.length})`);
      }
    } catch (err) {
      console.error(`❌ Error with ${file}:`, err.message);
    }
  }

  console.log('\n🎉 All Chemistry M5 top-up questions added!');
}

addFinalChemQuestions().catch(console.error);
