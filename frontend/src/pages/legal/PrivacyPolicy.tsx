import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Privacy Policy">
      <div className="legal-doc max-w-[70ch] space-y-4">
        <style>{`
          .legal-doc { counter-reset: section; }
          .legal-doc > h2 {
            counter-increment: section;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 2.75rem;
            padding-top: 1.25rem;
            border-top: 1px solid #ece1d0;
          }
          .legal-doc > h2:first-of-type {
            margin-top: 0;
            padding-top: 0;
            border-top: 0;
          }
          .legal-doc > h2::before {
            content: counter(section, decimal-leading-zero);
            display: block;
            font-family: var(--font-sans);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2em;
            color: #d18029;
            margin-bottom: 0.35rem;
          }
          .legal-doc p { line-height: 1.75; color: #4a3f39; }
          .legal-doc a {
            color: #c01e2e;
            text-decoration-color: rgba(192, 30, 46, 0.4);
            text-underline-offset: 3px;
          }
          .legal-doc a:hover { color: #9e1526; }
          .legal-doc li::marker { color: #c01e2e; }
          .legal-doc strong { color: #2f211b; }
        `}</style>

        <h2>What information we collect</h2>
        <p>
          When you create an account or place an order, we collect personal information such as your
          name, email address, phone number, and shipping address, in order to process and fulfill your
          orders.
        </p>

        <h2>How we use your information</h2>
        <p>
          Your information is used to process transactions, communicate with you about your orders, and,
          with your consent, send you updates about products and offers. We do not sell your personal
          information to third parties.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies to keep you logged in, remember items in your cart, and understand how the site
          is used so we can improve it.
        </p>

        <h2>Payment information</h2>
        <p>
          Payment details are processed securely and are never stored on our own servers in plain form.
          All transmissions of sensitive data are encrypted.
        </p>

        <h2>Your rights</h2>
        <p>
          You can access, update, or request deletion of your personal information at any time through
          your <Link to={ROUTES.PROFILE}>profile</Link>, or by{" "}
          <Link to={ROUTES.CONTACT}>contacting us</Link>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Continued use of the site after changes are posted
          constitutes acceptance of the updated policy.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
