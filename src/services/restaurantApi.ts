
import { QuizResult } from "@/utils/quizData";
import { supabase } from "@/integrations/supabase/client";
import { RestaurantApiParams } from "./types";
import { getFilteredFallbackRestaurants } from "./mockData";
import { calculateDistance } from "./restaurantUtils";

/**
 * Fetches restaurant data from the Google Places API via our secure Edge Function
 */
export const fetchRestaurants = async (params: RestaurantApiParams): Promise<QuizResult[]> => {
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
    
    // Always get location-aware fallback data
    const fallbackResults = getFilteredFallbackRestaurants({
      cuisine: params.cuisine,
      price: params.price,
      neighborhoods: params.neighborhoods,
      userLocation: params.userLocation,
      distance: params.distance
    });
    
    console.log(`📱 Got ${fallbackResults.length} fallback results`);
    
    // If we have good API results (>= 8), use them with minimal fallback supplements
    if (apiResults.length >= 8) {
      const enhancedFallback = fallbackResults
        .slice(0, 2) // Add just 2 fallback options for variety
        .map(restaurant => ({ ...restaurant, isAlternative: true }));
      
      const combinedResults = [...apiResults, ...enhancedFallback];
      console.log(`✅ Combined ${apiResults.length} API + ${enhancedFallback.length} fallback results`);
      return combinedResults;
    }
    
    // If we have some API results but not many (1-7), supplement with fallback
    if (apiResults.length > 0) {
      const enhancedFallback = fallbackResults
        .slice(0, 6) // Add up to 6 fallback options
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
