
import { useQuery } from "@tanstack/react-query";
import { searchRestaurants, mapApiRestaurantToQuizResult } from "@/services/restaurantApi";
import { QuizResult } from "@/utils/quizData";

interface UseRestaurantDataProps {
  neighborhoods?: string[];
  cuisine?: string;
  price?: string;
  atmosphere?: string;
  preferences?: string[];
}

export function useRestaurantData({
  neighborhoods,
  cuisine,
  price,
  atmosphere,
  preferences = []
}: UseRestaurantDataProps) {
  // Map quiz answers to API parameters
  const mapPriceToApi = (quizPrice: string): string => {
    const priceMap: Record<string, string> = {
      "budget": "$",
      "moderate": "$$",
      "highend": "$$$",
      "luxury": "$$$$"
    };
    return priceMap[quizPrice] || "";
  };

  // Map neighborhood to location for API search
  const mapNeighborhoodToLocation = (neighborhood: string): string => {
    if (!neighborhood) return "Nashville, TN";
    
    // For suburbs that should use their own city name
    if (neighborhood === "franklin") return "Franklin, TN";
    if (neighborhood === "brentwood") return "Brentwood, TN";
    
    // For Nashville neighborhoods, include neighborhood name
    const neighborhoodDisplay = neighborhood.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `Nashville, TN ${neighborhoodDisplay}`;
  };

  // Build category string for API
  const buildCategoryParam = (): string => {
    const categories = [];
    if (cuisine) categories.push(cuisine);
    if (atmosphere) categories.push(atmosphere);
    
    // Add relevant preference-based categories
    if (preferences.includes('music')) categories.push('live-music');
    if (preferences.includes('outdoor')) categories.push('outdoor-seating');
    if (preferences.includes('family')) categories.push('family-friendly');
    if (preferences.includes('quiet')) categories.push('quiet');
    
    return categories.join(',');
  };

  // Build additional filters for API based on preferences
  const buildPreferenceFilters = (): Record<string, any> => {
    const filters: Record<string, any> = {};
    
    if (preferences.includes('parking')) {
      filters.attributes = [...(filters.attributes || []), 'garage_parking', 'validated_parking', 'lot_parking'];
    }
    
    if (preferences.includes('budget')) {
      // Override price if budget is a preference
      filters.price = '$,$$';
    }
    
    if (preferences.includes('late-night')) {
      filters.open_at = '22:00';
    }
    
    return filters;
  };

  return useQuery({
    queryKey: ['restaurants', neighborhoods, cuisine, price, atmosphere, preferences],
    queryFn: async () => {
      const apiPrice = price ? mapPriceToApi(price) : undefined;
      const categoryParam = buildCategoryParam();
      const preferenceFilters = buildPreferenceFilters();
      
      // Handle multiple neighborhoods
      if (!neighborhoods || neighborhoods.length === 0) {
        // If no neighborhoods specified, search all of Nashville
        const restaurants = await searchRestaurants(
          "Nashville, TN",
          categoryParam,
          apiPrice,
          preferenceFilters // Error is here - this should be a number or undefined
        );
        return restaurants.map(mapApiRestaurantToQuizResult);
      }
      
      // Search for each neighborhood and combine results
      const allResults: QuizResult[] = [];
      
      // We'll search one neighborhood at a time and combine results
      for (const neighborhood of neighborhoods) {
        const locationParam = mapNeighborhoodToLocation(neighborhood);
        
        const restaurants = await searchRestaurants(
          locationParam,
          categoryParam,
          apiPrice,
          preferenceFilters // Error is here - this should be a number or undefined
        );
        
        // Map API response to our app's format and add to results
        const mappedResults = restaurants.map(restaurant => {
          const result = mapApiRestaurantToQuizResult(restaurant);
          // Add neighborhood to the result if not already there
          if (!result.neighborhood) {
            result.neighborhood = neighborhood;
          }
          return result;
        });
        
        allResults.push(...mappedResults);
      }
      
      // Remove duplicates (by ID)
      const uniqueResults = allResults.filter((result, index, self) =>
        index === self.findIndex((r) => r.id === result.id)
      );
      
      return uniqueResults;
    },
    enabled: !!(neighborhoods?.length || cuisine || price || atmosphere || preferences.length), // Only run if at least one parameter is provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}
