import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Privacy Policy">
      <h2>What information we collect</h2>
      <p>
        When you create an account or place an order, we collect personal information such as your
        name, email address, phone number, and shipping address, in order to process and fulfill your
        orders.
      </p>

      <h2>How we use your information</h2>
      <p>
        Your information is used to process transactions, communicate with you about your orders, and
        — with your consent — send you updates about products and offers. We do not sell your personal
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
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
