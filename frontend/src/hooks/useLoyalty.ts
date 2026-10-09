import { useQuery } from "@tanstack/react-query";
import { loyaltyService } from "../services/loyaltyService";

/**
 * The signed-in customer's loyalty position: level, cycle, requirement
 * checklist, points balances and how each order counts.
 *
 * The sidebar badge, the dashboard snapshot, the loyalty page and the order
 * list all read this one cache entry, so every surface quotes the same
 * server-calculated numbers.
 */
export const useLoyalty = () =>
  useQuery({
    queryKey: ["loyalty"],
    queryFn: ({ signal }) => loyaltyService.getSummary(signal),
    staleTime: 60 * 1000,
  });
