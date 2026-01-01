# Component Maintenance Guide

**Last Updated:** 2025-10-27
**For:** Enhanced UI Components (EnhancedNotesSection, InteractiveReadingSection, QuickQuiz)

---

## Quick Reference

### File Locations
```
mobile-ui-agent/src/components/
├── EnhancedNotesSection.jsx      # Interactive notes with gamification
├── InteractiveReadingSection.jsx # Gamified content reading
├── QuickQuiz.jsx                  # Adaptive quiz system
└── LearnPage.jsx                  # Integration point
```

### Key Dependencies
- `framer-motion` - Animations
- `react` - Core framework
- `GamificationContext` - XP/rewards system

---

## Common Modification Tasks

### 1. Adjust XP Rewards

#### EnhancedNotesSection
**File:** `EnhancedNotesSection.jsx`

**Section Exploration XP (Line 104):**
```javascript
await addXP(5, `Explored ${section}`)
// Change 5 to desired XP amount
```

**Highlighting XP (Line 134):**
```javascript
await addXP(3, 'Highlighted key concept')
// Change 3 to desired XP amount
```

**Challenge XP (Lines 68-92):**
```javascript
const challenges = [
  {
    id: 'speed-reader',
    xp: 25, // ← Change this
  },
  {
    id: 'highlight-master',
    xp: 20, // ← Change this
  },
  {
    id: 'memory-palace',
    xp: 30, // ← Change this
  }
]
```

#### InteractiveReadingSection
**File:** `InteractiveReadingSection.jsx`

**Active Reading Micro-XP (Line 65):**
```javascript
await addXP(1, 'Active reading')
// Change 1 to desired amount
```

**Comprehension Check XP (Line 128):**
```javascript
completeReadingChallenge('comprehension', 10)
//                                          ^^ Bonus amount
// Base: 15 + Bonus: 10 = 25 XP total
```

**Focus Mode XP (Lines 98-99):**
```javascript
case 'focus':
  badgeText = 'Laser Focus'
  xp += 25 // ← Change bonus amount
```

**Completion XP (Line 329):**
```javascript
completeReadingChallenge('completion', 25)
//                                      ^^ Bonus amount
```

#### QuickQuiz
**File:** `QuickQuiz.jsx`

**Base XP (Search for "baseXP"):**
```javascript
const baseXP = isCorrect ? 20 : 5
// Correct: 20, Incorrect: 5
```

**Speed Bonus Cap (Search for "speedBonus"):**
```javascript
const speedBonus = isCorrect ? Math.max(0, (12 - timeTaken / 2) * 2) : 0
// Adjust formula for different speed rewards
```

**Streak Bonus (Search for "streakBonus"):**
```javascript
const streakBonus = isCorrect ? Math.min(streak * 4, 20) : 0
// 4 XP per streak, capped at 20
```

**Difficulty Multipliers (Search for "difficultyMultiplier"):**
```javascript
const multipliers = {
  normal: 1.0,   // ← Standard mode
  rapid: 1.2,    // ← Rapid fire (20% bonus)
  recovery: 1.1  // ← Recovery boost (10% bonus)
}
```

---

### 2. Change Animation Speeds

**Global Rule:** Shorter = snappier, Longer = smoother

**Recommended Timings:**
- Button clicks: 150ms
- Popups: 300ms
- Section expansions: 300ms
- Page transitions: 500ms

#### Example: Make Popup Faster
**Before:**
```javascript
<motion.div
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

**After:**
```javascript
<motion.div
  transition={{ duration: 0.2, ease: "easeOut" }} // Faster
