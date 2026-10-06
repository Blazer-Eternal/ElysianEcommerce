import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword({ email });
      // Backend now emails a one-time reset link; the token is never in the response.
      setMessage(response.message || "If an account exists, a reset link has been sent to it.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#ece1d0] bg-white p-8 shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
        <h1 className="text-3xl font-semibold text-ink text-center mb-2">Forgot Password</h1>
        <div className="mx-auto mb-8 h-px w-16 bg-brand/40" />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
        )}
        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink/80 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand text-white rounded-xl py-3 font-semibold hover:bg-brand-dark transition-colors duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
