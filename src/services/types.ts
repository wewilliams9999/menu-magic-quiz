
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
 * Maps Google Places API restaurant data to our QuizResult format
 * This will be used when integrating with the actual Google Places API
 */
export const mapGooglePlacesToRestaurants = (places: any[]) => {
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
      "fast_food": "Fast Food",
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
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${place.photos[0].api_key || 'API_KEY_PLACEHOLDER'}` 
        : undefined,
      features: place.types?.filter(t => t !== "restaurant" && t !== "food" && t !== "establishment") || [],
      website: websiteLink,
      resyLink: mockResyLink,
      openTableLink: mockOpenTableLink,
      instagramLink: instagramLink,
      phone: place.formatted_phone_number || null,
      coordinates: place.geometry?.location ? {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      } : undefined
    };
  });
};
