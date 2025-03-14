
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants, getFallbackRestaurants, RestaurantApiParams } from "@/services/restaurantService";
import { toast } from "sonner";

export const useRestaurantData = (params: RestaurantApiParams) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: async () => {
      try {
        const data = await fetchRestaurants(params);
        
        // If we got results, return them
        if (data && data.length > 0) {
          return data;
        }
        
        // If no results, show a toast and return fallback data
        toast.info("No restaurants match your exact criteria. Showing alternatives instead.");
        return getFallbackRestaurants().map(result => ({
          ...result,
          isAlternative: true
        }));
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        // Show error toast
        toast.error("Could not load restaurant data. Showing alternatives instead.");
        // Return fallback data on error
        return getFallbackRestaurants().map(result => ({
          ...result,
          isAlternative: true
        }));
      }
    },
    // Only enable the query when we have some parameters
    enabled: Boolean(params.cuisine || params.neighborhoods?.length || params.preferences?.length),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