>
```

#### Search for These Patterns:
- `transition={{ duration:` - All timed animations
- `whileHover=` - Hover animations
- `whileTap=` - Click animations

---

### 3. Add New Challenges

#### EnhancedNotesSection - Add Challenge
**File:** `EnhancedNotesSection.jsx` (Lines 68-92)

```javascript
const challenges = [
  // ... existing challenges ...
  {
    id: 'your-new-challenge',           // Unique ID
    title: 'Your Challenge Title',      // Shown to user
    description: 'Challenge description', // Details
    xp: 35,                             // XP reward
    icon: '🎯',                         // Emoji icon
    type: 'interaction'                 // 'timed'|'interaction'|'creative'
  }
]
```

**Add Logic (if needed):**
```javascript
// Line ~130, in completeChallenge or highlightPoint
if (challengeType?.id === 'your-new-challenge') {
  // Add custom completion logic here
  if (customConditionMet) {
    completeChallenge(challengeType)
  }
}
```

---

### 4. Modify Color Schemes

#### EnhancedNotesSection Colors
**File:** `EnhancedNotesSection.jsx` (Lines 38-63)

```javascript
const colorSchemes = {
  green: {
    primary: 'green',
    gradient: 'from-green-500 via-emerald-500 to-teal-500', // Change here
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',   // Background
    border: 'border-green-200',                            // Border color
    // ... more colors
  },
  // Add new color scheme:
  purple: {
    primary: 'purple',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badgeBg: 'bg-gradient-to-r from-purple-100 to-violet-100',
    badgeText: 'text-purple-700',
    iconBg: 'bg-gradient-to-br from-purple-100 to-violet-100',
    iconText: 'text-purple-600',
    glow: 'shadow-purple-200',
  }
}
```

**Usage:**
```jsx
<EnhancedNotesSection
  subjectColor="purple" // ← New color
/>
```

---

### 5. Adjust Challenge Trigger Rates

#### EnhancedNotesSection - Challenge Popup Frequency
**File:** `EnhancedNotesSection.jsx` (Line 107)

```javascript
if (Math.random() < 0.3 && !showChallenge) {
  //               ^^^ 30% chance
  triggerRandomChallenge()
}
```

**Change to:**
- 50% chance: `0.5`
- 10% chance: `0.1`
- Always: `1.0`
- Never: `0.0`

#### InteractiveReadingSection - Micro-XP Frequency
**File:** `InteractiveReadingSection.jsx` (Line 64)

```javascript
if (Math.random() < 0.1) { // 10% chance
  await addXP(1, 'Active reading')
}
```

---

### 6. Add New Scientific Terms

#### InteractiveReadingSection
**File:** `InteractiveReadingSection.jsx` (Lines 76-79)

```javascript
const scientificTerms = [
  'photosynthesis',
  'mitochondria',
  // ... existing terms ...
  'newterm',        // Add here
  'anotherterm',
]
```

**Term Detection:**
- Case-insensitive
- Partial match (e.g., "mitochondria" matches "mitochondrial")

---

### 7. Modify Difficulty Triggers

#### QuickQuiz - Adaptive Difficulty
**File:** `QuickQuiz.jsx`

**Search for: "mode calculations"**

**Rapid Fire Trigger (Current):**
```javascript
if (isCorrect && timeTaken <= 12 && streak >= 3) {
  mode = 'rapid'
}
```

**Make Easier (Trigger Earlier):**
```javascript
if (isCorrect && timeTaken <= 15 && streak >= 2) {
  //                           ^^             ^^ Lower thresholds
  mode = 'rapid'
}
```

**Make Harder (Trigger Later):**
```javascript
if (isCorrect && timeTaken <= 10 && streak >= 5) {
  //                           ^^             ^^ Higher thresholds
  mode = 'rapid'
}
```

**Recovery Boost Trigger (Current):**
```javascript
if (!isCorrect && previousIncorrect) {
  mode = 'recovery'
}
```

---

### 8. Change Timer Settings

#### QuickQuiz - Time Allocation
**File:** `QuickQuiz.jsx`

**Search for: "timePerQuestion" or timer initialization**

**Current:** 90 seconds per question

**Change to:**
```javascript
const timePerQuestion = 120 // 2 minutes per question
const totalTime = questions.length * timePerQuestion
setTimeRemaining(totalTime)
```

**Color Change Thresholds:**
```javascript
// Line with timer color logic
{timeRemaining > 180 ? 'text-green-600' :   // > 3 minutes
 timeRemaining > 60 ? 'text-yellow-600' :   // 1-3 minutes
 'text-red-600'}                            // < 1 minute
```

---

### 9. Customize Motivational Messages

#### QuickQuiz - Feedback Messages
**File:** `QuickQuiz.jsx`

**Search for: "messages" or "feedback" arrays**

**Add Custom Messages:**
```javascript
const correctMessages = [
  "Excellent work!",
  "You're on fire!",
  "Perfect!",
  "Keep it up!",
  "Your custom message here!", // Add new
]

const incorrectMessages = [
  "Keep going! Review the concept and try again.",
  "Don't worry! Learning from mistakes is progress.",
  "Your encouraging message!", // Add new
]
```

**Random Selection:**
```javascript
const message = messages[Math.floor(Math.random() * messages.length)]
```

---

### 10. Adjust Study Timer Display

#### EnhancedNotesSection - Timer Format
**File:** `EnhancedNotesSection.jsx` (Lines 143-147)

**Current Format:** MM:SS
```javascript
const formatStudyTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
```

**Show Hours (HH:MM:SS):**
```javascript
const formatStudyTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
```

**Show Only Minutes:**
```javascript
const formatStudyTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  return `${mins}min`
}
```

---

## Performance Optimization

### Reduce Re-renders

**Use React.memo for Expensive Components:**
```javascript
import React, { memo } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  // Component logic
})

