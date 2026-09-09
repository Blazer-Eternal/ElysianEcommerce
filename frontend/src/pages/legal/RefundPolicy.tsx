import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const RefundPolicy = () => {
  return (
    <LegalPageLayout title="Refund Policy">
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
        card provider — it can take a few business days for a refund to post. If you've done this and
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
    </LegalPageLayout>
  );
};

export default RefundPolicy;
