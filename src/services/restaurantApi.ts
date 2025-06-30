
import { QuizResult } from "@/utils/quizData";
import { supabase } from "@/integrations/supabase/client";
import { RestaurantApiParams } from "./types";
import { getFilteredFallbackRestaurants } from "./mockData";
import { calculateDistance, enhanceAndSortResults } from "./restaurantUtils";

/**
 * Fetches restaurant data from the Google Places API via our secure Edge Function
 */
export const fetchRestaurants = async (params: RestaurantApiParams): Promise<QuizResult[]> => {
  try {
    console.log("🔍 Fetching restaurants with params:", JSON.stringify(params, null, 2));
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('restaurants', {
      body: params
    });
    
    if (error) {
      console.error("❌ Error calling restaurant API:", error);
      console.log("📱 Falling back to filtered mock data due to API error");
      return getFilteredFallbackRestaurants({
        cuisine: params.cuisine,
        price: params.price,
        neighborhoods: params.neighborhoods,
        userLocation: params.userLocation,
        distance: params.distance
      });
    }
    
    console.log("📡 Raw API response:", data);
    
    // Check if we got an error in the response
    if (data?.error) {
      console.error("❌ API returned error:", data.error);
      console.log("📱 Using filtered fallback data due to API error response");
      return getFilteredFallbackRestaurants({
        cuisine: params.cuisine,
        price: params.price,
        neighborhoods: params.neighborhoods,
        userLocation: params.userLocation,
        distance: params.distance
      });
    }
    
    // Process API results if we have them
    let apiResults: QuizResult[] = [];
    if (data?.results && data.results.length > 0) {
      apiResults = enhanceAndSortResults(data.results, params);
      console.log(`✅ Processed ${apiResults.length} API results`);
    }
    
    // Always get location-aware fallback data
    const fallbackResults = getFilteredFallbackRestaurants({
      cuisine: params.cuisine,
      price: params.price,
      neighborhoods: params.neighborhoods,
      userLocation: params.userLocation,
      distance: params.distance
    });
    
    // If we have good API results (>= 10), use them with some fallback supplements
    if (apiResults.length >= 10) {
      const enhancedFallback = fallbackResults
        .slice(0, 3) // Add just 3 fallback options
        .map(restaurant => ({ ...restaurant, isAlternative: true }));
      
      const combinedResults = [...apiResults, ...enhancedFallback];
      console.log(`✅ Combined ${apiResults.length} API + ${enhancedFallback.length} fallback results`);
      return combinedResults;
    }
    
    // If we have some API results but not many (1-9), supplement heavily with fallback
    if (apiResults.length > 0) {
      const enhancedFallback = fallbackResults
        .slice(0, 8) // Add up to 8 fallback options
        .map(restaurant => ({ ...restaurant, isAlternative: true }));
      
      const combinedResults = [...apiResults, ...enhancedFallback];
      console.log(`✅ Supplemented ${apiResults.length} API results with ${enhancedFallback.length} fallback results`);
      return combinedResults;
    }
    
    // If no API results, use fallback as primary results (not marked as alternatives)
    console.log(`📊 No API results, using ${fallbackResults.length} location-aware fallback results as primary`);
    return fallbackResults;
    
  } catch (error) {
    console.error("💥 Exception in fetchRestaurants:", error);
    console.log("📱 Exception fallback: Using location-aware filtered mock data");
    
    const fallbackResults = getFilteredFallbackRestaurants({
      cuisine: params.cuisine,
      price: params.price,
      neighborhoods: params.neighborhoods,
      userLocation: params.userLocation,
      distance: params.distance
    });
    console.log(`📱 Exception fallback: Using ${fallbackResults.length} restaurants`);
    return fallbackResults;
  }
};
