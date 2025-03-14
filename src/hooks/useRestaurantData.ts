
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
      
      const restaurants = await searchRestaurants(
        `Nashville, TN${neighborhood ? ` ${neighborhood}` : ''}`,
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
