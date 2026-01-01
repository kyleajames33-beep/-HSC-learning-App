const { google } = require('googleapis');
const fs = require('fs');

async function addBioM6Questions() {
  const creds = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const SHEET_ID = '1ceTKCDXxpMq50uCpgyWgpJ0Hmv4pLMzcj12fSYibR7A';

  const files = [
    { file: '../Bio_M6_6.1.1_questions.csv', tab: 'Bio M6 IQ1.1' },
    { file: '../Bio_M6_6.1.2_questions.csv', tab: 'Bio M6 IQ1.2' },
    { file: '../Bio_M6_6.1.3_questions.csv', tab: 'Bio M6 IQ1.3' },
    { file: '../Bio_M6_6.1.4_questions.csv', tab: 'Bio M6 IQ1.4' },
    { file: '../Bio_M6_6.1.5_questions.csv', tab: 'Bio M6 IQ1.5' },
    { file: '../Bio_M6_6.1.6_questions.csv', tab: 'Bio M6 IQ1.6' },
    { file: '../Bio_M6_6.2.1_questions.csv', tab: 'Bio M6 IQ2.1' },
    { file: '../Bio_M6_6.2.2_questions.csv', tab: 'Bio M6 IQ2.2' },
    { file: '../Bio_M6_6.2.3_questions.csv', tab: 'Bio M6 IQ2.3' },
    { file: '../Bio_M6_6.2.4_questions.csv', tab: 'Bio M6 IQ2.4' },
    { file: '../Bio_M6_6.2.5_questions.csv', tab: 'Bio M6 IQ2.5' }
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

  console.log('\n🎉 All Biology M6 questions added!');
}

addBioM6Questions().catch(console.error);
