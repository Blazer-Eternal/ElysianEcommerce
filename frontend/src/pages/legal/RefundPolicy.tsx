import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const RefundPolicy = () => {
  return (
    <LegalPageLayout title="Refund Policy">
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

        <h2>Returns</h2>
        <p>
          Our return policy lasts 30 days. If more than 30 days have elapsed since your purchase,
          unfortunately we can't offer you a refund or exchange.
        </p>
        <p>
          To be eligible for a return, your item must be unused, in its original condition, and in the
          original packaging where possible.
        </p>
        <p>
          Once your return is received and inspected, we'll notify you by email that we've received your
          returned item, along with the approval or rejection of your refund.
        </p>
        <p>If approved, your refund will be processed to your original method of payment.</p>

        <h2>Non-returnable items</h2>
        <ul>
          <li>Gift cards</li>
          <li>Items marked as final sale</li>
        </ul>

        <h2>Late or missing refunds</h2>
        <p>
          If you haven't received a refund yet, first check your bank account again, then contact your
          card provider, as it can take a few business days for a refund to post. If you've done this and
          still haven't received your refund, please{" "}
          <Link to={ROUTES.CONTACT}>contact us</Link>.
        </p>

        <h2>Sale items</h2>
        <p>Items purchased on sale or promotion can be returned within 14 days of delivery.</p>

        <h2>Return shipping</h2>
        <p>
          Return shipping costs are the customer's responsibility unless the return is due to our error
          (e.g. wrong or defective item). We recommend using a trackable shipping service, as we can't
          guarantee we'll receive your returned item.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default RefundPolicy;
