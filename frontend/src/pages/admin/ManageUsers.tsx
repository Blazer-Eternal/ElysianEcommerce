import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/user.types";

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

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => userService.getAll(page, 12),
  });

  const handleRoleChange = async (id: string, role: UserRole) => {
    try {
      await userService.assignRole(id, role);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

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
              <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-2">View and manage customer accounts and their roles.</p>
            </div>
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
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-white/20"
                  >
                    {/* User Avatar Background */}
                    <div className="relative overflow-hidden bg-linear-to-br from-[#0e7c85]/10 to-cyan-600/10 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-[#0e7c85]/60 group-hover:text-[#0e7c85] transition-colors">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-[#0e7c85] to-cyan-600 text-white text-2xl font-bold">
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
                      <div className="space-y-2 py-3 border-t border-white/20 border-b border-white/20">
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

                      {/* Role Selection */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 font-medium">Role</p>
                        {user._id === currentUser?.id ? (
                          <div className="px-3 py-2 bg-[#0e7c85]/10 rounded-lg border border-[#0e7c85]/20">
                            <span className="text-sm font-semibold text-[#0e7c85] capitalize">{user.role} (You)</span>
                          </div>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value as UserRole)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85] cursor-pointer"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {user._id === currentUser?.id ? (
                        <div className="pt-2">
                          <button disabled className="w-full px-3 py-2 bg-gray-200 text-gray-600 rounded-lg transition-all duration-200 font-medium text-sm opacity-50 cursor-not-allowed">
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
