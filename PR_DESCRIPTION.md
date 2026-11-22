## Summary

Added documentation, a Vercel serverless API route for AI-powered prompt reviews, and unit tests for the heuristic scoring engine.

## Changes

- **API route (`api/analyze.ts`)**: Serverless function that sends a prompt to Anthropic Claude 3.5 Sonnet and returns a structured JSON score, issue list, breakdown, and rewritten prompt. Falls back gracefully if the API key is missing.
- **Heuristic analyzer (`src/lib/analyzer.ts`)**: Rule-based scoring engine that evaluates prompts across four categories (Clarity, Specificity, Structure, Completeness), produces a 0–100 score, a letter grade, prioritized issues, and an improved rewrite.
- **UI components**: Animated score gauge, per-category breakdown bars, issue cards with severity levels, and a copy-to-clipboard rewritten-prompt panel.
- **Mode toggle**: Users can switch between Instant (heuristic, no API key) and AI Review (Claude-powered) modes.
- **Unit tests (`src/lib/analyzer.test.ts`)**: 16 tests covering scoring range, grade mapping, breakdown sum, weak prompts, strong prompts, issue ordering, and rewrite quality.
- **Documentation**: README.md, audit.md, Space.md, .env.example, and this PR description.

## How to test

1. `npm install`
2. `npm test` — all 16 tests should pass
3. `npm run build` — build should succeed
4. `npm run dev` — open the app and try analyzing a prompt in Instant mode

## Notes

- AI Review mode requires `API_KEY` to be set as a Vercel environment variable. It is not needed for local Instant mode or for running tests.
- No API keys or secrets are included in this PR.
