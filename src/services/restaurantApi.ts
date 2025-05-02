
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
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('restaurants', {
      body: params
    });
    
    if (error) {
      console.error("Error calling restaurant API:", error);
      throw new Error(error.message);
    }
    
    if (!data || !data.results) {
      console.log("No results from API, using fallback data");
      return getFallbackRestaurants();
    }
    
    // Enhance results with links and distance calculations
    const enhancedResults = enhanceAndSortResults(data.results, params);
    
    console.log(`Received ${enhancedResults.length} restaurant results with links:`, 
      enhancedResults.map(r => ({ 
        name: r.name, 
        website: r.website ? 'Yes' : 'No',
        resy: r.resyLink ? 'Yes' : 'No', 
        openTable: r.openTableLink ? 'Yes' : 'No',
        distance: r.distanceFromUser ? `${r.distanceFromUser.toFixed(1)} mi` : 'Unknown'
      }))
    );
    
    return enhancedResults;
    
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    // Return fallback data on error
    return getFallbackRestaurants();
  }
};
