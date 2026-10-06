import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const Cancellations = () => {
  return (
    <LegalPageLayout title="Cancellations">
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

        <h2>Cancelling an order</h2>
        <p>
          You can cancel an order yourself from your{" "}
          <Link to={ROUTES.ORDER_HISTORY}>order history</Link> as long as it's still in{" "}
          <strong>Pending</strong> status. Once an order has moved to Paid, Shipped, or Delivered, it can
          no longer be cancelled through your account.
        </p>

        <h2>After cancellation</h2>
        <p>
          Cancelled orders are not deleted. They remain visible in your order history for your records.
          Any stock reserved for the order is released back into inventory immediately.
        </p>

        <h2>Cancelling a shipped order</h2>
        <p>
          If your order has already shipped and you'd still like to cancel, please refer to our{" "}
          <Link to={ROUTES.REFUND_POLICY}>Refund Policy</Link> for the return process instead.
        </p>

        <h2>Need help?</h2>
        <p>
          If you're having trouble cancelling an order, <Link to={ROUTES.CONTACT}>contact us</Link> and
          we'll assist you.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default Cancellations;
