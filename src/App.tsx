import { useState } from "react";
import { BrainCircuit, Loader2, Sparkles, Zap } from "lucide-react";
import { analyzePrompt, analyzeWithAI, type AnalysisResult } from "@/lib/analyzer";
import { ScoreGauge } from "@/components/ScoreGauge";
import { BreakdownBars } from "@/components/BreakdownBars";
import { IssueList } from "@/components/IssueList";
import { RewrittenPrompt } from "@/components/RewrittenPrompt";

type Mode = "heuristic" | "ai";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("heuristic");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt to analyze.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res =
        mode === "ai" ? await analyzeWithAI(prompt) : analyzePrompt(prompt);
      setResult(res);
    } catch {
      setError("Something went wrong while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                Prompt Coach
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Score, diagnose, and improve your prompts
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Intro */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Get your prompt scored in seconds
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Paste any prompt below. Prompt Coach rates it out of 100, lists what
            to fix, and writes an improved version you can copy.
          </p>
        </div>

        {/* Input card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <label
            htmlFor="prompt-input"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Your prompt
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Write a blog intro about electric cars"
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:outline-none resize-y transition-colors"
          />

          {/* Mode toggle + analyze button */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setMode("heuristic")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === "heuristic"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                Instant
              </button>
              <button
                onClick={() => setMode("ai")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === "ai"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Review
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze prompt
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <p className="mt-3 text-xs text-slate-400">
            Tip: press Ctrl/Cmd + Enter to analyze.
          </p>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            {/* Left: Score + breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center">
                <ScoreGauge score={result.score} grade={result.grade} />
                <p className="mt-4 text-center text-sm text-slate-600">
                  {result.summary}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Score breakdown
                </h3>
                <BreakdownBars breakdown={result.breakdown} />
              </div>
            </div>

            {/* Right: Issues + rewrite */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    What to fix
                  </h3>
                  <span className="text-xs text-slate-400">
                    {result.issues.length} issue
                    {result.issues.length === 1 ? "" : "s"}
                  </span>
                </div>
                <IssueList issues={result.issues} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <RewrittenPrompt text={result.rewrittenPrompt} />
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          Prompt Coach &middot; Capstone project for Prompt Engineering course
        </footer>
      </main>
    </div>
  );
}
