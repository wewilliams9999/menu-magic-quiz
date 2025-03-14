
import { useQuery } from "@tanstack/react-query";
import { searchRestaurants } from "@/services/restaurantApi";
import { QuizResult } from "@/utils/quizData";

// Fallback data in case the API fails
const fallbackResults: QuizResult[] = [
  {
    id: "1",
    name: "Husk Nashville",
    cuisine: "Southern",
    neighborhood: "Downtown",
    priceRange: "$$$",
    description: "Locally sourced Southern dishes served in a historic mansion with a modern touch.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500&auto=format&fit=crop",
    features: ["Farm-to-table", "Historic setting", "Seasonal menu"],
    website: "https://husknashville.com",
    resyLink: "https://resy.com/cities/bna/venues/husk-nashville",
    openTableLink: "https://www.opentable.com/r/husk-nashville"
  },
  {
    id: "2",
    name: "Rolf & Daughters",
    cuisine: "Modern American",
    neighborhood: "Germantown",
    priceRange: "$$$",
    description: "Rustic-modern spot with pasta dishes & innovative small plates in a converted factory space.",
    imageUrl: "https://images.unsplash.com/photo-1514537193632-6078d53acfe4?q=80&w=500&auto=format&fit=crop",
    features: ["House-made pasta", "Craft cocktails", "Industrial chic"],
    website: "https://www.rolfanddaughters.com",
    resyLink: "https://resy.com/cities/bna/venues/rolf-and-daughters"
  },
  {
    id: "3",
    name: "The Optimist",
    cuisine: "Seafood",
    neighborhood: "Germantown",
    priceRange: "$$$",
    description: "Sophisticated seafood spot with a coastal-inspired menu and oyster bar.",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=500&auto=format&fit=crop",
    features: ["Fresh seafood", "Craft cocktails", "Upscale casual"],
    website: "https://theoptimistrestaurant.com",
    openTableLink: "https://www.opentable.com/r/the-optimist-nashville"
  },
  {
    id: "4",
    name: "Folk",
    cuisine: "Pizza",
    neighborhood: "East Nashville",
    priceRange: "$$",
    description: "Hip spot for wood-fired pizzas, natural wines & seasonal small plates in minimalist digs.",
    imageUrl: "https://images.unsplash.com/photo-1559978137-8c560d91e9e1?q=80&w=500&auto=format&fit=crop",
    features: ["Wood-fired pizza", "Natural wines", "Seasonal ingredients"],
    website: "https://www.folkrestaurant.com",
    resyLink: "https://resy.com/cities/bna/venues/folk",
    openTableLink: "https://www.opentable.com/r/folk-nashville"
  }
];

// Define the input parameters for restaurant filtering
interface RestaurantQueryParams {
  neighborhoods?: string[];
  cuisine?: string;
  price?: string;
  atmosphere?: string;
  preferences?: string[];
}

export const useRestaurantData = (params: RestaurantQueryParams) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: async () => {
      try {
        // In a real app, this would call the actual API
        const response = await searchRestaurants(params);
        
        // If we got results, return them
        if (response && response.length > 0) {
          return response;
        }
        
        // If no results, return alternatives but mark them
        return fallbackResults.map(result => ({
          ...result,
          isAlternative: true
        }));
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        // Return fallback data if API fails
        return fallbackResults.map(result => ({
          ...result,
          isAlternative: true
        }));
      }
    },
    enabled: Boolean(params.cuisine || params.neighborhoods?.length || params.preferences?.length)
  });
};
