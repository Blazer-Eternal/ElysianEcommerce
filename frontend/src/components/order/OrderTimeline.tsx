import type { OrderStatus } from "../../types/order.types";

const STEPS: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

interface OrderTimelineProps {
  status: OrderStatus;
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  if (status === "cancelled") {
    return <p className="text-sm text-red-600 font-medium">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => {
        const reached = idx <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  reached ? "bg-black text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs mt-1 capitalize ${reached ? "text-black" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${idx < currentIndex ? "bg-black" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
