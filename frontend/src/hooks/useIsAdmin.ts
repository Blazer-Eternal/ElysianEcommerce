import { useAuth } from "./useAuth";

/**
 * True when the signed-in account holds the admin role.
 *
 * The storefront is shared between customers and admins (an admin browsing the
 * public site sees the same pages). Commerce affordances that only make sense
 * for shoppers (Add to Cart, Buy Now, Proceed to Checkout, the loyalty CTA) are
 * hidden behind this flag so the store reads as a management surface for admins.
 */
export const useIsAdmin = () => useAuth().user?.role === "admin";
