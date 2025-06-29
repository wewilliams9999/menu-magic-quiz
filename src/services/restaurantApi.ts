
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
        neighborhoods: params.neighborhoods
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
        neighborhoods: params.neighborhoods
      });
    }
    
    // Check if we have results
    if (!data || !data.results || data.results.length === 0) {
      console.log("📭 No results from API, using filtered fallback data");
      console.log("🔍 API response structure:", { 
        hasData: !!data, 
        hasResults: !!data?.results, 
        resultsLength: data?.results?.length 
      });
      
      const fallbackResults = getFilteredFallbackRestaurants({
        cuisine: params.cuisine,
        price: params.price,
        neighborhoods: params.neighborhoods
      });
      console.log(`📱 Using ${fallbackResults.length} filtered fallback restaurants`);
      return fallbackResults;
    }
    
    // Process the results
    const enhancedResults = enhanceAndSortResults(data.results, params);
    
    console.log(`✅ Successfully processed ${enhancedResults.length} restaurant results`);
    console.log("🏪 Restaurant details:", enhancedResults.map(r => ({ 
      name: r.name, 
      cuisine: r.cuisine,
      neighborhood: r.neighborhood,
      priceRange: r.priceRange,
      hasWebsite: !!r.website,
      hasResy: !!r.resyLink,
      hasOpenTable: !!r.openTableLink,
      distance: r.distanceFromUser ? `${r.distanceFromUser.toFixed(1)} mi` : 'Unknown'
    })));
    
    return enhancedResults;
    
  } catch (error) {
    console.error("💥 Exception in fetchRestaurants:", error);
    console.log("📱 Exception fallback: Using filtered mock data");
    
    const fallbackResults = getFilteredFallbackRestaurants({
      cuisine: params.cuisine,
      price: params.price,
      neighborhoods: params.neighborhoods
    });
    console.log(`📱 Exception fallback: Using ${fallbackResults.length} restaurants`);
    return fallbackResults;
  }
};
