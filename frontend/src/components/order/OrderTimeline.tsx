import type { OrderStatus } from "../../types/order.types";

const STEPS: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

interface OrderTimelineProps {
  status: OrderStatus;
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  if (status === "cancelled") {
    return <p className="text-sm text-red-600 font-medium">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => {
        const isCompleted = idx <= currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isCompleted && !isCurrent
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : isCurrent
                      ? "bg-[#0e7c85] text-white shadow-lg shadow-cyan-500/50 ring-2 ring-cyan-200"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted && !isCurrent ? <CheckIcon /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-2 capitalize font-semibold transition-colors duration-300 ${
                  isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                  idx < currentIndex ? "bg-gradient-to-r from-green-500 to-green-400 shadow-sm shadow-green-500/50" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
