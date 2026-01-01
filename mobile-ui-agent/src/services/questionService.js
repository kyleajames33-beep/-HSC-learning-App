/**
 * Question Service
 * Handles fetching quiz questions from local fallback data or remote agents.
 */

class QuestionService {
  constructor() {
    this.baseUrls = {
      chemistry:
        import.meta.env.VITE_CHEMISTRY_AGENT_URL?.trim() ||
        'http://localhost:3011',
      biology:
        import.meta.env.VITE_BIOLOGY_AGENT_URL?.trim() ||
        'http://localhost:3014',
    }
    this.GOOGLE_SHEETS_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';
    this.SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    this.API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  }

  /**
   * Fetch questions for a given dotpoint.
   * Falls back to local JSON if the agent is unavailable.
   */
  async fetchQuestions(subject, moduleId, dotPointId, quizType = 'quick') {
    try {
      const agent = subject.toLowerCase()
      const baseUrl = this.baseUrls[agent]

      if (!baseUrl) {
        console.warn(`No agent configured for subject: ${subject}`)
        return this.getFallbackQuestions(subject, moduleId, dotPointId, quizType)
      }

      // Format moduleId: "module-5" -> "5"
      const formattedModuleId = moduleId.replace('module-', '')

      const endpoint = `${baseUrl}/api/${agent}/questions/${formattedModuleId}/${dotPointId}?type=${quizType}`
      console.log(`Fetching questions from ${endpoint}`)

      const response = await fetch(endpoint)
      if (!response.ok) {
        console.warn(`Agent request failed (${response.status}). Using fallback questions.`)
        return this.getFallbackQuestions(subject, moduleId, dotPointId, quizType)
      }

      const data = await response.json()
      return this.formatQuestions(data, quizType)
    } catch (error) {
      console.warn(`Error fetching questions for ${subject} ${moduleId} ${dotPointId}`, error)
      return this.getFallbackQuestions(subject, moduleId, dotPointId, quizType)
    }
  }

  formatQuestions(data, quizType) {
    if (!data || !Array.isArray(data.questions)) {
      console.warn('Received invalid question payload from agent')
      return []
    }

    return data.questions.map((question) => ({
      id: question.id,
      question: question.question,
      type: this.mapQuestionType(question.type || 'multiple-choice'),
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      difficulty: question.difficulty || 'medium',
      marks: question.marks || (quizType === 'long' ? 6 : 1),
      topic: question.topic || '',
      keywords: question.keywords || [],
    }))
  }

  mapQuestionType(agentType) {
    const typeMap = {
      mcq: 'multiple-choice',
      multiple_choice: 'multiple-choice',
      true_false: 'true-false',
      short_answer: 'fill-blanks',
      long_response: 'long-response',
      calculation: 'multiple-choice',
    }

    return typeMap[agentType] || 'multiple-choice'
  }

  getFallbackQuestions(subject, moduleId, dotPointId, quizType) {
    console.log(`QuestionService fallback called for ${subject} ${moduleId} ${dotPointId} - returning empty array to let QuickQuiz handle fallback`)
    // Return empty array - let QuickQuiz component handle the fallback with its own JSON files
    return []
  }

