
import { QuizResult } from "@/utils/quizData";

// Define the API URL - replace with your actual API endpoint
const API_URL = "https://api.example.com/restaurants";

export interface RestaurantApiParams {
  neighborhoods?: string[];
  cuisine?: string[];  // Changed from string to string[] to match the updated params
  price?: string[];
  atmosphere?: string;
  preferences?: string[];
  distance?: number;
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
    
    if (params.cuisine && params.cuisine.length > 0) {
      // Update to handle multiple cuisines
      params.cuisine.forEach(c => queryParams.append('cuisine', c));
    }
    
    if (params.price && params.price.length > 0) {
      params.price.forEach(p => queryParams.append('price', p));
    }
    
    if (params.atmosphere) {
      queryParams.append('atmosphere', params.atmosphere);
    }
    
    if (params.preferences && params.preferences.length > 0) {
      params.preferences.forEach(p => queryParams.append('preference', p));
    }
    
    if (params.distance) {
      queryParams.append('distance', params.distance.toString());
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
      imageUrl: "https://husknashville.com/wp-content/uploads/sites/2/2018/08/MPHP-HUSK_NASHfacadexfade1.jpg",
      logoUrl: "https://husknashville.com/wp-content/uploads/sites/2/2021/07/husknew_gold.png",
      features: ["Farm-to-table", "Historic setting", "Seasonal menu"],
      website: "https://husknashville.com",
      resyLink: "https://resy.com/cities/bna/venues/husk-nashville",
      openTableLink: "https://www.opentable.com/r/husk-nashville",
      instagramLink: "https://www.instagram.com/husknashville"
    },
    {
      id: "2",
      name: "Rolf & Daughters",
      cuisine: "Modern American",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Rustic-modern spot with pasta dishes & innovative small plates in a converted factory space.",
      imageUrl: "https://www.rolfanddaughters.com/wp-content/uploads/2015/10/DSC_9863-1600x1067.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5c5c3833840b161566b59a22/70dbb757-1e8b-4159-b5e6-3fed48338e30/radlogo.png",
      features: ["House-made pasta", "Craft cocktails", "Industrial chic"],
      website: "https://www.rolfanddaughters.com",
      resyLink: "https://resy.com/cities/bna/venues/rolf-and-daughters",
      instagramLink: "https://www.instagram.com/rolfanddaughters"
    },
    {
      id: "3",
      name: "The Optimist",
      cuisine: "Seafood",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Sophisticated seafood spot with a coastal-inspired menu and oyster bar.",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5ef25f8a509c313cb73a9b20/1599601744952-G8UJ3JIB0WUYFNLW09OZ/Optimist+Nashville+Exterior.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5ef25f8a509c313cb73a9b20/1592942166899-8X5QI1WCY01LGG9HZCPC/Optimist+Logo+BW.png",
      features: ["Fresh seafood", "Craft cocktails", "Upscale casual"],
      website: "https://theoptimistrestaurant.com",
      openTableLink: "https://www.opentable.com/r/the-optimist-nashville",
      instagramLink: "https://www.instagram.com/theoptimistnashville"
    }
  ];
};
