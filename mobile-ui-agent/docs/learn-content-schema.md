# Learn Page Content Schema

This document describes the structure expected for the new **Learn** tab data.  
Content is sourced from Google Sheets and exported to JSON during the data
sync step.

## Sheet Layout

Each row represents a single section within a dotpoint lesson.

| Column            | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `dotpoint_id`     | Dotpoint identifier (e.g. `IQ1.1`).                                         |
| `section_id`      | Stable id for the section (used for progress tracking).                     |
| `section_type`    | One of `video`, `interactive-cards`, `podcast`, `flashcards`, `worked-example`, `practice`, `notes`, `placeholder`. |
| `title`           | Section title shown to the learner.                                         |
| `order`           | 1-based ordering for display.                                               |
| `xp`              | XP reward for completing the section (default 15 if blank).                |
| `content_json`    | JSON payload describing the section content (examples below).              |
| `metadata_json`   | Optional JSON for flags such as `{ "optional": true }`.                    |

### Content JSON Examples

```json
// video
{ "url": "https://www.youtube.com/watch?v=qwerty", "description": "Overview" }

// interactive-cards
{ "cards": [{ "term": "Meiosis", "definition": "..." }] }

// podcast
{ "url": "/audio/module5/iq1-1.mp3", "description": "3 minute summary" }

// flashcards
{ "terms": [{ "term": "Gamete", "definition": "..." }] }

// worked-example
{ "steps": [{ "title": "Step 1", "content": "..." }] }

// practice
{
  "questions": [
    {
      "id": "q1",
      "question": "Which statement is true?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1,
      "explanation": "Optional feedback"
    }
  ]
}

// notes
{ "summary": ["Key point 1", "Key point 2"] }

// placeholder (used for planned content)
{ "message": "Content coming soon" }
```

## Exported JSON

During the sync script each row is grouped by `dotpoint_id` and sorted by
`order`. The output file lives under `src/data/` (for example
`biologyModule5LearnSections.json`).

Example:

```json
{
  "IQ1.1": [
    { "sectionId": "video", "type": "video", ... },
    { "sectionId": "cards", "type": "interactive-cards", ... }
  ]
}
```

## Progress Storage

The Learn page stores local progress in `localStorage` using the following keys:

- `learn-progress:<dotpointId>` - contains `completedIds`, `totalXP`, `bonusAwarded`.
- `learn-notes:<dotpointId>` - contains saved notes for the Notes section.

Deleting those entries resets Learn progress without affecting other features.

## Sync Workflow

Content updates are pulled from Google Sheets with `scripts/syncLearnSectionsFromSheets.js`.
Run the script from the project root after setting the required environment variables:

```bash
GOOGLE_SHEET_ID=<sheet id> \
GOOGLE_CREDENTIALS=<path to service account json> \
node scripts/syncLearnSectionsFromSheets.js
```

The script downloads the sheet, groups sections by `dotpoint_id`, applies validation, and writes the output to `src/data/biologyModule5LearnSections.json`.

### Validation Rules

- Every section must define `sectionId`, `type`, `title`, and a numeric `order`.
- `order` values must form a consecutive sequence starting at 1.
- XP defaults to 0 if the column is blank; values outside 0-100 trigger warnings.
- Video sections require `content.url`.
- Interactive card sections require `content.cards` with at least one entry.
- Flashcard sections require `content.terms` with at least one entry.
- Practice sections require `content.questions` with at least one entry.
- Rows with invalid JSON in `content_json` or `metadata_json` are still written, but the invalid payload is wrapped in `raw` so that upstream validation can flag it.

### Common Warnings from the Script

- `No data found` - the sheet is empty or the range is wrong.
- `order mismatch` - a dotpoint has missing or duplicate order values.
- `unusual XP value` - XP is negative or greater than 100.
- `missing url/cards/terms/questions` - the section type is missing required data.

Validate each warning before exporting so learners see complete content in the Learn tab.

### Local Validation Command

Run the automated validator before committing new data:

```bash
npm run validate:learn
```

You can also target a specific file:

```bash
node scripts/validateLearnSections.cjs path/to/file.json
```

The script exits with a non-zero status if blocking errors are found and lists warnings that should be resolved in Sheets.
