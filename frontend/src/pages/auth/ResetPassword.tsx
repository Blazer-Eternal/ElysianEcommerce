import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import PasswordInput from "../../components/ui/PasswordInput";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authService.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#ece1d0] bg-white p-8 shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
        <h1 className="text-3xl font-semibold text-ink text-center mb-2">Reset Password</h1>
        <div className="mx-auto mb-8 h-px w-16 bg-brand/40" />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">
            Password reset successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromUrl && (
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-ink/80 mb-2">
                Reset Token
              </label>
              <input
                id="token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
              />
            </div>
          )}

          <PasswordInput
            id="newPassword"
            label="New Password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand text-white rounded-xl py-3 font-semibold hover:bg-brand-dark transition-colors duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          <Link to={ROUTES.LOGIN} className="text-brand font-medium hover:text-brand-dark">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
