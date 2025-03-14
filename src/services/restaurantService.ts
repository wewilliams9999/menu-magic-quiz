
import { QuizResult } from "@/utils/quizData";

// Define the API URL - replace with your actual API endpoint
const API_URL = "https://api.example.com/restaurants";

export interface RestaurantApiParams {
  neighborhoods?: string[];
  cuisine?: string;
  price?: string;
  atmosphere?: string;
  preferences?: string[];
}

/**
 * Fetches restaurant data from the API
 */
export const fetchRestaurants = async (params: RestaurantApiParams): Promise<QuizResult[]> => {
  try {
    // Convert params to query string
    const queryParams = new URLSearchParams();
    
    if (params.neighborhoods && params.neighborhoods.length > 0) {
      params.neighborhoods.forEach(n => queryParams.append('neighborhood', n));
    }
    
    if (params.cuisine) {
      queryParams.append('cuisine', params.cuisine);
    }
    
    if (params.price) {
      queryParams.append('price', params.price);
    }
    
    if (params.atmosphere) {
      queryParams.append('atmosphere', params.atmosphere);
    }
    
    if (params.preferences && params.preferences.length > 0) {
      params.preferences.forEach(p => queryParams.append('preference', p));
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
    
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    // Return empty array on error
    return [];
  }
};

// Fallback data in case the API fails
export const getFallbackRestaurants = (): QuizResult[] => {
  return [
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
    }
  ];
};
