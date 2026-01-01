# Manual Testing Checklist

Use this guide for pre-release smoke testing of the mobile UI build. Each section focuses on the learner journey for Biology Module 5 (IQ1.1 as the reference dotpoint), but the same steps apply to other modules once content is available.

## Test Environment

- Build the app locally (`npm run dev` or `npm run build && npm run preview`) or open the latest Vercel production URL.
- Sign in with a test user that has no existing progress, or clear `localStorage` keys that start with `learn-progress`, `learn-notes`, and `dotpoint-progress`.
- Use a modern mobile browser (Safari iOS, Chrome Android) and also confirm on a desktop viewport.

## 1. Pathway Navigation

- From the dashboard, open Biology Module 5 and pick dotpoint IQ1.1.
- Confirm the Learn/Quiz/Practice/Progress tabs display without console errors.
- Return to the dashboard and re-enter the dotpoint to verify state persists.

## 2. Learn Tab

- Complete each section (video, cards, podcast, flashcards, worked example, practice, notes) in order.
- Confirm XP increases only once per section and totals appear in the header badge.
- Refresh the browser; the section completion and XP totals should still be present.
- Switch tabs mid-way through a section and return; progress should not be lost.

## 3. Quick Quiz Tab

- Start the quiz, answer all questions, and submit.
- Verify the pass/fail banner, score breakdown, and XP award render correctly.
- Navigate back to the Learn tab and ensure it now shows the “Quiz completed” state.
- Refresh the page; quiz completion should remain recorded.

## 4. Practice (Essay) Tab

- Walk through the guided essay steps; confirm hints/tips render and navigation between steps works.
- Submit the final answer and verify completion feedback appears.
- Refresh the page; the Practice tab should remain completed.

## 5. Progress Tab

- Confirm the status cards reflect the combined Learn/Quiz/Practice state with accurate XP totals.
- Review the recent activity list and ensure timestamps/labels are sensible.
- Toggle between dotpoints (if unlocked) and confirm stats change accordingly.

## 6. Offline and PWA Behaviours (optional but recommended)

- With dev tools set to offline mode, trigger the offline banner and attempt to open a cached section.
- Reconnect and confirm the banner clears automatically.
- If testing on mobile, add the PWA to the home screen and ensure it launches without errors.

## 7. Regression Spot Checks

- Dashboard widgets: XP counter, streak information, and recommended actions should populate.
- Global navigation: open Chemistry and other modules to ensure new components do not break cross-module routes.
- Authentication: log out and log back in to verify the session handling still works.

Document any failures with reproduction steps, screenshots, and console logs before handing back to engineering. This checklist lives in `docs/manual-testing-checklist.md`; update it as new features land.
