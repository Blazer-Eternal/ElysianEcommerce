import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";

/**
 * The signed-in customer's most recent orders (newest first, one page).
 *
 * The dashboard, the sidebar badges and the order pages all read this same
 * cache entry, so the counts everywhere in the portal come from one request.
 */
export const useMyOrders = (limit = 50) =>
  useQuery({
    queryKey: ["my-orders", 1, limit],
    queryFn: ({ signal }) => orderService.getMyOrders(1, limit, { signal }),
    staleTime: 60 * 1000,
  });
