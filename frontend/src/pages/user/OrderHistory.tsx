import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import OrderCard from "../../components/order/OrderCard";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const OrderHistory = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => orderService.getMyOrders(page, 10),
  });

  if (isLoading) {
    return (
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
        <Link to={ROUTES.PRODUCTS} className="underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
};

export default OrderHistory;