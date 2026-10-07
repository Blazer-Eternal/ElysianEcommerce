import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { useAuth } from "./useAuth";

export const CUSTOMER_NOTIFICATIONS_KEY = ["customer-notifications"] as const;

/**
 * The signed-in customer's notification feed.
 *
 * Content is derived server-side from real records on every request, so the
 * query only needs to stay fresh enough for the bell badge; `refetchInterval`
 * keeps the badge honest while the tab is in use, and React Query dedupes the
 * request between the header bell and the full notifications page.
 */
export const useCustomerNotifications = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CUSTOMER_NOTIFICATIONS_KEY,
    queryFn: ({ signal }) => notificationService.getCustomer(signal),
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
};

/**
 * Persist read markers. Pass an array of keys for individual items, or `null`
 * for "mark everything currently in the feed as read".
 */
export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keys: string[] | null) =>
      keys === null
        ? notificationService.markCustomerAllRead()
        : notificationService.markCustomerRead(keys),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_NOTIFICATIONS_KEY }),
  });
};
