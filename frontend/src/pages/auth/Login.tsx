import { useState, useEffect, useRef, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string })?.from || ROUTES.HOME;
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
        setGoogleError("Google sign-in is not configured yet.");
        return;
      }

      g.accounts.id.initialize({
        client_id: clientId,
        locale: "en",
        callback: async (response: { credential: string }) => {
          setGoogleError(null);
          try {
            await googleLogin(response.credential);
            navigate(from, { replace: true });
          } catch (err) {
            setGoogleError(getErrorMessage(err));
          }
        },
      });

      if (googleButtonRef.current) {
        g.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "signin_with",
          shape: "pill",
        });
      }
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-dark to-[#0f2d42] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Diagonal Partition SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="diagonalGradLogin" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e7c85" />
              <stop offset="100%" stopColor="#0b6169" />
            </linearGradient>
          </defs>
          <polygon points="500,0 1000,0 1000,1000 0,1000" fill="url(#diagonalGradLogin)" />
        </svg>

        {/* Left Side - Form */}
        <div className="p-8 sm:p-12 bg-white flex flex-col justify-center relative z-20">
          <div className="mb-2 text-sm font-semibold text-brand tracking-widest">WELCOME BACK</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
          <div className="h-1 w-16 bg-linear-to-r from-brand to-cyan-500 rounded-full mb-8"></div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-50 border-b-2 border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:border-brand focus:bg-white transition-all duration-300"
                />
                <div className="absolute right-0 top-3 text-gray-400">
                  <UserIcon />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 border-b-2 border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:border-brand focus:bg-white transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-gray-400 hover:text-brand transition-colors"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">Keep me signed in</span>
              </label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-brand hover:text-brand-dark font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-brand to-brand-dark text-white font-semibold py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Continue with Google — directly under the Login button */}
          <div className="mt-6">
            {googleError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                {googleError}
              </div>
            )}
            <div className="flex justify-center" ref={googleButtonRef} />
            <p className="text-xs text-gray-500 text-center mt-2">
              Sign in with your verified Google/Gmail account.
            </p>
          </div>

          <p className="text-sm text-gray-600 text-center mt-6">
            New to ElysianEcommerce?{" "}
            <Link to={ROUTES.REGISTER} className="text-brand font-semibold hover:text-brand-dark border-b-2 border-brand">
              Create an account
            </Link>
          </p>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex bg-linear-to-br from-brand to-brand-dark flex-col justify-center items-center p-12 text-white relative overflow-hidden z-10">
          {/* Decorative Elements */}

          <div className="relative z-10 text-center space-y-6 animate-fade-in">
            <div className="text-sm font-semibold tracking-widest text-blue-100">ELYSIAN</div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold leading-tight">
                Welcome <span className="text-cyan-300">back</span>.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                Your shopping experience, your preferences and your cart are exactly where you left them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
