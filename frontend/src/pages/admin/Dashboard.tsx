import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import StatCard from "../../components/admin/StatCard";
import { formatCurrency } from "../../utils/formatCurrency";

const Dashboard = () => {
  const { data: productsRes } = useQuery({
    queryKey: ["admin", "products", "count"],
    queryFn: () => productService.getAll({ limit: 1 }),
  });

  const { data: ordersRes } = useQuery({
    queryKey: ["admin", "orders", "count"],
    queryFn: () => orderService.getAll(1, 100),
  });

  const { data: usersRes } = useQuery({
    queryKey: ["admin", "users", "count"],
    queryFn: () => userService.getAll(1, 1),
  });

  const totalRevenue =
    ordersRes?.data.reduce((sum, order) => (order.payment_status === "paid" ? sum + order.total_amount : sum), 0) || 0;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={productsRes?.pagination.total ?? "—"} />
        <StatCard label="Total Orders" value={ordersRes?.pagination.total ?? "—"} />
        <StatCard label="Total Users" value={usersRes?.pagination.total ?? "—"} />
        <StatCard label="Revenue (Paid)" value={formatCurrency(totalRevenue)} />
      </div>
    </div>
  );
};

export default Dashboard;