import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.12-4.5-7-8z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-nav mt-16 sm:mt-24 border-t border-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">ElysianEcommerce</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A full-stack ecommerce platform built with the MERN stack and TypeScript, delivering excellence in every transaction.
            </p>
            {/* Social links */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="glass rounded-lg p-2 text-gray-600 hover:text-[#0e7c85] transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="glass rounded-lg p-2 text-gray-600 hover:text-[#0e7c85] transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" className="glass rounded-lg p-2 text-gray-600 hover:text-[#0e7c85] transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.ABOUT} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FEATURES} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.SHIPPING_POLICY} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REFUND_POLICY} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRIVACY_POLICY} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS_OF_SERVICE} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.CANCELLATIONS} className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Cancellations
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#0e7c85] transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mb-8"></div>

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {currentYear} ElysianEcommerce. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Made with <span className="text-red-500">♥</span> using React • TypeScript • MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;