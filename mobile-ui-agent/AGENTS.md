# Repository Guidelines

## Project Structure & Module Organization
Source lives in src/: components/ for reusable UI, pages/ for routed screens (auth, dashboard, quiz), context/ for providers, hooks/ for mobile-centric logic, utils/ for API clients, and data/ for seeded content. Static assets stay in src/assets/, while public/ serves static files consumed by Vite. Entry points are main.jsx and App.jsx. The production bundle is generated in dist/; do not hand-edit it.

## Build, Test, and Development Commands
`ash
npm install        # install dependencies
npm run dev        # launch Vite dev server on http://localhost:3000
npm run build      # create optimized bundle in dist/
npm run preview    # serve the production build locally
npm run lint       # run ESLint with React and hooks rules
`

## Coding Style & Naming Conventions
Use modern React with functional components and hooks. Keep indentation at 2 spaces, prefer single quotes, and rely on Tailwind utility classes for styling. Components and hooks use PascalCase (ProgressRing.jsx, usePWA.js), helpers stay camelCase. Let ESLint (
pm run lint) and Prettier defaults in your editor enforce formatting before pushing.

## Testing Guidelines
An automated test harness is not yet wired in; when adding coverage, adopt Vitest + React Testing Library to match the Vite toolchain. Store specs near the feature (src/pages/Dashboard.test.jsx) or in src/__tests__/. Focus on authentication flows, quiz interactions, and gamification state. Document manual verification steps in PRs until a formal 
pm test script is introduced.

## Commit & Pull Request Guidelines
Upstream history follows Conventional Commits (e.g., eat: add streak celebration confetti, ix: refresh token retry flow). Keep subjects imperative and ?72 characters, add context in the body, and reference tickets with Refs #123 when applicable. PRs should explain motivation, list key changes, attach before/after screenshots for UI tweaks, and note lint/test results. Request review only after addressing relevant items in DEPLOYMENT.md.

## Environment & Configuration Tips
Maintain .env with service endpoints for the auth, biology, and chemistry agents; never commit real secrets. Tailor theme tokens through 	ailwind.config.js, and ensure any new API modules extend the patterns in src/utils/. When offline support matters, reuse hooks like usePWA and update the fallback data in src/data/ to keep demo flows working.
