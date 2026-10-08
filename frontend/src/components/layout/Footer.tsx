import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.12-4.5-7-8z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);

const LinkColumn = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-4">
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{title}</h4>
    <ul className="space-y-2.5 text-sm">{children}</ul>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gold/30 bg-brand-deep text-cream/75 overflow-hidden">
      {/* Warm ember wash across the top of the footer */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 -left-32 h-80 w-80 rounded-full bg-brand/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="space-y-4 lg:pr-6">
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group">
              <img
                src="/images/Bestlogo-transparent.png"
                alt="Elysian Logo"
                width={256}
                height={256}
                className="h-14 w-14 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold text-cream">
                  Elysian
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-gold">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-cream/65">
              A curated marketplace for shoppers who care about the details, considered products,
              honest pricing and service that doesn't stop at checkout.
            </p>
            <div className="flex gap-3 pt-1">
              <a href="#" aria-label="Facebook" className="rounded-lg border border-cream/15 bg-cream/5 p-2 text-cream/70 hover:text-gold hover:border-gold/50 transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-lg border border-cream/15 bg-cream/5 p-2 text-cream/70 hover:text-gold hover:border-gold/50 transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-lg border border-cream/15 bg-cream/5 p-2 text-cream/70 hover:text-gold hover:border-gold/50 transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Company */}
          <LinkColumn title="Company">
            <li>
              <Link to={ROUTES.ABOUT} className="hover:text-gold transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CONTACT} className="hover:text-gold transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to={ROUTES.FEATURES} className="hover:text-gold transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to={ROUTES.PRODUCTS} className="hover:text-gold transition-colors">
                Products
              </Link>
            </li>
          </LinkColumn>

          {/* Support */}
          <LinkColumn title="Support">
            <li>
              <Link to={ROUTES.SHIPPING_POLICY} className="hover:text-gold transition-colors">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to={ROUTES.REFUND_POLICY} className="hover:text-gold transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to={ROUTES.PRIVACY_POLICY} className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to={ROUTES.TERMS_OF_SERVICE} className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </li>
          </LinkColumn>

          {/* Legal */}
          <LinkColumn title="Legal">
            <li>
              <Link to={ROUTES.CANCELLATIONS} className="hover:text-gold transition-colors">
                Cancellations
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">
                Disclaimer
              </a>
            </li>
          </LinkColumn>
        </div>

        {/* Payment / fulfilment strip */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-[12px] text-cream/60 mb-6">
          <span className="text-gold">Shop Elysian</span>
          <span className="h-3 w-px bg-cream/20" aria-hidden="true" />
          <span>Curated for the way Nepal shops</span>
          <span className="h-3 w-px bg-cream/20" aria-hidden="true" />
          <span>Every listing checked twice</span>
          <span className="h-3 w-px bg-cream/20" aria-hidden="true" />
          <span>No hidden fees, ever</span>
          <span className="h-3 w-px bg-cream/20" aria-hidden="true" />
          <span>Real support, real people</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-cream/20 to-transparent mb-4"></div>

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/55">
          <p>© {currentYear} Elysian. All rights reserved. Kathmandu, Nepal.</p>
          <p className="flex items-center gap-2">
            Crafted with <span className="text-brand">♥</span> for shoppers who deserve better
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
