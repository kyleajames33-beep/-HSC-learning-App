const { google } = require('googleapis');
const fs = require('fs');

async function addAllChemQuestions() {
  const creds = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SHEET_ID = '1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A';

  const files = [
    { file: '../Chem_M5_5.1.1_questions_added.csv', tab: 'Chem M5 5.1.1' },
    { file: '../Chem_M5_5.2.3_questions.csv', tab: 'Chem M5 5.2.3' },
    { file: '../Chem_M5_5.3.2_questions.csv', tab: 'Chem M5 5.3.2' },
    { file: '../Chem_M5_5.3.3_questions.csv', tab: 'Chem M5 5.3.3' },
    { file: '../Chem_M5_5.4.1_questions.csv', tab: 'Chem M5 5.4.1' },
    { file: '../Chem_M5_5.4.2_questions.csv', tab: 'Chem M5 5.4.2' },
    { file: '../Chem_M5_5.4.3_questions.csv', tab: 'Chem M5 5.4.3' }
  ];

  for (const {file, tab} of files) {
    try {
      const csv = fs.readFileSync(file, 'utf8');
      const rows = csv.split('\n').filter(r => r.trim()).map(row => {
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

      // Check if tab exists
      const response = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
      const existingTab = response.data.sheets.find(s => s.properties.title === tab);

      if (!existingTab) {
        // Create new tab
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          resource: {
            requests: [{
              addSheet: {
                properties: { title: tab }
              }
            }]
          }
        });
        console.log('✅ Created new tab:', tab);
      } else {
        console.log('📋 Tab already exists:', tab);
      }

      // Add/update data
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${tab}!A1`,
        valueInputOption: 'RAW',
        resource: { values: rows }
      });

      console.log(`✅ Added ${rows.length - 1} questions to ${tab}`);
    } catch (err) {
      console.error(`❌ Error with ${file}:`, err.message);
    }
  }

  console.log('\n🎉 All Chemistry M5 questions added!');
}

addAllChemQuestions().catch(console.error);
