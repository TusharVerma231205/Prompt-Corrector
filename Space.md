# Submission Space

**Student:** Tushar  
**Roll Number:** <PASTE YOUR ROLL NUMBER>  
**Course:** Prompt Engineering  
**Project:** Prompt Coach  
**Date:** November 2026

---

## Live links

- **Production URL:** <PASTE YOUR VERCEL PRODUCTION URL>
- **GitHub repository:** <PASTE YOUR GITHUB REPO URL>
- **Pull request:** <PASTE YOUR PR URL>

## One-line description

Prompt Coach scores any prompt out of 100, diagnoses what needs fixing, and rewrites it into a better version — with an instant heuristic mode and an AI-powered mode using Claude.

## Required screenshots

Save each screenshot in `docs/screenshots/` with the exact file name below.

| # | File name                        | What to capture                                           |
|---|----------------------------------|-----------------------------------------------------------|
| 1 | `01-app-after-review.png`        | The app after running a review (showing score + issues)  |
| 2 | `02-github-file-list.png`        | GitHub repository file list                              |
| 3 | `03-readme.png`                  | README.md rendered on GitHub                              |
| 4 | `04-audit.png`                   | audit.md rendered on GitHub                               |
| 5 | `05-space.png`                   | Space.md rendered on GitHub                               |
| 6 | `06-pr-page.png`                 | The open pull request page on GitHub                     |
| 7 | `07-vercel-env-vars.png`         | Vercel environment variables page (hide the key value)   |
| 8 | `08-vercel-deployment-ready.png` | Vercel "deployment ready" page                           |

## Deliverables checklist

- [ ] Code pushed to GitHub (main branch)
- [ ] Pull request opened with PR_DESCRIPTION.md content
- [ ] Deployed on Vercel with API_KEY set
- [ ] Production URL tested with a real prompt
- [ ] README.md filled in (no placeholders left)
- [ ] audit.md filled in (all boxes ticked, own change described)
- [ ] Space.md filled in (all links pasted)
- [ ] All 8 screenshots added to docs/screenshots/
- [ ] Roll number added to slide 1 of the presentation deck
- [ ] Presentation deck slides 2, 4, 6 have screenshots in the frames

## Presentation deck

The deck (`Prompt_Coach_System_Design.pptx`) has 6 slides:

1. **Title** – project name, your name, roll number, course
2. **Problem & Solution** – what problem Prompt Coach solves
3. **Challenges & Decisions** – one real problem you hit and how you solved it
4. **Architecture & Demo** – tech stack diagram + screenshot of the app
5. **Testing & Integrity** – test results and academic-integrity notes
6. **Live Demo & Links** – production URL, GitHub, PR, Vercel screenshots

> Replace slide 3's challenge with a real problem you encountered.  
> Add at least one screenshot to slides 2, 4, and 6 from your deployed project.

## How to present

1. Open the production URL live and run a review on stage.
2. Show the score, issues, and rewritten prompt.
3. Walk through the 6 slides.
4. If asked about tests, run `npm test` and show the 16 passing tests.
5. If asked about AI scores varying, explain that Claude is non-deterministic so scores may differ slightly between runs — this is expected and honest.
