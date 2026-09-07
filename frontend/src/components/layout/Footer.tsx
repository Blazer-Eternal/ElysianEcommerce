import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const Footer = () => {
  return (
    <footer className="glass mt-16 rounded-t-3xl">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-semibold mb-3">ElysianEcommerce</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            A full-stack ecommerce platform built with the MERN stack and TypeScript.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-gray-600">
            <li><Link to={ROUTES.ABOUT} className="hover:text-black">About Us</Link></li>
            <li><Link to={ROUTES.CONTACT} className="hover:text-black">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">Legal Information</p>
          <ul className="space-y-2 text-gray-600">
            <li><Link to={ROUTES.REFUND_POLICY} className="hover:text-black">Refund Policy</Link></li>
            <li><Link to={ROUTES.SHIPPING_POLICY} className="hover:text-black">Shipping</Link></li>
            <li><Link to={ROUTES.PRIVACY_POLICY} className="hover:text-black">Privacy Policy</Link></li>
            <li><Link to={ROUTES.TERMS_OF_SERVICE} className="hover:text-black">Terms of Service</Link></li>
            <li><Link to={ROUTES.CANCELLATIONS} className="hover:text-black">Cancellations</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 border-t border-white/60 text-xs text-gray-500 flex items-center justify-between">
        <span>© {new Date().getFullYear()} ElysianEcommerce</span>
        <span>Built with React + TypeScript</span>
      </div>
    </footer>
  );
};

export default Footer;