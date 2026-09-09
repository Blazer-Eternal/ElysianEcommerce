import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

// Minimal shell for auth pages (login/register/forgot/reset) —
// no Navbar/Footer clutter, just a centered card with a home link.
interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link to={ROUTES.HOME} className="text-xl font-bold mb-8">
        ElysianEcommerce
      </Link>
      {children}
    </div>
  );
};

export default AuthLayout;
