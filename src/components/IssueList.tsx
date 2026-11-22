import {
  AlertTriangle,
  ArrowUpCircle,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { Issue, Severity } from "@/lib/analyzer";

const severityConfig: Record<
  Severity,
  { icon: LucideIcon; bg: string; border: string; text: string; label: string }
> = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    label: "Critical",
  },
  improvement: {
    icon: ArrowUpCircle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    label: "Improve",
  },
  suggestion: {
    icon: Lightbulb,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    label: "Suggestion",
  },
};

interface IssueListProps {
  issues: Issue[];
}

export function IssueList({ issues }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        No issues found. This is a well-structured prompt.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const cfg = severityConfig[issue.severity];
        const Icon = cfg.icon;
        return (
          <div
            key={issue.id}
            className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${cfg.text}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {issue.title}
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.text}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{issue.detail}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
