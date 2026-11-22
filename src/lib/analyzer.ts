export type Severity = "critical" | "improvement" | "suggestion";

export interface Issue {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
}

export interface ScoreBreakdown {
  category: string;
  score: number;
  max: number;
  note: string;
}

export interface AnalysisResult {
  score: number;
  grade: string;
  issues: Issue[];
  breakdown: ScoreBreakdown[];
  rewrittenPrompt: string;
  summary: string;
}

const ROLE_HINTS = [
  "act as", "you are", "imagine you are", "pretend you are", "as a",
  "you are an", "you are a", "behave as", "take the role",
];

const FORMAT_HINTS = [
  "format", "bullet", "list", "table", "json", "markdown", "numbered",
  "step by step", "step-by-step", "paragraph", "output", "respond in",
];

const CONSTRAINT_HINTS = [
  "must", "should", "only", "do not", "don't", "avoid", "limit", "max",
  "minimum", "maximum", "at least", "at most", "exactly", "within",
  "between", "no more", "no less", "ensure",
];

const CONTEXT_HINTS = [
  "context", "background", "given that", "assuming", "for a", "for an",
  "audience", "beginner", "expert", "student", "customer", "user is",
  "scenario", "situation", "currently",
];

const EXAMPLE_HINTS = [
  "example", "for instance", "e.g.", "such as", "like this", "sample",
  "illustration", "demonstrate",
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasAny(text: string, hints: string[]): boolean {
  return hints.some((h) => text.includes(h));
}

function countMatches(text: string, hints: string[]): number {
  return hints.filter((h) => text.includes(h)).length;
}

function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function analyzePrompt(rawPrompt: string): AnalysisResult {
  const prompt = rawPrompt.trim();
  const lower = prompt.toLowerCase();
  const words = countWords(prompt);

  const issues: Issue[] = [];

  // --- Clarity (0-25) ---
  let clarity = 25;
  if (words < 5) {
    clarity = 2;
    issues.push({
      id: "clarity-too-short",
      severity: "critical",
      title: "Prompt is too vague",
      detail:
        "Your prompt has fewer than five words. The AI has almost nothing to go on, so the output will be unpredictable. State the task in a complete sentence.",
    });
  } else if (words < 15) {
    clarity -= 12;
    issues.push({
      id: "clarity-short",
      severity: "critical",
      title: "Needs more detail",
      detail:
        "The prompt is brief. Add what the output should contain and who it is for so the AI doesn't have to guess.",
    });
  } else if (words < 30) {
    clarity -= 5;
    issues.push({
      id: "clarity-brief",
      severity: "improvement",
      title: "Could be more specific",
      detail:
        "The prompt is readable but light on detail. Naming the audience, tone, or desired output shape will sharpen the result.",
    });
  }

  // vague filler words
  const vagueWords = ["stuff", "things", "good", "nice", "interesting", "something", "etc"];
  const vagueHits = countMatches(lower, vagueWords);
  if (vagueHits > 0) {
    clarity -= Math.min(8, vagueHits * 4);
    issues.push({
      id: "clarity-vague",
      severity: "improvement",
      title: "Vague words weaken the prompt",
      detail: `Words like "stuff" or "things" don't tell the AI what you actually want. Replace them with concrete nouns.`,
    });
  }

  clarity = Math.max(0, clarity);

  // --- Specificity (0-25) ---
  let specificity = 25;
  if (!hasAny(lower, ROLE_HINTS)) {
    specificity -= 8;
    issues.push({
      id: "spec-role",
      severity: "improvement",
      title: "No role or persona assigned",
      detail:
        "Tell the AI who it should be (e.g., 'You are a senior copywriter'). This anchors the tone and depth of the answer.",
    });
  }
  if (!hasAny(lower, CONSTRAINT_HINTS)) {
    specificity -= 6;
    issues.push({
      id: "spec-constraints",
      severity: "improvement",
      title: "Missing explicit constraints",
      detail:
        "Add limits such as word count, tone, or things to avoid. Constraints keep the output focused.",
    });
  }
  if (!hasAny(lower, CONTEXT_HINTS)) {
    specificity -= 5;
    issues.push({
      id: "spec-context",
      severity: "suggestion",
      title: "No context or audience given",
      detail:
        "Mention who the output is for or what background the AI should assume. Context improves relevance.",
    });
  }
  if (!hasAny(lower, EXAMPLE_HINTS)) {
    specificity -= 4;
    issues.push({
      id: "spec-examples",
      severity: "suggestion",
      title: "No examples provided",
      detail:
        "An example of the style or format you want dramatically improves consistency, especially for complex tasks.",
    });
  }
  specificity = Math.max(0, specificity);

  // --- Structure (0-25) ---
  let structure = 25;
  const sentences = prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length < 2 && words > 15) {
    structure -= 6;
    issues.push({
      id: "structure-run-on",
      severity: "improvement",
      title: "Prompt is one long sentence",
      detail:
        "Break the prompt into separate lines or sentences for the task, context, and format. The AI parses structure better than a wall of text.",
    });
  }
  if (!hasAny(lower, FORMAT_HINTS)) {
    structure -= 8;
    issues.push({
      id: "structure-format",
      severity: "improvement",
      title: "Output format not specified",
      detail:
        "Say whether you want bullet points, a table, JSON, paragraphs, or numbered steps. Without this the AI picks a format you may not want.",
    });
  }
  const hasLineBreaks = prompt.includes("\n");
  if (!hasLineBreaks && words > 25) {
    structure -= 4;
    issues.push({
      id: "structure-linebreaks",
      severity: "suggestion",
      title: "Consider line breaks",
      detail:
        "Long prompts are easier for the AI to follow when the task, context, and format each sit on their own line.",
    });
  }
  structure = Math.max(0, structure);

  // --- Completeness (0-25) ---
  let completeness = 25;
  const hasTaskVerb = /\b(write|create|generate|explain|summarize|analyze|design|build|draft|outline|describe|review|compare|translate|convert|rewrite|list|plan)\b/.test(
    lower
  );
  if (!hasTaskVerb) {
    completeness -= 10;
    issues.push({
      id: "complete-task",
      severity: "critical",
      title: "No clear task verb",
      detail:
        "Start with an action verb (write, summarize, analyze…). Without one the AI doesn't know what to produce.",
    });
  }
  if (words < 20) {
    completeness -= 8;
    issues.push({
      id: "complete-thin",
      severity: "improvement",
      title: "Prompt is underdeveloped",
      detail:
        "Aim for at least 20–40 words covering the task, audience, and desired output. Thin prompts get generic answers.",
    });
  }
  // ambiguity check
  if (/\b(maybe|perhaps|kind of|sort of|probably|might)\b/.test(lower)) {
    completeness -= 5;
    issues.push({
      id: "complete-hedging",
      severity: "suggestion",
      title: "Hedging language adds ambiguity",
      detail:
        "Words like 'maybe' or 'perhaps' make the instruction uncertain. Use direct, confident verbs.",
    });
  }
  completeness = Math.max(0, completeness);

  // --- Aggregate ---
  const score = clarity + specificity + structure + completeness;
  const grade = gradeFromScore(score);

  const breakdown: ScoreBreakdown[] = [
    { category: "Clarity", score: clarity, max: 25, note: "Is the task stated plainly?" },
    { category: "Specificity", score: specificity, max: 25, note: "Role, constraints, context, examples" },
    { category: "Structure", score: structure, max: 25, note: "Format and organization" },
    { category: "Completeness", score: completeness, max: 25, note: "Clear task verb and depth" },
  ];

  const summary = buildSummary(score, issues);
  const rewrittenPrompt = rewritePrompt(prompt, lower, {
    hasRole: hasAny(lower, ROLE_HINTS),
    hasFormat: hasAny(lower, FORMAT_HINTS),
    hasContext: hasAny(lower, CONTEXT_HINTS),
    hasConstraints: hasAny(lower, CONSTRAINT_HINTS),
    hasExamples: hasAny(lower, EXAMPLE_HINTS),
    hasTaskVerb,
    words,
  });

  // sort issues: critical > improvement > suggestion
  const order: Record<Severity, number> = { critical: 0, improvement: 1, suggestion: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);

  return { score, grade, issues, breakdown, rewrittenPrompt, summary };
}

