import { QueryClient } from "@tanstack/react-query";

const ONE_DAY = 1000 * 60 * 60 * 24;
const FIVE_MINUTES = 1000 * 60 * 5;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_DAY,
        gcTime: ONE_DAY,
        refetchInterval: ONE_DAY,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
      },
    },
  });
}

// Get or create QueryClient
let queryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = makeQueryClient();
  }
  return queryClient;
};
