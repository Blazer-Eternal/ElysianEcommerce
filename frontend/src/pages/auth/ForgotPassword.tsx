import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";

const ForgotPassword = () => {
  const navigate = useNavigate();
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
      setMessage(response.message || "If an account exists, a reset link has been generated.");

      // TEMP: backend currently returns the raw reset token directly since no
      // email service is wired up yet. Once email sending is implemented on
      // the backend, this block (and resetToken in the response) goes away —
      // the user will instead click a link from their inbox.
      if (response.data?.resetToken) {
        setTimeout(() => {
          navigate(`${ROUTES.RESET_PASSWORD}?token=${response.data.resetToken}`);
        }, 1500);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>
        )}
        {message && (
          <div className="mb-4 rounded bg-green-100 text-green-800 px-3 py-2 text-sm">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          <Link to={ROUTES.LOGIN} className="underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
