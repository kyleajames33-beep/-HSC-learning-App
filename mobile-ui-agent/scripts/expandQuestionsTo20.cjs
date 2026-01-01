/**
 * Expand all Biology Module 5 dotpoints to 20 questions each
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

// Questions to add for each dotpoint (questions 9-20)
const questionsTemplates = {
  'IQ1.2': [
    ['', 'biology', 'module5', 'IQ1.2', 'Internal fertilization occurs:', 'Outside the body', 'Inside the body', 'In water only', 'Only in plants', 'Inside the body', 'Internal fertilization happens inside the female reproductive system, common in mammals and reptiles.', 'easy', 60, 1, 'BIO5-1', 'internal fertilization', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'External fertilization typically occurs in:', 'Mammals', 'Birds', 'Aquatic animals', 'Insects', 'Aquatic animals', 'External fertilization is common in aquatic animals like fish and amphibians where eggs and sperm meet in water.', 'easy', 60, 1, 'BIO5-1', 'external fertilization, aquatic', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Which structure develops into the embryo?', 'Zygote', 'Gamete', 'Sperm', 'Polar body', 'Zygote', 'The zygote is the fertilized egg that undergoes mitosis to develop into an embryo.', 'easy', 60, 1, 'BIO5-1', 'zygote, embryo', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Hermaphrodites are organisms that:', 'Only reproduce sexually', 'Have both male and female reproductive organs', 'Only reproduce asexually', 'Cannot reproduce', 'Have both male and female reproductive organs', 'Hermaphrodites possess both male and female reproductive organs, like earthworms and some snails.', 'medium', 75, 1, 'BIO5-1', 'hermaphrodite, reproductive organs', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Viviparity refers to:', 'Egg-laying', 'Live birth', 'Asexual reproduction', 'External fertilization', 'Live birth', 'Viviparity is when offspring develop inside the mother and are born live, like in most mammals.', 'easy', 60, 1, 'BIO5-1', 'viviparity, live birth', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Oviparity refers to:', 'Live birth', 'Egg-laying', 'Asexual reproduction', 'Budding', 'Egg-laying', 'Oviparity is reproduction by laying eggs, common in birds, reptiles, and most fish.', 'easy', 60, 1, 'BIO5-1', 'oviparity, egg-laying', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'The placenta functions to:', 'Produce gametes', 'Exchange nutrients and waste between mother and fetus', 'Store eggs', 'Produce hormones only', 'Exchange nutrients and waste between mother and fetus', 'The placenta allows nutrient and gas exchange while removing waste products from the developing fetus.', 'medium', 75, 1, 'BIO5-1', 'placenta, nutrients, fetus', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Gestation period refers to:', 'Time for egg development', 'Time from fertilization to birth', 'Time between births', 'Lifespan of organism', 'Time from fertilization to birth', 'Gestation period is the duration of pregnancy from fertilization to birth in viviparous animals.', 'easy', 60, 1, 'BIO5-1', 'gestation, pregnancy', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Courtship behaviors in animals primarily function to:', 'Find food', 'Attract mates and ensure reproductive success', 'Defend territory', 'Migrate', 'Attract mates and ensure reproductive success', 'Courtship behaviors help animals select suitable mates and synchronize reproductive timing.', 'medium', 75, 1, 'BIO5-1', 'courtship, mating, behavior', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'Parental care is most common in species with:', 'Many offspring', 'Few offspring', 'External fertilization', 'Asexual reproduction', 'Few offspring', 'Species producing fewer offspring typically invest more in parental care to ensure offspring survival.', 'medium', 75, 1, 'BIO5-1', 'parental care, offspring', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'K-selected species typically:', 'Produce many offspring with little care', 'Produce few offspring with high parental investment', 'Reproduce asexually', 'Have short lifespans', 'Produce few offspring with high parental investment', 'K-selected species have fewer offspring but invest heavily in their survival (elephants, humans).', 'hard', 90, 1, 'BIO5-1', 'K-selected, parental investment', 'approved'],
    ['', 'biology', 'module5', 'IQ1.2', 'R-selected species typically:', 'Produce few offspring with high care', 'Produce many offspring with little care', 'Only reproduce once', 'Have long lifespans', 'Produce many offspring with little care', 'R-selected species produce numerous offspring with minimal parental care (insects, fish).', 'hard', 90, 1, 'BIO5-1', 'R-selected, many offspring', 'approved']
  ]
};

async function authenticate() {
  const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(credentialsContent);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return await auth.getClient();
}

async function addQuestionsToSheet(auth, tabName, questions) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Get current row count
    const currentData = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A:A`
    });

    const currentRows = currentData.data.values ? currentData.data.values.length : 1;
    const startRow = currentRows + 1;

    // Append new questions
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A${startRow}`,
      valueInputOption: 'RAW',
      resource: { values: questions }
    });

    console.log(`✅ Added ${questions.length} questions to ${tabName} (now has ${currentRows - 1 + questions.length} total)`);
    return true;
  } catch (error) {
    console.error(`❌ Error adding questions to ${tabName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔄 Expanding Biology Module 5 questions to 20 per dotpoint...\n');

  const auth = await authenticate();
  console.log('✅ Authenticated with Google Sheets\n');

  // Add questions to IQ1.2
  await addQuestionsToSheet(auth, 'Bio M5 IQ1.2', questionsTemplates['IQ1.2']);

  console.log('\n🎉 Questions expansion complete!');
  console.log('\nNext step: Run npm run sync:questions to sync to biology-agent');
}

main().catch(console.error);
