import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import ViewToggle, { type ViewMode } from "../../components/ui/ViewToggle";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useAuth } from "../../hooks/useAuth";

const PAGE_SIZE = 6;

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: ({ signal }) => userService.getAll(page, PAGE_SIZE, { signal }),
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await userService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const users = data?.data || [];

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-2">Customer accounts, join dates and roles.</p>
            </div>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {/* Users Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found.</p>
            </div>
          ) : viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)] transition-all duration-300 group"
                  >
                    {/* User Avatar Background */}
                    <div className="relative overflow-hidden bg-linear-to-br from-brand/10 to-cyan-600/10 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-brand/60 group-hover:text-brand transition-colors">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-brand to-cyan-600 text-white text-2xl font-bold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{user.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{user.email}</p>
                      </div>

                      {/* User Details */}
                      <div className="space-y-2 py-3 border-t border-b border-[#ece1cf]">
                        {user.phone && (
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Phone</p>
                            <p className="text-sm text-gray-900">{user.phone}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Joined</p>
                          <p className="text-sm text-gray-900">{formatDate(user.created_at)}</p>
                        </div>
                      </div>

                      {/* Role (read-only): single-admin platform — roles are
                          provisioned by the operator, never promoted here. The
                          API also rejects role=admin, so no control is shown. */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 font-medium">Role</p>
                        <div className="px-3 py-2 bg-brand/10 rounded-lg border border-brand/20">
                          <span className="text-sm font-semibold text-brand capitalize">
                            {user.role}
                            {user._id === currentUser?.id ? " (You)" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {user._id === currentUser?.id ? (
                        <div className="pt-2">
                          <button disabled className="w-full px-3 py-2 bg-cream-deep text-gray-500 rounded-lg transition-all duration-200 font-medium text-sm opacity-70 cursor-not-allowed">
                            Cannot delete yourself
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-200 font-medium text-sm"
                          >
                            <DeleteIcon />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
            </>
          ) : (
            <>
              <div className="space-y-3 mb-8">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)] transition-all duration-300 p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                      {/* Avatar */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-brand to-cyan-600 text-white text-lg font-bold shrink-0">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">{user.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">{user.email}</p>
                          </div>
                          <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full border border-brand/20 max-w-fit capitalize">
                            {user.role}
                            {user._id === currentUser?.id ? " (You)" : ""}
                          </span>
                        </div>

                        <div className="py-3 border-t border-b border-[#ece1cf]">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Phone</p>
                              <p className="text-sm text-gray-900">{user.phone || "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Joined</p>
                              <p className="text-sm text-gray-900">{formatDate(user.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full sm:w-auto pt-2 sm:pt-0">
                        {user._id === currentUser?.id ? (
                          <button disabled className="w-full px-4 py-2 bg-cream-deep text-gray-500 rounded-lg font-medium text-sm opacity-70 cursor-not-allowed">
                            Cannot delete yourself
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-200 font-medium text-sm"
                          >
                            <DeleteIcon />
                            Delete User
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
