
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants, getFallbackRestaurants, RestaurantApiParams } from "@/services/restaurantService";

interface RestaurantDataParams {
  neighborhoods?: string[];
  cuisine?: string[];  // Changed from string to string[] to allow multiple cuisines
  price?: string[];  // Changed from string to string[] to match the updated RestaurantApiParams
  atmosphere?: string;
  preferences?: string[];
  distance?: number;
}

export const useRestaurantData = (params: RestaurantDataParams) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: async () => {
      try {
        // Prepare API parameters
        const apiParams: RestaurantApiParams = {
          neighborhoods: params.neighborhoods,
          cuisine: params.cuisine,  // Now correctly passing string[] instead of string
          price: params.price,  // Now this matches: string[] to string[]
          atmosphere: params.atmosphere,
          preferences: params.preferences,
          distance: params.distance
        };
        
        const results = await fetchRestaurants(apiParams);
        
        // If we get no results, fall back to mock data
        if (results.length === 0) {
          console.log("No results from API, using fallback data");
          return getFallbackRestaurants();
        }
        
        return results;
        
      } catch (error) {
        console.error("Error in useRestaurantData:", error);
        // Fall back to mock data on error
        return getFallbackRestaurants();
      }
    },
    enabled: !!(
      (params.neighborhoods?.length || params.distance) ||
      params.cuisine?.length || 
      params.price?.length || 
      params.atmosphere
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
