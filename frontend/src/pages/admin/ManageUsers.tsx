import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import DataTable, { type DataTableColumn } from "../../components/admin/DataTable";
import Pagination from "../../components/ui/Pagination";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import type { User, UserRole } from "../../types/user.types";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => userService.getAll(page, 15),
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

  const columns: DataTableColumn<User>[] = [
    { header: "Name", render: (u) => u.name },
    { header: "Email", render: (u) => u.email },
    { header: "Phone", render: (u) => u.phone },
    { header: "Joined", render: (u) => formatDate(u.created_at) },
    {
      header: "Role",
      render: (u) => (
        <select
          value={u.role}
          disabled={u._id === currentUser?.id}
          onChange={(e) => handleRoleChange(u._id, e.target.value as UserRole)}
          className="border rounded px-2 py-1 text-xs disabled:opacity-50"
        >
          <option value="customer">customer</option>
          <option value="admin">admin</option>
        </select>
      ),
    },
    {
      header: "Actions",
      render: (u) =>
        u._id === currentUser?.id ? (
          <span className="text-xs text-gray-400">You</span>
        ) : (
          <button onClick={() => handleDelete(u._id)} className="text-xs text-red-600 underline">
            Delete
          </button>
        ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>

      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} rowKey={(u) => u._id} />

      {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
};

export default ManageUsers;