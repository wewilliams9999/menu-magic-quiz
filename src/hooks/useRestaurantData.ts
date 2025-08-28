
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
  console.log("🎯 useRestaurantData hook called with params:", params);
  
  return useQuery({
    queryKey: ['restaurants', JSON.stringify(params), Date.now()], // Add timestamp to force fresh queries
    queryFn: async () => {
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
        
        const results = await fetchRestaurants(apiParams);
        console.log(`✅ fetchRestaurants returned: ${results?.length || 0} results`);
        console.log("fetchRestaurants results:", results);
        
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
