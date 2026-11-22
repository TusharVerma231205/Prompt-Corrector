import Anthropic from "@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty 'prompt' string is required." });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "API_KEY environment variable is not set. Add it in Vercel Settings → Environment Variables.",
    });
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a prompt engineering expert. Analyze the following prompt and return a JSON object with this exact structure:

{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "issues": [
    { "id": "<short-kebab-id>", "severity": "<critical|improvement|suggestion>", "title": "<short title>", "detail": "<1-2 sentence explanation>" }
  ],
  "breakdown": [
    { "category": "Clarity", "score": <0-25>, "max": 25, "note": "<short note>" },
    { "category": "Specificity", "score": <0-25>, "max": 25, "note": "<short note>" },
    { "category": "Structure", "score": <0-25>, "max": 25, "note": "<short note>" },
    { "category": "Completeness", "score": <0-25>, "max": 25, "note": "<short note>" }
  ],
  "rewrittenPrompt": "<a rewritten, improved version of the prompt>",
  "summary": "<one-sentence summary of the overall quality>"
}

Rules:
- Score must equal Clarity + Specificity + Structure + Completeness.
- Grade: A (90+), B (80-89), C (70-79), D (60-69), F (<60).
- Return ONLY the JSON object, no markdown fences, no commentary.

Prompt to analyze:
"""
${prompt}
"""`,
        },
      ],
    });

    const text = message.content
      .map((block: any) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({
        error: "The AI response was not valid JSON. Try again.",
      });
    }

    // Validate required fields
    if (typeof parsed.score !== "number" || !Array.isArray(parsed.issues)) {
      return res.status(502).json({
        error: "The AI response was missing required fields.",
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(parsed);
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message =
      err?.error?.message ?? err?.message ?? "Unknown error from the AI service.";
    return res.status(status).json({ error: message });
  }
}
