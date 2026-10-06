import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../../constants/orderStatus";
import Badge from "../ui/Badge";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <Badge className={ORDER_STATUS_COLORS[status] || "bg-cream-deep text-ink"}>
      {ORDER_STATUS_LABELS[status] || status}
    </Badge>
  );
};

export default OrderStatusBadge;
