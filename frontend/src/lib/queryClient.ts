import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute — avoids refetching on every mount
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});