  /**
   * Fetch Mini Boss battle questions from Google Sheets
   * @param {string} subject - 'biology' or 'chemistry'
   * @param {string} moduleId - 'module-5', 'module-6', etc.
   * @param {string} iqId - 'IQ1', 'IQ2', 'IQ3', etc.
   * @returns {Promise<Array>} Array of 10 hard questions
   */
  async getMiniBossQuestions(subject, moduleId, iqId) {
    try {
      if (subject === 'biology') {
        // Use biology agent API
        const moduleNum = moduleId.replace('module-', '');
        const miniBossId = `bio-m${moduleNum}-${iqId.toLowerCase()}`;
        
        const response = await fetch(`http://localhost:3014/api/biology/miniboss/${miniBossId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Mini Boss questions: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.questions || [];
      } else {
        // Fallback for chemistry - use Google Sheets
        const subjectShort = 'Chem';
        const moduleNum = moduleId.replace('module-', '');
        const tabName = `Mini Boss - ${subjectShort} M${moduleNum} ${iqId}`;

        const response = await fetch(
          `${this.GOOGLE_SHEETS_BASE_URL}${this.SHEET_ID}/values/'${encodeURIComponent(tabName)}'?key=${this.API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Mini Boss questions: ${response.statusText}`);
        }

        const data = await response.json();
        const rows = data.values || [];

        // Skip header row
        const questionRows = rows.slice(1);

        // Parse into question objects
        const questions = questionRows.map((row, index) => ({
          id: `miniboss-${subject}-${moduleNum}-${iqId.toLowerCase()}-q${index + 1}`,
          subject: row[0],
          module: row[1],
          dotpoint: row[2],
          question: row[3],
          options: [row[4], row[5], row[6], row[7]],
          correctAnswer: row[8],
          explanation: row[9],
          difficulty: row[10],
          questionType: row[11]
        }));

        return questions;
      }
    } catch (error) {
      console.error('Error fetching Mini Boss questions:', error);
      throw error;
    }
  }

  /**
   * Fetch Boss Battle questions from Google Sheets
   * @param {string} subject - 'biology' or 'chemistry'
   * @param {string} moduleId - 'module-5', 'module-6', etc.
   * @returns {Promise<Array>} Array of 20 very-hard questions
   */
  async getBossBattleQuestions(subject, moduleId) {
    try {
      if (subject === 'biology') {
        // Use biology agent API
        const moduleNum = moduleId.replace('module-', '');
        
        const response = await fetch(`http://localhost:3014/api/biology/boss/${moduleNum}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Boss Battle questions: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.questions || [];
      } else {
        // Fallback for chemistry - use Google Sheets
        const subjectShort = 'Chem';
        const moduleNum = moduleId.replace('module-', '');
        const tabName = `Boss Battle - ${subjectShort} M${moduleNum}`;

        const response = await fetch(
          `${this.GOOGLE_SHEETS_BASE_URL}${this.SHEET_ID}/values/'${encodeURIComponent(tabName)}'?key=${this.API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Boss Battle questions: ${response.statusText}`);
        }

        const data = await response.json();
        const rows = data.values || [];

        // Skip header row
        const questionRows = rows.slice(1);

        // Parse into question objects
        const questions = questionRows.map((row, index) => ({
          id: `boss-${subject}-${moduleNum}-q${index + 1}`,
          subject: row[0],
          module: row[1],
          dotpoint: row[2],
          question: row[3],
          options: [row[4], row[5], row[6], row[7]],
          correctAnswer: row[8],
          explanation: row[9],
          difficulty: row[10],
          questionType: row[11]
        }));

        return questions;
      }
    } catch (error) {
      console.error('Error fetching Boss Battle questions:', error);
      throw error;
    }
  }

  async checkAgentHealth() {
    const health = {}

    for (const [agent, baseUrl] of Object.entries(this.baseUrls)) {
      try {
        const response = await fetch(`${baseUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        })
        health[agent] = response.ok
      } catch {
        health[agent] = false
      }
    }

    return health
  }

  async getQuestionStats(subject, moduleId) {
    try {
      const agent = subject.toLowerCase()
      const baseUrl = this.baseUrls[agent]
      if (!baseUrl) return null

      const response = await fetch(`${baseUrl}/api/questions/${moduleId}/stats`)
      if (!response.ok) return null

      return response.json()
    } catch (error) {
      console.warn('Error fetching question statistics', error)
      return null
    }
  }

  async submitQuizResults(subject, moduleId, dotPointId, results) {
    try {
      const agent = subject.toLowerCase()
      const baseUrl = this.baseUrls[agent]
      if (!baseUrl) return false

      const response = await fetch(`${baseUrl}/api/quiz-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          dotPointId,
          results,
          timestamp: new Date().toISOString(),
        }),
      })

      return response.ok
    } catch (error) {
      console.warn('Error submitting quiz results', error)
      return false
    }
  }
}

const questionService = new QuestionService()

export default questionService
