import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

// Minimal shell for auth pages (login/register/forgot/reset) , 
// no Navbar/Footer clutter, just a centered card with a home link.
interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-linear-to-b from-cream via-cream to-cream-deep overflow-hidden">
      {/* Subtle full-page Bestlogo watermark */}
      <img
        src="/images/Bestlogo.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[145vmin] w-[145vmin] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.06]"
      />
      <Link
        to={ROUTES.HOME}
        className="group relative mb-8 flex items-center gap-4 transition-transform hover:scale-[1.02]"
      >
        <img
          src="/images/Bestlogo-transparent.png"
          alt="Elysian Ecommerce"
          className="h-16 w-16 object-contain animate-spin-slow"
        />
        <span className="font-display text-2xl font-bold tracking-tight text-brand transition-colors group-hover:text-brand-dark sm:text-3xl">
          Elysian Ecommerce
        </span>
        <img
          src="/images/Bestlogo-transparent.png"
          alt="Elysian Ecommerce"
          className="h-16 w-16 object-contain animate-spin-slow"
        />
      </Link>
      {children}
    </div>
  );
};

export default AuthLayout;
