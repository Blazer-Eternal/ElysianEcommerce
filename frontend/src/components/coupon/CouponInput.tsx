import { useState } from "react";
import { couponService } from "../../services/couponService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ApplyCouponResult } from "../../types/coupon.types";

interface CouponInputProps {
  orderAmount: number;
  onApplied: (result: ApplyCouponResult | null) => void;
}

const CouponInput = ({ orderAmount, onApplied }: CouponInputProps) => {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<ApplyCouponResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setError(null);
    setIsChecking(true);

    try {
      const response = await couponService.apply({ code: code.trim(), order_amount: orderAmount });
      setApplied(response.data);
      onApplied(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
      setApplied(null);
      onApplied(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    setError(null);
    onApplied(null);
  };

  if (applied) {
    return (
      <div className="border rounded p-3 bg-green-50 flex items-center justify-between text-sm">
        <div>
          <span className="font-medium">{applied.code}</span> applied —{" "}
          <span className="text-green-700">-{formatCurrency(applied.discount_amount)}</span>
        </div>
        <button onClick={handleRemove} className="text-xs text-red-600 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleApply}
          disabled={isChecking || !code.trim()}
          className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {isChecking ? "Checking..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default CouponInput;