function buildSummary(score: number, issues: Issue[]): string {
  const criticals = issues.filter((i) => i.severity === "critical").length;
  if (score >= 85) {
    return "Strong prompt. Minor tweaks could make it even more reliable.";
  }
  if (score >= 65) {
    return `Decent prompt with ${issues.length} area${issues.length === 1 ? "" : "s"} to improve.`;
  }
  if (criticals > 0) {
    return `This prompt has ${criticals} critical issue${criticals === 1 ? "" : "s"} that will likely produce poor output. Fix those first.`;
  }
  return "This prompt needs work across several areas before it will give consistent results.";
}

interface RewriteFlags {
  hasRole: boolean;
  hasFormat: boolean;
  hasContext: boolean;
  hasConstraints: boolean;
  hasExamples: boolean;
  hasTaskVerb: boolean;
  words: number;
}

function rewritePrompt(original: string, lower: string, flags: RewriteFlags): string {
  const parts: string[] = [];

  // Role
  if (!flags.hasRole) {
    parts.push("You are an expert assistant with deep knowledge of the topic below.");
  }

  // Task
  if (!flags.hasTaskVerb) {
    parts.push(`Provide a clear, well-structured response to the following request:\n\n"${original}"`);
  } else {
    parts.push(`Task:\n${original}`);
  }

  // Context
  if (!flags.hasContext) {
    parts.push("Context: The audience is a general reader who needs accurate, practical information.");
  }

  // Constraints
  if (!flags.hasConstraints) {
    parts.push("Constraints:\n- Keep the response concise (150–300 words).\n- Use a professional, friendly tone.\n- Avoid jargon unless you define it.");
  }

  // Format
  if (!flags.hasFormat) {
    parts.push("Format: Use bullet points or short paragraphs with a brief summary at the end.");
  }

  // Examples
  if (!flags.hasExamples) {
    parts.push('Example of the desired style: "Here are three key points to consider…"\n(Adjust the example to match your actual task.)');
  }

  return parts.join("\n\n");
}

// Client function that calls the Vercel API route for an AI-powered review.
// Falls back to the local heuristic analyzer if the API is unavailable.
export async function analyzeWithAI(prompt: string): Promise<AnalysisResult> {
  const local = analyzePrompt(prompt);

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      return local;
    }

    const data = await res.json();
    if (data && typeof data.score === "number" && Array.isArray(data.issues)) {
      return data as AnalysisResult;
    }
    return local;
  } catch {
    return local;
  }
}
