import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="bg-black text-white px-4 py-2 rounded">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
