
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants, getFallbackRestaurants, RestaurantApiParams } from "@/services/restaurantService";

interface RestaurantDataParams {
  neighborhoods?: string[];
  cuisine?: string[];
  price?: string[];
  atmosphere?: string | string[];
  preferences?: string[];
  distance?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export const useRestaurantData = (params: RestaurantDataParams) => {
  return useQuery({
    queryKey: ['restaurants', JSON.stringify(params)], // Use JSON.stringify for better cache key
    queryFn: async () => {
      try {
        console.log("=== RESTAURANT DATA HOOK ===");
        console.log("useRestaurantData called with params:", params);
        
        // Check if we have enough criteria to search
        const hasNeighborhoods = params.neighborhoods && params.neighborhoods.length > 0;
        const hasLocation = params.userLocation && params.distance;
        const hasCuisine = params.cuisine && params.cuisine.length > 0;
        const hasPrice = params.price && params.price.length > 0;
        
        console.log("Search criteria check:", {
          hasNeighborhoods,
          hasLocation,
          hasCuisine,
          hasPrice
        });
        
        // If we don't have any search criteria, return fallback data
        if (!hasNeighborhoods && !hasLocation && !hasCuisine && !hasPrice) {
          console.log("No search criteria provided, using fallback data");
          const fallbackData = getFallbackRestaurants();
          console.log("Fallback data returned:", fallbackData);
          return fallbackData;
        }
        
        // Prepare API parameters
        const apiParams: RestaurantApiParams = {
          neighborhoods: params.neighborhoods,
          cuisine: params.cuisine,
          price: params.price,
          atmosphere: params.atmosphere,
          preferences: params.preferences,
          distance: params.distance,
          userLocation: params.userLocation
        };
        
        console.log("Calling fetchRestaurants with:", apiParams);
        const results = await fetchRestaurants(apiParams);
        
        console.log(`useRestaurantData final results count: ${results?.length || 0}`);
        console.log("useRestaurantData final results:", results);
        
        // Ensure we always return an array
        const finalResults = Array.isArray(results) ? results : [];
        console.log("=== END RESTAURANT DATA HOOK ===");
        return finalResults;
        
      } catch (error) {
        console.error("Error in useRestaurantData:", error);
        console.log("Hook exception: falling back to mock data");
        // Fall back to mock data on error
        const fallbackData = getFallbackRestaurants();
        console.log("Exception fallback data:", fallbackData);
        return fallbackData;
      }
    },
    enabled: true, // Always enable the query
    staleTime: 0, // Always fetch fresh data to prevent caching issues
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to avoid long delays
  });
};
