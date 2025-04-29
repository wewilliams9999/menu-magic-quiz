
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
    queryKey: ['restaurants', params],
    queryFn: async () => {
      try {
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
        
        const results = await fetchRestaurants(apiParams);
        
        // Log results for debugging
        console.log(`Retrieved ${results.length} restaurants with links:`, 
          results.map(r => ({ 
            name: r.name, 
            website: r.website, 
            resy: r.resyLink, 
            openTable: r.openTableLink 
          }))
        );
        
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
      (params.neighborhoods?.length || 
       (params.distance && params.userLocation)) ||
      params.cuisine?.length || 
      params.price?.length || 
      params.atmosphere
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
