import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const Cancellations = () => {
  return (
    <LegalPageLayout title="Cancellations">
      <h2>Cancelling an order</h2>
      <p>
        You can cancel an order yourself from your{" "}
        <Link to={ROUTES.ORDER_HISTORY}>order history</Link> as long as it's still in{" "}
        <strong>Pending</strong> status. Once an order has moved to Paid, Shipped, or Delivered, it can
        no longer be cancelled through your account.
      </p>

      <h2>After cancellation</h2>
      <p>
        Cancelled orders are not deleted — they remain visible in your order history for your records.
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
    </LegalPageLayout>
  );
};

export default Cancellations;
