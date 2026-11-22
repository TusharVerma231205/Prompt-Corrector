import { describe, it, expect } from "vitest";
import { analyzePrompt } from "@/lib/analyzer";

describe("analyzePrompt – basic scoring", () => {
  it("returns a score between 0 and 100", () => {
    const result = analyzePrompt("Write a summary of climate change for students.");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("produces a valid letter grade", () => {
    const result = analyzePrompt("Explain quantum computing in simple terms.");
    expect(["A", "B", "C", "D", "F"]).toContain(result.grade);
  });

  it("always returns exactly four breakdown categories", () => {
    const result = analyzePrompt("test prompt");
    expect(result.breakdown).toHaveLength(4);
    expect(result.breakdown.map((b) => b.category)).toEqual([
      "Clarity",
      "Specificity",
      "Structure",
      "Completeness",
    ]);
  });

  it("breakdown scores sum to the total score", () => {
    const result = analyzePrompt("Write a blog post about AI for beginners. Format as bullet points. You are an expert writer. Context: audience is high school students. Do not use jargon.");
    const sum = result.breakdown.reduce((acc, b) => acc + b.score, 0);
    expect(sum).toBe(result.score);
  });
});

describe("analyzePrompt – weak prompts", () => {
  it("scores a one-word prompt very low", () => {
    const result = analyzePrompt("Hello");
    expect(result.score).toBeLessThan(30);
  });

  it("flags a too-short prompt as critical", () => {
    const result = analyzePrompt("Write stuff");
    const critical = result.issues.find((i) => i.severity === "critical");
    expect(critical).toBeDefined();
  });

  it("flags missing task verb as critical", () => {
    const result = analyzePrompt("This is a very interesting topic about space exploration and the future of humanity among the stars.");
    expect(result.issues.some((i) => i.id === "complete-task")).toBe(true);
  });

  it("penalizes vague words like 'stuff' and 'things'", () => {
    const result = analyzePrompt("Write about things and stuff for a blog. You are a writer. Format as bullet points. Context: for beginners. Do not use jargon. Provide an example.");
    const vague = result.issues.find((i) => i.id === "clarity-vague");
    expect(vague).toBeDefined();
  });
});

describe("analyzePrompt – strong prompts", () => {
  it("scores a well-structured prompt above 70", () => {
    const good = `You are an expert copywriter.
Write a 200-word blog intro about electric vehicles for a general audience.
Context: readers are new to EVs and skeptical about range.
Format: two short paragraphs, professional tone.
Constraints: do not use jargon, must include a hook sentence.`;
    const result = analyzePrompt(good);
    expect(result.score).toBeGreaterThan(70);
  });

  it("does not flag missing role when role is present", () => {
    const result = analyzePrompt("You are a teacher. Write a lesson plan about fractions for 3rd graders. Format as bullet points. Context: beginners. Do not exceed 300 words. Provide an example.");
    expect(result.issues.some((i) => i.id === "spec-role")).toBe(false);
  });

  it("does not flag missing format when format is present", () => {
    const result = analyzePrompt("You are a teacher. Write a lesson plan about fractions for 3rd graders in bullet point format. Context: beginners. Do not exceed 300 words. Provide an example.");
    expect(result.issues.some((i) => i.id === "structure-format")).toBe(false);
  });

  it("generates a rewritten prompt that is longer than a short original", () => {
    const original = "Write a poem";
    const result = analyzePrompt(original);
    expect(result.rewrittenPrompt.length).toBeGreaterThan(original.length);
  });
});

describe("analyzePrompt – issues and rewrite", () => {
  it("sorts issues with critical before suggestion", () => {
    const result = analyzePrompt("Write");
    const firstCritical = result.issues.findIndex((i) => i.severity === "critical");
    const lastSuggestion = result.issues.length - 1 - result.issues.reverse().findIndex((i) => i.severity === "suggestion");
    result.issues.reverse();
    if (firstCritical !== -1 && lastSuggestion !== -1) {
      expect(firstCritical).toBeLessThan(lastSuggestion);
    }
  });

  it("always includes a non-empty summary", () => {
    const result = analyzePrompt("Write a recipe for pancakes.");
    expect(result.summary.length).toBeGreaterThan(10);
  });

  it("rewritten prompt includes a role when original lacks one", () => {
    const result = analyzePrompt("Write a 200-word essay about the ocean. Format as paragraphs. Context: for kids. Do not use big words. Provide an example.");
    expect(result.rewrittenPrompt.toLowerCase()).toContain("you are");
  });

  it("rewritten prompt includes format guidance when original lacks it", () => {
    const result = analyzePrompt("Write about the ocean. You are a marine biologist. Context: for kids. Do not use big words. Provide an example.");
    expect(result.rewrittenPrompt.toLowerCase()).toContain("format");
  });
});
