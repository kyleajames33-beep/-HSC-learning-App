/**
 * Bookmarks utility - Save and retrieve favorite dotpoints
 * Uses localStorage for persistence
 */

const BOOKMARKS_KEY = 'hsc_bookmarks'
const RECENT_KEY = 'hsc_recent'

/**
 * Get all bookmarks
 * @returns {Array} Array of bookmark objects
 */
export function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error loading bookmarks:', error)
    return []
  }
}

/**
 * Add a bookmark
 * @param {Object} bookmark - Bookmark object {subject, moduleNumber, dotpointId, title, timestamp}
 */
export function addBookmark(bookmark) {
  try {
    const bookmarks = getBookmarks()

    // Check if already bookmarked
    const exists = bookmarks.some(
      (b) =>
        b.subject === bookmark.subject &&
        b.moduleNumber === bookmark.moduleNumber &&
        b.dotpointId === bookmark.dotpointId
    )

    if (!exists) {
      const newBookmark = {
        ...bookmark,
        timestamp: new Date().toISOString(),
      }
      bookmarks.push(newBookmark)
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
      return true
    }
    return false
  } catch (error) {
    console.error('Error adding bookmark:', error)
    return false
  }
}

/**
 * Remove a bookmark
 * @param {string} subject
 * @param {number|string} moduleNumber
 * @param {string} dotpointId
 */
export function removeBookmark(subject, moduleNumber, dotpointId) {
  try {
    const bookmarks = getBookmarks()
    const filtered = bookmarks.filter(
      (b) =>
        !(
          b.subject === subject &&
          b.moduleNumber == moduleNumber &&
          b.dotpointId === dotpointId
        )
    )
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return false
  }
}

/**
 * Check if a dotpoint is bookmarked
 * @param {string} subject
 * @param {number|string} moduleNumber
 * @param {string} dotpointId
 * @returns {boolean}
 */
export function isBookmarked(subject, moduleNumber, dotpointId) {
  const bookmarks = getBookmarks()
  return bookmarks.some(
    (b) =>
      b.subject === subject &&
      b.moduleNumber == moduleNumber &&
      b.dotpointId === dotpointId
  )
}

/**
 * Toggle bookmark status
 * @param {Object} bookmark
 * @returns {boolean} New bookmark status (true = bookmarked, false = removed)
 */
export function toggleBookmark(bookmark) {
  if (isBookmarked(bookmark.subject, bookmark.moduleNumber, bookmark.dotpointId)) {
    removeBookmark(bookmark.subject, bookmark.moduleNumber, bookmark.dotpointId)
    return false
  } else {
    addBookmark(bookmark)
    return true
  }
}

/**
 * Add to recently viewed
 * @param {Object} item - Recent item object
 */
export function addToRecent(item) {
  try {
    const recent = getRecent()

    // Remove if already exists (we'll re-add at the front)
    const filtered = recent.filter(
      (r) =>
        !(
          r.subject === item.subject &&
          r.moduleNumber == item.moduleNumber &&
          r.dotpointId === item.dotpointId
        )
    )

    // Add to front
    const newItem = {
      ...item,
      timestamp: new Date().toISOString(),
    }
    filtered.unshift(newItem)

    // Limit to 20 recent items
    const limited = filtered.slice(0, 20)

    localStorage.setItem(RECENT_KEY, JSON.stringify(limited))
  } catch (error) {
    console.error('Error adding to recent:', error)
  }
}

/**
 * Get recently viewed items
 * @param {number} limit - Max number of items to return
 * @returns {Array}
 */
export function getRecent(limit = 10) {
  try {
    const data = localStorage.getItem(RECENT_KEY)
    const recent = data ? JSON.parse(data) : []
    return recent.slice(0, limit)
  } catch (error) {
    console.error('Error loading recent:', error)
    return []
  }
}

/**
 * Clear all bookmarks
 */
export function clearBookmarks() {
  localStorage.removeItem(BOOKMARKS_KEY)
}

/**
 * Clear recent history
 */
export function clearRecent() {
  localStorage.removeItem(RECENT_KEY)
}

export default {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
  addToRecent,
  getRecent,
  clearBookmarks,
  clearRecent,
}
