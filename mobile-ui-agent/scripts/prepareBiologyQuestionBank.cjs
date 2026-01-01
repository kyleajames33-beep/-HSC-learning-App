/**
 * Combine all locally available Biology Module 5 questions and
 * prepare a 20-question set for each dotpoint ready to upload to Google Sheets.
 *
 * Usage:
 *   node prepareBiologyQuestionBank.cjs [output.json]
 */

const fs = require('fs');
const path = require('path');

const DOTPOINT_TABS = {
  'IQ1.1': 'Bio M5 IQ1.1',
  'IQ1.2': 'Bio M5 IQ1.2',
  'IQ1.3': 'Bio M5 IQ1.3',
  'IQ2.1': 'Bio M5 IQ2.1',
  'IQ2.2': 'Bio M5 IQ2.2',
  'IQ3.1': 'Bio M5 IQ3.1',
  'IQ3.2': 'Bio M5 IQ3.2',
  'IQ3.3': 'Bio M5 IQ3.3',
  'IQ4.1': 'Bio M5 IQ4.1',
  'IQ4.2': 'Bio M5 IQ4.2',
  'IQ4.3': 'Bio M5 IQ4.3',
  'IQ5.1': 'Bio M5 IQ5.1',
  'IQ5.2': 'Bio M5 IQ5.2',
};

const PROJECT_ROOT = path.resolve(__dirname, '..');

const SOURCE_FILES = [
  // Freshly generated additions
  path.join(__dirname, 'additional-biology-questions.json'),
  // Previous batches committed earlier in the project
  path.join(__dirname, 'biology-expansion-batch1.json'),
  path.join(__dirname, 'biology-final-batch.json'),
  path.join(__dirname, 'final-comprehensive-batch.json'),
  path.join(__dirname, 'more-questions.json'),
  path.join(__dirname, 'generated-questions.json'),
];

const QUICK_QUIZ_DIR = path.join(
  PROJECT_ROOT,
  'biology-agent',
  'questions',
  'module5',
);

function readJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.warn(`⚠️  Failed to read ${filePath}: ${error.message}`);
    return [];
  }
}

function normaliseQuestion(question) {
  if (!question) return null;

  const keywords =
    Array.isArray(question.keywords) && question.keywords.length > 0
      ? question.keywords
      : typeof question.keywords === 'string'
      ? question.keywords
          .split(',')
          .map((word) => word.trim())
          .filter(Boolean)
      : [];

  return {
    subject: 'biology',
    moduleId: '5',
    dotPointId: question.dotPointId || question._dotPointId || '',
    tabName: DOTPOINT_TABS[question.dotPointId || question._dotPointId || ''] || '',
    question: question.question || question.text || '',
    options: Array.isArray(question.options)
      ? question.options
      : [
          question.option_a,
          question.option_b,
          question.option_c,
          question.option_d,
        ].filter((opt) => typeof opt === 'string'),
    correctAnswer: question.correctAnswer || question.answer || '',
    explanation: question.explanation || '',
    difficulty: (question.difficulty || 'medium').toLowerCase(),
    time_limit:
      typeof question.time_limit === 'number' ? question.time_limit : 75,
    points: typeof question.points === 'number' ? question.points : 1,
    syllabus_outcome:
      question.syllabus_outcome || question.syllabusOutcome || 'BIO5-5',
    keywords,
    status: question.status || 'approved',
  };
}

function loadQuickQuizFiles() {
  const entries = [];
  if (!fs.existsSync(QUICK_QUIZ_DIR)) {
    return entries;
  }

  const dotpointDirs = fs.readdirSync(QUICK_QUIZ_DIR);
  for (const dir of dotpointDirs) {
    const filePath = path.join(QUICK_QUIZ_DIR, dir, 'quickQuiz.json');
    if (!fs.existsSync(filePath)) continue;

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(content.questions)) {
        for (const question of content.questions) {
          entries.push(
            normaliseQuestion({
              ...question,
              dotPointId: question._dotPointId || dir,
              options: question.options || [
                question.option_a,
                question.option_b,
                question.option_c,
                question.option_d,
              ],
            }),
          );
        }
      }
    } catch (error) {
      console.warn(`⚠️  Failed to parse ${filePath}: ${error.message}`);
    }
  }
  return entries;
}

function collectAllQuestions() {
  const candidates = [];

  // Load question arrays from JSON source files
  for (const file of SOURCE_FILES) {
    const data = readJson(file);
    if (Array.isArray(data)) {
      for (const question of data) {
        candidates.push(normaliseQuestion(question));
      }
    }
  }

  // Load currently synced quick quiz files
  candidates.push(...loadQuickQuizFiles());

  return candidates.filter(
    (question) =>
      question &&
      question.dotPointId &&
      DOTPOINT_TABS.hasOwnProperty(question.dotPointId) &&
      question.question &&
      question.options.length === 4 &&
      question.correctAnswer,
  );
}

function buildQuestionBank() {
  const allQuestions = collectAllQuestions();
  const byDotpoint = new Map();

  for (const dp of Object.keys(DOTPOINT_TABS)) {
    byDotpoint.set(dp, new Map()); // Map question text -> question object
  }

  for (const question of allQuestions) {
    if (!byDotpoint.has(question.dotPointId)) continue;

    const store = byDotpoint.get(question.dotPointId);
    if (!store.has(question.question)) {
      store.set(question.question, question);
    }
  }

  const finalQuestions = [];
  for (const [dotPointId, questionMap] of byDotpoint.entries()) {
    const pool = Array.from(questionMap.values());

    if (pool.length < 20) {
      console.warn(
        `⚠️  Only ${pool.length} questions found for ${dotPointId}. Additional questions required.`,
      );
    }

    pool
      .slice(0, 20)
      .forEach((question) => finalQuestions.push(question));
  }

  return finalQuestions;
}

function main() {
  const outputPath =
    process.argv[2] ||
    path.join(__dirname, 'biology-questions-20-per-dotpoint.json');

  const result = buildQuestionBank();
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(
    `✅ Prepared ${result.length} questions across ${Object.keys(DOTPOINT_TABS).length} dotpoints.`,
  );
  console.log(`📄 Saved to ${outputPath}`);
}

if (require.main === module) {
  main();
}
