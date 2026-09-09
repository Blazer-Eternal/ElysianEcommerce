import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import OrderTimeline from "../../components/order/OrderTimeline";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id as string),
    enabled: !!id,
  });

  const handleCancel = async () => {
    if (!id || !confirm("Cancel this order?")) return;
    try {
      await orderService.cancel(id);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Order not found.</p>
        <Link to={ROUTES.ORDER_HISTORY} className="underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-8">
        <OrderTimeline status={order.status} />
      </div>

      <div className="border rounded-lg divide-y mb-6">
        {order.items.map((item, idx) => (
          <div key={item._id || idx} className="flex justify-between px-4 py-3 text-sm">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span>{formatCurrency(item.unit_price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-sm mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
          <span>Total</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-sm mb-1">Shipping Address</h2>
        <p className="text-sm text-gray-600">
          {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state}{" "}
          {order.shipping_address.zip}, {order.shipping_address.country}
        </p>
      </div>

      <p className="text-sm mb-6">
        Payment status: <span className="font-medium capitalize">{order.payment_status}</span>
      </p>

      {order.status === "pending" && (
        <button onClick={handleCancel} className="text-sm text-red-600 hover:underline">
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderDetail;
