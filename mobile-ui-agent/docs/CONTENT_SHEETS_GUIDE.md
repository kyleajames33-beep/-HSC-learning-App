# Biology Learn Sections - Google Sheets Content Management Guide

## 📋 Overview

This guide explains how content creators can manage Biology learn page content using Google Sheets. The system syncs content from Sheets to the app automatically, so you can edit in a familiar spreadsheet interface without touching code.

---

## 🗂️ Sheet Structure

### Sheet Name: `Module5_LearnSections`

### Columns:

| Column | Name | Type | Description | Example |
|--------|------|------|-------------|---------|
| **A** | `dotpoint_id` | Text | Dotpoint identifier | `IQ1.1` |
| **B** | `section_id` | Text | Unique section ID | `video` |
| **C** | `section_type` | Text | Type of section (see below) | `video` |
| **D** | `title` | Text | Section display title | `Introduction to Reproduction` |
| **E** | `order` | Number | Display order (1-7) | `1` |
| **F** | `xp` | Number | XP reward for completion | `15` |
| **G** | `content` | JSON | Section content data | `{"url":"...","duration":120}` |
| **H** | `metadata` | JSON | Optional metadata | `{"optional":true}` |

---

## 📖 Section Types

### 1. `video` - Video Section
**XP Recommendation:** 15 XP

