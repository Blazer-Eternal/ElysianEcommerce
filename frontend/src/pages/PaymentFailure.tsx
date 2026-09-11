import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const PaymentFailure = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-red-600">✕</span>
        </div>
        <h1 className="font-semibold text-lg mb-1">Payment Failed</h1>
        <p className="text-sm text-gray-600">
          Your eSewa payment was not completed. Your order has been kept as pending — you can try paying
          again from your order history, or choose Cash on Delivery instead.
        </p>
        <Link
          to={ROUTES.ORDER_HISTORY}
          className="inline-block mt-4 bg-[#0e7c85] text-white text-sm px-5 py-2 rounded-full hover:bg-[#0b6169] transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;