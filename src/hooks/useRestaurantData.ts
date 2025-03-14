
import { useQuery } from "@tanstack/react-query";
import { searchRestaurants, mapApiRestaurantToQuizResult } from "@/services/restaurantApi";
import { QuizResult } from "@/utils/quizData";

interface UseRestaurantDataProps {
  neighborhood?: string;
  cuisine?: string;
  price?: string;
  atmosphere?: string;
}

export function useRestaurantData({
  neighborhood,
  cuisine,
  price,
  atmosphere
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
  const mapNeighborhoodToLocation = (neighborhood?: string): string => {
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
    return categories.join(',');
  };

  return useQuery({
    queryKey: ['restaurants', neighborhood, cuisine, price, atmosphere],
    queryFn: async () => {
      const apiPrice = price ? mapPriceToApi(price) : undefined;
      const categoryParam = buildCategoryParam();
      const locationParam = mapNeighborhoodToLocation(neighborhood);
      
      const restaurants = await searchRestaurants(
        locationParam,
        categoryParam,
        apiPrice
      );
      
      // Map API response to our app's format
      return restaurants.map(mapApiRestaurantToQuizResult);
    },
    enabled: !!(neighborhood || cuisine || price || atmosphere), // Only run if at least one parameter is provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}
