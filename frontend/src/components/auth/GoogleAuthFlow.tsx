import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  buttonText?: "signin_with" | "signup_with" | "continue_with";
}

// Shared Google auth: verify Google token → OTP to Gmail → verify OTP →
// log in (or auto-create the account) and land on the home page.
const GoogleAuthFlow = ({ buttonText = "signin_with" }: Props) => {
  const { googleVerify } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"idle" | "otp">("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (step !== "idle") return;

    let cancelled = false;
    let attempts = 0;

    const init = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) {
        attempts += 1;
        if (!cancelled && attempts < 50) setTimeout(init, 100);
        return;
      }
      if (cancelled) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
      if (!clientId || clientId.startsWith("YOUR_")) {
        setError("Google sign-in is not configured yet.");
        return;
      }

      g.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          setError(null);
          setInfo(null);
          setBusy(true);
          try {
            const res = await authService.googleInitiate(response.credential);
            setEmail(res.data.email);
            setInfo(res.message ?? null);
            setStep("otp");
          } catch (err) {
            setError(getErrorMessage(err));
          } finally {
            setBusy(false);
          }
        },
      });

      if (buttonRef.current) {
        g.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: buttonText,
          shape: "pill",
          locale: "en",
        });
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [step, buttonText]);

  const handleVerify = async () => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      await googleVerify(email, otp);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const res = await authService.googleResend(email);
      setInfo(res.message ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="space-y-4 border border-[#ece1d0] rounded-xl p-6 bg-cream">
        <h2 className="text-lg font-semibold text-ink">Verify your Google account</h2>
        <p className="text-sm text-ink/70">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {info}
          </div>
        )}
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="6-digit code"
          className="w-full bg-white border-b-2 border-[#ded2c4] px-4 py-3 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-brand transition-all duration-300"
        />
        <button
          type="button"
          onClick={handleVerify}
          disabled={busy || otp.length !== 6}
          className="w-full bg-linear-to-r from-brand to-brand-dark text-white font-semibold py-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Verifying..." : "Verify & continue"}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={busy}
          className="w-full text-sm text-brand font-semibold hover:text-brand-dark disabled:opacity-50"
        >
          Resend code
        </button>
        <button
          type="button"
          onClick={() => { setStep("idle"); setOtp(""); setError(null); setInfo(null); }}
          className="w-full text-xs text-ink/55 hover:text-ink/80"
        >
          Use a different account
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
          {error}
        </div>
      )}
      <div className="flex justify-center" ref={buttonRef} />
      <p className="text-xs text-ink/55 text-center mt-2">
        Use a verified Google/Gmail account. We'll email you a one-time code.
      </p>
    </div>
  );
};

export default GoogleAuthFlow;
