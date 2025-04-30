
import { QuizResult } from "@/utils/quizData";
import { supabase } from "@/integrations/supabase/client";

export interface RestaurantApiParams {
  neighborhoods?: string[];
  cuisine?: string[];
  price?: string[];
  atmosphere?: string | string[];
  preferences?: string[];
  distance?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

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
    
    // Add the missing links if they don't exist
    const enhancedResults = data.results.map(result => {
      // Always ensure we have a website link
      if (!result.website) {
        result.website = `https://www.google.com/search?q=${encodeURIComponent(result.name + " " + result.neighborhood + " Nashville")}`;
      }
      
      // Add mock reservation links to some restaurants (for demo purposes)
      if (!result.resyLink && Math.random() > 0.5) {
        result.resyLink = `https://resy.com/cities/bna/venues/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      }
      
      if (!result.openTableLink && !result.resyLink && Math.random() > 0.5) {
        result.openTableLink = `https://www.opentable.com/r/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      }
      
      // Add Instagram link if missing
      if (!result.instagramLink && Math.random() > 0.3) {
        result.instagramLink = `https://www.instagram.com/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      }
      
      return result;
    });
    
    console.log(`Received ${enhancedResults.length} restaurant results with links:`, 
      enhancedResults.map(r => ({ 
        name: r.name, 
        website: r.website ? 'Yes' : 'No',
        resy: r.resyLink ? 'Yes' : 'No', 
        openTable: r.openTableLink ? 'Yes' : 'No' 
      }))
    );
    
    return enhancedResults;
    
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    // Return fallback data on error
    return getFallbackRestaurants();
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
      address: "37 Rutledge St, Nashville, TN 37210",
      imageUrl: "https://husknashville.com/wp-content/uploads/sites/2/2018/08/MPHP-HUSK_NASHfacadexfade1.jpg",
      logoUrl: "https://husknashville.com/wp-content/uploads/sites/2/2021/07/husknew_gold.png",
      features: ["Farm-to-table", "Historic setting", "Seasonal menu"],
      website: "https://husknashville.com",
      resyLink: "https://resy.com/cities/bna/venues/husk-nashville",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/husknashville"
    },
    {
      id: "2",
      name: "Rolf & Daughters",
      cuisine: "Modern American",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Rustic-modern spot with pasta dishes & innovative small plates in a converted factory space.",
      address: "700 Taylor St, Nashville, TN 37208",
      imageUrl: "https://www.rolfanddaughters.com/wp-content/uploads/2015/10/DSC_9863-1600x1067.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5c5c3833840b161566b59a22/70dbb757-1e8b-4159-b5e6-3fed48338e30/radlogo.png",
      features: ["House-made pasta", "Craft cocktails", "Industrial chic"],
      website: "https://www.rolfanddaughters.com",
      resyLink: "https://resy.com/cities/bna/venues/rolf-and-daughters",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/rolfanddaughters"
    },
    {
      id: "3",
      name: "The Optimist",
      cuisine: "Seafood",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Sophisticated seafood spot with a coastal-inspired menu and oyster bar.",
      address: "1400 Adams St, Nashville, TN 37208",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5ef25f8a509c313cb73a9b20/1599601744952-G8UJ3JIB0WUYFNLW09OZ/Optimist+Nashville+Exterior.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5ef25f8a509c313cb73a9b20/1592942166899-8X5QI1WCY01LGG9HZCPC/Optimist+Logo+BW.png",
      features: ["Fresh seafood", "Craft cocktails", "Upscale casual"],
      website: "https://theoptimistrestaurant.com",
      resyLink: null,
      openTableLink: "https://www.opentable.com/r/the-optimist-nashville",
      instagramLink: "https://www.instagram.com/theoptimistnashville"
    },
    {
      id: "4",
      name: "Folk",
      cuisine: "Pizza",
      neighborhood: "East Nashville",
      priceRange: "$$",
      description: "Creative, wood-fired pizzas and vegetable dishes in a bright, stylish space.",
      address: "823 Meridian St, Nashville, TN 37207",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5a9e34dc0dbda3fd586e9316/1548271982852-9SLTFI169UWA934F68KN/folk+thanksgiving-7.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5a9e34dc0dbda3fd586e9316/c30b18d3-1675-4ddb-b5fa-30dabb39cc2f/Logo+Folk+Final.png",
      features: ["Wood-fired pizza", "Vegetarian options", "Weekend brunch"],
      website: "https://www.folkrestaurant.com",
      resyLink: "https://resy.com/cities/bna/venues/folk",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/folknashville"
    },
    {
      id: "5",
      name: "Henrietta Red",
      cuisine: "Seafood",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Airy, stylish space for oysters, seafood small plates & creative cocktails.",
      address: "1200 4th Ave N, Nashville, TN 37208",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5875e150d482e9e1f2369749/1521566288837-NBF2DJLKML4C7C0QVHBM/Henrietta+Red+Dining+Room.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5875e150d482e9e1f2369749/287f1bc0-4670-42eb-ae7f-cbc0c6690cab/HRLogo_PrimaryWhite-01.png",
      features: ["Raw bar", "Seasonal menu", "Craft cocktails"],
      website: "https://www.henriettared.com",
      resyLink: "https://resy.com/cities/bna/venues/henrietta-red",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/henrietta_red"
    }
  ];
};

/**
 * Maps Google Places API restaurant data to our QuizResult format
 * This will be used when integrating with the actual Google Places API
 */
export const mapGooglePlacesToRestaurants = (places: any[]): QuizResult[] => {
  return places.map(place => {
    // Determine price range from price_level (0-4)
    const priceMap: Record<number, string> = {
      0: "$",
      1: "$",
      2: "$$",
      3: "$$$",
      4: "$$$$"
    };
    
    // Extract neighborhood from address components if available
    const neighborhood = "Downtown"; // Default - in production you'd extract this from address_components
    
    // Extract cuisine from types
    const cuisineMap: Record<string, string> = {
      "restaurant": "American",
      "cafe": "Cafe",
      "bar": "Bar",
      "food": "American",
      "meal_takeaway": "Fast Food",
      "meal_delivery": "Delivery",
      "bakery": "Bakery",
      "italian_restaurant": "Italian",
      "mexican_restaurant": "Mexican",
      "chinese_restaurant": "Chinese",
      "japanese_restaurant": "Japanese",
      "thai_restaurant": "Thai",
      "indian_restaurant": "Indian"
      // Add more mappings as needed
    };
    
    // Find a cuisine type that matches our known types
    let cuisine = "American"; // Default
    if (place.types && place.types.length > 0) {
      for (const type of place.types) {
        if (cuisineMap[type]) {
          cuisine = cuisineMap[type];
          break;
        }
      }
    }
    
    // Generate reservation links for demo purposes
    const mockResyLink = Math.random() > 0.5 ? 
      `https://resy.com/cities/bna/venues/${place.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : null;
    
    const mockOpenTableLink = !mockResyLink && Math.random() > 0.5 ? 
      `https://www.opentable.com/r/${place.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : null;
    
    // Always ensure there's a website link
    const websiteLink = place.website || `https://www.google.com/search?q=${encodeURIComponent(place.name + " Nashville")}`;
    
    // Create Instagram link for some restaurants
    const instagramLink = Math.random() > 0.3 ? 
      `https://www.instagram.com/${place.name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : null;
    
    return {
      id: place.place_id,
      name: place.name,
      cuisine: cuisine,
      neighborhood: neighborhood,
      priceRange: place.price_level !== undefined ? priceMap[place.price_level] : "$$",
      description: place.vicinity || "A wonderful place to eat in Nashville",
      address: place.vicinity || place.formatted_address,
      imageUrl: place.photos?.length > 0 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyAkMyPslG3eTA9uW33qWHVs0o9zEtJdYp4` 
        : undefined,
      features: place.types?.filter(t => t !== "restaurant" && t !== "food" && t !== "establishment") || [],
      website: websiteLink,
      resyLink: mockResyLink,
      openTableLink: mockOpenTableLink,
      instagramLink: instagramLink
    };
  });
};
