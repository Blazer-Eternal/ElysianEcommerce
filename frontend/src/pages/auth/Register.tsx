import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import GoogleAuthFlow from "../../components/auth/GoogleAuthFlow";

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signup({ name, email, password, phone });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 1500);
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
            <linearGradient id="diagonalGradRegister" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e7c85" />
              <stop offset="100%" stopColor="#0b6169" />
            </linearGradient>
          </defs>
          <polygon points="0,0 1000,0 250,1000 0,1000" fill="url(#diagonalGradRegister)" />
        </svg>

        {/* Left Side - Branding */}
        <div className="hidden lg:flex bg-linear-to-br from-brand to-brand-dark flex-col justify-center items-center p-12 text-white relative overflow-hidden order-2 lg:order-1 z-10">
          {/* Decorative Elements */}

          <div className="relative z-10 text-center space-y-6 animate-fade-in">
            <div className="text-sm font-semibold tracking-widest text-blue-100">START HERE</div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold leading-tight">
                Create your <span className="text-cyan-300">account</span>.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                Experience premium shopping redefined. Exclusive deals and early access to new collections awaits.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 sm:p-12 bg-white flex flex-col justify-center order-1 lg:order-2 relative z-20">
          <div className="mb-2 text-sm font-semibold text-brand tracking-widest">WELCOME</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create account</h1>
          <div className="h-1 w-16 bg-linear-to-r from-brand to-cyan-500 rounded-full mb-8"></div>

          {/* Google sign-up */}
          <div className="mb-8">
            <GoogleAuthFlow buttonText="signup_with" />
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">or register with email</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✓ Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 border-b-2 border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:border-brand focus:bg-white transition-all duration-300"
                />
                <div className="absolute right-0 top-3 text-gray-400">
                  <UserIcon />
                </div>
              </div>
            </div>

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
                  <MailIcon />
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  required
                  minLength={7}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-gray-50 border-b-2 border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:border-brand focus:bg-white transition-all duration-300"
                />
                <div className="absolute right-0 top-3 text-gray-400">
                  <PhoneIcon />
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
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
              <p className="text-xs text-gray-500 mt-1">Use 6 characters or more.</p>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-brand to-brand-dark text-white font-semibold py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-brand font-semibold hover:text-brand-dark border-b-2 border-brand">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

