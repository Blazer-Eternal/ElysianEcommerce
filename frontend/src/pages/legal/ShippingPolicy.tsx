import LegalPageLayout from "../../components/layout/LegalPageLayout";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const ShippingPolicy = () => {
  return (
    <LegalPageLayout title="Shipping Policy">
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
    </LegalPageLayout>
  );
};

export default ShippingPolicy;
