import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../services/messageService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import ViewToggle, { type ViewMode } from "../../components/ui/ViewToggle";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Message } from "../../types/message.types";

const PAGE_SIZE = 10;

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ManageMessages = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages", page],
    queryFn: ({ signal }) => messageService.getAll({ page, limit: PAGE_SIZE, signal }),
    refetchInterval: 10_000,
  });

  // Scroll to top when page changes
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

  const deleteMessage = useMutation({
    mutationFn: (id: string) => messageService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
    onError: (err) => alert(getErrorMessage(err)),
  });

  const handleDelete = (message: Message) => {
    if (!confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    deleteMessage.mutate(message._id);
  };

  const messages = data?.data || [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                Messages sent from the Contact Us / Get in Touch page.
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-xs font-bold">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center bg-white rounded-2xl border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] px-6 py-12">
              <div className="flex justify-center mb-3 text-gray-500">
                <MailIcon />
              </div>
              <p className="text-gray-600 text-lg">No messages yet.</p>
              <p className="text-gray-500 text-sm mt-1">Messages from the contact form will appear here.</p>
            </div>
          ) : viewMode === "list" ? (
            <>
              <div className="bg-white rounded-2xl overflow-hidden border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sand bg-linear-to-r from-brand/5 to-cyan-600/5">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Sender</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Message</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Received</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand">
                      {messages.map((message) => (
                        <tr
                          key={message._id}
                          className={`hover:bg-cream-deep/50 transition-colors ${
                            message.is_read ? "" : "bg-brand/5"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {message.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{message.name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{message.email}</div>
                            {message.phone && <div className="text-xs text-gray-500">{message.phone}</div>}
                          </td>

                          <td className="px-6 py-4 max-w-md">
                            <p className={`text-sm line-clamp-3 ${message.is_read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                              {message.message}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{formatDate(message.created_at)}</span>
                          </td>

                          <td className="px-6 py-4">
                            {message.is_read ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-bold">
                                <CheckIcon /> Read
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-bold">
                                New
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {!message.is_read && (
                                <button
                                  onClick={() => markRead.mutate(message._id)}
                                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand rounded-lg transition-all duration-200 font-semibold text-xs whitespace-nowrap"
                                  title="Mark as Read"
                                >
                                  <CheckIcon />
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(message)}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-200 font-semibold text-xs whitespace-nowrap"
                                title="Delete Message"
                              >
                                <DeleteIcon />
                                Delete
                              </button>
                            </div>
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
          ) : (
            /* Grid View */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`bg-white rounded-2xl overflow-hidden border shadow-[0_2px_16px_rgba(61,5,12,0.06)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)] transition-all duration-300 group ${
                      message.is_read ? "border-[#ece1d0]" : "border-brand/40"
                    }`}
                  >
                    {/* Sender header */}
                    <div className={`p-6 ${message.is_read ? "bg-linear-to-br from-brand/5 to-cyan-600/5" : "bg-linear-to-br from-brand/15 to-cyan-600/15"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand to-cyan-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-base truncate">{message.name}</p>
                          <p className="text-xs text-gray-600 truncate">{message.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Message body */}
                    <div className="p-5 space-y-3">
                      {message.phone && <p className="text-sm text-gray-600">📞 {message.phone}</p>}

                      <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-line">{message.message}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-sand">
                        <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                        {message.is_read ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
                            <CheckIcon /> Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold text-amber-700">New</span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        {!message.is_read && (
                          <button
                            onClick={() => markRead.mutate(message._id)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand rounded-lg transition-all duration-200 font-semibold text-sm"
                            title="Mark as Read"
                          >
                            <CheckIcon />
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(message)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-200 font-semibold text-sm"
                          title="Delete Message"
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
    </AdminLayout>
  );
};

export default ManageMessages;