**Content JSON Structure:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "duration": 120,
  "description": "Brief description of what the video covers"
}
```

**Example Row:**
| dotpoint_id | section_id | section_type | title | order | xp | content | metadata |
|-------------|------------|--------------|-------|-------|----|---------|----------|
| IQ1.1 | video | video | Introduction to Reproduction | 1 | 15 | `{"url":"https://youtube.com/watch?v=abc123","duration":120,"description":"Overview of reproduction types"}` | `{}` |

---

### 2. `interactive-cards` - Swipeable Concept Cards
**XP Recommendation:** 20 XP

**Content JSON Structure:**
```json
{
  "cards": [
    {
      "front": "Term or concept",
      "back": "Detailed explanation"
    }
  ]
}
```

**Guidelines:**
- 5-8 cards per section
- Keep front text short (1-2 lines)
- Back can be longer (2-4 sentences)
- Include examples where helpful

**Example:**
```json
{
  "cards": [
    {
      "front": "Sexual Reproduction",
      "back": "Reproduction involving two parents and fusion of gametes, resulting in genetic variation."
    },
    {
      "front": "Asexual Reproduction",
      "back": "Reproduction from a single parent without gamete fusion, producing genetically identical offspring."
    }
  ]
}
```

---

### 3. `podcast` - Audio Content (Optional)
**XP Recommendation:** 10 XP

**Content JSON Structure:**
```json
{
  "url": "/audio/biology/module5/IQ1.1-podcast.mp3",
  "duration": 180,
  "description": "What students will learn from listening"
}
```

**Metadata:**
```json
{
  "optional": true
}
```

**Note:** Podcasts are always optional. Students can skip without penalty.

---

### 4. `flashcards` - Key Terms Matching Game
**XP Recommendation:** 25 XP

**Content JSON Structure:**
```json
{
  "terms": [
    {
      "term": "External Fertilisation",
      "definition": "Fusion of gametes outside the body, common in aquatic organisms"
    }
  ]
}
```

**Guidelines:**
- 8-12 terms per section
- Keep definitions concise (1-2 sentences)
- Use terms students need to memorize for HSC
- Order by importance (most important first)

---

### 5. `worked-example` - Step-by-Step Example
**XP Recommendation:** 15 XP

**Content JSON Structure:**
```json
{
  "steps": [
    {
      "title": "Step 1: Identify the Question",
      "content": "Question text and what we need to do..."
    },
    {
      "title": "Step 2: Define Each Type",
      "content": "Breaking down the definitions..."
    }
  ]
}
```

**Guidelines:**
- 3-5 steps per example
- Show HSC-style answer construction
- Include common mistakes to avoid
- Final step should be complete sample answer

---

### 6. `practice` - Practice Questions
**XP Recommendation:** 30 XP

**Content JSON Structure:**
```json
{
  "questions": [
    {
      "id": "pq1",
      "question": "Which of the following is an advantage of sexual reproduction?",
      "options": [
        "Faster reproduction rate",
        "No need for finding a mate",
        "Increased genetic diversity",
        "Lower energy requirements"
      ],
      "correctAnswer": 2,
      "explanation": "Sexual reproduction combines genetic material from two parents, creating offspring with new combinations of genes."
    }
  ]
}
```

**Guidelines:**
- 5 questions per section
- Mix of difficulty levels
- Include detailed explanations
- `correctAnswer` is 0-indexed (0 = first option)
- All questions should relate to the dotpoint

---

### 7. `notes` - Summary & Personal Notes
**XP Recommendation:** 15 XP

**Content JSON Structure:**
```json
{
  "summary": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ]
}
```

**Guidelines:**
- 5-6 bullet points
- Concise takeaways
- Students can add personal notes (saved locally)
- Think "what should students remember from this dotpoint?"

---

## 🎯 XP Economy Guidelines

**Total XP per Dotpoint:** ~130-180 XP (sections) + 50 XP (bonus) = ~180-230 XP

| Section Type | Recommended XP | Rationale |
|--------------|----------------|-----------|
| Video | 15 XP | Passive consumption, quick |
| Interactive Cards | 20 XP | Active engagement, reading |
| Podcast | 10 XP | Optional, passive |
| Flashcards | 25 XP | Active learning, memorization |
| Worked Example | 15 XP | Study/reading |
| Practice Questions | 30 XP | Highest effort, testing |
| Notes/Summary | 15 XP | Reflection, consolidation |

**Bonus XP:**
- Complete all 7 sections: +50 XP
- Quick Quiz pass (65%+): +100 XP
- Essay Quiz pass: +150 XP
- Unlock next dotpoint: +200 XP

---

## 🛠️ How to Add New Content

### Step 1: Open Google Sheet
1. Open `Module5_LearnSections` sheet
2. Find the last row of content
3. Add a new row below

### Step 2: Fill in Basic Info
```
Column A (dotpoint_id): IQ1.1
Column B (section_id):  video
Column C (section_type): video
Column D (title):       Introduction to Reproduction
Column E (order):       1
Column F (xp):          15
```

### Step 3: Create Content JSON
1. Use the templates above for your section type
2. Write JSON in a text editor first
3. Validate JSON using [jsonlint.com](https://jsonlint.com/)
4. Paste into Column G

### Step 4: Add Metadata (Optional)
```json
{}
```
Or for optional sections:
```json
{"optional": true}
```

### Step 5: Save & Sync
1. Save the Google Sheet
2. Run sync script: `npm run sync:learn-sections`
3. Check console for validation errors
4. Fix any errors and re-sync

---

## ✅ Content Checklist

Before syncing, ensure:

- [ ] All required columns filled
- [ ] `order` values are sequential (1, 2, 3, 4, 5, 6, 7)
- [ ] XP values are reasonable (10-30 range)
- [ ] JSON is valid (test with jsonlint.com)
- [ ] URLs are complete and correct
- [ ] Practice question answers are correct
- [ ] Explanations are clear and helpful
- [ ] Content aligns with HSC syllabus
- [ ] No spelling/grammar errors

---

## 🔧 Sync Process

### Running the Sync Script

```bash
# From mobile-ui-agent directory
cd C:\HSC-Learning-App\mobile-ui-agent

# Run sync
npm run sync:learn-sections

