# Prompt Coach

A web app that scores your prompt out of 100, diagnoses what needs fixing, and rewrites it into a better version.

Built as a capstone project for the Prompt Engineering course.

**Student:** Tushar  
**Roll Number:** <PASTE YOUR ROLL NUMBER>  
**Course:** Prompt Engineering  
**Date:** November 2026

---

## What it does

1. **Instant mode** – A built-in heuristic engine analyses your prompt across four categories (Clarity, Specificity, Structure, Completeness) and produces a score, a list of issues, and an improved rewrite. No API key needed.
2. **AI Review mode** – Sends your prompt to Anthropic's Claude API via a Vercel serverless function for an AI-powered critique and rewrite. Requires an API key.

## Live demo

**URL:** <PASTE YOUR VERCEL PRODUCTION URL>

## Tech stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 18 + TypeScript + Vite                    |
| Styling     | Tailwind CSS                                    |
| Icons       | lucide-react                                    |
| AI backend  | Anthropic Claude 3.5 Sonnet (via Vercel API route) |
| Testing     | Vitest (16 tests)                               |
| Hosting     | Vercel                                          |

## Project structure

```
.
├── api/
│   └── analyze.ts            # Vercel serverless function (Claude API)
├── src/
│   ├── components/
│   │   ├── ScoreGauge.tsx    # Animated circular score display
│   │   ├── BreakdownBars.tsx # Per-category score bars
│   │   ├── IssueList.tsx     # List of diagnosed issues
│   │   └── RewrittenPrompt.tsx # Improved prompt with copy button
│   ├── lib/
│   │   ├── analyzer.ts       # Heuristic scoring engine
│   │   └── analyzer.test.ts  # 16 unit tests
│   ├── App.tsx               # Main UI
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind directives
├── docs/
│   └── screenshots/          # Add screenshots here (see Space.md)
├── audit.md                  # Academic-integrity audit
├── Space.md                  # Submission space / checklist
├── PR_DESCRIPTION.md         # Pull request description
├── .env.example              # Example environment variables
└── README.md                 # This file
```

## Getting started (local)

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the URL shown in the terminal (usually http://localhost:5173)
```

Instant mode works without any configuration. AI Review mode needs an API key (see below).

## Running tests

```bash
npm test
```

All 16 tests run against the heuristic engine and do not call any external API.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Set the **Framework Preset** to **Other**.
4. Leave the **Build Command** empty (Vercel auto-detects Vite).
5. Go to **Settings → Environment Variables** and add:
   - **Name:** `API_KEY`
   - **Value:** your Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
6. Deploy. Vercel will give you a production URL.

## Environment variables

| Variable  | Required for        | Description                      |
|-----------|---------------------|----------------------------------|
| `API_KEY` | AI Review mode only | Anthropic API key                |

See `.env.example` for a template. **Never commit your real `.env` file.**

## How scoring works (Instant mode)

| Category       | Max | What it checks                                      |
|----------------|-----|------------------------------------------------------|
| Clarity        | 25  | Word count, vague language, task clarity            |
| Specificity    | 25  | Role, constraints, context, examples                |
| Structure      | 25  | Format specification, line breaks, sentence count   |
| Completeness   | 25  | Task verb presence, depth, hedging language         |

**Grade mapping:** A (90+), B (80–89), C (70–79), D (60–69), F (<60).

> **Note:** AI Review scores come from Claude and may vary slightly between runs. Instant mode scores are deterministic.

## Screenshots

Place screenshots in `docs/screenshots/`. See `Space.md` for the required file names.

## License

This project is for educational purposes as part of a capstone submission.
