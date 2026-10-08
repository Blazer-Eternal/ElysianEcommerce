import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import { formatDateTime } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  getCannedReplies,
  removeCannedReply,
  saveCannedReply,
  type CannedReply,
} from "../../../utils/cannedReplies";
import { ROUTES } from "../../../constants/routes";
import { TAG_OPTIONS, tagLabel, tagStyle } from "./messageTags";
import type { Message, MessageTag } from "../../../types/message.types";

interface MessageThreadDrawerProps {
  message: Message;
  onClose: () => void;
}

/**
 * "View & Reply" side panel: the full thread, the sender's account and their
 * recent orders (real rows from `GET /messages/:id/context`), plus a reply box
 * with canned answers. Portalled to <body> so the admin layout's paint
 * containment cannot clip it.
 */
const MessageThreadDrawer = ({ message, onClose }: MessageThreadDrawerProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [reply, setReply] = useState(message.reply ?? "");
  const [canned, setCanned] = useState<CannedReply[]>(() => getCannedReplies());
  const [cannedOpen, setCannedOpen] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const { data: context, isLoading: contextLoading } = useQuery({
    queryKey: ["admin", "messages", "context", message._id],
    queryFn: ({ signal }) => messageService.getContext(message._id, { signal }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
  };

  const replyMutation = useMutation({
    mutationFn: (body: string) => messageService.update(message._id, { reply: body }),
    onSuccess: () => {
      invalidate();
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    },
    onError: (err) => setLocalError(getErrorMessage(err)),
  });

  const tagMutation = useMutation({
    mutationFn: (tag: MessageTag) => messageService.update(message._id, { tag }),
    onSuccess: invalidate,
    onError: (err) => setLocalError(getErrorMessage(err)),
  });

  const archiveMutation = useMutation({
    mutationFn: (archived: boolean) => messageService.update(message._id, { archived }),
    onSuccess: () => {
      invalidate();
      onClose();
    },
    onError: (err) => setLocalError(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => messageService.remove(message._id),
    onSuccess: () => {
      invalidate();
      onClose();
    },
    onError: (err) => setLocalError(getErrorMessage(err)),
  });

  // Escape closes; body scroll is locked while the panel is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const statusPill = useMemo(() => {
    if (message.archived) return { label: "Archived", className: "bg-slate-500/10 text-slate-600" };
    if (message.replied_at || message.reply)
      return { label: "Replied", className: "bg-emerald-500/10 text-emerald-700" };
    if (!message.is_read) return { label: "Unread", className: "bg-teal-500/10 text-teal-700" };
    return { label: "Read", className: "bg-sand text-ink/60" };
  }, [message]);

  const applyCanned = (item: CannedReply) => {
    setReply(item.body);
    setCannedOpen(false);
    setLocalError(null);
  };

  const handleSaveCanned = () => {
    if (!saveLabel.trim() || !reply.trim()) return;
    setCanned(saveCannedReply(saveLabel, reply));
    setSaveLabel("");
    setShowSaveForm(false);
  };

  const trimmedReply = reply.trim();

  return createPortal(
    <div className="fixed inset-0 z-90">
      <div
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label={`Message from ${message.name}`}
        className="absolute top-0 right-0 flex h-full w-full max-w-140 flex-col bg-cream shadow-[0_0_60px_rgba(61,5,12,0.35)]"
      >
        {/* Header */}
        <header className="shrink-0 border-b border-sand bg-white px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase ${statusPill.className}`}>
                  {statusPill.label}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase ${tagStyle(message.tag)}`}>
                  {tagLabel(message.tag)}
                </span>
              </div>
              <h2 className="mt-2 font-serif text-xl leading-snug wrap-break-word text-ink">
                {message.subject}
              </h2>
              <p className="mt-1 text-xs text-ink/50">{formatDateTime(message.created_at)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand bg-white text-ink/60 transition hover:text-ink"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Topic switch */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[10px] font-bold tracking-[0.14em] text-ink/40 uppercase">Topic</span>
            {TAG_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => tagMutation.mutate(option.value)}
                disabled={tagMutation.isPending}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  message.tag === option.value
                    ? "bg-ink text-cream"
                    : "border border-sand bg-white text-ink/55 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {/* The message itself */}
          <section className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {message.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{message.name}</p>
                <a
                  href={`mailto:${message.email}`}
                  className="truncate text-xs text-brand hover:underline"
                >
                  {message.email}
                </a>
              </div>
            </div>
            {message.phone && (
              <p className="mt-3 text-xs text-ink/55">
                <span className="font-semibold text-ink/70">Phone:</span> {message.phone}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/75">
              {message.message}
            </p>
          </section>

          {/* Sender's account + recent orders */}
          <section className="rounded-xl border border-sand bg-white p-4">
            <h3 className="text-[11px] font-bold tracking-[0.16em] text-ink/55 uppercase">
              Customer context
            </h3>

            {contextLoading && <p className="mt-3 text-sm text-ink/45">Loading customer…</p>}

            {!contextLoading && context && !context.customer && (
              <p className="mt-3 text-sm text-ink/55">
                No registered account matches {message.email}, so there are no orders to pull up
                for this sender.
              </p>
            )}

            {!contextLoading && context?.customer && (
              <>
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-cream-deep/60 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{context.customer.name}</p>
                    <p className="truncate text-xs text-ink/55">
                      {context.customer.role}
                      {context.customer.phone ? ` · ${context.customer.phone}` : ""}
                    </p>
                  </div>
                  <Link
                    to={ROUTES.ADMIN_USERS}
                    onClick={onClose}
                    className="shrink-0 text-[11px] font-bold tracking-widest text-brand uppercase hover:underline"
                  >
                    All users
                  </Link>
                </div>

                <h4 className="mt-4 text-[11px] font-bold tracking-[0.16em] text-ink/55 uppercase">
                  Recent orders ({context.orders.length})
                </h4>

                {context.orders.length === 0 ? (
                  <p className="mt-2 text-sm text-ink/50">This customer has no orders yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {context.orders.map((order) => (
                      <li key={order._id}>
                        <Link
                          to={ROUTES.ADMIN_ORDER_DETAIL(order._id)}
                          onClick={onClose}
                          className="block rounded-lg border border-sand px-3 py-2.5 transition hover:border-brand/40 hover:bg-brand/5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-xs font-bold text-ink">
                              {order.order_number}
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-brand">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/55">
                            <span className="rounded-full bg-sand px-2 py-0.5 font-semibold uppercase">
                              {order.status}
                            </span>
                            <span>{formatDateTime(order.created_at)}</span>
                          </div>
                          <p className="mt-1 truncate text-[11px] text-ink/50">
                            {order.items
                              .map((item) => `${item.product_name} ×${item.quantity}`)
                              .join(", ")}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {/* Reply */}
          <section className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[11px] font-bold tracking-[0.16em] text-ink/55 uppercase">
                Reply
              </h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCannedOpen((open) => !open)}
                  className="rounded-lg border border-sand px-2.5 py-1.5 text-[11px] font-bold tracking-widest text-ink/60 uppercase transition hover:border-ink/30 hover:text-ink"
                >
                  Quick replies
                </button>
                {cannedOpen && (
                  <div className="absolute right-0 z-20 mt-1.5 w-72 rounded-xl border border-sand bg-white p-1.5 shadow-[0_16px_40px_rgba(61,5,12,0.18)]">
                    {canned.map((item) => (
                      <div key={item.id} className="group flex items-start gap-1">
                        <button
                          type="button"
                          onClick={() => applyCanned(item)}
                          className="flex-1 rounded-lg px-3 py-2 text-left transition hover:bg-brand/5"
                        >
                          <span className="block text-xs font-bold text-ink">{item.label}</span>
                          <span className="mt-0.5 block truncate text-[11px] text-ink/50">
                            {item.body}
                          </span>
                        </button>
                        {item.id.startsWith("custom-") && (
                          <button
                            type="button"
                            aria-label={`Delete ${item.label}`}
                            onClick={() => setCanned(removeCannedReply(item.id))}
                            className="mt-1.5 mr-1 rounded p-1 text-ink/35 opacity-0 transition hover:text-teal-600 group-hover:opacity-100"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {canned.length === 0 && (
                      <p className="px-3 py-2 text-xs text-ink/50">No saved replies yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                setLocalError(null);
              }}
              rows={5}
              maxLength={2000}
              placeholder="Write your reply to this customer…"
              className="mt-3 w-full resize-none rounded-lg border border-sand bg-cream/60 px-3.5 py-3 text-sm text-ink placeholder-ink/40 transition focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:outline-none"
            />

            <div className="mt-1 flex items-center justify-between text-[11px] text-ink/40">
              <span>{reply.length}/2000</span>
              {savedFlash && <span className="font-semibold text-emerald-700">Reply saved.</span>}
            </div>

            {localError && <p className="mt-2 text-xs font-semibold text-teal-600">{localError}</p>}

            {showSaveForm ? (
              <div className="mt-3 flex gap-2">
                <input
                  value={saveLabel}
                  onChange={(e) => setSaveLabel(e.target.value)}
                  placeholder="Name this reply"
                  maxLength={60}
                  className="min-w-0 flex-1 rounded-lg border border-sand bg-white px-3 py-2 text-xs text-ink placeholder-ink/40 focus:border-brand/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveCanned}
                  className="rounded-lg bg-ink px-3 py-2 text-[11px] font-bold tracking-widest text-cream uppercase hover:bg-ink/85"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveForm(false)}
                  className="rounded-lg border border-sand px-3 py-2 text-[11px] font-bold tracking-widest text-ink/55 uppercase hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => replyMutation.mutate(trimmedReply)}
                  disabled={replyMutation.isPending || !trimmedReply}
                  className="rounded-lg bg-brand px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {replyMutation.isPending ? "Saving…" : message.reply ? "Update reply" : "Send reply"}
                </button>
                {reply !== (message.reply ?? "") && (
                  <button
                    type="button"
                    onClick={() => setReply(message.reply ?? "")}
                    className="rounded-lg border border-sand px-3 py-2 text-[11px] font-bold tracking-widest text-ink/55 uppercase transition hover:text-ink"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowSaveForm(true)}
                  className="rounded-lg border border-sand px-3 py-2 text-[11px] font-bold tracking-widest text-ink/55 uppercase transition hover:text-ink"
                >
                  Save as quick reply
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Footer actions */}
        <footer className="shrink-0 border-t border-sand bg-white px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => archiveMutation.mutate(!message.archived)}
                disabled={archiveMutation.isPending}
                className="rounded-lg border border-sand px-3 py-2 text-[11px] font-bold tracking-widest text-ink/60 uppercase transition hover:border-ink/30 hover:text-ink disabled:opacity-50"
              >
                {message.archived ? "Unarchive" : "Archive"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete the message from ${message.name}? This cannot be undone.`)) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-teal-500/30 px-3 py-2 text-[11px] font-bold tracking-widest text-teal-700 uppercase transition hover:bg-teal-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(ROUTES.ADMIN_MESSAGES);
              }}
              className="rounded-lg border border-sand px-3 py-2 text-[11px] font-bold tracking-widest text-ink/55 uppercase transition hover:text-ink"
            >
              Close
            </button>
          </div>
        </footer>
      </aside>
    </div>,
    document.body,
  );
};

export default MessageThreadDrawer;
