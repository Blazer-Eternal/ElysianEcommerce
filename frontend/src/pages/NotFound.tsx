import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative warm washes — presentational only */}
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="text-center relative z-10">
        <h1 className="text-8xl sm:text-9xl font-semibold mb-4 text-brand tracking-tight">
          404
        </h1>
        <div className="mx-auto mb-6 flex justify-center gap-3">
          <div className="h-px w-16 bg-brand/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-gold opacity-80" />
        </div>
        <p className="text-ink/70 text-xl mb-8 max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist. Head back to the home page and keep browsing.
        </p>
        <Link 
          to={ROUTES.HOME} 
          className="inline-block px-8 py-3 bg-brand text-white font-semibold rounded-full hover:bg-brand-dark hover:scale-105 transition-all duration-300 shadow-[0_2px_16px_rgba(61,5,12,0.18)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.24)]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
