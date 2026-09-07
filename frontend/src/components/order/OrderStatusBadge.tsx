import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../../constants/orderStatus";
import Badge from "../ui/Badge";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <Badge className={ORDER_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}>
      {ORDER_STATUS_LABELS[status] || status}
    </Badge>
  );
};

export default OrderStatusBadge;