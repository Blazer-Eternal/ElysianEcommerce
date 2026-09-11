import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import { ROUTES } from "../constants/routes";
import Spinner from "../components/ui/Spinner";
import { getErrorMessage } from "../utils/getErrorMessage";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        // eSewa appends a base64-encoded JSON payload as `data` on redirect,
        // containing the transaction_uuid we used as our order_number.
        const encoded = searchParams.get("data");
        if (!encoded) {
          setStatus("error");
          setMessage("Missing payment data from eSewa.");
          return;
        }

        const decoded = JSON.parse(atob(encoded));
        const orderNumber = decoded.transaction_uuid;

        // Never trust the redirect payload alone — re-verify with our backend,
        // which independently checks eSewa's own status API.
        const response = await orderService.verifyEsewaPayment(orderNumber);
        setStatus("success");
        setMessage("Payment verified successfully.");
        setOrderId(response.data._id);
      } catch (err) {
        setStatus("error");
        setMessage(getErrorMessage(err));
      }
    };

    verify();
  }, [searchParams]);

  useEffect(() => {
    if (status === "success" && orderId) {
      const timer = setTimeout(() => navigate(ROUTES.ORDER_DETAIL(orderId)), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, orderId, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 max-w-sm w-full text-center">
        {status === "verifying" && (
          <>
            <Spinner size="lg" />
            <p className="text-gray-600 mt-4">Verifying your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#eafcfd] flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-[#0e7c85]">✓</span>
            </div>
            <h1 className="font-semibold text-lg mb-1">Payment Successful</h1>
            <p className="text-sm text-gray-600">{message}</p>
            <p className="text-xs text-gray-400 mt-3">Redirecting to your order...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-600">✕</span>
            </div>
            <h1 className="font-semibold text-lg mb-1">Verification Failed</h1>
            <p className="text-sm text-gray-600">{message}</p>
            <Link to={ROUTES.ORDER_HISTORY} className="inline-block mt-4 text-sm text-[#0e7c85] hover:underline">
              View My Orders
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;