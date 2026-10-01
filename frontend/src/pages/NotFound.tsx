import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="text-center relative z-10">
        <h1 className="text-8xl sm:text-9xl font-black mb-4 text-brand">
          404
        </h1>
        <p className="text-gray-300 text-xl mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist. Head back to the home page and keep browsing.
        </p>
        <Link 
          to={ROUTES.HOME} 
          className="inline-block px-8 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark hover:scale-105 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
