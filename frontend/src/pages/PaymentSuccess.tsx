import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import { useCart } from "../hooks/useCart";
import { ROUTES } from "../constants/routes";
import Spinner from "../components/ui/Spinner";
import { getErrorMessage } from "../utils/getErrorMessage";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { refetch: refetchCart } = useCart();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        // Get preOrderToken from sessionStorage
        const preOrderToken = sessionStorage.getItem("esewaPreOrderToken");
        if (!preOrderToken) {
          setStatus("error");
          setMessage("Missing pre-order token. Your session may have expired. Please try the checkout again.");
          sessionStorage.removeItem("esewaPreOrderToken");
          setShowRetry(true);
          return;
        }

        console.log("[Payment Verification] Starting eSewa payment verification...");

        // Call backend to verify payment and create order
        const response = await orderService.verifyEsewaPayment(preOrderToken);
        
        if (!response.success) {
          console.warn("[Payment Verification] Payment verification failed:", response.message);
          setStatus("error");
          setMessage(response.message || "Payment verification failed. Please check your payment status.");
          sessionStorage.removeItem("esewaPreOrderToken");
          setShowRetry(true);
          return;
        }

        console.log("[Payment Verification] Payment verified successfully!");
        setStatus("success");
        setMessage("Payment verified successfully. Order created!");
        setOrderId(response.data._id);

        // Refresh cart after successful payment
        try {
          await refetchCart();
          console.log("[Payment Verification] Cart refreshed after successful payment");
        } catch (err) {
          console.error("[Payment Verification] Error refreshing cart:", err);
          // Don't fail the verification if cart refresh fails
        }

        // Clean up
        sessionStorage.removeItem("esewaPreOrderToken");
      } catch (err) {
        console.error("[Payment Verification] Error during verification:", err);
        setStatus("error");
        setMessage(getErrorMessage(err) || "An error occurred during payment verification. Please try again.");
        sessionStorage.removeItem("esewaPreOrderToken");
        setShowRetry(true);
      }
    };

    verify();
  }, [refetchCart]);

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
            <p className="text-gray-600 mt-4">Verifying your payment with eSewa...</p>
            <p className="text-xs text-gray-400 mt-2">Please wait, this may take a moment.</p>
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
            <h1 className="font-semibold text-lg mb-1">Payment Verification Failed</h1>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            <div className="space-y-2">
              {showRetry && (
                <button
                  onClick={() => navigate(ROUTES.CHECKOUT)}
                  className="w-full px-4 py-2 bg-[#0e7c85] text-white rounded-lg text-sm font-semibold hover:bg-[#0a5f68] transition-colors"
                >
                  Try Again
                </button>
              )}
              <Link 
                to={ROUTES.ORDER_HISTORY} 
                className="block px-4 py-2 border-2 border-[#0e7c85] text-[#0e7c85] rounded-lg text-sm font-semibold hover:bg-[#0e7c85]/5 transition-colors"
              >
                View My Orders
              </Link>
              <Link 
                to={ROUTES.HOME} 
                className="block text-sm text-[#0e7c85] hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;