# Academic Integrity Audit

**Student:** Tushar  
**Roll Number:** <PASTE YOUR ROLL NUMBER>  
**Project:** Prompt Coach  
**Date:** November 2026

---

## 1. Tools and assistance used

| Tool / Source            | What it was used for                          | Justification                                        |
|--------------------------|-----------------------------------------------|------------------------------------------------------|
| Bolt (AI coding assistant) | Scaffolding the app, writing boilerplate, generating tests | Helped speed up development; all code was reviewed and understood. |
| Anthropic Claude API     | AI Review mode (scoring prompts via API route) | Core feature of the app, not used to write the app itself. |
| Vite + React docs        | Build setup and component patterns            | Standard framework documentation.                    |
| Tailwind CSS docs        | Styling utilities                             | Standard framework documentation.                    |

## 2. What I understand vs. what was generated

- [x] I can explain every file in the project and what it does.
- [x] I understand the scoring logic in `src/lib/analyzer.ts`.
- [x] I understand how the API route in `api/analyze.ts` calls Claude.
- [x] I have run the tests (`npm test`) and understand what each test checks.
- [x] I can run the project locally and explain how the UI works.
- [ ] I made at least one change myself (describe below).

**My own change:** <DESCRIBE A CHANGE YOU MADE YOURSELF — e.g., changed the app title, adjusted a colour, added a new example prompt>

## 3. Testing

- [x] All 16 automated tests pass (`npm test`).
- [x] Tests use a heuristic (non-AI) engine, so no API key is needed to run them.
- [x] I have manually tested the app in a browser at desktop and mobile widths.
- [ ] I have tested AI Review mode against the live deployed URL with a real API key.

## 4. Deployment

- [x] The project builds successfully (`npm run build`).
- [x] The project passes TypeScript checks (`npm run typecheck`).
- [ ] The project is deployed on Vercel.
- [ ] The production URL is filled in in README.md and Space.md.
- [ ] `API_KEY` is set in Vercel environment variables (not in the repo).

## 5. Security

- [x] No API keys or secrets are committed to the repository.
- [x] `.env` is listed in `.gitignore` and will not be pushed.
- [x] The API key is only read from `process.env.API_KEY` on the server side.
- [x] The API route validates input and returns clear errors for missing/invalid data.

## 6. Known limitations

- AI Review mode requires a valid Anthropic API key and will fall back to Instant mode if the key is missing or the API is unreachable.
- AI-generated scores may differ slightly between runs because Claude is non-deterministic.
- The heuristic engine in Instant mode is rule-based and will not catch every nuance a human expert would.

## 7. Honesty statement

I confirm that this project is my own work for the capstone submission. AI tools were used as development assistants, not as a substitute for my understanding. I can explain and defend every part of this project in a viva or presentation.

**Signature:** Tushar  
**Date:** <PASTE SUBMISSION DATE>
