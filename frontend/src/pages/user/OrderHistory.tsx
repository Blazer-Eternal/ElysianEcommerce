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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No orders yet</p>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-200/50 transition-all duration-300 active:scale-95"
          >
            <span>Browse Products</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-lg text-gray-600">Track and manage your orders</p>
        <div className="h-1 w-20 bg-gradient-to-r from-[#0e7c85] to-cyan-600 rounded-full mt-4" />
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 75}ms`,
              animation: "fadeIn 0.6s ease-out forwards",
            }}
          >
            <OrderCard order={order} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="mt-12 animate-fade-in">
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