# Or directly with node
node scripts/syncLearnSectionsFromSheets.js
```

### What the Script Does

1. **Authenticates** with Google Sheets API
2. **Fetches** all rows from the sheet
3. **Parses** JSON in content/metadata columns
4. **Groups** sections by dotpoint
5. **Sorts** sections by order within each dotpoint
6. **Validates** data structure
7. **Writes** to `src/data/biologyModule5LearnSections.json`

### Validation Errors vs Warnings

**Errors (🛑 Sync aborted):**
- Missing required fields
- Invalid JSON syntax
- Duplicate section IDs

**Warnings (⚠️ Sync continues):**
- Order sequence issues
- Unusual XP values
- Missing optional fields

---

## 📊 Example: Complete Dotpoint

Here's a complete IQ1.1 with all 7 sections:

| dotpoint_id | section_id | section_type | title | order | xp | content | metadata |
|-------------|------------|--------------|-------|-------|----|---------|----------|
| IQ1.1 | video | video | Introduction to Reproduction | 1 | 15 | `{"url":"https://youtube.com/watch?v=abc","duration":120}` | `{}` |
| IQ1.1 | cards | interactive-cards | Key Concepts | 2 | 20 | `{"cards":[{"front":"Sexual Reproduction","back":"..."}]}` | `{}` |
| IQ1.1 | podcast | podcast | Reproductive Strategies | 3 | 10 | `{"url":"/audio/...","duration":180}` | `{"optional":true}` |
| IQ1.1 | flashcards | flashcards | Master Key Terms | 4 | 25 | `{"terms":[{"term":"Zygote","definition":"..."}]}` | `{}` |
| IQ1.1 | example | worked-example | Comparing Types | 5 | 15 | `{"steps":[{"title":"Step 1","content":"..."}]}` | `{}` |
| IQ1.1 | practice | practice | Practice Questions | 6 | 30 | `{"questions":[{"id":"pq1","question":"...","options":[],"correctAnswer":2}]}` | `{}` |
| IQ1.1 | notes | notes | Summary & Notes | 7 | 15 | `{"summary":["Point 1","Point 2"]}` | `{}` |

**Total:** 130 XP + 50 XP bonus = **180 XP for completing learn page**

---

## 🐛 Troubleshooting

### "Invalid JSON" Error
- Copy content column to [jsonlint.com](https://jsonlint.com/)
- Fix syntax errors (missing quotes, commas, brackets)
- Common issues:
  - Using single quotes instead of double quotes
  - Trailing commas in arrays
  - Unescaped characters in strings

### "Order Mismatch" Warning
- Check that order values are 1, 2, 3, 4, 5, 6, 7
- No skipped numbers
- No duplicates

### "Missing URL" Warning
- Ensure video sections have `url` in content
- Check URL is complete (starts with `https://`)

### Sync Script Not Running
1. Check Node.js is installed: `node --version`
2. Install dependencies: `npm install`
3. Check credentials file exists
4. Verify GOOGLE_SHEET_ID environment variable

---

## 📞 Support

Questions? Contact:
- **Technical Issues:** Developer team
- **Content Questions:** Biology curriculum lead
- **Sync Problems:** Check console output for specific errors

---

## 🎯 Content Quality Standards

### ✅ Good Content
- Clear, concise explanations
- HSC syllabus aligned
- Proper scientific terminology
- Engaging examples
- Helpful explanations in practice questions

### ❌ Avoid
- Copy-pasting from textbooks (copyright)
- Overly complex language
- Incorrect scientific information
- Broken YouTube links
- Questions without explanations

---

## 📝 Quick Reference: JSON Templates

### Video
```json
{"url":"https://youtube.com/watch?v=ID","duration":120,"description":"What students learn"}
```

### Cards (2 cards minimum)
```json
{"cards":[{"front":"Term","back":"Definition"},{"front":"Term 2","back":"Definition 2"}]}
```

### Podcast
```json
{"url":"/audio/path.mp3","duration":180,"description":"Topic covered"}
```

### Flashcards (8 terms minimum)
```json
{"terms":[{"term":"Word","definition":"Meaning"}]}
```

### Worked Example (3-5 steps)
```json
{"steps":[{"title":"Step 1","content":"Explanation"}]}
```

### Practice (5 questions)
```json
{"questions":[{"id":"pq1","question":"Q?","options":["A","B","C","D"],"correctAnswer":2,"explanation":"Why"}]}
```

### Notes
```json
{"summary":["Point 1","Point 2","Point 3"]}
```

---

**Last Updated:** 2025-01-16
**Version:** 1.0
