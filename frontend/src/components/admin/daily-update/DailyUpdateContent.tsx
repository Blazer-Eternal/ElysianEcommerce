import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../../services/notificationService";
import type { BriefAction, BriefEntry, BriefGroup } from "../../../types/dailyBrief.types";
import {
  BRIEF_SEEN_EVENT,
  GROUP_STYLES,
  SEVERITY_STYLES,
  loadSeenKeys,
  pushDesktopAlert,
  saveSeenKeys,
} from "../../../utils/briefAlert";
import { GROUP_ICONS, SEVERITY_DOT, SEVERITY_LABEL, timeAgo, type Filter } from "./briefMeta";

/* ------------------------------------------------------------------ */
/* entry card                                                          */
/* ------------------------------------------------------------------ */

function BriefEntryCard({
  entry,
  seen,
  onSeen,
  onAction,
}: {
  entry: BriefEntry;
  seen: boolean;
  onSeen: () => void;
  onAction: (action: BriefAction) => void;
}) {
  const sev = SEVERITY_STYLES[entry.severity];
  const actions = entry.actions ?? [];
  const hasActions = actions.length > 0 || !!entry.href;

  return (
    <article
      onMouseEnter={onSeen}
      className={`group relative rounded-xl border px-4 py-3.5 transition ${
        seen ? "border-sand bg-white opacity-75" : `${sev.border} ${sev.bg}`
      }`}
    >
      {/* severity strip */}
      <span
        className={`absolute top-3.5 bottom-3.5 left-0 w-1 rounded-full ${SEVERITY_DOT[entry.severity]}`}
        aria-hidden
      />
      <div className="pl-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase ${sev.pill} ring-1 ${sev.ring}`}
              >
                {SEVERITY_LABEL[entry.severity]}
              </span>
              {!seen && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-label="Unread" />
              )}
            </div>
            <h4 className="mt-1.5 text-sm font-bold text-ink">{entry.title}</h4>
            <p className="mt-0.5 text-[13px] leading-relaxed wrap-break-word text-ink/65">{entry.message}</p>
          </div>
          <span className="shrink-0 text-[11px] font-medium whitespace-nowrap text-ink/40">
            {timeAgo(entry.created_at)}
          </span>
        </div>

        {hasActions && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Link
              to={entry.href ?? actions[0].href}
              onClick={onSeen}
              className="rounded-lg bg-ink px-3 py-1.5 text-[11px] font-bold tracking-widest text-cream uppercase transition hover:bg-ink/85"
            >
              {actions[0]?.label ?? "Open"}
            </Link>
            {actions.slice(1).map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onAction(action)}
                className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest text-ink/70 uppercase transition hover:border-ink/35 hover:text-ink"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* full daily-update view (admin sidebar → Notifications)              */
/* ------------------------------------------------------------------ */

export default function DailyUpdateContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<Filter>("all");
  const [seenKeys, setSeen] = useState<string[]>(() => loadSeenKeys());
  const [note, setNote] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );
  const noteTimer = useRef<number | null>(null);
  const autoSeenRef = useRef(false);

  /* tiny inline status line above the footer (no global toast system here) */
  const flashNote = useCallback((message: string) => {
    setNote(message);
    if (noteTimer.current) window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setNote(null), 3500);
  }, []);

  useEffect(
    () => () => {
      if (noteTimer.current) window.clearTimeout(noteTimer.current);
    },
    [],
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-daily-brief"],
    queryFn: () => notificationService.getDailyBrief(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const groups: BriefGroup[] = useMemo(() => (data?.groups ?? []), [data]);
  const allEntries = useMemo(() => groups.flatMap((g) => g.entries), [groups]);
  const actionEntries = useMemo(() => allEntries.filter((e) => e.action_required), [allEntries]);

  /* Arriving at the full view counts as reading it — same as when the old
     drawer opened: the bell badge clears once the admin has landed here. */
  const markAllSeen = useCallback(() => {
    setSeen((prev) => {
      const next = [...new Set([...prev, ...allEntries.map((e) => e.key)])];
      saveSeenKeys(next);
      return next;
    });
  }, [allEntries]);

  useEffect(() => {
    if (autoSeenRef.current || allEntries.length === 0) return;
    autoSeenRef.current = true;
    markAllSeen();
  }, [allEntries, markAllSeen]);

  /* Stay in sync when the topbar bell dropdown marks entries read. */
  useEffect(() => {
    const sync = () => setSeen(loadSeenKeys());
    window.addEventListener(BRIEF_SEEN_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BRIEF_SEEN_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleAction = useCallback(
    (action: BriefAction) => {
      if (action.href) {
        navigate(action.href);
        return;
      }
      flashNote("Refreshing live data…");
      queryClient.invalidateQueries();
      void refetch();
    },
    [navigate, queryClient, refetch, flashNote],
  );

  const enableDesktopAlerts = useCallback(() => {
    if (typeof Notification === "undefined") return;
    void Notification.requestPermission()
      .then((perm) => {
        setPermission(perm);
        if (perm === "granted") {
          flashNote("Desktop alerts enabled.");
          pushDesktopAlert("Elysian desktop alerts", "You will be notified of new orders and critical events.");
        } else {
          flashNote("Desktop alerts were not granted by the browser.");
        }
      })
      .catch(() => flashNote("Could not request desktop alert permission."));
  }, [flashNote]);

  const filteredGroups = useMemo(() => {
    if (filter === "all") return groups;
    return groups
      .map((g) => ({
        ...g,
        entries:
          filter === "action"
            ? g.entries.filter((e) => e.action_required)
            : g.entries.filter((e) => !e.action_required),
      }))
      .filter((g) => g.entries.length > 0);
  }, [groups, filter]);

  const hasAny = allEntries.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-cream shadow-[0_4px_24px_rgba(61,5,12,0.06)]">
      {/* header */}
      <header className="border-b border-sand bg-white px-5 pt-5 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] text-brand uppercase">
              Admin · Daily Update
            </p>
            <h2 className="mt-1 font-serif text-2xl text-ink">Notifications</h2>
            <p className="mt-0.5 text-xs text-ink/50">
              {isLoading
                ? "Syncing live data…"
                : `${actionEntries.length} action required · ${allEntries.length - actionEntries.length} for your info`}
            </p>
          </div>
        </div>

        {/* filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "action" as Filter, label: "Action required", count: actionEntries.length, danger: true },
              { id: "fyi" as Filter, label: "For your info", count: allEntries.length - actionEntries.length },
              { id: "all" as Filter, label: "All", count: allEntries.length },
            ]
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase transition ${
                  active
                    ? "border-ink bg-ink text-cream"
                    : "border-sand bg-white text-ink/55 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                    active
                      ? "bg-cream/20 text-cream"
                      : tab.danger && tab.count > 0
                        ? "bg-teal-500 text-white"
                        : "bg-sand text-ink/60"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={markAllSeen}
            className="ml-auto text-[11px] font-bold tracking-widest text-brand uppercase transition hover:text-brand-dark"
          >
            Mark all read
          </button>
        </div>

        {permission !== "granted" && permission !== "unsupported" && (
          <button
            type="button"
            onClick={enableDesktopAlerts}
            className="mt-3 w-full rounded-lg border border-gold/50 bg-gold/10 px-3 py-2 text-[11px] font-bold tracking-[0.12em] text-gold-dark uppercase transition hover:bg-gold/20"
          >
            Enable desktop alerts
          </button>
        )}
      </header>

      {/* body */}
      <div className="px-5 py-4 sm:px-6">
        {isLoading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-sand/60" />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-xl border border-teal-500/30 bg-teal-50 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-teal-700">Could not load the daily update.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-[11px] font-bold tracking-[0.14em] text-white uppercase hover:bg-teal-700"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && !hasAny && (
          <div className="flex flex-col items-center py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-sand">
              <svg className="h-6 w-6 text-ink/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            <p className="mt-4 font-serif text-lg text-ink">All caught up</p>
            <p className="mt-1 max-w-65 text-sm text-ink/50">
              No alerts right now. Sales, stock, support and system status appear here as they happen.
            </p>
          </div>
        )}

        {!isLoading && !isError && hasAny && (
          <div className="space-y-6">
            {filteredGroups.map((group) => {
              const gs = GROUP_STYLES[group.key];
              return (
                <section key={group.key}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${gs.iconBg}`}>
                      <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{GROUP_ICONS[group.key]}</span>
                    </span>
                    <h3 className="text-[11px] font-bold tracking-[0.2em] text-ink/70 uppercase">
                      {group.label}
                    </h3>
                    <span className="h-px flex-1 bg-sand" />
                    <span className="text-[11px] font-semibold text-ink/40">{group.entries.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {group.entries.map((entry) => (
                      <BriefEntryCard
                        key={entry.key}
                        entry={entry}
                        seen={seenKeys.includes(entry.key)}
                        onSeen={() =>
                          setSeen((prev) => {
                            if (prev.includes(entry.key)) return prev;
                            const next = [...prev, entry.key];
                            saveSeenKeys(next);
                            return next;
                          })
                        }
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
            {filteredGroups.length === 0 && (
              <p className="py-8 text-center text-sm text-ink/45">
                Nothing in this filter right now.
              </p>
            )}
          </div>
        )}
      </div>

      {/* footer */}
      <footer className="border-t border-sand bg-white px-5 py-3 sm:px-6">
        {note && (
          <p className="mb-2 rounded-lg bg-brand/5 px-3 py-2 text-[11px] font-semibold text-brand">
            {note}
          </p>
        )}
        <div className="flex items-center justify-between text-[11px] text-ink/45">
          <span>Auto-refreshes every minute</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 font-bold tracking-widest text-ink/60 uppercase transition hover:text-ink"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
            Refresh now
          </button>
        </div>
      </footer>
    </div>
  );
}
