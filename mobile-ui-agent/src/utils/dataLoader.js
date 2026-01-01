/**
 * Data Loader Utility
 * Handles dynamic loading of learn sections and practice questions
 * for any subject/module/dotpoint combination
 */

/**
 * Load learn sections for a specific dotpoint
 * @param {string} subject - 'biology' or 'chemistry'
 * @param {number} moduleNumber - 5, 6, 7, or 8
 * @param {string} dotpointId - e.g., 'IQ1.1'
 * @returns {Promise<Array>} Array of learn sections
 */
export async function loadLearnSections(subject, moduleNumber, dotpointId) {
  try {
    // Load from new structure: biology/module5/learnSections.json or chemistry/module6/learnSections.json
    const newPath = `/src/data/${subject}/module${moduleNumber}/learnSections.json`
    const response = await import(newPath)
    const data = response.default || response
    return data[dotpointId] || []
  } catch (error) {
    console.error(`Failed to load learn sections for ${subject} M${moduleNumber} ${dotpointId}:`, error)
    return []
  }
}

/**
 * Load practice questions for a specific dotpoint
 * @param {string} subject - 'biology' or 'chemistry'
 * @param {number} moduleNumber - 5, 6, 7, or 8
 * @param {string} dotpointId - e.g., 'IQ1.1'
 * @returns {Promise<Array>} Array of practice questions
 */
export async function loadPracticeQuestions(subject, moduleNumber, dotpointId) {
  try {
    // Load from new structure: practice-questions/biology/m5/iq1-1.json
    const questionId = dotpointId.toLowerCase().replace('.', '-') // IQ1.1 -> iq1-1
    const newPath = `/src/data/practice-questions/${subject}/m${moduleNumber}/${questionId}.json`
    const response = await import(newPath)
    return response.default || response || []
  } catch (error) {
    console.error(`Failed to load practice questions for ${subject} M${moduleNumber} ${dotpointId}:`, error)
    return []
  }
}

/**
 * Check if content exists for a dotpoint
 * @param {string} subject
 * @param {number} moduleNumber
 * @param {string} dotpointId
 * @returns {Promise<boolean>}
 */
export async function hasContent(subject, moduleNumber, dotpointId) {
  const sections = await loadLearnSections(subject, moduleNumber, dotpointId)
  return sections && sections.length > 0
}

/**
 * Load module configuration
 * @returns {Promise<Object>} Module configuration object
 */
export async function loadModuleConfig() {
  try {
    const config = await import('../data/moduleConfig.json')
    return config.default || config
  } catch (error) {
    console.error('Failed to load module config:', error)
    return {}
  }
}

/**
 * Get all dotpoints for a module
 * @param {string} subject
 * @param {number} moduleNumber
 * @returns {Promise<Array>} Array of dotpoint objects
 */
export async function getModuleDotpoints(subject, moduleNumber) {
  const config = await loadModuleConfig()
  const moduleData = config[subject]?.modules[moduleNumber]

  if (!moduleData || !moduleData.inquiryQuestions) {
    return []
  }

  // Flatten inquiry questions into dotpoint list
  const dotpoints = []
  moduleData.inquiryQuestions.forEach((iq) => {
    if (iq.dotpoints) {
      dotpoints.push(...iq.dotpoints)
    }
  })

  return dotpoints
}

/**
 * Save progress for a dotpoint section
 * @param {string} subject
 * @param {number} moduleNumber
 * @param {string} dotpointId
 * @param {string} sectionId
 * @param {number} xp
 */
export function saveProgress(subject, moduleNumber, dotpointId, sectionId, xp) {
  const key = `progress_${subject}_m${moduleNumber}_${dotpointId}_${sectionId}`
  const data = {
    completed: true,
    xp: xp,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(key, JSON.stringify(data))

  // Also update module-level progress
  updateModuleProgress(subject, moduleNumber)
}

/**
 * Get progress for a specific section
 * @param {string} subject
 * @param {number} moduleNumber
 * @param {string} dotpointId
 * @param {string} sectionId
 * @returns {Object|null}
 */
export function getProgress(subject, moduleNumber, dotpointId, sectionId) {
  const key = `progress_${subject}_m${moduleNumber}_${dotpointId}_${sectionId}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

/**
 * Calculate and update module-level progress
 * @param {string} subject
 * @param {number} moduleNumber
 */
function updateModuleProgress(subject, moduleNumber) {
  // This would calculate total XP, completion %, etc.
  // For now, just store timestamp
  const key = `module_progress_${subject}_m${moduleNumber}`
  const data = {
    lastUpdated: new Date().toISOString(),
  }
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Get total XP earned for a subject
 * @param {string} subject
 * @returns {number}
 */
export function getTotalXP(subject) {
  let totalXP = 0

  // Iterate through localStorage to find all progress entries for this subject
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(`progress_${subject}_`)) {
      const data = localStorage.getItem(key)
      if (data) {
        const progress = JSON.parse(data)
        totalXP += progress.xp || 0
      }
    }
  }

  return totalXP
}

export default {
  loadLearnSections,
  loadPracticeQuestions,
  hasContent,
  loadModuleConfig,
  getModuleDotpoints,
  saveProgress,
  getProgress,
  getTotalXP,
}
