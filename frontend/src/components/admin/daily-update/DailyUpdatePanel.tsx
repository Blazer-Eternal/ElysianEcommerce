import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../../../services/notificationService";
import type { BriefGroup } from "../../../types/dailyBrief.types";
import { BELL_PREVIEW_LIMIT } from "../../../constants/notifications";
import { ROUTES } from "../../../constants/routes";
import {
  BRIEF_SEEN_EVENT,
  GROUP_STYLES,
  isAlertWorthy,
  loadSeenKeys,
  pushDesktopAlert,
  saveSeenKeys,
} from "../../../utils/briefAlert";
import { ArrowRightIcon, CheckIcon } from "../../icons";
import { GROUP_ICONS, timeAgo } from "./briefMeta";

type PreviewItem = {
  entry: BriefGroup["entries"][number];
  group: BriefGroup;
};

/**
 * Admin topbar bell.
 *
 * Opens a compact dropdown capped at `BELL_PREVIEW_LIMIT` entries, the full
 * daily update lives on the Notifications page (sidebar → Notifications),
 * which the footer link points at. Same brief data as before; only the
 * presentation moved out of the slide-in drawer.
 */
export default function DailyUpdatePanel() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [seenKeys, setSeen] = useState<string[]>(() => loadSeenKeys());
  const rootRef = useRef<HTMLDivElement>(null);
  const alertedRef = useRef<Set<string> | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-daily-brief"],
    queryFn: () => notificationService.getDailyBrief(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const groups: BriefGroup[] = useMemo(() => (data?.groups ?? []), [data]);
  const allEntries = useMemo(() => groups.flatMap((g) => g.entries), [groups]);

  /* Flat preview in group order, hard-capped at five. */
  const preview = useMemo<PreviewItem[]>(
    () =>
      groups.flatMap((group) => group.entries.map((entry) => ({ entry, group }))).slice(0, BELL_PREVIEW_LIMIT),
    [groups],
  );

  const unseenCount = useMemo(
    () => allEntries.filter((e) => !seenKeys.includes(e.key)).length,
    [allEntries, seenKeys],
  );

  /* Badge follows the full view's mark-all-read (and other tabs) via storage events. */
  useEffect(() => {
    const sync = () => setSeen(loadSeenKeys());
    window.addEventListener(BRIEF_SEEN_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BRIEF_SEEN_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /* new alert-worthy entries -> desktop notification (silent on first paint) */
  useEffect(() => {
    if (!data) return;
    const keys = allEntries.map((e) => e.key);
    if (alertedRef.current === null) {
      alertedRef.current = new Set(keys); // silent init: never blast on page load/refresh
      return;
    }
    const already = alertedRef.current;
    const fresh = allEntries.filter((e) => isAlertWorthy(e) && !already.has(e.key));
    if (!fresh.length) return;
    keys.forEach((k) => already.add(k));
    fresh.forEach((e) => pushDesktopAlert(`Elysian · ${e.title}`, e.message));
  }, [data, allEntries]);

  /* Close on outside click or Escape so the dropdown never traps the pointer. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const markAllSeen = useCallback(() => {
    setSeen((prev) => {
      const next = [...new Set([...prev, ...allEntries.map((e) => e.key)])];
      saveSeenKeys(next);
      return next;
    });
  }, [allEntries]);

  const openItem = useCallback(
    (item: PreviewItem) => {
      const { entry } = item;
      setSeen((prev) => {
        if (prev.includes(entry.key)) return prev;
        const next = [...prev, entry.key];
        saveSeenKeys(next);
        return next;
      });
      setOpen(false);
      const href = entry.href ?? entry.actions?.[0]?.href;
      if (href) navigate(href);
    },
    [navigate],
  );

  return (
    <div ref={rootRef} className="relative shrink-0">
      {/* bell */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unseenCount > 0 ? `Notifications, ${unseenCount} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="true"
        title="Notifications"
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
          open
            ? "border-brand/40 bg-brand/10 text-brand"
            : "border-sand bg-white text-ink/70 shadow-[0_2px_12px_rgba(61,5,12,0.06)] hover:border-brand/40 hover:text-brand"
        }`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unseenCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_16px_48px_rgba(61,5,12,0.18)] animate-fade-in">
          {/* header */}
          <div className="flex items-start justify-between gap-3 border-b border-sand bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">Notifications</p>
              <p className="text-[11px] text-ink/55">
                {unseenCount > 0
                  ? `${unseenCount} unread update${unseenCount === 1 ? "" : "s"}`
                  : "You are all caught up"}
              </p>
            </div>
            {unseenCount > 0 && (
              <button
                type="button"
                onClick={markAllSeen}
                className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-brand transition-colors hover:bg-brand/10"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* preview list, max BELL_PREVIEW_LIMIT items */}
          {preview.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink/40">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">No updates yet</p>
              <p className="mt-1 text-xs text-ink/55">
                Orders, stock and system updates appear here as they happen.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-cream-deep overflow-y-auto bg-cream/40">
              {preview.map(({ entry, group }) => {
                const seen = seenKeys.includes(entry.key);
                return (
                  <li key={entry.key}>
                    <button
                      type="button"
                      onClick={() => openItem({ entry, group })}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream/70 ${
                        seen ? "bg-white" : "bg-brand/3.5"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${GROUP_STYLES[group.key].iconBg}`}
                      >
                        <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{GROUP_ICONS[group.key]}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start gap-2">
                          <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-ink">
                            {entry.title}
                          </span>
                          {!seen && (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-label="Unread" />
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink/65 line-clamp-2">
                          {entry.message}
                        </span>
                        <span className="mt-1 block text-[11px] text-ink/45">
                          {group.label} · {timeAgo(entry.created_at)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* footer, the only route out to the full daily update */}
          <Link
            to={ROUTES.ADMIN_NOTIFICATIONS}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 border-t border-sand bg-white px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon size={15} />
              View all daily updates
            </span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
