
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurants, getFallbackRestaurants, RestaurantApiParams, RestaurantApiResponse } from "@/services/restaurantService";

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
  console.log("🎯 useRestaurantData hook called with params:", params);
  
  return useQuery({
    queryKey: ['restaurants', JSON.stringify(params)], // Remove timestamp to allow proper caching
    queryFn: async (): Promise<RestaurantApiResponse> => {
      console.log("🚀 useQuery queryFn executing...");
      try {
        console.log("=== RESTAURANT DATA HOOK ===");
        console.log("useRestaurantData called with params:", params);
        
        // ALWAYS try the API first, only use fallback if API fails
        console.log("🔄 CALLING API FIRST (not checking criteria anymore)");
        console.log("🚀 About to call fetchRestaurants function...");
        
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
        
        const response = await fetchRestaurants(apiParams);
        console.log(`✅ fetchRestaurants returned: status=${response.status}, results=${response.results?.length || 0}`);
        console.log("fetchRestaurants response:", response);
        
        console.log("=== END RESTAURANT DATA HOOK ===");
        return response;
        
      } catch (error) {
        console.error("Error in useRestaurantData:", error);
        console.log("Hook exception: returning error response");
        return {
          results: [],
          status: 'api_failed',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    },
    enabled: Object.keys(params).length > 0, // Only enable when we have actual params
    staleTime: 5000, // Cache for 5 seconds
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to avoid long delays
  });
};
