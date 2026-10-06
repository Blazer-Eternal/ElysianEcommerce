import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const ShippingPolicy = () => {
  return (
    <LegalPageLayout title="Shipping Policy">
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

        <h2>Processing time</h2>
        <p>
          Orders are processed within 1–3 business days (excluding weekends and holidays) after receiving
          your order confirmation. You'll receive another notification once your order has shipped.
        </p>

        <h2>Shipping rates</h2>
        <p>
          We offer flat-rate shipping. Exact rates and delivery estimates are shown at checkout based on
          your shipping address.
        </p>

        <h2>Order tracking</h2>
        <p>
          Once your order ships, you'll receive an email with tracking information. Please allow up to 48
          hours for tracking data to become available.
        </p>
        <p>
          If you haven't received your order within 10 days of your shipping confirmation email, please{" "}
          <Link to={ROUTES.CONTACT}>contact us</Link> with your order number and we'll look into it.
        </p>

        <h2>International orders</h2>
        <p>
          Orders shipping outside your country of purchase may be subject to import duties, taxes, and
          customs charges. These are the responsibility of the customer and are not included in the
          checkout total.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default ShippingPolicy;
