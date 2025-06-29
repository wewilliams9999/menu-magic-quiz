
import { QuizResult } from "@/utils/quizData";
import { supabase } from "@/integrations/supabase/client";
import { RestaurantApiParams } from "./types";
import { getFallbackRestaurants } from "./mockData";
import { calculateDistance, enhanceAndSortResults } from "./restaurantUtils";

/**
 * Fetches restaurant data from the Google Places API via our secure Edge Function
 */
export const fetchRestaurants = async (params: RestaurantApiParams): Promise<QuizResult[]> => {
  try {
    console.log("Fetching restaurants with params:", params);
    
    // Add more detailed logging
    console.log("User location:", params.userLocation);
    console.log("Neighborhoods:", params.neighborhoods);
    console.log("Cuisine:", params.cuisine);
    console.log("Price:", params.price);
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('restaurants', {
      body: params
    });
    
    if (error) {
      console.error("Error calling restaurant API:", error);
      console.log("Falling back to mock data due to API error");
      return getFallbackRestaurants();
    }
    
    console.log("Raw API response:", data);
    
    if (!data || !data.results || data.results.length === 0) {
      console.log("No results from API or empty results array, using fallback data");
      console.log("API response structure:", { data, hasResults: !!data?.results, resultsLength: data?.results?.length });
      
      // Return fallback data but log this occurrence
      const fallbackResults = getFallbackRestaurants();
      console.log(`Using ${fallbackResults.length} fallback restaurants`);
      return fallbackResults;
    }
    
    // Enhance results with links and distance calculations
    const enhancedResults = enhanceAndSortResults(data.results, params);
    
    console.log(`Successfully processed ${enhancedResults.length} restaurant results:`, 
      enhancedResults.map(r => ({ 
        name: r.name, 
        cuisine: r.cuisine,
        neighborhood: r.neighborhood,
        website: r.website ? 'Yes' : 'No',
        resy: r.resyLink ? 'Yes' : 'No', 
        openTable: r.openTableLink ? 'Yes' : 'No',
        distance: r.distanceFromUser ? `${r.distanceFromUser.toFixed(1)} mi` : 'Unknown'
      }))
    );
    
    return enhancedResults;
    
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    console.log("Exception occurred, falling back to mock data");
    
    // Return fallback data on any exception
    const fallbackResults = getFallbackRestaurants();
    console.log(`Exception fallback: Using ${fallbackResults.length} restaurants`);
    return fallbackResults;
  }
};
