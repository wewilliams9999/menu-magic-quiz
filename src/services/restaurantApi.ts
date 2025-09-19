
import { QuizResult } from "@/utils/quizData";
import { supabase } from "@/integrations/supabase/client";
import { RestaurantApiParams } from "./types";
import { getFilteredFallbackRestaurants } from "./mockData";
import { calculateDistance } from "./restaurantUtils";

// Types for API response status
export interface RestaurantApiResponse {
  results: QuizResult[];
  status: 'success' | 'api_failed' | 'no_results';
  error?: string;
}

/**
 * Fetches restaurant data from the Google Places API via our secure Edge Function
 * Now returns status information instead of silently falling back to mock data
 */
export const fetchRestaurants = async (params: RestaurantApiParams): Promise<RestaurantApiResponse> => {
  try {
    console.log("🔍 Fetching restaurants with params:", JSON.stringify(params, null, 2));
    
    // Add timestamp to prevent caching issues
    const requestParams = {
      ...params,
      timestamp: Date.now()
    };
    
    // Call our Supabase Edge Function - Try new google-places function first
    console.log("📡 Trying new google-places function...");
    let data, error;
    
    try {
      const result = await supabase.functions.invoke('google-places', {
        body: requestParams
      });
      data = result.data;
      error = result.error;
    } catch (err) {
      console.log("📡 google-places failed, falling back to restaurants function");
      const result = await supabase.functions.invoke('restaurants', {
        body: requestParams
      });
      data = result.data;
      error = result.error;
    }
    
    console.log("📡 API Response - Data:", data, "Error:", error);
    
    if (error) {
      console.error("❌ Error calling restaurant API:", error);
      return {
        results: [],
        status: 'api_failed',
        error: error.message || 'API call failed'
      };
    }
    
    console.log("📡 Raw API response:", data);
    
    // Check if we got an error in the response
    if (data?.error) {
      console.error("❌ API returned error:", data.error);
      return {
        results: [],
        status: 'api_failed',
        error: data.error
      };
    }
    
    // Process API results if we have them
    let apiResults: QuizResult[] = [];
    if (data?.results && data.results.length > 0) {
      // Process each result properly
      apiResults = data.results.map((result: any) => {
        const processedResult: QuizResult = {
          id: result.id || result.place_id || `api-${Math.random()}`,
          name: result.name || 'Unknown Restaurant',
          cuisine: result.cuisine || 'American',
          neighborhood: result.neighborhood || 'Nashville',
          priceRange: result.priceRange || '$$',
          description: result.description || `${result.name} in Nashville`,
          address: result.address,
          imageUrl: result.imageUrl,
          logoUrl: result.logoUrl,
          features: result.features || [],
          website: result.website,
          resyLink: result.resyLink,
          openTableLink: result.openTableLink,
          instagramLink: result.instagramLink,
          phone: result.phone,
          coordinates: result.coordinates,
          isAlternative: false // API results are not alternatives
        };
        
        // Calculate distance if user location is provided
        if (params.userLocation && result.coordinates) {
          const distance = calculateDistance(
            params.userLocation.latitude,
            params.userLocation.longitude,
            result.coordinates.latitude,
            result.coordinates.longitude
          );
          processedResult.distanceFromUser = distance;
        }
        
        return processedResult;
      });
      
      console.log(`✅ Processed ${apiResults.length} API results`);
      
      // Log sample API results for debugging
      if (apiResults.length > 0) {
        console.log("Sample processed API results:", apiResults.slice(0, 3).map(r => ({
          name: r.name,
          priceRange: r.priceRange,
          coordinates: r.coordinates,
          distance: r.distanceFromUser,
          isAlternative: r.isAlternative
        })));
      }
    } else {
      console.log("📊 No API results returned from Google Places");
    }
    
    // Return API results if we have them, otherwise indicate no results
    if (apiResults.length > 0) {
      console.log(`✅ Returning ${apiResults.length} API results`);
      return {
        results: apiResults,
        status: 'success'
      };
    } else {
      console.log("📊 No results from API");
      return {
        results: [],
        status: 'no_results',
        error: 'No restaurants found matching your criteria'
      };
    }
    
  } catch (error) {
    console.error("💥 Exception in fetchRestaurants:", error);
    return {
      results: [],
      status: 'api_failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
