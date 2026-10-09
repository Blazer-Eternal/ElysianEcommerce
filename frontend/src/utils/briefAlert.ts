import type { BriefGroupKey, BriefSeverity } from "../types/dailyBrief.types";

/**
 * Colour vocabulary for the Daily Update view.
 *
 * green = something good happened, amber = look soon, red = money/customer on
 * the line, slate = context only. Classes are canonical Tailwind tokens.
 */
export const SEVERITY_STYLES: Record<
  BriefSeverity,
  { dot: string; pill: string; ring: string; border: string; bg: string; card: string }
> = {
  critical: {
    dot: "bg-teal-500",
    pill: "bg-teal-50 text-teal-700",
    ring: "ring-teal-500/25",
    border: "border-teal-500/35",
    bg: "bg-teal-50/50",
    card: "border-teal-500/35 bg-teal-50/50",
  },
  warning: {
    dot: "bg-gold",
    pill: "bg-gold/15 text-gold-dark",
    ring: "ring-gold/30",
    border: "border-gold/45",
    bg: "bg-gold/8",
    card: "border-gold/45 bg-gold/8",
  },
  success: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-500/25",
    border: "border-emerald-500/30",
    bg: "bg-emerald-50/40",
    card: "border-sand bg-white",
  },
  info: {
    dot: "bg-emerald-500",
    pill: "bg-sand text-ink/60",
    ring: "ring-ink/10",
    border: "border-sand",
    bg: "bg-white",
    card: "border-sand bg-white",
  },
};

/** Per-group header/icon tints for the drawer. */
export const GROUP_STYLES: Record<BriefGroupKey, { iconBg: string; text: string }> = {
  sales: { iconBg: "bg-emerald-500/10 text-emerald-700", text: "text-emerald-700" },
  inventory: { iconBg: "bg-gold/15 text-gold-dark", text: "text-gold-dark" },
  support: { iconBg: "bg-brand/10 text-brand", text: "text-brand" },
  shipping: { iconBg: "bg-cyan-100 text-cyan-700", text: "text-cyan-700" },
  system: { iconBg: "bg-slate-500/10 text-slate-600", text: "text-slate-600" },
  marketing: { iconBg: "bg-rose/25 text-brand", text: "text-brand" },
};

const READ_KEY = "elysian_admin_brief_read";
/** Bound so the read ledger never grows without limit. */
const READ_CAP = 500;

/**
 * Window event fired whenever the seen-keys ledger is written, so the topbar
 * bell badge and the full Notifications view stay in step without props.
 */
export const BRIEF_SEEN_EVENT = "elysian:brief-seen-changed";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

/** Entry keys this admin has already had a chance to read. */
export const loadSeenKeys = (): string[] => readJson<string[]>(READ_KEY, []);

export const saveSeenKeys = (keys: string[]): void => {
  const list = keys.slice(-READ_CAP);
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — the view simply re-prompts next visit */
  }
  if (typeof window !== "undefined") {
    // Deferred: this can run inside a state updater (render phase), and the
    // listeners setState on sibling components — never do that mid-render.
    queueMicrotask(() => window.dispatchEvent(new Event(BRIEF_SEEN_EVENT)));
  }
};

/**
 * Only new orders and a dead storefront earn a desktop alert — a single vendor
 * can miss a low-stock nudge, but not a sale going through or the site falling
 * over. Takes the whole entry so the key can carry the intent.
 */
export const isAlertWorthy = (entry: { key: string; severity: BriefSeverity }): boolean =>
  entry.key.startsWith("order-new:") ||
  entry.key.startsWith("order-vip:") ||
  (entry.key === "sys:storefront" && entry.severity === "critical") ||
  (entry.key === "sys:database" && entry.severity === "critical");

/** Best-effort desktop notification; silently does nothing when unsupported. */
export const pushDesktopAlert = (title: string, body: string): void => {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag: "elysian-daily-update" });
  } catch {
    /* some browsers throw for non-service-worker notifications */
  }
};