export default ExpensiveComponent
```

### Optimize Framer Motion

**Use `layout` for Better Performance:**
```javascript
<motion.div layout> // Automatically animates layout changes
```

**Reduce Animation Overhead:**
```javascript
// Instead of animating every word:
<motion.span> // Remove this if too many

// Animate only containers:
<motion.div> // Keep this
  <span>Word</span> // No motion
</motion.div>
```

### Debounce Frequent Updates

**Example: Reading Speed Updates**
```javascript
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

const debouncedUpdateSpeed = debounce((speed) => {
  setReadingSpeed(speed)
}, 500) // Update every 500ms instead of every render
```

---

## Testing After Modifications

### Checklist
- [ ] Component renders without errors
- [ ] All interactive elements respond (clicks, hovers)
- [ ] XP rewards are awarded correctly
- [ ] Animations are smooth (no jank)
- [ ] Mobile responsive (test on small screens)
- [ ] No console errors or warnings
- [ ] GamificationContext updates properly

### Testing XP Rewards
```javascript
// In browser console:
window.addEventListener('xp-added', (e) => {
  console.log('XP Added:', e.detail)
})
```

### Testing Performance
```javascript
// Chrome DevTools → Performance tab
1. Click "Record"
2. Interact with component
3. Stop recording
4. Check FPS (should be 55-60)
5. Look for long tasks (> 50ms = bad)
```

---

## Common Issues & Solutions

### Issue: XP Not Updating
**Solution:**
- Check `GamificationContext` is wrapped around component
- Verify `addXP` function is called with `await`
- Check network tab for failed API calls

### Issue: Animations Stuttering
**Solution:**
- Reduce animation duration
- Remove unnecessary animations
- Use CSS `will-change` property
- Check for heavy computations during animation

### Issue: Component Not Rendering Data
**Solution:**
- Verify props are passed correctly
- Check data structure matches expected format
- Add fallback for missing data:
```javascript
const notes = props.notes || {
  keyPoints: [],
  mnemonics: [],
  // ... fallbacks
}
```

### Issue: Timer Not Updating
**Solution:**
- Ensure `useEffect` cleanup is working:
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setTime(prev => prev + 1)
  }, 1000)

  return () => clearInterval(timer) // Must cleanup!
}, [])
```

---

## Advanced Modifications

### Add Sound Effects

**Install Package:**
```bash
npm install use-sound
```

**Implementation:**
```javascript
import useSound from 'use-sound'

const [playCorrect] = useSound('/sounds/correct.mp3')
const [playIncorrect] = useSound('/sounds/incorrect.mp3')

// In answer handler:
if (isCorrect) {
  playCorrect()
} else {
  playIncorrect()
}
```

### Add Haptic Feedback (Mobile)

```javascript
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(100) // 100ms vibration
  }
}

// On button click:
<button onClick={() => {
  triggerHaptic()
  handleClick()
}}>
```

### Persist Study Time Across Sessions

```javascript
// Save to localStorage
useEffect(() => {
  localStorage.setItem(`study-time-${dotpointId}`, studyTime)
}, [studyTime, dotpointId])

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(`study-time-${dotpointId}`)
  if (saved) {
    setStudyTime(parseInt(saved, 10))
  }
}, [dotpointId])
```

---

## Rollback Instructions

### If Update Breaks Something

**1. Check Git History:**
```bash
git log --oneline
# Find commit before changes
```

**2. Revert File:**
```bash
git checkout <commit-hash> -- src/components/EnhancedNotesSection.jsx
```

**3. Or Restore from Backup:**
```bash
cp backup/EnhancedNotesSection.jsx src/components/
```

**4. Test:**
```bash
npm run dev
# Verify component works
```

---

## Contact & Support

**Documentation:**
- `ENHANCED_COMPONENTS_DOCUMENTATION.md` - Full component reference
- `TESTING_GUIDE.md` - Testing procedures
- `CURRENT_PLAN.md` - Project status

**Questions?** Review documentation or check component comments.

**Found a Bug?** Document in `TESTING_ISSUES.md` with:
- What you changed
- Expected behavior
- Actual behavior
- Steps to reproduce

---

**Last Updated:** 2025-10-27
**Next Review:** After major component updates
