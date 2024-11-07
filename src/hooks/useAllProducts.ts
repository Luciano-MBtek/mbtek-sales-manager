import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/getAllProducts";

const ONE_DAY = 1000 * 60 * 60 * 24;
const FIVE_MINUTES = 1000 * 60 * 5;

export function useAllProducts() {
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      try {
        const result = await getAllProducts();
        if ("error" in result) {
          throw new Error(result.error);
        }
        return result;
      } catch (error) {
        console.error("Query error:", error);
        throw error;
      }
    },
    staleTime: FIVE_MINUTES,
    gcTime: ONE_DAY,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
