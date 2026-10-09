import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../services/messageService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import MessageThreadDrawer from "../../components/admin/messages/MessageThreadDrawer";
import { tagLabel, tagStyle } from "../../components/admin/messages/messageTags";
import { formatDateTime } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Message, MessageStatus, MessageTag } from "../../types/message.types";

const PAGE_SIZE = 10;

const STATUS_TABS: Array<{ id: MessageStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
];

const TAG_TABS: Array<{ id: MessageTag | "all"; label: string }> = [
  { id: "all", label: "All topics" },
  { id: "order", label: "Order" },
  { id: "shipping", label: "Shipping issue" },
  { id: "refund", label: "Refund" },
  { id: "pre_sales", label: "Pre-sales" },
  { id: "product", label: "Product" },
  { id: "payment", label: "Payment" },
  { id: "account", label: "Account" },
  { id: "feedback", label: "Feedback" },
  { id: "spam", label: "Spam" },
  { id: "other", label: "Other" },
];

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

/** Small status dot + label, the first column of the inbox table. */
const StatusCell = ({ message }: { message: Message }) => {
  if (message.archived) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Archived
      </span>
    );
  }
  if (message.replied_at || message.reply) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Replied
      </span>
    );
  }
  if (!message.is_read) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-teal-700">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Unread
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-xs font-bold text-ink/60">
      <span className="h-1.5 w-1.5 rounded-full bg-ink/30" /> Read
    </span>
  );
};

const ManageMessages = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<MessageStatus | "all">("all");
  const [tag, setTag] = useState<MessageTag | "all">("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [openMessage, setOpenMessage] = useState<Message | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages", page, status, tag, query],
    queryFn: ({ signal }) =>
      messageService.getAll({ page, limit: PAGE_SIZE, status, tag, q: query, signal }),
    refetchInterval: 15_000,
  });

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  // Scroll to top when the page changes.
  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-auto");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const markRead = useMutation({
    mutationFn: (id: string) => messageService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
    onError: (err) => alert(getErrorMessage(err)),
  });

  const messages = data?.data ?? [];
  const counts = data?.counts;
  const unreadCount = data?.unreadCount ?? 0;

  /*
   * The open thread is re-derived from the freshest query result on every
   * render (the drawer's own mutations invalidate this query), and falls back
   * to the last snapshot when a status change filters it out of the view.
   */
  const openThread = openMessage
    ? (data?.data.find((item) => item._id === openMessage._id) ?? openMessage)
    : null;

  const countFor = (id: MessageStatus | "all"): number | undefined => {
    if (!counts) return undefined;
    switch (id) {
      case "all":
        return counts.total;
      case "unread":
        return counts.unread;
      case "read":
        return counts.read;
      case "replied":
        return counts.replied;
      case "archived":
        return counts.archived;
    }
  };

  const activeFilters = useMemo(
    () => (status !== "all" ? 1 : 0) + (tag !== "all" ? 1 : 0) + (query ? 1 : 0),
    [status, tag, query],
  );

  const resetFilters = () => {
    setStatus("all");
    setTag("all");
    setSearch("");
    setQuery("");
    setPage(1);
  };

  const handleOpen = (message: Message) => {
    // Opening a thread is the read event, no separate "Mark Read" button needed.
    if (!message.is_read && !message.archived) markRead.mutate(message._id);
    setOpenMessage({ ...message, is_read: true });
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 text-sm font-semibold tracking-wider text-brand uppercase">
                Admin Panel
              </div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Messages</h1>
              <p className="mt-2 text-gray-600">
                Inbox for the Contact Us / Get in Touch form.
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-bold text-teal-700">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/40">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sender, subject or message"
                aria-label="Search messages"
                className="w-full rounded-xl border border-sand bg-white py-2.5 pr-4 pl-9 text-sm text-ink placeholder-ink/40 transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Status chips */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.id;
              const count = countFor(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatus(tab.id);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase transition ${
                    active
                      ? "border-ink bg-ink text-cream"
                      : "border-sand bg-white text-ink/55 hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {tab.label}
                  {count !== undefined && (
                    <span
                      className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                        active
                          ? "bg-cream/20 text-cream"
                          : tab.id === "unread" && count > 0
                            ? "bg-teal-500 text-white"
                            : "bg-sand text-ink/60"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Topic chips */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {TAG_TABS.map((tab) => {
              const active = tag === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setTag(tab.id);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    active
                      ? "bg-brand text-white"
                      : "border border-sand bg-white text-ink/55 hover:border-brand/40 hover:text-brand"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-auto text-[11px] font-bold tracking-widest text-brand uppercase hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-sand/60" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-sand bg-white px-6 py-12 text-center shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
              <div className="mb-3 flex justify-center text-ink/40">
                <MailIcon />
              </div>
              <p className="text-lg text-gray-600">
                {activeFilters > 0 ? "No messages match these filters." : "No messages yet."}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilters > 0
                  ? "Try a different status or topic, or clear the filters."
                  : "Messages sent from the contact form will appear here."}
              </p>
              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-brand px-4 py-2 text-xs font-bold tracking-[0.12em] text-white uppercase hover:bg-brand-dark"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Inbox table */}
              <div className="overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-215">
                    <thead>
                      <tr className="border-b border-sand bg-linear-to-r from-brand/5 to-cyan-600/5">
                        <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Subject
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Preview
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Received
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand">
                      {messages.map((message) => (
                        <tr
                          key={message._id}
                          className={`group transition-colors ${
                            message.is_read || message.archived
                              ? "hover:bg-cream-deep/40"
                              : "bg-brand/4 hover:bg-brand/6"
                          }`}
                        >
                          <td className="px-5 py-4 align-top">
                            <StatusCell message={message} />
                          </td>

                          {/* Customer name + email open this sender's orders */}
                          <td className="px-5 py-4 align-top">
                            <button
                              type="button"
                              onClick={() => handleOpen(message)}
                              className="max-w-50 text-left"
                              title="View this customer's orders"
                            >
                              <span className="block truncate text-sm font-semibold text-gray-900 transition group-hover:text-brand">
                                {message.name}
                              </span>
                              <span className="block truncate text-xs text-gray-500 transition group-hover:text-brand">
                                {message.email}
                              </span>
                            </button>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="max-w-55">
                              <p
                                className={`truncate text-sm ${
                                  message.is_read ? "text-gray-700" : "font-bold text-gray-900"
                                }`}
                                title={message.subject}
                              >
                                {message.subject}
                              </p>
                              <span
                                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${tagStyle(message.tag)}`}
                              >
                                {tagLabel(message.tag)}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p
                              className={`line-clamp-2 max-w-sm text-sm ${
                                message.is_read ? "text-gray-600" : "text-gray-800"
                              }`}
                            >
                              {message.message}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="text-sm whitespace-nowrap text-gray-600">
                              {formatDateTime(message.created_at)}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <button
                              type="button"
                              onClick={() => handleOpen(message)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-brand transition-all hover:bg-brand/20"
                            >
                              View &amp; Reply
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {data?.pagination && (
                <div className="mt-8">
                  <Pagination pagination={data.pagination} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {openThread && (
        <MessageThreadDrawer message={openThread} onClose={() => setOpenMessage(null)} />
      )}
    </AdminLayout>
  );
};

export default ManageMessages;
