import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import DataTable, { type DataTableColumn } from "../../components/admin/DataTable";
import Pagination from "../../components/ui/Pagination";
// import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import type { Order, OrderStatus, PaymentStatus } from "../../types/order.types";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "paid", "refunded"];

const ManageOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => orderService.getAll(page, 15),
  });

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await orderService.updateStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePaymentStatusChange = async (id: string, payment_status: PaymentStatus) => {
    try {
      await orderService.updatePaymentStatus(id, payment_status);
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const columns: DataTableColumn<Order>[] = [
    {
      header: "Order #",
      render: (o) => (
        <Link to={ROUTES.ORDER_DETAIL(o._id)} className="underline">
          {o.order_number}
        </Link>
      ),
    },
    {
      header: "Customer",
      render: (o) => (typeof o.user_id === "object" ? o.user_id.name : "—"),
    },
    { header: "Date", render: (o) => formatDate(o.created_at) },
    { header: "Total", render: (o) => formatCurrency(o.total_amount) },
    {
      header: "Status",
      render: (o) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o._id, e.target.value as OrderStatus)}
          className="border rounded px-2 py-1 text-xs"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: "Payment",
      render: (o) => (
        <select
          value={o.payment_status}
          onChange={(e) => handlePaymentStatusChange(o._id, e.target.value as PaymentStatus)}
          className="border rounded px-2 py-1 text-xs"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Orders</h1>

      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} rowKey={(o) => o._id} />

      {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
};

export default ManageOrders;
