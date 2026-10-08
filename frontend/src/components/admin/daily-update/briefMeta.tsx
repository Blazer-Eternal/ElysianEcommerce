import type { BriefEntry, BriefGroupKey } from "../../../types/dailyBrief.types";

/** Header filter tabs on the full daily-update view. */
export type Filter = "all" | "action" | "fyi";

/** Left-edge colour of an entry card, by severity. */
export const SEVERITY_DOT: Record<BriefEntry["severity"], string> = {
  critical: "bg-teal-500",
  warning: "bg-gold",
  success: "bg-emerald-500",
  info: "bg-emerald-500",
};

/** Badge copy per severity (rendered uppercase). */
export const SEVERITY_LABEL: Record<BriefEntry["severity"], string> = {
  critical: "Action required",
  warning: "Needs attention",
  success: "Good news",
  info: "For your info",
};

/** Compact relative timestamp for brief entries (1d ago, 2h ago, …). */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff) || diff < 0) return "";
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** One glyph per brief group; paired with GROUP_STYLES tints. */
export const GROUP_ICONS: Record<BriefGroupKey, React.ReactNode> = {
  sales: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 16-9 5-9-5V8l9-5 9 5v8z" />
      <path d="m3.3 7.3 8.7 4.9 8.7-4.9M12 22V12.2" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.4-9 8.38 8.38 0 0 1 8.6 8.6z" />
    </svg>
  ),
  shipping: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v3a1 1 0 0 0 1 1h2l3 5h2v-5.5L18 15V6l-8 3H4a1 1 0 0 0-1 1v2zM18 8a4 4 0 0 1 0 6" />
    </svg>
  ),
};
