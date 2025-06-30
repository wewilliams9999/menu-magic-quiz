
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
    queryKey: ['restaurants', params, Date.now()], // Add timestamp for cache busting
    queryFn: async () => {
      try {
        console.log("useRestaurantData called with params:", params);
        
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
        
        console.log(`useRestaurantData received ${results.length} results`);
        
        // Enhanced logging for debugging
        if (results.length > 0) {
          console.log("Sample results:", results.slice(0, 3).map(r => ({
            name: r.name,
            id: r.id,
            priceRange: r.priceRange,
            isAlternative: r.isAlternative,
            distanceFromUser: r.distanceFromUser
          })));
        }
        
        // If we get no results, fall back to mock data
        if (results.length === 0) {
          console.log("No results returned, using fallback data");
          return getFallbackRestaurants();
        }
        
        return results;
        
      } catch (error) {
        console.error("Error in useRestaurantData:", error);
        console.log("Hook exception: falling back to mock data");
        // Fall back to mock data on error
        return getFallbackRestaurants();
      }
    },
    enabled: !!(
      (params.neighborhoods?.length || 
       (params.distance && params.userLocation)) ||
      params.cuisine?.length || 
      params.price?.length || 
      params.atmosphere
    ),
    staleTime: 0, // Always fetch fresh data to prevent caching issues
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to avoid long delays
  });
};
